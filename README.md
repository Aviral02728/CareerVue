# 🎯 CareerVue

> <strong>See your career more clearly.</strong>

CareerVue is a professional resume analysis and LinkedIn optimization platform. Upload a resume, compare it with a target role, understand the gaps, and turn the findings into practical next steps.

<p align="center">
  <strong>📄 Resume analysis</strong> ·
  <strong>🎯 Skill matching</strong> ·
  <strong>📊 Explainable scoring</strong> ·
  <strong>💼 LinkedIn optimization</strong>
</p>

---

## ✨ Product highlights

<table>
  <thead>
    <tr>
      <th>Area</th>
      <th>What you get</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>📄 Resume analyzer</td>
      <td>PDF/DOCX text extraction, resume statistics, role comparison, and actionable feedback</td>
    </tr>
    <tr>
      <td>🧠 Skill intelligence</td>
      <td>Canonical skill matching, aliases such as `ReactJS → React`, missing-skill detection, and source evidence</td>
    </tr>
    <tr>
      <td>📊 Explainable score</td>
      <td>A score out of 100 with semantic, skill, keyword, experience, and formatting breakdowns</td>
    </tr>
    <tr>
      <td>🔎 Semantic evidence</td>
      <td>Optional local sentence-transformer matching between role requirements and resume text</td>
    </tr>
    <tr>
      <td>💼 LinkedIn optimizer</td>
      <td>A role-aware headline, About section, recommended keywords, and ATS readiness feedback</td>
    </tr>
    <tr>
      <td>🔐 Accounts</td>
      <td>Registration, login, signed bearer tokens, and user-scoped saved reviews</td>
    </tr>
    <tr>
      <td>🗂️ Review history</td>
      <td>Persisted SQLite analyses with confirmation-protected deletion</td>
    </tr>
  </tbody>
</table>

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

### 📦 Analysis output

<table>
  <thead>
    <tr>
      <th>Result</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🎯 Career fit</td>
      <td>Percentage of detected job-description skills represented in the resume</td>
    </tr>
    <tr>
      <td>💯 Resume strength</td>
      <td>Explainable score from 0–100</td>
    </tr>
    <tr>
      <td>✅ Matched skills</td>
      <td>Skills found in both the resume and target role</td>
    </tr>
    <tr>
      <td>⚠️ Missing skills</td>
      <td>Target-role skills that are not represented</td>
    </tr>
    <tr>
      <td>🧾 Skill evidence</td>
      <td>Source text and character spans for detected skills</td>
    </tr>
    <tr>
      <td>📈 Text statistics</td>
      <td>Word count, estimated reading time, and character count</td>
    </tr>
    <tr>
      <td>💡 Recommendations</td>
      <td>Practical improvements based on the score and detected gaps</td>
    </tr>
  </tbody>
</table>

---

## 🛠️ Technology stack

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technologies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🎨 Frontend</td>
      <td>React 18, TypeScript, Vite, Lucide React, CSS</td>
    </tr>
    <tr>
      <td>⚙️ Backend</td>
      <td>Python 3.11.9, FastAPI, Uvicorn, Pydantic</td>
    </tr>
    <tr>
      <td>🧩 NLP</td>
      <td>spaCy, `en_core_web_sm`, PhraseMatcher, regex fallback, and skill aliases</td>
    </tr>
    <tr>
      <td>📐 Scoring</td>
      <td>scikit-learn TF-IDF, cosine similarity, semantic similarity, and weighted scoring</td>
    </tr>
    <tr>
      <td>📄 Documents</td>
      <td>PyPDF2, python-docx, python-multipart</td>
    </tr>
    <tr>
      <td>💼 Content</td>
      <td>`language-tool-python` and rule-based LinkedIn generation</td>
    </tr>
    <tr>
      <td>💾 Storage</td>
      <td>SQLite</td>
    </tr>
    <tr>
      <td>🤖 Optional ML</td>
      <td>sentence-transformers and Cross-Encoder reranking</td>
    </tr>
  </tbody>
</table>

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

The frontend owns presentation and interaction. The backend owns authentication, upload validation, text extraction, skill matching, scoring, LinkedIn generation, and saved-review persistence.

---

## 📁 Project structure

