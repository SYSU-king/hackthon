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
import re
from typing import Optional, Any
from app.core.llm import get_llm_client, LLMClient
from app.domain.models import (
    Agent, AgentAction, SimulationRound, PathNode,
    LifePath, LifeStateSnapshot, gen_id,
)

logger = logging.getLogger(__name__)


STATE_LABELS = {
    "education": "学业",
    "career": "职业",
    "finance": "财务",
    "health": "健康",
    "mental": "心理",
    "relationship": "关系",
    "family_support": "家庭支持",
    "social_capital": "社会资本",
    "optionality": "选择空间",
    "goal_alignment": "目标一致性",
}


def _compact_state_snapshot(state: dict | None) -> list[dict]:
    if not state:
        return []

    ranked = sorted(
        state.items(),
        key=lambda item: abs(item[1] - 0.5) if isinstance(item[1], (int, float)) else 0,
        reverse=True,
    )[:4]
    return [
        {
            "key": key,
            "label": STATE_LABELS.get(key, key),
            "value": round(float(value), 2),
            "percent": int(round(float(value) * 100)),
        }
        for key, value in ranked
        if isinstance(value, (int, float))
    ]


def _tree_event_detail(
    event_type: str,
    event_id: str,
    parent: str | None,
    label: str,
    round_num: int,
    time_label: str,
    node_type: str,
    description: str = "",
    trigger_reason: str = "",
    tendency: str = "",
    state_snapshot: dict | None = None,
    agent_actions: list[dict] | None = None,
    source_path_id: str = "",
    source_node_index: int | None = None,
) -> dict:
    actions = agent_actions or []
    return {
        "type": event_type,
        "id": event_id,
        "parent": parent,
        "label": label,
        "round": round_num,
        "time_label": time_label,
        "is_active": True,
        "node_type": node_type,
        "tendency": tendency,
        "description": description,
        "trigger_reason": trigger_reason,
        "state_snapshot": state_snapshot or {},
        "state_summary": _compact_state_snapshot(state_snapshot),
        "agent_actions": actions[:4],
        "source_path_id": source_path_id,
        "source_node_index": source_node_index,
    }


def _resolve_source_tree_node_id(project_data: dict, source_path: dict, node_index: int) -> str | None:
    source_nodes = source_path.get("nodes", [])
    if 0 <= node_index < len(source_nodes):
        node = source_nodes[node_index] or {}
        tree_node_id = node.get("tree_node_id")
        if tree_node_id:
            return tree_node_id

        title = node.get("title", "")
        time_label = node.get("time_label", "")
        for evt in reversed(project_data.get("_tree_events", [])):
            if evt.get("type") != "add_node":
                continue
            if evt.get("time_label") == time_label and evt.get("label") == title:
                return evt.get("id")

    return None


def _normalize_report_title(title: str) -> str:
    cleaned = re.sub(r"[（(][^）)]*[）)]", "", (title or "").strip())
    cleaned = cleaned.replace("《", "").replace("》", "").strip()
    if not cleaned:
        return "综合报告"

    for separator in ("：", ":", "-", "—", "|", "（"):
        if separator in cleaned:
            cleaned = cleaned.split(separator)[0].strip()
            break

    if len(cleaned) > 14:
        cleaned = cleaned[:14].rstrip()

    return cleaned or "综合报告"


def _format_parameters_for_context(parameters: list[dict], limit: int = 5) -> str:
    if not parameters:
        return "- 未提供关注参数"
    lines = []
    for param in parameters[:limit]:
        name = param.get("name", "") or "未命名参数"
        priority = param.get("priority", "primary")
        weight = param.get("weight", 1.0)
        desc = param.get("description", "")
        suffix = f"｜priority={priority}｜weight={weight}"
        if desc:
            suffix += f"｜{desc}"
        lines.append(f"- {name}{suffix}")
    return "\n".join(lines)


def _normalize_context_parameters(parameters: list[dict] | None) -> list[dict]:
    normalized = []
    for param in parameters or []:
        if not isinstance(param, dict):
            continue
        name = (param.get("name") or "").strip()
        if not name:
            continue
        priority = param.get("priority", "primary")
        weight = param.get("weight", 1.0)
        try:
            weight = float(weight)
        except (TypeError, ValueError):
            weight = 1.0
        normalized.append({
            "name": name,
            "description": (param.get("description") or "").strip(),
            "priority": priority if priority in {"primary", "secondary", "constraint"} else "secondary",
            "weight": max(0.0, min(weight, 1.0)),
        })
    return normalized[:6]


