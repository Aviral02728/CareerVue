# CareerVue

> **See your career more clearly.**

CareerVue is a professional resume analysis and LinkedIn optimization platform. Upload a resume, compare it with a target role, understand the gaps, and turn the findings into practical next steps.

<p align="center">
  <strong>Resume analysis</strong> · <strong>Skill matching</strong> · <strong>Career insights</strong> · <strong>LinkedIn optimization</strong>
</p>

---

## ✨ What CareerVue does

| Area | What you get |
|---|---|
| 📄 Resume analyzer | Resume parsing, role comparison, skill coverage, score breakdown, and improvement actions |
| 🎯 Skill matching | Matched skills, missing skills, normalized aliases, and target-role fit |
| 📊 Visual insights | Resume strength bars, skill-coverage visualization, and optional evidence matching |
| 💼 LinkedIn optimizer | Headline, About section, keyword suggestions, and ATS feedback |
| 🔐 Accounts | Signup, login, protected analysis, and SQLite-backed saved reviews |
| 🗂️ Saved reviews | Review history with user-scoped deletion |

---

## 🧭 How it works

```text
Create an account
       ↓
Upload your resume + paste a job description
       ↓
CareerVue extracts text, skills, keywords, and experience signals
       ↓
Review scores, gaps, recommendations, and visual insights
       ↓
Generate LinkedIn content and save the review
```

### Resume review outputs

- **Career fit** — how closely your skills match the target role
- **Resume strength** — explainable score out of 100
- **Matched skills** — capabilities already represented in your resume
- **Missing skills** — role requirements that need attention
- **Improvement actions** — practical changes based on measurable gaps
- **Skill coverage** — visual comparison of matched and missing requirements

---

## 🛠️ Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Lucide React, CSS |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| NLP | spaCy, `en_core_web_sm`, PhraseMatcher, regular expressions |
| Scoring | scikit-learn TF-IDF, semantic similarity, weighted scoring |
| Documents | PyPDF2, python-docx, python-multipart |
| Storage | SQLite |
| Optional ML | sentence-transformers and Cross-Encoder reranking |

---

## 🏗️ Architecture

```text
React + TypeScript frontend
            │
            ▼
       FastAPI API
            │
            ▼
     Shared Python services
      ┌─────┼─────┬──────────────┐
      ▼     ▼     ▼              ▼
   Text   Skills  Scoring   LinkedIn
 extraction matcher engine  generator
            │
            ▼
          SQLite
```

The frontend handles presentation and interaction. The backend owns authentication, file validation, NLP processing, scoring, LinkedIn generation, and saved-review persistence.

---

## 📁 Project structure

```text
CareerVue/
├── api.py                    # FastAPI application and API routes
├── services.py               # Shared resume and LinkedIn services
├── evaluate_nlp.py           # Skill-matching evaluation script
├── requirements.txt          # Python dependencies
├── data/
│   └── skills_database.json  # Canonical skills by category
├── evaluation/
│   └── cases.json            # Starter evaluation cases
├── utils/
│   ├── text_extraction.py    # PDF/DOC/DOCX extraction
│   ├── skill_matcher.py      # Skill extraction and normalization
│   ├── scoring_engine.py     # Resume scoring calculations
│   ├── semantic_matcher.py   # Optional local semantic matching
│   └── linkedin_generator.py # LinkedIn content generation
└── frontend/
    ├── package.json
    └── src/
        ├── App.tsx           # Main React application
        └── styles.css        # CareerVue design system
```

---

## ✅ Prerequisites

- Python **3.11.9**
- Node.js **18+**
- npm
- A text-based PDF, DOC, or DOCX resume

> Scanned image-only PDFs may require OCR before analysis.

---

## 🚀 Installation

### 1. Set up the backend

#### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

For the optional spaCy-enhanced local setup, install `requirements-spacy.txt`.

#### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

For the optional spaCy-enhanced local setup, install `requirements-spacy.txt`.

### 2. Set up the frontend

```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Run locally

Open two terminals from the project root.

### Terminal 1 — API

```bash
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2 — Website

```bash
cd frontend
npm run dev
```

Open the website at **http://127.0.0.1:5173**.

| Resource | URL |
|---|---|
| CareerVue website | `http://127.0.0.1:5173` |
| API status | `http://127.0.0.1:8000` |
| API health | `http://127.0.0.1:8000/health` |
| Interactive API docs | `http://127.0.0.1:8000/docs` |

---

## 🔐 Configuration

### Backend variables

| Variable | Default | Purpose |
|---|---|---|
| `CAREERVUE_DATABASE` | `careervue.db` | SQLite database location |
| `CAREERVUE_TOKEN_SECRET` | Development value | Signs authentication tokens |
| `CAREERVUE_ALLOWED_ORIGINS` | Localhost origins | Configures CORS |
| `CAREERVUE_ENABLE_EMBEDDINGS` | `false` | Enables local semantic matching |
| `CAREERVUE_EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | Embedding model |
| `CAREERVUE_ENABLE_RERANKER` | `false` | Enables optional Cross-Encoder reranking |
| `CAREERVUE_RERANKER_MODEL` | `cross-encoder/ms-marco-MiniLM-L-6-v2` | Reranker model |

### Frontend variable

```text
VITE_API_URL=http://127.0.0.1:8000
```

For production, always replace the development token secret with a long, random value.

---

## 📈 Scoring overview

| Component | Weight | Measures |
|---|---:|---|
| Semantic similarity | 30 | Contextual relationship between resume and role |
| Skill alignment | 25 | Normalized overlap between resume and role skills |
| Keyword density | 20 | Target-role keyword coverage using TF-IDF |
| Experience relevance | 15 | Experience signals and action verbs |
| Formatting | 10 | Presence of common resume sections |
| **Total** | **100** | Explainable resume-strength score |

The score is a guidance tool, not an employment decision.

---

## 🤖 Optional local semantic matching

The default analysis works without additional models. To enable local requirement-to-resume evidence:

```powershell
$env:CAREERVUE_ENABLE_EMBEDDINGS = "true"
$env:CAREERVUE_EMBEDDING_MODEL = "all-MiniLM-L6-v2"
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

