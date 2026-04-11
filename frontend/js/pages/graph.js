/**
 * Graph Page — Interactive knowledge graph visualization
 * Features: SVG force-directed layout, draggable nodes, click detail, zoom/pan
 */
import { api } from '../api.js';
import { navigateTo } from '../app.js';
import { t } from '../i18n.js';

let _simNodes = [];
let _simEdges = [];
let _dragNode = null;
let _dragOffset = { x: 0, y: 0 };
let _selectedNodeId = null;

export function renderGraph(container) {
  const projectId = window.appState.projectId;

  container.innerHTML = `
    <div class="page-graph">
      <header class="page-header">
        <div class="page-header-left">
          <button class="btn btn-ghost" onclick="navigateTo('results')" style="padding:8px 16px;">
            <span class="material-symbols-outlined icon-sm">arrow_back</span> ${t('btn_back')}
          </button>
        </div>
        <div class="page-header-center">
          <h1 class="mono-sm">${t('graph_title')}</h1>
        </div>
        <div class="page-header-right">
          <span class="mono-xs muted" id="graph-stats"></span>
        </div>
      </header>

      <div class="graph-layout">
        <div class="graph-canvas-wrap" id="graph-canvas-wrap">
          <svg id="graph-svg" width="100%" height="100%"></svg>
          <div class="graph-legend" id="graph-legend"></div>
          <div class="graph-hint mono-xs" id="graph-hint">
            <span class="material-symbols-outlined icon-sm">pan_tool</span>
            拖拽节点 · 点击查看详情
          </div>
        </div>
        <aside class="graph-sidebar" id="graph-sidebar">
          <div class="panel">
            <h3 class="mono-xs panel-title">${t('graph_agents')}</h3>
            <div id="agents-list" class="agents-list"></div>
          </div>
          <div class="panel" id="node-detail-panel" style="display:none">
            <h3 class="mono-xs panel-title">${t('graph_node_detail')}</h3>
            <div id="node-detail"></div>
          </div>
        </aside>
      </div>

      <div class="page-actions">
        <button class="btn btn-accent" onclick="navigateTo('results')">
          ${t('btn_view_report')} <span class="material-symbols-outlined icon-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `;

  if (projectId) {
    loadGraphData(projectId);
  }
}


async function loadGraphData(projectId) {
  try {
    const [graphData, agentsData] = await Promise.all([
      api.getGraph(projectId),
      api.getAgents(projectId),
    ]);

    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];
    const agents = agentsData.agents || [];

    document.getElementById('graph-stats').textContent =
      `NODES: ${nodes.length} | EDGES: ${edges.length} | AGENTS: ${agents.length}`;

    renderAgentsList(agents);
    renderForceGraph(nodes, edges);
    renderLegend(nodes);

  } catch (err) {
    document.getElementById('graph-stats').textContent = t('graph_load_error');
    console.error('Graph load error:', err);
  }
}


function renderAgentsList(agents) {
  const container = document.getElementById('agents-list');
  if (!agents.length) {
    container.innerHTML = `<p class="muted mono-xs">${t('graph_no_agents')}</p>`;
    return;
  }

  const typeIcons = {
    Self: 'person', Family: 'family_restroom', Mentor: 'school',
    Partner: 'favorite', School: 'domain', Employer: 'business',
    City: 'location_city', Industry: 'trending_up', Risk: 'warning',
  };

  const typeColors = getTypeColors();

  container.innerHTML = agents.map(a => `
    <div class="agent-card" data-agent-type="${a.agent_type}" style="border-left: 3px solid ${typeColors[a.agent_type] || '#666'}">
      <div class="agent-card-header">
        <span class="material-symbols-outlined icon-sm" style="color:${typeColors[a.agent_type] || '#666'}">${typeIcons[a.agent_type] || 'smart_toy'}</span>
        <strong class="mono-xs">${a.name || a.agent_type}</strong>
        <span class="badge badge-sm">${a.agent_type}</span>
      </div>
      <p class="agent-persona">${a.persona || ''}</p>
      ${a.stance ? `<div class="mono-xs muted">STANCE: ${a.stance} | INFLUENCE: ${(a.influence * 100).toFixed(0)}%</div>` : ''}
    </div>
  `).join('');

  // Click agent card to highlight corresponding graph node
  container.querySelectorAll('.agent-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.agentType;
      const node = _simNodes.find(n => n.type === type);
      if (node) {
        highlightNode(node.id);
        showNodeDetail(node);
      }
    });
  });
}