def _summarize_agent_pool(agents: list[dict], limit: int = 8) -> str:
    if not agents:
        return "- 暂无 Agent"
    lines = []
    for agent in agents[:limit]:
        agent_type = agent.get("agent_type", "Agent")
        name = agent.get("name", agent_type)
        stance = agent.get("stance", "neutral")
        persona = (agent.get("persona", "") or "").strip()
        snippet = persona[:40] + ("…" if len(persona) > 40 else "")
        lines.append(f"- [{agent_type}] {name}｜{stance}" + (f"｜{snippet}" if snippet else ""))
    return "\n".join(lines)


def _create_layered_context(
    profile: dict,
    parameters: list[dict],
    concern: str,
    agents: list[dict],
    long_term_memory: list[str] | None = None,
    recent_details: list[dict] | None = None,
) -> dict[str, Any]:
    profile_text = _format_profile(profile)
    return {
        "background": "\n".join([
            "## 固定背景",
            f"核心关注：{concern}",
            "未来的你画像：",
            profile_text,
            "关注参数：",
            _format_parameters_for_context(parameters),
            "主要角色池：",
            _summarize_agent_pool(agents),
        ]),
        "current_parameters": _normalize_context_parameters(parameters),
        "long_term_memory": list(long_term_memory or []),
        "recent_details": list(recent_details or []),
    }


def _append_long_term_memory(context: dict[str, Any], line: str, limit: int = 8) -> None:
    if not line:
        return
    memory = context.setdefault("long_term_memory", [])
    memory.append(line)
    if len(memory) > limit:
        del memory[:-limit]


def _append_recent_detail(
    context: dict[str, Any],
    *,
    time_label: str,
    round_num: int,
    summary: str = "",
    key_event: dict | None = None,
    actions: list[dict] | None = None,
    limit: int = 3,
) -> None:
    entry = {
        "time_label": time_label,
        "round_num": round_num,
        "summary": summary or "",
        "key_event_title": (key_event or {}).get("title", ""),
        "key_event_type": (key_event or {}).get("type", ""),
        "actions": [
            {
                "agent_type": action.get("agent_type", "Agent"),
                "action_type": action.get("action_type", "ACTION"),
                "narrative": action.get("narrative", ""),
            }
            for action in (actions or [])[:3]
        ],
    }
    recent = context.setdefault("recent_details", [])
    recent.append(entry)
    if len(recent) > limit:
        del recent[:-limit]


def _render_long_term_memory(context: dict[str, Any]) -> str:
    memory = context.get("long_term_memory") or []
    if not memory:
        return "- 暂无长期记忆"
    return "\n".join(f"- {line}" for line in memory)


def _render_recent_details(context: dict[str, Any]) -> str:
    recent = context.get("recent_details") or []
    if not recent:
        return "- 暂无近期细节"

    blocks = []
    for item in recent[-3:]:
        action_text = "；".join(
            f"{action['agent_type']}:{action['action_type']}"
            for action in item.get("actions", [])
        ) or "无显著动作"
        key_event = item.get("key_event_title") or "无显著事件"
        summary = item.get("summary") or "本轮无额外摘要"
        blocks.append(
            f"- Round {item.get('round_num', '?')} / {item.get('time_label', '?')}｜事件={key_event}｜摘要={summary}｜动作={action_text}"
        )
    return "\n".join(blocks)


def _render_current_parameters(context: dict[str, Any]) -> str:
    return _format_parameters_for_context(context.get("current_parameters") or [])


def _apply_parameter_evolution(
    context: dict[str, Any],
    evolution: dict | None,
    *,
    time_label: str,
) -> str:
    if not evolution or not evolution.get("should_update"):
        return ""

    updated_parameters = _normalize_context_parameters(evolution.get("updated_parameters"))
    if not updated_parameters:
        return ""

    context["current_parameters"] = updated_parameters
    focus_change = (evolution.get("focus_change") or "").strip()
    rationale = (evolution.get("rationale") or "").strip()
    memory = f"{time_label}｜主参数更新：{focus_change or updated_parameters[0]['name']}"
    if rationale:
        memory += f"｜{rationale[:80]}"
    _append_long_term_memory(context, memory)
    return focus_change or "主参数已根据推演进展更新"


