from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime

from .llm import describe_runtime, generate_text
from .models import (
    AdviceBlock,
    AgentCard,
    BranchOverview,
    DashboardState,
    EditableField,
    GraphEdge,
    GraphEdgeEpisode,
    GraphMeta,
    GraphNode,
    GraphPosition,
    MemoryRecord,
    MetricDelta,
    PathDetail,
    PathNode,
    SimulationEvent,
    StateSnapshot,
    StateVector,
    StitchAsset,
    StitchManifest,
    UserProfile,
)


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()


def _clamp(value: int, lower: int = 0, upper: int = 100) -> int:
    return max(lower, min(upper, value))


def _apply_vector_delta(axes: StateVector, delta: dict[str, int]) -> StateVector:
    payload = axes.model_dump()
    for key, amount in delta.items():
        payload[key] = _clamp(int(payload.get(key, 50)) + amount)
    return StateVector.model_validate(payload)


def _semester_label(cycle_index: int) -> str:
    return f"第{cycle_index}学期"


def _snapshot(
    snapshot_id: str,
    branch_id: str,
    cycle_index: int,
    phase: str,
    time_label: str,
    axes: StateVector,
    narrative: str,
    timestamp: str,
    deltas: dict[str, int] | None = None,
    triggers: list[str] | None = None,
) -> StateSnapshot:
    return StateSnapshot(
        id=snapshot_id,
        branch_id=branch_id,
        cycle_index=cycle_index,
        phase=phase,
        time_label=time_label,
        axes=axes,
        narrative=narrative,
        deltas=deltas or {},
        triggers=triggers or [],
        timestamp=timestamp,
    )


def _memory(
    memory_id: str,
    layer: str,
    title: str,
    summary: str,
    timestamp: str,
    branch_id: str | None = None,
    related_node_ids: list[str] | None = None,
    data: dict[str, object] | None = None,
) -> MemoryRecord:
    return MemoryRecord(
        id=memory_id,
        layer=layer,
        title=title,
        summary=summary,
        branch_id=branch_id,
        related_node_ids=related_node_ids or [],
        data=data or {},
        timestamp=timestamp,
    )


def _path_utility(path: PathDetail) -> int:
    return path.confidence + path.payoff - path.risk


def _build_graph_meta(
    graph_nodes: list[GraphNode],
    graph_edges: list[GraphEdge],
    branches: list[BranchOverview],
) -> GraphMeta:
    pair_counts: dict[tuple[str, str], int] = {}
    self_loops = 0
    for edge in graph_edges:
        key = (edge.source, edge.target)
        pair_counts[key] = pair_counts.get(key, 0) + 1
        if edge.source == edge.target:
            self_loops += 1

    multi_edge_groups = sum(1 for count in pair_counts.values() if count > 1)
    node_categories = sorted({node.category for node in graph_nodes})
    return GraphMeta(
        node_count=len(graph_nodes),
        edge_count=len(graph_edges),
        branch_count=len(branches),
        self_loop_count=self_loops,
        multi_edge_group_count=multi_edge_groups,
        node_categories=node_categories,
    )


def _branch_projection(path_id: str, base_axes: StateVector) -> StateVector:
    projections = {
        "research-first": {
            "education": 8,
            "career": 3,
            "finance": -3,
            "mental": -4,
            "social_capital": 2,
            "optionality": 5,
            "goal_alignment": 4,
        },
        "hybrid-city": {
            "career": 7,
            "finance": 5,
            "health": -2,
            "mental": -2,
            "relationship": -1,
            "social_capital": 5,
            "optionality": 3,
        },
        "pragmatic-employment": {
            "career": 4,
            "finance": 7,
            "mental": 3,
            "family_support": 4,
            "optionality": -3,
            "goal_alignment": 1,
        },
    }
    return _apply_vector_delta(base_axes, projections.get(path_id, {}))


def _advance_delta(path_id: str) -> dict[str, int]:
    deltas = {
        "research-first": {
            "education": 4,
            "career": 2,
            "finance": -2,
            "mental": -3,
            "social_capital": 2,
            "optionality": 3,
            "goal_alignment": 2,
        },
        "hybrid-city": {
            "career": 4,
            "finance": 3,
            "health": -2,
            "mental": -2,
            "relationship": -1,
            "social_capital": 3,
            "optionality": 2,
        },
        "pragmatic-employment": {
            "career": 2,
            "finance": 4,
            "mental": 2,
            "family_support": 3,
            "optionality": -2,
            "goal_alignment": 1,
        },
    }
    return deltas.get(path_id, {})


def _refresh_paths(paths: list[PathDetail], current_axes: StateVector, selected_path_id: str | None = None) -> None:
    for path in paths:
        utility_shift = 3 if path.id == selected_path_id else -1
        path.confidence = _clamp(path.confidence + utility_shift)
        path.payoff = _clamp(path.payoff + max(0, utility_shift))
        path.risk = _clamp(path.risk + (1 if path.id != selected_path_id else -1))
        path.state_projection = _branch_projection(path.id, current_axes)
        path.status = "active" if path.id == selected_path_id else "candidate"

    paths.sort(key=_path_utility, reverse=True)


def _sync_branches(state: DashboardState) -> None:
    path_index = {path.branch_id or path.id: path for path in state.paths}
    for branch in state.branches:
        path = path_index.get(branch.id)
        if path is None:
            continue
        branch.path_id = path.id
        branch.confidence = path.confidence
        branch.focus_metrics = dict(path.score_breakdown)
        branch.status = "active" if state.active_branch_id == branch.id else "candidate"