function getTypeColors() {
  return {
    Self: '#c9a0ff', Factor: '#556677', Family: '#ff9eb1',
    Mentor: '#7ecfff', School: '#ffd17e', Employer: '#7eff9e',
    City: '#ff7eb3', Industry: '#b4ff7e', Risk: '#ff7e7e',
    Partner: '#ffb07e', Person: '#888',
  };
}


function renderForceGraph(nodes, edges) {
  const svg = document.getElementById('graph-svg');
  const wrap = document.getElementById('graph-canvas-wrap');
  const width = wrap.clientWidth || 800;
  const height = wrap.clientHeight || 600;

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = '';

  if (!nodes.length) {
    svg.innerHTML = `<text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#666" font-family="monospace">${t('graph_no_data')}</text>`;
    return;
  }

  // Initialize node positions
  _simNodes = nodes.map((n, i) => ({
    ...n,
    x: width / 2 + (Math.random() - 0.5) * 400,
    y: height / 2 + (Math.random() - 0.5) * 300,
    vx: 0, vy: 0,
    idx: i,
  }));

  const nodeMap = {};
  _simNodes.forEach(n => nodeMap[n.id] = n);

  _simEdges = edges.filter(e => nodeMap[e.source] && nodeMap[e.target]).map(e => ({
    ...e,
    sourceNode: nodeMap[e.source],
    targetNode: nodeMap[e.target],
  }));

  // Run initial force simulation (200 ticks to settle)
  runForceSimulation(width, height, 200);

  // Render to SVG DOM nodes (not innerHTML — for interactivity)
  buildSVGElements(svg, width, height);
}


function runForceSimulation(width, height, ticks) {
  for (let tick = 0; tick < ticks; tick++) {
    // Repulsion
    for (let i = 0; i < _simNodes.length; i++) {
      for (let j = i + 1; j < _simNodes.length; j++) {
        const a = _simNodes[i], b = _simNodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let force = 4000 / (dist * dist);
        a.vx -= dx / dist * force;
        a.vy -= dy / dist * force;
        b.vx += dx / dist * force;
        b.vy += dy / dist * force;
      }
    }
    // Attraction (edges)
    for (const e of _simEdges) {
      const a = e.sourceNode, b = e.targetNode;
      let dx = b.x - a.x, dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let force = (dist - 140) * 0.008;
      a.vx += dx / dist * force;
      a.vy += dy / dist * force;
      b.vx -= dx / dist * force;
      b.vy -= dy / dist * force;
    }
    // Center gravity
    for (const n of _simNodes) {
      n.vx += (width / 2 - n.x) * 0.002;
      n.vy += (height / 2 - n.y) * 0.002;
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.max(50, Math.min(width - 50, n.x));
      n.y = Math.max(50, Math.min(height - 50, n.y));
    }
  }
}