def _compose_round_context(
    *,
    time_label: str,
    round_num: int,
    path_tendency: str,
    current_state: dict,
    active_agents: list[dict],
    layered_context: dict[str, Any],
) -> str:
    state_desc = json.dumps(current_state, ensure_ascii=False, indent=2)
    background_block = layered_context.get("background") or "## 固定背景\n- 暂无背景"
    active_agents_desc = "\n".join([
        f"- [{agent.get('agent_type', 'Agent')}] {agent.get('name', agent.get('agent_type', 'Agent'))}: {(agent.get('persona', '') or '')[:80]}"
        for agent in active_agents
    ]) or "- 暂无活跃 Agent"

    return f"""## 当前时间
{time_label}（第 {round_num} 轮）

## 路径倾向
{path_tendency}（最优/保守/冒险）

{background_block}

## 长期记忆层
{_render_long_term_memory(layered_context)}

## 近期细节层
{_render_recent_details(layered_context)}

## 当前主参数层
{_render_current_parameters(layered_context)}

## 当前人生状态层
{state_desc}

## 当前活跃 Agent 层
{active_agents_desc}"""


def _bootstrap_context_from_nodes(
    profile: dict,
    parameters: list[dict],
    concern: str,
    agents: list[dict],
    nodes: list[dict],
    extra_memory: list[str] | None = None,
) -> dict[str, Any]:
    context = _create_layered_context(profile, parameters, concern, agents)
    for idx, node in enumerate(nodes):
        title = node.get("title", "")
        if not title:
            continue
        time_label = node.get("time_label", "?")
        trigger_reason = node.get("trigger_reason", "") or node.get("description", "")[:60] or "历史节点"
        if idx < max(0, len(nodes) - 3):
            _append_long_term_memory(
                context,
                f"{time_label}｜{title}｜{trigger_reason}",
            )
        _append_recent_detail(
            context,
            time_label=time_label,
            round_num=idx + 1,
            summary=node.get("description", ""),
            key_event={"title": title, "type": node.get("node_type", ""), "trigger_reason": trigger_reason},
            actions=node.get("agent_actions", []),
        )

    for line in extra_memory or []:
        _append_long_term_memory(context, line)

    return context


# ═══════════════════════════════════════════════════════════════════
# 1. PARAMETER EXPANSION — LLM expands user concerns into factors
# ═══════════════════════════════════════════════════════════════════

EXPANSION_SYSTEM_PROMPT = """你是一个人生路径推演系统的参数发散专家。

用户会告诉你他当前最关心的问题（关注参数），你需要自动发散出影响“未来的你”的多层因素。
··注意：不要仅仅局限于学业、就业和财务问题！你必须发散出一个“活生生的人”的参数，包括情感状态、家庭关系、人际交往、身体/心理健康、以及生活中的随机事件或顿悟。

严格约束：
1. 不要凭空捏造用户姓名、家人姓名、导师姓名或任何未提供的人名。
2. 推演主角统一称为“未来的你”，不要使用“本人”“用户本人”“当事人”等表述。
3. 必须包含至少3个人情味/情感向的分类因素（例如 family/health/social/emotion/mental）。
4. 所有因素和因果链都必须从用户已提供的信息合理外推，不能补充未经提供的传记细节，但可以推演合理的生活发展。

**输出要求**：输出有效 JSON，格式如下：
{
  "core_concern": "用户核心关注点",
  "influence_factors": [
    {
      "name": "因素名称",
      "category": "分类（education/career/finance/family/health/social/environment/emotion）",
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
  "recommended_agents": ["Self", "Family", "Mentor", "School", "Employer", "City", "Industry", "Risk", "Partner", "Friend"]
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
注意：这是一个关于“活生生的人”的模拟！你需要给角色注入人情味、情感羁绊、生活琐事和不可预测性。不要只关注他们的职位、头衔和能提供的职业/学术资源。家人会生病、伴侣会抱怨、导师也有自己的人生低谷和情绪问题、朋友会带来生活的乐趣或麻烦。

严格约束：
1. 不要凭空捏造推演主角姓名。Self Agent 的 `name` 必须写“未来的你”。
2. 如果用户没有提供其他人的具体姓名，也不要乱造真实人名；优先使用“妈妈”“老爸”“前任”“室友老李”“带我的师兄”等更有生活气息、更具体的化称谓。
3. 注意人称关系：Self 是“未来的你”；Family/Mentor/Partner/Employer 等都是影响“未来的你”的人或系统，不要混淆主体。
4. 必须给每个角色赋予至少一个“非职业/非学术”的性格特质或生活状态（例如：妈妈最近有点风湿痛、师兄正面临35岁危机、室友是个重度主机游戏玩家）。

**输出要求**：输出有效 JSON，格式如下：
{
  "agents": [
    {
      "agent_type": "类型",
      "name": "充满生活气息和具体化的角色名称（如'老爸'、'带我的主管'）",
      "persona": "2-3句话描述这个角色的性格、生活状态、立场、行为倾向。必须要有人情味和具体的生活细节。",
      "stance": "对用户发展的基本态度（supportive/neutral/demanding/restrictive/unpredictable/emotional）",
      "resources": "这个角色能提供或消耗的具体事物（如：经济支持、做饭煮汤、情绪价值、抱怨带来的压力、学术指导、一起旅游解压等）",
      "influence": 0.0到1.0的影响力数值
    }
  ]
}

**Agent 类型示例**（可扩展出更生活化的角色）：
- Self: 未来的你，持有能力、情绪、健康、偏好、目标
- Family: 父母/亲人，提供支持/情感羁绊/家庭责任/压力
- Partner: 伴侣/恋爱对象，共享生活/情感依托/生活决策冲突
- Mentor/Colleague: 导师或同事、前辈，不仅提供职场指导，也有他们自己的生活琐事和情绪
- Friend: 朋友/室友，提供情绪出口、玩乐时间、可能借钱或提供意想不到的帮助
- City: 城市，代表房价压力、天气、美食、孤独感
- Industry: 行业，代表大环境的焦虑感或红利
- Risk: 未知命运/黑天鹅，触发健康危机、意外惊喜、心理崩溃或顿悟

每个 Agent 的人设要**充满人情味**，生动具体，不仅仅是工具人。"""


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
        if a.get("agent_type") == "Self":
            a["name"] = "未来的你"
            if not a.get("persona"):
                a["persona"] = "未来的你，围绕当前关注参数做决策。"
        a.setdefault("agent_id", gen_id())
        a.setdefault("active", True)

    return agents


