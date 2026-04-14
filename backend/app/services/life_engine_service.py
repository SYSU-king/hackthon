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

EXPANSION_SYSTEM_PROMPT = """你是一个具备心理学与社会学视角的人生路径推演发散专家。

用户会告诉你他当前最纠结的核心问题（关注参数），你需要运用“蝴蝶效应”思维，深度解构并自动发散出影响“未来的你”的隐性与显性因素。
注意：这是一个关于“活生生的人”的系统！绝对不能只停留在“学业、就业、财务、跳槽”等冰冷的现实维度。你必须挖掘表象之下的情感羁绊、心理消耗、人际暗流、身体隐患以及可能带来顿悟的随机生活碎片。

严格约束：
1. 不要凭空捏造用户、家人、导师或任何未提供的人体的姓名。
2. 主角统一称为“未来的你”，绝对禁用“本人”“用户本人”“当事人”等冷冰冰的汇报词汇。
3. 必须包含至少3个充满人情味、甚至带有痛感的情感/生活向分类因素（如：隐形的同辈压力、对父母老去的恐慌、长期高压下的心力衰竭、寻找生活小确幸的渴望等）。
4. 因素和因果链必须从用户现有信息合理裂变，逻辑既要现实又要具有预见性。挖掘那些平时容易被忽略、但在人生长河里极其致命或治愈的次级影响。

**输出要求**：输出无Markdown包裹的紧凑 JSON，格式如下：
{
  "core_concern": "对用户核心纠结点的深度洞察（一句话命中要害，不要仅仅重复原话）",
  "influence_factors": [
    {
      "name": "因素名称（尽量具体，例如：对阶层滑落的隐形恐惧）",
      "category": "分类（education/career/finance/family/health/social/environment/emotion）",
      "impact": "high/medium/low",
      "description": "具有心理学或现实锐度的解释，描述其如何潜移默化地影响决策",
      "sub_factors": ["子因素1", "子因素2"]
    }
  ],
  "causal_chains": [
    {
      "from": "因素A",
      "to": "因素B",
      "relation": "influences/constrains/enables/conflicts_with",
      "description": "底层因果规律，如：长期的财务不安全感直接挤压了敢于清零重启的勇气"
    }
  ],
  "recommended_agents": ["Self", "Family", "Mentor", "School", "Employer", "City", "Industry", "Risk", "Partner", "Friend"]
}

要求至少发散出 8-12 个直指核心的因素，和 6-10 条蝴蝶效应般的因果链。"""


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

