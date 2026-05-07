# BankGuard

Plataforma para deteccion de datos sensibles en codigo con:
- motor MCP (`mcp-server/`)
- API de seguridad (`api/`)
- dashboard operacional (`dashboard/`)
- infraestructura local (`infra/`)

## Arquitectura

```mermaid
flowchart LR
    Dev[Repositorio de codigo] --> MCP[MCP Detection Engine]
    MCP --> API[FastAPI API]
    API --> DB[(PostgreSQL / SQLite local)]
    API --> AUDIT[(audit_logs append-only)]
    API --> REDIS[(Redis)]
    DASH[Dashboard React] --> API
    KC[Keycloak] --> API
```

## Flujo de hallazgos

```mermaid
sequenceDiagram
    participant Scanner as MCP Scanner
    participant API as FastAPI
    participant DB as audit_findings
    participant UI as Dashboard

    Scanner->>API: POST /api/v1/findings
    API->>DB: guarda finding (snippet enmascarado)
    API-->>UI: GET /api/v1/findings
    UI->>API: PATCH /findings/{id}/remediate
    API->>DB: marca remediated = true
    API->>DB: inserta evento en audit_logs
```

## Estructura del repositorio

```text
bankguard/
├─ api/          # Backend FastAPI + SQLAlchemy async
├─ dashboard/    # React + Vite + TypeScript + Tailwind
├─ mcp-server/   # Motor de deteccion MCP
└─ infra/        # Docker Compose + servicios base
```

## Requisitos

- Node.js 18+
- Python 3.11+
- Docker Desktop (opcional para stack completo)

## Inicio rapido

### Opcion 1: stack completo con Docker

```bash
cp infra/.env.example infra/.env
cp api/.env.example api/.env
cd infra
docker compose up --build
```

Servicios:
- Dashboard: `http://localhost:3000`
- API docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/v1/health`
- Keycloak: `http://localhost:8080`

### Opcion 2: desarrollo local (sin Docker)

Backend:

```bash
cd api
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd dashboard
npm install
npm run dev
```

Dashboard local: `http://localhost:5173`

## Categorias y severidad

Categorias detectadas:
- `payment_card`
- `pii`
- `financial`
- `credentials`
- `health`

Umbrales de severidad:
- `critical`: >= 0.85
- `high`: >= 0.65
- `medium`: >= 0.40
- `low`: < 0.40

## Seguridad y cumplimiento

- No almacenar datos sensibles reales en logs ni DB.
- Guardar solo snippets enmascarados.
- Registrar acciones en `audit_logs`.
- Tratar `audit_logs` como append-only.