# ═══════════════════════════════════════════════════════════════════
# 3. MULTI-ROUND SIMULATION — Tree-based branching
# ═══════════════════════════════════════════════════════════════════

ROUND_SYSTEM_PROMPT = """你是一个人生推演引擎。当前正在进行多轮人生推演模拟。

你需要为活跃的 Agent 生成本轮的行动，并判断是否产生重要事件。
极度重要的指示：这是一个关于“活生生的人”的推演。推演不能仅仅围绕学习成绩、实习、面试和跳槽展开！
请适度、符合生活常理地（大部分时间生活是平淡的，偶有波澜，不要每轮都发生抓马的戏剧性冲突和突发事故）生成关于以下方面的生活事件、心理状态和社会关系：
- 突如其来的心理崩溃、深刻的反思、存在主义危机、深夜失眠。
- 情感变故：争吵、分手、遇到心动的人、关系进入平淡期。
- 家庭羁绊：老家的催婚电话、亲人的温暖问候、偶尔的家庭矛盾。
- 随机的生活碎片：长胖了、开始健身、养了一只猫、下雨天没带伞带来的挫败感、一场说走就走的旅行、沉迷某个游戏、发展了一个长期的爱好（钓鱼、烘焙等）。
- 朋友的境遇产生的同辈压力：曾经不如自己的同学突然暴富或结婚生子带来的偶尔焦虑。
- 健康亮红灯：体检指标异常、长期熬夜带来的颈椎病或脱发。

严格约束：
1. 不要凭空捏造推演主角姓名。涉及 Self 时统一使用“未来的你”。
2. 不要乱造未提供的真实人名，请使用生活气息化称呼，如“前任”“老妈”“带我的组长”“多年没联系的老同学”“隔壁工位的卷王”等。
3. 注意人称关系：Self 是“未来的你”，也就是主体，“老板”“父母”是外部影响者。不要混淆。
4. 叙事要有颗粒感、真实度，拒绝假大空的职场报告用语。多使用口语化、生动、具象的场景描写。

**每个 Agent 的行动必须是以下类型之一**：
- MAKE_DECISION: Self 做出选择（除了职业上的选择，也可以是：决定健身、决定结束一段关系、决定开启一段Gap Year、决定买个大件取悦自己）
- PROVIDE_OPPORTUNITY: 提供机会（除了offer，也可以是一次相亲机会、一次旅游邀请、一次养宠物的契机）
- APPLY_PRESSURE: 施加压力或提出期望（父母催婚、同辈攀比、伴侣抱怨你陪他的时间太少）
- GIVE_SUPPORT: 提供支持（经济/情感陪伴/一碗热热排骨汤）
- WITHDRAW_SUPPORT: 减少支持/感情淡化/朋友渐行渐远
- CHANGE_CONDITION: 改变外部条件（房租涨价、行业寒冬、身边的一家爱吃的面馆倒闭了）
- TRIGGER_RISK: 触发风险事件（生病、被骗钱、裁员、家人急病）
- REFLECT: 阶段反思（在地铁上看着窗外反问自己到底想要什么人生、在一个宿醉的早晨感受到身体机能的衰退）
- DO_NOTHING: 本轮无行动 (生活往往是平淡的)

**输出要求**：输出有效 JSON：
{
  "actions": [
    {
      "agent_id": "agent的ID",
      "agent_type": "Agent类型",
      "action_type": "行动类型",
      "target_agent": "影响目标（通常是self）",
      "payload": {
        "affected_states": ["受影响的状态维度，如心情、健康、经济、职业"],
        "delta_direction": "positive/negative",
        "intensity": 0.1到0.5
      },
      "narrative": "这是一句充满生活细节、具体情绪或场景描写的行动说明（要求极度真实、具备生活质感，不要像项目汇报）。"
    }
  ],
  "round_summary": "本轮发生的关键生活/职场事件概括（1-2句有情感温度的话）",
  "key_event": {
    "type": "decision/opportunity/result/cascade/risk/reflection/emotion/health/social",
    "title": "事件标题（如：半夜突如其来的胃痛、发小的婚礼请柬、终于下决心写的辞职信）",
    "description": "事件详细描述",
    "trigger_reason": "触发原因"
  },
  "should_branch": false,
  "branch_reason": "",
  "branch_choices": ["选项A描述", "选项B描述"],
  "parameter_evolution": {
    "should_update": false,
    "focus_change": "",
    "rationale": "",
    "updated_parameters": [
      {
        "name": "参数名",
        "description": "变化后的关注点（例如：突然从'年薪'转变为'身心健康'或'想要一个属于自己的家'）",
        "priority": "primary/secondary/constraint",
        "weight": 0.0到1.0
      }
    ]
  }
}

**分支判定指南**：
- 当 Self Agent 面临 A/B 选择时（如保研 vs 就业、留国内 vs 申请海外大学），设置 should_branch = true
- 当关键机会出现时（如收到 offer），存在接受/拒绝两种路径
- 当风险事件打断主线 — 可产生规避和承受两条分支
- 大约每 3-4 轮应该出现一次分支机会
- branch_choices 中描述每个分支的选择方向（2-3 个选项）

**主参数演化指南**：
- 你每一轮都要判断“当前主参数是否发生变化”
- 例如从“保研 vs 就业”演化到“国内读研 vs 申请海外大学”、从“是否跳槽”演化到“是否接受海外 offer”
- 只有当情境真的变化时才更新 parameter_evolution
- updated_parameters 必须保留合理的主次关系，不要无意义漂移"""


