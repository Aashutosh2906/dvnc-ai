# DVNC.AI

> Sovereign discovery instrument — connectome-native reasoning

## Repo Layout

```
dvnc-ai/
├── backend/              ← FastAPI (Python)
│   ├── app/
│   │   ├── main.py       ← FastAPI entry-point + CORS
│   │   ├── core/
│   │   │   └── config.py ← env vars via pydantic-settings
│   │   ├── routers/
│   │   │   ├── discovery.py ← POST /api/discover
│   │   │   └── papers.py    ← POST /api/papers
│   │   └── services/
│   │       └── dvnc_engine.py ← 7-agent pipeline (paste your engine here)
│   ├── requirements.txt
│   ├── render.yaml       ← one-click Render deploy config
│   └── .env.example
│
├── frontend/             ← Vanilla HTML + ES modules (no build step)
│   ├── index.html        ← full app UI
│   └── src/
│       ├── config.js     ← API_BASE (auto-switches dev ↔ prod)
│       ├── api.js        ← fetch helpers
│       └── main.js       ← UI logic
│
└── .github/
    └── workflows/
        └── deploy-frontend.yml ← auto-deploy frontend to GitHub Pages
```

## Local Development

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in ANTHROPIC_API_KEY
uvicorn app.main:app --reload --port 8000
# API docs → http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
# Open with any static server (Live Server extension, or:)
python -m http.server 5500
# → http://localhost:5500
```

## Deployment

### Step 1 — Backend on Render (free tier)
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Render auto-reads `render.yaml` — just add `ANTHROPIC_API_KEY` in the Environment tab
5. Copy the live URL (e.g. `https://dvnc-ai-backend.onrender.com`)

### Step 2 — Frontend on GitHub Pages
1. In `frontend/src/config.js`, replace the Render URL placeholder with your real URL
2. Push → GitHub Actions auto-deploys via `.github/workflows/deploy-frontend.yml`
3. In your repo: **Settings → Pages → Source: GitHub Actions**
4. In `backend/app/main.py`, add your GitHub Pages URL to `ALLOWED_ORIGINS`

### Step 3 — Your real engine
Paste your `dvnc_engine-4.py` logic into `backend/app/services/dvnc_engine.py`.
The demo fallback in that file keeps the app functional without an API key.
