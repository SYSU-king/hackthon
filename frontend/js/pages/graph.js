/**
 * Graph Page — Interactive knowledge graph visualization
 * 
 * Interactive knowledge graph panel:
 * - D3.js force-directed layout with zoom/pan
 * - Draggable nodes with proper click vs drag detection
 * - Curved multi-edges between same node pairs
 * - Self-loop edge support (merged per node)
 * - Edge label toggling
 * - Detail panel for nodes and edges (right overlay)
 * - Entity type legend with dynamic color palette
 * - Dot-grid background aesthetic
 */

import * as d3 from 'd3';
import { api } from '../api.js';
import { navigateTo } from '../app.js';
import { t } from '../i18n.js';

// ── State ──
let _currentSimulation = null;
let _selectedItem = null;  // { type: 'node'|'edge', data, entityType?, color? }
let _showEdgeLabels = true;
let _linkLabelsSelection = null;
let _linkLabelBgSelection = null;
let _expandedSelfLoops = new Set();

// ── Color palette ──
const ENTITY_COLORS = [
  '#FF6B35', '#004E89', '#7B2D8E', '#1A936F', '#C5283D',
  '#E9724C', '#3498db', '#9b59b6', '#27ae60', '#f39c12',
];

export function renderGraph(container) {
  const projectId = window.appState.projectId;

  // Reset state
  _selectedItem = null;
  _expandedSelfLoops = new Set();

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

          <!-- Legend (bottom-left) -->
          <div class="graph-legend-panel" id="graph-legend-panel"></div>

          <!-- Edge label toggle (top-right inside canvas) -->
          <div class="graph-edge-toggle" id="graph-edge-toggle">
            <label class="graph-toggle-switch">
              <input type="checkbox" id="edge-label-checkbox" ${_showEdgeLabels ? 'checked' : ''} />
              <span class="graph-toggle-slider"></span>
            </label>
            <span class="graph-toggle-label">Edge Labels</span>
          </div>

          <!-- Drag hint -->
          <div class="graph-hint mono-xs" id="graph-hint">
            <span class="material-symbols-outlined icon-sm">pan_tool</span>
            拖拽节点 · 点击查看详情 · 滚轮缩放
          </div>

          <!-- Detail panel (right overlay inside canvas) -->
          <div class="graph-detail-panel" id="graph-detail-panel" style="display:none;"></div>
        </div>

        <aside class="graph-sidebar" id="graph-sidebar">
          <div class="panel">
            <h3 class="mono-xs panel-title">${t('graph_agents')}</h3>
            <div id="agents-list" class="agents-list"></div>
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

  // Edge label toggle
  document.getElementById('edge-label-checkbox')?.addEventListener('change', (e) => {
    _showEdgeLabels = e.target.checked;
    if (_linkLabelsSelection) {
      _linkLabelsSelection.style('display', _showEdgeLabels ? 'block' : 'none');
    }
    if (_linkLabelBgSelection) {
      _linkLabelBgSelection.style('display', _showEdgeLabels ? 'block' : 'none');
    }
  });

  if (projectId) {
    loadGraphData(projectId);
  }
}


// ═══════════════════════════════════════════════════════════════════
// Data Loading
// ═══════════════════════════════════════════════════════════════════

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
    renderD3Graph(nodes, edges);

  } catch (err) {
    document.getElementById('graph-stats').textContent = t('graph_load_error');
    console.error('Graph load error:', err);
  }
}


// ═══════════════════════════════════════════════════════════════════
// Agents List (sidebar)
// ═══════════════════════════════════════════════════════════════════

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

  container.innerHTML = agents.map(a => `
    <div class="agent-card" data-agent-type="${a.agent_type}" style="border-left: 3px solid ${getAgentColor(a.agent_type)}">
      <div class="agent-card-header">
        <span class="material-symbols-outlined icon-sm" style="color:${getAgentColor(a.agent_type)}">${typeIcons[a.agent_type] || 'smart_toy'}</span>
        <strong class="mono-xs">${a.name || a.agent_type}</strong>
        <span class="badge badge-sm">${a.agent_type}</span>
      </div>
      <p class="agent-persona">${a.persona || ''}</p>
      ${a.stance ? `<div class="mono-xs muted">STANCE: ${a.stance} | INFLUENCE: ${(a.influence * 100).toFixed(0)}%</div>` : ''}
    </div>
  `).join('');
}