def simulate_round(
    round_num: int,
    time_label: str,
    agents: list[dict],
    current_state: dict,
    profile: dict,
    history_summary: str,
    layered_context: dict[str, Any] | None = None,
    path_tendency: str = "balanced",
) -> dict:
    """Run one simulation round using LLM."""
    llm = get_llm_client()

    active_agents = [a for a in agents if a.get("active", True)]
    # Select 3-6 active agents per round
    if len(active_agents) > 6:
        active_agents = random.sample(active_agents, 6)

    if layered_context:
        user_msg = _compose_round_context(
            time_label=time_label,
            round_num=round_num,
            path_tendency=path_tendency,
            current_state=current_state,
            active_agents=active_agents,
            layered_context=layered_context,
        )
    else:
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
{history_summary}"""

    user_msg += """

请为每个活跃 Agent 生成行动。注意：
1. 行动内容要切合当前时间点和状态
2. 不同路径倾向下 Agent 的行动应有差异
3. Self Agent 的决策要合理，符合人物性格
4. 结合长期记忆层和近期细节层保持叙事连续性
5. 大约每 3-4 轮会出现一个关键转折，需要设置 should_branch = true"""

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
    result.setdefault("parameter_evolution", {"should_update": False, "updated_parameters": []})

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
                 tendency: str, state_history: list,
                 layered_context: dict[str, Any] | None = None):
        self.branch_id = branch_id
        self.parent_id = parent_id          # "" for root
        self.label = label                  # human-readable label
        self.state = state                  # current LifeState dict
        self.history = history              # rolling summary string
        self.nodes = nodes                  # list[PathNode-dict]
        self.rounds_done = rounds_done
        self.tendency = tendency            # "balanced" initially
        self.state_history = state_history  # list[dict] for classification
        self.layered_context = copy.deepcopy(layered_context) if layered_context else {}
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
    base_layered_context = _create_layered_context(profile, parameters, concern, [])

    # Initialize root branch and emit the base node immediately so the frontend
    # can render the reasoning tree before the first round finishes.
    root_state = LifeStateSnapshot().model_dump()
    root = BranchState(
        branch_id="root",
        parent_id="",
        label="BASE",
        state=root_state,
        history=f"未来的你关注：{concern}",
        nodes=[],
        rounds_done=0,
        tendency="balanced",
        state_history=[dict(root_state)],
        layered_context=base_layered_context,
    )

    live_branches: list[BranchState] = [root]
    finished_branches: list[BranchState] = []
    tree_events: list[dict] = []
    last_tree_node: dict[str, str] = {}

    root_event = _tree_event_detail(
        event_type="add_node",
        event_id="root",
        parent=None,
        label="BASE",
        round_num=0,
        time_label="起点",
        node_type="decision",
        description="基础状态已载入，推演树从 BASE 节点开始生长。",
        trigger_reason="系统初始化",
        state_snapshot=root_state,
    )
    tree_events.append(root_event)
    last_tree_node["root"] = "root"
    if progress_callback:
        progress_callback("tree_event", 2, "", root_event)

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

    root.layered_context = _create_layered_context(profile, parameters, concern, agents)

    # ── Step 3: Tree-based simulation ──
    selected_rounds = min(rounds, 20)

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
                    layered_context=branch.layered_context,
                    path_tendency=branch.tendency,
                )
            except Exception as e:
                logger.error(f"Round {r+1} failed for branch {branch.branch_id}: {e}")
                # Produce a fallback node and keep going
                fallback_node_id = f"{branch.branch_id}_r{r+1}"
                fallback_node = PathNode(
                    tree_node_id=fallback_node_id,
                    node_type="result",
                    title=f"阶段进展 ({time_label})",
                    description="推演引擎在此轮遇到问题，使用默认进展",
                    time_label=time_label,
                    trigger_reason="系统推演",
                    state_snapshot=LifeStateSnapshot(**branch.state),
                )
                branch.nodes.append(fallback_node.model_dump())
                # Still emit tree event for fallback node
                parent_node_id = last_tree_node.get(branch.branch_id, branch.branch_id)
                fallback_event = _tree_event_detail(
                    event_type="add_node",
                    event_id=fallback_node_id,
                    parent=parent_node_id,
                    label=fallback_node.title,
                    round_num=r + 1,
                    time_label=time_label,
                    node_type="result",
                    description=fallback_node.description,
                    trigger_reason=fallback_node.trigger_reason,
                    state_snapshot=fallback_node.state_snapshot.model_dump() if fallback_node.state_snapshot else {},
                )
                tree_events.append(fallback_event)
                if progress_callback:
                    progress_callback("tree_event", pct, "", fallback_event)
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

            key_event = round_result.get("key_event") or {}
            parameter_shift = _apply_parameter_evolution(
                branch.layered_context,
                round_result.get("parameter_evolution"),
                time_label=time_label,
            )
            if parameter_shift:
                branch.history += f"\n{time_label}: 主参数转移 → {parameter_shift}"
                lines = branch.history.split("\n")
                if len(lines) > 10:
                    branch.history = lines[0] + "\n" + "\n".join(lines[-8:])
            if summary or key_event.get("title"):
                _append_recent_detail(
                    branch.layered_context,
                    time_label=time_label,
                    round_num=r + 1,
                    summary=(summary + (f"｜主参数变化：{parameter_shift}" if parameter_shift else "")),
                    key_event=key_event,
                    actions=actions,
                )
            if key_event.get("title"):
                _append_long_term_memory(
                    branch.layered_context,
                    f"{time_label}｜{key_event.get('title', '')}｜{key_event.get('trigger_reason') or summary or '关键节点'}",
                )

            # Record key event as node
            if key_event and key_event.get("title"):
                new_node_id = f"{branch.branch_id}_r{r+1}"
                node = PathNode(
                    tree_node_id=new_node_id,
                    node_type=key_event.get("type", "result"),
                    title=key_event.get("title", ""),
                    description=key_event.get("description", ""),
                    time_label=time_label,
                    trigger_reason=key_event.get("trigger_reason", ""),
                    state_snapshot=LifeStateSnapshot(**branch.state),
                    agent_actions=[AgentAction(**a) for a in actions[:3]],
                )
                branch.nodes.append(node.model_dump())

                parent_node_id = last_tree_node.get(branch.branch_id, branch.branch_id)

                node_event = _tree_event_detail(
                    event_type="add_node",
                    event_id=new_node_id,
                    parent=parent_node_id,
                    label=node.title,
                    round_num=r + 1,
                    time_label=time_label,
                    node_type=node.node_type,
                    description=node.description,
                    trigger_reason=node.trigger_reason,
                    state_snapshot=node.state_snapshot.model_dump() if node.state_snapshot else {},
                    agent_actions=[a.model_dump() for a in node.agent_actions],
                )
                tree_events.append(node_event)
                if progress_callback:
                    progress_callback("tree_event", pct, "", node_event)
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
                        layered_context=branch.layered_context,
                    )
                    _append_long_term_memory(
                        child.layered_context,
                        f"{time_label}｜分支选择：{choice_label}",
                    )
                    next_gen.append(child)

                    branch_event = _tree_event_detail(
                        event_type="branch",
                        event_id=child_id,
                        parent=branch_parent_id,
                        label=choice_label,
                        round_num=r + 1,
                        time_label=time_label,
                        node_type="branch",
                        description=round_result.get("branch_reason", ""),
                        trigger_reason=round_result.get("branch_reason", ""),
                        tendency=child_tendency,
                        state_snapshot=copy.deepcopy(branch.state),
                    )
                    tree_events.append(branch_event)
                    if progress_callback:
                        progress_callback("tree_event", pct, "", branch_event)
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
        base += f" · {branch.label[:15]}"
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


def generate_llm_story(path_data: dict, profile: dict) -> str:
    """Generate a cohesive narrative story based on the path simulation."""
    llm = get_llm_client()
    
    path_name = path_data.get("name", "")
    nodes_desc = "\n".join([
        f"时间：{n.get('time_label', '')} | 事件：{n.get('title', '')} | 详情：{n.get('description', '')}"
        for n in path_data.get("nodes", [])[:15]
    ])
    
    profile_text = _format_profile(profile)
    
    user_msg = f"""请你根据以下推演数据，用类似村上春树的视角和笔触，写一段大概500字的人生经历故事。

