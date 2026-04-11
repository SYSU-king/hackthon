"""
Simulation service — generates mock life paths for MVP.
In production this would call LLM + OASIS, but for the hackathon
we generate deterministic yet realistic-looking paths.
"""

import random
from app.domain.models import LifePath, PathNode, LifeStateSnapshot, gen_id


# ── Narrative templates ──

OPTIMAL_NODES = [
    ("decision", "选择保研", "基于成绩排名和导师推荐，决定接受保研名额", "学术能力与机会匹配"),
    ("opportunity", "导师提供课题", "研究方向与行业热点高度契合，获得核心课题", "导师资源支持"),
    ("result", "发表核心论文", "在顶会/顶刊发表一作论文，学术竞争力显著提升", "持续投入研究"),
    ("cascade", "获得企业实习邀请", "论文成果吸引头部企业关注，获得研究型实习", "学术影响力扩散"),
    ("opportunity", "收到多个 offer", "凭借学术+实习双背景，获得多个高质量 offer", "复合优势积累"),
    ("decision", "选择一线城市核心岗位", "综合考虑发展空间和薪资，选择一线城市", "职业目标明确"),
    ("result", "职业起步顺利", "入职后快速上手，获得团队认可", "能力与岗位匹配"),
    ("reflection", "阶段复盘", "回顾选择路径，保研决策与后续发展高度一致", "路径连贯性验证"),
]

CONSERVATIVE_NODES = [
    ("decision", "选择稳妥考研", "综合评估后选择考研，虽有风险但求稳", "风险规避偏好"),
    ("risk", "备考期间压力增大", "同时准备考研和课程，身心压力持续上升", "时间资源冲突"),
    ("result", "考研成功上岸", "经历高强度备考后顺利通过考试", "坚持与努力"),
    ("cascade", "家庭经济压力缓解", "获得学校奖学金和助学金", "经济支持改善"),
    ("opportunity", "参与横向课题", "虽非顶级研究但获得项目实践经验", "渐进式积累"),
    ("decision", "选择二线城市央企", "看重稳定性和生活质量，选择体制内", "安全感优先"),
    ("result", "工作生活平衡", "相对平稳的职业起步，没有极端风险", "平衡策略生效"),
    ("reflection", "阶段复盘", "路径安全但发展空间有限，需要后续突破", "机会成本分析"),
]

RISK_NODES = [
    ("decision", "直接就业进入创业公司", "放弃升学机会，选择高风险高回报的创业公司", "冒险倾向驱动"),
    ("opportunity", "早期员工期权", "作为早期员工获得股权激励", "高风险高回报"),
    ("risk", "公司资金链紧张", "创业公司融资困难，面临裁员风险", "行业周期波动"),
    ("cascade", "被迫跳槽", "公司缩减规模，需要在短期内找到新工作", "风险事件连锁反应"),
    ("decision", "转投大厂", "利用创业经验包装简历，进入大厂", "路径修正"),
    ("risk", "行业寒冬裁员", "大厂业务线调整，面临优化风险", "外部环境恶化"),
    ("result", "独立开发副业", "利用技术积累开始做独立开发产品", "被动转主动"),
    ("reflection", "阶段复盘", "经历波折但技术和心智成长远超同龄人", "逆境中的成长"),
]


def _make_state_progression(path_type: str, step: int, total: int) -> LifeStateSnapshot:
    """Generate a state snapshot that progresses over time."""
    progress = step / max(total - 1, 1)
    base = LifeStateSnapshot()

    if path_type == "optimal":
        return LifeStateSnapshot(
            education=min(0.5 + progress * 0.45, 0.95),
            career=min(progress * 0.85, 0.85),
            finance=min(0.3 + progress * 0.5, 0.8),
            health=max(0.8 - progress * 0.15, 0.65),
            mental=0.6 + progress * 0.2 - (0.15 if 0.3 < progress < 0.6 else 0),
            relationship=0.5 + progress * 0.2,
            family_support=0.7 + progress * 0.1,
            social_capital=0.4 + progress * 0.4,
            optionality=0.8 - progress * 0.1,
            goal_alignment=0.5 + progress * 0.4,
        )
    elif path_type == "conservative":
        return LifeStateSnapshot(
            education=min(0.5 + progress * 0.35, 0.85),
            career=min(progress * 0.6, 0.6),
            finance=min(0.3 + progress * 0.35, 0.65),
            health=max(0.8 - progress * 0.1, 0.7),
            mental=0.6 - (0.2 if 0.2 < progress < 0.5 else 0) + progress * 0.15,
            relationship=0.5 + progress * 0.15,
            family_support=0.7 + progress * 0.15,
            social_capital=0.4 + progress * 0.2,
            optionality=0.8 - progress * 0.25,
            goal_alignment=0.5 + progress * 0.2,
        )
    else:  # risk
        noise = random.uniform(-0.05, 0.05)
        return LifeStateSnapshot(
            education=0.5 + progress * 0.1,
            career=min(progress * 0.7 + noise, 0.7),
            finance=0.3 + progress * 0.3 + noise * 2,
            health=max(0.8 - progress * 0.2, 0.55),
            mental=max(0.6 - progress * 0.25 + (0.3 if progress > 0.7 else 0), 0.35),
            relationship=max(0.5 - progress * 0.15, 0.3),
            family_support=max(0.7 - progress * 0.2, 0.45),
            social_capital=0.4 + progress * 0.3,
            optionality=0.8 + progress * 0.1,
            goal_alignment=0.5 + progress * 0.15 + noise,
        )


