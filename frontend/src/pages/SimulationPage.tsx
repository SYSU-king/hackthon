import { Link } from 'react-router-dom'
import { SimulationGraph } from '../components/SimulationGraph'
import { useDashboard } from '../hooks/useDashboard'
import { formatAxisLabel, formatDomainToken, formatNarrativeText, formatRuntimeMode } from '../lib/i18n'

export function SimulationPage() {
  const { state, refresh, runSimulation, loading, error } = useDashboard()

  if (loading && !state) {
    return <div className="empty-panel">正在加载模拟画布...</div>
  }

  if (error && !state) {
    return <div className="empty-panel">模拟运行时不可用: {error}</div>
  }

  if (!state) {
    return <div className="empty-panel">模拟状态不可用</div>
  }

  const axes = Object.entries(state.current_state.axes) as Array<[string, number]>
  const strongestAxis: [string, number] =
    axes.length > 0
      ? axes.reduce((best, current) => (best[1] > current[1] ? best : current))
      : ['stability', 0]
  const timelineStops = ['2024', '2025', '2026', '2027', '2028']
  const activeBranchLabel = formatDomainToken(state.active_branch_id ?? 'main-track')

  return (
    <div className="simulation-layout">
      <section className="simulation-main">
        <div className="simulation-status-strip">
          <div className="protocol-chip">
            <span>视口</span>
            <strong>{activeBranchLabel}</strong>
          </div>
          <div className="protocol-chip">
            <span>主导维度</span>
            <strong>
              {formatAxisLabel(strongestAxis[0])} {strongestAxis[1]}
            </strong>
          </div>
          <div className="protocol-chip">
            <span>图谱构建</span>
            <strong>{state.graph_meta.node_count + state.graph_meta.edge_count} 个实体已映射</strong>
          </div>
        </div>

        <SimulationGraph
          edges={state.graph_edges}
          meta={state.graph_meta}
          nodes={state.graph_nodes}
          onRefresh={() => void refresh()}
          refreshDisabled={loading}
          subtitle="[sys-882] 模拟视口"
          title={`人生路径树: ${activeBranchLabel}`}
        />

        <div className="simulation-deck">
          <article className="gallery-card">
            <div className="eyebrow">处理栈</div>
            <h3>周期运行态</h3>
            <p>{formatNarrativeText(state.current_state.narrative)}</p>
            <div className="landing-list">
              <span>轮次 {state.current_cycle}</span>
              <span>事件 {state.simulation_events.length}</span>
              <span>记忆 {state.memories.length}</span>
            </div>
          </article>

          <article className="gallery-card">
            <div className="eyebrow">前沿看板</div>
            <h3>保留中的未来分支</h3>
            <p>导演代理会同时保留多条未来路径，只在指标漂移足够稳定后才收敛决策。</p>
            <div className="landing-list">
              {state.paths.map((path) => (
                <span key={path.id}>
                  {path.title} / 置信 {path.confidence} / 风险 {path.risk}
                </span>
              ))}
            </div>
          </article>
        </div>

        <div className="timeline-bar">
          <div>
            <div className="eyebrow">周期时间线</div>
            <strong>{state.current_state.time_label}</strong>
            <p>{formatNarrativeText(state.current_state.narrative)}</p>
          </div>
          <div className="timeline-bar__actions">
            <button className="chrome-button" disabled={loading} onClick={() => void runSimulation()} type="button">
              {loading ? '运行中...' : '推进模拟'}
            </button>
            {state.paths[0] && (
              <Link className="chrome-button chrome-button--ghost" to={`/paths/${state.paths[0].id}`}>
                查看首选分支
              </Link>
            )}
          </div>
        </div>

        <div className="simulation-timeline-panel">
          <div className="simulation-controls">
            <button className="chrome-button chrome-button--ghost" disabled type="button">
              播放
            </button>
            <button className="chrome-button chrome-button--ghost" disabled type="button">
              暂停
            </button>
            <button className="chrome-button chrome-button--ghost" disabled type="button">
              拖动
            </button>
          </div>
          <div className="timeline-scale">
            {timelineStops.map((stop, index) => (
              <div className={`timeline-scale__stop${index === 2 ? ' timeline-scale__stop--active' : ''}`} key={stop}>
                <span>{stop}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="console-panel">
        <div className="console-panel__header">
          <div className="eyebrow">event_stream</div>
          <strong>会话 ID: lp-e_8122-0x</strong>
        </div>
        <div className="console-panel__body">
          {state.simulation_events
            .slice()
            .reverse()
            .map((event) => (
              <article className="console-entry" key={event.id}>
                <div className="console-entry__time">{new Date(event.timestamp).toLocaleString()}</div>
                <h3>{formatNarrativeText(event.title)}</h3>
                <p>{formatNarrativeText(event.description)}</p>
                <div className="console-entry__impact">{formatNarrativeText(event.impact)}</div>
              </article>
            ))}
        </div>
        <div className="console-panel__footer">
          <span>激活记忆 {state.memories.length}</span>
          <span>LLM {formatRuntimeMode(state.llm.mode)}</span>
        </div>
      </aside>
    </div>
  )
}
