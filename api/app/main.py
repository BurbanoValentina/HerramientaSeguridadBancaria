from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.seeds import seed_if_empty
from app.routers import findings, rules, audit
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_if_empty()
    yield

app = FastAPI(title="BankGuard Security API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(findings.router, prefix="/api/v1/findings", tags=["findings"])
app.include_router(rules.router, prefix="/api/v1/rules", tags=["rules"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["audit"])

@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
