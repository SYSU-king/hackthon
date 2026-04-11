/**
 * Simulation Process Page — with SSE event stream
 * BUG FIX: checks project status before re-running simulation
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';
import { t } from '../i18n.js';

export function renderSimulation(container) {
  // ── BUG FIX: If project is already completed, show completion UI ──
  if (state.simComplete || state.project?.status === 'completed') {
    renderCompletedState(container);
    return;
  }

  container.innerHTML = `
    <div class="sim-layout">
      <!-- Canvas: Tree Visualization -->
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${t('sim_viewport')}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${t('sim_tree_title')}: Session-${state.projectId?.slice(0, 4) || 'X'}
          </h1>
        </div>
        <div class="sim-tree-container" id="tree-container">
          <svg id="tree-svg" viewBox="0 0 800 600" style="width:90%;max-width:800px;height:auto;">
            <!-- Root -->
            <line x1="400" y1="540" x2="400" y2="420" stroke="#000" stroke-width="1.5"/>
            <rect x="360" y="540" width="80" height="24" fill="#000"/>
            <text x="400" y="557" text-anchor="middle" fill="#fff" font-family="Space Grotesk" font-size="10">BASE_INIT</text>
            
            <!-- L1 branches -->
            <line x1="400" y1="420" x2="200" y2="300" stroke="#000" stroke-width="1" id="line-l1a"/>
            <line x1="400" y1="420" x2="600" y2="300" stroke="#000" stroke-width="1" id="line-l1b"/>
            
            <!-- L1 nodes -->
            <g id="node-l1a" style="opacity:0;transition:opacity 0.5s;">
              <rect x="160" y="288" width="80" height="24" fill="#F3F3F3" stroke="#C6C6C6"/>
              <text x="200" y="305" text-anchor="middle" fill="#000" font-family="Space Grotesk" font-size="10">EDU_PATH</text>
            </g>
            <g id="node-l1b" style="opacity:0;transition:opacity 0.5s;">
              <rect x="560" y="288" width="80" height="24" fill="#F3F3F3" stroke="#C6C6C6"/>
              <text x="600" y="305" text-anchor="middle" fill="#000" font-family="Space Grotesk" font-size="10">CAREER_PATH</text>
            </g>
            
            <!-- L2 branches -->
            <line x1="200" y1="288" x2="120" y2="180" stroke="#000" stroke-width="1" stroke-dasharray="2,2" id="line-l2a" style="opacity:0;transition:opacity 0.5s;"/>
            <line x1="200" y1="288" x2="280" y2="180" stroke="#FF4500" stroke-width="2" id="line-l2b" style="opacity:0;transition:opacity 0.5s;"/>
            
            <!-- Active node -->
            <g id="node-active" style="opacity:0;transition:opacity 0.5s;">
              <rect x="235" y="168" width="90" height="28" fill="#FF4500"/>
              <text x="280" y="187" text-anchor="middle" fill="#fff" font-family="Space Grotesk" font-size="10" font-weight="bold">ACTIVE_NODE</text>
              <rect x="235" y="148" width="90" height="16" fill="#000"/>
              <text x="280" y="160" text-anchor="middle" fill="#FF4500" font-family="Space Grotesk" font-size="8" id="active-label">PROCESSING...</text>
            </g>
            <g id="node-pruned" style="opacity:0;transition:opacity 0.5s;">
              <rect x="80" y="168" width="80" height="24" fill="#F3F3F3" stroke="#C6C6C6"/>
              <text x="120" y="185" text-anchor="middle" fill="#777" font-family="Space Grotesk" font-size="10">PRUNED</text>
            </g>

            <!-- L2 from L1b -->
            <line x1="600" y1="288" x2="520" y2="180" stroke="#000" stroke-width="1" id="line-l2c" style="opacity:0;transition:opacity 0.5s;"/>
            <line x1="600" y1="288" x2="680" y2="180" stroke="#000" stroke-width="1" stroke-dasharray="2,2" id="line-l2d" style="opacity:0;transition:opacity 0.5s;"/>
            <g id="node-l2c" style="opacity:0;transition:opacity 0.5s;">
              <rect x="480" y="168" width="80" height="24" fill="#F3F3F3" stroke="#C6C6C6"/>
              <text x="520" y="185" text-anchor="middle" fill="#000" font-family="Space Grotesk" font-size="10">RISK_PATH</text>
            </g>
            <g id="node-l2d" style="opacity:0;transition:opacity 0.5s;">
              <rect x="640" y="168" width="80" height="24" fill="#F3F3F3" stroke="#C6C6C6"/>
              <text x="680" y="185" text-anchor="middle" fill="#000" font-family="Space Grotesk" font-size="10">BALANCE</text>
            </g>
          </svg>
        </div>
      </section>

      <!-- Event Stream Panel -->
      <aside class="sim-panel">
        <div class="sim-panel-header">
          <div class="flex items-center justify-between mb-4">
            <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;text-transform:uppercase;">${t('sim_event_stream')}</span>
            <span class="status-dot status-active pulse" id="status-dot"></span>
          </div>
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${state.projectId?.slice(0, 4) || '0000'}</div>
        </div>
        <div class="sim-panel-body" id="event-log">
          <div class="console-line console-latest">
            <span class="console-ts">[--:--:--]</span>
            <span>${t('sim_waiting')}</span>
          </div>
        </div>
        <div style="padding:16px;background:var(--primary);color:var(--white);">
          <div class="flex items-center gap-8 mb-8">
            <span class="material-symbols-outlined icon-sm">info</span>
            <span class="mono-xs">${t('sim_metrics')}</span>
          </div>
          <div class="grid-2 gap-16" style="font-family:var(--font-mono);font-size:10px;">
            <div><span style="opacity:0.6;display:block;">${t('sim_progress')}</span><span id="metric-progress">0%</span></div>
            <div><span style="opacity:0.6;display:block;">${t('sim_paths')}</span><span id="metric-paths">0</span></div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Time Progression Footer -->
    <footer class="sim-footer">
      <div class="flex items-center gap-8">
        <button class="btn btn-primary" id="btn-control" style="padding:8px 12px;">
          <span class="material-symbols-outlined">play_arrow</span>
        </button>
      </div>
      <div style="flex:1;position:relative;">
        <div class="flex justify-between mono-xs text-muted" style="margin-bottom:4px;">
          <span>YEAR_0</span><span>YEAR_5</span><span>YEAR_10</span><span>YEAR_15</span><span>YEAR_20</span>
        </div>
        <div class="sim-progress-bar">
          <div class="sim-progress-fill" id="progress-fill" style="width:0%;"></div>
          <div class="sim-progress-label" id="progress-label" style="left:0%;">0%</div>
        </div>
      </div>
      <div style="width:200px;text-align:right;">
        <div class="mono-xs text-muted">${t('sim_state')}</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-style:italic;font-size:16px;" id="state-label">${t('sim_initializing')}</div>
      </div>
    </footer>
  `;

  // Start simulation
  startSim(container);
}

/**
 * Show completed state instead of re-simulating.
 */
