from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class MetricDelta(BaseModel):
    label: str
    value: int
    axis: str | None = None
    rationale: str | None = None


class GraphPosition(BaseModel):
    x: float
    y: float


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    description: str
    score: int = Field(default=50, ge=0, le=100)
    group: str = "default"
    position: GraphPosition
    uuid: str | None = None
    name: str | None = None
    category: str = "generic"
    subtype: str | None = None
    summary: str | None = None
    labels: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    metrics: dict[str, int] = Field(default_factory=dict)
    details: dict[str, Any] = Field(default_factory=dict)
    attributes: dict[str, Any] = Field(default_factory=dict)
    branch_ids: list[str] = Field(default_factory=list)
    status: str = "active"
    phase: str = "world-model"
    time_label: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class GraphEdgeEpisode(BaseModel):
    id: str
    title: str
    summary: str
    timestamp: str
    impact: str | None = None
    details: dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relation: str
    strength: int = Field(default=3, ge=1, le=5)
    uuid: str | None = None
    name: str | None = None
    source_name: str | None = None
    target_name: str | None = None
    fact_type: str = "causal"
    fact: str | None = None
    weight: float = 1.0
    polarity: str = "neutral"
    labels: list[str] = Field(default_factory=list)
    details: dict[str, Any] = Field(default_factory=dict)
    attributes: dict[str, Any] = Field(default_factory=dict)
    episodes: list[GraphEdgeEpisode] = Field(default_factory=list)
    branch_ids: list[str] = Field(default_factory=list)
    multi_edge_key: str | None = None
    status: str = "active"
    allows_self_loop: bool = True
    created_at: str | None = None
    updated_at: str | None = None


class AgentCard(BaseModel):
    id: str
    name: str
    role: str
    stance: str
    influence: int = Field(ge=0, le=100)
    focus: list[str]
    kind: str = "self"
    goals: list[str] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)
    memory_scope: list[str] = Field(default_factory=list)
    details: dict[str, Any] = Field(default_factory=dict)


class SimulationEvent(BaseModel):
    id: str
    phase: str
    title: str
    description: str
    branch_id: str | None = None
    impact: str
    timestamp: str
    actor_id: str | None = None
    node_ids: list[str] = Field(default_factory=list)
    memory_ids: list[str] = Field(default_factory=list)
    details: dict[str, Any] = Field(default_factory=dict)
    llm_mode: str | None = None


class EditableField(BaseModel):
    key: str
    label: str
    value: str
    field_type: str = "text"
    options: list[str] = Field(default_factory=list)
    rationale: str | None = None


class PathNode(BaseModel):
    id: str
    title: str
    type: str
    time_label: str
    summary: str
    deltas: list[MetricDelta]
    editable_fields: list[EditableField]
    graph_node_ids: list[str] = Field(default_factory=list)
    actors: list[str] = Field(default_factory=list)
    phase: str | None = None
    details: dict[str, Any] = Field(default_factory=dict)


class AdviceBlock(BaseModel):
    immediate: list[str]
    next_quarter: list[str]
    risk_controls: list[str]
    questions_to_track: list[str] = Field(default_factory=list)


class StateVector(BaseModel):
    model_config = ConfigDict(extra="allow")

    education: int = Field(default=50, ge=0, le=100)
    career: int = Field(default=50, ge=0, le=100)
    finance: int = Field(default=50, ge=0, le=100)
    health: int = Field(default=50, ge=0, le=100)
    mental: int = Field(default=50, ge=0, le=100)
    relationship: int = Field(default=50, ge=0, le=100)
    family_support: int = Field(default=50, ge=0, le=100)
    social_capital: int = Field(default=50, ge=0, le=100)
    optionality: int = Field(default=50, ge=0, le=100)
    goal_alignment: int = Field(default=50, ge=0, le=100)