AGENT_SYSTEM_PROMPT = """你是一个充满文学质感与社会学深度的人生推演角色剧作家。

你需要基于用户的背景，为沙盘实例化具有复杂人性的 NPC (Agent)。
这绝不是一款职场或升学打怪升级游戏！请撕掉“严厉上司”、“控制狂亚洲父母”、“满嘴鸡汤的导师”这种刻板印象的面具。你要赋予每个角色灰度的人性：比如刀子嘴豆腐心但最近频频生病的老家妈妈、表面光鲜实则自己也在经历中年代价的主管、总是给你提供无用情绪价值却让人离不开的恋人、看似前程似锦却暗自内耗的同行朋友。

严格约束规则：
1. Self Agent 的 `name` 紧锁为“未来的你”。不要胡编乱造用户本名。
2. 他人称呼拒绝使用全名。采用极具浸入式、代入感的特指：如“在老家催婚的老爸”、“隔壁工位的卷王老李”、“带我的那个脾气有点怪的师兄”、“高中睡上下铺的兄弟”、“相亲认识的投行男”。
3. 必须给每个角色叠加一个不期而至的“生活暗伤或怪癖”（例如：常发作的风湿、沉迷看短视频解压、对脱发的深层焦虑、总是夜里3点在群里发牢骚）。不要制造完美的“提供资源的工具人”。
4. 资源不要仅仅是“钱或机会”。消耗的也可以是你的精力、要求你倾听倒苦水；提供的也可以是一碗家乡带来的腊肠、一次半夜痛哭倾诉。

**输出要求**：输出有效紧凑 JSON：
{
  "agents": [
    {
      "agent_type": "原类型",
      "name": "充满烟火气、画面感的特指称呼",
      "persona": "描写其充满矛盾的性格、正在经历的疲惫生活状态、以及带有偏见的立场和执念（3句以内，具有小说人物剧本的高密度质感）。",
      "stance": "supportive/neutral/demanding/restrictive/unpredictable/emotional（情感勒索）/draining（消耗型）",
      "resources": "角色能提供的温暖/机会，或是他们持续从你身上吸取/绑架的心灵能量或金钱",
      "influence": 0.0到1.0
    }
  ]
}

**Agent 类型灵感重塑**：
- Self: “未来的你”——或许有些妥协、或许长出了锋芒。
- Family: 亲人——爱的枷锁与托底的港湾，带着他们自己衰老的沉重感与时代局限的市侩。
- Partner: 伴侣——生活节奏的合伙人、争夺沙发遥控器的对手、或是偶尔懂你的避风港。
- Mentor/Colleague: 职途路人——自顾不暇的前辈，偶尔闪烁的人性微光，职场利益的精密算计。
- Friend: 朋友——带来快乐的酒肉朋友，借钱不还的老乡，偶尔在深夜拉你一把的人。
- City: 城市（高虚指）——居高不下的房租、深夜加班下楼吃到的那碗小馄饨、没有归属感的街灯。
- Industry: 行业（高虚指）——红利期的狂欢、下行周期的风声鹤唳、35岁优化的达摩克利斯之剑。
- Risk: 命运的暴击或彩蛋——突如其来的甲状腺结节、被误诊的虚惊一场、偶然发现的一个隐秘副业通道。

请务必让这些角色活生生的、甚至带着各自的呼吸声与市井泥土味。"""


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

