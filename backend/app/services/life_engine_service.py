"""
LifePath Engine Service — LLM-powered life path simulation.

This is the core engine that replaces mock data with real LLM-driven simulation,
following MiroFish's paradigm: seed → graph → agents → multi-round simulation → report.

Architecture:
  TREE-BASED BRANCHING — all paths start from a shared root.  When the LLM
  signals a critical decision or opportunity, the engine clones the current
  world-state and forks into 2-3 parallel branches.  This produces an
  authentic decision tree instead of 3 independent lines.

Flow:
  1. Parameter expansion (LLM) — expand user concerns into multi-layer influence factors
  2. Agent generation (LLM) — create agents with personas based on user profile
  3. Multi-round simulation (LLM + rules) — agents act, state updates, branches form
  4. Report & advice generation (LLM) — generate explanatory reports and actionable advice
"""

import json
import copy
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
# 3. MULTI-ROUND SIMULATION — Tree-based branching
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
  "branch_reason": "",
  "branch_choices": ["选项A描述", "选项B描述"]
}

**分支判定指南**：
- 当 Self Agent 面临 A/B 选择时（如保研 vs 就业），设置 should_branch = true
- 当关键机会出现时（如收到 offer），存在接受/拒绝两种路径
- 当风险事件打断主线 — 可产生规避和承受两条分支
- 大约每 3-4 轮应该出现一次分支机会
- branch_choices 中描述每个分支的选择方向（2-3 个选项）"""


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
4. 大约每 3-4 轮会出现一个关键转折，需要设置 should_branch = true"""

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
    result.setdefault("branch_choices", [])

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
# 4. TREE-BASED SIMULATION PIPELINE
# ═══════════════════════════════════════════════════════════════════

class BranchState:
    """Mutable state for a single branch during simulation."""

    def __init__(self, branch_id: str, parent_id: str, label: str,
                 state: dict, history: str, nodes: list, rounds_done: int,
                 tendency: str, state_history: list):
        self.branch_id = branch_id
        self.parent_id = parent_id          # "" for root
        self.label = label                  # human-readable label
        self.state = state                  # current LifeState dict
        self.history = history              # rolling summary string
        self.nodes = nodes                  # list[PathNode-dict]
        self.rounds_done = rounds_done
        self.tendency = tendency            # "balanced" initially
        self.state_history = state_history  # list[dict] for classification
        self.alive = True                   # pruning flag


MAX_LIVE_BRANCHES = 4
MAX_TOTAL_PATHS = 5