function getAgentColor(type) {
  const map = {
    Self: '#c9a0ff', Factor: '#556677', Family: '#ff9eb1',
    Mentor: '#7ecfff', School: '#ffd17e', Employer: '#7eff9e',
    City: '#ff7eb3', Industry: '#b4ff7e', Risk: '#ff7e7e',
    Partner: '#ffb07e', Person: '#888',
  };
  return map[type] || '#666';
}


// ═══════════════════════════════════════════════════════════════════
// D3 Force-Directed Graph
// ═══════════════════════════════════════════════════════════════════

function renderD3Graph(nodesData, edgesData) {
  // Stop previous simulation
  if (_currentSimulation) {
    _currentSimulation.stop();
    _currentSimulation = null;
  }

  const wrap = document.getElementById('graph-canvas-wrap');
  const svg = d3.select('#graph-svg');
  const width = wrap.clientWidth || 800;
  const height = wrap.clientHeight || 600;

  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  if (!nodesData.length) {
    svg.append('text')
      .attr('x', width / 2).attr('y', height / 2)
      .attr('text-anchor', 'middle').attr('fill', '#666')
      .attr('font-family', 'monospace')
      .text(t('graph_no_data'));
    return;
  }

  // Build node map keyed by whatever ID field exists
  const nodeMap = {};
  nodesData.forEach(n => {
    nodeMap[n.uuid || n.id] = n;
  });

  // Build entity type → color mapping
  const typeColorMap = {};
  let typeIdx = 0;
  nodesData.forEach(n => {
    const type = n.labels?.find(l => l !== 'Entity') || n.type || n.group || 'Entity';
    if (!typeColorMap[type]) {
      typeColorMap[type] = ENTITY_COLORS[typeIdx % ENTITY_COLORS.length];
      typeIdx++;
    }
  });
  const getColor = (type) => typeColorMap[type] || '#999';

  // Prepare D3 node objects
  const nodes = nodesData.map(n => ({
    id: n.uuid || n.id,
    name: n.name || 'Unnamed',
    type: n.labels?.find(l => l !== 'Entity') || n.type || n.group || 'Entity',
    rawData: n,
  }));

  const nodeIds = new Set(nodes.map(n => n.id));

  // ── Process edges: handle multi-edges & self-loops ──
  const edgePairCount = {};
  const selfLoopEdges = {};
  const processedSelfLoopNodes = new Set();

  // Normalize edge source/target field names
  const tempEdges = edgesData.filter(e => {
    const src = e.source_node_uuid || e.source;
    const tgt = e.target_node_uuid || e.target;
    return nodeIds.has(src) && nodeIds.has(tgt);
  });

  // Count edges per pair, collect self-loops
  tempEdges.forEach(e => {
    const src = e.source_node_uuid || e.source;
    const tgt = e.target_node_uuid || e.target;
    if (src === tgt) {
      if (!selfLoopEdges[src]) selfLoopEdges[src] = [];
      selfLoopEdges[src].push({
        ...e,
        source_name: nodeMap[src]?.name,
        target_name: nodeMap[tgt]?.name,
      });
    } else {
      const pairKey = [src, tgt].sort().join('_');
      edgePairCount[pairKey] = (edgePairCount[pairKey] || 0) + 1;
    }
  });

  const edgePairIndex = {};
  const edges = [];

  tempEdges.forEach(e => {
    const src = e.source_node_uuid || e.source;
    const tgt = e.target_node_uuid || e.target;
    const isSelfLoop = src === tgt;

    if (isSelfLoop) {
      if (processedSelfLoopNodes.has(src)) return;
      processedSelfLoopNodes.add(src);

      const allSelfLoops = selfLoopEdges[src];
      const nodeName = nodeMap[src]?.name || 'Unknown';

      edges.push({
        source: src,
        target: tgt,
        type: 'SELF_LOOP',
        name: `Self (${allSelfLoops.length})`,
        curvature: 0,
        isSelfLoop: true,
        rawData: {
          isSelfLoopGroup: true,
          source_name: nodeName,
          target_name: nodeName,
          selfLoopCount: allSelfLoops.length,
          selfLoopEdges: allSelfLoops,
        },
      });
      return;
    }

    const pairKey = [src, tgt].sort().join('_');
    const totalCount = edgePairCount[pairKey];
    const currentIndex = edgePairIndex[pairKey] || 0;
    edgePairIndex[pairKey] = currentIndex + 1;

    const isReversed = src > tgt;

    let curvature = 0;
    if (totalCount > 1) {
      const curvatureRange = Math.min(1.2, 0.6 + totalCount * 0.15);
      curvature = ((currentIndex / (totalCount - 1)) - 0.5) * curvatureRange * 2;
      if (isReversed) curvature = -curvature;
    }

    edges.push({
      source: src,
      target: tgt,
      type: e.fact_type || e.relation || e.name || 'RELATED',
      name: e.name || e.relation || e.fact_type || 'RELATED',
      curvature,
      isSelfLoop: false,
      pairIndex: currentIndex,
      pairTotal: totalCount,
      rawData: {
        ...e,
        source_name: nodeMap[src]?.name,
        target_name: nodeMap[tgt]?.name,
      },
    });
  });

  // ── D3 Force Simulation ──
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges).id(d => d.id).distance(d => {
      const base = 150;
      const count = d.pairTotal || 1;
      return base + (count - 1) * 50;
    }))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(50))
    .force('x', d3.forceX(width / 2).strength(0.04))
    .force('y', d3.forceY(height / 2).strength(0.04));

  _currentSimulation = simulation;

  // ── SVG structure ──
  // Defs
  const defs = svg.append('defs');
  defs.html(`
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-strong"><feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  `);

  const g = svg.append('g');

  // Zoom
  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    })
  );

  // ── Path helpers ──
  function getLinkPath(d) {
    const sx = d.source.x, sy = d.source.y;
    const tx = d.target.x, ty = d.target.y;

    if (d.isSelfLoop) {
      const loopR = 30;
      const x1 = sx + 8, y1 = sy - 4;
      const x2 = sx + 8, y2 = sy + 4;
      return `M${x1},${y1} A${loopR},${loopR} 0 1,1 ${x2},${y2}`;
    }

    if (d.curvature === 0) {
      return `M${sx},${sy} L${tx},${ty}`;
    }

    const dx = tx - sx, dy = ty - sy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const pairTotal = d.pairTotal || 1;
    const offsetRatio = 0.25 + pairTotal * 0.05;
    const baseOffset = Math.max(35, dist * offsetRatio);
    const offsetX = -dy / dist * d.curvature * baseOffset;
    const offsetY = dx / dist * d.curvature * baseOffset;
    const cx = (sx + tx) / 2 + offsetX;
    const cy = (sy + ty) / 2 + offsetY;

    return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
  }

  function getLinkMidpoint(d) {
    const sx = d.source.x, sy = d.source.y;
    const tx = d.target.x, ty = d.target.y;

    if (d.isSelfLoop) {
      return { x: sx + 70, y: sy };
    }

    if (d.curvature === 0) {
      return { x: (sx + tx) / 2, y: (sy + ty) / 2 };
    }

    const dx = tx - sx, dy = ty - sy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const pairTotal = d.pairTotal || 1;
    const offsetRatio = 0.25 + pairTotal * 0.05;
    const baseOffset = Math.max(35, dist * offsetRatio);
    const offsetX = -dy / dist * d.curvature * baseOffset;
    const offsetY = dx / dist * d.curvature * baseOffset;
    const cx = (sx + tx) / 2 + offsetX;
    const cy = (sy + ty) / 2 + offsetY;

    return {
      x: 0.25 * sx + 0.5 * cx + 0.25 * tx,
      y: 0.25 * sy + 0.5 * cy + 0.25 * ty,
    };
  }

  // ── Links ──
  const linkGroup = g.append('g').attr('class', 'links');

  const link = linkGroup.selectAll('path')
    .data(edges)
    .enter().append('path')
    .attr('stroke', '#C0C0C0')
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation();
      resetHighlights(linkGroup, node, linkLabelBg, linkLabels);
      d3.select(event.target).attr('stroke', '#3498db').attr('stroke-width', 3);
      showDetailPanel({ type: 'edge', data: d.rawData });
    });

  // Link label backgrounds
  const linkLabelBg = linkGroup.selectAll('rect.link-label-bg')
    .data(edges)
    .enter().append('rect')
    .attr('class', 'link-label-bg')
    .attr('fill', 'rgba(255,255,255,0.95)')
    .attr('rx', 3).attr('ry', 3)
    .style('cursor', 'pointer')
    .style('pointer-events', 'all')
    .style('display', _showEdgeLabels ? 'block' : 'none')
    .on('click', (event, d) => {
      event.stopPropagation();
      resetHighlights(linkGroup, node, linkLabelBg, linkLabels);
      link.filter(l => l === d).attr('stroke', '#3498db').attr('stroke-width', 3);
      showDetailPanel({ type: 'edge', data: d.rawData });
    });

  // Link labels
  const linkLabels = linkGroup.selectAll('text.link-label')
    .data(edges)
    .enter().append('text')
    .attr('class', 'link-label')
    .text(d => d.name)
    .attr('font-size', '9px')
    .attr('fill', '#999')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('cursor', 'pointer')
    .style('pointer-events', 'all')
    .style('font-family', "'Inter', system-ui, sans-serif")
    .style('display', _showEdgeLabels ? 'block' : 'none')
    .on('click', (event, d) => {
      event.stopPropagation();
      resetHighlights(linkGroup, node, linkLabelBg, linkLabels);
      link.filter(l => l === d).attr('stroke', '#3498db').attr('stroke-width', 3);
      showDetailPanel({ type: 'edge', data: d.rawData });
    });

  _linkLabelsSelection = linkLabels;
  _linkLabelBgSelection = linkLabelBg;

  // ── Nodes ──
  const nodeGroup = g.append('g').attr('class', 'nodes');

  const node = nodeGroup.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', 12)
    .attr('fill', d => getColor(d.type))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2.5)
    .style('cursor', 'pointer')
    .attr('filter', 'url(#glow)')
    .call(d3.drag()
      .on('start', (event, d) => {
        d.fx = d.x;
        d.fy = d.y;
        d._dragStartX = event.x;
        d._dragStartY = event.y;
        d._isDragging = false;
      })
      .on('drag', (event, d) => {
        const dx = event.x - d._dragStartX;
        const dy = event.y - d._dragStartY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (!d._isDragging && distance > 3) {
          d._isDragging = true;
          simulation.alphaTarget(0.3).restart();
        }
        if (d._isDragging) {
          d.fx = event.x;
          d.fy = event.y;
        }
      })
      .on('end', (event, d) => {
        if (d._isDragging) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
        d._isDragging = false;
      })
    )
    .on('click', (event, d) => {
      event.stopPropagation();
      // Reset highlights
      node.attr('stroke', '#fff').attr('stroke-width', 2.5).attr('filter', 'url(#glow)');
      linkGroup.selectAll('path').attr('stroke', '#C0C0C0').attr('stroke-width', 1.5);
      // Highlight selected node
      d3.select(event.target)
        .attr('stroke', '#0F766E')
        .attr('stroke-width', 4)
        .attr('filter', 'url(#glow-strong)');
      // Highlight connected edges
      link.filter(l => l.source.id === d.id || l.target.id === d.id)
        .attr('stroke', '#0F766E')
        .attr('stroke-width', 2.5);

      // Hide drag hint
      const hint = document.getElementById('graph-hint');
      if (hint) hint.style.display = 'none';

      showDetailPanel({
        type: 'node',
        data: d.rawData,
        entityType: d.type,
        color: getColor(d.type),
      });
    })
    .on('mouseenter', (event, d) => {
      if (!_selectedItem || (_selectedItem.data?.uuid || _selectedItem.data?.id) !== (d.rawData.uuid || d.rawData.id)) {
        d3.select(event.target).attr('stroke', '#333').attr('stroke-width', 3);
      }
    })
    .on('mouseleave', (event, d) => {
      if (!_selectedItem || (_selectedItem.data?.uuid || _selectedItem.data?.id) !== (d.rawData.uuid || d.rawData.id)) {
        d3.select(event.target).attr('stroke', '#fff').attr('stroke-width', 2.5);
      }
    });

  // Node labels
  const nodeLabels = nodeGroup.selectAll('text')
    .data(nodes)
    .enter().append('text')
    .text(d => d.name.length > 8 ? d.name.substring(0, 8) + '…' : d.name)
    .attr('font-size', '11px')
    .attr('fill', '#bbb')
    .attr('font-weight', '500')
    .attr('dx', 16)
    .attr('dy', 4)
    .style('pointer-events', 'none')
    .style('font-family', "'Inter', sans-serif");

  // ── Tick handler ──
  simulation.on('tick', () => {
    link.attr('d', d => getLinkPath(d));

    linkLabels.each(function (d) {
      const mid = getLinkMidpoint(d);
      d3.select(this).attr('x', mid.x).attr('y', mid.y).attr('transform', '');
    });

    linkLabelBg.each(function (d, i) {
      const mid = getLinkMidpoint(d);
      const textEl = linkLabels.nodes()[i];
      if (textEl) {
        const bbox = textEl.getBBox();
        d3.select(this)
          .attr('x', mid.x - bbox.width / 2 - 4)
          .attr('y', mid.y - bbox.height / 2 - 2)
          .attr('width', bbox.width + 8)
          .attr('height', bbox.height + 4)
          .attr('transform', '');
      }
    });

    node.attr('cx', d => d.x).attr('cy', d => d.y);
    nodeLabels.attr('x', d => d.x).attr('y', d => d.y);
  });

  // Click on empty space to close detail
  svg.on('click', () => {
    _selectedItem = null;
    node.attr('stroke', '#fff').attr('stroke-width', 2.5).attr('filter', 'url(#glow)');
    linkGroup.selectAll('path').attr('stroke', '#C0C0C0').attr('stroke-width', 1.5);
    linkLabelBg.attr('fill', 'rgba(255,255,255,0.95)');
    linkLabels.attr('fill', '#999');
    closeDetailPanel();
  });

  // ── Legend ──
  renderLegend(typeColorMap);

  // ── Resize handler ──
  const handleResize = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    svg.attr('width', w).attr('height', h).attr('viewBox', `0 0 ${w} ${h}`);
  };
  window.addEventListener('resize', handleResize);
}