function buildSVGElements(svg, width, height) {
  const typeColors = getTypeColors();

  // Create SVG namespace helper
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs = {}) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  // Defs (glow filter)
  const defs = el('defs');
  defs.innerHTML = `
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-strong"><feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  `;
  svg.appendChild(defs);

  // Edges group
  const edgesG = el('g', { class: 'graph-edges' });
  for (const e of _simEdges) {
    const line = el('line', {
      x1: e.sourceNode.x, y1: e.sourceNode.y,
      x2: e.targetNode.x, y2: e.targetNode.y,
      stroke: '#334', 'stroke-width': '1', 'stroke-opacity': '0.4',
      'data-source': e.sourceNode.id, 'data-target': e.targetNode.id,
    });
    edgesG.appendChild(line);
  }
  svg.appendChild(edgesG);

  // Nodes group
  const nodesG = el('g', { class: 'graph-nodes' });
  for (const n of _simNodes) {
    const color = typeColors[n.type] || '#666';
    const r = n.size || 14;

    const g = el('g', {
      class: 'graph-node',
      'data-id': n.id,
      style: 'cursor:grab;',
    });

    // Outer glow ring (for hover)
    const ring = el('circle', {
      cx: n.x, cy: n.y, r: r + 6,
      fill: 'none', stroke: color, 'stroke-width': '0', 'stroke-opacity': '0.3',
      class: 'node-ring',
    });
    g.appendChild(ring);

    // Main circle
    const circle = el('circle', {
      cx: n.x, cy: n.y, r: r,
      fill: color, 'fill-opacity': '0.85',
      stroke: color, 'stroke-width': '2', 'stroke-opacity': '0.3',
      filter: 'url(#glow)',
    });
    g.appendChild(circle);

    // Label
    const label = n.name.length > 10 ? n.name.slice(0, 10) + '…' : n.name;
    const text = el('text', {
      x: n.x, y: n.y + r + 16,
      'text-anchor': 'middle', fill: '#bbb', 'font-size': '11',
      'font-family': "'Inter',sans-serif", 'pointer-events': 'none',
    });
    text.textContent = label;
    g.appendChild(text);

    nodesG.appendChild(g);

    // ── Drag handlers ──
    g.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      _dragNode = n;
      g.style.cursor = 'grabbing';
      const pt = svgPoint(svg, evt.clientX, evt.clientY);
      _dragOffset = { x: pt.x - n.x, y: pt.y - n.y };

      // Hide hint
      const hint = document.getElementById('graph-hint');
      if (hint) hint.style.display = 'none';
    });

    // ── Click handler ──
    g.addEventListener('click', (evt) => {
      // Only trigger if not dragging
      if (!_wasDragged) {
        highlightNode(n.id);
        showNodeDetail(n);
      }
      _wasDragged = false;
    });
  }
  svg.appendChild(nodesG);

  // ── SVG-level mouse handlers for drag ──
  let _wasDragged = false;

  svg.addEventListener('mousemove', (evt) => {
    if (!_dragNode) return;
    _wasDragged = true;
    const pt = svgPoint(svg, evt.clientX, evt.clientY);
    _dragNode.x = pt.x - _dragOffset.x;
    _dragNode.y = pt.y - _dragOffset.y;

    // Clamp
    _dragNode.x = Math.max(20, Math.min(width - 20, _dragNode.x));
    _dragNode.y = Math.max(20, Math.min(height - 20, _dragNode.y));

    updateNodePosition(_dragNode, svg);
  });

  svg.addEventListener('mouseup', () => {
    if (_dragNode) {
      const g = svg.querySelector(`.graph-node[data-id="${_dragNode.id}"]`);
      if (g) g.style.cursor = 'grab';
      _dragNode = null;
    }
  });

  svg.addEventListener('mouseleave', () => {
    _dragNode = null;
  });

  // Touch support for mobile
  svg.addEventListener('touchstart', (evt) => {
    const touch = evt.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const nodeG = target?.closest('.graph-node');
    if (nodeG) {
      evt.preventDefault();
      const id = nodeG.dataset.id;
      _dragNode = _simNodes.find(n => n.id === id);
      if (_dragNode) {
        const pt = svgPoint(svg, touch.clientX, touch.clientY);
        _dragOffset = { x: pt.x - _dragNode.x, y: pt.y - _dragNode.y };
      }
    }
  }, { passive: false });

  svg.addEventListener('touchmove', (evt) => {
    if (!_dragNode) return;
    evt.preventDefault();
    const touch = evt.touches[0];
    const pt = svgPoint(svg, touch.clientX, touch.clientY);
    _dragNode.x = Math.max(20, Math.min(width - 20, pt.x - _dragOffset.x));
    _dragNode.y = Math.max(20, Math.min(height - 20, pt.y - _dragOffset.y));
    updateNodePosition(_dragNode, svg);
  }, { passive: false });

  svg.addEventListener('touchend', () => {
    _dragNode = null;
  });
}


/** Convert screen coords to SVG coords */
function svgPoint(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}


