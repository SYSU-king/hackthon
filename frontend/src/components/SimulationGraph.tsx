import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import {
  buildGraphViewModel,
  describeEdge,
  getEdgeLabelPosition,
  getEdgePath,
  getNodeRadius,
  truncateGraphLabel,
  wrapGraphLabel,
  type DisplayEdge,
} from '../lib/graph'
import {
  formatCategoryLabel,
  formatDomainToken,
  formatFactTypeLabel,
  formatNarrativeText,
  formatPhaseLabel,
  formatRelationLabel,
  formatStatusLabel,
} from '../lib/i18n'
import type { GraphEdge, GraphMeta, GraphNode, GraphPosition } from '../lib/types'

type SelectionState =
  | { kind: 'node'; id: string }
  | { kind: 'edge'; id: string }
  | { kind: 'self-loop-group'; id: string }
  | null

type SimulationGraphProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  meta: GraphMeta
  title: string
  subtitle: string
  onRefresh?: () => void
  refreshDisabled?: boolean
}

const VIEWPORT_WIDTH = 1120
const VIEWPORT_HEIGHT = 960
const MINIMAP_WIDTH = 220
const MINIMAP_HEIGHT = 150

const CATEGORY_COLORS: Record<string, string> = {
  subject: '#111111',
  institution: '#56524a',
  state: '#ff4500',
  decision: '#9d3d00',
  goal: '#215a57',
  event: '#6d6762',
}

function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? '#4b4b4b'
}

