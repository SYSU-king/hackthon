"""FastAPI Application Entry Point"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import projects, simulation

app = FastAPI(
    title="LifePath Engine API",
    version="1.0.0",
    description="人生路径推演引擎 — 调一下参数，你的人生会走向哪里？",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(projects.router)
app.include_router(simulation.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine": "LifePath Engine v1.0.0"}
