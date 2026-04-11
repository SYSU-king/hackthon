/**
 * Simulation Process Page — Dynamic tree visualization from SSE events
 * 
 * Architecture: Tree-based branching visualization.
 * - Root node at top, branches grow downward
 * - Branch nodes are diamonds, regular nodes are rectangles
 * - Click any node to see details in a tooltip (positioned using SVG coords)
 * - Auto-scroll/zoom to fit all nodes
 * - After completion: tab bar to switch between Tree View and Results
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';
import { t } from '../i18n.js';

/** Internal tree data */
let _treeNodes = [];  // {id, parent, label, x, y, round, time_label, type, tendency, isBranch}
let _treeEdges = [];
let _selectedTreeNode = null;
let _activeTab = 'tree'; // 'tree' or 'actions'

export function renderSimulation(container) {
  // ── If project is already completed, show tabbed view ──
  if (state.simComplete || state.project?.status === 'completed') {
    renderCompletedWithTabs(container);
    return;
  }

  container.innerHTML = `
    <div class="sim-layout">
      <!-- Canvas: Dynamic Tree Visualization -->
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${t('sim_viewport')}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${t('sim_tree_title')}: Session-${state.projectId?.slice(0, 4) || 'X'}
          </h1>
        </div>
        <div class="sim-tree-container" id="tree-container">
          <svg id="tree-svg" width="100%" height="100%"></svg>
        </div>
        <!-- Node detail tooltip (overlay on canvas) -->
        <div class="tree-node-tooltip" id="tree-node-tooltip" style="display:none;"></div>
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
            <div><span style="opacity:0.6;display:block;">${t('sim_branches')}</span><span id="metric-branches">1</span></div>
            <div><span style="opacity:0.6;display:block;">${t('sim_round')}</span><span id="metric-round">0</span></div>
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

  _treeNodes = [];
  _treeEdges = [];
  _selectedTreeNode = null;
  initTreeSVG();
  startSim(container);
}

/**
 * Render completed state with tabs: Tree View + Actions
 */
function renderCompletedWithTabs(container) {
  container.innerHTML = `
    <div class="sim-completed-tabbed">
      <!-- Tab Bar -->
      <div class="sim-tab-bar">
        <button class="sim-tab ${_activeTab === 'tree' ? 'sim-tab-active' : ''}" data-tab="tree">
          <span class="material-symbols-outlined icon-sm">account_tree</span>
          ${t('sim_tab_tree') || '推演树'}
        </button>
        <button class="sim-tab ${_activeTab === 'actions' ? 'sim-tab-active' : ''}" data-tab="actions">
          <span class="material-symbols-outlined icon-sm">dashboard</span>
          ${t('sim_tab_actions') || '结果导航'}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="sim-tab-content" id="sim-tab-content"></div>
    </div>
  `;

  // Bind tab clicks
  container.querySelectorAll('.sim-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _activeTab = tab.dataset.tab;
      renderCompletedWithTabs(container);
    });
  });

  const tabContent = document.getElementById('sim-tab-content');

  if (_activeTab === 'tree') {
    renderTreeTab(tabContent);
  } else {
    renderActionsTab(tabContent);
  }
}

/**
 * Render the Tree tab — loads tree events from the backend and rebuilds the tree
 */
async function renderTreeTab(tabContent) {
  tabContent.innerHTML = `
    <div class="sim-layout" style="height:calc(100vh - var(--topnav-h) - 56px);">
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${t('sim_viewport')}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${t('sim_tree_title')}: Session-${state.projectId?.slice(0, 4) || 'X'}
          </h1>
          <div class="mono-xs text-accent" style="margin-top:8px;">
            <span class="material-symbols-outlined icon-sm" style="font-size:14px;vertical-align:text-bottom;">check_circle</span>
            ${t('sim_completed_view') || '推演已完成'} · ${t('sim_tree_readonly') || '只读模式'}
          </div>
        </div>
        <div class="sim-tree-container" id="tree-container">
          <svg id="tree-svg" width="100%" height="100%"></svg>
        </div>
        <div class="tree-node-tooltip" id="tree-node-tooltip" style="display:none;"></div>
      </section>

      <!-- Summary sidebar -->
      <aside class="sim-panel">
        <div class="sim-panel-header">
          <div class="flex items-center justify-between mb-4">
            <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;text-transform:uppercase;">${t('sim_tree_summary') || '推演摘要'}</span>
            <span class="status-dot status-stable"></span>
          </div>
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${state.projectId?.slice(0, 4) || '0000'}</div>
        </div>
        <div class="sim-panel-body" id="tree-summary-panel">
          <div class="console-line pulse">
            <span class="console-ts">[LOAD]</span>
            <span>正在加载推演树数据...</span>
          </div>
        </div>
        <div style="padding:16px;background:var(--primary);color:var(--white);">
          <div class="flex items-center gap-8 mb-8">
            <span class="material-symbols-outlined icon-sm">info</span>
            <span class="mono-xs">${t('sim_metrics')}</span>
          </div>
          <div class="grid-2 gap-16" style="font-family:var(--font-mono);font-size:10px;">
            <div><span style="opacity:0.6;display:block;">${t('sim_progress')}</span><span id="metric-progress">100%</span></div>
            <div><span style="opacity:0.6;display:block;">${t('sim_paths')}</span><span id="metric-paths">—</span></div>
            <div><span style="opacity:0.6;display:block;">${t('sim_branches')}</span><span id="metric-branches">—</span></div>
            <div><span style="opacity:0.6;display:block;">NODES</span><span id="metric-nodes">—</span></div>
          </div>
        </div>
      </aside>
    </div>
  `;

  _treeNodes = [];
  _treeEdges = [];
  _selectedTreeNode = null;
  initTreeSVG();

  // Load tree events from API
  try {
    const data = await api.getTreeEvents(state.projectId);
    const events = data.events || [];

    if (events.length === 0) {
      document.getElementById('tree-summary-panel').innerHTML = `
        <div class="console-line">
          <span class="console-ts">[INFO]</span>
          <span style="color:var(--outline);">暂无推演树数据</span>
        </div>
      `;
      return;
    }

    // Replay tree events
    for (const evt of events) {
      handleTreeEvent(evt);
    }

    // Update metrics
    const branchCount = _treeNodes.filter(n => n.isBranch).length;
    const mb = document.getElementById('metric-branches');
    if (mb) mb.textContent = branchCount || 1;
    const mn = document.getElementById('metric-nodes');
    if (mn) mn.textContent = _treeNodes.length;

    // Build summary
    const summaryPanel = document.getElementById('tree-summary-panel');
    if (summaryPanel) {
      summaryPanel.innerHTML = `
        <div class="console-line" style="border-left:2px solid var(--accent);padding-left:12px;margin-bottom:4px;">
          <span class="console-ts" style="color:var(--accent);">[DONE]</span>
          <span style="font-weight:700;color:var(--accent);">推演完成，共 ${_treeNodes.length} 个节点</span>
        </div>
        ${_treeNodes.slice(0, 20).map(n => `
          <div class="console-line" style="cursor:pointer;" data-node-id="${n.id}">
            <span class="console-ts">[R${n.round}]</span>
            <span>${n.isBranch ? '🔶' : '⚫'} ${n.label || '—'}</span>
          </div>
        `).join('')}
        ${_treeNodes.length > 20 ? `
          <div class="console-line">
            <span class="console-ts">[...]</span>
            <span style="color:var(--outline);">还有 ${_treeNodes.length - 20} 个节点</span>
          </div>
        ` : ''}
      `;

      // Click to highlight node on tree
      summaryPanel.querySelectorAll('[data-node-id]').forEach(el => {
        el.addEventListener('click', () => {
          const nodeId = el.dataset.nodeId;
          const node = _treeNodes.find(n => n.id === nodeId);
          if (node) {
            showTreeNodeTooltipAtNode(node);
          }
        });
      });
    }
  } catch (e) {
    document.getElementById('tree-summary-panel').innerHTML = `
      <div class="console-line">
        <span class="console-ts">[ERR]</span>
        <span style="color:var(--error);">加载失败: ${e.message}</span>
      </div>
    `;
  }
}

/**
 * Render the actions/navigation tab
 */
function renderActionsTab(tabContent) {
  tabContent.innerHTML = `
    <div style="min-height:calc(100vh - var(--topnav-h) - 56px);display:flex;align-items:center;justify-content:center;">
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

  document.getElementById('btn-resim')?.addEventListener('click', async () => {
    // Force re-simulation via the dedicated re-simulate endpoint
    state.simComplete = false;
    if (state.project) state.project.status = 'simulating';
    _activeTab = 'tree';
    navigateTo('simulation');
  });
}