function computeAxisExpansion(
  values: number[],
  minPad: number,
  maxPad: number,
  targetSpan: number,
) {
  if (values.length === 0) {
    return { mid: 0.5, scale: 1 }
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  const mid = (min + max) / 2

  if (span <= 0 || span >= targetSpan) {
    return { mid, scale: 1 }
  }

  const desiredScale = targetSpan / span
  const leftScale =
    mid === min ? Number.POSITIVE_INFINITY : (mid - minPad) / Math.max(mid - min, 0.0001)
  const rightScale =
    max === mid ? Number.POSITIVE_INFINITY : (maxPad - mid) / Math.max(max - mid, 0.0001)

  return {
    mid,
    scale: Math.max(1, Math.min(desiredScale, leftScale, rightScale)),
  }
}

function normalizePositions(positions: Record<string, GraphPosition>) {
  const entries = Object.entries(positions)
  const compactGraph = entries.length <= 5
  const xAxis = computeAxisExpansion(
    entries.map(([, position]) => position.x),
    compactGraph ? 0.05 : 0.08,
    compactGraph ? 0.95 : 0.92,
    compactGraph ? 0.88 : 0.8,
  )
  const yAxis = computeAxisExpansion(
    entries.map(([, position]) => position.y),
    compactGraph ? 0.06 : 0.1,
    compactGraph ? 0.94 : 0.9,
    compactGraph ? 0.86 : 0.78,
  )

  return Object.fromEntries(
    entries.map(([id, position]) => [
      id,
      {
        x: clamp(
          xAxis.mid + (position.x - xAxis.mid) * xAxis.scale,
          compactGraph ? 0.04 : 0.06,
          compactGraph ? 0.96 : 0.94,
        ),
        y: clamp(
          yAxis.mid + (position.y - yAxis.mid) * yAxis.scale,
          compactGraph ? 0.05 : 0.08,
          compactGraph ? 0.95 : 0.92,
        ),
      },
    ]),
  ) as Record<string, GraphPosition>
}

function defaultPositions(nodes: GraphNode[]) {
  return normalizePositions(
    Object.fromEntries(nodes.map((node) => [node.id, node.position])) as Record<
      string,
      GraphPosition
    >,
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function buildViewportBounds(positions: Record<string, GraphPosition>) {
  const coordinates = Object.values(positions).map((position) => ({
    x: position.x * VIEWPORT_WIDTH,
    y: position.y * VIEWPORT_HEIGHT,
  }))

  if (coordinates.length === 0) {
    return null
  }

  return {
    minX: Math.min(...coordinates.map((point) => point.x)),
    maxX: Math.max(...coordinates.map((point) => point.x)),
    minY: Math.min(...coordinates.map((point) => point.y)),
    maxY: Math.max(...coordinates.map((point) => point.y)),
  }
}

function constrainViewport(
  nextViewport: { scale: number; translateX: number; translateY: number },
  positions: Record<string, GraphPosition>,
) {
  const bounds = buildViewportBounds(positions)
  if (!bounds) {
    return nextViewport
  }

  const paddingX = 120
  const paddingY = 96
  const spanX = (bounds.maxX - bounds.minX) * nextViewport.scale
  const spanY = (bounds.maxY - bounds.minY) * nextViewport.scale
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2

  const minTranslateX = VIEWPORT_WIDTH - bounds.maxX * nextViewport.scale - paddingX
  const maxTranslateX = paddingX - bounds.minX * nextViewport.scale
  const minTranslateY = VIEWPORT_HEIGHT - bounds.maxY * nextViewport.scale - paddingY
  const maxTranslateY = paddingY - bounds.minY * nextViewport.scale

  return {
    scale: nextViewport.scale,
    translateX:
      spanX <= VIEWPORT_WIDTH - paddingX * 2
        ? VIEWPORT_WIDTH / 2 - centerX * nextViewport.scale
        : clamp(nextViewport.translateX, minTranslateX, maxTranslateX),
    translateY:
      spanY <= VIEWPORT_HEIGHT - paddingY * 2
        ? VIEWPORT_HEIGHT / 2 - centerY * nextViewport.scale
        : clamp(nextViewport.translateY, minTranslateY, maxTranslateY),
  }
}

function clampLabelPosition(x: number, y: number, width: number, height: number) {
  return {
    x: clamp(x, width / 2 + 10, VIEWPORT_WIDTH - width / 2 - 10),
    y: clamp(y, height / 2 + 10, VIEWPORT_HEIGHT - height / 2 - 10),
  }
}

function buildViewportForPositions(positions: Record<string, GraphPosition>) {
  const coordinates = Object.values(positions).map((position) => ({
    x: position.x * VIEWPORT_WIDTH,
    y: position.y * VIEWPORT_HEIGHT,
  }))

  if (coordinates.length === 0) {
    return { scale: 1, translateX: 0, translateY: 0 }
  }

  const compactGraph = coordinates.length <= 5
  const padding = compactGraph ? 56 : 92
  const minX = Math.min(...coordinates.map((point) => point.x))
  const maxX = Math.max(...coordinates.map((point) => point.x))
  const minY = Math.min(...coordinates.map((point) => point.y))
  const maxY = Math.max(...coordinates.map((point) => point.y))
  const spanX = Math.max(maxX - minX, compactGraph ? 120 : 180)
  const spanY = Math.max(maxY - minY, compactGraph ? 120 : 180)
  const scale = Math.max(
    compactGraph ? 0.92 : 0.78,
    Math.min(
      compactGraph ? 3 : 2.4,
      Math.min((VIEWPORT_WIDTH - padding * 2) / spanX, (VIEWPORT_HEIGHT - padding * 2) / spanY),
    ),
  )
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return {
    scale,
    translateX: VIEWPORT_WIDTH / 2 - centerX * scale,
    translateY: VIEWPORT_HEIGHT / 2 - centerY * scale,
  }
}

export function SimulationGraph({
  nodes,
  edges,
  meta,
  title,
  subtitle,
  onRefresh,
  refreshDisabled = false,
}: SimulationGraphProps) {
  const nodeSignature = nodes.map((node) => node.id).join('|')
  const [showLabels, setShowLabels] = useState(true)
  const [maximized, setMaximized] = useState(false)
  const [selection, setSelection] = useState<SelectionState>(null)
  const [dismissHint, setDismissHint] = useState(false)
  const [positions, setPositions] = useState<Record<string, GraphPosition>>(() =>
    defaultPositions(nodes),
  )
  const [revealCount, setRevealCount] = useState(0)
  const [viewport, setViewport] = useState({ scale: 1, translateX: 0, translateY: 0 })
  const [dragMode, setDragMode] = useState<'idle' | 'node' | 'pan' | 'minimap'>('idle')
  const svgRef = useRef<SVGSVGElement | null>(null)
  const minimapRef = useRef<SVGSVGElement | null>(null)
  const suppressClickRef = useRef(false)
  const dragState = useRef({
    type: null as 'node' | 'pan' | 'minimap' | null,
    pointerId: null as number | null,
    id: undefined as string | undefined,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  })

  useEffect(() => {
    const nextPositions = Object.fromEntries(
      nodes.map((node) => [node.id, positions[node.id] ?? node.position]),
    ) as Record<string, GraphPosition>

    setPositions(nextPositions)
    setViewport(constrainViewport(buildViewportForPositions(nextPositions), nextPositions))
    setSelection(null)
    // Preserve dragged layouts across data refreshes unless the node set itself changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeSignature])

  useEffect(() => {
    setViewport((current) => constrainViewport(current, positions))
  }, [positions])

  useEffect(() => {
    setRevealCount(0)
    const total = nodes.length + edges.length
    const timer = window.setInterval(() => {
      setRevealCount((count) => {
        if (count >= total) {
          window.clearInterval(timer)
          return count
        }
        return count + 1
      })
    }, 24)
    return () => window.clearInterval(timer)
  }, [nodes, edges])

  const graph = buildGraphViewModel(nodes, edges, positions)
  const visibleNodeCount = Math.min(revealCount, graph.nodes.length)
  const visibleEdgeCount = Math.max(0, revealCount - graph.nodes.length)
  const visibleNodes = graph.nodes.filter((_, index) => index < visibleNodeCount)
  const visibleEdges = graph.edges.filter((_, index) => index < visibleEdgeCount)
  const revealTotal = Math.max(1, nodes.length + edges.length)
  const revealProgress = Math.min(100, Math.round((revealCount / revealTotal) * 100))
  const categoryLegend = meta.node_categories.slice(0, 6)
  const alwaysShowLabels =
    selection?.kind === 'node' || selection?.kind === 'edge' || selection?.kind === 'self-loop-group'
  const showNodeLabels = showLabels && (viewport.scale >= 0.82 || alwaysShowLabels)
  const showNodeMeta = showLabels && (viewport.scale >= 1.04 || selection?.kind === 'node')
  const showEdgeLabels = showLabels && (viewport.scale >= 0.9 || alwaysShowLabels)
  const minimapViewport = {
    x: Math.max(0, (-viewport.translateX / viewport.scale / VIEWPORT_WIDTH) * MINIMAP_WIDTH),
    y: Math.max(0, (-viewport.translateY / viewport.scale / VIEWPORT_HEIGHT) * MINIMAP_HEIGHT),
    width: Math.min(MINIMAP_WIDTH, MINIMAP_WIDTH / viewport.scale),
    height: Math.min(MINIMAP_HEIGHT, MINIMAP_HEIGHT / viewport.scale),
  }

  function toGraphCoords(clientX: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      return { x: 0, y: 0 }
    }

    const x = ((clientX - rect.left) / rect.width) * VIEWPORT_WIDTH
    const y = ((clientY - rect.top) / rect.height) * VIEWPORT_HEIGHT
    return {
      x: (x - viewport.translateX) / viewport.scale,
      y: (y - viewport.translateY) / viewport.scale,
    }
  }

  function consumeSuppressedClick() {
    if (!suppressClickRef.current) {
      return false
    }
    suppressClickRef.current = false
    return true
  }

  function updateViewport(
    updater:
      | { scale: number; translateX: number; translateY: number }
      | ((
          current: typeof viewport,
        ) => { scale: number; translateX: number; translateY: number }),
  ) {
    setViewport((current) =>
      constrainViewport(typeof updater === 'function' ? updater(current) : updater, positions),
    )
  }

  function beginNodeDrag(event: ReactPointerEvent<SVGCircleElement>, id: string) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const current = positions[id]
    svgRef.current?.setPointerCapture(event.pointerId)
    dragState.current = {
      type: 'node',
      pointerId: event.pointerId,
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      moved: false,
    }
    setDragMode('node')
  }

  function beginPan(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    event.preventDefault()
    svgRef.current?.setPointerCapture(event.pointerId)
    dragState.current = {
      type: 'pan',
      pointerId: event.pointerId,
      id: undefined,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewport.translateX,
      originY: viewport.translateY,
      moved: false,
    }
    setDragMode('pan')
  }

  function centerViewportFromMinimap(clientX: number, clientY: number) {
    const rect = minimapRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const ratioX = clamp((clientX - rect.left) / rect.width, 0, 1)
    const ratioY = clamp((clientY - rect.top) / rect.height, 0, 1)
    updateViewport({
      scale: viewport.scale,
      translateX: VIEWPORT_WIDTH / 2 - ratioX * VIEWPORT_WIDTH * viewport.scale,
      translateY: VIEWPORT_HEIGHT / 2 - ratioY * VIEWPORT_HEIGHT * viewport.scale,
    })
  }

  function beginMinimapDrag(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    minimapRef.current?.setPointerCapture(event.pointerId)
    dragState.current = {
      type: 'minimap',
      pointerId: event.pointerId,
      id: undefined,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewport.translateX,
      originY: viewport.translateY,
      moved: false,
    }
    setDragMode('minimap')
    centerViewportFromMinimap(event.clientX, event.clientY)
  }

  function handleMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!dragState.current.type || dragState.current.pointerId !== event.pointerId) {
      return
    }

    const dx = event.clientX - dragState.current.startX
    const dy = event.clientY - dragState.current.startY
    if (!dragState.current.moved && Math.hypot(dx, dy) > 3) {
      dragState.current.moved = true
    }

    if (dragState.current.type === 'pan') {
      updateViewport((current) => ({
        ...current,
        translateX: dragState.current.originX + dx,
        translateY: dragState.current.originY + dy,
      }))
      return
    }

    if (dragState.current.type === 'minimap') {
      centerViewportFromMinimap(event.clientX, event.clientY)
      return
    }

    if (dragState.current.type === 'node' && dragState.current.id) {
      const next = toGraphCoords(event.clientX, event.clientY)
      setPositions((current) => ({
        ...current,
        [dragState.current.id!]: {
          x: Math.max(0.06, Math.min(0.94, next.x / VIEWPORT_WIDTH)),
          y: Math.max(0.08, Math.min(0.92, next.y / VIEWPORT_HEIGHT)),
        },
      }))
    }
  }

  function handleUp(event?: ReactPointerEvent<SVGSVGElement>) {
    if (event && dragState.current.pointerId !== null && dragState.current.pointerId !== event.pointerId) {
      return
    }

    if (dragState.current.pointerId !== null) {
      if (svgRef.current?.hasPointerCapture(dragState.current.pointerId)) {
        svgRef.current.releasePointerCapture(dragState.current.pointerId)
      }
      if (minimapRef.current?.hasPointerCapture(dragState.current.pointerId)) {
        minimapRef.current.releasePointerCapture(dragState.current.pointerId)
      }
    }

    if (dragState.current.moved) {
      suppressClickRef.current = true
    }

    dragState.current = {
      type: null,
      pointerId: null,
      id: undefined,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
    }
    setDragMode('idle')
  }

  function handleBackgroundClick() {
    if (consumeSuppressedClick()) {
      return
    }
    setSelection(null)
  }

  function handleWheel(event: ReactWheelEvent<SVGSVGElement>) {
    event.preventDefault()
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const anchorX = ((event.clientX - rect.left) / rect.width) * VIEWPORT_WIDTH
    const anchorY = ((event.clientY - rect.top) / rect.height) * VIEWPORT_HEIGHT
    updateViewport((current) => ({
      scale: (() => {
        const rawScale = event.deltaY > 0 ? current.scale * 0.92 : current.scale * 1.08
        return Math.max(0.6, Math.min(2.4, rawScale))
      })(),
      translateX: (() => {
        const rawScale = event.deltaY > 0 ? current.scale * 0.92 : current.scale * 1.08
        const nextScale = Math.max(0.6, Math.min(2.4, rawScale))
        const graphX = (anchorX - current.translateX) / current.scale
        return anchorX - graphX * nextScale
      })(),
      translateY: (() => {
        const rawScale = event.deltaY > 0 ? current.scale * 0.92 : current.scale * 1.08
        const nextScale = Math.max(0.6, Math.min(2.4, rawScale))
        const graphY = (anchorY - current.translateY) / current.scale
        return anchorY - graphY * nextScale
      })(),
    }))
  }

  function edgeState(edge: DisplayEdge) {
    if (!selection) {
      return 'idle'
    }
    if (selection.kind === 'node' && (edge.source === selection.id || edge.target === selection.id)) {
      return 'linked'
    }
    if (selection.id === edge.id) {
      return 'active'
    }
    return 'muted'
  }

  const selectedNode =
    selection?.kind === 'node' ? graph.nodeMap.get(selection.id) ?? null : null
  const selectedEdge =
    selection && selection.kind !== 'node'
      ? graph.edges.find((edge) => edge.id === selection.id) ?? null
      : null

  return (
    <section className={maximized ? 'graph-panel graph-panel--maximized' : 'graph-panel'}>
      <div className="graph-panel__header">
        <div>
          <div className="eyebrow">{subtitle}</div>
          <h2 className="graph-panel__title">{title}</h2>
        </div>
        <div className="graph-toolbar">
          <button
            className="chrome-button chrome-button--ghost"
            onClick={() => setShowLabels((value) => !value)}
            type="button"
          >
            {showLabels ? '隐藏标签' : '显示标签'}
          </button>
          <button
            className="chrome-button chrome-button--ghost"
            onClick={() => setMaximized((value) => !value)}
            type="button"
          >
            {maximized ? '收起' : '最大化'}
          </button>
          <button
            className="chrome-button chrome-button--ghost"
            onClick={() => updateViewport(buildViewportForPositions(positions))}
            type="button"
          >
            视图居中
          </button>
          {onRefresh && (
            <button
              className="chrome-button chrome-button--ghost"
              disabled={refreshDisabled}
              onClick={onRefresh}
              type="button"
            >
              重绘
            </button>
          )}
        </div>
      </div>

      <div className="graph-status-strip">
        <div className="protocol-chip">
          <span>构建状态</span>
          <strong>{revealProgress}% 已映射</strong>
        </div>
        <div className="protocol-chip">
          <span>视窗</span>
          <strong>{Math.round(viewport.scale * 100)}% 缩放</strong>
        </div>
        <div className="protocol-chip">
          <span>详情字段</span>
          <strong>{meta.detail_fields.length}</strong>
        </div>
      </div>

      {!dismissHint && (
        <div className="hint-chip">
          <span>图谱支持自环、多重边曲率、点击高亮与阈值拖拽</span>
          <button onClick={() => setDismissHint(true)} type="button">
            关闭
          </button>
        </div>
      )}

      <div className="graph-panel__body">
        <div className="graph-legend">
          <span>节点 {meta.node_count}</span>
          <span>边 {meta.edge_count}</span>
          <span>自环 {meta.self_loop_count}</span>
          <span>多重边组 {meta.multi_edge_group_count}</span>
        </div>

        <div className="graph-stage">
          <div className="graph-stage__legend">
            {categoryLegend.map((category) => (
              <span key={category}>
                <i style={{ backgroundColor: categoryColor(category) }} />
                {formatCategoryLabel(category)}
              </span>
            ))}
          </div>
          <svg
            ref={svgRef}
            className={
              dragMode === 'node'
                ? 'graph-svg graph-svg--dragging-node'
                : dragMode === 'pan'
                  ? 'graph-svg graph-svg--dragging-pan'
                  : 'graph-svg'
            }
            onClick={handleBackgroundClick}
            onPointerCancel={handleUp}
            onPointerDown={beginPan}
            onPointerLeave={handleUp}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onWheel={handleWheel}
            viewBox={`0 0 ${VIEWPORT_WIDTH} ${VIEWPORT_HEIGHT}`}
          >
            <rect fill="transparent" height={VIEWPORT_HEIGHT} width={VIEWPORT_WIDTH} />
            <g transform={`translate(${viewport.translateX} ${viewport.translateY}) scale(${viewport.scale})`}>
              {visibleEdges.map((edge) => {
                const sourceNode = graph.nodeMap.get(edge.source)
                const targetNode = graph.nodeMap.get(edge.target)
                const source = sourceNode?.renderPosition
                const target = targetNode?.renderPosition
                if (!source || !target || !sourceNode || !targetNode) {
                  return null
                }
                const state = edgeState(edge)
                const fullLabel = describeEdge(edge)
                const label = truncateGraphLabel(fullLabel, 20)
                const edgePath = getEdgePath(
                  edge,
                  sourceNode,
                  targetNode,
                  source,
                  target,
                  VIEWPORT_WIDTH,
                  VIEWPORT_HEIGHT,
                )
                const rawLabelPosition = getEdgeLabelPosition(
                  edge,
                  sourceNode,
                  targetNode,
                  source,
                  target,
                  VIEWPORT_WIDTH,
                  VIEWPORT_HEIGHT,
                )
                const labelWidth = Math.min(184, Math.max(88, label.length * 6.1 + 18))
                const labelHeight = 20
                const labelPosition = clampLabelPosition(
                  rawLabelPosition.x,
                  rawLabelPosition.y,
                  labelWidth,
                  labelHeight,
                )
                const edgeSelected = selection?.id === edge.id

                return (
                  <g key={edge.id}>
                    <title>{fullLabel}</title>
                    <path
                      className="graph-edge graph-edge--hit-area"
                      d={edgePath}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        if (consumeSuppressedClick()) {
                          return
                        }
                        event.stopPropagation()
                        setSelection({
                          kind: edge.kind === 'self-loop-group' ? 'self-loop-group' : 'edge',
                          id: edge.id,
                        })
                      }}
                    />
                    <path className={`graph-edge graph-edge--${state}`} d={edgePath} />
                    {showEdgeLabels && (
                      <g
                        className={edgeSelected ? 'graph-label graph-label--active' : 'graph-label'}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          if (consumeSuppressedClick()) {
                            return
                          }
                          event.stopPropagation()
                          setSelection({
                            kind: edge.kind === 'self-loop-group' ? 'self-loop-group' : 'edge',
                            id: edge.id,
                          })
                        }}
                      >
                        <rect
                          height={labelHeight}
                          width={labelWidth}
                          x={labelPosition.x - labelWidth / 2}
                          y={labelPosition.y - labelHeight / 2}
                        />
                        <text x={labelPosition.x} y={labelPosition.y}>
                          {label}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {visibleNodes.map((node) => {
                const x = node.renderPosition.x * VIEWPORT_WIDTH
                const y = node.renderPosition.y * VIEWPORT_HEIGHT
                const selected = selection?.kind === 'node' && selection.id === node.id
                const fill = categoryColor(node.category)
                const radius = getNodeRadius(node.score)
                const nodeLabel = node.name ?? node.label
                const labelLines = wrapGraphLabel(
                  nodeLabel,
                  viewport.scale >= 1.08 || selected ? 14 : 11,
                  selected ? 3 : viewport.scale >= 0.94 ? 2 : 1,
                )
                const longestLineLength = Math.max(...labelLines.map((line) => line.length), 8)
                const labelWidth = clamp(longestLineLength * 6.8 + 24, 76, 152)
                const labelHeight = labelLines.length * 12 + 10
                const labelY = radius + 16
                return (
                  <g key={node.id} transform={`translate(${x} ${y})`}>
                    <title>{nodeLabel}</title>
                    <circle
                      className={selected ? 'graph-node-ring graph-node-ring--active' : 'graph-node-ring'}
                      cx="0"
                      cy="0"
                      r={radius + 6}
                      style={{ stroke: fill }}
                    />
                    <circle
                      className={selected ? 'graph-node graph-node--active' : 'graph-node'}
                      cx="0"
                      cy="0"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (consumeSuppressedClick()) {
                          return
                        }
                        setSelection({ kind: 'node', id: node.id })
                      }}
                      onPointerDown={(event) => beginNodeDrag(event, node.id)}
                      r={radius}
                      style={{ fill }}
                    />
                    <text className="graph-node__score" x="0" y="-2">
                      {node.score}
                    </text>
                    {showNodeLabels && (
                      <>
                        <rect
                          className="graph-node__label-backdrop"
                          height={labelHeight}
                          rx="8"
                          width={labelWidth}
                          x={-labelWidth / 2}
                          y={radius + 8}
                        />
                        <text className="graph-node__label" x="0" y={labelY}>
                          {labelLines.map((line, index) => (
                            <tspan dy={index === 0 ? 0 : 12} key={`${node.id}-${index}`} x="0">
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </>
                    )}
                    {showNodeMeta && (
                      <text className="graph-node__meta" x="0" y={radius + labelHeight + 18}>
                        {formatCategoryLabel(node.category)}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        <aside className="detail-drawer">
          <div className="eyebrow">选中详情</div>
          {!selection && (
            <p className="detail-drawer__empty">点击节点或边，查看指标与事件片段</p>
          )}

          {selectedNode && (
            <div className="detail-stack">
              <h3>{selectedNode.name ?? selectedNode.label}</h3>
              <p>{formatNarrativeText(selectedNode.summary ?? selectedNode.description)}</p>
              <div className="landing-list">
                {selectedNode.labels.slice(0, 4).map((label) => (
                  <span key={label}>{formatDomainToken(label)}</span>
                ))}
              </div>
              <div className="detail-grid">
                <span>uuid</span>
                <span>{selectedNode.uuid ?? selectedNode.id}</span>
                <span>阶段</span>
                <span>{formatPhaseLabel(selectedNode.phase)}</span>
                <span>分数</span>
                <span>{selectedNode.score}</span>
                <span>状态</span>
                <span>{formatStatusLabel(selectedNode.status)}</span>
                <span>更新时间</span>
                <span>{selectedNode.updated_at ?? '暂无'}</span>
              </div>
              <pre>{JSON.stringify(selectedNode.metrics, null, 2)}</pre>
              <pre>{JSON.stringify(selectedNode.attributes, null, 2)}</pre>
            </div>
          )}

          {selectedEdge && (
            <div className="detail-stack">
              <h3>{formatRelationLabel(selectedEdge.primary.relation)}</h3>
              <p>
                {formatNarrativeText(
                  selectedEdge.primary.fact ??
                    selectedEdge.primary.name ??
                    '关联状态跃迁',
                )}
              </p>
              <div className="detail-grid">
                <span>源点</span>
                <span>{selectedEdge.primary.source_name ?? formatDomainToken(selectedEdge.source)}</span>
                <span>目标</span>
                <span>{selectedEdge.primary.target_name ?? formatDomainToken(selectedEdge.target)}</span>
                <span>类型</span>
                <span>{selectedEdge.kind === 'edge' ? '边' : '自环组'}</span>
                <span>事实类型</span>
                <span>{formatFactTypeLabel(selectedEdge.primary.fact_type)}</span>
                <span>更新时间</span>
                <span>{selectedEdge.primary.updated_at ?? '暂无'}</span>
              </div>
              <div className="landing-list">
                {selectedEdge.primary.labels.slice(0, 4).map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              {selectedEdge.items.length > 1 && (
                <div className="detail-stack">
                  {selectedEdge.items.map((item) => (
                    <article className="episode-card" key={item.id}>
                      <strong>{formatRelationLabel(item.relation)}</strong>
                      <p>{formatNarrativeText(item.fact ?? item.name ?? formatDomainToken(item.id))}</p>
                    </article>
                  ))}
                </div>
              )}
              {selectedEdge.primary.episodes.length > 0 && (
                <div className="detail-stack">
                  {selectedEdge.primary.episodes.map((episode) => (
                    <article className="episode-card" key={episode.id}>
                      <strong>{episode.title}</strong>
                      <p>{formatNarrativeText(episode.summary)}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="graph-minimap">
            <div className="eyebrow">迷你地图</div>
            <svg
              ref={minimapRef}
              onPointerDown={beginMinimapDrag}
              onPointerMove={(event) => {
                if (dragState.current.type === 'minimap') {
                  centerViewportFromMinimap(event.clientX, event.clientY)
                }
              }}
              onPointerUp={handleUp}
              viewBox={`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`}
            >
              {graph.edges.map((edge) => {
                const sourceNode = graph.nodeMap.get(edge.source)
                const targetNode = graph.nodeMap.get(edge.target)
                const source = sourceNode?.renderPosition
                const target = targetNode?.renderPosition
                if (!source || !target || !sourceNode || !targetNode) {
                  return null
                }
                return (
                  <path
                    key={edge.id}
                    d={getEdgePath(
                      edge,
                      sourceNode,
                      targetNode,
                      source,
                      target,
                      MINIMAP_WIDTH,
                      MINIMAP_HEIGHT,
                    )}
                  />
                )
              })}
              {graph.nodes.map((node) => (
                <circle
                  key={node.id}
                  cx={node.renderPosition.x * MINIMAP_WIDTH}
                  cy={node.renderPosition.y * MINIMAP_HEIGHT}
                  r="4"
                  style={{ fill: categoryColor(node.category) }}
                />
              ))}
              <rect
                className="graph-minimap__viewport"
                height={Math.max(12, minimapViewport.height)}
                width={Math.max(18, minimapViewport.width)}
                x={Math.min(
                  MINIMAP_WIDTH - Math.max(18, minimapViewport.width),
                  minimapViewport.x,
                )}
                y={Math.min(
                  MINIMAP_HEIGHT - Math.max(12, minimapViewport.height),
                  minimapViewport.y,
                )}
              />
            </svg>
          </div>
        </aside>
      </div>
    </section>
  )
}