def generate_llm_paths(
    project_data: dict,
    rounds: int = 12,
    progress_callback=None,
    agent_count: int = 6,
) -> tuple[list[dict], list[dict], dict]:
    """
    Generate life paths using LLM with TREE-BASED BRANCHING.

    All branches share a common root and diverge at decision points.

    Returns:
        (paths, agents, expanded_factors)
    """
    profile = project_data.get("profile", {}) or {}
    parameters = project_data.get("parameters", [])
    concern = profile.get("current_concern", "人生发展") if profile else "人生发展"

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
        # Limit to requested agent_count
        if len(agents) > agent_count:
            agents = agents[:agent_count]
    except Exception as e:
        logger.error(f"Agent generation failed: {e}")
        agents = _make_fallback_agents()

    if progress_callback:
        progress_callback("agent_generation", 25, f"已生成 {len(agents)} 个智能体")

    # ── Step 3: Tree-based simulation ──
    selected_rounds = min(rounds, 20)

    # Initialize root branch
    root_state = LifeStateSnapshot().model_dump()
    root = BranchState(
        branch_id="root",
        parent_id="",
        label="BASE",
        state=root_state,
        history=f"用户关注：{concern}",
        nodes=[],
        rounds_done=0,
        tendency="balanced",
        state_history=[dict(root_state)],
    )

    live_branches: list[BranchState] = [root]
    finished_branches: list[BranchState] = []
    tree_events: list[dict] = []   # recorded for frontend tree viz

    # Track the last emitted tree node ID per branch for correct parent chaining
    last_tree_node: dict[str, str] = {}  # branch_id -> last tree node id

    # Emit root node
    tree_events.append({
        "type": "add_node",
        "id": "root",
        "parent": None,
        "label": "BASE_INIT",
        "round": 0,
        "time_label": "起点",
        "is_active": True,
    })
    last_tree_node["root"] = "root"

    if progress_callback:
        progress_callback("simulating", 28,
                          f"开始树状推演 — 共 {selected_rounds} 轮, 从共同起点出发...")

    for r in range(selected_rounds):
        year = 2025 + r // 4
        quarter = (r % 4) + 1
        time_label = f"{year}-Q{quarter}"

        if progress_callback:
            pct = 28 + int(60 * (r + 1) / selected_rounds)
            branch_labels = ", ".join(b.label for b in live_branches)
            progress_callback(
                "simulating", pct,
                f"第 {r+1}/{selected_rounds} 轮 — {time_label} | 活跃分支: {branch_labels}"
            )

        next_gen: list[BranchState] = []

        for branch in live_branches:
            if not branch.alive:
                continue

            # ── Run one round for this branch ──
            try:
                round_result = simulate_round(
                    round_num=r + 1,
                    time_label=time_label,
                    agents=agents,
                    current_state=branch.state,
                    profile=profile,
                    history_summary=branch.history,
                    path_tendency=branch.tendency,
                )
            except Exception as e:
                logger.error(f"Round {r+1} failed for branch {branch.branch_id}: {e}")
                # Produce a fallback node and keep going
                fallback_node_id = f"{branch.branch_id}_r{r+1}"
                branch.nodes.append(PathNode(
                    node_type="result",
                    title=f"阶段进展 ({time_label})",
                    description="推演引擎在此轮遇到问题，使用默认进展",
                    time_label=time_label,
                    trigger_reason="系统推演",
                    state_snapshot=LifeStateSnapshot(**branch.state),
                ).model_dump())
                # Still emit tree event for fallback node
                parent_node_id = last_tree_node.get(branch.branch_id, branch.branch_id)
                tree_events.append({
                    "type": "add_node",
                    "id": fallback_node_id,
                    "parent": parent_node_id,
                    "label": f"阶段 {r+1}",
                    "round": r + 1,
                    "time_label": time_label,
                    "is_active": True,
                    "node_type": "result",
                })
                last_tree_node[branch.branch_id] = fallback_node_id
                branch.rounds_done = r + 1
                next_gen.append(branch)
                continue

            actions = round_result.get("actions", [])
            branch.state = update_state_by_rules(branch.state, actions)
            branch.state_history.append(dict(branch.state))
            branch.rounds_done = r + 1

            summary = round_result.get("round_summary", "")
            if summary:
                branch.history += f"\n{time_label}: {summary}"
                lines = branch.history.split("\n")
                if len(lines) > 10:
                    branch.history = lines[0] + "\n" + "\n".join(lines[-8:])

            # Record key event as node
            key_event = round_result.get("key_event")
            if key_event and key_event.get("title"):
                node = PathNode(
                    node_type=key_event.get("type", "result"),
                    title=key_event.get("title", ""),
                    description=key_event.get("description", ""),
                    time_label=time_label,
                    trigger_reason=key_event.get("trigger_reason", ""),
                    state_snapshot=LifeStateSnapshot(**branch.state),
                    agent_actions=[AgentAction(**a) for a in actions[:3]],
                )
                branch.nodes.append(node.model_dump())

                new_node_id = f"{branch.branch_id}_r{r+1}"
                parent_node_id = last_tree_node.get(branch.branch_id, branch.branch_id)

                tree_events.append({
                    "type": "add_node",
                    "id": new_node_id,
                    "parent": parent_node_id,
                    "label": key_event.get("title", "")[:20],
                    "round": r + 1,
                    "time_label": time_label,
                    "is_active": True,
                    "node_type": key_event.get("type", "result"),
                })
                last_tree_node[branch.branch_id] = new_node_id

            # ── Branch Decision ──
            should_branch = round_result.get("should_branch", False)
            choices = round_result.get("branch_choices", [])
            total_live = len(live_branches) + len(next_gen) - len([b for b in next_gen if not b.alive])

            if should_branch and choices and total_live < MAX_LIVE_BRANCHES and len(finished_branches) + total_live < MAX_TOTAL_PATHS:
                # Fork!  Keep at most 2 new children.
                fork_choices = choices[:2]
                tendencies = ["optimal", "risk"]  # assign different tendencies

                if progress_callback:
                    progress_callback(
                        "branch", pct,
                        f"🌿 分支点! {round_result.get('branch_reason', '关键决策')} → {len(fork_choices)} 条新路径"
                    )

                # Determine parent for branch events: use the last emitted tree node
                branch_parent_id = last_tree_node.get(branch.branch_id, branch.branch_id)

                for ci, choice_label in enumerate(fork_choices):
                    child_id = f"br_{gen_id()}"
                    child_tendency = tendencies[ci] if ci < len(tendencies) else "balanced"
                    child = BranchState(
                        branch_id=child_id,
                        parent_id=branch.branch_id,
                        label=choice_label[:30],
                        state=copy.deepcopy(branch.state),
                        history=branch.history + f"\n[分支] {choice_label}",
                        nodes=list(branch.nodes),   # inherit parent nodes
                        rounds_done=r + 1,
                        tendency=child_tendency,
                        state_history=list(branch.state_history),
                    )
                    next_gen.append(child)

                    tree_events.append({
                        "type": "branch",
                        "id": child_id,
                        "parent": branch_parent_id,
                        "label": choice_label[:20],
                        "round": r + 1,
                        "time_label": time_label,
                        "tendency": child_tendency,
                    })
                    # FIXED: New branch's subsequent nodes should chain from the branch node itself
                    # Use branch_parent_id as the last tree node so the first child of this
                    # branch attaches to the correct parent
                    last_tree_node[child_id] = child_id

                # Parent branch is now dead (replaced by children)
                branch.alive = False
            else:
                # No fork — just keep going
                next_gen.append(branch)

        # Collect finished or pruned branches
        for branch in next_gen:
            if not branch.alive:
                finished_branches.append(branch)
        live_branches = [b for b in next_gen if b.alive]

        # If no live branches left, stop early
        if not live_branches:
            break

    # All remaining live branches are also finished
    finished_branches.extend(live_branches)

    # ── Step 4: Convert branches to paths ──
    if progress_callback:
        progress_callback("generating_paths", 90, f"正在整理 {len(finished_branches)} 条路径...")

    paths = []
    for branch in finished_branches:
        if not branch.nodes:
            continue  # skip empty branches
        path_type, risk_level, satisfaction = classify_path(branch.state_history)
        path = LifePath(
            name=_name_path(branch, path_type),
            path_type=path_type,
            summary=f"围绕「{concern}」的路径：通过 {len(branch.nodes)} 个关键节点推演，分支标签「{branch.label}」。",
            risk_level=risk_level,
            satisfaction_score=satisfaction,
            final_state=LifeStateSnapshot(**branch.state),
            nodes=[PathNode(**n) if isinstance(n, dict) else n for n in branch.nodes],
        )
        paths.append(path.model_dump())

    # Sort by satisfaction descending
    paths.sort(key=lambda p: p.get("satisfaction_score", 0), reverse=True)
    paths = paths[:MAX_TOTAL_PATHS]

    # Attach tree_events to project for frontend consumption
    project_data["_tree_events"] = tree_events

    return paths, agents, expanded


