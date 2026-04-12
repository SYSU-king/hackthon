import { formatRelationLabel } from './i18n'
import type { GraphEdge, GraphNode, GraphPosition } from './types'

export type DisplayNode = GraphNode & {
  renderPosition: GraphPosition
}

export type DisplayEdge =
  | {
      id: string
      kind: 'edge'
      source: string
      target: string
      pairIndex: number
      pairTotal: number
      curveOffset: number
      items: GraphEdge[]
      primary: GraphEdge
    }
  | {
      id: string
      kind: 'self-loop-group'
      source: string
      target: string
      pairIndex: 0
      pairTotal: 1
      curveOffset: 0
      items: GraphEdge[]
      primary: GraphEdge
    }

function pairKey(source: string, target: string) {
  return [source, target].sort().join('::')
}

function directedKey(source: string, target: string) {
  return `${source}->${target}`
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getCurveControlPoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curveOffset: number,
) {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.hypot(dx, dy) || 1
  const nx = -dy / distance
  const ny = dx / distance

  return {
    controlX: midX + nx * curveOffset,
    controlY: midY + ny * curveOffset,
    normalX: nx,
    normalY: ny,
    distance,
  }
}

export function getNodeRadius(score: number) {
  return Math.max(24, Math.min(38, 22 + score / 8))
}

export function buildGraphViewModel(
  nodes: GraphNode[],
  edges: GraphEdge[],
  positionOverrides: Record<string, GraphPosition> = {},
) {
  const nodeMap = new Map(
    nodes.map((node) => [
      node.id,
      {
        ...node,
        renderPosition: positionOverrides[node.id] ?? node.position,
      } satisfies DisplayNode,
    ]),
  )

  const validEdges = edges.filter((edge) => nodeMap.has(edge.source) && nodeMap.has(edge.target))

  const selfLoopGroups = new Map<string, GraphEdge[]>()
  const pairGroups = new Map<string, GraphEdge[]>()

  for (const edge of validEdges) {
    if (edge.source === edge.target) {
      const items = selfLoopGroups.get(edge.source) ?? []
      items.push(edge)
      selfLoopGroups.set(edge.source, items)
      continue
    }

    const key = pairKey(edge.source, edge.target)
    const items = pairGroups.get(key) ?? []
    items.push(edge)
    pairGroups.set(key, items)
  }

  const displayEdges: DisplayEdge[] = []

  for (const [source, items] of selfLoopGroups) {
    displayEdges.push({
      id: `self-loop-group:${source}`,
      kind: 'self-loop-group',
      source,
      target: source,
      pairIndex: 0,
      pairTotal: 1,
      curveOffset: 0,
      items,
      primary: items[0],
    })
  }

  for (const items of pairGroups.values()) {
    const byDirection = new Map<string, GraphEdge[]>()

    for (const edge of items) {
      const key = directedKey(edge.source, edge.target)
      const bucket = byDirection.get(key) ?? []
      bucket.push(edge)
      byDirection.set(key, bucket)
    }

    const directions = Array.from(byDirection.entries()).sort(([left], [right]) =>
      left.localeCompare(right),
    )
    const hasOppositeDirections = directions.length > 1

    directions.forEach(([, directedItems], directionIndex) => {
      const directionSign = hasOppositeDirections ? (directionIndex === 0 ? -1 : 1) : 1

      directedItems.forEach((edge, index) => {
        const centeredIndex = index - (directedItems.length - 1) / 2
        const curveOffset = hasOppositeDirections
          ? directionSign * (18 + index * 22)
          : centeredIndex * 30

        displayEdges.push({
          id: edge.id,
          kind: 'edge',
          source: edge.source,
          target: edge.target,
          pairIndex: index,
          pairTotal: directedItems.length,
          curveOffset,
          items: [edge],
          primary: edge,
        })
      })
    })
  }

  return {
    nodeMap,
    nodes: Array.from(nodeMap.values()),
    edges: displayEdges,
  }
}

export function describeEdge(edge: DisplayEdge) {
  if (edge.kind === 'self-loop-group') {
    return `${edge.items.length} 条自反馈连接`
  }
  return edge.primary.fact ?? formatRelationLabel(edge.primary.relation)
}

export function truncateGraphLabel(label: string, maxLength = 18) {
  if (label.length <= maxLength) {
    return label
  }
  return `${label.slice(0, Math.max(0, maxLength - 3))}...`
}