function resetHighlights(linkGroup, node, linkLabelBg, linkLabels) {
  if (linkGroup) linkGroup.selectAll('path').attr('stroke', '#C0C0C0').attr('stroke-width', 1.5);
  if (linkLabelBg) linkLabelBg.attr('fill', 'rgba(255,255,255,0.95)');
  if (linkLabels) linkLabels.attr('fill', '#999');
  if (node) node.attr('stroke', '#fff').attr('stroke-width', 2.5).attr('filter', 'url(#glow)');
}


// ═══════════════════════════════════════════════════════════════════
// Detail Panel (right overlay)
// ═══════════════════════════════════════════════════════════════════

function showDetailPanel(item) {
  _selectedItem = item;
  const panel = document.getElementById('graph-detail-panel');
  if (!panel) return;

  panel.style.display = 'flex';

  if (item.type === 'node') {
    renderNodeDetailPanel(panel, item);
  } else {
    renderEdgeDetailPanel(panel, item);
  }
}

function closeDetailPanel() {
  const panel = document.getElementById('graph-detail-panel');
  if (panel) panel.style.display = 'none';
  _selectedItem = null;
  _expandedSelfLoops = new Set();
}

function renderNodeDetailPanel(panel, item) {
  const data = item.data;
  const attrs = data.attributes || data.properties || {};
  const labels = data.labels || [];
  const summary = data.summary || data.persona || data.description || '';

  panel.innerHTML = `
    <div class="gd-panel-header">
      <span class="gd-title">Node Details</span>
      <span class="gd-type-badge" style="background:${item.color};color:#fff;">${item.entityType}</span>
      <button class="gd-close" id="gd-close">×</button>
    </div>
    <div class="gd-content">
      <div class="gd-row">
        <span class="gd-label">Name:</span>
        <span class="gd-value">${data.name || '—'}</span>
      </div>
      ${data.uuid ? `
      <div class="gd-row">
        <span class="gd-label">UUID:</span>
        <span class="gd-value gd-uuid">${data.uuid}</span>
      </div>` : ''}
      ${data.id && !data.uuid ? `
      <div class="gd-row">
        <span class="gd-label">ID:</span>
        <span class="gd-value gd-uuid">${data.id}</span>
      </div>` : ''}
      ${data.created_at ? `
      <div class="gd-row">
        <span class="gd-label">Created:</span>
        <span class="gd-value">${formatDateTime(data.created_at)}</span>
      </div>` : ''}

      ${Object.keys(attrs).length > 0 ? `
      <div class="gd-section">
        <div class="gd-section-title">Properties:</div>
        ${Object.entries(attrs).map(([k, v]) => `
          <div class="gd-prop">
            <span class="gd-prop-key">${k}:</span>
            <span class="gd-prop-val">${v || 'None'}</span>
          </div>
        `).join('')}
      </div>` : ''}

      ${summary ? `
      <div class="gd-section">
        <div class="gd-section-title">Summary:</div>
        <div class="gd-summary">${summary}</div>
      </div>` : ''}

      ${labels.length > 0 ? `
      <div class="gd-section">
        <div class="gd-section-title">Labels:</div>
        <div class="gd-labels">
          ${labels.map(l => `<span class="gd-label-tag">${l}</span>`).join('')}
        </div>
      </div>` : ''}

      ${data.stance ? `
      <div class="gd-section">
        <div class="gd-section-title">Agent Info:</div>
        <div class="gd-prop"><span class="gd-prop-key">Stance:</span><span class="gd-prop-val">${data.stance}</span></div>
        ${data.influence !== undefined ? `<div class="gd-prop"><span class="gd-prop-key">Influence:</span><span class="gd-prop-val">${(data.influence * 100).toFixed(0)}%</span></div>` : ''}
        ${data.impact ? `<div class="gd-prop"><span class="gd-prop-key">Impact:</span><span class="gd-prop-val gd-impact-${data.impact}">${data.impact.toUpperCase()}</span></div>` : ''}
      </div>` : ''}
    </div>
  `;

  document.getElementById('gd-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDetailPanel();
  });
}

