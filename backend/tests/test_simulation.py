"""Tests for simulation and advice APIs."""

from tests.conftest import *
from app.services import life_engine_service


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



def test_simulation_stream_contains_live_tree_event(client):
    pid = _create_configured_project(client)
    resp = client.post(f"/api/projects/{pid}/simulate", json={"rounds": 8, "time_unit": "quarter"})
    assert resp.status_code == 200

    events = [chunk.replace("data: ", "") for chunk in resp.text.strip().split("\n\n") if chunk.strip()]

    import json
    parsed = [json.loads(chunk) for chunk in events]
    tree_events = [event for event in parsed if event["phase"] == "tree_event"]
    assert tree_events
    assert tree_events[0]["tree_event"]["id"] == "root"
    assert parsed.index(tree_events[0]) < len(parsed) - 1
    assert parsed[-1]["phase"] == "completed"

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


def test_future_self_chat_prompt_enforces_human_dialogue(monkeypatch):
    captured = {}

    class FakeLLM:
        def chat_json(self, messages, temperature=0.5, max_tokens=2000):
            captured["messages"] = messages
            return {
                "agent": {"persona": "经历过这段弯路后更坦诚的你", "stance": "supportive"},
                "reply": "我知道你现在最怕的是选错，不是吃苦。",
            }

    monkeypatch.setattr(life_engine_service, "get_llm_client", lambda: FakeLLM())

    project_data = {
        "profile": {
            "current_concern": "要不要离开大厂去创业",
            "risk_preference": "balanced",
        },
        "parameters": [{"name": "稳定收入", "priority": "primary", "weight": 1.0}],
        "agents": [{"agent_type": "Mentor", "name": "老上司", "persona": "看重节奏和兑现"}],
    }
    path_data = {
        "nodes": [
            {
                "time_label": "2026-Q1",
                "title": "继续留在大厂",
                "description": "你保住了现金流，但开始怀疑自己是不是在拖延。",
                "node_type": "decision",
                "trigger_reason": "对不确定性的恐惧",
                "state_snapshot": {"career": 0.68, "finance": 0.72, "mental": 0.41},
            }
        ]
    }

    life_engine_service.chat_with_future_self(
        project_data,
        path_data,
        0,
        "我是不是其实只是胆小？",
        history=[{"role": "user", "content": "我最近一直睡不好。"}],
    )

    system_prompt = captured["messages"][0]["content"]
    assert "同一个人" in system_prompt
    assert "不要写成标准答案" in system_prompt
    assert "不要写成分点清单" in system_prompt


def test_future_self_chat_flattens_list_like_reply(monkeypatch):
    class FakeLLM:
        def chat_json(self, messages, temperature=0.5, max_tokens=2000):
            return {
                "agent": {"persona": "更敢承担后果的你", "stance": "supportive"},
                "reply": "你现在最该做的有三件事：\n- 先把害怕说清楚。\n- 再看你到底舍不得什么。\n- 最后再决定要不要走。",
            }

    monkeypatch.setattr(life_engine_service, "get_llm_client", lambda: FakeLLM())

    result = life_engine_service.chat_with_future_self(
        {"profile": {}, "parameters": [], "agents": []},
        {
            "nodes": [
                {
                    "time_label": "2026-Q2",
                    "title": "创业机会出现",
                    "description": "你心动，但也知道这意味着真正失去退路。",
                    "node_type": "opportunity",
                    "trigger_reason": "窗口期出现",
                    "state_snapshot": {"career": 0.74, "finance": 0.46, "mental": 0.38},
                }
            ]
        },
        0,
        "我该怎么办？",
    )

    assert "- " not in result["reply"]
    assert "\n- " not in result["reply"]
    assert "先把害怕说清楚" in result["reply"]


def test_future_self_chat_rewrites_dashboard_jargon(monkeypatch):
    class FakeLLM:
        def chat_json(self, messages, temperature=0.5, max_tokens=2000):
            return {
                "agent": {"persona": "看过你绕路之后的你", "stance": "supportive"},
                "reply": (
                    "你现在压力有点大。家庭支持71%，健康79%，选择空间83%。"
                    "你在2026年Q1这个节点上，需要继续探索最优轨道。"
                    "先看看组织授权密度能不能给到你真正可迁移的管理杠杆。"
                ),
            }

    monkeypatch.setattr(life_engine_service, "get_llm_client", lambda: FakeLLM())

    result = life_engine_service.chat_with_future_self(
        {"profile": {}, "parameters": [], "agents": []},
        {
            "nodes": [
                {
                    "time_label": "2026-Q1",
                    "title": "留任观察期",
                    "description": "你嘴上说再看看，心里其实已经有点累了。",
                    "node_type": "decision",
                    "trigger_reason": "迟疑",
                    "state_snapshot": {"career": 0.61, "finance": 0.57, "mental": 0.43},
                }
            ]
        },
        0,
        "我现在到底是不是不开心？",
    )

    assert "家庭支持71%" not in result["reply"]
    assert "选择空间83%" not in result["reply"]
    assert "节点" not in result["reply"]
    assert "最优轨道" not in result["reply"]
    assert "组织授权密度" not in result["reply"]
    assert "管理杠杆" not in result["reply"]
