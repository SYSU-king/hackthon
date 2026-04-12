export type MetricDelta = {
  label: string
  value: number
  axis?: string | null
  rationale?: string | null
}

export type GraphPosition = {
  x: number
  y: number
}

export type GraphNode = {
  id: string
  label: string
  type: string
  description: string
  score: number
  group: string
  position: GraphPosition
  uuid?: string | null
  name?: string | null
  category: string
  subtype?: string | null
  summary?: string | null
  labels: string[]
  tags: string[]
  metrics: Record<string, number>
  details: Record<string, unknown>
  attributes: Record<string, unknown>
  branch_ids: string[]
  status: string
  phase: string
  time_label?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type GraphEdgeEpisode = {
  id: string
  title: string
  summary: string
  timestamp: string
  impact?: string | null
  details: Record<string, unknown>
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  relation: string
  strength: number
  uuid?: string | null
  name?: string | null
  source_name?: string | null
  target_name?: string | null
  fact_type: string
  fact?: string | null
  weight: number
  polarity: string
  labels: string[]
  details: Record<string, unknown>
  attributes: Record<string, unknown>
  episodes: GraphEdgeEpisode[]
  branch_ids: string[]
  multi_edge_key?: string | null
  status: string
  allows_self_loop: boolean
  created_at?: string | null
  updated_at?: string | null
}

export type AgentCard = {
  id: string
  name: string
  role: string
  stance: string
  influence: number
  focus: string[]
  kind: string
  goals: string[]
  constraints: string[]
  memory_scope: string[]
  details: Record<string, unknown>
}

export type SimulationEvent = {
  id: string
  phase: string
  title: string
  description: string
  branch_id?: string | null
  impact: string
  timestamp: string
  actor_id?: string | null
  node_ids: string[]
  memory_ids: string[]
  details: Record<string, unknown>
  llm_mode?: string | null
}

export type EditableField = {
  key: string
  label: string
  value: string
  field_type: string
  options: string[]
  rationale?: string | null
}

export type PathNode = {
  id: string
  title: string
  type: string
  time_label: string
  summary: string
  deltas: MetricDelta[]
  editable_fields: EditableField[]
  graph_node_ids: string[]
  actors: string[]
  phase?: string | null
  details: Record<string, unknown>
}

export type AdviceBlock = {
  immediate: string[]
  next_quarter: string[]
  risk_controls: string[]
  questions_to_track: string[]
}

export type StateVector = {
  education: number
  career: number
  finance: number
  health: number
  mental: number
  relationship: number
  family_support: number
  social_capital: number
  optionality: number
  goal_alignment: number
  [key: string]: number
}

export type StateSnapshot = {
  id: string
  branch_id: string
  cycle_index: number
  phase: string
  time_label: string
  axes: StateVector
  narrative: string
  deltas: Record<string, number>
  triggers: string[]
  timestamp: string
}

export type MemoryRecord = {
  id: string
  layer: string
  title: string
  summary: string
  branch_id?: string | null
  related_node_ids: string[]
  data: Record<string, unknown>
  timestamp: string
}

export type BranchOverview = {
  id: string
  title: string
  thesis: string
  kind: string
  status: string
  parent_branch_id?: string | null
  depth: number
  cycle_index: number
  horizon: string
  state_snapshot_id?: string | null
  path_id?: string | null
  confidence: number
  tags: string[]
  notes?: string | null
  focus_metrics: Record<string, number>
}

export type GraphMeta = {
  node_count: number
  edge_count: number
  branch_count: number
  self_loop_count: number
  multi_edge_group_count: number
  supports_self_loops: boolean
  supports_multi_edges: boolean
  node_categories: string[]
  detail_fields: string[]
}

export type LLMRuntime = {
  provider: string
  mode: string
  base_url?: string | null
  model?: string | null
  configured: boolean
  api_key_present: boolean
  used_fallback: boolean
  last_error?: string | null
  last_prompt_kind?: string | null
  last_response_preview?: string | null
}

export type PathDetail = {
  id: string
  title: string
  thesis: string
  archetype: string
  confidence: number
  risk: number
  payoff: number
  summary: string
  nodes: PathNode[]
  advice: AdviceBlock
  score_breakdown: Record<string, number>
  branch_id?: string | null
  status: string
  horizon: string
  focus_node_ids: string[]
  detail_fields: Record<string, unknown>
  state_projection?: StateVector | null
}

export type UserProfile = {
  name: string
  stage: string
  location: string
  concern: string
  objective: string
  weights: Record<string, number>
  risk_tolerance: number
  planning_horizon: string
  initial_parameters: Record<string, unknown>
}

export type StitchAsset = {
  id: string
  name: string
  kind: string
  status: string
  image_path?: string | null
  html_path?: string | null
}

export type StitchManifest = {
  project_id: string
  assets: StitchAsset[]
}

export type DashboardState = {
  generated_at: string
  profile: UserProfile
  graph_nodes: GraphNode[]
  graph_edges: GraphEdge[]
  agents: AgentCard[]
  simulation_events: SimulationEvent[]
  paths: PathDetail[]
  stitch: StitchManifest
  current_cycle: number
  time_mode: string
  active_branch_id?: string | null
  current_state: StateSnapshot
  state_snapshots: StateSnapshot[]
  memories: MemoryRecord[]
  branches: BranchOverview[]
  graph_meta: GraphMeta
  llm: LLMRuntime
}

export type RerunPayload = {
  node_id: string
  field_key: string
  value: string
}
