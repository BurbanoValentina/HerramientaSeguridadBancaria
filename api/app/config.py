from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # SQLite por defecto para `uvicorn` local sin Docker; usa Postgres en `.env` o Docker.
    DATABASE_URL: str = "sqlite+aiosqlite:///./bankguard.db"
    REDIS_URL: str = "redis://localhost:6379"
    KEYCLOAK_URL: str = "http://localhost:8080"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    SECRET_KEY: str = "change-me-in-production"
    API_KEY_HASH: str = ""

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[1] / ".env")
    )

settings = Settings()
