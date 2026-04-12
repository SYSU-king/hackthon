import { describe, expect, it } from 'vitest'
import { buildGraphViewModel, getEdgePath } from './graph'
import type { GraphEdge, GraphNode } from './types'

const nodes: GraphNode[] = [
  {
    id: 'a',
    label: 'A',
    type: 'node',
    description: 'A',
    score: 50,
    group: 'core',
    position: { x: 0.2, y: 0.4 },
    category: 'subject',
    labels: [],
    tags: [],
    metrics: {},
    details: {},
    attributes: {},
    branch_ids: [],
    status: 'active',
    phase: 'world',
  },
  {
    id: 'b',
    label: 'B',
    type: 'node',
    description: 'B',
    score: 50,
    group: 'core',
    position: { x: 0.7, y: 0.4 },
    category: 'subject',
    labels: [],
    tags: [],
    metrics: {},
    details: {},
    attributes: {},
    branch_ids: [],
    status: 'active',
    phase: 'world',
  },
]

const edges: GraphEdge[] = [
  {
    id: 'e1',
    source: 'a',
    target: 'b',
    relation: 'forward',
    strength: 3,
    fact_type: 'causal',
    weight: 1,
    polarity: 'neutral',
    labels: [],
    details: {},
    attributes: {},
    episodes: [],
    branch_ids: [],
    status: 'active',
    allows_self_loop: true,
  },
  {
    id: 'e2',
    source: 'b',
    target: 'a',
    relation: 'reverse',
    strength: 3,
    fact_type: 'causal',
    weight: 1,
    polarity: 'neutral',
    labels: [],
    details: {},
    attributes: {},
    episodes: [],
    branch_ids: [],
    status: 'active',
    allows_self_loop: true,
  },
  {
    id: 'e3',
    source: 'a',
    target: 'a',
    relation: 'self',
    strength: 3,
    fact_type: 'causal',
    weight: 1,
    polarity: 'neutral',
    labels: [],
    details: {},
    attributes: {},
    episodes: [],
    branch_ids: [],
    status: 'active',
    allows_self_loop: true,
  },
]

describe('buildGraphViewModel', () => {
  it('groups self loops and preserves paired multi-edge curvature', () => {
    const graph = buildGraphViewModel(nodes, edges)
    const selfGroup = graph.edges.find((edge) => edge.kind === 'self-loop-group')
    const pairedEdges = graph.edges.filter((edge) => edge.kind === 'edge')

    expect(selfGroup).toBeTruthy()
    expect(selfGroup?.items).toHaveLength(1)
    expect(pairedEdges).toHaveLength(2)
    expect(Math.sign(pairedEdges[0].curveOffset)).not.toEqual(Math.sign(pairedEdges[1].curveOffset))
  })

  it('starts straight edges from the node boundary instead of the node center', () => {
    const graph = buildGraphViewModel(nodes, [edges[0]])
    const edge = graph.edges[0]
    const sourceNode = graph.nodeMap.get('a')
    const targetNode = graph.nodeMap.get('b')

    expect(sourceNode).toBeTruthy()
    expect(targetNode).toBeTruthy()

    const path = getEdgePath(
      edge,
      sourceNode!,
      targetNode!,
      sourceNode!.renderPosition,
      targetNode!.renderPosition,
      200,
      100,
    )

    expect(path.startsWith('M 68.25 40')).toBe(true)
  })
})
