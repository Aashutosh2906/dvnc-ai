import urllib.parse
import xml.etree.ElementTree as ET
from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter(tags=["papers"])


class PaperRequest(BaseModel):
    query: str
    max_results: int = 6


@router.post("/papers")
def search_papers(req: PaperRequest):
    try:
        q = urllib.parse.quote(req.query)
        url = f"https://export.arxiv.org/api/query?search_query=all:{q}&start=0&max_results={req.max_results}"
        r = requests.get(url, timeout=10)
        root = ET.fromstring(r.text)
        ns = {"a": "http://www.w3.org/2005/Atom"}
        papers = []
        for entry in root.findall("a:entry", ns):
            title   = entry.find("a:title",   ns).text.strip().replace("\n", " ")
            link    = entry.find("a:id",       ns).text.strip()
            summary = (entry.find("a:summary", ns).text or "").strip()[:200]
            papers.append({"title": title, "link": link, "summary": summary})
        return {"papers": papers}
    except Exception as e:
        return {"papers": [], "error": str(e)}