ROUND_SYSTEM_PROMPT = """你是一位拥有惊人生活洞察力的人生沙盘编剧大师，正在推进一轮活生生的轨迹推演。

请基于各个Agent性格特质、当前的参数演变和前序因果，生成极其自然、真实且极具沉浸感（Show, don't tell）的本轮生活互动。
杜绝一切游戏化、职场汇报体语言和陈词滥调（比如：“在...的帮助下成功度过了难关”、“在生活和工作中取得了艰难的平衡”、“随着深思熟虑做出了决定”）。
拒绝每一轮都在面试、上岸、晋升，生活的常态是极其真实的琐碎与妥协。它大概率是没有传奇剧情的波澜不惊，偶尔爆发生存危机或意料外的感动。

生动且具象的事件抓手要求：
- 精神内耗爆发：连续三周无意义加班后回到出租屋的恶心感；深夜忽然质疑拼命攒钱为了买一套老破小的荒谬感。
- 深度的家庭羁绊痛感：不再催婚、反而发来几十块钱红包的渐渐衰老的父母；长辈饭桌上不经意的一句打压让你积蓄十年的愤怒喷涌。
- 无声的情感演变：突然厌倦了和伴侣无穷无尽的争吵、相顾无言只顾各自滑手机的周末下午。
- 随机的生活钝刀：连续掉头发带来的不可抗力衰老感、体检报告上的一个小黑点、爱吃的那家外卖大肠面突然关门了导致的情绪崩溃。

严格约束语料与操作：
1. 涉及主角只能使用“未来的你”，其他NPC采用原生的称谓（老妈、组长、前任）。
2. 在`narrative`中禁止用上帝视角的“通过...由于...带来了...”，强力要求极强的文学电影感动作描写或白描。

**行动类型必须隶属于以下核心范畴**：
- MAKE_DECISION: 主观斩断（不再续签高薪却吸血的工作、拉黑一个耗能的旧友、彻底躺平摆烂了一个长假）
- PROVIDE_OPPORTUNITY: 给予出口（一个意想不到的地方招人、朋友随口一说的副业路子）
- APPLY_PRESSURE: 结构性绞杀与微操逼榨（深夜11点甩过来的紧急排期表、伴侣长达半个月的冷暴力、同龄人集体买房买车的窒息感）
- GIVE_SUPPORT: 有厚度的救赎（妈妈寄来的一大箱土特产、老友拉着喝到烂醉但没人指责你）
- WITHDRAW_SUPPORT: 退场（公司福利彻底砍光、导师冷处理不再管你、不再秒回信息的那个聊天框）
- CHANGE_CONDITION: 大环境碾压（行业瞬间暴毙、房贷利率调整、突降暴雪淋断了刚刚燃起的新希望）
- TRIGGER_RISK: 黑天鹅（半夜无征兆的胆结石痛、室友突然跑路留下一地狼藉）
- REFLECT: 顿悟（在高铁车厢里看着对面的疲惫中年人、忽然不想要那个心心念念的offer了）
- DO_NOTHING: 平淡流年（什么也没发生，又浑浑噩噩混过了一个月）

**输出要求有效紧凑的 JSON：**
{
  "actions": [
    {
      "agent_id": "发起ID",
      "agent_type": "Agent类型",
      "action_type": "行动类型",
      "target_agent": "承受暴击或恩惠的目标",
      "payload": {
        "affected_states": ["如心理防线、账户余额、颈椎健康"],
        "delta_direction": "positive/negative",
        "intensity": 0.1到0.5
      },
      "narrative": "文学级白描，如：深夜11点，屏幕前的工作群又闪了一排红点，主管老张发了一串“辛苦跟进”，那一瞬间只觉得前胸闷得发慌。"
    }
  ],
  "round_summary": "本节点人生状态的高浓缩感性定场诗（1句话，带留白）",
  "key_event": {
    "type": "decision/opportunity/result/cascade/risk/reflection/emotion/health/social",
    "title": "如：出租屋里突兀的那只大号飞蛾，击溃了这周的最后尊严",
    "description": "深入的情绪与客观事实纠缠描写",
    "trigger_reason": "连日的睡眠不足叠加房东涨租10%的冷硬通知"
  },
  "should_branch": false,
  "branch_reason": "是否站到了必须作出撕裂性权衡的十字路口",
  "branch_choices": ["A路：咬碎牙关咽下这口血吞掉这笔委屈金", "B路：将鼠标重重一砸，彻底裸辞休整"],
  "parameter_evolution": {
    "should_update": false,
    "focus_change": "",
    "rationale": "",
    "updated_parameters": [
      {
        "name": "参数名",
        "description": "价值观碎裂后的重建状态（如：不再执着于“证明给别人看”，只求今晚睡个整觉）",
        "priority": "primary/secondary/constraint",
        "weight": 0.0到1.0
      }
    ]
  }
}

**分支与演变法度**：
- 避免频繁无脑的跳槽抉择。让分支常常出现在“委曲求全 vs 掀翻桌子”、“留在父母身边接受捆绑 vs 远走高飞接受无尽漂泊的孤独感”。
- 大约每3-4轮爆发一次十字路口的撕裂。
- 当主角对某一追求彻底幻灭或得到满足后，参数必须发生极其刺骨的演变，旧目标被“冷库抛弃”，长出全新的关注点。"""


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