class StateSnapshot(BaseModel):
    id: str = "snapshot-0"
    branch_id: str = "main-track"
    cycle_index: int = 0
    phase: str = "intake"
    time_label: str = "第0学期"
    axes: StateVector = Field(default_factory=StateVector)
    narrative: str = ""
    deltas: dict[str, int] = Field(default_factory=dict)
    triggers: list[str] = Field(default_factory=list)
    timestamp: str = ""


class MemoryRecord(BaseModel):
    id: str
    layer: str
    title: str
    summary: str
    branch_id: str | None = None
    related_node_ids: list[str] = Field(default_factory=list)
    data: dict[str, Any] = Field(default_factory=dict)
    timestamp: str


class BranchOverview(BaseModel):
    id: str
    title: str
    thesis: str
    kind: str = "main"
    status: str = "active"
    parent_branch_id: str | None = None
    depth: int = 0
    cycle_index: int = 0
    horizon: str = "semester"
    state_snapshot_id: str | None = None
    path_id: str | None = None
    confidence: int = Field(default=50, ge=0, le=100)
    tags: list[str] = Field(default_factory=list)
    notes: str | None = None
    focus_metrics: dict[str, int] = Field(default_factory=dict)


class GraphMeta(BaseModel):
    node_count: int = 0
    edge_count: int = 0
    branch_count: int = 0
    self_loop_count: int = 0
    multi_edge_group_count: int = 0
    supports_self_loops: bool = True
    supports_multi_edges: bool = True
    node_categories: list[str] = Field(default_factory=list)
    detail_fields: list[str] = Field(
        default_factory=lambda: ["details", "attributes", "episodes", "metrics"]
    )


class LLMRuntime(BaseModel):
    provider: str = "local-fallback"
    mode: str = "fallback"
    base_url: str | None = None
    model: str | None = None
    configured: bool = False
    api_key_present: bool = False
    used_fallback: bool = True
    last_error: str | None = None
    last_prompt_kind: str | None = None
    last_response_preview: str | None = None


class PathDetail(BaseModel):
    id: str
    title: str
    thesis: str
    archetype: str
    confidence: int = Field(ge=0, le=100)
    risk: int = Field(ge=0, le=100)
    payoff: int = Field(ge=0, le=100)
    summary: str
    nodes: list[PathNode]
    advice: AdviceBlock
    score_breakdown: dict[str, int]
    branch_id: str | None = None
    status: str = "candidate"
    horizon: str = "semester"
    focus_node_ids: list[str] = Field(default_factory=list)
    detail_fields: dict[str, Any] = Field(default_factory=dict)
    state_projection: StateVector | None = None


class UserProfile(BaseModel):
    name: str
    stage: str
    location: str
    concern: str
    objective: str
    weights: dict[str, int]
    risk_tolerance: int = Field(default=50, ge=0, le=100)
    planning_horizon: str = "3年"
    initial_parameters: dict[str, Any] = Field(default_factory=dict)


class StitchAsset(BaseModel):
    id: str
    name: str
    kind: str
    status: str
    image_path: str | None = None
    html_path: str | None = None


class StitchManifest(BaseModel):
    project_id: str
    assets: list[StitchAsset]


class DashboardState(BaseModel):
    generated_at: str
    profile: UserProfile
    graph_nodes: list[GraphNode]
    graph_edges: list[GraphEdge]
    agents: list[AgentCard]
    simulation_events: list[SimulationEvent]
    paths: list[PathDetail]
    stitch: StitchManifest
    current_cycle: int = 0
    time_mode: str = "semester"
    active_branch_id: str | None = "main-track"
    current_state: StateSnapshot = Field(default_factory=StateSnapshot)
    state_snapshots: list[StateSnapshot] = Field(default_factory=list)
    memories: list[MemoryRecord] = Field(default_factory=list)
    branches: list[BranchOverview] = Field(default_factory=list)
    graph_meta: GraphMeta = Field(default_factory=GraphMeta)
    llm: LLMRuntime = Field(default_factory=LLMRuntime)


class RerunRequest(BaseModel):
    node_id: str
    field_key: str
    value: str