/** Update a node's DOM position (circle + text + edges) */
function updateNodePosition(node, svg) {
  const g = svg.querySelector(`.graph-node[data-id="${node.id}"]`);
  if (!g) return;

  const circles = g.querySelectorAll('circle');
  circles.forEach(c => {
    c.setAttribute('cx', node.x);
    c.setAttribute('cy', node.y);
  });

  const text = g.querySelector('text');
  const r = node.size || 14;
  if (text) {
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + r + 16);
  }

  // Update connected edges
  svg.querySelectorAll(`line[data-source="${node.id}"]`).forEach(l => {
    l.setAttribute('x1', node.x);
    l.setAttribute('y1', node.y);
  });
  svg.querySelectorAll(`line[data-target="${node.id}"]`).forEach(l => {
    l.setAttribute('x2', node.x);
    l.setAttribute('y2', node.y);
  });
}


/** Highlight a node and dim others */
function highlightNode(nodeId) {
  _selectedNodeId = nodeId;
  const svg = document.getElementById('graph-svg');
  if (!svg) return;

  // Reset all
  svg.querySelectorAll('.graph-node').forEach(g => {
    const circles = g.querySelectorAll('circle');
    const main = circles[1] || circles[0];
    if (main) {
      main.setAttribute('fill-opacity', g.dataset.id === nodeId ? '1' : '0.4');
      main.setAttribute('filter', g.dataset.id === nodeId ? 'url(#glow-strong)' : '');
    }
    // Show ring for selected
    const ring = g.querySelector('.node-ring');
    if (ring) {
      ring.setAttribute('stroke-width', g.dataset.id === nodeId ? '3' : '0');
    }
    // Label
    const text = g.querySelector('text');
    if (text) {
      text.setAttribute('fill', g.dataset.id === nodeId ? '#fff' : '#666');
      text.setAttribute('font-weight', g.dataset.id === nodeId ? '700' : '400');
    }
  });

  // Highlight connected edges
  svg.querySelectorAll('.graph-edges line').forEach(line => {
    const src = line.getAttribute('data-source');
    const tgt = line.getAttribute('data-target');
    const connected = src === nodeId || tgt === nodeId;
    line.setAttribute('stroke-opacity', connected ? '0.8' : '0.15');
    line.setAttribute('stroke-width', connected ? '2' : '1');
    line.setAttribute('stroke', connected ? '#FF4500' : '#334');
  });
}


function showNodeDetail(node) {
  const panel = document.getElementById('node-detail-panel');
  const detail = document.getElementById('node-detail');
  panel.style.display = 'block';

  const typeColors = getTypeColors();
  const color = typeColors[node.type] || '#666';

  detail.innerHTML = `
    <div class="node-detail-content">
      <div class="flex items-center gap-8 mb-8">
        <span class="node-detail-dot" style="background:${color};width:10px;height:10px;display:inline-block;border-radius:50%;"></span>
        <span class="mono-xs muted">${node.type} ${node.group ? `// ${node.group}` : ''}</span>
      </div>
      <h4 style="font-size:16px;margin-bottom:8px;">${node.name}</h4>
      ${node.persona ? `<p style="font-size:13px;color:var(--secondary);line-height:1.6;margin-bottom:8px;">${node.persona}</p>` : ''}
      ${node.impact ? `<div class="mono-xs" style="margin-top:8px;">IMPACT: <span class="badge badge-sm" style="background:${node.impact === 'high' ? '#FF4500' : node.impact === 'medium' ? '#FF8F00' : '#2E7D32'};color:#fff;">${node.impact.toUpperCase()}</span></div>` : ''}
      ${node.description ? `<p style="font-size:12px;color:var(--outline);margin-top:8px;">${node.description}</p>` : ''}
    </div>
  `;
}


function renderLegend(nodes) {
  const types = [...new Set(nodes.map(n => n.type))];
  const typeColors = getTypeColors();

  const legend = document.getElementById('graph-legend');
  legend.innerHTML = types.map(t => `
    <span class="legend-item">
      <span class="legend-dot" style="background:${typeColors[t] || '#666'}"></span>
      ${t}
    </span>
  `).join('');
}