function renderEdgeDetailPanel(panel, item) {
  const data = item.data;

  if (data.isSelfLoopGroup) {
    renderSelfLoopDetailPanel(panel, data);
    return;
  }

  panel.innerHTML = `
    <div class="gd-panel-header">
      <span class="gd-title">Relationship</span>
      <button class="gd-close" id="gd-close">×</button>
    </div>
    <div class="gd-content">
      <div class="gd-edge-header">
        ${data.source_name || '?'} → ${data.name || data.relation || 'RELATED_TO'} → ${data.target_name || '?'}
      </div>
      ${data.uuid ? `
      <div class="gd-row">
        <span class="gd-label">UUID:</span>
        <span class="gd-value gd-uuid">${data.uuid}</span>
      </div>` : ''}
      <div class="gd-row">
        <span class="gd-label">Label:</span>
        <span class="gd-value">${data.name || data.relation || 'RELATED_TO'}</span>
      </div>
      <div class="gd-row">
        <span class="gd-label">Type:</span>
        <span class="gd-value">${data.fact_type || data.relation_type || 'Unknown'}</span>
      </div>
      ${data.fact ? `
      <div class="gd-row">
        <span class="gd-label">Fact:</span>
        <span class="gd-value gd-fact">${data.fact}</span>
      </div>` : ''}
      ${data.weight !== undefined ? `
      <div class="gd-row">
        <span class="gd-label">Weight:</span>
        <span class="gd-value">${data.weight}</span>
      </div>` : ''}
      ${data.episodes?.length > 0 ? `
      <div class="gd-section">
        <div class="gd-section-title">Episodes:</div>
        <div class="gd-episodes">
          ${data.episodes.map(ep => `<span class="gd-episode-tag">${ep}</span>`).join('')}
        </div>
      </div>` : ''}
      ${data.created_at ? `
      <div class="gd-row">
        <span class="gd-label">Created:</span>
        <span class="gd-value">${formatDateTime(data.created_at)}</span>
      </div>` : ''}
    </div>
  `;

  document.getElementById('gd-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDetailPanel();
  });
}

