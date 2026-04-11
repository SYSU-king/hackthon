"""Project CRUD API"""

from fastapi import APIRouter, HTTPException
from app.domain.models import Project
from app.domain.schemas import ProjectCreate, ProjectOut, UserProfileCreate, ParametersSubmit
from app.core.db import save_project, load_project, list_projects, delete_project
from app.domain.models import UserProfile, ConcernParameter
from datetime import datetime

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("", response_model=ProjectOut)
def create_project(body: ProjectCreate):
    project = Project(title=body.title)
    save_project(project.model_dump())
    return project.model_dump()


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