def generate_mock_paths(project_data: dict, rounds: int = 12) -> list[dict]:
    """Generate 3 life paths (optimal, conservative, risk) with nodes."""
    paths_config = [
        ("optimal", "Path Alpha: 最优路径", OPTIMAL_NODES, "low", 0.82),
        ("conservative", "Path Beta: 稳健路径", CONSERVATIVE_NODES, "low", 0.65),
        ("risk", "Path Gamma: 冒险路径", RISK_NODES, "high", 0.48),
    ]

    profile = project_data.get("profile", {})
    concern = profile.get("current_concern", "人生发展") if profile else "人生发展"

    paths = []
    for path_type, name, template_nodes, risk_level, satisfaction in paths_config:
        nodes = []
        # Select a subset of nodes based on rounds
        selected = template_nodes[:min(rounds, len(template_nodes))]
        year_base = 2025
        for i, (ntype, title, desc, trigger) in enumerate(selected):
            quarter = (i % 4) + 1
            year = year_base + i // 4
            time_label = f"{year}-Q{quarter}"
            state = _make_state_progression(path_type, i, len(selected))
            node = PathNode(
                node_type=ntype,
                title=title,
                description=desc,
                time_label=time_label,
                trigger_reason=trigger,
                state_snapshot=state,
            )
            nodes.append(node)

        final_state = _make_state_progression(path_type, len(selected) - 1, len(selected))
        path = LifePath(
            name=name,
            path_type=path_type,
            summary=f"围绕「{concern}」的{name}：通过 {len(selected)} 个关键节点推演未来 {len(selected)//4 + 1} 年的发展路径。",
            risk_level=risk_level,
            satisfaction_score=satisfaction,
            final_state=final_state,
            nodes=nodes,
        )
        paths.append(path.model_dump())

    return paths


def generate_mock_advice(path_data: dict, feedback: str = "satisfied") -> dict:
    """Generate mock AI advice for a path."""
    path_type = path_data.get("path_type", "balanced")
    path_name = path_data.get("name", "")

    if feedback == "satisfied":
        return {
            "mode": "satisfied",
            "title": f"落地「{path_name}」的行动方案",
            "immediate_actions": [
                "梳理当前成绩和排名，确认保研/考研资格",
                "与导师沟通研究方向偏好，争取科研机会",
                "开始准备核心技能的学习和实践",
            ],
            "mid_term_plan": [
                "3 个月内完成至少一段有含金量的实习",
                "建立行业人脉网络，参与相关社群",
                "深化专业领域的知识储备",
            ],
            "risk_mitigation": [
                "保留 Plan B 选项，不过早关闭其他可能性",
                "维护身心健康，避免过度透支",
                "与家人保持沟通，获取支持",
            ],
            "key_nodes": [
                "大三下学期是关键决策窗口",
                "实习选择将显著影响后续走向",
                "论文/项目产出是核心竞争力",
            ],
        }
    else:
        return {
            "mode": "unsatisfied",
            "title": f"改善「{path_name}」的应对策略",
            "risk_analysis": [
                "当前路径的主要风险来自外部不确定性",
                "过度依赖单一路径增加了系统性风险",
                "需要增加路径灵活性和可选择空间",
            ],
            "intervention_points": [
                "在第2-3个关键节点处存在校正机会",
                "可以通过增加技能储备来拓宽选择面",
                "调整地域限制可以显著增加机会密度",
            ],
            "alternative_paths": [
                "考虑 Gap Year 积累经验后再做决策",
                "探索跨学科交叉方向的可能性",
                "尝试远程/混合工作模式降低地域限制",
            ],
            "mental_support": [
                "接受不确定性是常态，避免过度焦虑",
                "找到可信赖的人倾诉和讨论",
                "设置阶段性小目标，保持前进节奏",
            ],
        }
