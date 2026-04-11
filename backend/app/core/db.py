"""
Local JSON file storage layer.

Each project is stored as a single JSON file: storage/projects/{project_id}.json
This keeps things simple and portable — no database needed.
"""

import json
import os
from typing import Optional
from app.core.config import settings


def _projects_dir() -> str:
    projects_dir = os.path.join(settings.DATA_DIR, "projects")
    os.makedirs(projects_dir, exist_ok=True)
    return projects_dir


def _project_path(project_id: str) -> str:
    return os.path.join(_projects_dir(), f"{project_id}.json")


def save_project(data: dict) -> dict:
    """Save a project dict to a JSON file."""
    project_id = data["id"]
    path = _project_path(project_id)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return data


def load_project(project_id: str) -> Optional[dict]:
    """Load a project from its JSON file. Returns None if not found."""
    path = _project_path(project_id)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def list_projects() -> list[dict]:
    """List all project summary dicts."""
    projects = []
    for filename in os.listdir(_projects_dir()):
        if filename.endswith(".json"):
            filepath = os.path.join(_projects_dir(), filename)
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                projects.append({
                    "id": data["id"],
                    "title": data["title"],
                    "status": data["status"],
                    "created_at": data["created_at"],
                })
    projects.sort(key=lambda x: x["created_at"], reverse=True)
    return projects


def delete_project(project_id: str) -> bool:
    """Delete a project JSON file."""
    path = _project_path(project_id)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False
