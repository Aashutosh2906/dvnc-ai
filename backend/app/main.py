from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import discovery, papers

app = FastAPI(
    title="DVNC.AI",
    description="Sovereign discovery instrument — connectome-native reasoning",
    version="1.0.0",
)

# Allow your GitHub Pages frontend (and localhost for dev)
ALLOWED_ORIGINS = [
    "https://<YOUR_GITHUB_USERNAME>.github.io",   # ← replace
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(discovery.router, prefix="/api")
app.include_router(papers.router,    prefix="/api")


@app.get("/")
def health():
    return {"status": "ok", "service": "DVNC.AI"}
