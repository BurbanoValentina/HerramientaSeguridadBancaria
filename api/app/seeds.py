"""Datos iniciales para desarrollo local (sin datos sensibles reales)."""
from __future__ import annotations

import uuid

from sqlalchemy import func, select

from app.database import AsyncSessionLocal
from app.models import AuditFinding, AuditLog, DetectionRule
from app.services.detection_service import compute_risk_score, severity_from_score

DEFAULT_RULES: list[tuple[str, str, str, str]] = [
    ("Visa Card", "payment_card", r"4[0-9]{12}(?:[0-9]{3})?", "critical"),
    ("Mastercard", "payment_card", r"5[1-5][0-9]{14}", "critical"),
    ("SSN", "pii", r"\d{3}-\d{2}-\d{4}", "critical"),
    ("IBAN", "financial", r"[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}", "high"),
    ("AWS Key", "credentials", r"AKIA[0-9A-Z]{16}", "critical"),
    ("Email", "pii", r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}", "medium"),
]

DEMO_FINDINGS: list[dict] = [
    {
        "session_id": "seed-session",
        "repository": "demo-payments",
        "filepath": "services/legacy/payment_adapter.py",
        "category": "payment_card",
        "line_number": 42,
        "masked_snippet": "token=****4242 (PAN enmascarado)",
        "pattern_id": "visa",
    },
    {
        "session_id": "seed-session",
        "repository": "demo-payments",
        "filepath": "config/prod/main.yaml",
        "category": "credentials",
        "line_number": 12,
        "masked_snippet": "AWS_ACCESS_KEY_ID=AKIA************",
        "pattern_id": "aws_key",
    },
    {
        "session_id": "seed-session",
        "repository": "demo-payments",
        "filepath": "src/utils/customer.ts",
        "category": "pii",
        "line_number": 88,
        "masked_snippet": "ssn: ***-**-****",
        "pattern_id": "ssn",
    },
]


async def seed_if_empty() -> None:
    async with AsyncSessionLocal() as db:
        n_rules = await db.scalar(select(func.count()).select_from(DetectionRule))
        if n_rules == 0:
            for name, category, pattern, severity in DEFAULT_RULES:
                db.add(
                    DetectionRule(
                        id=uuid.uuid4(),
                        name=name,
                        category=category,
                        pattern=pattern,
                        severity=severity,
                        enabled=True,
                    )
                )
            await db.commit()

        n_findings = await db.scalar(select(func.count()).select_from(AuditFinding))
        if n_findings == 0:
            for row in DEMO_FINDINGS:
                risk = compute_risk_score(row["category"], row["filepath"], None)
                db.add(
                    AuditFinding(
                        id=uuid.uuid4(),
                        session_id=row["session_id"],
                        repository=row["repository"],
                        filepath=row["filepath"],
                        category=row["category"],
                        severity=severity_from_score(risk),
                        risk_score=risk,
                        line_number=row["line_number"],
                        masked_snippet=row["masked_snippet"],
                        pattern_id=row["pattern_id"],
                        remediated=False,
                    )
                )
            await db.commit()

        n_logs = await db.scalar(select(func.count()).select_from(AuditLog))
        if n_logs == 0:
            db.add(
                AuditLog(
                    id=uuid.uuid4(),
                    action="SYSTEM_SEED",
                    actor="system",
                    target_id=None,
                    details={"message": "Base de datos inicializada con datos de demostración"},
                )
            )
            await db.commit()
