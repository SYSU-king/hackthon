/**
 * API Client for LifePath Engine Backend
 */

const BASE = '';  // proxied by Vite to http://127.0.0.1:8000

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const resp = await fetch(`${BASE}${path}`, opts);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: resp.statusText }));
    throw new Error(err.detail || 'API Error');
  }
  return resp.json();
}

export const api = {
  // Health
  health: () => request('GET', '/api/health'),

  // Projects
  createProject: (title) => request('POST', '/api/projects', { title }),
  listProjects: () => request('GET', '/api/projects'),
  getProject: (id) => request('GET', `/api/projects/${id}`),
  deleteProject: (id) => request('DELETE', `/api/projects/${id}`),

  // Profile
  submitProfile: (projectId, profile) =>
    request('POST', `/api/projects/${projectId}/profile`, profile),

  // Parameters
  submitParameters: (projectId, parameters) =>
    request('POST', `/api/projects/${projectId}/parameters`, { parameters }),

  // Simulation (returns fetch Response for SSE)
  startSimulation: (projectId, rounds = 12, timeUnit = 'quarter') => {
    return fetch(`${BASE}/api/projects/${projectId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rounds, time_unit: timeUnit }),
    });
  },

  // Paths
  getPaths: (projectId) => request('GET', `/api/projects/${projectId}/paths`),
  getPathDetail: (projectId, pathId) =>
    request('GET', `/api/projects/${projectId}/paths/${pathId}`),

  // Advice
  getAdvice: (projectId, pathId, feedback = 'satisfied') =>
    request('POST', `/api/projects/${projectId}/paths/${pathId}/advice`, { feedback }),

  // Graph & Agents (new)
  getGraph: (projectId) => request('GET', `/api/projects/${projectId}/graph`),
  getAgents: (projectId) => request('GET', `/api/projects/${projectId}/agents`),
};
