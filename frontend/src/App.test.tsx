import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { DashboardState } from './lib/types'

const seedState: DashboardState = {
  generated_at: '2026-04-11T00:00:00Z',
  profile: {
    name: 'Lin',
    stage: '大四',
    location: '上海',
    concern: '职业选择',
    objective: '平衡',
    weights: { academics: 82 },
    risk_tolerance: 47,
    planning_horizon: '3 years',
    initial_parameters: {},
  },
  graph_nodes: [
    {
      id: 'self',
      label: '自我',
      type: 'subject',
      description: 'desc',
      score: 80,
      group: 'core',
      position: { x: 0.2, y: 0.4 },
      category: 'subject',
      labels: [],
      tags: [],
      metrics: { optionality: 80 },
      details: {},
      attributes: {},
      branch_ids: ['research-track'],
      status: 'active',
      phase: 'intake',
      name: 'Lin',
    },
    {
      id: 'decision-core',
      label: '决策核心',
      type: 'decision',
      description: 'desc',
      score: 72,
      group: 'core',
      position: { x: 0.5, y: 0.3 },
      category: 'decision',
      labels: [],
      tags: [],
      metrics: { goal_alignment: 72 },
      details: {},
      attributes: {},
      branch_ids: ['research-track'],
      status: 'active',
      phase: 'branching',
    },
  ],
  graph_edges: [
    {
      id: 'edge-1',
      source: 'self',
      target: 'decision-core',
      relation: 'drives',
      strength: 4,
      fact_type: 'causal',
      weight: 1,
      polarity: 'positive',
      labels: [],
      details: {},
      attributes: {},
      episodes: [],
      branch_ids: ['research-track'],
      status: 'active',
      allows_self_loop: true,
    },
  ],
  agents: [],
  simulation_events: [
    {
      id: 'event-1',
      phase: 'simulation',
      title: '已载入',
      description: 'seed',
      impact: 'ok',
      timestamp: '2026-04-11T00:00:00Z',
      node_ids: [],
      memory_ids: [],
      details: {},
    },
  ],
  paths: [
    {
      id: 'research-first',
      title: '科研优先',
      thesis: 'thesis',
      archetype: 'research',
      confidence: 84,
      risk: 38,
      payoff: 78,
      summary: '优先追踪导师信号与公开产出。',
      nodes: [
        {
          id: 'rf-1',
          title: '导师对齐',
          type: 'checkpoint',
          time_label: 'Semester 1',
          summary: '强化信号。',
          deltas: [],
          editable_fields: [
            {
              key: 'mentor_signal',
              label: '导师信号',
              value: '更强',
              field_type: 'text',
              options: [],
            },
          ],
          graph_node_ids: ['self'],
          actors: [],
          details: {},
        },
      ],
      advice: {
        immediate: ['先发布一个公开成果'],
        next_quarter: ['补齐推荐证据'],
        risk_controls: ['控制过劳漂移'],
        questions_to_track: [],
      },
      score_breakdown: { optionality: 86, education: 82 },
      branch_id: 'research-track',
      status: 'active',
      horizon: 'semester',
      focus_node_ids: ['decision-core'],
      detail_fields: {},
      state_projection: {
        education: 80,
        career: 70,
        finance: 60,
        health: 55,
        mental: 57,
        relationship: 58,
        family_support: 61,
        social_capital: 64,
        optionality: 85,
        goal_alignment: 82,
      },
    },
  ],
  stitch: { project_id: '8477727617233002131', assets: [] },
  current_cycle: 1,
  time_mode: 'semester',
  active_branch_id: 'research-track',
  current_state: {
    id: 'snapshot-1',
    branch_id: 'research-track',
    cycle_index: 1,
    phase: 'state_update',
    time_label: 'Semester 1',
    axes: {
      education: 78,
      career: 63,
      finance: 52,
      health: 64,
      mental: 58,
      relationship: 57,
      family_support: 62,
      social_capital: 61,
      optionality: 84,
      goal_alignment: 79,
    },
    narrative: '双轨对冲仍然成立。',
    deltas: {},
    triggers: [],
    timestamp: '2026-04-11T00:00:00Z',
  },
  state_snapshots: [],
  memories: [],
  branches: [
    {
      id: 'research-track',
      title: '科研轨',
      thesis: 'thesis',
      kind: 'main',
      status: 'active',
      depth: 0,
      cycle_index: 1,
      horizon: 'semester',
      confidence: 84,
      tags: [],
      focus_metrics: { optionality: 86 },
    },
  ],
  graph_meta: {
    node_count: 2,
    edge_count: 1,
    branch_count: 1,
    self_loop_count: 0,
    multi_edge_group_count: 0,
    supports_self_loops: true,
    supports_multi_edges: true,
    node_categories: ['subject', 'decision'],
    detail_fields: ['details'],
  },
  llm: {
    provider: 'local-fallback',
    mode: 'fallback',
    configured: false,
    api_key_present: false,
    used_fallback: true,
  },
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        if (url.endsWith('/api/project')) {
          return new Response(JSON.stringify(seedState), { status: 200 })
        }
        if (url.endsWith('/api/simulation/run')) {
          return new Response(JSON.stringify(seedState), { status: 200 })
        }
        if (url.endsWith('/api/project/reset')) {
          return new Response(JSON.stringify(seedState), { status: 200 })
        }
        if (url.includes('/api/paths/research-first/rerun') && init?.method === 'POST') {
          return new Response(JSON.stringify(seedState), { status: 200 })
        }
        return new Response('not found', { status: 404 })
      }),
    )
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders landing page from loaded dashboard state', async () => {
    render(<App />)
    await screen.findByRole('heading', { name: /人生不是终点/i })
    expect(await screen.findByRole('heading', { name: /科研优先/i })).toBeInTheDocument()
  })

  it('navigates to simulation and triggers run action', async () => {
    window.history.pushState({}, '', '/simulation')
    render(<App />)
    await screen.findByRole('heading', { name: /人生路径树:/i })
    fireEvent.click(screen.getByRole('button', { name: /推进模拟/i }))

    await waitFor(() => {
      const fetchMock = vi.mocked(fetch)
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/simulation/run',
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })
})
