# 🎯 CareerVue

> **See your career more clearly.**

CareerVue is a professional resume analysis and LinkedIn optimization platform. Upload a resume, compare it with a target role, understand the gaps, and turn the findings into practical next steps.

<p align="center">
  <strong>Resume analysis</strong> · <strong>Skill matching</strong> · <strong>Career insights</strong> · <strong>LinkedIn optimization</strong>
</p>

---

## ✨ What CareerVue does

<table>
<thead><tr><th>Area</th><th>What you get</th></tr></thead>
<tbody>
<tr><td>📄 Resume analyzer</td><td>Resume parsing, role comparison, skill coverage, score breakdown, and improvement actions</td></tr>
<tr><td>🎯 Skill matching</td><td>Matched skills, missing skills, normalized aliases, and target-role fit</td></tr>
<tr><td>📊 Visual insights</td><td>Resume strength bars, skill-coverage visualization, and optional evidence matching</td></tr>
<tr><td>💼 LinkedIn optimizer</td><td>Headline, About section, keyword suggestions, and ATS feedback</td></tr>
<tr><td>🔐 Accounts</td><td>Signup, login, protected analysis, and SQLite-backed saved reviews</td></tr>
<tr><td>🗂️ Saved reviews</td><td>Review history with user-scoped deletion</td></tr>
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

### Resume review outputs

<table>
<thead><tr><th>Output</th><th>Description</th></tr></thead>
<tbody>
<tr><td><strong>Career fit</strong></td><td>How closely your skills match the target role</td></tr>
<tr><td><strong>Resume strength</strong></td><td>Explainable score out of 100</td></tr>
<tr><td><strong>Matched skills</strong></td><td>Capabilities already represented in your resume</td></tr>
<tr><td><strong>Missing skills</strong></td><td>Role requirements that need attention</td></tr>
<tr><td><strong>Improvement actions</strong></td><td>Practical changes based on measurable gaps</td></tr>
<tr><td><strong>Skill coverage</strong></td><td>Visual comparison of matched and missing requirements</td></tr>
</tbody>
</table>

---

## 🛠️ Technology stack

<table>
<thead><tr><th>Layer</th><th>Technologies</th></tr></thead>
<tbody>
<tr><td>Frontend</td><td>React 18, TypeScript, Vite, Lucide React, CSS</td></tr>
<tr><td>Backend</td><td>Python, FastAPI, Uvicorn, Pydantic</td></tr>
<tr><td>NLP</td><td>spaCy, <code>en_core_web_md</code>, PhraseMatcher, regular expressions</td></tr>
<tr><td>Scoring</td><td>scikit-learn TF-IDF, semantic similarity, weighted scoring</td></tr>
<tr><td>Documents</td><td>PyPDF2, python-docx, python-multipart</td></tr>
<tr><td>Storage</td><td>SQLite</td></tr>
<tr><td>Optional ML</td><td>sentence-transformers and Cross-Encoder reranking</td></tr>
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

<table>
<thead><tr><th>Requirement</th><th>Version or details</th></tr></thead>
<tbody>
<tr><td>Python</td><td><strong>3.8+</strong></td></tr>
<tr><td>Node.js</td><td><strong>18+</strong></td></tr>
<tr><td>npm</td><td>Included with Node.js</td></tr>
<tr><td>Resume</td><td>Text-based PDF, DOC, or DOCX file</td></tr>
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
python -m spacy download en_core_web_md
```

#### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m spacy download en_core_web_md
```

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

<table>
<thead><tr><th>Resource</th><th>URL</th></tr></thead>
<tbody>
<tr><td>CareerVue website</td><td><code>http://127.0.0.1:5173</code></td></tr>
<tr><td>API status</td><td><code>http://127.0.0.1:8000</code></td></tr>
<tr><td>API health</td><td><code>http://127.0.0.1:8000/health</code></td></tr>
<tr><td>Interactive API docs</td><td><code>http://127.0.0.1:8000/docs</code></td></tr>
</tbody>
</table>

---

## 🔐 Configuration

### Backend variables

<table>
<thead><tr><th>Variable</th><th>Default</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>CAREERVUE_DATABASE</code></td><td><code>careervue.db</code></td><td>SQLite database location</td></tr>
<tr><td><code>CAREERVUE_TOKEN_SECRET</code></td><td>Development value</td><td>Signs authentication tokens</td></tr>
<tr><td><code>CAREERVUE_ALLOWED_ORIGINS</code></td><td>Localhost origins</td><td>Configures CORS</td></tr>
<tr><td><code>CAREERVUE_ENABLE_EMBEDDINGS</code></td><td><code>false</code></td><td>Enables local semantic matching</td></tr>
<tr><td><code>CAREERVUE_EMBEDDING_MODEL</code></td><td><code>all-MiniLM-L6-v2</code></td><td>Embedding model</td></tr>
<tr><td><code>CAREERVUE_ENABLE_RERANKER</code></td><td><code>false</code></td><td>Enables optional Cross-Encoder reranking</td></tr>
<tr><td><code>CAREERVUE_RERANKER_MODEL</code></td><td><code>cross-encoder/ms-marco-MiniLM-L-6-v2</code></td><td>Reranker model</td></tr>
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
<thead><tr><th>Component</th><th>Weight</th><th>Measures</th></tr></thead>
<tbody>
<tr><td>Semantic similarity</td><td>30</td><td>Contextual relationship between resume and role</td></tr>
<tr><td>Skill alignment</td><td>25</td><td>Normalized overlap between resume and role skills</td></tr>
<tr><td>Keyword density</td><td>20</td><td>Target-role keyword coverage using TF-IDF</td></tr>
<tr><td>Experience relevance</td><td>15</td><td>Experience signals and action verbs</td></tr>
<tr><td>Formatting</td><td>10</td><td>Presence of common resume sections</td></tr>
<tr><td><strong>Total</strong></td><td><strong>100</strong></td><td>Explainable resume-strength score</td></tr>
</tbody>
</table>

