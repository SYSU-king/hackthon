"""
LifePath Engine Service — LLM-powered life path simulation.

This is the core engine that replaces mock data with real LLM-driven simulation,
following MiroFish's paradigm: seed → graph → agents → multi-round simulation → report.

Flow:
  1. Parameter expansion (LLM) — expand user concerns into multi-layer influence factors
  2. Agent generation (LLM) — create agents with personas based on user profile
  3. Multi-round simulation (LLM + rules) — agents act, state updates, branches form
  4. Report & advice generation (LLM) — generate explanatory reports and actionable advice
"""

import json
import random
import logging
from typing import Optional
from app.core.llm import get_llm_client, LLMClient
from app.domain.models import (
    Agent, AgentAction, SimulationRound, PathNode,
    LifePath, LifeStateSnapshot, gen_id,
)

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════
# 1. PARAMETER EXPANSION — LLM expands user concerns into factors
# ═══════════════════════════════════════════════════════════════════

EXPANSION_SYSTEM_PROMPT = """你是一个人生路径推演系统的参数发散专家。

用户会告诉你他当前最关心的问题（关注参数），你需要自动发散出影响该问题的多层因素。

**输出要求**：输出有效 JSON，格式如下：
{
  "core_concern": "用户核心关注点",
  "influence_factors": [
    {
      "name": "因素名称",
      "category": "分类（education/career/finance/family/health/social/environment）",
      "impact": "high/medium/low",
      "description": "该因素如何影响用户关注的问题",
      "sub_factors": ["子因素1", "子因素2"]
    }
  ],
  "causal_chains": [
    {
      "from": "因素A",
      "to": "因素B",
      "relation": "influences/constrains/enables/conflicts_with",
      "description": "因果关系描述"
    }
  ],
  "recommended_agents": ["Self", "Family", "Mentor", "School", "Employer", "City", "Industry", "Risk"]
}

要求至少发散出 8-12 个影响因素，和 6-10 条因果链。"""


