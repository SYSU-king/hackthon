import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SimulationGraph } from '../components/SimulationGraph'
import { useDashboard } from '../hooks/useDashboard'
import {
  formatDomainToken,
  formatHorizonLabel,
  formatNarrativeText,
  formatNodeIdList,
  formatRuntimeMode,
  formatStatusLabel,
  formatTimeLabel,
} from '../lib/i18n'
import type { GraphEdge, GraphMeta, GraphNode } from '../lib/types'

type DraftState = Record<string, string>

function buildSubgraphMeta(
  nodes: GraphNode[],
  edges: GraphEdge[],
  baseMeta: GraphMeta,
): GraphMeta {
  const pairCounts = new Map<string, number>()
  let selfLoopCount = 0

  for (const edge of edges) {
    const key = [edge.source, edge.target].sort().join('::')
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
    if (edge.source === edge.target) {
      selfLoopCount += 1
    }
  }

  return {
    node_count: nodes.length,
    edge_count: edges.length,
    branch_count: Math.max(1, new Set(nodes.flatMap((node) => node.branch_ids)).size),
    self_loop_count: selfLoopCount,
    multi_edge_group_count: Array.from(pairCounts.values()).filter((count) => count > 1).length,
    supports_self_loops: baseMeta.supports_self_loops,
    supports_multi_edges: baseMeta.supports_multi_edges,
    node_categories: Array.from(new Set(nodes.map((node) => node.category))).sort(),
    detail_fields: baseMeta.detail_fields,
  }
}

