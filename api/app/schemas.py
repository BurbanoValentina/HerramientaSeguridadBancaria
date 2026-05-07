from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class FindingCreate(BaseModel):
    session_id: str
    repository: Optional[str] = None
    filepath: str
    category: str
    line_number: Optional[int] = None
    masked_snippet: Optional[str] = None
    pattern_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class FindingResponse(BaseModel):
    id: uuid.UUID
    session_id: str
    filepath: str
    category: str
    severity: str
    risk_score: float
    masked_snippet: Optional[str]
    remediated: bool
    created_at: datetime
    class Config:
        from_attributes = True

class RemediateRequest(BaseModel):
    """Cuerpo opcional; el id del hallazgo viene en la ruta."""
    notes: Optional[str] = None

class RuleCreate(BaseModel):
    name: str
    category: str
    pattern: str
    severity: str

class RuleResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: str
    pattern: str
    severity: str
    enabled: bool
    class Config:
        from_attributes = True