// ═══════════════════════════════════════════════════════════════════
// SSE Simulation Stream
// ═══════════════════════════════════════════════════════════════════

async function startSim(container) {
  const config = state.simConfig || { rounds: 12, timeUnit: 'quarter', agentCount: 6 };

  try {
    const resp = await api.startSimulation(
      state.projectId,
      config.rounds,
      config.timeUnit,
      config.agentCount || 6
    );
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
            handleSSEEvent(event, container);
          } catch (e) { /* skip */ }
        }
      }
    }
  } catch (e) {
    addEventLog('ERROR', `Simulation failed: ${e.message}`, true);
  }
}

function handleSSEEvent(event, container) {
  const { phase, progress, message, round, total, path_count, agent_count, engine, tree_event } = event;

  // Update progress bar
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill && label && progress !== undefined) {
    fill.style.width = `${progress}%`;
    label.style.left = `${progress}%`;
    label.textContent = `${progress}%`;
  }

  // Update metrics
  const mp = document.getElementById('metric-progress');
  if (mp && progress !== undefined) mp.textContent = `${progress}%`;

  // ── Handle tree events (the core new feature) ──
  if (phase === 'tree_event' && tree_event) {
    handleTreeEvent(tree_event);
    return;  // don't log tree events to the console
  }

  // Add to event log
  if (message) {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    addEventLog(now, message, phase === 'completed' || phase === 'branch');
  }

  // Update live branches count
  if (phase === 'branch') {
    const mb = document.getElementById('metric-branches');
    if (mb) {
      const cur = parseInt(mb.textContent) || 1;
      mb.textContent = cur + 1;
    }
  }

  // Update round counter
  if (phase === 'simulating') {
    const mr = document.getElementById('metric-round');
    if (mr && message) {
      const m = message.match(/第 (\d+)/);
      if (m) mr.textContent = m[1];
    }
  }

  // Update state label
  const stateLabel = document.getElementById('state-label');
  if (stateLabel) {
    if (phase === 'init') stateLabel.textContent = '⚡ AI_ENGINE';
    else if (phase === 'parameter_expansion') stateLabel.textContent = 'AI_EXPAND';
    else if (phase === 'agent_generation') stateLabel.textContent = 'AGENT_GEN';
    else if (phase === 'graph_building') stateLabel.textContent = 'GRAPH_BUILD';
    else if (phase === 'simulating') stateLabel.textContent = 'SIM_ACTIVE';
    else if (phase === 'branch') stateLabel.textContent = '🌿 BRANCH';
    else if (phase === 'generating_paths') stateLabel.textContent = 'PATH_GEN';
    else if (phase === 'error') {
      stateLabel.textContent = '❌ ERROR';
      const dot = document.getElementById('status-dot');
      if (dot) { dot.classList.remove('pulse'); dot.classList.add('status-error'); }
    }
    else if (phase === 'completed') {
      stateLabel.textContent = '✅ AI_COMPLETE';
      const dot = document.getElementById('status-dot');
      if (dot) { dot.classList.remove('pulse'); dot.classList.add('status-stable'); }
      const mp2 = document.getElementById('metric-paths');
      if (mp2) mp2.textContent = path_count || 0;

      // Mark simulation as complete
      state.simComplete = true;

      // Always navigate to graph (only AI engine is supported)
      const nextPage = agent_count > 0 ? 'graph' : 'results';
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


// ═══════════════════════════════════════════════════════════════════
// Dynamic Tree SVG Rendering
// ═══════════════════════════════════════════════════════════════════

const NODE_COLORS = {
  decision: '#FF4500',
  opportunity: '#2E7D32',
  result: '#555',
  cascade: '#1565C0',
  risk: '#BA1A1A',
  reflection: '#777',
  branch: '#FF4500',
  default: '#444',
};

const TENDENCY_COLORS = {
  optimal: '#2E7D32',
  conservative: '#555',
  risk: '#FF4500',
  balanced: '#1565C0',
  counterfactual: '#9C27B0',
};

function initTreeSVG() {
  const svg = document.getElementById('tree-svg');
  if (!svg) return;
  const wrap = document.getElementById('tree-container');
  const w = wrap?.clientWidth || 800;
  const h = wrap?.clientHeight || 600;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  // Add defs
  svg.innerHTML = `
    <defs>
      <filter id="tree-glow"><feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g id="tree-edges"></g>
    <g id="tree-nodes"></g>
  `;
}

function handleTreeEvent(evt) {
  if (evt.type === 'add_node') {
    addTreeNode(evt);
  } else if (evt.type === 'branch') {
    addBranchNode(evt);
  }
  layoutAndRender();
}

function addTreeNode(evt) {
  // Prevent duplicates
  if (_treeNodes.find(n => n.id === evt.id)) return;

  // Validate parent exists. If parent doesn't exist, try to find closest match.
  let parentId = evt.parent;
  if (parentId && !_treeNodes.find(n => n.id === parentId)) {
    // Try partial match (sometimes IDs get prefixed)
    const partialMatch = _treeNodes.find(n => parentId.startsWith(n.id) || n.id.startsWith(parentId));
    if (partialMatch) {
      parentId = partialMatch.id;
    } else {
      // Attach to the last node in the same branch or root
      const root = _treeNodes.find(n => !n.parent);
      parentId = root ? root.id : null;
    }
  }

  _treeNodes.push({
    id: evt.id,
    parent: parentId,
    label: evt.label || '',
    round: evt.round || 0,
    time_label: evt.time_label || '',
    type: evt.node_type || 'result',
    isBranch: false,
    tendency: '',
  });
}

function addBranchNode(evt) {
  // Prevent duplicates
  if (_treeNodes.find(n => n.id === evt.id)) return;

  // Validate parent
  let parentId = evt.parent;
  if (parentId && !_treeNodes.find(n => n.id === parentId)) {
    // Try partial match
    const partialMatch = _treeNodes.find(n => parentId.startsWith(n.id) || n.id.startsWith(parentId));
    if (partialMatch) {
      parentId = partialMatch.id;
    } else {
      // Find closest existing node by round
      const closest = _treeNodes
        .filter(n => n.round <= (evt.round || 0))
        .sort((a, b) => b.round - a.round);
      parentId = closest.length > 0 ? closest[0].id : (_treeNodes[0]?.id || null);
    }
  }

  _treeNodes.push({
    id: evt.id,
    parent: parentId,
    label: evt.label || '',
    round: evt.round || 0,
    time_label: evt.time_label || '',
    type: 'branch',
    isBranch: true,
    tendency: evt.tendency || 'balanced',
  });
}

function layoutAndRender() {
  const svg = document.getElementById('tree-svg');
  if (!svg) return;

  const wrap = document.getElementById('tree-container');
  const W = wrap?.clientWidth || 800;
  const H = wrap?.clientHeight || 600;

  // Build adjacency
  const childMap = {};   // parent_id -> [child nodes]
  const nodeMap = {};
  for (const n of _treeNodes) {
    nodeMap[n.id] = n;
    if (n.parent) {
      (childMap[n.parent] = childMap[n.parent] || []).push(n);
    }
  }

  // Find all root nodes (nodes without parents or with null parents)
  const roots = _treeNodes.filter(n => !n.parent || !nodeMap[n.parent]);
  if (roots.length === 0) return;

  // Use primary root (first root) for layout
  const root = roots[0];

  // Layout: top-down tree
  const MARGIN_TOP = 80;
  const ROW_H = 70;
  const MIN_COL_W = 140;

  // Count leaves for each subtree
  function leafCount(id) {
    const ch = childMap[id] || [];
    if (ch.length === 0) return 1;
    return ch.reduce((s, c) => s + leafCount(c.id), 0);
  }

  // Find max depth for dynamic sizing
  function maxDepth(id, depth = 0) {
    const ch = childMap[id] || [];
    if (ch.length === 0) return depth;
    return Math.max(...ch.map(c => maxDepth(c.id, depth + 1)));
  }

  const totalDepth = maxDepth(root.id);
  const totalLeaves = leafCount(root.id);

  // Compute required canvas size
  const requiredW = Math.max(W, totalLeaves * MIN_COL_W + 80);
  const requiredH = Math.max(H, MARGIN_TOP + (totalDepth + 1) * ROW_H + 60);

  svg.setAttribute('viewBox', `0 0 ${requiredW} ${requiredH}`);

  // Assign positions via recursive layout
  function layout(nodeId, x, width, depth) {
    const n = nodeMap[nodeId];
    if (!n) return;
    n.x = x + width / 2;
    n.y = MARGIN_TOP + depth * ROW_H;

    const ch = childMap[nodeId] || [];
    if (ch.length === 0) return;

    const totalLeavesLocal = ch.reduce((s, c) => s + leafCount(c.id), 0);
    let cx = x;
    for (const child of ch) {
      const cLeaves = leafCount(child.id);
      const cWidth = (cLeaves / totalLeavesLocal) * width;
      layout(child.id, cx, Math.max(cWidth, MIN_COL_W), depth + 1);
      cx += cWidth;
    }
  }

  layout(root.id, 40, requiredW - 80, 0);

  // Also layout any orphan root nodes (e.g., backtracking branches)
  let orphanOffset = 0;
  for (const r of roots) {
    if (r.id !== root.id) {
      const orphanDepth = maxDepth(r.id);
      const orphanLeaves = leafCount(r.id);
      const orphanW = Math.max(300, orphanLeaves * MIN_COL_W);
      const startX = requiredW + orphanOffset;
      layout(r.id, startX, orphanW, 0);
      orphanOffset += orphanW + 40;
    }
  }

  // Edges
  _treeEdges = [];
  for (const n of _treeNodes) {
    if (n.parent && nodeMap[n.parent]) {
      _treeEdges.push({ from: nodeMap[n.parent], to: n });
    }
  }

  // Render
  const NS = 'http://www.w3.org/2000/svg';
  const edgesG = svg.querySelector('#tree-edges');
  const nodesG = svg.querySelector('#tree-nodes');
  edgesG.innerHTML = '';
  nodesG.innerHTML = '';

  // Draw edges
  for (const e of _treeEdges) {
    if (e.from.x === undefined || e.to.x === undefined) continue;
    const line = document.createElementNS(NS, 'path');
    const x1 = e.from.x, y1 = e.from.y, x2 = e.to.x, y2 = e.to.y;
    const midY = (y1 + y2) / 2;
    line.setAttribute('d', `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`);
    line.setAttribute('stroke', e.to.isBranch ? (TENDENCY_COLORS[e.to.tendency] || '#FF4500') : '#666');
    line.setAttribute('stroke-width', e.to.isBranch ? '2.5' : '1.5');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke-opacity', '0.6');
    if (e.to.isBranch) {
      line.setAttribute('stroke-dasharray', '6,3');
    }
    // Animate in
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.5s';
    edgesG.appendChild(line);
    requestAnimationFrame(() => { line.style.opacity = '1'; });
  }

  // Draw nodes
  for (const n of _treeNodes) {
    if (n.x === undefined) continue;

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('data-node-id', n.id);
    g.style.opacity = '0';
    g.style.transition = 'opacity 0.4s';
    g.style.cursor = 'pointer';

    const color = n.isBranch
      ? (TENDENCY_COLORS[n.tendency] || '#FF4500')
      : (NODE_COLORS[n.type] || NODE_COLORS.default);

    if (n.isBranch) {
      // Branch nodes: diamond shape
      const diamond = document.createElementNS(NS, 'polygon');
      const s = 14;
      diamond.setAttribute('points', `${n.x},${n.y-s} ${n.x+s},${n.y} ${n.x},${n.y+s} ${n.x-s},${n.y}`);
      diamond.setAttribute('fill', color);
      diamond.setAttribute('filter', 'url(#tree-glow)');
      g.appendChild(diamond);
    } else if (!n.parent) {
      // Root node: rectangle
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', n.x - 45);
      rect.setAttribute('y', n.y - 14);
      rect.setAttribute('width', 90);
      rect.setAttribute('height', 28);
      rect.setAttribute('fill', '#000');
      g.appendChild(rect);
    } else {
      // Regular node: rectangle with colored left border
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', n.x - 50);
      rect.setAttribute('y', n.y - 14);
      rect.setAttribute('width', 100);
      rect.setAttribute('height', 28);
      rect.setAttribute('fill', '#F3F3F3');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '1');
      g.appendChild(rect);
      // Color bar
      const bar = document.createElementNS(NS, 'rect');
      bar.setAttribute('x', n.x - 50);
      bar.setAttribute('y', n.y - 14);
      bar.setAttribute('width', 4);
      bar.setAttribute('height', 28);
      bar.setAttribute('fill', color);
      g.appendChild(bar);
    }

    // Label
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', !n.parent ? '#fff' : '#333');
    text.setAttribute('font-family', 'Space Grotesk');
    text.setAttribute('font-size', !n.parent ? '10' : '9');
    text.setAttribute('font-weight', n.isBranch ? 'bold' : 'normal');
    text.textContent = (n.label || '').slice(0, 14);
    g.appendChild(text);

    // Time label below
    if (n.time_label && n.parent) {
      const tl = document.createElementNS(NS, 'text');
      tl.setAttribute('x', n.x);
      tl.setAttribute('y', n.y + 24);
      tl.setAttribute('text-anchor', 'middle');
      tl.setAttribute('fill', '#999');
      tl.setAttribute('font-family', 'Space Grotesk');
      tl.setAttribute('font-size', '8');
      tl.textContent = n.time_label;
      g.appendChild(tl);
    }

    // Click handler for node detail — FIXED: use SVG node position instead of mouse event
    g.addEventListener('click', (evt) => {
      evt.stopPropagation();
      showTreeNodeTooltipAtNode(n);
    });

    nodesG.appendChild(g);

    // Animate in
    requestAnimationFrame(() => { g.style.opacity = '1'; });
  }

  // Click anywhere else to dismiss tooltip
  svg.onclick = () => {
    hideTreeNodeTooltip();
  };
}


/**
 * Show a tooltip positioned relative to the tree node's SVG coordinates.
 * This fixes the position bug — we now use the node's x,y and convert
 * from SVG coordinate space to the container's pixel space.
 */
function showTreeNodeTooltipAtNode(node) {
  const tooltip = document.getElementById('tree-node-tooltip');
  if (!tooltip) return;

  _selectedTreeNode = node;

  const typeLabels = {
    decision: '🔴 决策节点',
    opportunity: '🟢 机会节点',
    result: '⚫ 结果节点',
    cascade: '🔵 连锁节点',
    risk: '🟥 风险节点',
    reflection: '⬜ 反思节点',
    branch: '🔶 分支起点',
  };

  const tendencyLabels = {
    optimal: '最优路径',
    conservative: '稳健路径',
    risk: '冒险路径',
    balanced: '平衡路径',
    counterfactual: '反事实路径',
  };

  // FIXED: Convert from SVG coordinates to container pixel coordinates
  const container = document.getElementById('tree-container');
  const svgEl = document.getElementById('tree-svg');
  if (!container || !svgEl || node.x === undefined) return;

  const containerRect = container.getBoundingClientRect();
  const svgRect = svgEl.getBoundingClientRect();

  // Get the SVG viewBox to compute the scale factor
  const viewBox = svgEl.getAttribute('viewBox');
  if (!viewBox) return;
  const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number);

  // Scale from SVG viewBox coords to screen pixels
  const scaleX = svgRect.width / vbW;
  const scaleY = svgRect.height / vbH;

  // Convert node position to pixel position relative to the container
  let x = (node.x - vbX) * scaleX + (svgRect.left - containerRect.left) + 16;
  let y = (node.y - vbY) * scaleY + (svgRect.top - containerRect.top) - 10;

  // Prevent overflow
  const tooltipW = 260;
  const tooltipH = 160;
  if (x + tooltipW > containerRect.width) x = x - tooltipW - 32;
  if (y + tooltipH > containerRect.height) y = containerRect.height - tooltipH - 10;
  if (x < 0) x = 10;
  if (y < 0) y = 10;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.display = 'block';

  tooltip.innerHTML = `
    <div class="tree-tooltip-header">
      <span>${typeLabels[node.type] || node.type}</span>
      <button class="tree-tooltip-close" id="tooltip-close">✕</button>
    </div>
    <div class="tree-tooltip-title">${node.label || '—'}</div>
    ${node.time_label ? `<div class="tree-tooltip-time">${node.time_label} · Round ${node.round}</div>` : ''}
    ${node.isBranch && node.tendency ? `<div class="tree-tooltip-tendency" style="color:${TENDENCY_COLORS[node.tendency] || '#666'};">${tendencyLabels[node.tendency] || node.tendency}</div>` : ''}
  `;

  document.getElementById('tooltip-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideTreeNodeTooltip();
  });
}

function hideTreeNodeTooltip() {
  const tooltip = document.getElementById('tree-node-tooltip');
  if (tooltip) tooltip.style.display = 'none';
  _selectedTreeNode = null;
}
