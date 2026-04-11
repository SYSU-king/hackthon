/**
 * LifePath Engine — Main Application Router
 */

import { renderLanding } from './pages/landing.js';
import { renderOnboarding } from './pages/onboarding.js';
import { renderParameters } from './pages/parameters.js';
import { renderSimulation } from './pages/simulation.js';
import { renderResults } from './pages/results.js';
import { renderGraph } from './pages/graph.js';
import { t, toggleLang, getLang } from './i18n.js';

// ── Global State ──
export const state = {
  currentPage: 'landing',
  projectId: null,
  project: null,
  simComplete: false,   // prevents re-simulation
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

export function navigateTo(page, params = {}) {
  state.currentPage = page;
  Object.assign(state, params);
  window.location.hash = page;
  render();
}

// Expose globally for onclick handlers
window.navigateTo = navigateTo;
window.appState = state;
window.t = t;

function render() {
  const app = document.getElementById('app');
  const renderer = routes[state.currentPage];
  if (renderer) {
    renderer(app);
  }
  updateNavLinks();
  updateLangButton();
}

function updateNavLinks() {
  const navKeys = {
    landing: 'nav_simulation',
    graph: 'nav_graph',
    results: 'nav_reports',
    simulation: 'nav_system',
  };
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.dataset.page;
    link.classList.toggle('active', page === state.currentPage);
    const key = navKeys[page];
    if (key) link.textContent = t(key);
  });
}

function updateLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = t('lang_switch');
}

// ── Hash-based routing ──
function handleHash() {
  const hash = window.location.hash.slice(1) || 'landing';
  if (routes[hash]) {
    state.currentPage = hash;
    render();
  }
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('DOMContentLoaded', () => {
  // Bind nav links
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Bind language toggle
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLang();
      render(); // re-render current page with new language
    });
  }

  handleHash();
});