def _name_path(branch: BranchState, path_type: str) -> str:
    """Generate a readable path name."""
    type_names = {
        "optimal": "Path Alpha: 最优路径",
        "conservative": "Path Beta: 稳健路径",
        "risk": "Path Gamma: 冒险路径",
        "balanced": "Path Delta: 平衡路径",
    }
    base = type_names.get(path_type, f"Path: {path_type}")
    if branch.label and branch.label != "BASE":
        base += f" ({branch.label[:15]})"
    return base


# ═══════════════════════════════════════════════════════════════════
# 5. PATH CLASSIFICATION
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
# 6. ADVICE GENERATION
# ═══════════════════════════════════════════════════════════════════

ADVICE_SYSTEM_PROMPT = """你是一个人生路径推演引擎的建议专家。

根据推演出的人生路径，为用户提供实质性的、可执行的行动建议。

**如果用户满意这条路径**，输出 JSON：
{
  "mode": "satisfied",
  "title": "标题",
  "immediate_actions": ["建议1", "建议2", "建议3"],
  "mid_term_plan": ["计划1", "计划2", "计划3"],
  "risk_mitigation": ["规避1", "规避2", "规避3"],
  "key_nodes": ["节点1", "节点2", "节点3"]
}

**如果用户不满意这条路径**，输出 JSON：
{
  "mode": "unsatisfied",
  "title": "标题",
  "risk_analysis": ["分析1", "分析2", "分析3"],
  "intervention_points": ["干预1", "干预2", "干预3"],
  "alternative_paths": ["替代1", "替代2", "替代3"],
  "mental_support": ["支持1", "支持2", "支持3"]
}"""


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
# 7. REPORT GENERATION — Project-level summary
# ═══════════════════════════════════════════════════════════════════

