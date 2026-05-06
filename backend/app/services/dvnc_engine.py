"""
DVNC Engine wrapper.
Place your original dvnc_engine.py logic here,
or keep it as a separate file and import from it.
This file re-exports everything the routers need.
"""

# ── Copy your dvnc_engine logic here ──────────────────────────────────────────
# If you have a standalone dvnc_engine.py, just do:
#   from dvnc_engine import run_discovery
# and add the connectome builder below.

NODES = [
    {"id":"seed",    "label":"Seed Query",           "group":"core",      "x":10,  "y":0,   "z":0},
    {"id":"bio",     "label":"Biomaterials",          "group":"domain",    "x":24,  "y":12,  "z":-8},
    {"id":"card",    "label":"Cardiac Repair",        "group":"domain",    "x":38,  "y":3,   "z":14},
    {"id":"nano",    "label":"Nanostructure",         "group":"bridge",    "x":24,  "y":-18, "z":16},
    {"id":"selfasm", "label":"Self-Assembly",         "group":"bridge",    "x":40,  "y":-16, "z":-16},
    {"id":"electro", "label":"Electro-signalling",    "group":"mechanism", "x":58,  "y":10,  "z":-10},
    {"id":"immune",  "label":"Immune Modulation",     "group":"mechanism", "x":64,  "y":-8,  "z":10},
    {"id":"trial",   "label":"Validation Path",       "group":"outcome",   "x":80,  "y":0,   "z":0},
    {"id":"alt1",    "label":"Piezoelectric Scaffold","group":"candidate", "x":56,  "y":26,  "z":14},
    {"id":"alt2",    "label":"Peptide Mesh",          "group":"candidate", "x":54,  "y":-27, "z":-14},
]

EDGES = [
    ("seed","bio"),("seed","nano"),("bio","card"),("nano","selfasm"),
    ("selfasm","electro"),("card","immune"),("electro","trial"),("immune","trial"),
    ("card","alt1"),("selfasm","alt2"),("alt1","trial"),("alt2","trial"),
]

DEFAULT_PATH = ["seed","nano","selfasm","electro","trial"]


def build_connectome_html(path_ids):
    active = set(path_ids)
    node_map = {n["id"]: n for n in NODES}
    path_pairs = set()
    for i in range(len(path_ids) - 1):
        path_pairs.add((path_ids[i], path_ids[i+1]))
        path_pairs.add((path_ids[i+1], path_ids[i]))
    lines, alines, nels = [], [], []
    for a, b in EDGES:
        na, nb = node_map[a], node_map[b]
        x1, y1 = na["x"]*8+80, na["y"]*6+280
        x2, y2 = nb["x"]*8+80, nb["y"]*6+280
        if (a, b) in path_pairs:
            alines.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#1a1a2e" stroke-width="2.5" stroke-opacity="0.9"/>')
        else:
            lines.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#1a1a2e" stroke-width="1" stroke-opacity="0.15"/>')
    for n in NODES:
        cx, cy = n["x"]*8+80, n["y"]*6+280
        ia = n["id"] in active
        r = 10 if n["group"]=="core" else (8 if n["group"]=="outcome" else 6)
        fill   = "#1a1a2e" if ia else "none"
        stroke = "#1a1a2e" if ia else "#c0bfbe"
        lc     = "#1a1a2e" if ia else "#b0afae"
        nels.append(
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{"2" if ia else "1.2"}"/>' +
            f'<text x="{cx}" y="{cy+r+10}" text-anchor="middle" font-size="9" fill="{lc}" font-family="Inter,sans-serif">{n["label"]}</text>'
        )
    els = "\n".join(lines + alines + nels)
    return (
        '<div style="width:100%;overflow-x:auto;">' +
        '<svg viewBox="0 40 840 420" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">' +
        els + '</svg></div>'
    )


def run_discovery(query: str, model_name: str) -> dict:
    """
    Import and call your actual dvnc_engine here.
    If dvnc_engine.py is in the same folder:
        from app.services.actual_engine import run_discovery as _run
        return _run(query, model_name)
    """
    # ── DEMO FALLBACK (replace with real engine) ──────────────────────────────
    return {
        "model_used": model_name,
        "summary": f"Analysing: {query}. Activating 7-agent discovery stack.",
        "primary_hypothesis": (
            "Mechano-electric scaffolds encoding cardiac strain as micro-current signals "
            "can guide self-assembling peptide meshes toward targeted myocardial regeneration."
        ),
        "reasoning": [
            {"step":1,"tag":"input",     "summary":"Query normalised; anomalous healing signal extracted."},
            {"step":2,"tag":"graph",     "summary":"Distant bridges surfaced: piezoelectric ↔ ion-channel entrainment."},
            {"step":3,"tag":"evidence",  "summary":"12 corroborating papers; 3 counter-signals flagged."},
            {"step":4,"tag":"analogy",   "summary":"Bone piezoelectricity → cardiac scaffolding mechanism mapped."},
            {"step":5,"tag":"compose",   "summary":"Lead + 2 alternative hypotheses generated."},
            {"step":6,"tag":"critique",  "summary":"Power density and fibrosis coupling risk identified."},
            {"step":7,"tag":"experiment","summary":"3-stage validation programme designed."},
        ],
        "graph": {"active_path": DEFAULT_PATH},
        "cards": [
            {"agent":"Hypothesis Composer","score":92,"novelty":"High",
             "title":"Piezoelectric Scaffold Cascade",
             "front":"Use mechano-electric scaffolds to convert cardiac strain into micro-current signalling.",
             "back":"Path: anomalous signal → piezoelectric analog → ion-channel entrainment → tissue regen. Risk: power density."},
            {"agent":"Analogy Engine","score":88,"novelty":"High",
             "title":"Peptide Self-Assembly Mesh",
             "front":"Deploy dynamic peptide meshes that self-assemble around damaged myocardium.",
             "back":"Path: self-assembly → local immune choreography → regenerative substrate. Risk: degradation timing."},
            {"agent":"Adversarial Critic","score":85,"novelty":"Medium-High",
             "title":"Immune-Tuned Conductive Hydrogel",
             "front":"Blend conductivity with macrophage-state modulation to reduce scarring.",
             "back":"Path: inflammation mismatch → conductive medium → macrophage polarization. Risk: biocompatibility."},
        ],
        "metrics": {
            "Novelty": 93,
            "Mechanistic Clarity": 89,
            "Experimental Tractability": 82,
            "Cross-Domain Distance": 91,
        },
    }
