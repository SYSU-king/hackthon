"""Project CRUD API"""

from fastapi import APIRouter, HTTPException, Body
from app.domain.models import Project
from app.domain.schemas import ProjectCreate, ProjectOut, UserProfileCreate, ParametersSubmit
from app.core.db import save_project, load_project, list_projects, delete_project
from app.domain.models import UserProfile, ConcernParameter
from datetime import datetime

router = APIRouter(prefix="/api/projects", tags=["projects"])


IMPORTABLE_KEYS = {
    "title", "status", "created_at", "updated_at", "profile", "parameters",
    "agents", "graph_data", "expanded_factors", "paths", "report", "_tree_events",
}
VALID_STATUSES = {"created", "profiled", "configured", "simulating", "completed"}


def _normalize_imported_project(payload: dict) -> dict:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Imported payload must be a JSON object")

    base = Project(title=str(payload.get("title") or "Imported Project")).model_dump()
    project = dict(base)

    for key in IMPORTABLE_KEYS:
        if key in payload:
            project[key] = payload[key]

    imported_id = str(payload.get("id") or "").strip()
    if imported_id and not load_project(imported_id):
        project["id"] = imported_id

    if project.get("status") not in VALID_STATUSES:
        project["status"] = "completed" if project.get("paths") else "created"

    project["title"] = str(project.get("title") or base["title"]).strip() or base["title"]
    project["created_at"] = payload.get("created_at") or base["created_at"]
    project["updated_at"] = datetime.utcnow().isoformat()
    project["profile"] = project.get("profile") or {}
    project["parameters"] = project.get("parameters") or []
    project["agents"] = project.get("agents") or []
    project["paths"] = project.get("paths") or []
    project["graph_data"] = project.get("graph_data") or {"nodes": [], "edges": []}
    project["expanded_factors"] = project.get("expanded_factors") or {}
    project["report"] = project.get("report") or None
    project["_tree_events"] = project.get("_tree_events") or []

    return project


@router.post("", response_model=ProjectOut)
def create_project(body: ProjectCreate):
    project = Project(title=body.title)
    save_project(project.model_dump())
    return project.model_dump()


@router.post("/import")
def import_project(body: dict = Body(...)):
    project = _normalize_imported_project(body)
    save_project(project)
    return project


@router.get("", response_model=list[ProjectOut])
def get_projects():
    return list_projects()


@router.get("/{project_id}")
def get_project(project_id: str):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    return data


@router.delete("/{project_id}")
def remove_project(project_id: str):
    if not delete_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted"}


@router.post("/{project_id}/profile")
def submit_profile(project_id: str, body: UserProfileCreate):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    data["profile"] = body.model_dump()
    data["status"] = "profiled"
    data["updated_at"] = datetime.utcnow().isoformat()
    save_project(data)
    return {"status": "ok", "profile": data["profile"]}


@router.post("/{project_id}/parameters")
def submit_parameters(project_id: str, body: ParametersSubmit):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    params = []
    for p in body.parameters:
        cp = ConcernParameter(name=p.name, description=p.description, priority=p.priority, weight=p.weight)
        params.append(cp.model_dump())
    data["parameters"] = params
    data["status"] = "configured"
    data["updated_at"] = datetime.utcnow().isoformat()
    save_project(data)
    return {"status": "ok", "parameters": data["parameters"]}
