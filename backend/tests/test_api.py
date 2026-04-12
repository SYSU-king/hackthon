from __future__ import annotations

from urllib.error import URLError

from fastapi.testclient import TestClient

from app.main import create_app
from app.store import FileStateStore


def test_project_endpoint_returns_rich_seed_state(tmp_path) -> None:
    store = FileStateStore(tmp_path / "state.json")
    client = TestClient(create_app(store))

    response = client.get("/api/project")
    assert response.status_code == 200
    payload = response.json()

    assert payload["profile"]["name"]
    assert payload["current_cycle"] == 1
    assert payload["profile"]["planning_horizon"] == "3年"
    assert payload["current_state"]["time_label"] == "第1学期"
    assert payload["graph_meta"]["supports_self_loops"] is True
    assert payload["graph_meta"]["supports_multi_edges"] is True
    assert payload["graph_meta"]["self_loop_count"] >= 2
    assert payload["graph_meta"]["multi_edge_group_count"] >= 1
    assert len(payload["paths"]) == 3
    assert len(payload["branches"]) == 3
    assert len(payload["memories"]) >= 3
    assert payload["current_state"]["axes"]["education"] >= 70
    assert payload["llm"]["last_prompt_kind"] == "bootstrap"


def test_graph_contains_self_loops_and_multi_edges(tmp_path) -> None:
    client = TestClient(create_app(FileStateStore(tmp_path / "state.json")))

    payload = client.get("/api/project").json()
    edges = payload["graph_edges"]

    assert any(edge["source"] == edge["target"] for edge in edges)

    pair_counts: dict[tuple[str, str], int] = {}
    for edge in edges:
        key = (edge["source"], edge["target"])
        pair_counts[key] = pair_counts.get(key, 0) + 1

    assert any(count > 1 for count in pair_counts.values())
    assert any(edge["episodes"] for edge in edges if edge["source"] == edge["target"])


def test_run_simulation_advances_closed_loop_and_records_memory(tmp_path) -> None:
    store = FileStateStore(tmp_path / "state.json")
    client = TestClient(create_app(store))

    before = client.get("/api/project").json()
    response = client.post("/api/simulation/run")
    assert response.status_code == 200
    after = response.json()

    assert after["current_cycle"] == before["current_cycle"] + 1
    assert len(after["state_snapshots"]) == len(before["state_snapshots"]) + 1
    assert len(after["memories"]) == len(before["memories"]) + 3
    assert len(after["graph_nodes"]) == len(before["graph_nodes"]) + 1
    assert len(after["graph_edges"]) == len(before["graph_edges"]) + 1
    assert after["active_branch_id"] in {branch["id"] for branch in after["branches"]}
    assert after["llm"]["last_prompt_kind"] == "director_cycle"
    assert after["current_state"]["phase"] == "state_update"
    assert any(event["phase"] == "memory" for event in after["simulation_events"])


def test_rerun_endpoint_updates_path_summary_and_counterfactual_memory(tmp_path) -> None:
    store = FileStateStore(tmp_path / "state.json")
    client = TestClient(create_app(store))

    first = client.get("/api/project").json()
    response = client.post(
        "/api/paths/research-first/rerun",
        json={"node_id": "rf-1", "field_key": "mentor_signal", "value": "stronger"},
    )
    assert response.status_code == 200
    payload = response.json()

    before = next(item for item in first["paths"] if item["id"] == "research-first")
    after = next(item for item in payload["paths"] if item["id"] == "research-first")
    assert after["confidence"] >= before["confidence"]
    assert "导师信号" in after["summary"]
    assert len(payload["memories"]) == len(first["memories"]) + 1
    assert payload["llm"]["last_prompt_kind"] == "path_rerun"
    assert any(edge["relation"] == "counterfactual" for edge in payload["graph_edges"])

    second = client.post(
        "/api/paths/research-first/rerun",
        json={"node_id": "rf-1", "field_key": "mentor_signal", "value": "strong"},
    )
    assert second.status_code == 200
    second_payload = second.json()
    counterfactual_edges = [
        edge
        for edge in second_payload["graph_edges"]
        if edge["relation"] == "counterfactual"
        and edge["details"].get("node_id") == "rf-1"
        and edge["details"].get("field_key") == "mentor_signal"
    ]
    assert len(counterfactual_edges) == 1
    assert counterfactual_edges[0]["fact"] == "导师信号 调整为 强"
    assert "strong" not in counterfactual_edges[0]["fact"]


def test_llm_env_config_falls_back_when_request_errors(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("LIFEPATH_LLM_BASE_URL", "https://example.invalid/v1")
    monkeypatch.setenv("LIFEPATH_LLM_MODEL", "test-model")
    monkeypatch.setenv("LIFEPATH_LLM_API_KEY", "test-key")

    import app.llm as llm_module

    def raise_url_error(*args, **kwargs):  # type: ignore[no-untyped-def]
        raise URLError("offline")

    monkeypatch.setattr(llm_module, "urlopen", raise_url_error)

    store = FileStateStore(tmp_path / "state.json")
    client = TestClient(create_app(store))
    response = client.post("/api/simulation/run")
    assert response.status_code == 200
    payload = response.json()

    assert payload["llm"]["configured"] is True
    assert payload["llm"]["base_url"] == "https://example.invalid/v1"
    assert payload["llm"]["model"] == "test-model"
    assert payload["llm"]["used_fallback"] is True
    assert payload["llm"]["mode"] == "fallback"
    assert "offline" in payload["llm"]["last_error"]


def test_llm_uses_default_model_when_only_base_url_is_configured(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("LIFEPATH_LLM_BASE_URL", "https://example.invalid/v1")
    monkeypatch.setenv("LIFEPATH_LLM_API_KEY", "test-key")
    monkeypatch.delenv("LIFEPATH_LLM_MODEL", raising=False)
    monkeypatch.delenv("OPENAI_MODEL", raising=False)

    import app.llm as llm_module

    def raise_url_error(*args, **kwargs):  # type: ignore[no-untyped-def]
        raise URLError("offline")

    monkeypatch.setattr(llm_module, "urlopen", raise_url_error)

    store = FileStateStore(tmp_path / "state.json")
    client = TestClient(create_app(store))
    response = client.post("/api/simulation/run")
    assert response.status_code == 200
    payload = response.json()

    assert payload["llm"]["configured"] is True
    assert payload["llm"]["model"] == "gpt-5.4-mini"
    assert payload["llm"]["used_fallback"] is True
