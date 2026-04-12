"""Tests for project CRUD APIs."""

from tests.conftest import *


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_create_project(client):
    resp = client.post("/api/projects", json={"title": "Test Simulation"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Test Simulation"
    assert data["status"] == "created"
    assert "id" in data


def test_list_projects(client):
    client.post("/api/projects", json={"title": "P1"})
    client.post("/api/projects", json={"title": "P2"})
    resp = client.get("/api/projects")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_get_project(client):
    create_resp = client.post("/api/projects", json={"title": "Detail Test"})
    pid = create_resp.json()["id"]
    resp = client.get(f"/api/projects/{pid}")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Detail Test"


def test_get_project_not_found(client):
    resp = client.get("/api/projects/nonexistent")
    assert resp.status_code == 404


def test_delete_project(client):
    create_resp = client.post("/api/projects", json={"title": "To Delete"})
    pid = create_resp.json()["id"]
    resp = client.delete(f"/api/projects/{pid}")
    assert resp.status_code == 200
    # Verify deleted
    resp2 = client.get(f"/api/projects/{pid}")
    assert resp2.status_code == 404


def test_submit_profile(client):
    create_resp = client.post("/api/projects", json={"title": "Profile Test"})
    pid = create_resp.json()["id"]
    profile = {
        "personality_type": "INTJ",
        "education_stage": "undergraduate",
        "school": "中山大学",
        "major": "计算机科学",
        "gpa_range": "3.5-4.0",
        "family_economy": "中等",
        "city_preference": "一线城市",
        "career_preference": "大厂",
        "risk_preference": "balanced",
        "current_concern": "保研还是直接就业",
    }
    resp = client.post(f"/api/projects/{pid}/profile", json=profile)
    assert resp.status_code == 200
    assert resp.json()["profile"]["school"] == "中山大学"

    # Verify status updated
    project = client.get(f"/api/projects/{pid}").json()
    assert project["status"] == "profiled"



def test_import_project(client):
    payload = {
        "id": "demo-import",
        "title": "Imported Demo",
        "status": "completed",
        "profile": {"education_stage": "working_3_plus"},
        "paths": [{"id": "p1", "name": "Path Alpha", "nodes": []}],
        "_tree_events": [{"id": "root", "type": "add_node", "label": "BASE"}],
    }
    resp = client.post("/api/projects/import", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Imported Demo"
    assert data["status"] == "completed"
    assert data["paths"][0]["id"] == "p1"

    listed = client.get("/api/projects").json()
    assert listed[0]["title"] == "Imported Demo"

def test_submit_parameters(client):
    create_resp = client.post("/api/projects", json={"title": "Param Test"})
    pid = create_resp.json()["id"]
    params = {
        "parameters": [
            {"name": "保研 vs 就业", "priority": "primary", "weight": 1.0},
            {"name": "城市选择", "priority": "secondary", "weight": 0.7},
            {"name": "家庭期望", "priority": "constraint", "weight": 0.5},
        ]
    }
    resp = client.post(f"/api/projects/{pid}/parameters", json=params)
    assert resp.status_code == 200
    assert len(resp.json()["parameters"]) == 3

    # Verify status
    project = client.get(f"/api/projects/{pid}").json()
    assert project["status"] == "configured"
