/**
 * i18n — Lightweight internationalization module
 * Default: zh (Chinese), switchable to en (English)
 */

const translations = {
  zh: {
    // Nav
    nav_simulation: '推演',
    nav_graph: '图谱',
    nav_reports: '报告',
    nav_system: '系统',

    // Landing
    landing_tag: '[PROLOGUE_01]',
    landing_title_1: 'Life is not a destination.',
    landing_title_2: "It's a variable.",
    landing_desc: '通过多智能体仿真推演，量化人生轨迹中的关键节点。调一下参数，看看你的未来会走向哪里。',
    landing_cta: '[开始推演]',
    landing_history: '[历史记录]',

    // Onboarding
    onboarding_title: '构建你的人物模型',
    step_personality: '性格分析',
    step_education: '教育背景',
    step_academic: '学术信息',
    step_family: '家庭背景',
    step_career: '职业倾向',
    step_concern: '核心困惑',
    btn_next: '下一步',
    btn_prev: '上一步',
    btn_submit: '提交档案',

    // Parameters
    param_title: '定义关注参数',
    param_desc: '明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。',
    param_add: '+ 添加参数',
    param_primary: '主参数',
    param_secondary: '次参数',
    sim_config: '推演配置',
    sim_rounds: '推演轮数',
    sim_time_unit: '时间单位',
    sim_quarter: '每季度',
    btn_start_sim: '开始推演',
    btn_back_profile: '返回档案',

    // Simulation
    sim_viewport: 'SIMULATION_VIEWPORT',
    sim_tree_title: '人生路径树',
    sim_event_stream: '事件流',
    sim_metrics: '系统指标',
    sim_progress: '进度',
    sim_paths: '路径数',
    sim_branches: '分支数',
    sim_round: '当前轮次',
    sim_initializing: '初始化中',
    sim_waiting: '等待推演开始...',
    sim_state: '当前状态',
    sim_completed_view: '推演已完成',
    sim_completed_msg: '本项目的推演已完成，点击下方按钮查看结果。',
    sim_tab_tree: '推演树',
    sim_tab_actions: '结果导航',
    sim_tree_readonly: '只读模式',
    sim_tree_summary: '推演摘要',
    btn_view_graph: '查看知识图谱',
    btn_view_results: '查看推演报告',
    btn_re_simulate: '重新推演',

    // Graph
    graph_title: '人生图谱',
    graph_agents: '智能体',
    graph_node_detail: '节点详情',
    graph_no_agents: '暂无智能体数据',
    graph_no_data: '暂无图谱数据',
    graph_load_error: '图谱加载失败',
    btn_view_report: '查看推演结果',

    // Results
    results_title: '路径分析报告',
    results_desc: '系统已完成推演，生成 {count} 条人生路径。点击路径卡片查看详情。',
    results_status: '状态: 已完成',
    path_optimal: '最优路径',
    path_conservative: '稳健路径',
    path_risk: '冒险路径',
    path_balanced: '平衡路径',
    path_satisfaction: '满意度预测',
    path_nodes: '节点数',
    path_risk_label: '风险',
    btn_new_sim: '新建推演',
    btn_back: '返回',

    // Detail
    detail_node_seq: '节点序列',
    detail_description: '描述',
    detail_trigger: '触发原因',
    detail_state_snapshot: '状态快照',
    btn_get_advice: '获取 AI 建议',

    // Advice
    advice_title: '策略规划',
    advice_desc: '针对「{path}」的 AI 行动建议',
    advice_satisfied: '满意模式',
    advice_unsatisfied: '不满意模式',
    advice_choose: '选择反馈模式以生成建议...',
    advice_generating: '正在生成建议...',
    advice_immediate: '近期行动',
    advice_mid_term: '中期布局',
    advice_risk_mit: '风险规避',
    advice_risk_analysis: '风险分析',
    advice_intervention: '干预节点',
    advice_alternative: '替代路径',
    advice_mental: '心理支持',
    advice_key_nodes: '关键节点',

    // State labels
    state_education: '学业',
    state_career: '职业',
    state_finance: '经济',
    state_health: '健康',
    state_mental: '心理',
    state_relationship: '关系',
    state_family_support: '家庭',
    state_social_capital: '社会资本',
    state_optionality: '可选择空间',
    state_goal_alignment: '目标达成',

    // Common
    lang_switch: 'EN',
    error_loading: '加载失败',
  },

  en: {
    nav_simulation: 'SIMULATE',
    nav_graph: 'GRAPH',
    nav_reports: 'REPORTS',
    nav_system: 'SYSTEM',

    landing_tag: '[PROLOGUE_01]',
    landing_title_1: 'Life is not a destination.',
    landing_title_2: "It's a variable.",
    landing_desc: 'Simulate life trajectories through multi-agent modeling. Tweak the parameters and see where your future leads.',
    landing_cta: '[START SIMULATION]',
    landing_history: '[VIEW HISTORY]',

    onboarding_title: 'Build Your Profile',
    step_personality: 'Personality',
    step_education: 'Education',
    step_academic: 'Academic',
    step_family: 'Family',
    step_career: 'Career',
    step_concern: 'Core Concern',
    btn_next: 'Next',
    btn_prev: 'Previous',
    btn_submit: 'Submit Profile',

    param_title: 'Define Concern Parameters',
    param_desc: 'Define your core questions. The system will diverge multi-layer influence factors and generate agents around your concerns.',
    param_add: '+ Add Parameter',
    param_primary: 'Primary',
    param_secondary: 'Secondary',
    sim_config: 'Simulation Config',
    sim_rounds: 'Rounds',
    sim_time_unit: 'Time Unit',
    sim_quarter: 'Quarterly',
    btn_start_sim: 'Start Simulation',
    btn_back_profile: 'Back to Profile',

    sim_viewport: 'SIMULATION_VIEWPORT',
    sim_tree_title: 'Life-Path Tree',
    sim_event_stream: 'EVENT_STREAM',
    sim_metrics: 'SYSTEM_METRICS',
    sim_progress: 'PROGRESS',
    sim_paths: 'PATHS',
    sim_branches: 'BRANCHES',
    sim_round: 'ROUND',
    sim_initializing: 'INITIALIZING',
    sim_waiting: 'Waiting for simulation start...',
    sim_state: 'CURRENT_STATE',
    sim_completed_view: 'Simulation Complete',
    sim_completed_msg: 'Simulation has already finished. Click below to view results.',
    sim_tab_tree: 'Derivation Tree',
    sim_tab_actions: 'Result Hub',
    sim_tree_readonly: 'Read-only',
    sim_tree_summary: 'Summary',
    btn_view_graph: 'View Knowledge Graph',
    btn_view_results: 'View Simulation Report',
    btn_re_simulate: 'Re-simulate',

    graph_title: 'LIFE_GRAPH',
    graph_agents: 'AGENTS',
    graph_node_detail: 'NODE_DETAIL',
    graph_no_agents: 'No agents data yet',
    graph_no_data: 'No graph data available',
    graph_load_error: 'GRAPH_LOAD_ERROR',
    btn_view_report: 'View Results',

    results_title: 'Path Analysis Report',
    results_desc: 'Simulation complete. {count} life paths generated. Click a card to view details.',
    results_status: 'STATUS: COMPLETED',
    path_optimal: 'Optimal Path',
    path_conservative: 'Conservative Path',
    path_risk: 'Risk Path',
    path_balanced: 'Balanced Path',
    path_satisfaction: 'Satisfaction',
    path_nodes: 'Nodes',
    path_risk_label: 'Risk',
    btn_new_sim: 'New Simulation',
    btn_back: 'Back',

    detail_node_seq: 'NODE_SEQUENCE',
    detail_description: 'Description',
    detail_trigger: 'Trigger Reason',
    detail_state_snapshot: 'State Snapshot',
    btn_get_advice: 'Get AI Advice',

    advice_title: 'Strategy Protocol',
    advice_desc: 'AI-powered advice for "{path}"',
    advice_satisfied: 'Satisfied Mode',
    advice_unsatisfied: 'Unsatisfied Mode',
    advice_choose: 'Choose feedback mode to generate advice...',
    advice_generating: 'GENERATING_ADVICE...',
    advice_immediate: 'Immediate Actions',
    advice_mid_term: 'Mid-term Plan',
    advice_risk_mit: 'Risk Mitigation',
    advice_risk_analysis: 'Risk Analysis',
    advice_intervention: 'Intervention Points',
    advice_alternative: 'Alternative Paths',
    advice_mental: 'Mental Support',
    advice_key_nodes: 'Key Nodes',

    state_education: 'Education',
    state_career: 'Career',
    state_finance: 'Finance',
    state_health: 'Health',
    state_mental: 'Mental',
    state_relationship: 'Relationship',
    state_family_support: 'Family',
    state_social_capital: 'Social Capital',
    state_optionality: 'Optionality',
    state_goal_alignment: 'Goal Alignment',

    lang_switch: '中文',
    error_loading: 'Loading failed',
  },
};

let currentLang = localStorage.getItem('lifepath_lang') || 'zh';

export function t(key) {
  return translations[currentLang]?.[key] || translations.zh[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lifepath_lang', lang);
}

export function toggleLang() {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
}

export function getStateLabel(key) {
  return t(`state_${key}`);
}

export const STATE_KEYS = [
  'education', 'career', 'finance', 'health', 'mental',
  'relationship', 'family_support', 'social_capital',
  'optionality', 'goal_alignment',
];