```text
CareerVue/
├── api.py                    # FastAPI application and API routes
├── services.py               # Shared resume and LinkedIn services
├── evaluate_nlp.py           # Skill-matching evaluation script
├── requirements.txt          # Default Python dependencies
├── requirements-spacy.txt    # Optional pinned spaCy model setup
├── requirements-ml.txt       # Optional embedding dependencies
├── runtime.txt               # Deployment Python runtime
├── Procfile                  # Platform start command
├── render.yaml               # Render Blueprint configuration
├── railway.json              # Railway deployment configuration
├── data/
│   └── skills_database.json  # Canonical skills by category
├── evaluation/
│   └── cases.json            # Starter evaluation cases
├── utils/
│   ├── text_extraction.py    # PDF/DOC/DOCX extraction
│   ├── skill_matcher.py      # Skill extraction, aliases, and evidence spans
│   ├── scoring_engine.py     # Resume scoring calculations
│   ├── semantic_matcher.py   # Optional local semantic matching
│   └── linkedin_generator.py # LinkedIn content generation
└── frontend/
    ├── package.json
    └── src/
        ├── App.tsx           # Analyzer, optimizer, auth, and review history
        └── styles.css        # CareerVue design system
```

---

## ✅ Prerequisites

<table>
  <thead>
    <tr>
      <th>Requirement</th>
      <th>Supported setup</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🐍 Python</td>
      <td><strong>3.11.9</strong></td>
    </tr>
    <tr>
      <td>🟢 Node.js</td>
      <td><strong>18+</strong></td>
    </tr>
    <tr>
      <td>📦 Package managers</td>
      <td>`pip` and `npm`</td>
    </tr>
    <tr>
      <td>📄 Resume</td>
      <td>Text-based PDF, DOC, or DOCX</td>
    </tr>
  </tbody>
</table>

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

For optional local embeddings, install `requirements-ml.txt`.

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

Open the website at <strong>http://127.0.0.1:5173</strong>.

<table>
  <thead>
    <tr>
      <th>Resource</th>
      <th>URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🌐 CareerVue website</td>
      <td>`http://127.0.0.1:5173`</td>
    </tr>
    <tr>
      <td>💚 API status</td>
      <td>`http://127.0.0.1:8000`</td>
    </tr>
    <tr>
      <td>🩺 Health check</td>
      <td>`http://127.0.0.1:8000/health`</td>
    </tr>
    <tr>
      <td>📚 Interactive API docs</td>
      <td>`http://127.0.0.1:8000/docs`</td>
    </tr>
  </tbody>
</table>

---

## 🔐 Configuration

### Backend variables

<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Default</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`CAREERVUE_DATABASE`</td>
      <td>`careervue.db`</td>
      <td>SQLite database location</td>
    </tr>
    <tr>
      <td>`CAREERVUE_TOKEN_SECRET`</td>
      <td>Development value</td>
      <td>Signs authentication tokens</td>
    </tr>
    <tr>
      <td>`CAREERVUE_ALLOWED_ORIGINS`</td>
      <td>Localhost origins</td>
      <td>Configures CORS</td>
    </tr>
    <tr>
      <td>`CAREERVUE_SPACY_MODEL`</td>
      <td>`en_core_web_sm`</td>
      <td>spaCy model name</td>
    </tr>
    <tr>
      <td>`CAREERVUE_ENABLE_EMBEDDINGS`</td>
      <td>`false`</td>
      <td>Enables local semantic matching</td>
    </tr>
    <tr>
      <td>`CAREERVUE_EMBEDDING_MODEL`</td>
      <td>`all-MiniLM-L6-v2`</td>
      <td>Embedding model</td>
    </tr>
    <tr>
      <td>`CAREERVUE_ENABLE_RERANKER`</td>
      <td>`false`</td>
      <td>Enables optional Cross-Encoder reranking</td>
    </tr>
    <tr>
      <td>`CAREERVUE_RERANKER_MODEL`</td>
      <td>`cross-encoder/ms-marco-MiniLM-L-6-v2`</td>
      <td>Reranker model</td>
    </tr>
  </tbody>
</table>

### Frontend variable

```text
VITE_API_URL=http://127.0.0.1:8000
```