export function PathDetailPage() {
  const { pathId } = useParams()
  const { state, rerunCounterfactual, loading, error } = useDashboard()
  const [drafts, setDrafts] = useState<DraftState>({})

  const path = state?.paths.find((item) => item.id === pathId) ?? null

  useEffect(() => {
    if (!path) {
      return
    }

    const next: DraftState = {}
    for (const node of path.nodes) {
      for (const field of node.editable_fields) {
        next[`${node.id}:${field.key}`] = field.value
      }
    }
    setDrafts(next)
  }, [path])

  if (loading && !state) {
    return <div className="empty-panel">正在加载路径详情...</div>
  }

  if (error && !state) {
    return <div className="empty-panel">路径运行时不可用: {error}</div>
  }

  if (!state) {
    return <div className="empty-panel">路径状态不可用</div>
  }

  if (!path) {
    return <div className="empty-panel">当前模拟中未找到该路径</div>
  }

  const relatedNodeIds = new Set(path.nodes.flatMap((node) => node.graph_node_ids))
  relatedNodeIds.add('decision-core')
  const graphNodes = state.graph_nodes.filter((node) => relatedNodeIds.has(node.id))
  const graphEdges = state.graph_edges.filter(
    (edge) => relatedNodeIds.has(edge.source) && relatedNodeIds.has(edge.target),
  )
  const graphMeta = buildSubgraphMeta(graphNodes, graphEdges, state.graph_meta)
  const divergence = path.payoff - path.risk

  return (
    <div className="path-page">
      <div className="path-locator">
        <span>分支: {formatDomainToken(path.branch_id ?? path.id)}</span>
        <span>节点数: {path.nodes.length}</span>
        <span>关键分歧: {divergence >= 0 ? `+${divergence}` : divergence}</span>
      </div>

      <header className="section-header section-header--tight">
        <div>
          <div className="eyebrow">当前分支: {formatDomainToken(path.branch_id ?? path.id)}</div>
          <h1>路径分析: {path.title}</h1>
          <p>{path.thesis}</p>
        </div>
        <div className="header-meta">
          <span>置信度 {path.confidence}</span>
          <span>风险 {path.risk}</span>
          <span>收益 {path.payoff}</span>
        </div>
      </header>

      <div className="path-grid">
        <section className="memo-column">
          <article className="memo-card">
            <h2>技术备忘</h2>
            <p>{formatNarrativeText(path.summary)}</p>
            <div className="detail-grid">
              <span>状态</span>
              <span>{formatStatusLabel(path.status)}</span>
              <span>时间范围</span>
              <span>{formatHorizonLabel(path.horizon)}</span>
              <span>关注点</span>
              <span>{formatNodeIdList(path.focus_node_ids)}</span>
            </div>
            <div className="landing-list">
              <span>置信度 {path.confidence}</span>
              <span>收益 {path.payoff}</span>
              <span>风险 {path.risk}</span>
              <span>分歧 {divergence}</span>
            </div>
          </article>

          {path.nodes.map((node) => (
            <article className="memo-card" key={node.id}>
              <div className="eyebrow">{formatTimeLabel(node.time_label)}</div>
              <h3>{node.title}</h3>
              <p>{formatNarrativeText(node.summary)}</p>
              {node.editable_fields.map((field) => {
                const draftKey = `${node.id}:${field.key}`
                const draftValue = drafts[draftKey] ?? field.value
                return (
                  <div className="field-block" key={draftKey}>
                    <label htmlFor={draftKey}>{field.label}</label>
                    {field.options.length > 0 ? (
                      <select
                        id={draftKey}
                        onChange={(event) =>
                          setDrafts((current) => ({ ...current, [draftKey]: event.target.value }))
                        }
                        value={draftValue}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {formatDomainToken(option)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={draftKey}
                        onChange={(event) =>
                          setDrafts((current) => ({ ...current, [draftKey]: event.target.value }))
                        }
                        value={draftValue}
                      />
                    )}
                    <button
                      className="chrome-button chrome-button--ghost"
                      disabled={loading}
                      onClick={() =>
                        void rerunCounterfactual(path.id, {
                          node_id: node.id,
                          field_key: field.key,
                          value: draftValue,
                        })
                      }
                      type="button"
                    >
                      重新推演分支
                    </button>
                  </div>
                )
              })}
            </article>
          ))}
        </section>

        <section className="analysis-column">
          <div className="path-artifact">
            <div className="eyebrow">关键分歧</div>
            <strong>{path.title}</strong>
            <p>该分支之所以仍被保留，是因为它的预期收益仍高于风险预算，同时还能保住下游选择权。</p>
          </div>

          <SimulationGraph
            edges={graphEdges}
            meta={graphMeta}
            nodes={graphNodes}
            subtitle={`[分支几何] ${formatDomainToken(path.branch_id ?? path.id)}`}
            title={path.title}
          />

          <div className="memory-board">
            <div className="eyebrow">下游日志</div>
            {state.memories
              .filter((memory) => memory.branch_id === (path.branch_id ?? path.id))
              .slice()
              .reverse()
              .map((memory) => (
                <article className="memory-card" key={memory.id}>
                  <strong>{memory.title}</strong>
                  <p>{formatNarrativeText(memory.summary)}</p>
                </article>
              ))}
            {!state.memories.some((memory) => memory.branch_id === (path.branch_id ?? path.id)) && (
              <article className="memory-card">
                <strong>暂无下游日志</strong>
                <p>运行或重新推演该分支后，会在这里追加结果记录。</p>
              </article>
            )}
          </div>

          <div className="timeline-rail">
            <div className="eyebrow">时序时间线</div>
            {path.nodes.map((node) => (
              <div className="timeline-node" key={node.id}>
                <span>{formatTimeLabel(node.time_label)}</span>
                <div />
                <span>{node.title}</span>
              </div>
            ))}
            <Link className="chrome-button" to="/simulation">
              返回实时模拟
            </Link>
          </div>

          <div className="gallery-card">
            <div className="eyebrow">运行模式</div>
            <h3>{formatRuntimeMode(state.llm.mode)}</h3>
            <p>
              {formatNarrativeText(
                state.llm.last_response_preview ?? '该分支的推演注记将在下一次运行后更新。',
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
