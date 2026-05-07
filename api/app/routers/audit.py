from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import AuditLog

router = APIRouter()

@router.get("/")
async def list_audit_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(200))
    logs = result.scalars().all()
    return [{"id": str(l.id), "action": l.action, "actor": l.actor, "created_at": l.created_at.isoformat()} for l in logs]