def build_default_state() -> DashboardState:
    generated_at = _utc_now()
    baseline_axes = StateVector(
        education=74,
        career=51,
        finance=46,
        health=67,
        mental=61,
        relationship=58,
        family_support=63,
        social_capital=57,
        optionality=79,
        goal_alignment=71,
    )
    current_axes = _apply_vector_delta(
        baseline_axes,
        {
            "career": 2,
            "mental": -2,
            "social_capital": 2,
            "optionality": 3,
            "goal_alignment": 2,
        },
    )

    intake_snapshot = _snapshot(
        "snapshot-intake",
        "main-track",
        0,
        "intake",
        "第0学期",
        baseline_axes,
        "初始参数已被归一化为一个中期人生模拟基线。",
        generated_at,
        triggers=["profile_ingested", "weights_normalized"],
    )
    cycle_one_snapshot = _snapshot(
        "snapshot-cycle-1",
        "main-track",
        1,
        "state_update",
        _semester_label(1),
        current_axes,
        "系统选择了双轨对冲策略，在保留选择权的同时维持求职就绪状态。",
        generated_at,
        deltas={
            "career": 2,
            "mental": -2,
            "social_capital": 2,
            "optionality": 3,
            "goal_alignment": 2,
        },
        triggers=["director_started_cycle", "dual_track_selected"],
    )

    profile = UserProfile(
        name="林",
        stage="本科高年级",
        location="上海",
        concern="我应该优先冲刺读研，还是直接进入行业？",
        objective="在选择权、收入爬坡和个人可持续性之间做权衡。",
        weights={
            "academics": 82,
            "career": 76,
            "city": 68,
            "family": 54,
            "wellbeing": 61,
            "risk": 47,
        },
        risk_tolerance=47,
        planning_horizon="3年",
        initial_parameters={
            "专业": "计算机科学",
            "规划周期": "3-5年",
            "核心张力": "读研与就业拉扯",
            "城市偏好": ["上海", "深圳"],
        },
    )

    graph_nodes = [
        GraphNode(
            id="self",
            uuid="node-self",
            label="当前自我",
            name="林",
            type="subject",
            category="subject",
            description="决策主体，需要在读研上行空间、就业能力和可持续性之间取得平衡。",
            summary="主角同时保留了读研和直接就业两条分支。",
            score=84,
            group="core",
            branch_ids=["main-track"],
            labels=["Self", "DecisionOwner"],
            tags=["core", "life-loop"],
            metrics={"optionality": 79, "goal_alignment": 73},
            details={"stage": "本科高年级", "city": "上海"},
            attributes={"risk_tolerance": 47, "decision_style": "hedged"},
            phase="intake",
            time_label="第0学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.10, y=0.42),
        ),
        GraphNode(
            id="mentor",
            uuid="node-mentor",
            label="导师代理",
            name="实验室导师",
            type="relationship",
            category="subject",
            description="导师支持度较高，但前提是能持续看到可验证的产出质量。",
            summary="推荐信质量是优先读研分支的核心解锁条件。",
            score=78,
            group="support",
            branch_ids=["main-track", "research-track"],
            labels=["Mentor", "RelationshipAgent"],
            tags=["support"],
            metrics={"education": 81, "signal_quality": 76},
            details={"support_mode": "推荐信", "confidence_window": "下学期"},
            attributes={"response_latency": "中等"},
            phase="expansion",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.28, y=0.18),
        ),
        GraphNode(
            id="family",
            uuid="node-family",
            label="家庭约束",
            name="家庭系统",
            type="relationship",
            category="subject",
            description="家庭可以支持进取，但不确定性上升时压力也会同步放大。",
            summary="现金流是否清晰，直接影响分支稳定性。",
            score=61,
            group="constraint",
            branch_ids=["main-track", "stability-track"],
            labels=["Family", "Constraint"],
            tags=["pressure"],
            metrics={"family_support": 63, "finance": 46},
            details={"preferred_outcome": "进展可见"},
            attributes={"support_floor": "中等"},
            phase="expansion",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.28, y=0.72),
        ),
        GraphNode(
            id="employer",
            uuid="node-employer",
            label="雇主市场",
            name="AI 产品市场",
            type="institution",
            category="institution",
            description="高密度就业市场意味着更强的学习上行，也意味着更快的竞争节奏。",
            summary="高线城市岗位更奖励交付速度，而不只是学历深度。",
            score=74,
            group="market",
            branch_ids=["hybrid-track", "stability-track"],
            labels=["Employer", "InstitutionAgent"],
            tags=["market"],
            metrics={"career": 72, "social_capital": 65},
            details={"hot_roles": ["AI 产品", "数据", "全栈"]},
            attributes={"competition": "高"},
            phase="expansion",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.52, y=0.20),
        ),
        GraphNode(
            id="city",
            uuid="node-city",
            label="城市梯度",
            name="上海机会场",
            type="environment",
            category="institution",
            description="城市会同时放大机会密度与生活成本压力。",
            summary="在这座城市里，机会与消耗总是同时上升。",
            score=68,
            group="market",
            branch_ids=["hybrid-track"],
            labels=["City", "Environment"],
            tags=["cost", "opportunity"],
            metrics={"career": 75, "finance": 43},
            details={"cities": ["上海", "深圳"]},
            attributes={"burn_rate": "高"},
            phase="expansion",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.56, y=0.74),
        ),
        GraphNode(
            id="education-state",
            uuid="node-education-state",
            label="教育状态",
            name="教育维度",
            type="state",
            category="state",
            description="跟踪科研准备度、申请就绪度与学术信号强度。",
            summary="教育维度足够强，因此读研分支仍值得保留。",
            score=current_axes.education,
            group="state",
            branch_ids=["main-track", "research-track"],
            labels=["State", "EducationState"],
            metrics={"education": current_axes.education},
            details={"axis": "education"},
            attributes={"trend": "上升"},
            phase="state_update",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.46, y=0.34),
        ),
        GraphNode(
            id="finance-state",
            uuid="node-finance-state",
            label="财务状态",
            name="现金跑道",
            type="state",
            category="state",
            description="衡量资金跑道、成本压力，以及短期收入的紧迫度。",
            summary="财务是当前制约读研分支的首要拖累项。",
            score=current_axes.finance,
            group="state",
            branch_ids=["main-track", "stability-track", "hybrid-track"],
            labels=["State", "FinanceState"],
            metrics={"finance": current_axes.finance},
            details={"axis": "finance"},
            attributes={"trend": "脆弱"},
            phase="state_update",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.48, y=0.58),
        ),
        GraphNode(
            id="mental-state",
            uuid="node-mental-state",
            label="心理状态",
            name="心理负荷",
            type="state",
            category="state",
            description="跟踪压力累积、恢复能力与可持续性风险。",
            summary="虽然选择权被保留了下来，但注意力的持有成本已经真实出现。",
            score=current_axes.mental,
            group="state",
            branch_ids=["main-track"],
            labels=["State", "MentalState"],
            metrics={"mental": current_axes.mental, "health": current_axes.health},
            details={"axis": "mental"},
            attributes={"trend": "关注"},
            phase="state_update",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.48, y=0.82),
        ),
        GraphNode(
            id="decision-core",
            uuid="node-decision-core",
            label="核心分叉",
            name="读研 / 就业分叉",
            type="decision",
            category="decision",
            description="调度器保留三条候选前沿，而不是过早收敛到单一答案。",
            summary="这个节点支撑分支选择、反事实编辑与后续周期扩展。",
            score=91,
            group="core",
            branch_ids=["main-track", "research-track", "hybrid-track", "stability-track"],
            labels=["Decision", "BranchPoint"],
            tags=["closed-loop"],
            metrics={"branch_count": 3},
            details={"decision_window": "未来 9 个月"},
            attributes={"pruning_strategy": "保留前三"},
            phase="branching",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.72, y=0.44),
        ),
        GraphNode(
            id="future-self",
            uuid="node-future-self",
            label="未来自我",
            name="三年后的自己",
            type="goal",
            category="goal",
            description="代表那个重视复利成长、同时希望将遗憾控制在可接受范围内的未来自我。",
            summary="这张图会把每条分支重新连回长期意义，而不只看短期效用。",
            score=current_axes.goal_alignment,
            group="goal",
            branch_ids=["main-track", "research-track", "hybrid-track", "stability-track"],
            labels=["Goal", "FutureSelf"],
            tags=["meaning"],
            metrics={"goal_alignment": current_axes.goal_alignment, "optionality": current_axes.optionality},
            details={"horizon": "3年"},
            attributes={"priority": "复利增长"},
            phase="advice",
            time_label="第1学期",
            created_at=generated_at,
            updated_at=generated_at,
            position=GraphPosition(x=0.92, y=0.44),
        ),
    ]
    graph_edges = [
        GraphEdge(
            id="edge-self-mentor-support",
            uuid="edge-self-mentor-support",
            source="self",
            target="mentor",
            source_name="林",
            target_name="实验室导师",
            name="asks_for_support",
            relation="activates",
            fact_type="relationship",
            fact="只有先获得明确的导师承诺，读研分支才会真正成立。",
            strength=4,
            weight=0.81,
            polarity="positive",
            labels=["support", "signal"],
            details={"why": "推荐信质量会直接影响读研结果"},
            attributes={"interaction_mode": "直接沟通"},
            branch_ids=["research-track"],
            multi_edge_key="self::mentor",
            created_at=generated_at,
            updated_at=generated_at,
        ),
        GraphEdge(
            id="edge-self-mentor-deadline",
            uuid="edge-self-mentor-deadline",
            source="self",
            target="mentor",
            source_name="林",
            target_name="实验室导师",
            name="faces_deadline",
            relation="depends_on",
            fact_type="constraint",
            fact="如果可见产出错过下学期窗口，导师支持就会逐步衰减。",
            strength=3,
            weight=0.67,
            polarity="mixed",
            labels=["deadline", "multi-edge"],
            details={"window": "一个学期"},
            attributes={"interaction_mode": "时机约束"},
            branch_ids=["research-track"],
            multi_edge_key="self::mentor",
            created_at=generated_at,
            updated_at=generated_at,
        ),
        GraphEdge(
            id="edge-family-decision",
            uuid="edge-family-decision",
            source="family",
            target="decision-core",
            source_name="家庭系统",
            target_name="读研 / 就业分叉",
            name="pressures_choice",
            relation="constrains",
            fact_type="causal",
            fact="当短期确定性过低时，家庭支持会明显收缩。",
            strength=3,
            weight=0.59,
            polarity="negative",
            labels=["constraint"],
            details={"focus": "现金流"},
            branch_ids=["main-track", "stability-track"],
            created_at=generated_at,
            updated_at=generated_at,
        ),
        GraphEdge(
            id="edge-mentor-decision",
            uuid="edge-mentor-decision",
            source="mentor",
            target="decision-core",
            source_name="实验室导师",
            target_name="读研 / 就业分叉",
            name="endorses_research",
            relation="enables",
            fact_type="causal",
            fact="导师推荐信质量会直接解锁读研分支。",
            strength=5,
            weight=0.88,
            polarity="positive",
            labels=["recommendation"],
            details={"branch": "research-first"},
            branch_ids=["research-track"],
            created_at=generated_at,
            updated_at=generated_at,
        ),
        GraphEdge(
            id="edge-employer-decision",
            uuid="edge-employer-decision",
            source="employer",
            target="decision-core",
            source_name="AI 产品市场",
            target_name="读研 / 就业分叉",
            name="pulls_to_market",
            relation="pulls",
            fact_type="causal",
            fact="高密度就业市场会奖励即时执行能力和快速交付速度。",
            strength=4,
            weight=0.76,
            polarity="positive",
            labels=["opportunity"],
            details={"branch": "hybrid-city"},
            branch_ids=["hybrid-track", "stability-track"],
            created_at=generated_at,
            updated_at=generated_at,
        ),
        GraphEdge(
            id="edge-city-employer",
            uuid="edge-city-employer",
            source="city",
            target="employer",
            source_name="上海机会场",
            target_name="AI 产品市场",
            name="amplifies_density",
            relation="amplifies",
            fact_type="environment",
            fact="城市密度既会提高机会可达性，也会同步抬升竞争压力。",
            strength=3,
            weight=0.63,
            polarity="mixed",
            labels=["city", "market"],
            details={"positive": "人脉网络", "negative": "消耗速度"},
            branch_ids=["hybrid-track"],
            created_at=generated_at,
            updated_at=generated_at,
        ),
        GraphEdge(
            id="edge-finance-self-loop",
            uuid="edge-finance-self-loop",
            source="finance-state",
            target="finance-state",
            source_name="现金跑道",
            target_name="现金跑道",
            name="runway_feedback_loop",
            relation="feeds_back",
            fact_type="state_feedback",
            fact="城市消耗越高，资金跑道越短，也就越需要尽快获得现金流。",
            strength=4,
            weight=0.79,
            polarity="negative",
            labels=["self-loop", "feedback"],
            details={"axis": "finance"},
            attributes={"loop_type": "reinforcing"},
            branch_ids=["hybrid-track", "stability-track"],
            created_at=generated_at,
            updated_at=generated_at,
            episodes=[
                GraphEdgeEpisode(
                    id="episode-finance-bootstrap",
                    title="已种下跑道风险",
                    summary="默认世界模型中已经包含财务反馈回路。",
                    timestamp=generated_at,
                    impact="短期确定性承压",
                    details={"cycle": 1},
                )
            ],
        ),
        GraphEdge(
            id="edge-mental-self-loop",
            uuid="edge-mental-self-loop",
            source="mental-state",
            target="mental-state",
            source_name="心理负荷",
            target_name="心理负荷",
            name="stress_feedback_loop",
            relation="feeds_back",
            fact_type="state_feedback",
            fact="申请压力或城市压力都会递归式地压缩恢复带宽。",
            strength=3,
            weight=0.66,
            polarity="negative",
            labels=["self-loop", "recovery"],
            details={"axis": "mental"},
            attributes={"loop_type": "reinforcing"},
            branch_ids=["main-track", "research-track", "hybrid-track"],
            created_at=generated_at,
            updated_at=generated_at,
            episodes=[
                GraphEdgeEpisode(
                    id="episode-mental-bootstrap",
                    title="已确认压力回路",
                    summary="系统把身心状态作为有状态的分支约束来跟踪，而不是一条备注。",
                    timestamp=generated_at,
                    impact="关注可持续性",
                    details={"cycle": 1},
                )
            ],
        ),
        GraphEdge(
            id="edge-decision-future",
            uuid="edge-decision-future",
            source="decision-core",
            target="future-self",
            source_name="读研 / 就业分叉",
            target_name="三年后的自己",
            name="branches_into",
            relation="branches_into",
            fact_type="causal",
            fact="每条被保留的分支，都会在选择权、稳定性与长期意义三个维度上重新评估。",
            strength=5,
            weight=0.9,
            polarity="positive",
            labels=["branching"],
            details={"retained_branches": 3},
            branch_ids=["research-track", "hybrid-track", "stability-track"],
            created_at=generated_at,
            updated_at=generated_at,
        ),
    ]
    agents = [
        AgentCard(
            id="agent-self",
            name="自我代理",
            role="决策主体",
            stance="优先保留选择权，但要把下行风险控制在可承受范围内。",
            influence=92,
            focus=["技能复利", "信号质量", "执行耐力"],
            kind="self",
            goals=["保留选择权", "避免透支", "保住长期上行"],
            constraints=["注意力有限"],
            memory_scope=["fact", "state", "tendency"],
            details={"decision_style": "dual-track"},
        ),
        AgentCard(
            id="agent-mentor",
            name="关系代理",
            role="学术推荐人",
            stance="只要产出质量持续可见，就会支持科研路线继续增长。",
            influence=73,
            focus=["科研产出", "推荐信", "实验室去向"],
            kind="relationship",
            goals=["保护信号质量"],
            constraints=["推荐资源有限"],
            memory_scope=["fact", "tendency"],
            details={"relationship": "mentor"},
        ),
        AgentCard(
            id="agent-family",
            name="家庭代理",
            role="约束放大器",
            stance="接受进取，但会抵触过长的不确定周期。",
            influence=59,
            focus=["现金流", "地理距离", "稳定性"],
            kind="relationship",
            goals=["进展可见", "下行可控"],
            constraints=["财务波动"],
            memory_scope=["state"],
            details={"relationship": "family"},
        ),
        AgentCard(
            id="agent-market",
            name="机构代理",
            role="机会压力源",
            stance="更奖励快速入场和务实的交付速度。",
            influence=77,
            focus=["作品集", "实习转正", "城市机会"],
            kind="institution",
            goals=["让技能匹配市场需求"],
            constraints=["竞争密集"],
            memory_scope=["fact", "state"],
            details={"institution": "market"},
        ),
        AgentCard(
            id="agent-director",
            name="调度代理",
            role="闭环调度器",
            stance="只保留有信息量的分支，并把每个周期写回记忆层。",
            influence=95,
            focus=["周期推进", "分支裁剪", "记忆回写"],
            kind="director",
            goals=["维持一致性", "保住反事实深度"],
            constraints=["分支爆炸"],
            memory_scope=["fact", "state", "tendency"],
            details={"time_mode": "semester"},
        ),
    ]
    paths = [
        PathDetail(
            id="research-first",
            branch_id="research-track",
            title="优先读研",
            thesis="延后收入爬坡，以换取更大的长期选择权和学术杠杆。",
            archetype="读研优先",
            confidence=83,
            risk=42,
            payoff=88,
            summary=(
                "当导师信号持续明确、记忆回写能让压力保持可见、且这条分支不掩盖财务压力时，"
                "它的综合收益最高。"
            ),
            score_breakdown={"optionality": 92, "income": 58, "stability": 67, "growth": 89},
            advice=AdviceBlock(
                immediate=[
                    "在六周内锁定一个能对外展示里程碑的项目。",
                    "把导师支持转化为带明确时间点的推荐承诺。",
                ],
                next_quarter=[
                    "申请同时并行推进一条实习对冲线。",
                    "每周跟踪精力状态；当健康负债变得不可见时，这条分支就会失效。",
                ],
                risk_controls=[
                    "如果推荐信质量下滑，就提前设定转向截止点。",
                    "始终保留一个可直接投递的作品集版本。",
                ],
                questions_to_track=[
                    "导师支持仍然具体吗，还是已经开始流于口头？",
                    "财务压力是否已经越过这条分支的承受线？",
                ],
            ),
            nodes=[
                PathNode(
                    id="rf-1",
                    title="导师承诺出具推荐",
                    type="opportunity",
                    time_label="第1个月",
                    summary="一个明确的实验室信号，会让读研申请更具可信度。",
                    deltas=[
                        MetricDelta(label="学术", value=14, axis="education"),
                        MetricDelta(label="风险", value=-4, axis="goal_alignment"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="mentor_signal",
                            label="导师信号",
                            value="强",
                            options=["弱", "一般", "强"],
                            rationale="推荐信质量是这条分支的核心解锁条件。",
                        )
                    ],
                    graph_node_ids=["mentor", "education-state", "decision-core"],
                    actors=["agent-self", "agent-mentor"],
                    phase="simulation",
                    details={"branch_trigger": "recommendation_quality"},
                ),
                PathNode(
                    id="rf-2",
                    title="申请周期压缩时间",
                    type="risk",
                    time_label="第3个月",
                    summary="随着申请负荷上升，睡眠和副线项目都会被进一步挤压。",
                    deltas=[
                        MetricDelta(label="身心状态", value=-11, axis="mental"),
                        MetricDelta(label="职业", value=4, axis="career"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="load",
                            label="申请负荷",
                            value="高",
                            options=["低", "中", "高"],
                        )
                    ],
                    graph_node_ids=["mental-state", "decision-core"],
                    actors=["agent-self", "agent-director"],
                    phase="state_update",
                    details={"state_loop": "stress_feedback"},
                ),
                PathNode(
                    id="rf-3",
                    title="录取结果打开专业化路径",
                    type="result",
                    time_label="第8个月",
                    summary="短期不确定性被转化成了更深的科研定位。",
                    deltas=[
                        MetricDelta(label="学术", value=18, axis="education"),
                        MetricDelta(label="城市选择", value=6, axis="optionality"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="admit_quality",
                            label="录取质量",
                            value="顶级",
                            options=["中等", "强", "顶级"],
                        )
                    ],
                    graph_node_ids=["future-self", "education-state"],
                    actors=["agent-director"],
                    phase="branching",
                    details={"future_window": "3年"},
                ),
            ],
            status="active",
            horizon="3年",
            focus_node_ids=["mentor", "education-state", "decision-core"],
            detail_fields={"dominant_agent": "导师", "loop": "导师信号驱动决策"},
            state_projection=_branch_projection("research-first", current_axes),
        ),
        PathDetail(
            id="hybrid-city",
            branch_id="hybrid-track",
            title="城市跳跃混合线",
            thesis="利用高密度城市岗位积累市场认知，同时保留继续深造的选择权。",
            archetype="工作-学习混合",
            confidence=79,
            risk=55,
            payoff=84,
            summary=(
                "当城市消耗可控、交付成果能沉淀为未来选择权，而不是只换来疲惫时，"
                "这条分支的上限最高。"
            ),
            score_breakdown={"optionality": 85, "income": 76, "stability": 61, "growth": 86},
            advice=AdviceBlock(
                immediate=[
                    "优先寻找有带教和真实交付成长曲线的岗位。",
                    "在优化表面薪资之前，先算清楚城市消耗率。",
                ],
                next_quarter=[
                    "每周预留固定学习时间，让读研对冲保持真实存在。",
                    "把已交付成果同时用作晋升证明和未来申请材料。",
                ],
                risk_controls=[
                    "避免在前 90 天就耗尽全部缓冲的岗位。",
                    "把住房和通勤成本压在压力阈值以下。",
                ],
                questions_to_track=[
                    "城市密度带来的人脉增益，是否快过它消耗精力的速度？",
                    "资金跑道是否稳定到足以支撑真实的选择权？",
                ],
            ),
            nodes=[
                PathNode(
                    id="hc-1",
                    title="上海岗位录用落地",
                    type="opportunity",
                    time_label="第2个月",
                    summary="一个强平台团队提供了立刻进入市场核心位置的机会。",
                    deltas=[
                        MetricDelta(label="职业", value=16, axis="career"),
                        MetricDelta(label="收入", value=14, axis="finance"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="offer_quality",
                            label="岗位质量",
                            value="强",
                            options=["弱", "一般", "强"],
                        )
                    ],
                    graph_node_ids=["employer", "city", "decision-core"],
                    actors=["agent-market", "agent-self"],
                    phase="simulation",
                    details={"opportunity_density": "高"},
                ),
                PathNode(
                    id="hc-2",
                    title="城市成本压力上升",
                    type="risk",
                    time_label="第4个月",
                    summary="如果日常节奏不能尽快稳定，高消耗会同时侵蚀储蓄和精力。",
                    deltas=[
                        MetricDelta(label="身心状态", value=-8, axis="mental"),
                        MetricDelta(label="家庭支持", value=-5, axis="family_support"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="cost_profile",
                            label="城市成本",
                            value="高",
                            options=["中", "高", "极高"],
                        )
                    ],
                    graph_node_ids=["finance-state", "mental-state", "city"],
                    actors=["agent-family", "agent-director"],
                    phase="state_update",
                    details={"state_loop": "runway_feedback"},
                ),
                PathNode(
                    id="hc-3",
                    title="混合履历可信度复利增长",
                    type="reflection",
                    time_label="第9个月",
                    summary="这条分支会同时产出已落地的工作成果和可信的转向叙事。",
                    deltas=[
                        MetricDelta(label="职业", value=13, axis="career"),
                        MetricDelta(label="选择权", value=12, axis="optionality"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="portfolio_signal",
                            label="作品集信号",
                            value="可见",
                            options=["弱", "可见", "强"],
                        )
                    ],
                    graph_node_ids=["future-self", "employer"],
                    actors=["agent-self", "agent-director"],
                    phase="branching",
                    details={"reflection_type": "counterfactual_ready"},
                ),
            ],
            status="candidate",
            horizon="3年",
            focus_node_ids=["employer", "city", "finance-state"],
            detail_fields={"dominant_agent": "market", "loop": "city_burn_to_runway"},
            state_projection=_branch_projection("hybrid-city", current_axes),
        ),
        PathDetail(
            id="pragmatic-employment",
            branch_id="stability-track",
            title="务实就业",
            thesis="先选择一个稳定岗位，降低不确定性，再从更平稳的基座上优化执行质量。",
            archetype="稳定优先",
            confidence=86,
            risk=31,
            payoff=73,
            summary=(
                "当家庭稳定和短期跑道需要明确答案时，这条分支最安全；"
                "但必须防止舒适感慢慢演变成低成长漂移。"
            ),
            score_breakdown={"optionality": 63, "income": 80, "stability": 91, "growth": 69},
            advice=AdviceBlock(
                immediate=[
                    "优先看直属管理者质量和团队跑道，而不是头衔光环。",
                    "谈出一定的职责所有权，让这条分支依然能积累技能复利。",
                ],
                next_quarter=[
                    "利用低波动环境，在下班后打磨一个可持续差异化能力。",
                    "到第六个月时复盘：舒适是否正在变成停滞。",
                ],
                risk_controls=[
                    "不要让短期缓解吞掉长期复利。",
                    "至少保留一条结构化再学习通道，并持续激活。",
                ],
                questions_to_track=[
                    "这条稳定分支是否还保留了足够的选择权？",
                    "确定性是否已经开始压制野心，而不是支持它？",
                ],
            ),
            nodes=[
                PathNode(
                    id="pe-1",
                    title="接受本地稳定录用",
                    type="decision",
                    time_label="第1个月",
                    summary="一个低波动岗位会立刻提升确定性，也更符合家庭预期。",
                    deltas=[
                        MetricDelta(label="稳定性", value=18, axis="family_support"),
                        MetricDelta(label="收入", value=9, axis="finance"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="location_choice",
                            label="地点选择",
                            value="本地",
                            options=["本地", "区域", "一线城市"],
                        )
                    ],
                    graph_node_ids=["family", "finance-state", "decision-core"],
                    actors=["agent-family", "agent-self"],
                    phase="simulation",
                    details={"stability_gain": "高"},
                ),
                PathNode(
                    id="pe-2",
                    title="成长斜率需要刻意设计",
                    type="risk",
                    time_label="第5个月",
                    summary="如果把全部野心都换成舒适感，这条分支就会开始漂移。",
                    deltas=[
                        MetricDelta(label="成长", value=-7, axis="career"),
                        MetricDelta(label="身心状态", value=6, axis="mental"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="stretch_scope",
                            label="拉伸空间",
                            value="中等",
                            options=["低", "中等", "高"],
                        )
                    ],
                    graph_node_ids=["mental-state", "employer"],
                    actors=["agent-self", "agent-director"],
                    phase="state_update",
                    details={"drift_risk": "medium"},
                ),
                PathNode(
                    id="pe-3",
                    title="稳定基座支撑聚焦升级",
                    type="result",
                    time_label="第10个月",
                    summary="稳定执行会为下一次更有意识的转向腾出空间。",
                    deltas=[
                        MetricDelta(label="职业", value=9, axis="career"),
                        MetricDelta(label="风险", value=-8, axis="mental"),
                    ],
                    editable_fields=[
                        EditableField(
                            key="upskill_lane",
                            label="升级通道",
                            value="活跃",
                            options=["停滞", "活跃", "可见"],
                        )
                    ],
                    graph_node_ids=["future-self", "finance-state"],
                    actors=["agent-self"],
                    phase="branching",
                    details={"upgrade_window": "6-12个月"},
                ),
            ],
            status="candidate",
            horizon="3年",
            focus_node_ids=["family", "finance-state", "future-self"],
            detail_fields={"dominant_agent": "family", "loop": "certainty_to_runway"},
            state_projection=_branch_projection("pragmatic-employment", current_axes),
        ),
    ]
    _refresh_paths(paths, current_axes, selected_path_id="research-first")

    branches = [
        BranchOverview(
            id="research-track",
            title="读研路径",
            thesis=next(path.thesis for path in paths if path.id == "research-first"),
            kind="main",
            status="active",
            cycle_index=1,
            horizon="semester",
            state_snapshot_id=cycle_one_snapshot.id,
            path_id="research-first",
            confidence=next(path.confidence for path in paths if path.id == "research-first"),
            tags=["graduate-school", "optionality"],
            notes="之所以保留，是因为导师杠杆和长期上行目前仍然占优。",
            focus_metrics=next(path.score_breakdown for path in paths if path.id == "research-first"),
        ),
        BranchOverview(
            id="hybrid-track",
            title="混合路径",
            thesis=next(path.thesis for path in paths if path.id == "hybrid-city"),
            kind="alternative",
            status="candidate",
            cycle_index=1,
            horizon="semester",
            state_snapshot_id=cycle_one_snapshot.id,
            path_id="hybrid-city",
            confidence=next(path.confidence for path in paths if path.id == "hybrid-city"),
            tags=["city", "career-study"],
            notes="之所以保留，是因为它是市场上行空间最大的对冲线。",
            focus_metrics=next(path.score_breakdown for path in paths if path.id == "hybrid-city"),
        ),
        BranchOverview(
            id="stability-track",
            title="稳定路径",
            thesis=next(path.thesis for path in paths if path.id == "pragmatic-employment"),
            kind="conservative",
            status="candidate",
            cycle_index=1,
            horizon="semester",
            state_snapshot_id=cycle_one_snapshot.id,
            path_id="pragmatic-employment",
            confidence=next(path.confidence for path in paths if path.id == "pragmatic-employment"),
            tags=["runway", "family"],
            notes="之所以保留，是因为它对下行风险的控制明显更好。",
            focus_metrics=next(path.score_breakdown for path in paths if path.id == "pragmatic-employment"),
        ),
    ]

    memories = [
        _memory(
            "memory-fact-1",
            "fact",
            "双轨对冲已建立",
            "第一轮周期后，调度器保留了读研、城市混合线和稳定就业三条分支。",
            generated_at,
            branch_id="main-track",
            related_node_ids=["decision-core", "future-self"],
            data={"retained_branches": ["research-track", "hybrid-track", "stability-track"]},
        ),
        _memory(
            "memory-state-1",
            "state",
            "状态向量已更新",
            "选择权和目标一致性有所上升，但在维持多条分支同时存活的成本下，心理余裕被压缩了。",
            generated_at,
            branch_id="main-track",
            related_node_ids=["mental-state", "education-state", "finance-state"],
            data={"axes": cycle_one_snapshot.axes.model_dump(), "deltas": cycle_one_snapshot.deltas},
        ),
        _memory(
            "memory-tendency-1",
            "tendency",
            "对冲式决策倾向被强化",
            "当前自我仍倾向于保留期权价值，并尽量推迟不可逆承诺。",
            generated_at,
            branch_id="main-track",
            related_node_ids=["self", "decision-core"],
            data={"tendency": "hedged_optionalist"},
        ),
    ]

    llm = describe_runtime()
    llm.last_prompt_kind = "bootstrap"
    llm.last_response_preview = "已发现运行时；下一轮周期将开始生成调度注释。"

    simulation_events = [
        SimulationEvent(
            id="event-1",
            phase="intake",
            title="画像已归一化",
            description="问卷输入已被转换成稳定的人生模拟基线。",
            impact="1 个基础画像",
            timestamp=generated_at,
            actor_id="agent-director",
            node_ids=["self"],
            details={"规划周期": "3年"},
            llm_mode=llm.mode,
        ),
        SimulationEvent(
            id="event-2",
            phase="expansion",
            title="人生图谱已扩展",
            description="系统已把当前问题扩展为主体、机构、状态节点和分支决策点。",
            impact="10 个节点 / 8 条边",
            timestamp=generated_at,
            actor_id="agent-director",
            node_ids=["mentor", "family", "employer", "city", "decision-core"],
            details={"graph_categories": ["subject", "institution", "state", "decision", "goal"]},
            llm_mode=llm.mode,
        ),
        SimulationEvent(
            id="event-3",
            phase="simulation",
            title="代理已执行第一轮周期",
            description="自我、关系、机构与调度代理共同推进了第一轮中期演化。",
            impact="第 1 轮完成",
            timestamp=generated_at,
            actor_id="agent-director",
            node_ids=["self", "mentor", "family", "decision-core"],
            details={"time_mode": "semester"},
            llm_mode=llm.mode,
        ),
        SimulationEvent(
            id="event-4",
            phase="state_update",
            title="状态快照已写入",
            description="双轨决策提升了选择权，同时压缩了心理余裕，使第一条闭环真正成为有状态演化。",
            impact="1 个当前快照",
            timestamp=generated_at,
            actor_id="agent-director",
            node_ids=["education-state", "finance-state", "mental-state"],
            details={"snapshot_id": cycle_one_snapshot.id, "deltas": cycle_one_snapshot.deltas},
            llm_mode=llm.mode,
        ),
        SimulationEvent(
            id="event-5",
            phase="memory",
            title="记忆层已更新",
            description="事实、状态和倾向三层记忆已写回，后续周期会继承这些后果。",
            impact="3 条记忆记录",
            timestamp=generated_at,
            actor_id="agent-director",
            node_ids=["self", "decision-core"],
            memory_ids=[memory.id for memory in memories],
            details={"layers": ["fact", "state", "tendency"]},
            llm_mode=llm.mode,
        ),
        SimulationEvent(
            id="event-6",
            phase="branching",
            title="已保留三条分支",
            description="调度器将前沿裁剪为读研、城市混合线和稳定优先三条候选路径。",
            impact="3 个候选未来",
            timestamp=generated_at,
            actor_id="agent-director",
            node_ids=["decision-core", "future-self"],
            details={"active_branch": "research-track"},
            llm_mode=llm.mode,
        ),
    ]

    stitch = StitchManifest(
        project_id="8477727617233002131",
        assets=[
            StitchAsset(
                id="0f67e2ca1d744bfe960622c66b13a8b7",
                name="策略协议（技术）",
                kind="screen",
                status="missing_auth",
            ),
            StitchAsset(
                id="70fef224eb49493a8f4f4a4dedf6fbfe",
                name="模拟流程（技术）",
                kind="screen",
                status="missing_auth",
            ),
            StitchAsset(
                id="1e03d2df82b941bf96acf793a03f4eec",
                name="路径详情（技术）",
                kind="screen",
                status="missing_auth",
            ),
            StitchAsset(
                id="b532765517ea4a6491f3b7f5a0362bf9",
                name="落地页（技术）",
                kind="screen",
                status="missing_auth",
            ),
            StitchAsset(
                id="asset-stub-assets-7524043e9a58414ba53b5625b54594e8-1775894506576",
                name="设计系统",
                kind="design_system",
                status="missing_auth",
            ),
        ],
    )

    state = DashboardState(
        generated_at=generated_at,
        profile=profile,
        graph_nodes=graph_nodes,
        graph_edges=graph_edges,
        agents=agents,
        simulation_events=simulation_events,
        paths=paths,
        stitch=stitch,
        current_cycle=1,
        time_mode="semester",
        active_branch_id="research-track",
        current_state=cycle_one_snapshot,
        state_snapshots=[intake_snapshot, cycle_one_snapshot],
        memories=memories,
        branches=branches,
        llm=llm,
    )
    _sync_branches(state)
    state.graph_meta = _build_graph_meta(state.graph_nodes, state.graph_edges, state.branches)
    return state


