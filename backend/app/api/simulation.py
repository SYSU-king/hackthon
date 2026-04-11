"""Simulation API — start simulation, retrieve paths, graph, agents, advice."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.domain.schemas import SimulationStart, AdviceRequest
from app.core.db import load_project, save_project
from app.services.simulation_service import generate_mock_paths, generate_mock_advice
from datetime import datetime
import json
import asyncio
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/projects/{project_id}", tags=["simulation"])


@router.post("/simulate")
async def start_simulation(project_id: str, body: SimulationStart):
    data = load_project(project_id)
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")

    # ── Prevent re-simulation of completed projects ──
    if data.get("status") == "completed" and data.get("paths"):
        async def completed_stream():
            n_paths = len(data.get("paths", []))
            n_agents = len(data.get("agents", []))
            engine = "llm" if data.get("agents") else "mock"
            yield f"data: {json.dumps({'phase': 'completed', 'progress': 100, 'message': '推演已完成（使用缓存结果）', 'path_count': n_paths, 'agent_count': n_agents, 'engine': engine})}\n\n"
        return StreamingResponse(completed_stream(), media_type="text/event-stream")

    async def event_stream():
        total_steps = body.rounds

        # Try LLM-powered simulation first
        use_llm = True
        try:
            from app.core.config import settings
            if not settings.LLM_API_KEY:
                use_llm = False
        except Exception:
            use_llm = False

        if use_llm:
            yield f"data: {json.dumps({'phase': 'init', 'progress': 0, 'message': '⚡ AI 推演引擎启动中...', 'engine': 'llm'})}\n\n"
            await asyncio.sleep(0.1)

            try:
                from app.services.life_engine_service import generate_llm_paths, generate_llm_advice

                # Run LLM simulation in thread pool to avoid blocking
                import concurrent.futures

                progress_messages = []

                def progress_callback(phase, progress, message):
                    progress_messages.append((phase, progress, message))

                loop = asyncio.get_event_loop()
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    # Start the simulation task
                    future = loop.run_in_executor(
                        pool,
                        lambda: generate_llm_paths(data, min(total_steps, 8), progress_callback)
                    )

                    # Stream progress while waiting
                    while not future.done():
                        await asyncio.sleep(0.5)
                        while progress_messages:
                            phase, progress, message = progress_messages.pop(0)
                            yield f"data: {json.dumps({'phase': phase, 'progress': progress, 'message': message, 'engine': 'llm'})}\n\n"

                    # Get result
                    paths, agents, expanded = future.result()

                    # Flush remaining progress
                    while progress_messages:
                        phase, progress, message = progress_messages.pop(0)
                        yield f"data: {json.dumps({'phase': phase, 'progress': progress, 'message': message, 'engine': 'llm'})}\n\n"

                # Save results
                data["paths"] = paths
                data["agents"] = [a if isinstance(a, dict) else a.model_dump() for a in agents]
                data["expanded_factors"] = expanded
                data["graph_data"] = _build_graph_data(expanded, agents)
                data["status"] = "completed"
                data["updated_at"] = datetime.utcnow().isoformat()
                save_project(data)

                yield f"data: {json.dumps({'phase': 'completed', 'progress': 100, 'message': '🎉 AI 推演完成！', 'path_count': len(paths), 'agent_count': len(agents), 'engine': 'llm'})}\n\n"
                return

            except Exception as e:
                logger.error(f"LLM simulation failed, falling back to mock: {e}")
                yield f"data: {json.dumps({'phase': 'fallback', 'progress': 10, 'message': f'AI 推演遇到问题，切换到演示模式: {str(e)[:80]}', 'engine': 'mock'})}\n\n"
                await asyncio.sleep(0.3)

        # ── Fallback: Mock simulation ──
        yield f"data: {json.dumps({'phase': 'graph_building', 'progress': 15, 'message': '正在构建人生图谱（演示模式）...', 'engine': 'mock'})}\n\n"
        await asyncio.sleep(0.3)

        yield f"data: {json.dumps({'phase': 'agent_generation', 'progress': 25, 'message': '正在生成智能体...', 'engine': 'mock'})}\n\n"
        await asyncio.sleep(0.3)

        for i in range(total_steps):
            progress = 30 + int(55 * (i + 1) / total_steps)
            quarter = (i % 4) + 1
            year = 2025 + i // 4
            msg = f"推演第 {i+1}/{total_steps} 轮 — {year}-Q{quarter}"
            yield f"data: {json.dumps({'phase': 'simulating', 'progress': progress, 'round': i+1, 'total': total_steps, 'message': msg, 'engine': 'mock'})}\n\n"
            await asyncio.sleep(0.15)

        yield f"data: {json.dumps({'phase': 'generating_paths', 'progress': 90, 'message': '正在生成路径报告...', 'engine': 'mock'})}\n\n"
        await asyncio.sleep(0.3)

        paths = generate_mock_paths(data, body.rounds)
        data["paths"] = paths
        data["status"] = "completed"
        data["updated_at"] = datetime.utcnow().isoformat()
        save_project(data)

        yield f"data: {json.dumps({'phase': 'completed', 'progress': 100, 'message': '推演完成（演示模式）', 'path_count': len(paths), 'engine': 'mock'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


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

    for p in data.get("paths", []):
        if p["id"] == path_id:
            # Try LLM advice first
            try:
                from app.core.config import settings
                if settings.LLM_API_KEY:
                    from app.services.life_engine_service import generate_llm_advice
                    advice = generate_llm_advice(p, data.get("profile", {}), body.feedback)
                else:
                    advice = generate_mock_advice(p, body.feedback)
            except Exception as e:
                logger.error(f"LLM advice failed, using mock: {e}")
                advice = generate_mock_advice(p, body.feedback)

            p["advice"] = advice
            save_project(data)
            return advice

    raise HTTPException(status_code=404, detail="Path not found")


# ── New endpoints: Graph & Agents ──

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


def _build_graph_data(expanded: dict, agents: list) -> dict:
    """Build graph visualization data."""
    from app.services.life_engine_service import _build_graph_from_expansion
    agent_dicts = [a if isinstance(a, dict) else a for a in agents]
    return _build_graph_from_expansion(expanded or {}, agent_dicts)
