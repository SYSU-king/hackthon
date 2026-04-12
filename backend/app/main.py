from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .engine import advance_simulation, build_default_state, rerun_path_with_edit
from .models import DashboardState, RerunRequest
from .store import FileStateStore


def create_app(store: FileStateStore | None = None) -> FastAPI:
    app = FastAPI(title="LifePath Engine API", version="0.1.0")
    app.state.store = store or FileStateStore()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def get_store() -> FileStateStore:
        return app.state.store

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/api/project", response_model=DashboardState)
    def get_project() -> DashboardState:
        return get_store().load()

    @app.post("/api/project/reset", response_model=DashboardState)
    def reset_project() -> DashboardState:
        fresh = build_default_state()
        get_store().save(fresh)
        return fresh

    @app.post("/api/simulation/run", response_model=DashboardState)
    def run_simulation() -> DashboardState:
        state = advance_simulation(get_store().load())
        get_store().save(state)
        return state

    @app.post("/api/paths/{path_id}/rerun", response_model=DashboardState)
    def rerun_path(path_id: str, payload: RerunRequest) -> DashboardState:
        current_store = get_store()
        state = current_store.load()
        path_ids = {path.id for path in state.paths}
        if path_id not in path_ids:
            raise HTTPException(status_code=404, detail="Path not found")
        updated = rerun_path_with_edit(state, path_id, payload.node_id, payload.field_key, payload.value)
        current_store.save(updated)
        return updated

    return app


app = create_app()
