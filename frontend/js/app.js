/**
 * LifePath Engine — Main Application Router
 */

import { renderLanding } from './pages/landing.js';
import { renderOnboarding } from './pages/onboarding.js';
import { renderParameters } from './pages/parameters.js';
import { renderSimulation } from './pages/simulation.js';
import { renderResults } from './pages/results.js';
import { renderGraph } from './pages/graph.js';
import { t, toggleLang } from './i18n.js';

// ── Global State ──
export const state = {
  currentPage: 'landing',
  projectId: null,
  project: null,
  simComplete: false,
  simConfig: { rounds: 12, timeUnit: 'quarter', agentCount: 8 },
  simulationTab: 'tree',
  resultsView: 'overview',
  selectedPathId: null,
  backtrackNodeIndex: null,
  treeEvents: [],
};

// ── Router ──
const routes = {
  landing: renderLanding,
  onboarding: renderOnboarding,
  parameters: renderParameters,
  simulation: renderSimulation,
  results: renderResults,
  graph: renderGraph,
};

const treeEventListeners = new Set();

export function resetTreeEvents(events = []) {
  state.treeEvents = Array.isArray(events) ? [...events] : [];
}

export function pushTreeEvent(event) {
  if (!event?.id) return;
  if (state.treeEvents.some(existing => existing.id === event.id)) return;
  state.treeEvents = [...state.treeEvents, event];
  treeEventListeners.forEach(listener => listener(event));
}

export function subscribeTreeEvents(listener, { replay = false } = {}) {
  treeEventListeners.add(listener);
  if (replay) {
    state.treeEvents.forEach(event => listener(event));
  }
  return () => treeEventListeners.delete(listener);
}

export function hydrateProjectState(project, overrides = {}) {
  if (!project?.id) return;
  state.projectId = project.id;
  state.project = project;
  state.simComplete = project.status === 'completed' || Array.isArray(project.paths) && project.paths.length > 0;
  state.simulationTab = overrides.simulationTab || 'tree';
  state.resultsView = overrides.resultsView || 'overview';
  state.selectedPathId = overrides.selectedPathId || null;
  state.backtrackNodeIndex = null;
  resetTreeEvents(project._tree_events || []);
  Object.assign(state, overrides);
}

export function resetSessionState() {
  state.simComplete = false;
  state.simulationTab = 'tree';
  state.resultsView = 'overview';
  state.selectedPathId = null;
  state.backtrackNodeIndex = null;
  resetTreeEvents([]);
}

function isSimulationInProgress() {
  return state.currentPage === 'simulation' && !state.simComplete && state.project?.status !== 'completed';
}

function isPageAvailable(page) {
  if (page === 'landing') return true;
  if (!state.projectId) return false;
  if (page === 'simulation') {
    return ['profiled', 'configured', 'simulating', 'completed'].includes(state.project?.status || '');
  }
  if (page === 'graph' || page === 'results') {
    return state.simComplete || state.project?.status === 'completed';
  }
  return true;
}

function shouldLockNavigation(requestedPage) {
  if (!isPageAvailable(requestedPage)) return true;
  return isSimulationInProgress() && requestedPage !== 'simulation';
}

export function navigateTo(page, params = {}) {
  if (shouldLockNavigation(page)) {
    updateNavLinks();
    return;
  }

  Object.assign(state, params);
  const targetPage = resolvePage(page);
  if (targetPage === state.currentPage && Object.keys(params).length === 0) {
    updateNavLinks();
    return;
  }
  state.currentPage = targetPage;
  window.location.hash = targetPage;
  render();
}

function resolvePage(page) {
  if (!state.projectId && ['simulation', 'graph', 'results'].includes(page)) {
    return 'landing';
  }

  if (['graph', 'results'].includes(page) && !state.simComplete && state.project?.status !== 'completed') {
    return 'simulation';
  }

  return page;
}

window.navigateTo = navigateTo;
window.appState = state;
window.t = t;

function render() {
  const app = document.getElementById('app');
  const resolvedPage = resolvePage(state.currentPage);
  state.currentPage = resolvedPage;
  const renderer = routes[resolvedPage];
  if (renderer) {
    renderer(app);
  }
  updateNavLinks();
  updateLangButton();
}

function updateNavLinks() {
  const navKeys = {
    landing: 'nav_simulation',
    simulation: 'nav_system',
    graph: 'nav_graph',
    results: 'nav_reports',
  };
  const lockNav = isSimulationInProgress();
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.dataset.page;
    const disabled = !isPageAvailable(page) || (lockNav && page !== 'simulation');
    link.classList.toggle('active', page === state.currentPage);
    link.classList.toggle('nav-disabled', disabled);
    link.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    const key = navKeys[page];
    if (key) link.textContent = t(key);
  });
}

function updateLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = t('lang_switch');
}

function handleHash() {
  const hash = window.location.hash.slice(1) || 'landing';
  if (routes[hash]) {
    if (shouldLockNavigation(hash)) {
      if (window.location.hash !== '#simulation') {
        window.location.hash = 'simulation';
      }
      updateNavLinks();
      return;
    }
    state.currentPage = resolvePage(hash);
    render();
  }
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLang();
      render();
    });
  }

  handleHash();
});