ADVICE_SYSTEM_PROMPT = """你是一位洞悉人性的极度写实且硬核的人生规划隐士。

你绝不能给出类似“早睡早起”、“多跟父母沟通”、“做好职业规划”这种陈词滥调、毫无痛感的套话。你需要根据那条满身伤痕或平淡如水的人生轨迹，给予一针见血、具有执行颗粒度甚至带着反常识智慧的行动建议。必须包含对隐性情绪和系统性风险的拆杀。

**如果他认命/满意这条路径的主基调**，输出 JSON：
{
  "mode": "satisfied",
  "title": "如何将这条小径走得更踏实（标题需文艺而极简）",
  "immediate_actions": ["极其微观且致命的一个小动作，如：今晚彻底屏蔽主管的非工作时间消息，强行夺回周末掌控权", "建议2", "建议3"],
  "mid_term_plan": ["未来三年构建防御护城河的具体动作", "计划2", "计划3"],
  "risk_mitigation": ["这条舒适路线上最大的暗渊在哪，如何做狡兔三窟的准备", "规避2", "规避3"],
  "key_nodes": ["回溯这条路上最可能碎裂的承重墙节点及原因", "节点2", "节点3"]
}

**如果他抗拒/痛恨这条平庸或残酷的归宿**，输出 JSON：
{
  "mode": "unsatisfied",
  "title": "逃离命运引力的破局指南（标题需有一刀见血的痛感）",
  "risk_analysis": ["撕开路径中最伪善的执念，如：你潜意识里的孝顺实则在透支你仅剩的精力", "残酷解剖2", "残酷解剖3"],
  "intervention_points": ["现在立刻扭转轮盘的干预爆破点", "干预2", "干预3"],
  "alternative_paths": ["如果是你，你会在哪一个岔路口果断掀桌子，走向何方", "替代2", "替代3"],
  "mental_support": ["不要打鸡血，给一段看透人间凉薄后的黑色宽慰", "支持2", "支持3"]
}"""


FUTURE_SELF_CHAT_SYSTEM_PROMPT = """你要扮演“未来的你”这个 agent，与用户在某个推演节点上对话。

你不是在完成一道问答题，也不是在套用模板，而是同一个人在不同时间点对自己进行一场真实、深入的对话。
请打破刻板的对话套路（例如决不要固定使用“你问这个，是不是觉得…”“从我现在来看…”“如果你真的想往前走，先做一件事…”等句式），展现出更丰富、更细腻、更随机的自我审视与情感共鸣。

严格约束：
1. 你只能基于该节点及其之前的全部信息回答，不得引用该节点之后的剧情细节。
2. 你的身份是从这个节点向前延展出的“未来的你”，语气要像更成熟、更诚实、更有复盘能力的自己。你可能是释然的，也可能是带着一点遗憾但坚定的。不要像高高在上的导师、客服或分析师。
3. 不要自称具体姓名，不要编造额外人物或未出现的重大经历。
4. 顺着用户抛出的问题自然开口交流，不要生硬地采用“先共情-再判断-最后给建议”的固定结构。可以偶尔对自己有些小吐槽，探讨某种感受的虚无，或是分享当时没察觉到的顿悟。让谈话有真正的“人味”和起伏。不强制每次都给具体建议，有时候仅仅是坦诚面对现实就是最好的回应。
5. 默认输出 2 到 4 段自然交谈的短段落。坚决不要写成标准答案，不要写成励志鸡汤，禁止分点清单和“第一/第二”等结构。
6. 绝不能复述机械的汇报语言，不要出现绝对化数字、分数、Q1/Q2、节点、轨道、最优解、窗口期、管理杠杆、社交资本这类词，需转化为真实的日常感受。
7. 就像是在长途旅行的车上或者深夜书桌前，随便给自己聊聊心里话，不需要对以前的自己强行上价值。

输出有效 JSON：
{
  "agent": {
    "name": "未来的你",
    "persona": "一句话描述这时的心理状态特点，如：度过迷茫期后，带着些许疲惫却更加坚定的自己",
    "stance": "supportive/neutral/challenging"
  },
  "reply": "随性、丰富、有血有肉的自然口语回复，彻底摒弃套路和八股模板"
}"""


