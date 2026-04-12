import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import {
  formatAxisLabel,
  formatHorizonLabel,
  formatNarrativeText,
  formatNodeIdList,
  formatRuntimeMode,
} from '../lib/i18n'

export function StrategyPage() {
  const { state, error, loading } = useDashboard()

  if (loading && !state) {
    return <div className="empty-panel">正在加载策略协议...</div>
  }

  if (error && !state) {
    return <div className="empty-panel">策略运行时不可用: {error}</div>
  }

  if (!state) {
    return <div className="empty-panel">策略状态不可用</div>
  }

  const active =
    state.paths.find(
      (path) => path.branch_id === state.active_branch_id || path.id === state.active_branch_id,
    ) ??
    state.paths[0] ??
    null

  if (!active) {
    return <div className="empty-panel">当前还没有可保留的分支</div>
  }

  const llm = state.llm
  const protocolStats = [
    { label: '运行轮次', value: `第 ${state.current_cycle} 轮` },
    { label: '推演引擎', value: llm.configured ? '实时 LLM' : '本地回退' },
    { label: '鉴权', value: llm.api_key_present ? '令牌已加载' : '令牌缺失' },
  ]

  return (
    <div className="strategy-page">
      <header className="section-header">
        <div>
          <div className="eyebrow">[system_directive]</div>
          <h1>策略协议</h1>
          <p>
            基于当前人生图谱自动生成的执行协议。即时动作、季度准备与风险约束，会持续跟随当前效用最高的路径。
          </p>
        </div>
        <div className="header-meta">
          <span>hash: 882-af-0912</span>
          <span>LLM 模式: {formatRuntimeMode(llm.mode)}</span>
        </div>
      </header>

      <section className="protocol-strip">
        {protocolStats.map((item) => (
          <div className="protocol-chip" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="strategy-grid">
        <article className="strategy-column">
          <div className="strategy-column__head">
            <h2>立即动作</h2>
            <span>[priority_critical]</span>
          </div>
          {active.advice.immediate.map((item, index) => (
            <div className="strategy-card" key={`immediate-${index}-${item}`}>
              <div className="strategy-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="strategy-card__status">
                <span>状态</span>
                <strong>立即执行</strong>
              </div>
              <p>{item}</p>
            </div>
          ))}
        </article>

        <article className="strategy-column">
          <div className="strategy-column__head">
            <h2>下一阶段准备</h2>
            <span>[phase_transition]</span>
          </div>
          {active.advice.next_quarter.map((item, index) => (
            <div className="strategy-card" key={`quarter-${index}-${item}`}>
              <div className="strategy-index">{String(index + 3).padStart(2, '0')}</div>
              <div className="strategy-card__status">
                <span>窗口</span>
                <strong>下一季度</strong>
              </div>
              <p>{item}</p>
            </div>
          ))}
        </article>

        <article className="strategy-column">
          <div className="strategy-column__head">
            <h2>资源保护</h2>
            <span>[risk_memory]</span>
          </div>
          {active.advice.risk_controls.map((item, index) => (
            <div className="strategy-card" key={`risk-${index}-${item}`}>
              <div className="strategy-card__status">
                <span>护栏</span>
                <strong>常开</strong>
              </div>
              <p>{item}</p>
            </div>
          ))}
        </article>
      </section>

      <section className="metrics-strip">
        {Object.entries(active.score_breakdown).map(([key, value]) => (
          <div className="metric-chip" key={key}>
            <span>{formatAxisLabel(key)}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="strategy-inspection">
        <article className="gallery-card">
          <div className="eyebrow">分析员注记</div>
          <h3>协议批注</h3>
          <p>{formatNarrativeText(llm.last_response_preview ?? active.summary)}</p>
          <div className="landing-list">
            <span>当前分支 {active.title}</span>
            <span>焦点节点 {formatNodeIdList(active.focus_node_ids)}</span>
            <span>周期 {formatHorizonLabel(active.horizon)}</span>
          </div>
        </article>
        <article className="gallery-card">
          <div className="eyebrow">结构切片</div>
          <h3>决策几何</h3>
          <p>在新的下游证据出现之前，当前协议会继续偏向保留选择权、放大推荐杠杆，并维持职业对冲。</p>
          <div className="landing-list">
            {Object.entries(active.score_breakdown)
              .slice(0, 4)
              .map(([key, value]) => (
                <span key={key}>
                  {formatAxisLabel(key)} {value}
                </span>
              ))}
          </div>
        </article>
      </section>

      <section className="branch-board">
        {state.paths.map((path) => (
          <article className="branch-card" key={path.id}>
            <div className="eyebrow">{path.archetype}</div>
            <h3>{path.title}</h3>
            <p>{formatNarrativeText(path.summary)}</p>
            <div className="branch-card__scores">
              <span>置信度 {path.confidence}</span>
              <span>收益 {path.payoff}</span>
              <span>风险 {path.risk}</span>
            </div>
            <Link className="chrome-button chrome-button--ghost" to={`/paths/${path.id}`}>
              打开路径详情
            </Link>
          </article>
        ))}
      </section>

      <footer className="protocol-footer">
        <span>system_uptime: live</span>
        <span>director_mode: {formatRuntimeMode(llm.mode)}</span>
        <span>紧急终止: 已禁用</span>
      </footer>
    </div>
  )
}