def expand_parameters(profile: dict, parameters: list[dict]) -> dict:
    """Use LLM to expand user concerns into multi-layer influence factors."""
    llm = get_llm_client()

    concern_text = ", ".join([p.get("name", "") for p in parameters])
    priority_text = "\n".join([
        f"- {p.get('name', '')}: {p.get('description', '')} (优先级: {p.get('priority', 'primary')})"
        for p in parameters
    ])

    profile_text = _format_profile(profile)

    user_msg = f"""## 用户背景
{profile_text}

## 关注参数
{priority_text}

## 核心关注点
{concern_text}

请发散出影响上述问题的多层因素和因果链。"""

    result = llm.chat_json(
        messages=[
            {"role": "system", "content": EXPANSION_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.4,
        max_tokens=4096,
    )

    # Validate
    result.setdefault("influence_factors", [])
    result.setdefault("causal_chains", [])
    result.setdefault("recommended_agents", ["Self", "Family", "Mentor", "Employer"])

    return result


# ═══════════════════════════════════════════════════════════════════
# 2. AGENT GENERATION — Create personas for simulation agents
# ═══════════════════════════════════════════════════════════════════

AGENT_SYSTEM_PROMPT = """你是一个多智能体人生推演系统的角色设计专家。

根据用户的背景和关注参数，为指定的 Agent 类型生成详细的人设档案。

**输出要求**：输出有效 JSON，格式如下：
{
  "agents": [
    {
      "agent_type": "类型",
      "name": "角色名称（具体化，如'王教授'而不是'导师'）",
      "persona": "2-3句话描述这个角色的性格、立场、行为倾向",
      "stance": "对用户发展的基本态度（supportive/neutral/demanding/restrictive）",
      "resources": "这个角色能提供的资源（如经济支持、学术指导、职业机会等）",
      "influence": 0.0到1.0的影响力数值
    }
  ]
}

**Agent 类型说明**：
- Self: 用户本人，持有能力、偏好、目标
- Family: 家人，提供支持/压力/约束
- Mentor: 导师/前辈，提供指导和机会
- Partner: 伴侣，影响生活决策
- School: 学校/院系，提供学术环境和规则
- Employer: 公司/雇主，提供职业机会
- City: 城市，代表地域机会和生活成本
- Industry: 行业/赛道，代表市场景气度
- Risk: 风险源，触发健康/经济/家庭突发事件

每个 Agent 的人设要**贴合用户背景**，具体、有个性、有差异化立场。"""


def generate_agents(profile: dict, parameters: list[dict], expanded: dict) -> list[dict]:
    """Use LLM to generate agent personas for simulation."""
    llm = get_llm_client()

    recommended = expanded.get("recommended_agents", ["Self", "Family", "Mentor", "Employer", "School", "Risk"])
    profile_text = _format_profile(profile)
    concern_text = ", ".join([p.get("name", "") for p in parameters])

    user_msg = f"""## 用户背景
{profile_text}

## 核心关注
{concern_text}

## 需要生成的 Agent 类型
{', '.join(recommended)}

## 影响因素
{json.dumps([f.get('name', '') for f in expanded.get('influence_factors', [])], ensure_ascii=False)}

请为每种 Agent 类型生成一个具体的角色。"""

    result = llm.chat_json(
        messages=[
            {"role": "system", "content": AGENT_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.5,
        max_tokens=4096,
    )

    agents = result.get("agents", [])
    # Ensure each agent has an ID
    for a in agents:
        a.setdefault("agent_id", gen_id())
        a.setdefault("active", True)

    return agents


# ═══════════════════════════════════════════════════════════════════
# 3. MULTI-ROUND SIMULATION — LLM-driven agent actions + rule state
# ═══════════════════════════════════════════════════════════════════

ROUND_SYSTEM_PROMPT = """你是一个人生推演引擎。当前正在进行多轮人生推演模拟。

你需要为活跃的 Agent 生成本轮的行动，并判断是否产生重要事件。

**每个 Agent 的行动必须是以下类型之一**：
- MAKE_DECISION: Self 做出选择（保研/就业/换城市等）
- PROVIDE_OPPORTUNITY: 提供机会（名额/offer/资源）
- APPLY_PRESSURE: 施加压力或提出期望
- GIVE_SUPPORT: 提供支持（经济/情感/资源）
- WITHDRAW_SUPPORT: 减少支持
- CHANGE_CONDITION: 改变外部条件
- TRIGGER_RISK: 触发风险事件
- REFLECT: 阶段反思
- DO_NOTHING: 本轮无行动

**输出要求**：输出有效 JSON：
{
  "actions": [
    {
      "agent_id": "agent的ID",
      "agent_type": "Agent类型",
      "action_type": "行动类型",
      "target_agent": "影响目标（通常是self）",
      "payload": {
        "affected_states": ["受影响的状态维度"],
        "delta_direction": "positive/negative",
        "intensity": 0.1到0.5
      },
      "narrative": "用1-2句话描述这个行动的具体内容（要有故事感）"
    }
  ],
  "round_summary": "本轮发生的关键事件概括（1-2句话）",
  "key_event": {
    "type": "decision/opportunity/result/cascade/risk/reflection",
    "title": "事件标题",
    "description": "事件详细描述",
    "trigger_reason": "触发原因"
  },
  "should_branch": false,
  "branch_reason": ""
}"""


def simulate_round(
    round_num: int,
    time_label: str,
    agents: list[dict],
    current_state: dict,
    profile: dict,
    history_summary: str,
    path_tendency: str = "balanced",
) -> dict:
    """Run one simulation round using LLM."""
    llm = get_llm_client()

    active_agents = [a for a in agents if a.get("active", True)]
    # Select 3-6 active agents per round
    if len(active_agents) > 6:
        active_agents = random.sample(active_agents, 6)

    agents_desc = "\n".join([
        f"- [{a.get('agent_type')}] {a.get('name')}: {a.get('persona', '')[:80]}"
        for a in active_agents
    ])

    state_desc = json.dumps(current_state, ensure_ascii=False, indent=2)

    user_msg = f"""## 当前时间
{time_label}（第 {round_num} 轮）

## 路径倾向
{path_tendency}（最优/保守/冒险）

## 当前人生状态
{state_desc}

## 活跃 Agent
{agents_desc}

## 历史摘要
{history_summary}

请为每个活跃 Agent 生成行动。注意：
1. 行动内容要切合当前时间点和状态
2. 不同路径倾向下 Agent 的行动应有差异
3. Self Agent 的决策要合理，符合人物性格
4. 大约每 3-4 轮会出现一个关键转折"""

    result = llm.chat_json(
        messages=[
            {"role": "system", "content": ROUND_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.6,
        max_tokens=3000,
    )

    result.setdefault("actions", [])
    result.setdefault("round_summary", "")
    result.setdefault("key_event", None)
    result.setdefault("should_branch", False)

    return result


def update_state_by_rules(current_state: dict, actions: list[dict]) -> dict:
    """Update life state using rule-based calculations (70% of state update logic)."""
    new_state = dict(current_state)

    STATE_KEYS = [
        "education", "career", "finance", "health", "mental",
        "relationship", "family_support", "social_capital",
        "optionality", "goal_alignment",
    ]

    for action in actions:
        payload = action.get("payload", {})
        affected = payload.get("affected_states", [])
        direction = payload.get("delta_direction", "positive")
        intensity = min(max(payload.get("intensity", 0.1), 0.05), 0.3)
        sign = 1.0 if direction == "positive" else -1.0

        # Map action affected_states to state keys
        for state_key in affected:
            key = state_key.lower().replace(" ", "_")
            if key in STATE_KEYS:
                delta = sign * intensity * random.uniform(0.7, 1.3)
                new_state[key] = min(max(new_state.get(key, 0.5) + delta, 0.0), 1.0)

        # Action-type based rules
        action_type = action.get("action_type", "DO_NOTHING")
        if action_type == "TRIGGER_RISK":
            new_state["health"] = max(new_state.get("health", 0.8) - 0.1, 0.2)
            new_state["mental"] = max(new_state.get("mental", 0.6) - 0.15, 0.2)
        elif action_type == "GIVE_SUPPORT":
            new_state["family_support"] = min(new_state.get("family_support", 0.7) + 0.05, 1.0)
        elif action_type == "WITHDRAW_SUPPORT":
            new_state["family_support"] = max(new_state.get("family_support", 0.7) - 0.1, 0.1)
        elif action_type == "PROVIDE_OPPORTUNITY":
            new_state["optionality"] = min(new_state.get("optionality", 0.8) + 0.05, 1.0)

    return new_state


# ═══════════════════════════════════════════════════════════════════
# 4. PATH CLASSIFICATION — Classify generated path type
# ═══════════════════════════════════════════════════════════════════

def classify_path(state_history: list[dict]) -> tuple[str, str, float]:
    """Classify a path as optimal/conservative/risk based on final state."""
    if not state_history:
        return "balanced", "medium", 0.5

    final = state_history[-1]
    score = (
        final.get("career", 0) * 0.2
        + final.get("finance", 0) * 0.15
        + final.get("education", 0) * 0.15
        + final.get("health", 0) * 0.1
        + final.get("mental", 0) * 0.1
        + final.get("goal_alignment", 0) * 0.15
        + final.get("optionality", 0) * 0.15
    )

    variance = sum(
        abs(state_history[-1].get(k, 0.5) - state_history[0].get(k, 0.5))
        for k in ["career", "finance", "health", "mental"]
    ) / 4

    if score > 0.65:
        return "optimal", "low", min(score, 0.95)
    elif variance > 0.3:
        return "risk", "high", max(score * 0.8, 0.3)
    else:
        return "conservative", "low", score * 0.9


# ═══════════════════════════════════════════════════════════════════
# 5. ADVICE GENERATION — LLM-powered actionable advice
# ═══════════════════════════════════════════════════════════════════

ADVICE_SYSTEM_PROMPT = """你是一个人生路径推演引擎的建议专家。

根据推演出的人生路径，为用户提供实质性的、可执行的行动建议。

**如果用户满意这条路径**，输出：
- 路径成真的前提条件
- 近期（1个月内）该做的事
- 中期（3个月）布局
- 需要规避的风险
- 关键节点提醒

**如果用户不满意这条路径**，输出：
- 风险成因分析
- 最值得干预的节点
- 替代路径建议
- 可逆条件分析
- 心理和行动层面应对方案

输出有效 JSON 格式。"""


def generate_llm_advice(path_data: dict, profile: dict, feedback: str = "satisfied") -> dict:
    """Generate LLM-powered advice for a specific path."""
    llm = get_llm_client()

    path_name = path_data.get("name", "")
    nodes_desc = "\n".join([
        f"- [{n.get('time_label', '')}] {n.get('title', '')}: {n.get('description', '')}"
        for n in path_data.get("nodes", [])[:10]
    ])

    final_state = path_data.get("final_state", {})
    profile_text = _format_profile(profile)

    user_msg = f"""## 用户背景
{profile_text}

## 路径名称
{path_name}

## 路径关键节点
{nodes_desc}

## 最终状态
{json.dumps(final_state, ensure_ascii=False)}

## 用户反馈
{"满意这条路径，想知道如何落地" if feedback == "satisfied" else "不满意这条路径，想知道如何改善"}

请生成详细的行动建议。"""

    result = llm.chat_json(
        messages=[
            {"role": "system", "content": ADVICE_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.5,
        max_tokens=3000,
    )

    result["mode"] = feedback
    result.setdefault("title", f"{'落地' if feedback == 'satisfied' else '改善'}「{path_name}」的建议")

    return result


# ═══════════════════════════════════════════════════════════════════
# 6. FULL PIPELINE — Generate complete life paths
# ═══════════════════════════════════════════════════════════════════

def generate_llm_paths(
    project_data: dict,
    rounds: int = 12,
    progress_callback=None,
) -> tuple[list[dict], list[dict], dict]:
    """
    Generate life paths using LLM.

    Returns:
        (paths, agents, expanded_factors)
    """
    profile = project_data.get("profile", {}) or {}
    parameters = project_data.get("parameters", [])

    # ── Step 1: Expand Parameters ──
    if progress_callback:
        progress_callback("parameter_expansion", 5, "正在用 AI 发散影响因素...")

    try:
        expanded = expand_parameters(profile, parameters)
    except Exception as e:
        logger.error(f"Parameter expansion failed: {e}")
        expanded = {"influence_factors": [], "causal_chains": [], "recommended_agents": ["Self", "Family", "Mentor", "Employer"]}

    if progress_callback:
        n_factors = len(expanded.get("influence_factors", []))
        progress_callback("parameter_expansion", 15, f"AI 发散出 {n_factors} 个影响因素")

    # ── Step 2: Generate Agents ──
    if progress_callback:
        progress_callback("agent_generation", 18, "正在生成智能体角色...")

    try:
        agents = generate_agents(profile, parameters, expanded)
    except Exception as e:
        logger.error(f"Agent generation failed: {e}")
        agents = _make_fallback_agents()

    if progress_callback:
        progress_callback("agent_generation", 25, f"已生成 {len(agents)} 个智能体")

    # ── Step 3: Build graph data for frontend ──
    graph_data = _build_graph_from_expansion(expanded, agents)

    # ── Step 4: Multi-path simulation (PARALLEL) ──
    path_configs = [
        ("optimal", "Path Alpha: 最优路径"),
        ("conservative", "Path Beta: 稳健路径"),
        ("risk", "Path Gamma: 冒险路径"),
    ]

    concern = profile.get("current_concern", "人生发展")
    selected_rounds = min(rounds, 8)

    def _simulate_single_path(path_idx, tendency, path_name):
        """Simulate one path — runs in its own thread."""
        if progress_callback:
            base_progress = 25 + path_idx * 20
            progress_callback("simulating", base_progress, f"正在推演「{path_name}」...")

        current_state = LifeStateSnapshot().model_dump()
        history_summary = f"用户关注：{concern}"
        state_history = [dict(current_state)]
        nodes = []
        sim_rounds = []

        for r in range(selected_rounds):
            year = 2025 + r // 4
            quarter = (r % 4) + 1
            time_label = f"{year}-Q{quarter}"

            if progress_callback:
                rnd_progress = base_progress + int(18 * (r + 1) / selected_rounds)
                progress_callback("simulating", rnd_progress, f"推演「{path_name}」第 {r+1}/{selected_rounds} 轮 — {time_label}")

            try:
                round_result = simulate_round(
                    round_num=r + 1,
                    time_label=time_label,
                    agents=agents,
                    current_state=current_state,
                    profile=profile,
                    history_summary=history_summary,
                    path_tendency=tendency,
                )

                actions = round_result.get("actions", [])
                current_state = update_state_by_rules(current_state, actions)
                state_history.append(dict(current_state))

                summary = round_result.get("round_summary", "")
                if summary:
                    history_summary = f"{history_summary}\n{time_label}: {summary}"
                    lines = history_summary.split("\n")
                    if len(lines) > 8:
                        history_summary = lines[0] + "\n" + "\n".join(lines[-6:])

                key_event = round_result.get("key_event")
                if key_event and key_event.get("title"):
                    node = PathNode(
                        node_type=key_event.get("type", "result"),
                        title=key_event.get("title", ""),
                        description=key_event.get("description", ""),
                        time_label=time_label,
                        trigger_reason=key_event.get("trigger_reason", ""),
                        state_snapshot=LifeStateSnapshot(**current_state),
                        agent_actions=[AgentAction(**a) for a in actions[:3]],
                    )
                    nodes.append(node)

                sim_round = SimulationRound(
                    round_num=r + 1,
                    time_label=time_label,
                    actions=[AgentAction(**a) for a in actions],
                    state_after=LifeStateSnapshot(**current_state),
                    events_summary=summary,
                    branch_triggered=round_result.get("should_branch", False),
                )
                sim_rounds.append(sim_round)

            except Exception as e:
                logger.error(f"Round {r+1} simulation failed for {tendency}: {e}")
                nodes.append(PathNode(
                    node_type="result",
                    title=f"阶段进展 ({time_label})",
                    description="推演引擎在此轮遇到问题，使用默认进展",
                    time_label=time_label,
                    trigger_reason="系统推演",
                    state_snapshot=LifeStateSnapshot(**current_state),
                ))

        path_type, risk_level, satisfaction = classify_path(state_history)

        path = LifePath(
            name=path_name,
            path_type=path_type,
            summary=f"围绕「{concern}」的{path_name}：通过 {len(nodes)} 个关键节点推演未来 {selected_rounds // 4 + 1} 年的发展路径。",
            risk_level=risk_level,
            satisfaction_score=satisfaction,
            final_state=LifeStateSnapshot(**current_state),
            nodes=nodes,
            rounds=sim_rounds,
        )
        return path.model_dump()

    # Run all 3 paths in parallel threads
    import concurrent.futures
    if progress_callback:
        progress_callback("simulating", 25, "三条路径并发推演中...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures = [
            pool.submit(_simulate_single_path, idx, tendency, path_name)
            for idx, (tendency, path_name) in enumerate(path_configs)
        ]
        paths = [f.result() for f in concurrent.futures.as_completed(futures)]

    return paths, agents, expanded


# ═══════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════

def _format_profile(profile: dict) -> str:
    """Format user profile into readable text."""
    if not profile:
        return "未提供详细背景"

    parts = []
    field_names = {
        "personality_type": "性格类型",
        "education_stage": "教育阶段",
        "school": "学校",
        "major": "专业",
        "gpa_range": "成绩区间",
        "family_economy": "家庭经济",
        "family_expectation": "家庭期望",
        "city_preference": "城市偏好",
        "career_preference": "职业偏好",
        "risk_preference": "风险偏好",
        "current_concern": "当前困惑",
    }
    for key, label in field_names.items():
        val = profile.get(key, "")
        if val:
            parts.append(f"- {label}: {val}")

    return "\n".join(parts) if parts else "未提供详细背景"


def _make_fallback_agents() -> list[dict]:
    """Create basic agents when LLM fails."""
    return [
        {"agent_id": gen_id(), "agent_type": "Self", "name": "我", "persona": "用户本人", "stance": "neutral", "resources": "个人能力与努力", "influence": 1.0, "active": True},
        {"agent_id": gen_id(), "agent_type": "Family", "name": "家人", "persona": "关心用户发展的家庭成员", "stance": "supportive", "resources": "经济与情感支持", "influence": 0.7, "active": True},
        {"agent_id": gen_id(), "agent_type": "Mentor", "name": "导师", "persona": "学术导师，提供指导", "stance": "neutral", "resources": "学术资源与推荐", "influence": 0.6, "active": True},
        {"agent_id": gen_id(), "agent_type": "Employer", "name": "目标企业", "persona": "潜在雇主", "stance": "neutral", "resources": "职业机会", "influence": 0.5, "active": True},
    ]


def _build_graph_from_expansion(expanded: dict, agents: list[dict]) -> dict:
    """Build frontend-renderable graph data from expansion results."""
    nodes = []
    edges = []

    # Center node: Self
    nodes.append({
        "id": "self",
        "name": "我",
        "type": "Self",
        "group": "self",
        "size": 30,
    })

    # Agent nodes
    for a in agents:
        if a.get("agent_type") != "Self":
            node_id = a.get("agent_id", gen_id())
            nodes.append({
                "id": node_id,
                "name": a.get("name", a.get("agent_type", "")),
                "type": a.get("agent_type", "Person"),
                "group": "agent",
                "size": 20,
                "persona": a.get("persona", ""),
            })
            edges.append({
                "source": node_id,
                "target": "self",
                "relation": "INFLUENCES",
                "label": a.get("stance", "influences"),
            })

    # Factor nodes
    for i, factor in enumerate(expanded.get("influence_factors", [])):
        fid = f"factor_{i}"
        nodes.append({
            "id": fid,
            "name": factor.get("name", ""),
            "type": "Factor",
            "group": factor.get("category", "environment"),
            "size": 12,
            "impact": factor.get("impact", "medium"),
        })
        edges.append({
            "source": fid,
            "target": "self",
            "relation": "INFLUENCES",
            "label": factor.get("impact", "medium"),
        })

    # Causal chain edges
    factor_name_map = {}
    for i, f in enumerate(expanded.get("influence_factors", [])):
        factor_name_map[f.get("name", "")] = f"factor_{i}"

    for chain in expanded.get("causal_chains", []):
        src = factor_name_map.get(chain.get("from", ""))
        tgt = factor_name_map.get(chain.get("to", ""))
        if src and tgt:
            edges.append({
                "source": src,
                "target": tgt,
                "relation": chain.get("relation", "influences"),
                "label": chain.get("description", "")[:30],
            })

    return {"nodes": nodes, "edges": edges}
