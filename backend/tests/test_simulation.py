"""Tests for simulation and advice APIs."""

from tests.conftest import *


def _create_configured_project(client):
    """Helper: create a project with profile and parameters."""
    resp = client.post("/api/projects", json={"title": "Sim Test"})
    pid = resp.json()["id"]

    client.post(f"/api/projects/{pid}/profile", json={
        "personality_type": "INTJ",
        "education_stage": "undergraduate",
        "school": "中山大学",
        "major": "计算机科学",
        "current_concern": "保研还是直接就业",
        "risk_preference": "balanced",
    })

    client.post(f"/api/projects/{pid}/parameters", json={
        "parameters": [
            {"name": "保研 vs 就业", "priority": "primary", "weight": 1.0},
        ]
    })
    return pid


def test_simulate_project(client):
    pid = _create_configured_project(client)

    # Start simulation (SSE stream)
    resp = client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8, "time_unit": "quarter"})
    assert resp.status_code == 200

    # Read all events
    events = resp.text.strip().split("\n\n")
    assert len(events) > 0

    # Last event should be "completed"
    import json
    last_event = events[-1].replace("data: ", "")
    last_data = json.loads(last_event)
    assert last_data["phase"] == "completed"
    assert last_data["path_count"] == 3


def test_get_paths_after_simulation(client):
    pid = _create_configured_project(client)
    client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8})

    resp = client.get(f"/api/projects/{pid}/paths")
    assert resp.status_code == 200
    paths = resp.json()["paths"]
    assert len(paths) == 3
    assert paths[0]["path_type"] == "optimal"
    assert paths[1]["path_type"] == "conservative"
    assert paths[2]["path_type"] == "risk"


def test_get_path_detail(client):
    pid = _create_configured_project(client)
    client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8})

    paths = client.get(f"/api/projects/{pid}/paths").json()["paths"]
    path_id = paths[0]["id"]

    resp = client.get(f"/api/projects/{pid}/paths/{path_id}")
    assert resp.status_code == 200
    detail = resp.json()
    assert len(detail["nodes"]) > 0
    assert detail["nodes"][0]["title"] != ""


def test_path_nodes_have_state_snapshots(client):
    pid = _create_configured_project(client)
    client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8})

    paths = client.get(f"/api/projects/{pid}/paths").json()["paths"]
    nodes = paths[0]["nodes"]
    for node in nodes:
        assert "state_snapshot" in node
        snapshot = node["state_snapshot"]
        assert "education" in snapshot
        assert "career" in snapshot
        assert 0.0 <= snapshot["education"] <= 1.0


def test_get_advice_satisfied(client):
    pid = _create_configured_project(client)
    client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8})

    paths = client.get(f"/api/projects/{pid}/paths").json()["paths"]
    path_id = paths[0]["id"]

    resp = client.post(f"/api/projects/{pid}/paths/{path_id}/advice", json={"feedback": "satisfied"})
    assert resp.status_code == 200
    advice = resp.json()
    assert advice["mode"] == "satisfied"
    assert "immediate_actions" in advice
    assert "mid_term_plan" in advice


def test_get_advice_unsatisfied(client):
    pid = _create_configured_project(client)
    client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8})

    paths = client.get(f"/api/projects/{pid}/paths").json()["paths"]
    path_id = paths[2]["id"]  # risk path

    resp = client.post(f"/api/projects/{pid}/paths/{path_id}/advice", json={"feedback": "unsatisfied"})
    assert resp.status_code == 200
    advice = resp.json()
    assert advice["mode"] == "unsatisfied"
    assert "risk_analysis" in advice
    assert "alternative_paths" in advice


def test_project_status_after_simulation(client):
    pid = _create_configured_project(client)
    client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8})

    project = client.get(f"/api/projects/{pid}").json()
    assert project["status"] == "completed"
