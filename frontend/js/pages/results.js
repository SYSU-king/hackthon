/**
 * Results Page — Path overview + detail + advice (with i18n)
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';
import { t, getStateLabel, STATE_KEYS } from '../i18n.js';

let selectedPath = null;
let currentView = 'overview'; // overview / detail / advice

const NODE_TYPE_COLORS = {
  decision: 'var(--primary)',
  opportunity: 'var(--accent)',
  result: '#2E7D32',
  cascade: '#5E5E5E',
  risk: 'var(--error)',
  reflection: '#1565C0',
};

export async function renderResults(container) {
  // Load paths
  let paths = [];
  try {
    const data = await api.getPaths(state.projectId);
    paths = data.paths || [];
  } catch (e) {
    container.innerHTML = `<div class="p-48 text-center"><h1>${t('error_loading')}</h1><p>${e.message}</p></div>`;
    return;
  }

  if (currentView === 'overview') {
    renderOverview(container, paths);
  } else if (currentView === 'detail' && selectedPath) {
    renderDetail(container, selectedPath);
  } else if (currentView === 'advice' && selectedPath) {
    renderAdvice(container, selectedPath);
  }
}

function renderOverview(container, paths) {
  const desc = t('results_desc').replace('{count}', paths.length);
  container.innerHTML = `
    <div class="results-header">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end">
        <div>
          <h1 style="font-size:48px;">${t('results_title')}</h1>
          <p class="text-secondary mt-8" style="max-width:600px;">${desc}</p>
        </div>
        <div class="text-right">
          <div class="mono-xs text-muted">PROJECT: ${state.projectId}</div>
          <div class="mono-xs text-muted">${t('results_status')}</div>
        </div>
      </div>
    </div>
    <div class="results-body">
      ${paths.map(p => renderPathCard(p)).join('')}
      <div class="flex justify-between mt-32">
        <button class="btn btn-ghost" onclick="navigateTo('graph')">
          <span class="material-symbols-outlined icon-sm">hub</span> ${t('nav_graph')}
        </button>
        <button class="btn btn-ghost" onclick="navigateTo('landing')">[${t('btn_new_sim')}]</button>
      </div>
    </div>
  `;

  // Path card clicks
  container.querySelectorAll('.path-card').forEach(card => {
    card.addEventListener('click', () => {
      const pathId = card.dataset.pathId;
      selectedPath = paths.find(p => p.id === pathId);
      currentView = 'detail';
      renderResults(container);
    });
  });
}

function renderPathCard(path) {
  const typeLabels = {
    optimal: t('path_optimal'),
    conservative: t('path_conservative'),
    risk: t('path_risk'),
    balanced: t('path_balanced'),
  };
  const riskColors = { low: '#2E7D32', medium: '#FF8F00', high: 'var(--error)' };
  const score = Math.round(path.satisfaction_score * 100);
  
  return `
    <div class="path-card" data-path-id="${path.id}">
      <div class="path-card-header">
        <div>
          <span class="tag tag-${path.path_type === 'optimal' ? 'accent' : path.path_type === 'risk' ? 'primary' : 'outline'}">[${path.path_type.toUpperCase()}]</span>
          <div class="path-card-name mt-8">${path.name}</div>
        </div>
        <div style="text-align:right;">
          <div class="mono-xs text-muted">${path.nodes?.length || 0} ${t('path_nodes')}</div>
          <div class="mono-xs" style="color:${riskColors[path.risk_level] || riskColors.medium};">${t('path_risk_label')}: ${path.risk_level.toUpperCase()}</div>
        </div>
      </div>
      <p class="path-card-summary">${path.summary}</p>
      <div class="path-card-stats">
        <div class="path-stat">
          <div class="path-stat-value" style="color:${score > 70 ? '#2E7D32' : score > 50 ? '#FF8F00' : 'var(--error)'};">${score}%</div>
          <div class="path-stat-label">${t('path_satisfaction')}</div>
        </div>
        ${renderMiniStats(path.final_state)}
      </div>
    </div>
  `;
}

function renderMiniStats(finalState) {
  if (!finalState) return '';
  const keys = ['education', 'career', 'finance', 'health'];
  return keys.map(k => `
    <div class="path-stat">
      <div class="path-stat-value">${Math.round((finalState[k] || 0) * 100)}%</div>
      <div class="path-stat-label">${getStateLabel(k)}</div>
    </div>
  `).join('');
}

function renderDetail(container, path) {
  const nodes = path.nodes || [];
  const activeNode = nodes[0];

  container.innerHTML = `
    <div class="detail-header">
      <div class="flex items-center gap-16 mb-8">
        <button class="btn btn-ghost" id="btn-back-overview" style="padding:8px 16px;">[← ${t('btn_back')}]</button>
        <span class="tag tag-primary">[${path.path_type.toUpperCase()}]</span>
        <span class="mono-xs text-muted flex items-center gap-4">
          <span class="status-dot status-active"></span> 
          ${nodes.length} NODES
        </span>
      </div>
      <h1 style="font-size:40px;">${path.name}</h1>
    </div>
    <div class="detail-body">
      <!-- Sidebar: Node List -->
      <div class="detail-sidebar">
        <h2 style="margin-bottom:16px;">[${t('detail_node_seq')}]</h2>
        <div id="node-list">
          ${nodes.map((n, i) => `
            <div class="node-card ${i === 0 ? 'active' : ''}" data-index="${i}">
              <div class="node-type" style="color:${NODE_TYPE_COLORS[n.node_type] || 'var(--outline)'};">${n.node_type}</div>
              <div class="node-title">${n.title}</div>
              <div class="node-time">${n.time_label}</div>
            </div>
          `).join('')}
        </div>
        <div class="mt-24">
          <button class="btn btn-accent btn-full" id="btn-advice">[${t('btn_get_advice')}]</button>
        </div>
      </div>

      <!-- Main: Node Detail + State Chart -->
      <div class="detail-main" id="node-detail-container">
        ${activeNode ? renderNodeDetail(activeNode, 0, nodes.length) : '<p class="p-32 text-muted">No nodes</p>'}
      </div>
    </div>
  `;

  // Back button
  document.getElementById('btn-back-overview').addEventListener('click', () => {
    currentView = 'overview';
    renderResults(container);
  });

  // Node card clicks
  container.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.node-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const idx = parseInt(card.dataset.index);
      document.getElementById('node-detail-container').innerHTML = renderNodeDetail(nodes[idx], idx, nodes.length);
    });
  });

  // Advice button
  document.getElementById('btn-advice').addEventListener('click', () => {
    currentView = 'advice';
    renderResults(container);
  });
}

function renderNodeDetail(node, index, total) {
  const stateData = node.state_snapshot || {};
  return `
    <div class="fade-in">
      <div class="mono-xs text-muted mb-8">NODE ${index + 1} OF ${total} // ${node.time_label}</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:32px;">
        <h1 style="font-size:32px;">${node.title}</h1>
        <div class="flex items-center gap-8 mt-8">
          <span class="tag" style="background:${NODE_TYPE_COLORS[node.node_type] || 'var(--outline)'};color:var(--white);">${node.node_type.toUpperCase()}</span>
          <span class="mono-xs">${node.time_label}</span>
        </div>
      </div>

      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">${t('detail_description')}</h3>
        <p style="font-size:14px;line-height:1.7;color:var(--secondary);">${node.description}</p>
      </div>

      ${node.trigger_reason ? `
      <div class="card mb-24" style="border-left:2px solid var(--accent);">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">${t('detail_trigger')}:</div>
        <p style="font-size:14px;color:var(--secondary);">${node.trigger_reason}</p>
      </div>
      ` : ''}

      <div class="card mb-24">
        <h3 style="margin-bottom:16px;">${t('detail_state_snapshot')}</h3>
        ${STATE_KEYS.map(key => {
          const val = stateData[key] || 0;
          const pct = Math.round(val * 100);
          const color = pct > 70 ? '#2E7D32' : pct > 40 ? '#FF8F00' : 'var(--error)';
          return `
            <div class="state-bar-container">
              <div class="state-bar-label">
                <span>${getStateLabel(key)}</span>
                <span style="color:${color}">${pct}%</span>
              </div>
              <div class="state-bar">
                <div class="state-bar-fill" style="width:${pct}%;background:${color};"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

async function renderAdvice(container, path) {
  container.innerHTML = `
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">${t('advice_title')}</h1>
          <p class="text-secondary mt-8">${t('advice_desc').replace('{path}', path.name)}</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-detail">[← ${t('btn_back')}]</button>
        </div>
      </div>

      <div class="flex gap-16 mb-32">
        <button class="btn btn-accent" id="btn-satisfied">[${t('advice_satisfied')}]</button>
        <button class="btn btn-ghost" id="btn-unsatisfied">[${t('advice_unsatisfied')}]</button>
      </div>

      <div id="advice-content">
        <div class="text-center p-48 text-muted">${t('advice_choose')}</div>
      </div>
    </div>
  `;

  document.getElementById('btn-back-detail').addEventListener('click', () => {
    currentView = 'detail';
    renderResults(container);
  });

  document.getElementById('btn-satisfied').addEventListener('click', () => loadAdvice(container, 'satisfied'));
  document.getElementById('btn-unsatisfied').addEventListener('click', () => loadAdvice(container, 'unsatisfied'));
}

async function loadAdvice(container, feedback) {
  const adviceContainer = document.getElementById('advice-content');
  adviceContainer.innerHTML = `<div class="p-32 text-center mono-xs pulse">${t('advice_generating')}</div>`;

  try {
    const advice = await api.getAdvice(state.projectId, selectedPath.id, feedback);
    
    if (feedback === 'satisfied') {
      adviceContainer.innerHTML = `
        <div class="fade-in">
          <h2 style="font-family:var(--font-headline);font-size:28px;font-weight:700;margin-bottom:32px;">${advice.title}</h2>
          <div class="grid-3 gap-16" style="border:1px solid rgba(198,198,198,0.3);">
            <div style="padding:24px;background:var(--surface-low);border-right:1px solid rgba(198,198,198,0.3);">
              <div class="flex justify-between items-center mb-24">
                <h2>${t('advice_immediate')}</h2>
                <span class="tag tag-accent">[PRIORITY]</span>
              </div>
              ${(advice.immediate_actions || []).map((a, i) => `
                <div class="card mb-8">
                  <div class="flex gap-16"><span class="text-accent" style="font-family:var(--font-mono);font-size:18px;font-weight:700;">0${i+1}.</span><p style="font-size:13px;">${a}</p></div>
                </div>
              `).join('')}
            </div>
            <div style="padding:24px;border-right:1px solid rgba(198,198,198,0.3);">
              <div class="flex justify-between items-center mb-24">
                <h2>${t('advice_mid_term')}</h2>
                <span class="tag tag-outline">[PHASE]</span>
              </div>
              ${(advice.mid_term_plan || []).map(a => `
                <div class="card mb-8"><p style="font-size:13px;">${a}</p></div>
              `).join('')}
            </div>
            <div style="padding:24px;background:var(--surface-low);">
              <div class="flex justify-between items-center mb-24">
                <h2>${t('advice_risk_mit')}</h2>
                <span class="tag tag-muted">[DEFENSIVE]</span>
              </div>
              ${(advice.risk_mitigation || []).map(a => `
                <div class="card mb-8"><p style="font-size:13px;">${a}</p></div>
              `).join('')}
            </div>
          </div>
          ${(advice.key_nodes || []).length ? `
          <div class="card mt-24" style="border-left:2px solid var(--accent);">
            <div class="mono-xs text-accent mb-8">${t('advice_key_nodes')}:</div>
            ${advice.key_nodes.map(n => `<div class="advice-item">${n}</div>`).join('')}
          </div>` : ''}
        </div>
      `;
    } else {
      adviceContainer.innerHTML = `
        <div class="fade-in">
          <h2 style="font-family:var(--font-headline);font-size:28px;font-weight:700;margin-bottom:32px;">${advice.title}</h2>
          <div class="grid-2 gap-16">
            <div>
              <div class="advice-section">
                <h3 class="text-accent">${t('advice_risk_analysis')}</h3>
                ${(advice.risk_analysis || []).map(a => `<div class="advice-item">${a}</div>`).join('')}
              </div>
              <div class="advice-section">
                <h3>${t('advice_intervention')}</h3>
                ${(advice.intervention_points || []).map(a => `<div class="advice-item">${a}</div>`).join('')}
              </div>
            </div>
            <div>
              <div class="advice-section">
                <h3>${t('advice_alternative')}</h3>
                ${(advice.alternative_paths || []).map(a => `<div class="advice-item">${a}</div>`).join('')}
              </div>
              <div class="advice-section">
                <h3>${t('advice_mental')}</h3>
                ${(advice.mental_support || []).map(a => `<div class="advice-item">${a}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (e) {
    adviceContainer.innerHTML = `<div class="p-32 text-center text-error">Error: ${e.message}</div>`;
  }
}
