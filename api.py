"""CareerVue API for resume analysis, LinkedIn optimization, and history."""

import hashlib
import hmac
import os
import secrets
import sqlite3
import time
from typing import Any, Dict, Optional

import uvicorn
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services import analyze_resume, optimize_linkedin
from utils.skill_matcher import initialize_skill_matcher

DATABASE_PATH = os.getenv("CAREERVUE_DATABASE", "careervue.db")
TOKEN_SECRET = os.getenv("CAREERVUE_TOKEN_SECRET", "change-this-development-secret")
MAX_UPLOAD_BYTES = 5 * 1024 * 1024

app = FastAPI(
    title="CareerVue API",
    description="Resume analysis and LinkedIn optimization API",
    version="2.0.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CAREERVUE_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

nlp = None
matcher = None
skills_db = None


class RegisterRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(RegisterRequest):
    pass


def get_db() -> sqlite3.Connection:
    db = sqlite3.connect(DATABASE_PATH)
    db.row_factory = sqlite3.Row
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at INTEGER NOT NULL
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            job_description TEXT NOT NULL,
            result_json TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """
    )
    db.commit()
    return db


def hash_password(password: str, salt: Optional[bytes] = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return f"{salt.hex()}:{digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split(":", 1)
        candidate = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt_hex), 120_000
        )
        return hmac.compare_digest(candidate.hex(), digest_hex)
    except ValueError:
        return False


def create_token(user_id: int) -> str:
    payload = f"{user_id}:{int(time.time())}"
    signature = hmac.new(
        TOKEN_SECRET.encode(), payload.encode(), hashlib.sha256
    ).hexdigest()
    return f"{payload}:{signature}"


def current_user(authorization: Optional[str] = None) -> sqlite3.Row:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required.")
    token = authorization[7:]
    parts = token.split(":")
    if len(parts) != 3:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
    user_id, issued_at, signature = parts
    payload = f"{user_id}:{issued_at}"
    expected = hmac.new(
        TOKEN_SECRET.encode(), payload.encode(), hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
    try:
        if int(time.time()) - int(issued_at) > 60 * 60 * 24 * 7:
            raise HTTPException(status_code=401, detail="Authentication token expired.")
        numeric_id = int(user_id)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid authentication token.") from exc
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE id = ?", (numeric_id,)).fetchone()
    db.close()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found.")
    return user


@app.on_event("startup")
async def startup_event() -> None:
    global nlp, matcher, skills_db
    nlp, matcher, skills_db = initialize_skill_matcher()
    db = get_db()
    db.close()


@app.get("/")
def read_root() -> Dict[str, str]:
    return {"status": "online", "name": "CareerVue API", "version": "2.0.0"}


@app.get("/health")
def health() -> Dict[str, str]:
    return {
        "status": "ok",
        "models": "ready" if nlp is not None else "loading",
        "embeddings": "enabled"
        if os.getenv("CAREERVUE_ENABLE_EMBEDDINGS", "false").lower()
        in {"1", "true", "yes"}
        else "disabled",
    }


@app.post("/auth/register")
def register(payload: RegisterRequest) -> Dict[str, str]:
    email = payload.email.strip().lower()
    db = get_db()
    try:
        cursor = db.execute(
            "INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)",
            (email, hash_password(payload.password), int(time.time())),
        )
        db.commit()
    except sqlite3.IntegrityError as exc:
        raise HTTPException(status_code=409, detail="Email is already registered.") from exc
    finally:
        db.close()
    return {"access_token": create_token(cursor.lastrowid), "token_type": "bearer"}


@app.post("/auth/login")
def login(payload: LoginRequest) -> Dict[str, str]:
    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE email = ?", (payload.email.strip().lower(),)
    ).fetchone()
    db.close()
    if user is None or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"access_token": create_token(user["id"]), "token_type": "bearer"}


@app.post("/analyze")
async def analyze_authenticated(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    authorization: Optional[str] = Header(default=None),
) -> Dict[str, Any]:
    user = current_user(authorization)
    content = await resume_file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Resume file must be 5 MB or smaller.")
    try:
        result = analyze_resume(content, resume_file.filename or "resume", job_description, matcher, nlp)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    db = get_db()
    import json
    cursor = db.execute(
        "INSERT INTO analyses (user_id, filename, job_description, result_json, created_at) VALUES (?, ?, ?, ?, ?)",
        (user["id"], result["filename"], job_description.strip(), json.dumps(result), int(time.time())),
    )
    db.commit()
    result["analysis_id"] = cursor.lastrowid
    db.close()
    return result


@app.post("/linkedin-optimize")
async def linkedin_endpoint(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    authorization: Optional[str] = Header(default=None),
) -> Dict[str, Any]:
    current_user(authorization)
    content = await resume_file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Resume file must be 5 MB or smaller.")
    try:
        return optimize_linkedin(
            content, resume_file.filename or "resume", job_description, matcher, nlp
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/analyses")
def list_analyses(authorization: Optional[str] = Header(default=None)) -> list[Dict[str, Any]]:
    user = current_user(authorization)
    db = get_db()
    rows = db.execute(
        "SELECT id, filename, created_at, result_json FROM analyses WHERE user_id = ? ORDER BY created_at DESC",
        (user["id"],),
    ).fetchall()
    db.close()
    import json
    return [
        {
            "id": row["id"],
            "filename": row["filename"],
            "created_at": row["created_at"],
            "result": json.loads(row["result_json"]),
        }
        for row in rows
    ]


@app.delete("/analyses/{analysis_id}")
def delete_analysis(
    analysis_id: int, authorization: Optional[str] = Header(default=None)
) -> Dict[str, bool]:
    user = current_user(authorization)
    db = get_db()
    cursor = db.execute(
        "DELETE FROM analyses WHERE id = ? AND user_id = ?",
        (analysis_id, user["id"]),
    )
    db.commit()
    db.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return {"deleted": True}


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
