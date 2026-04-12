"""Simulation API — start simulation, retrieve paths, graph, agents, advice, report.

IMPORTANT: This module ONLY uses the LLM-powered engine. No mock/demo data.
All simulation, advice, and report generation is done via real AI calls.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.domain.schemas import SimulationStart, AdviceRequest, BacktrackRequest
from app.core.db import load_project, save_project
from app.core.config import settings
from datetime import datetime
import json
import asyncio
import logging
import traceback
import copy

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/projects/{project_id}", tags=["simulation"])


@router.post("/simulate")
async def start_simulation(project_id: str, body: SimulationStart):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    # ── Pre-check: LLM must be configured ──
    if not settings.LLM_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="LLM_API_KEY 未配置。请在 .env 文件中设置 LLM_API_KEY 后重启服务。推演引擎需要 AI 驱动，不支持演示模式。"
        )

    # ── If project is already completed, allow re-use of cached results ──
    if data.get("status") == "completed" and data.get("paths"):
        async def completed_stream():
            n_paths = len(data.get("paths", []))
            n_agents = len(data.get("agents", []))
            # Send tree_events if available
            tree_events = data.get("_tree_events", [])
            for evt in tree_events:
                yield f"data: {json.dumps({'phase': 'tree_event', 'progress': 100, 'message': '', 'tree_event': evt, 'engine': 'llm'})}\n\n"
            yield f"data: {json.dumps({'phase': 'completed', 'progress': 100, 'message': '推演已完成（使用缓存结果）', 'path_count': n_paths, 'agent_count': n_agents, 'engine': 'llm'})}\n\n"
        return StreamingResponse(completed_stream(), media_type="text/event-stream")

    async def event_stream():
        yield f"data: {json.dumps({'phase': 'init', 'progress': 0, 'message': '⚡ AI 推演引擎启动中...', 'engine': 'llm'})}\n\n"
        await asyncio.sleep(0.1)

        try:
            from app.services.life_engine_service import generate_llm_paths, generate_report

            # Run LLM simulation in thread pool to avoid blocking
            import concurrent.futures

            progress_messages = []

            def progress_callback(phase, progress, message, tree_event=None):
                progress_messages.append((phase, progress, message, tree_event))

            loop = asyncio.get_event_loop()
            with concurrent.futures.ThreadPoolExecutor() as pool:
                # Start the simulation task with configurable agent_count
                future = loop.run_in_executor(
                    pool,
                    lambda: generate_llm_paths(
                        data,
                        min(body.rounds, 20),
                        progress_callback,
                        agent_count=body.agent_count,
                    )
                )

                # Stream progress while waiting
                while not future.done():
                    await asyncio.sleep(0.5)
                    while progress_messages:
                        phase, progress, message, tree_event = progress_messages.pop(0)
                        if phase == 'tree_event' and tree_event:
                            yield f"data: {json.dumps({'phase': 'tree_event', 'progress': progress, 'message': '', 'tree_event': tree_event, 'engine': 'llm'})}\n\n"
                            continue
                        evt = {
                            'phase': phase,
                            'progress': progress,
                            'message': message,
                            'engine': 'llm',
                        }
                        yield f"data: {json.dumps(evt)}\n\n"

                # Get result (will raise if simulation failed)
                paths, agents, expanded = future.result()

                # Flush remaining progress messages
                while progress_messages:
                    phase, progress, message, tree_event = progress_messages.pop(0)
                    if phase == 'tree_event' and tree_event:
                        yield f"data: {json.dumps({'phase': 'tree_event', 'progress': progress, 'message': '', 'tree_event': tree_event, 'engine': 'llm'})}\n\n"
                    else:
                        yield f"data: {json.dumps({'phase': phase, 'progress': progress, 'message': message, 'engine': 'llm'})}\n\n"

            # Validate: we must have actual paths
            if not paths:
                yield f"data: {json.dumps({'phase': 'error', 'progress': 0, 'message': '❌ AI 推演未产生有效路径，请检查 LLM 配置或重试', 'engine': 'llm'})}\n\n"
                return

            # Save results
            data["paths"] = paths
            data["agents"] = [a if isinstance(a, dict) else a.model_dump() for a in agents]
            data["expanded_factors"] = expanded
            data["graph_data"] = _build_graph_data(expanded, agents)
            data["status"] = "completed"
            data["updated_at"] = datetime.utcnow().isoformat()
            save_project(data)

            yield f"data: {json.dumps({'phase': 'completed', 'progress': 100, 'message': '🎉 AI 推演完成！', 'path_count': len(paths), 'agent_count': len(agents), 'engine': 'llm'})}\n\n"

        except Exception as e:
            tb = traceback.format_exc()
            logger.error(f"LLM simulation failed:\n{tb}")
            error_msg = str(e)[:200]
            yield f"data: {json.dumps({'phase': 'error', 'progress': 0, 'message': f'❌ AI 推演失败: {error_msg}', 'engine': 'llm'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ── Force re-simulate (clears cached results) ──

@router.post("/re-simulate")
async def re_simulate(project_id: str, body: SimulationStart):
    """Force a fresh AI re-simulation, clearing any cached results."""
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    if not settings.LLM_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="LLM_API_KEY 未配置。请在 .env 中设置后重启。"
        )

    # Clear cached simulation data
    data["status"] = "simulating"
    data.pop("paths", None)
    data.pop("agents", None)
    data.pop("expanded_factors", None)
    data.pop("graph_data", None)
    data.pop("_tree_events", None)
    data.pop("report", None)
    data["updated_at"] = datetime.utcnow().isoformat()
    save_project(data)

    # Delegate to the main simulation endpoint
    return await start_simulation(project_id, body)


# ── Backtracking / Counterfactual endpoint ──

@router.post("/backtrack")
async def backtrack_simulation(project_id: str, body: BacktrackRequest):
    """
    Counterfactual: modify parameters at a specific node and re-derive from that point.
    This implements §14.2 (可反事实) and §14.4 (可交互) from the paradigm doc.
    """
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    if not settings.LLM_API_KEY:
        raise HTTPException(status_code=500, detail="LLM_API_KEY 未配置")

    paths = data.get("paths", [])
    # Find the source path
    source_path = None
    for p in paths:
        if p["id"] == body.path_id:
            source_path = p
            break

    if not source_path:
        raise HTTPException(status_code=404, detail="Source path not found")

    nodes = source_path.get("nodes", [])
    if body.node_index >= len(nodes):
        raise HTTPException(status_code=400, detail="Node index out of range")

    # Get state at the selected node
    target_node = nodes[body.node_index]
    base_state = target_node.get("state_snapshot", {})
    if not base_state:
        # Fallback to path's final state
        base_state = source_path.get("final_state", {})

    # Apply modifications
    modified_state = dict(base_state)
    for key, val in body.modifications.items():
        if key in modified_state:
            modified_state[key] = float(val)

    async def backtrack_stream():
        yield f"data: {json.dumps({'phase': 'init', 'progress': 0, 'message': f'🔄 回溯推演: 从节点 {body.node_index + 1} 开始，修改条件并重新推导...', 'engine': 'llm'})}\n\n"
        await asyncio.sleep(0.1)

        try:
            from app.services.life_engine_service import run_backtrack_simulation

            import concurrent.futures

            progress_messages = []

            def progress_callback(phase, progress, message, tree_event=None):
                progress_messages.append((phase, progress, message, tree_event))

            loop = asyncio.get_event_loop()
            with concurrent.futures.ThreadPoolExecutor() as pool:
                future = loop.run_in_executor(
                    pool,
                    lambda: run_backtrack_simulation(
                        data, source_path, body.node_index,
                        modified_state, body.description,
                        body.rounds, progress_callback
                    )
                )

                while not future.done():
                    await asyncio.sleep(0.5)
                    while progress_messages:
                        phase, progress, message, tree_event = progress_messages.pop(0)
                        if phase == 'tree_event' and tree_event:
                            yield f"data: {json.dumps({'phase': 'tree_event', 'progress': progress, 'message': '', 'tree_event': tree_event, 'engine': 'llm'})}\n\n"
                        else:
                            yield f"data: {json.dumps({'phase': phase, 'progress': progress, 'message': message, 'engine': 'llm'})}\n\n"

                new_path, tree_events = future.result()

                while progress_messages:
                    phase, progress, message, tree_event = progress_messages.pop(0)
                    if phase == 'tree_event' and tree_event:
                        yield f"data: {json.dumps({'phase': 'tree_event', 'progress': progress, 'message': '', 'tree_event': tree_event, 'engine': 'llm'})}\n\n"
                    else:
                        yield f"data: {json.dumps({'phase': phase, 'progress': progress, 'message': message, 'engine': 'llm'})}\n\n"

            if not new_path:
                yield f"data: {json.dumps({'phase': 'error', 'progress': 0, 'message': '❌ 回溯推演未产生有效路径', 'engine': 'llm'})}\n\n"
                return

            # Add new path to project
            data["paths"].append(new_path)
            # Also merge tree events
            existing_events = data.get("_tree_events", [])
            data["_tree_events"] = existing_events + tree_events
            # Clear cached report so it's regenerated
            data.pop("report", None)
            data["updated_at"] = datetime.utcnow().isoformat()
            save_project(data)

            yield f"data: {json.dumps({'phase': 'completed', 'progress': 100, 'message': f'🎉 回溯推演完成！生成反事实路径', 'path_count': len(data['paths']), 'new_path_id': new_path['id'], 'engine': 'llm'})}\n\n"

        except Exception as e:
            tb = traceback.format_exc()
            logger.error(f"Backtrack simulation failed:\n{tb}")
            error_msg = str(e)[:200]
            yield f"data: {json.dumps({'phase': 'error', 'progress': 0, 'message': f'❌ 回溯推演失败: {error_msg}', 'engine': 'llm'})}\n\n"

    return StreamingResponse(backtrack_stream(), media_type="text/event-stream")


@router.get("/paths")
def get_paths(project_id: str):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"paths": data.get("paths", [])}


@router.get("/paths/{path_id}")
def get_path_detail(project_id: str, path_id: str):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    for p in data.get("paths", []):
        if p["id"] == path_id:
            return p
    raise HTTPException(status_code=404, detail="Path not found")


@router.post("/paths/{path_id}/advice")
def get_advice(project_id: str, path_id: str, body: AdviceRequest):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    if not settings.LLM_API_KEY:
        raise HTTPException(status_code=500, detail="LLM_API_KEY 未配置，无法生成 AI 建议。")

    for p in data.get("paths", []):
        if p["id"] == path_id:
            from app.services.life_engine_service import generate_llm_advice
            advice = generate_llm_advice(p, data.get("profile", {}), body.feedback)
            p["advice"] = advice
            save_project(data)
            return advice

    raise HTTPException(status_code=404, detail="Path not found")


# ── Report endpoint ──

@router.get("/report")
def get_report(project_id: str):
    """Generate or return cached project-level comparison report (AI-powered)."""
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    # Return cached report if exists
    if data.get("report"):
        return data["report"]

    paths = data.get("paths", [])
    if not paths:
        raise HTTPException(status_code=400, detail="No paths generated yet")

    if not settings.LLM_API_KEY:
        raise HTTPException(status_code=500, detail="LLM_API_KEY 未配置，无法生成报告。")

    from app.services.life_engine_service import generate_report
    report = generate_report(data)

    data["report"] = report
    save_project(data)
    return report


# ── Graph & Agents ──

@router.get("/graph")
def get_graph(project_id: str):
    """Return knowledge graph data for visualization."""
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    graph = data.get("graph_data")
    if not graph:
        # Build minimal graph from whatever data we have
        expanded = data.get("expanded_factors", {})
        agents = data.get("agents", [])
        if expanded or agents:
            graph = _build_graph_data(expanded, agents)

    return graph or {"nodes": [], "edges": []}


@router.get("/agents")
def get_agents(project_id: str):
    """Return generated agents."""
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"agents": data.get("agents", [])}


# ── Tree events (for re-rendering the tree after page reload) ──

@router.get("/tree-events")
def get_tree_events(project_id: str):
    """Return the tree events recorded during simulation."""
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"events": data.get("_tree_events", [])}


# ── Helpers ──

def _build_graph_data(expanded: dict, agents: list) -> dict:
    """Build graph visualization data."""
    from app.services.life_engine_service import _build_graph_from_expansion
    agent_dicts = [a if isinstance(a, dict) else a for a in agents]
    return _build_graph_from_expansion(expanded or {}, agent_dicts)
