from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import AuditFinding, AuditLog
from app.schemas import FindingCreate, FindingResponse, RemediateRequest
from app.services.detection_service import compute_risk_score, severity_from_score
from app.utils.security import verify_api_key
import uuid

router = APIRouter()

@router.get("/", response_model=list[FindingResponse])
async def list_findings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditFinding).order_by(AuditFinding.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=FindingResponse)
async def create_finding(
    finding: FindingCreate,
    db: AsyncSession = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    risk_score = compute_risk_score(finding.category, finding.filepath, finding.metadata)
    new_finding = AuditFinding(
        id=uuid.uuid4(),
        session_id=finding.session_id,
        repository=finding.repository,
        filepath=finding.filepath,
        category=finding.category,
        severity=severity_from_score(risk_score),
        risk_score=risk_score,
        line_number=finding.line_number,
        masked_snippet=finding.masked_snippet,
        pattern_id=finding.pattern_id,
        meta=finding.metadata
    )
    db.add(new_finding)
    await db.commit()
    await db.refresh(new_finding)
    return new_finding

@router.patch("/{finding_id}/remediate")
async def remediate_finding(
    finding_id: uuid.UUID,
    req: RemediateRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AuditFinding).where(AuditFinding.id == finding_id))
    finding = result.scalar_one_or_none()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    finding.remediated = True
    db.add(
        AuditLog(
            id=uuid.uuid4(),
            action="FINDING_REMEDIATED",
            actor="api",
            target_id=str(finding_id),
            details={"notes": req.notes},
        )
    )
    await db.commit()
    return {"status": "remediated"}
