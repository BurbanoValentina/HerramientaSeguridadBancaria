import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, JSON, Uuid
from app.database import Base

class AuditFinding(Base):
    __tablename__ = "audit_findings"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String, nullable=False)
    user_id = Column(String, nullable=True)
    repository = Column(String, nullable=True)
    filepath = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    line_number = Column(Integer, nullable=True)
    masked_snippet = Column(String, nullable=True)
    pattern_id = Column(String, nullable=True)
    meta = Column("metadata", JSON, nullable=True)
    remediated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DetectionRule(Base):
    __tablename__ = "detection_rules"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    pattern = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action = Column(String, nullable=False)
    actor = Column(String, nullable=True)
    target_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
