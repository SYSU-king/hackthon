const AXIS_LABELS: Record<string, string> = {
  education: '学业',
  career: '职业',
  finance: '财务',
  health: '健康',
  mental: '心理',
  relationship: '关系',
  family_support: '家庭支持',
  social_capital: '社会资本',
  optionality: '选择权',
  goal_alignment: '目标一致性',
  academics: '学术',
  city: '城市',
  family: '家庭',
  wellbeing: '身心状态',
  risk: '风险',
  income: '收入',
  stability: '稳定性',
  growth: '成长性',
}

const CATEGORY_LABELS: Record<string, string> = {
  subject: '主体',
  institution: '机构',
  state: '状态',
  decision: '决策',
  goal: '目标',
  event: '事件',
  generic: '通用',
}

const PHASE_LABELS: Record<string, string> = {
  intake: '输入建模',
  expansion: '图谱扩展',
  simulation: '模拟推进',
  state_update: '状态更新',
  branching: '分支推演',
  advice: '策略输出',
  reflection: '反思记录',
  memory: '记忆回写',
  'world-model': '世界建模',
}

const STATUS_LABELS: Record<string, string> = {
  active: '激活',
  candidate: '候选',
  stable: '稳定',
  syncing: '同步中',
}

const MODE_LABELS: Record<string, string> = {
  configured: '已接入',
  ready: '已接入',
  remote: '远程推演',
  fallback: '本地回退',
}

const PROVIDER_LABELS: Record<string, string> = {
  'openai-compatible': '兼容 OpenAI',
  'local-fallback': '本地回退',
}

const FACT_TYPE_LABELS: Record<string, string> = {
  causal: '因果',
  relationship: '关系',
  constraint: '约束',
  environment: '环境',
  state_feedback: '状态反馈',
  director_note: '导演注记',
  user_edit: '用户编辑',
}

const RELATION_LABELS: Record<string, string> = {
  activates: '激活',
  depends_on: '依赖',
  constrains: '约束',
  enables: '使能',
  pulls: '拉动',
  amplifies: '放大',
  feeds_back: '反馈',
  branches_into: '分叉到',
  interprets: '解释',
  counterfactual: '反事实改写',
}

const TOKEN_LABELS: Record<string, string> = {
  self: '当前自我',
  mentor: '实验室导师',
  family: '家庭系统',
  employer: 'AI 产品市场',
  city: '上海机会场',
  'education-state': '教育维度',
  'finance-state': '现金跑道',
  'mental-state': '心理负荷',
  'decision-core': '读研 / 就业分叉',
  'future-self': '未来自我',
  'cycle-2-reflection': '第二轮反思',
  'main-track': '主路径',
  'research-track': '读研路径',
  'hybrid-track': '混合路径',
  'stability-track': '稳定路径',
  'research-first': '优先读研',
  'hybrid-city': '城市跳跃混合线',
  'pragmatic-employment': '稳态就业线',
  'graduate-school': '读研',
  'career-study': '工作-学习混合',
  runway: '现金跑道',
  strong: '强',
  medium: '中等',
  weak: '弱',
  low: '低',
  high: '高',
  active: '活跃',
  visible: '可见',
  local: '本地',
  Self: '自我',
  DecisionOwner: '决策主体',
  Mentor: '导师',
  RelationshipAgent: '关系代理',
  Family: '家庭',
  Constraint: '约束',
  Employer: '雇主市场',
  InstitutionAgent: '机构代理',
  City: '城市环境',
  Environment: '环境',
  State: '状态',
  EducationState: '教育状态',
  FinanceState: '财务状态',
  MentalState: '心理状态',
}

function formatWithMap(value: string | null | undefined, dictionary: Record<string, string>) {
  if (!value) {
    return '--'
  }
  return dictionary[value] ?? value
}

export function formatAxisLabel(value: string | null | undefined) {
  return formatWithMap(value, AXIS_LABELS)
}

export function formatCategoryLabel(value: string | null | undefined) {
  return formatWithMap(value, CATEGORY_LABELS)
}

export function formatPhaseLabel(value: string | null | undefined) {
  return formatWithMap(value, PHASE_LABELS)
}

export function formatStatusLabel(value: string | null | undefined) {
  return formatWithMap(value, STATUS_LABELS)
}

export function formatRuntimeMode(value: string | null | undefined) {
  return formatWithMap(value, MODE_LABELS)
}

export function formatProviderLabel(value: string | null | undefined) {
  return formatWithMap(value, PROVIDER_LABELS)
}

export function formatFactTypeLabel(value: string | null | undefined) {
  return formatWithMap(value, FACT_TYPE_LABELS)
}

export function formatRelationLabel(value: string | null | undefined) {
  return formatWithMap(value, RELATION_LABELS)
}

export function formatDomainToken(value: string | null | undefined) {
  if (!value) {
    return '--'
  }

  return TOKEN_LABELS[value] ?? AXIS_LABELS[value] ?? value
}

export function formatNodeIdList(values: string[] | null | undefined) {
  if (!values?.length) {
    return '--'
  }

  return values.map((value) => formatDomainToken(value)).join('、')
}

export function formatNarrativeText(value: string | null | undefined) {
  if (!value) {
    return '--'
  }

  const replacements = Object.entries({
    ...AXIS_LABELS,
    ...TOKEN_LABELS,
  }).sort(([left], [right]) => right.length - left.length)

  return replacements.reduce(
    (current, [token, label]) => current.replaceAll(token, label),
    value,
  )
}

export function formatTimeLabel(value: string | null | undefined) {
  if (!value) {
    return '--'
  }

  return value
    .replace(/^Semester\s+(\d+)$/i, '第 $1 学期')
    .replace(/^Month\s+(\d+)$/i, '第 $1 个月')
}

export function formatHorizonLabel(value: string | null | undefined) {
  if (!value) {
    return '--'
  }

  return value.replace(/^(\d+)\s+years?$/i, '$1 年').replace(/^semester$/i, '学期级')
}