For production, always replace the development token secret with a long, random value.

---

## 📈 Scoring overview

<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Weight</th>
      <th>Measures</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Semantic similarity</td>
      <td>30</td>
      <td>Contextual relationship between resume and role</td>
    </tr>
    <tr>
      <td>Skill alignment</td>
      <td>25</td>
      <td>Normalized overlap between resume and role skills</td>
    </tr>
    <tr>
      <td>Keyword density</td>
      <td>20</td>
      <td>Target-role keyword coverage using TF-IDF</td>
    </tr>
    <tr>
      <td>Experience relevance</td>
      <td>15</td>
      <td>Experience signals and action verbs</td>
    </tr>
    <tr>
      <td>Formatting</td>
      <td>10</td>
      <td>Presence of common resume sections</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>100</strong></td>
      <td>Explainable resume-strength score</td>
    </tr>
  </tbody>
</table>

The score is a guidance tool, not an employment decision. If spaCy word vectors are unavailable, semantic similarity falls back to TF-IDF cosine similarity.

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

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Route</th>
      <th>Authentication</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`GET`</td>
      <td>`/`</td>
      <td>No</td>
      <td>API status</td>
    </tr>
    <tr>
      <td>`GET`</td>
      <td>`/health`</td>
      <td>No</td>
      <td>Service and model readiness</td>
    </tr>
    <tr>
      <td>`POST`</td>
      <td>`/auth/register`</td>
      <td>No</td>
      <td>Create an account</td>
    </tr>
    <tr>
      <td>`POST`</td>
      <td>`/auth/login`</td>
      <td>No</td>
      <td>Sign in</td>
    </tr>
    <tr>
      <td>`POST`</td>
      <td>`/analyze`</td>
      <td>Yes</td>
      <td>Analyze a resume against a role</td>
    </tr>
    <tr>
      <td>`POST`</td>
      <td>`/linkedin-optimize`</td>
      <td>Yes</td>
      <td>Generate LinkedIn content</td>
    </tr>
    <tr>
      <td>`GET`</td>
      <td>`/analyses`</td>
      <td>Yes</td>
      <td>List the user’s saved reviews</td>
    </tr>
    <tr>
      <td>`DELETE`</td>
      <td>`/analyses/{analysis_id}`</td>
      <td>Yes</td>
      <td>Delete one owned review</td>
    </tr>
  </tbody>
</table>

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
- Do not commit credentials, databases, uploaded files, model caches, or debug logs.

For larger deployments, consider PostgreSQL, HTTPS, rate limiting, database migrations, and a formal data-retention policy.

### Render deployment

The repository includes `render.yaml` and `runtime.txt`. In Render, choose
<strong>New Blueprint</strong> and select the repository. Render will use Python <strong>3.11.9</strong>,
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

### Railway deployment

The repository includes `railway.json`. Railway starts the API with the
configured Uvicorn command and downloads the spaCy model during deployment.

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

<table>
  <thead>
    <tr>
      <th>Problem</th>
      <th>Solution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Login or signup fails</td>
      <td>Confirm the API is running and check `VITE_API_URL`</td>
    </tr>
    <tr>
      <td>CORS error</td>
      <td>Add both frontend origins to `CAREERVUE_ALLOWED_ORIGINS`</td>
    </tr>
    <tr>
      <td>Optional spaCy model missing</td>
      <td>Install `requirements-spacy.txt`, or use the built-in regex/TF-IDF fallback</td>
    </tr>
    <tr>
      <td>Empty PDF text</td>
      <td>Use a text-based PDF or preprocess the file with OCR</td>
    </tr>
    <tr>
      <td>Saved review will not delete</td>
      <td>Click the trash icon, then click <strong>Confirm</strong></td>
    </tr>
    <tr>
      <td>Embeddings unavailable</td>
      <td>Install `sentence-transformers` or leave the feature disabled</td>
    </tr>
    <tr>
      <td>Frontend build fails</td>
      <td>Run `npm install` inside `frontend/` and rebuild</td>
    </tr>
  </tbody>
</table>

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

This project is licensed under the [MIT License](./LICENSE).

---

<strong>CareerVue</strong> — See your career more clearly. 🚀

Made with ❤️ for better career decisions.
