from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from app.config import settings
import hashlib

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: str | None = Security(api_key_header)):
    # Dev-friendly behavior: if no API key hash is configured, don't block requests.
    if not settings.API_KEY_HASH:
        return api_key or ""

    if not api_key:
        raise HTTPException(status_code=403, detail="Missing API key")

    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    if key_hash != settings.API_KEY_HASH:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key