def advance_simulation(state: DashboardState) -> DashboardState:
    updated = deepcopy(state)
    updated.generated_at = _utc_now()
    updated.current_cycle += 1

    active_path = max(updated.paths, key=_path_utility)
    active_branch_id = active_path.branch_id or active_path.id
    delta = _advance_delta(active_path.id)
    note, runtime = generate_text(
        "director_cycle",
        {
            "cycle_index": updated.current_cycle,
            "branch_title": active_path.title,
            "focus_axis": max(active_path.score_breakdown, key=active_path.score_breakdown.get),
            "signals": active_path.focus_node_ids,
        },
    )
    updated.llm = runtime

    new_snapshot = _snapshot(
        f"snapshot-cycle-{updated.current_cycle}",
        active_branch_id,
        updated.current_cycle,
        "state_update",
        _semester_label(updated.current_cycle),
        _apply_vector_delta(updated.current_state.axes, delta),
        note,
        updated.generated_at,
        deltas=delta,
        triggers=[active_path.id, "director_cycle_advanced"],
    )
    updated.state_snapshots.append(new_snapshot)
    updated.current_state = new_snapshot
    updated.active_branch_id = active_branch_id

    for node in updated.graph_nodes:
        if node.id == "education-state":
            node.score = new_snapshot.axes.education
            node.metrics["education"] = new_snapshot.axes.education
            node.updated_at = updated.generated_at
        elif node.id == "finance-state":
            node.score = new_snapshot.axes.finance
            node.metrics["finance"] = new_snapshot.axes.finance
            node.updated_at = updated.generated_at
        elif node.id == "mental-state":
            node.score = new_snapshot.axes.mental
            node.metrics["mental"] = new_snapshot.axes.mental
            node.metrics["health"] = new_snapshot.axes.health
            node.updated_at = updated.generated_at
        elif node.id == "future-self":
            node.score = new_snapshot.axes.goal_alignment
            node.metrics["goal_alignment"] = new_snapshot.axes.goal_alignment
            node.metrics["optionality"] = new_snapshot.axes.optionality
            node.updated_at = updated.generated_at

    reflection_node_id = f"cycle-{updated.current_cycle}-reflection"
    updated.graph_nodes.append(
        GraphNode(
            id=reflection_node_id,
            uuid=f"node-{reflection_node_id}",
            label=f"第{updated.current_cycle}轮反思",
            name=f"调度反思 {updated.current_cycle}",
            type="reflection",
            category="event",
            description=note,
            summary="周期级反思节点会让前端中的图谱保持可解释。",
            score=_clamp(_path_utility(active_path)),
            group="reflection",
            branch_ids=[active_branch_id],
            labels=["反思", "调度注释"],
            tags=["cycle", "explainability"],
            metrics={"cycle": updated.current_cycle},
            details={"selected_path": active_path.id},
            attributes={"llm_mode": runtime.mode},
            phase="reflection",
            time_label=_semester_label(updated.current_cycle),
            created_at=updated.generated_at,
            updated_at=updated.generated_at,
            position=GraphPosition(x=0.82, y=0.16 + (updated.current_cycle % 4) * 0.12),
        )
    )
    updated.graph_edges.append(
        GraphEdge(
            id=f"edge-decision-reflection-{updated.current_cycle}",
            uuid=f"edge-decision-reflection-{updated.current_cycle}",
            source="decision-core",
            target=reflection_node_id,
            source_name="读研 / 就业分叉",
            target_name=f"调度反思 {updated.current_cycle}",
            name="produces_reflection",
            relation="interprets",
            fact_type="director_note",
            fact=note,
            strength=4,
            weight=0.7,
            polarity="mixed",
            labels=["explainability"],
            details={"cycle": updated.current_cycle},
            branch_ids=[active_branch_id],
            created_at=updated.generated_at,
            updated_at=updated.generated_at,
        )
    )

    for edge in updated.graph_edges:
        if edge.id == "edge-finance-self-loop":
            edge.episodes.append(
                GraphEdgeEpisode(
                    id=f"episode-finance-{updated.current_cycle}",
                    title=f"第 {updated.current_cycle} 轮财务反馈",
                    summary=f"{active_path.title} 让财务压力在循环推进中持续保持可见。",
                    timestamp=updated.generated_at,
                    impact=f"财务 {new_snapshot.axes.finance}",
                    details={"cycle": updated.current_cycle, "branch": active_path.id},
                )
            )
            edge.updated_at = updated.generated_at
        elif edge.id == "edge-mental-self-loop":
            edge.episodes.append(
                GraphEdgeEpisode(
                    id=f"episode-mental-{updated.current_cycle}",
                    title=f"第 {updated.current_cycle} 轮心理反馈",
                    summary="调度器把可持续性压力记录为一等状态迁移，而不是附属注释。",
                    timestamp=updated.generated_at,
                    impact=f"心理 {new_snapshot.axes.mental}",
                    details={"cycle": updated.current_cycle, "branch": active_path.id},
                )
            )
            edge.updated_at = updated.generated_at

    updated.memories.extend(
        [
            _memory(
                f"memory-fact-{updated.current_cycle}",
                "fact",
                f"第 {updated.current_cycle} 轮已推进",
                f"{active_path.title} 成为第 {updated.current_cycle} 轮的活跃分支。",
                updated.generated_at,
                branch_id=active_branch_id,
                related_node_ids=["decision-core", reflection_node_id],
                data={"path_id": active_path.id, "cycle": updated.current_cycle},
            ),
            _memory(
                f"memory-state-{updated.current_cycle}",
                "state",
                f"第 {updated.current_cycle} 轮状态快照",
                "最新状态快照已持久化，后续分支会继承它带来的后果。",
                updated.generated_at,
                branch_id=active_branch_id,
                related_node_ids=["education-state", "finance-state", "mental-state"],
                data={"axes": new_snapshot.axes.model_dump(), "deltas": delta},
            ),
            _memory(
                f"memory-tendency-{updated.current_cycle}",
                "tendency",
                f"{active_path.title} 的分支倾向被强化",
                note,
                updated.generated_at,
                branch_id=active_branch_id,
                related_node_ids=["self", "future-self"],
                data={"focus_axis": max(active_path.score_breakdown, key=active_path.score_breakdown.get)},
            ),
        ]
    )

    active_path.summary = f"{active_path.summary} {note}"
    active_path.detail_fields["last_director_note"] = note
    active_path.detail_fields["last_cycle"] = updated.current_cycle
    _refresh_paths(updated.paths, new_snapshot.axes, selected_path_id=active_path.id)
    _sync_branches(updated)
    for branch in updated.branches:
        branch.cycle_index = updated.current_cycle
        branch.state_snapshot_id = new_snapshot.id
        if branch.id == active_branch_id:
            branch.notes = note

    updated.simulation_events.extend(
        [
            SimulationEvent(
                id=f"event-{len(updated.simulation_events) + 1}",
                phase="simulation",
                title="调度器推进到下一轮",
                description=f"{active_path.title} 成为新学期的活跃分支。",
                impact=f"第 {updated.current_cycle} 轮",
                timestamp=updated.generated_at,
                actor_id="agent-director",
                branch_id=active_branch_id,
                node_ids=["decision-core", reflection_node_id],
                details={"path_id": active_path.id},
                llm_mode=runtime.mode,
            ),
            SimulationEvent(
                id=f"event-{len(updated.simulation_events) + 2}",
                phase="state_update",
                title="状态快照已刷新",
                description="分支执行改变了当前状态向量，并同步更新了图中的状态节点。",
                impact=new_snapshot.id,
                timestamp=updated.generated_at,
                actor_id="agent-director",
                branch_id=active_branch_id,
                node_ids=["education-state", "finance-state", "mental-state"],
                details={"deltas": delta},
                llm_mode=runtime.mode,
            ),
            SimulationEvent(
                id=f"event-{len(updated.simulation_events) + 3}",
                phase="memory",
                title="记忆回写已完成",
                description="事实、状态和倾向记忆已为最新周期追加完成。",
                impact="3 条新增记忆",
                timestamp=updated.generated_at,
                actor_id="agent-director",
                branch_id=active_branch_id,
                node_ids=["self", "future-self"],
                memory_ids=[memory.id for memory in updated.memories[-3:]],
                details={"snapshot_id": new_snapshot.id},
                llm_mode=runtime.mode,
            ),
        ]
    )

    updated.graph_meta = _build_graph_meta(updated.graph_nodes, updated.graph_edges, updated.branches)
    return updated