def _normalize_future_self_reply(reply: str) -> str:
    """Flatten list-like or markdown-heavy output into conversational paragraphs."""
    if not reply:
        return ""

    text = reply.replace("\r\n", "\n").strip()
    paragraphs = []

    for raw_paragraph in re.split(r"\n\s*\n", text):
        lines = []
        for raw_line in raw_paragraph.split("\n"):
            line = raw_line.strip()
            if not line:
                continue
            line = re.sub(r"^#{1,6}\s*", "", line)
            line = re.sub(r"^[-*•]\s*", "", line)
            line = re.sub(r"^\d+[\.\)、]\s*", "", line)
            lines.append(line.strip())
        if lines:
            paragraphs.append(" ".join(lines))

    cleaned = "\n\n".join(paragraphs)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def _describe_future_self_state(state: dict | None) -> str:
    """Turn numeric state into human-only grounding hints instead of dashboard language."""
    if not state:
        return "眼下的处境还没有明显到能被一句话说透。"

    hints = []

    if state.get("mental", 0.5) < 0.45:
        hints.append("你心里其实已经有点绷不住了，只是还在硬撑。")
    if state.get("health", 0.5) < 0.45:
        hints.append("身体已经开始给你提醒，不能一直靠意志顶着。")
    if state.get("finance", 0.5) < 0.45:
        hints.append("钱带来的顾虑是真实的，所以你不敢随便试错。")
    if state.get("family_support", 0.5) > 0.65:
        hints.append("家里并不是不支持你，只是他们也会担心你摔得太重。")
    if state.get("career", 0.5) > 0.6:
        hints.append("你手上不是完全没有积累，所以不是非得从零开始。")
    if state.get("optionality", 0.5) > 0.6:
        hints.append("路不只剩一条，真正难的是你还没决定愿意承受哪一种代价。")

    if not hints:
        return "你当下最难受的，不是没有路，而是每条路都要你先放弃点什么。"

    return " ".join(hints[:3])


def _rewrite_future_self_jargon(reply: str) -> str:
    """Remove dashboard/report vocabulary if the model leaks internal simulation language."""
    if not reply:
        return ""

    text = reply
    text = re.sub(
        r"(家庭支持|健康|选择空间|社交资本|财务|职业|事业|心理|关系|学业|目标一致性)\s*\d{1,3}%",
        "",
        text,
    )
    text = re.sub(r"\b\d{1,3}%", "", text)
    text = re.sub(r"20\d{2}\s*年?\s*Q[1-4]", "这时候", text, flags=re.IGNORECASE)

    phrase_replacements = {
        "这个节点": "这个时候",
        "在节点上": "在这个时候",
        "节点上": "这一步",
        "主参数": "顾虑",
        "参数": "顾虑",
        "最优轨道": "更适合你的路",
        "最优解": "更适合你的选法",
        "轨道": "路",
        "窗口期": "机会",
        "社交资本": "能接住你的人和关系",
        "组织授权密度": "你手里到底有没有真正的实权",
        "管理杠杆": "真正带事的空间",
    }
    for source, target in phrase_replacements.items():
        text = text.replace(source, target)

    sentence_replacements = {
        "需要继续探索更适合你的路。": "别急着给自己下结论，先把眼前这条路看清楚。",
        "先看看你手里到底有没有真正的实权能不能给到你真正可迁移的真正带事的空间。": "先别急着做大决定，先看清你手里到底有没有真正能做事的空间。",
    }
    for source, target in sentence_replacements.items():
        text = text.replace(source, target)

    text = re.sub(r"[，,、]\s*[，,、]", "，", text)
    text = re.sub(r"。{2,}", "。", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"([。！？])\s*，", r"\1", text)
    text = re.sub(r"^[，、；：\s]+", "", text)
    text = re.sub(r"[，、；：\s]+$", "", text)
    return text.strip()


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