## 主角背景
{profile_text}

## 核心路径：{path_name}

## 真实推演节点
{nodes_desc}

写作要求：
1. 视角与语调：用第二人称“你”。带着轻微的疏离感、内省的都市疲惫感，以及对日常微小事物的凝视（比如深夜的冷水、车窗外的雾霾、西九龙的高铁闸机等）。
2. 将数据节点文学化：将上面干瘪的事件（如融资、离职、缺钱、家庭矛盾）化平淡内敛但具有重量的叙述。不要刻意煽情，即使是很严重的事情（比如现金流断裂、激烈争吵），也用一种带有宿命感、抽离冷静的调子写出来。
3. 主核：表现出那股“在巨大的城市齿轮中，你像一个走钢丝的人，不断用杠杆撬动现实，但杠杆的重量也一直压在你的肩头”的宿命质感。
4. 篇幅与格式：约500字左右。直接输出分好自然段的纯文本，不要加任何多余的开场白或者 Markdown 代码标签。"""

    return llm.chat(
        messages=[
            {"role": "system", "content": "你是一位深受村上春树风格影响的都市小说家。你擅长用冷静、克制而富有意象的笔触，将琐碎残酷的现实翻译成充满质感的内心独白。"},
            {"role": "user", "content": user_msg}
        ]
    )


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
  "title": "简洁报告标题（不超过12个字）",
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

    result["title"] = _normalize_report_title(result.get("title", ""))
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
        {"agent_id": gen_id(), "agent_type": "Self", "name": "未来的你", "persona": "未来的你", "stance": "neutral", "resources": "个人能力与努力", "influence": 1.0, "active": True},
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
        "name": "未来的你",
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
    parameters = project_data.get("parameters", [])
    agents = project_data.get("agents", [])
    source_nodes = source_path.get("nodes", [])
    concern = profile.get("current_concern", "人生发展") if profile else "人生发展"
    
    # Take nodes up to (and including) the branch point
    inherited_nodes = []
    for i, n in enumerate(source_nodes):
        if i <= node_index:
            inherited_nodes.append(copy.deepcopy(n))
    
    # Build history from inherited nodes
    history_lines = [f"未来的你关注：{concern}"]
    for n in inherited_nodes:
        history_lines.append(f"{n.get('time_label', '?')}: {n.get('title', '')}")
    if description:
        history_lines.append(f"[回溯修改] {description}")
    history = "\n".join(history_lines[-10:])
    
    # Determine the starting round number and time label from the branch node
    branch_node = inherited_nodes[-1] if inherited_nodes else {}
    branch_time = branch_node.get("time_label", "2026-Q1")
    source_tree_node_id = _resolve_source_tree_node_id(project_data, source_path, node_index)
    
    # Parse time label to determine starting round
    start_round = node_index + 1
    
    # Construct initial state from the modified state
    current_state = dict(modified_state)
    state_history = [dict(current_state)]
    layered_context = _bootstrap_context_from_nodes(
        profile,
        parameters,
        concern,
        agents,
        inherited_nodes,
        extra_memory=[f"{branch_time}｜回溯修改：{description or '应用状态覆盖后重新推演'}"],
    )
    
    tree_events = []
    
    # Emit a backtrack root node
    bt_root_id = f"bt_{gen_id()}"
    root_event = _tree_event_detail(
        event_type="branch",
        event_id=bt_root_id,
        parent=source_tree_node_id,
        label=f"回溯: {description}" if description else "反事实分支",
        round_num=start_round,
        time_label=branch_time,
        node_type="branch",
        description=f"从原路径第 {node_index + 1} 个节点开始回溯，应用修改条件后生成的新分支。",
        trigger_reason=description or "用户发起回溯推演",
        tendency="counterfactual",
        state_snapshot=current_state,
        source_path_id=source_path.get("id", ""),
        source_node_index=node_index,
    )
    tree_events.append(root_event)
    if progress_callback:
        progress_callback("tree_event", 5, "", root_event)
    
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
                layered_context=layered_context,
                path_tendency="counterfactual",
            )
        except Exception as e:
            logger.error(f"Backtrack round {r+1} failed: {e}")
            # Produce a fallback node
            fallback_node_id = f"{bt_root_id}_r{r+1}"
            fallback_node = PathNode(
                tree_node_id=fallback_node_id,
                node_type="result",
                title=f"回溯进展 ({time_label})",
                description="回溯推演在此轮遇到问题，使用默认进展",
                time_label=time_label,
                trigger_reason="回溯推演",
                state_snapshot=LifeStateSnapshot(**current_state),
            ).model_dump()
            new_nodes.append(fallback_node)
            fallback_event = _tree_event_detail(
                event_type="add_node",
                event_id=fallback_node_id,
                parent=last_node_id,
                label=fallback_node.get("title", ""),
                round_num=total_round,
                time_label=time_label,
                node_type="result",
                description=fallback_node.get("description", ""),
                trigger_reason=fallback_node.get("trigger_reason", ""),
                state_snapshot=fallback_node.get("state_snapshot", {}),
                source_path_id=source_path.get("id", ""),
                source_node_index=node_index,
            )
            tree_events.append(fallback_event)
            if progress_callback:
                progress_callback("tree_event", pct, "", fallback_event)
            last_node_id = fallback_node_id
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

        key_event = round_result.get("key_event") or {}
        parameter_shift = _apply_parameter_evolution(
            layered_context,
            round_result.get("parameter_evolution"),
            time_label=time_label,
        )
        if parameter_shift:
            history += f"\n{time_label}: 主参数转移 → {parameter_shift}"
            lines = history.split("\n")
            if len(lines) > 10:
                history = lines[0] + "\n" + "\n".join(lines[-8:])
        if summary or key_event.get("title"):
            _append_recent_detail(
                layered_context,
                time_label=time_label,
                round_num=total_round,
                summary=(summary + (f"｜主参数变化：{parameter_shift}" if parameter_shift else "")),
                key_event=key_event,
                actions=actions,
            )
        if key_event.get("title"):
            _append_long_term_memory(
                layered_context,
                f"{time_label}｜{key_event.get('title', '')}｜{key_event.get('trigger_reason') or summary or '回溯关键节点'}",
            )

        # Record key event as node
        if key_event and key_event.get("title"):
            new_node_id = f"{bt_root_id}_r{r+1}"
            node = PathNode(
                tree_node_id=new_node_id,
                node_type=key_event.get("type", "result"),
                title=key_event.get("title", ""),
                description=key_event.get("description", ""),
                time_label=time_label,
                trigger_reason=key_event.get("trigger_reason", ""),
                state_snapshot=LifeStateSnapshot(**current_state),
                agent_actions=[AgentAction(**a) for a in actions[:3]],
            )
            new_nodes.append(node.model_dump())
            
            node_event = _tree_event_detail(
                event_type="add_node",
                event_id=new_node_id,
                parent=last_node_id,
                label=node.title,
                round_num=total_round,
                time_label=time_label,
                node_type=node.node_type,
                description=node.description,
                trigger_reason=node.trigger_reason,
                state_snapshot=node.state_snapshot.model_dump() if node.state_snapshot else {},
                agent_actions=[a.model_dump() for a in node.agent_actions],
                source_path_id=source_path.get("id", ""),
                source_node_index=node_index,
            )
            tree_events.append(node_event)
            if progress_callback:
                progress_callback("tree_event", pct, "", node_event)
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
