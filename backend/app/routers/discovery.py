from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import get_settings
from app.services.dvnc_engine import run_discovery, build_connectome_html, DEFAULT_PATH

router = APIRouter(tags=["discovery"])


class DiscoveryRequest(BaseModel):
    query: str
    model_name: str = "DVNC Sovereign"


@router.post("/discover")
def discover(req: DiscoveryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    try:
        result = run_discovery(req.query, req.model_name)
        path = result.get("graph", {}).get("active_path", DEFAULT_PATH)
        result["connectome_html"] = build_connectome_html(path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
