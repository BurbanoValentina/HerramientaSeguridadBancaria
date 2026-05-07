CATEGORY_WEIGHTS = {
    "pii": 0.9,
    "credentials": 1.0,
    "financial": 0.95,
    "payment_card": 1.0,
    "health": 0.85,
}

SEVERITY_THRESHOLDS = {
    "critical": 0.85,
    "high": 0.65,
    "medium": 0.40,
    "low": 0.0,
}

def compute_risk_score(category: str, filepath: str, metadata: dict = None) -> float:
    base = CATEGORY_WEIGHTS.get(category, 0.5)
    if filepath and any(p in filepath for p in ["prod", "live", "master", "main"]):
        base = min(base + 0.05, 1.0)
    return round(base, 4)

def severity_from_score(score: float) -> str:
    for severity, threshold in SEVERITY_THRESHOLDS.items():
        if score >= threshold:
            return severity
    return "low"
