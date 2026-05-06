import { API_BASE } from "./config.js";

export async function runDiscovery(query, modelName) {
  const res = await fetch(`${API_BASE}/discover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, model_name: modelName }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function searchPapers(query, maxResults = 6) {
  const res = await fetch(`${API_BASE}/papers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, max_results: maxResults }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