function renderSelfLoopDetailPanel(panel, data) {
  const loops = data.selfLoopEdges || [];

  panel.innerHTML = `
    <div class="gd-panel-header">
      <span class="gd-title">Self Relations</span>
      <button class="gd-close" id="gd-close">×</button>
    </div>
    <div class="gd-content">
      <div class="gd-edge-header gd-self-loop-hdr">
        ${data.source_name} — Self Relations
        <span class="gd-self-count">${data.selfLoopCount} items</span>
      </div>
      <div class="gd-self-list" id="gd-self-list">
        ${loops.map((loop, idx) => {
          const loopId = loop.uuid || idx;
          return `
            <div class="gd-self-item ${_expandedSelfLoops.has(loopId) ? 'expanded' : ''}" data-self-id="${loopId}">
              <div class="gd-self-item-header" data-toggle-id="${loopId}">
                <span class="gd-self-idx">#${idx + 1}</span>
                <span class="gd-self-name">${loop.name || loop.fact_type || 'RELATED'}</span>
                <span class="gd-self-toggle">${_expandedSelfLoops.has(loopId) ? '−' : '+'}</span>
              </div>
              <div class="gd-self-item-content" style="display:${_expandedSelfLoops.has(loopId) ? 'block' : 'none'};">
                ${loop.uuid ? `<div class="gd-row"><span class="gd-label">UUID:</span><span class="gd-value gd-uuid">${loop.uuid}</span></div>` : ''}
                ${loop.fact ? `<div class="gd-row"><span class="gd-label">Fact:</span><span class="gd-value gd-fact">${loop.fact}</span></div>` : ''}
                ${loop.fact_type ? `<div class="gd-row"><span class="gd-label">Type:</span><span class="gd-value">${loop.fact_type}</span></div>` : ''}
                ${loop.created_at ? `<div class="gd-row"><span class="gd-label">Created:</span><span class="gd-value">${formatDateTime(loop.created_at)}</span></div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Toggle handlers
  panel.querySelectorAll('[data-toggle-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.toggleId;
      const numId = isNaN(id) ? id : parseInt(id);
      if (_expandedSelfLoops.has(numId)) {
        _expandedSelfLoops.delete(numId);
      } else {
        _expandedSelfLoops.add(numId);
      }
      // Re-render
      renderSelfLoopDetailPanel(panel, data);
    });
  });

  document.getElementById('gd-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDetailPanel();
  });
}


// ═══════════════════════════════════════════════════════════════════
// Legend
// ═══════════════════════════════════════════════════════════════════

function renderLegend(typeColorMap) {
  const legend = document.getElementById('graph-legend-panel');
  if (!legend) return;

  const types = Object.entries(typeColorMap);
  if (types.length === 0) return;

  legend.innerHTML = `
    <span class="gl-title">Entity Types</span>
    <div class="gl-items">
      ${types.map(([name, color]) => `
        <div class="gl-item">
          <span class="gl-dot" style="background:${color};"></span>
          <span class="gl-label">${name}</span>
        </div>
      `).join('')}
    </div>
  `;
}


// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch {
    return dateStr;
  }
}