function renderCompletedState(container) {
  container.innerHTML = `
    <div style="min-height:calc(100vh - var(--topnav-h));display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;max-width:560px;padding:48px;">
        <span class="material-symbols-outlined" style="font-size:64px;color:var(--accent);margin-bottom:24px;display:block;">check_circle</span>
        <h1 style="font-size:40px;margin-bottom:16px;">${t('sim_completed_view')}</h1>
        <p class="text-secondary" style="margin-bottom:48px;font-size:16px;line-height:1.7;">
          ${t('sim_completed_msg')}
        </p>
        <div class="flex gap-16 justify-center" style="flex-wrap:wrap;">
          <button class="btn btn-accent" onclick="navigateTo('graph')">
            <span class="material-symbols-outlined icon-sm">hub</span> ${t('btn_view_graph')}
          </button>
          <button class="btn btn-primary" onclick="navigateTo('results')">
            <span class="material-symbols-outlined icon-sm">assessment</span> ${t('btn_view_results')}
          </button>
          <button class="btn btn-ghost" id="btn-resim">
            <span class="material-symbols-outlined icon-sm">replay</span> ${t('btn_re_simulate')}
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-resim')?.addEventListener('click', () => {
    state.simComplete = false;
    if (state.project) state.project.status = 'simulating';
    navigateTo('simulation');
  });
}

async function startSim(container) {
  const config = state.simConfig || { rounds: 12, timeUnit: 'quarter' };
  
  try {
    const resp = await api.startSimulation(state.projectId, config.rounds, config.timeUnit);
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6));
            handleEvent(event, container);
          } catch (e) { /* skip */ }
        }
      }
    }
  } catch (e) {
    addEventLog('ERROR', `Simulation failed: ${e.message}`, true);
  }
}

function handleEvent(event, container) {
  const { phase, progress, message, round, total, path_count, agent_count, engine } = event;
  
  // Update progress bar
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill && label) {
    fill.style.width = `${progress}%`;
    label.style.left = `${progress}%`;
    label.textContent = `${progress}%`;
  }

  // Update metrics
  const mp = document.getElementById('metric-progress');
  if (mp) mp.textContent = `${progress}%`;

  // Add to event log
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });
  addEventLog(now, message, phase === 'completed');

  // Animate tree nodes based on progress
  animateTree(progress);

  // Update state label
  const stateLabel = document.getElementById('state-label');
  if (stateLabel) {
    if (phase === 'init') stateLabel.textContent = engine === 'llm' ? '⚡ AI_ENGINE' : 'MOCK_ENGINE';
    else if (phase === 'parameter_expansion') stateLabel.textContent = 'AI_EXPAND';
    else if (phase === 'agent_generation') stateLabel.textContent = 'AGENT_GEN';
    else if (phase === 'graph_building') stateLabel.textContent = 'GRAPH_BUILD';
    else if (phase === 'simulating') stateLabel.textContent = `SIM ${round || ''}/${total || ''}`;
    else if (phase === 'generating_paths') stateLabel.textContent = 'PATH_GEN';
    else if (phase === 'fallback') stateLabel.textContent = 'FALLBACK';
    else if (phase === 'completed') {
      stateLabel.textContent = engine === 'llm' ? '✅ AI_COMPLETE' : 'COMPLETE';
      const dot = document.getElementById('status-dot');
      if (dot) { dot.classList.remove('pulse'); dot.classList.add('status-stable'); }
      const mp2 = document.getElementById('metric-paths');
      if (mp2) mp2.textContent = path_count || 0;
      
      // Mark simulation as complete to prevent re-run
      state.simComplete = true;
      
      // Navigate to graph page for LLM mode, results for mock
      const nextPage = (engine === 'llm' && agent_count > 0) ? 'graph' : 'results';
      setTimeout(() => navigateTo(nextPage), 1500);
    }
  }
}

function addEventLog(timestamp, message, isHighlight = false) {
  const log = document.getElementById('event-log');
  if (!log) return;
  
  // Remove latest highlight from previous
  log.querySelectorAll('.console-latest').forEach(el => el.classList.remove('console-latest'));
  
  const div = document.createElement('div');
  div.className = `console-line ${isHighlight ? 'console-latest' : ''}`;
  div.innerHTML = `
    <span class="console-ts">[${timestamp}]</span>
    <span ${isHighlight ? 'style="font-weight:700;color:var(--accent);"' : ''}>${message}</span>
  `;
  log.prepend(div);
}

function animateTree(progress) {
  if (progress >= 15) {
    setOpacity('node-l1a', 1); setOpacity('node-l1b', 1);
  }
  if (progress >= 35) {
    setOpacity('line-l2a', 1); setOpacity('line-l2b', 1);
    setOpacity('node-active', 1); setOpacity('node-pruned', 1);
  }
  if (progress >= 55) {
    setOpacity('line-l2c', 1); setOpacity('line-l2d', 1);
    setOpacity('node-l2c', 1); setOpacity('node-l2d', 1);
  }
  if (progress >= 85) {
    const label = document.getElementById('active-label');
    if (label) label.textContent = 'CONVERGED';
  }
}

function setOpacity(id, val) {
  const el = document.getElementById(id);
  if (el) el.style.opacity = val;
}