The score is a guidance tool, not an employment decision.

---

## 🤖 Optional local semantic matching

The default analysis works without additional models. To enable local requirement-to-resume evidence:

```powershell
$env:CAREERVUE_ENABLE_EMBEDDINGS = "true"
$env:CAREERVUE_EMBEDDING_MODEL = "all-MiniLM-L6-v2"
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

This feature provides:

<table>
<thead><tr><th>Behavior</th><th>Details</th></tr></thead>
<tbody>
<tr><td>Execution</td><td>Runs locally with an open-source model</td></tr>
<tr><td>Matching</td><td>Matches job requirements to relevant resume evidence</td></tr>
<tr><td>Scoring</td><td>Does not change the default score</td></tr>
<tr><td>Privacy</td><td>Does not send resume content to a hosted AI provider</td></tr>
</tbody>
</table>

For optional reranking:

```powershell
$env:CAREERVUE_ENABLE_RERANKER = "true"
$env:CAREERVUE_RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
```

Reranking improves ambiguous matches but uses additional memory and CPU.

---

## 🔌 API routes

<table>
<thead><tr><th>Method</th><th>Route</th><th>Authentication</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>GET</code></td><td><code>/</code></td><td>No</td><td>API status</td></tr>
<tr><td><code>GET</code></td><td><code>/health</code></td><td>No</td><td>Service and model readiness</td></tr>
<tr><td><code>POST</code></td><td><code>/auth/register</code></td><td>No</td><td>Create an account</td></tr>
<tr><td><code>POST</code></td><td><code>/auth/login</code></td><td>No</td><td>Sign in</td></tr>
<tr><td><code>POST</code></td><td><code>/analyze</code></td><td>Yes</td><td>Analyze a resume against a role</td></tr>
<tr><td><code>POST</code></td><td><code>/linkedin-optimize</code></td><td>Yes</td><td>Generate LinkedIn content</td></tr>
<tr><td><code>GET</code></td><td><code>/analyses</code></td><td>Yes</td><td>List the user’s saved reviews</td></tr>
<tr><td><code>DELETE</code></td><td><code>/analyses/{analysis_id}</code></td><td>Yes</td><td>Delete one owned review</td></tr>
</tbody>
</table>

Protected routes use:

```http
Authorization: Bearer <access_token>
```

---

## 🗃️ Data and security

<table>
<thead><tr><th>Area</th><th>Behavior</th></tr></thead>
<tbody>
<tr><td>Passwords</td><td>Stored as salted PBKDF2-HMAC-SHA256 hashes</td></tr>
<tr><td>Access tokens</td><td>HMAC-SHA256 signed and expire after seven days</td></tr>
<tr><td>Saved reviews</td><td>Filtered by authenticated user ID</td></tr>
<tr><td>Review deletion</td><td>A user can delete only their own saved reviews</td></tr>
<tr><td>Resume uploads</td><td>Limited to 5 MB</td></tr>
<tr><td>Local storage</td><td>SQLite database is created automatically as <code>careervue.db</code></td></tr>
<tr><td>Repository hygiene</td><td>Do not commit credentials, databases, uploaded files, or model caches</td></tr>
</tbody>
</table>

For larger deployments, consider PostgreSQL, HTTPS, rate limiting, database migrations, and a formal data-retention policy.

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
<thead><tr><th>Problem</th><th>Solution</th></tr></thead>
<tbody>
<tr><td>Login or signup fails</td><td>Confirm the API is running and check <code>VITE_API_URL</code></td></tr>
<tr><td>CORS error</td><td>Add both frontend origins to <code>CAREERVUE_ALLOWED_ORIGINS</code></td></tr>
<tr><td>spaCy model missing</td><td>Run <code>python -m spacy download en_core_web_md</code></td></tr>
<tr><td>Empty PDF text</td><td>Use a text-based PDF or preprocess the file with OCR</td></tr>
<tr><td>Saved review will not delete</td><td>Click the trash icon, then click <strong>Confirm</strong></td></tr>
<tr><td>Embeddings unavailable</td><td>Install <code>sentence-transformers</code> or leave the feature disabled</td></tr>
<tr><td>Frontend build fails</td><td>Run <code>npm install</code> inside <code>frontend/</code> and rebuild</td></tr>
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

Use a Python-compatible host such as Railway, Render, or Fly.io:

```bash
uvicorn api:app --host 0.0.0.0 --port $PORT
```

Configure a production token secret, database path, allowed frontend origins, and any optional local model settings.

---

## 🔭 Future improvements

<table>
<thead><tr><th>Area</th><th>Planned improvement</th></tr></thead>
<tbody>
<tr><td>Document processing</td><td>OCR for scanned resumes</td></tr>
<tr><td>Evaluation</td><td>Larger labeled NLP evaluation datasets</td></tr>
<tr><td>Skill taxonomy</td><td>ESCO/O*NET skill taxonomy support</td></tr>
<tr><td>Storage</td><td>PostgreSQL migrations</td></tr>
<tr><td>Reporting</td><td>PDF and structured report exports</td></tr>
<tr><td>Accessibility</td><td>Accessibility automation</td></tr>
<tr><td>Performance</td><td>Background model loading</td></tr>
<tr><td>Content quality</td><td>Grounded rewrite suggestions that cannot invent unsupported facts</td></tr>
</tbody>
</table>

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Made with love ❤️
