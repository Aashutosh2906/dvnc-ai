// ── API base URL ──────────────────────────────────────────────────────────────
// During local dev: point to localhost
// In production (GitHub Pages): point to your Render backend URL
const isDev = window.location.hostname === "localhost"
           || window.location.hostname === "127.0.0.1";

export const API_BASE = isDev
  ? "http://localhost:8000/api"
  : "https://dvnc-ai-backend.onrender.com/api";   // ← replace with your Render URL