REPORT_SYSTEM_PROMPT = """你是一个人生推演引擎的报告生成专家。

请基于多条推演路径的对比，生成一份综合评估报告。报告需要客观地呈现：
1. 不同路径之间的核心差异
2. 关键分叉节点分析
3. 各路径的优势和风险
4. 综合推荐

**输出要求**：输出有效 JSON：
{
  "title": "报告标题",
  "executive_summary": "200字以内的总结概述",
  "path_comparison": [
    {
      "path_name": "路径名",
      "strengths": ["优势1", "优势2"],
      "risks": ["风险1", "风险2"],
      "key_turning_point": "关键转折点描述"
    }
  ],
  "critical_nodes": [
    {
      "time_label": "时间点",
      "description": "这个时间点为什么关键",
      "recommendation": "建议如何应对"
    }
  ],
  "overall_recommendation": "综合推荐建议（100字以内）",
  "next_steps": ["下一步行动1", "下一步行动2", "下一步行动3"]
}"""


def generate_report(project_data: dict) -> dict:
    """Generate a project-level comparison report across all paths."""
    llm = get_llm_client()

    paths = project_data.get("paths", [])
    profile = project_data.get("profile", {}) or {}
    profile_text = _format_profile(profile)

    paths_desc = ""
    for p in paths[:5]:
        nodes_summary = " → ".join(
            n.get("title", "") for n in (p.get("nodes") or [])[:6]
        )
        paths_desc += f"""
### {p.get('name', '')}
- 类型: {p.get('path_type', '')} | 风险: {p.get('risk_level', '')} | 满意度: {p.get('satisfaction_score', 0):.0%}
- 节点链: {nodes_summary}
- 最终状态: {json.dumps(p.get('final_state', {}), ensure_ascii=False)}
"""

    user_msg = f"""## 用户背景
{profile_text}

## 推演路径
{paths_desc}

请生成综合评估报告。"""

    result = llm.chat_json(
        messages=[
            {"role": "system", "content": REPORT_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.4,
        max_tokens=4000,
    )

    result.setdefault("title", "人生路径推演报告")
    result.setdefault("executive_summary", "")
    result.setdefault("path_comparison", [])
    result.setdefault("critical_nodes", [])
    result.setdefault("overall_recommendation", "")
    result.setdefault("next_steps", [])

    return result


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


# ═══════════════════════════════════════════════════════════════════
# 8. BACKTRACK / COUNTERFACTUAL SIMULATION
# ═══════════════════════════════════════════════════════════════════

def run_backtrack_simulation(
    project_data: dict,
    source_path: dict,
    node_index: int,
    modified_state: dict,
    description: str,
    rounds: int,
    progress_callback=None,
) -> tuple[dict, list[dict]]:
    """
    Run a counterfactual simulation branching from a specific node.
    
    Implements §14.2 (可反事实) — "What if I chose differently?"
    and §14.4 (可交互) — "User can modify parameters mid-simulation."
    
    Args:
        project_data: Full project dict
        source_path: The path to branch from
        node_index: Index of the node to branch from
        modified_state: State overrides applied at the branch point
        description: Natural language description of the counterfactual
        rounds: Number of new rounds to simulate
        progress_callback: Progress reporting function
    
    Returns:
        (new_path_dict, tree_events)
    """
    profile = project_data.get("profile", {}) or {}
    agents = project_data.get("agents", [])
    source_nodes = source_path.get("nodes", [])
    concern = profile.get("current_concern", "人生发展") if profile else "人生发展"
    
    # Take nodes up to (and including) the branch point
    inherited_nodes = []
    for i, n in enumerate(source_nodes):
        if i <= node_index:
            inherited_nodes.append(copy.deepcopy(n))
    
    # Build history from inherited nodes
    history_lines = [f"用户关注：{concern}"]
    for n in inherited_nodes:
        history_lines.append(f"{n.get('time_label', '?')}: {n.get('title', '')}")
    if description:
        history_lines.append(f"[回溯修改] {description}")
    history = "\n".join(history_lines[-10:])
    
    # Determine the starting round number and time label from the branch node
    branch_node = inherited_nodes[-1] if inherited_nodes else {}
    branch_time = branch_node.get("time_label", "2026-Q1")
    
    # Parse time label to determine starting round
    start_round = node_index + 1
    
    # Construct initial state from the modified state
    current_state = dict(modified_state)
    state_history = [dict(current_state)]
    
    tree_events = []
    
    # Emit a backtrack root node
    bt_root_id = f"bt_{gen_id()}"
    tree_events.append({
        "type": "branch",
        "id": bt_root_id,
        "parent": None,  # Will be rendered as a standalone tree
        "label": f"回溯: {description[:18]}" if description else "反事实分支",
        "round": start_round,
        "time_label": branch_time,
        "tendency": "counterfactual",
    })
    
    last_node_id = bt_root_id
    new_nodes = list(inherited_nodes)
    
    if progress_callback:
        progress_callback("backtracking", 10, f"回溯到节点 {node_index + 1}，应用修改: {description[:30]}...")
    
    # Run new rounds
    for r in range(rounds):
        # Calculate time label from branch point
        total_round = start_round + r + 1
        year = 2025 + total_round // 4
        quarter = (total_round % 4) + 1
        time_label = f"{year}-Q{quarter}"
        
        if progress_callback:
            pct = 10 + int(80 * (r + 1) / rounds)
            progress_callback(
                "backtracking", pct,
                f"回溯推演 第 {r+1}/{rounds} 轮 — {time_label}"
            )
        
        try:
            round_result = simulate_round(
                round_num=total_round,
                time_label=time_label,
                agents=agents,
                current_state=current_state,
                profile=profile,
                history_summary=history,
                path_tendency="counterfactual",
            )
        except Exception as e:
            logger.error(f"Backtrack round {r+1} failed: {e}")
            # Produce a fallback node
            fallback_node = PathNode(
                node_type="result",
                title=f"回溯进展 ({time_label})",
                description="回溯推演在此轮遇到问题，使用默认进展",
                time_label=time_label,
                trigger_reason="回溯推演",
                state_snapshot=LifeStateSnapshot(**current_state),
            ).model_dump()
            new_nodes.append(fallback_node)
            continue
        
        actions = round_result.get("actions", [])
        current_state = update_state_by_rules(current_state, actions)
        state_history.append(dict(current_state))
        
        summary = round_result.get("round_summary", "")
        if summary:
            history += f"\n{time_label}: {summary}"
            lines = history.split("\n")
            if len(lines) > 10:
                history = lines[0] + "\n" + "\n".join(lines[-8:])
        
        # Record key event as node
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
            new_nodes.append(node.model_dump())
            
            new_node_id = f"{bt_root_id}_r{r+1}"
            tree_events.append({
                "type": "add_node",
                "id": new_node_id,
                "parent": last_node_id,
                "label": key_event.get("title", "")[:20],
                "round": total_round,
                "time_label": time_label,
                "is_active": True,
                "node_type": key_event.get("type", "result"),
            })
            last_node_id = new_node_id
    
    if progress_callback:
        progress_callback("generating_paths", 92, "正在整理回溯路径...")
    
    # Build the new path
    path_type, risk_level, satisfaction = classify_path(state_history)
    desc_short = description[:20] if description else "反事实"
    
    new_path = LifePath(
        name=f"回溯路径: {desc_short}",
        path_type="counterfactual",
        summary=f"从原路径节点 {node_index + 1} 回溯，修改条件「{description}」后重新推演，经过 {rounds} 轮得到的反事实路径。",
        risk_level=risk_level,
        satisfaction_score=satisfaction,
        final_state=LifeStateSnapshot(**current_state),
        nodes=[PathNode(**n) if isinstance(n, dict) else n for n in new_nodes],
    ).model_dump()
    
    return new_path, tree_events