_DISPLAY_VALUE_MAP = {
    "strong": "强",
    "stronger": "更强",
    "top": "顶级",
    "visible": "可见",
    "active": "活跃",
    "medium": "中",
    "moderate": "中等",
    "high": "高",
    "extreme": "极高",
    "uncertain": "不确定",
    "weak": "弱",
    "low": "低",
    "planning horizon": "规划周期",
    "planning window": "规划周期",
    "core tension": "核心张力",
    "city preference": "城市偏好",
    "3 years": "3年",
}


def _display_value(value: str) -> str:
    return _DISPLAY_VALUE_MAP.get(value.strip().lower(), value)


def rerun_path_with_edit(
    state: DashboardState,
    path_id: str,
    node_id: str,
    field_key: str,
    value: str,
) -> DashboardState:
    updated = deepcopy(state)
    updated.generated_at = _utc_now()

    target_path: PathDetail | None = None
    target_node: PathNode | None = None
    for path in updated.paths:
        if path.id != path_id:
            continue
        target_path = path
        for node in path.nodes:
            if node.id == node_id:
                target_node = node
                break
        break

    if target_path is None or target_node is None:
        return updated

    old_confidence = target_path.confidence
    normalized = value.lower()
    focus_axis = target_path.focus_node_ids[0] if target_path.focus_node_ids else "decision-core"
    field_label = "编辑项"
    display_value = _display_value(value)

    for field in target_node.editable_fields:
        if field.key == field_key:
            field.value = value
            field_label = field.label or "编辑项"
            break

    if any(token in normalized for token in ["strong", "stronger", "top", "visible", "active", "强", "更强", "顶级", "可见", "活跃"]):
        target_path.confidence = _clamp(target_path.confidence + 6)
        target_path.payoff = _clamp(target_path.payoff + 5)
        target_path.risk = _clamp(target_path.risk - 4)
        target_node.deltas.append(MetricDelta(label="编辑抬升", value=6, axis="optionality"))
    elif any(token in normalized for token in ["high", "extreme", "uncertain", "weak", "高", "极高", "极端", "不确定", "弱"]):
        target_path.confidence = _clamp(target_path.confidence - 4)
        target_path.payoff = _clamp(target_path.payoff - 2)
        target_path.risk = _clamp(target_path.risk + 5)
        target_node.deltas.append(MetricDelta(label="约束拖累", value=-4, axis="mental"))
    else:
        target_path.confidence = _clamp(target_path.confidence + 1)
        target_path.payoff = _clamp(target_path.payoff + 1)
        target_path.risk = _clamp(target_path.risk + 1)
        target_node.deltas.append(MetricDelta(label="反事实不确定性", value=-1, axis="goal_alignment"))

    note, runtime = generate_text(
        "path_rerun",
        {
            "path_title": target_path.title,
            "focus_axis": focus_axis,
            "field_label": field_label,
            "value": display_value,
            "signals": [field_label, display_value, node_id],
            "cycle_index": updated.current_cycle,
        },
    )
    updated.llm = runtime

    base_summary = target_path.detail_fields.get("base_summary")
    if not isinstance(base_summary, str) or not base_summary:
        base_summary = target_path.summary
        target_path.detail_fields["base_summary"] = base_summary

    target_path.summary = f"{base_summary} 已在 {target_node.title} 将 {field_label} 调整为 {display_value}。{note}"
    target_path.detail_fields["last_counterfactual_note"] = note
    target_path.detail_fields["last_edit"] = {
        "node_id": node_id,
        "field_key": field_key,
        "field_label": field_label,
        "value": value,
        "display_value": display_value,
    }
    target_path.state_projection = _branch_projection(target_path.id, updated.current_state.axes)

    branch_id = target_path.branch_id or target_path.id
    counterfactual_memory = _memory(
        f"memory-counterfactual-{len(updated.memories) + 1}",
        "tendency",
        f"{target_path.title} 的反事实编辑",
        note,
        updated.generated_at,
        branch_id=branch_id,
        related_node_ids=target_node.graph_node_ids or [node_id],
        data={
            "field_key": field_key,
            "field_label": field_label,
            "value": value,
            "display_value": display_value,
            "confidence_delta": target_path.confidence - old_confidence,
        },
    )
    updated.memories.append(counterfactual_memory)

    edge_target = target_node.graph_node_ids[0] if target_node.graph_node_ids else "future-self"
    updated.graph_edges = [
        edge
        for edge in updated.graph_edges
        if not (
            edge.relation == "counterfactual"
            and edge.details.get("node_id") == node_id
            and edge.details.get("field_key") == field_key
            and branch_id in edge.branch_ids
        )
    ]

    edge_id = f"edge-counterfactual-{path_id}-{node_id}-{field_key}"
    updated.graph_edges.append(
        GraphEdge(
            id=edge_id,
            uuid=edge_id,
            source="decision-core",
            target=edge_target,
            source_name="读研 / 就业分叉",
            target_name=target_node.title,
            name="counterfactual_edit",
            relation="counterfactual",
            fact_type="user_edit",
            fact=f"{field_label} 调整为 {display_value}",
            strength=4,
            weight=0.72,
            polarity="mixed",
            labels=["counterfactual", "multi-edge"],
            details={
                "note": note,
                "node_id": node_id,
                "field_key": field_key,
                "field_label": field_label,
                "display_value": display_value,
            },
            branch_ids=[branch_id],
            multi_edge_key=f"decision-core::{edge_target}",
            created_at=updated.generated_at,
            updated_at=updated.generated_at,
        )
    )

    updated.simulation_events.append(
        SimulationEvent(
            id=f"event-{len(updated.simulation_events) + 1}",
            phase="branching",
            title=f"路径重跑：{target_path.title}",
            description=f"已在 {target_node.title} 应用“{field_label} = {display_value}”的编辑，并重新生成后续解释。",
            branch_id=branch_id,
            impact=f"置信度 {target_path.confidence} / 风险 {target_path.risk}",
            timestamp=updated.generated_at,
            actor_id="agent-director",
            node_ids=target_node.graph_node_ids or [node_id],
            memory_ids=[counterfactual_memory.id],
            details={
                "field_key": field_key,
                "field_label": field_label,
                "value": value,
                "display_value": display_value,
            },
            llm_mode=runtime.mode,
        )
    )

    _refresh_paths(updated.paths, updated.current_state.axes, selected_path_id=target_path.id)
    _sync_branches(updated)
    for branch in updated.branches:
        if branch.id == branch_id:
            branch.notes = note
            branch.confidence = target_path.confidence
    updated.graph_meta = _build_graph_meta(updated.graph_nodes, updated.graph_edges, updated.branches)
    return updated
