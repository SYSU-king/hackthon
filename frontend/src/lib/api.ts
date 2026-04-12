import type { DashboardState, RerunPayload } from './types'

const API_ROOT = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `请求失败: ${response.status}`)
  }

  return (await response.json()) as T
}

export function getProject() {
  return request<DashboardState>('/project')
}

export function resetProject() {
  return request<DashboardState>('/project/reset', { method: 'POST' })
}

export function runSimulation() {
  return request<DashboardState>('/simulation/run', { method: 'POST' })
}

export function rerunPath(pathId: string, payload: RerunPayload) {
  return request<DashboardState>(`/paths/${pathId}/rerun`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