This feature:

- Runs locally with an open-source model.
- Matches job requirements to relevant resume evidence.
- Does not change the default score.
- Does not send resume content to a hosted AI provider.

For optional reranking:

```powershell
$env:CAREERVUE_ENABLE_RERANKER = "true"
$env:CAREERVUE_RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
```

Reranking improves ambiguous matches but uses additional memory and CPU.

---

## 🔌 API routes

| Method | Route | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/` | No | API status |
| `GET` | `/health` | No | Service and model readiness |
| `POST` | `/auth/register` | No | Create an account |
| `POST` | `/auth/login` | No | Sign in |
| `POST` | `/analyze` | Yes | Analyze a resume against a role |
| `POST` | `/linkedin-optimize` | Yes | Generate LinkedIn content |
| `GET` | `/analyses` | Yes | List the user’s saved reviews |
| `DELETE` | `/analyses/{analysis_id}` | Yes | Delete one owned review |

Protected routes use:

```http
Authorization: Bearer <access_token>
```

---

## 🗃️ Data and security

- Passwords are stored as salted PBKDF2-HMAC-SHA256 hashes.
- Access tokens are HMAC-SHA256 signed and expire after seven days.
- Saved reviews are filtered by authenticated user ID.
- A user can delete only their own saved reviews.
- Resume uploads are limited to 5 MB.
- Local SQLite storage is created automatically as `careervue.db`.
- Do not commit credentials, databases, uploaded files, or model caches.

For larger deployments, consider PostgreSQL, HTTPS, rate limiting, database migrations, and a formal data-retention policy.

### Render deployment

The repository includes `render.yaml` and `runtime.txt`. In Render, choose
**New Blueprint** and select the repository. Render will use Python **3.11.9**,
the included build command, start command, and `/health` check. Pinning this
runtime prevents Python 3.14 from forcing spaCy to compile from source. For a
manually created service,
use:

```text
Build command: pip install --upgrade pip && pip install -r requirements.txt
Start command: uvicorn api:app --host 0.0.0.0 --port $PORT
Health check path: /health
```

Keep `sentence-transformers` out of the default deployment. It is listed in
`requirements-ml.txt` because the embedding feature is optional and its large
model dependencies can cause unnecessary build failures on small instances.

---

## 🧪 Validation

### Build the frontend

```bash
cd frontend
npm run build
```

### Compile backend modules

```powershell
python -m py_compile api.py services.py evaluate_nlp.py utils\semantic_matcher.py utils\skill_matcher.py utils\scoring_engine.py
```

### Run the NLP benchmark

```bash
python evaluate_nlp.py
```

The benchmark reports precision, recall, and F1 for the starter skill-matching cases.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| Login or signup fails | Confirm the API is running and check `VITE_API_URL` |
| CORS error | Add both frontend origins to `CAREERVUE_ALLOWED_ORIGINS` |
| Optional spaCy model missing | Install `requirements-spacy.txt`, or use the built-in regex/TF-IDF fallback |
| Empty PDF text | Use a text-based PDF or preprocess the file with OCR |
| Saved review will not delete | Click the trash icon, then click **Confirm** |
| Embeddings unavailable | Install `sentence-transformers` or leave the feature disabled |
| Frontend build fails | Run `npm install` inside `frontend/` and rebuild |

---

## 🌍 Deployment

### Frontend

Build the static frontend:

```bash
cd frontend
npm run build
```

Deploy `frontend/dist` to Vercel, Netlify, or another static host and set:

```text
VITE_API_URL=https://your-api.example.com
```

### Backend

Use a persistent Python-compatible host such as Railway, Render, or Fly.io:

```bash
uvicorn api:app --host 0.0.0.0 --port $PORT
```

Configure a production token secret, database path, allowed frontend origins, and any optional local model settings.

Vercel can host this FastAPI app as a Python Function, but it is not the
recommended backend host for the current version. Vercel functions have
ephemeral filesystems, so SQLite history is not durable, and request payload
limits can conflict with resume uploads. Use Vercel for the frontend and a
persistent backend host for the API unless you migrate storage to a managed
database and object storage.

---

## 🔭 Future improvements

- OCR for scanned resumes
- Larger labeled NLP evaluation datasets
- ESCO/O*NET skill taxonomy support
- PostgreSQL migrations
- PDF and structured report exports
- Accessibility automation
- Background model loading
- Grounded rewrite suggestions that cannot invent unsupported facts

---

## 📄 License

No license file is currently included. Add an appropriate license before public distribution.

---

**CareerVue** — See your career more clearly.