export function wrapGraphLabel(label: string, maxLineLength = 12, maxLines = 2) {
  const normalized = label.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return ['']
  }

  const words = normalized.split(' ')
  const lines: string[] = []
  let current = ''

  function pushCurrent() {
    if (current) {
      lines.push(current)
      current = ''
    }
  }

  for (const word of words) {
    const segments =
      word.length > maxLineLength
        ? word.match(new RegExp(`.{1,${maxLineLength}}`, 'g')) ?? [word]
        : [word]

    for (const segment of segments) {
      if (!current) {
        current = segment
        continue
      }

      const candidate = `${current} ${segment}`
      if (candidate.length <= maxLineLength) {
        current = candidate
        continue
      }

      pushCurrent()
      current = segment
    }
  }

  pushCurrent()

  if (lines.length <= maxLines) {
    return lines
  }

  return [
    ...lines.slice(0, maxLines - 1),
    truncateGraphLabel(lines.slice(maxLines - 1).join(' '), maxLineLength),
  ]
}

function pointAlong(x1: number, y1: number, x2: number, y2: number, distance: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy) || 1
  return {
    x: x1 + (dx / length) * distance,
    y: y1 + (dy / length) * distance,
  }
}

export function getEdgePath(
  edge: DisplayEdge,
  sourceNode: GraphNode,
  targetNode: GraphNode,
  source: GraphPosition,
  target: GraphPosition,
  width: number,
  height: number,
) {
  const x1 = source.x * width
  const y1 = source.y * height
  const x2 = target.x * width
  const y2 = target.y * height
  const sourceRadius = getNodeRadius(sourceNode.score)
  const targetRadius = getNodeRadius(targetNode.score)

  if (edge.kind === 'self-loop-group') {
    const loopWidth = sourceRadius + 18 + edge.items.length * 7
    const loopHeight = sourceRadius + 28 + edge.items.length * 8
    const start = {
      x: x1 + sourceRadius * 0.52,
      y: y1 - sourceRadius * 0.72,
    }
    const end = {
      x: x1 - sourceRadius * 0.52,
      y: y1 - sourceRadius * 0.72,
    }

    return `M ${start.x} ${start.y} C ${x1 + loopWidth} ${y1 - loopHeight}, ${x1 - loopWidth} ${y1 - loopHeight}, ${end.x} ${end.y}`
  }

  if (edge.curveOffset === 0) {
    const start = pointAlong(x1, y1, x2, y2, sourceRadius)
    const end = pointAlong(x2, y2, x1, y1, targetRadius)
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
  }

  const { controlX, controlY } = getCurveControlPoint(x1, y1, x2, y2, edge.curveOffset)
  const start = pointAlong(x1, y1, controlX, controlY, sourceRadius)
  const end = pointAlong(x2, y2, controlX, controlY, targetRadius)

  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`
}

export function getEdgeLabelPosition(
  edge: DisplayEdge,
  sourceNode: GraphNode,
  _targetNode: GraphNode,
  source: GraphPosition,
  target: GraphPosition,
  width: number,
  height: number,
) {
  const x1 = source.x * width
  const y1 = source.y * height
  const x2 = target.x * width
  const y2 = target.y * height

  if (edge.kind === 'self-loop-group') {
    const radius = getNodeRadius(sourceNode.score)
    return {
      x: clamp(x1 + radius * 0.72, 28, width - 28),
      y: clamp(y1 - (radius + 36 + edge.items.length * 8), 18, height - 18),
    }
  }

  if (edge.curveOffset === 0) {
    const dx = x2 - x1
    const dy = y2 - y1
    const distance = Math.hypot(dx, dy) || 1
    const nx = -dy / distance
    const ny = dx / distance
    const offset = clamp(distance * 0.12, 12, 22)

    return {
      x: clamp((x1 + x2) / 2 + nx * offset, 28, width - 28),
      y: clamp((y1 + y2) / 2 + ny * offset, 18, height - 18),
    }
  }

  const { controlX, controlY, normalX, normalY } = getCurveControlPoint(
    x1,
    y1,
    x2,
    y2,
    edge.curveOffset,
  )
  const t = 0.5
  const curveX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * controlX + t * t * x2
  const curveY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * controlY + t * t * y2
  const labelOffset = clamp(Math.abs(edge.curveOffset) * 0.2, 10, 18) * Math.sign(edge.curveOffset)

  return {
    x: clamp(curveX + normalX * labelOffset, 28, width - 28),
    y: clamp(curveY + normalY * labelOffset, 18, height - 18),
  }
}
