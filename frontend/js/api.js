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

async function parseErrorResponse(resp) {
  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const err = await resp.json().catch(() => ({}));
    return err.detail || err.message || JSON.stringify(err);
  }

  const text = await resp.text().catch(() => '');
  return text || resp.statusText || `HTTP ${resp.status}`;
}

export async function ensureStreamingResponse(resp) {
  if (resp.ok) return resp;
  throw new Error(await parseErrorResponse(resp));
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
  startSimulation: (projectId, rounds = 12, timeUnit = 'quarter', agentCount = 6) => {
    return fetch(`${BASE}/api/projects/${projectId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rounds, time_unit: timeUnit, agent_count: agentCount }),
    });
  },

  // Force re-simulate (clears cached results and runs fresh AI simulation)
  reSimulate: (projectId, rounds = 12, timeUnit = 'quarter', agentCount = 6) => {
    return fetch(`${BASE}/api/projects/${projectId}/re-simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rounds, time_unit: timeUnit, agent_count: agentCount }),
    });
  },

  // Backtracking / Counterfactual (returns fetch Response for SSE)
  backtrack: (projectId, pathId, nodeIndex, modifications, description, rounds = 6) => {
    return fetch(`${BASE}/api/projects/${projectId}/backtrack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path_id: pathId,
        node_index: nodeIndex,
        modifications,
        description,
        rounds,
      }),
    });
  },

  // Paths
  getPaths: (projectId) => request('GET', `/api/projects/${projectId}/paths`),
  getPathDetail: (projectId, pathId) =>
    request('GET', `/api/projects/${projectId}/paths/${pathId}`),

  // Advice
  getAdvice: (projectId, pathId, feedback = 'satisfied') =>
    request('POST', `/api/projects/${projectId}/paths/${pathId}/advice`, { feedback }),

  // Graph & Agents
  getGraph: (projectId) => request('GET', `/api/projects/${projectId}/graph`),
  getAgents: (projectId) => request('GET', `/api/projects/${projectId}/agents`),

  // Report
  getReport: (projectId) => request('GET', `/api/projects/${projectId}/report`),

  // Tree Events (for rebuilding tree after page reload)
  getTreeEvents: (projectId) => request('GET', `/api/projects/${projectId}/tree-events`),
};