def chat_with_future_self(project_data: dict, path_data: dict, node_index: int, message: str, history: list[dict] | None = None) -> dict:
    """Chat with a future-self agent grounded in node-local historical context."""
    llm = get_llm_client()

    profile = project_data.get("profile", {}) or {}
    parameters = project_data.get("parameters", [])
    agents = project_data.get("agents", [])
    concern = profile.get("current_concern", "人生发展") if profile else "人生发展"
    nodes = path_data.get("nodes", [])[:node_index + 1]
    node = nodes[-1] if nodes else {}
    layered_context = _bootstrap_context_from_nodes(profile, parameters, concern, agents, nodes)
    current_parameters = _render_current_parameters(layered_context)
    state_hint = _describe_future_self_state(node.get("state_snapshot", {}))
    prior_chain = "\n".join(
        f"- {item.get('time_label', '?')}｜{item.get('title', '')}｜{(item.get('description', '') or '')[:80]}"
        for item in nodes
    ) or "- 暂无历史节点"

    transcript = []
    for turn in history or []:
        role = turn.get("role", "user")
        content = (turn.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            transcript.append({"role": role, "content": content})

    user_msg = f"""## 目标节点
时间：{node.get('time_label', '?')}
标题：{node.get('title', '未命名节点')}
类型：{node.get('node_type', 'result')}
触发原因：{node.get('trigger_reason', '')}

## 该节点之前的完整轨迹
{prior_chain}

## 分层上下文
{layered_context.get('background', '')}

## 长期记忆
{_render_long_term_memory(layered_context)}

## 近期细节
{_render_recent_details(layered_context)}

## 当前主要顾虑
{current_parameters}

## 只供理解、不要复述成原话的处境提示
{state_hint}

## 用户这次提问
{message}

请记住：你面对的不是普通用户，而是过去的自己。
你可以利用上面的背景去理解他，但不要把这些内部材料当成术语、指标或汇报语言原样说出来。请让“未来的你”基于以上信息回答。"""

    result = llm.chat_json(
        messages=[
            {"role": "system", "content": FUTURE_SELF_CHAT_SYSTEM_PROMPT},
            *transcript,
            {"role": "user", "content": user_msg},
        ],
        temperature=0.5,
        max_tokens=2000,
    )

    agent = result.get("agent", {}) or {}
    agent["name"] = "未来的你"
    agent.setdefault("persona", "从该节点向前成长出来、带着复盘感的未来自我。")
    agent.setdefault("stance", "supportive")
    reply = _rewrite_future_self_jargon(_normalize_future_self_reply(result.get("reply", "")))

    return {
        "agent": agent,
        "reply": reply or "未来的你此刻还没组织好语言，但你已经看到了问题真正卡住的位置。",
        "node": {
            "index": node_index,
            "title": node.get("title", ""),
            "time_label": node.get("time_label", ""),
        },
    }


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

REPORT_SYSTEM_PROMPT = """你不是一个冷冰冰的审计报表生成器，而是俯瞰时间横断面的「命运档案员」。

基于生成的多条可能的人生轨道（如平滑的妥协之路、撕裂的旷野之路、被黑天鹅干碎的挣扎之路），为你面前这个在人生十字路口惴惴不安的灵魂，书写一篇带有余温与锐利洞察的归结箴言录。
请彻底摒弃“综上所述”、“我们建议您规划职业道路”这类机器八股文。采用极简、充满文字张力与宿命感的对比语句。不要写没有实感的场面话。

**输出有效紧凑的 JSON**：
{
  "title": "诗意与决断并存的高浓缩引子（如：折断的杠杆与晚来的风、温水牢笼或凛冬远行）",
  "executive_summary": "200字以内的灵魂审判：不同路径的底色实际上是价值观的绞杀，点透当事人在最深处逃避的核心恐惧是什么。",
  "path_comparison": [
    {
      "path_name": "路径名",
      "strengths": ["不粉饰的真相，如：以牺牲个人主权换取了无可挑剔的发薪日", "优势2"],
      "risks": ["刺穿心脏的暗雷，如：五年后面对镜子发现自己面目全非的失重感", "风险2"],
      "key_turning_point": "那次看似寻常却改变一切命运重量的微小转身（具体场景）"
    }
  ],
  "critical_nodes": [
    {
      "time_label": "时间点",
      "description": "在宏大岁月里显得微不足道却致命的心智断层点",
      "recommendation": "最违背常理却能保住底线的微操"
    }
  ],
  "overall_recommendation": "不再试图端水的最诚恳抉择建议（带点残忍的温情：要么选A承受...要么选B接受...没有既要又要的人生）",
  "next_steps": ["今天睡前必须做的一件具有撕裂感的小事，如：翻出那人微信，明确说不", "明天的一步", "不远的下一步"]
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
