/**
 * Results Page — Path overview + detail + advice + report + backtracking (with i18n)
 * 
 * §14.2 可反事实: "如果我选另一条路" — backtracking from any node
 * §14.4 可交互: User modifies params mid-simulation — re-derive new path
 */

import { api, ensureStreamingResponse } from '../api.js';
import { navigateTo, state } from '../app.js';
import { t, getStateLabel, STATE_KEYS } from '../i18n.js';

let selectedPath = null;
let currentView = 'overview'; // overview / detail / advice / report / backtrack
let backtrackNodeIndex = null;

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
  } else if (currentView === 'report') {
    renderReport(container, paths);
  } else if (currentView === 'backtrack' && selectedPath) {
    renderBacktrackView(container, selectedPath);
  } else {
    // Fallback
    renderOverview(container, paths);
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
      <div class="flex justify-between mt-32" style="flex-wrap:wrap;gap:12px;">
        <div class="flex gap-8" style="flex-wrap:wrap;">
          <button class="btn btn-ghost" onclick="navigateTo('graph')">
            <span class="material-symbols-outlined icon-sm">hub</span> ${t('nav_graph')}
          </button>
          <button class="btn btn-ghost" onclick="navigateTo('landing')">[${t('btn_new_sim')}]</button>
        </div>
        <button class="btn btn-accent" id="btn-report">
          <span class="material-symbols-outlined icon-sm">summarize</span> ${t('btn_view_report') || 'VIEW REPORT'}
        </button>
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

  // Report button
  document.getElementById('btn-report')?.addEventListener('click', () => {
    currentView = 'report';
    renderResults(container);
  });
}

function renderPathCard(path) {
  const typeLabels = {
    optimal: t('path_optimal'),
    conservative: t('path_conservative'),
    risk: t('path_risk'),
    balanced: t('path_balanced'),
    counterfactual: '反事实',
  };
  const riskColors = { low: '#2E7D32', medium: '#FF8F00', high: 'var(--error)' };
  const score = Math.round(path.satisfaction_score * 100);
  const isCounterfactual = path.path_type === 'counterfactual';
  
  return `
    <div class="path-card ${isCounterfactual ? 'path-card-counterfactual' : ''}" data-path-id="${path.id}">
      <div class="path-card-header">
        <div>
          <span class="tag tag-${path.path_type === 'optimal' ? 'accent' : path.path_type === 'risk' ? 'primary' : isCounterfactual ? 'primary' : 'outline'}">[${(path.path_type || 'balanced').toUpperCase()}]</span>
          <div class="path-card-name mt-8">${path.name}</div>
        </div>
        <div style="text-align:right;">
          <div class="mono-xs text-muted">${path.nodes?.length || 0} ${t('path_nodes')}</div>
          <div class="mono-xs" style="color:${riskColors[path.risk_level] || riskColors.medium};">${t('path_risk_label')}: ${(path.risk_level || 'medium').toUpperCase()}</div>
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
        <span class="tag tag-primary">[${(path.path_type || 'balanced').toUpperCase()}]</span>
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
        <div class="mt-24" style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-accent btn-full" id="btn-advice">[${t('btn_get_advice')}]</button>
          <button class="btn btn-primary btn-full" id="btn-backtrack" style="background:#9C27B0;">
            <span class="material-symbols-outlined icon-sm">undo</span> [回溯推演]
          </button>
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

  // Backtrack button
  document.getElementById('btn-backtrack').addEventListener('click', () => {
    currentView = 'backtrack';
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

      ${node.agent_actions && node.agent_actions.length > 0 ? `
      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">AGENT_ACTIONS</h3>
        ${node.agent_actions.map(a => `
          <div style="padding:8px 12px;border-left:2px solid ${NODE_TYPE_COLORS[a.action_type?.toLowerCase()] || '#666'};margin-bottom:8px;background:var(--surface-low);">
            <div class="mono-xs" style="margin-bottom:4px;">[${a.agent_type || 'AGENT'}] ${a.action_type || 'ACTION'}</div>
            <p style="font-size:13px;color:var(--secondary);">${a.narrative || ''}</p>
          </div>
        `).join('')}
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

// ═══════════════════════════════════════════════════════════════════
// Backtrack / Counterfactual View (§14.2 + §14.4)
// ═══════════════════════════════════════════════════════════════════

function renderBacktrackView(container, path) {
  const nodes = path.nodes || [];

  container.innerHTML = `
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[COUNTERFACTUAL_ENGINE]</div>
      <div class="flex justify-between items-end mb-32">
        <div>
          <h1 style="font-size:48px;">回溯推演</h1>
          <p class="text-secondary mt-8" style="max-width:600px;">
            选择任意节点，修改条件后重新推演。实现"如果我选另一条路"的反事实分析。(§14.2 可反事实 + §14.4 可交互)
          </p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-from-bt">[← ${t('btn_back')}]</button>
        </div>
      </div>

      <!-- Node Selection -->
      <div class="card mb-24" style="border-left:4px solid #9C27B0;padding:24px;">
        <h3 style="margin-bottom:16px;">1. 选择回溯节点</h3>
        <p class="mono-xs text-muted mb-16">点击选择你想修改条件的节点（可从该节点开始重新推导）</p>
        <div class="backtrack-node-list" id="bt-node-list">
          ${nodes.map((n, i) => `
            <div class="bt-node-card ${backtrackNodeIndex === i ? 'bt-selected' : ''}" data-index="${i}">
              <div class="bt-node-idx">${i + 1}</div>
              <div class="bt-node-info">
                <div class="bt-node-title">${n.title}</div>
                <div class="bt-node-meta">${n.time_label} · ${n.node_type}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Modification Form -->
      <div class="card mb-24" style="padding:24px;" id="bt-modify-section" ${backtrackNodeIndex === null ? 'style="opacity:0.5;pointer-events:none;"' : ''}>
        <h3 style="margin-bottom:16px;">2. 修改条件</h3>
        <div class="form-group">
          <label class="form-label">修改描述（自然语言）</label>
          <textarea class="form-textarea" id="bt-description" placeholder="例如：假设保研成功 / 假设拿到了大厂 offer / 假设家庭经济好转">${''}</textarea>
        </div>
        <div class="form-group mt-16">
          <label class="form-label">状态参数调整</label>
          <div class="bt-state-controls" id="bt-state-controls">
            ${renderBacktrackStateControls(nodes[backtrackNodeIndex || 0])}
          </div>
        </div>
        <div class="form-group mt-16">
          <label class="form-label">推演轮数</label>
          <div class="slider-container">
            <input type="range" class="slider" id="bt-rounds" min="2" max="12" value="6" />
            <span class="mono-sm" id="bt-rounds-value" style="min-width:40px;">6</span>
          </div>
        </div>
      </div>

      <div class="flex gap-16 justify-end">
        <button class="btn btn-accent" id="btn-run-backtrack" ${backtrackNodeIndex === null ? 'disabled style="opacity:0.5;"' : ''}>
          <span class="material-symbols-outlined icon-sm">undo</span> 开始回溯推演
        </button>
      </div>

      <!-- Progress / result area -->
      <div id="bt-progress" class="mt-32" style="display:none;">
        <div class="card" style="padding:24px;border-left:4px solid #9C27B0;">
          <div class="console-line pulse" id="bt-status">
            <span class="console-ts">[BT]</span>
            <span>准备回溯推演...</span>
          </div>
          <div class="sim-progress-bar mt-16">
            <div class="sim-progress-fill" id="bt-progress-fill" style="width:0%;background:#9C27B0;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Back button
  document.getElementById('btn-back-from-bt')?.addEventListener('click', () => {
    currentView = 'detail';
    backtrackNodeIndex = null;
    renderResults(container);
  });

  // Node selection
  container.querySelectorAll('.bt-node-card').forEach(card => {
    card.addEventListener('click', () => {
      backtrackNodeIndex = parseInt(card.dataset.index);
      renderBacktrackView(container, path);
    });
  });

  // Rounds slider
  document.getElementById('bt-rounds')?.addEventListener('input', (e) => {
    document.getElementById('bt-rounds-value').textContent = e.target.value;
  });

  // Run backtrack
  document.getElementById('btn-run-backtrack')?.addEventListener('click', async () => {
    if (backtrackNodeIndex === null) return;

    const description = document.getElementById('bt-description')?.value || '';
    const rounds = parseInt(document.getElementById('bt-rounds')?.value || '6');

    // Collect state modifications
    const modifications = {};
    document.querySelectorAll('.bt-state-slider').forEach(slider => {
      const key = slider.dataset.key;
      modifications[key] = parseFloat(slider.value);
    });

    // Show progress
    const progDiv = document.getElementById('bt-progress');
    const statusDiv = document.getElementById('bt-status');
    const progFill = document.getElementById('bt-progress-fill');
    if (progDiv) progDiv.style.display = 'block';

    try {
      const resp = await ensureStreamingResponse(
        await api.backtrack(
          state.projectId,
          path.id,
          backtrackNodeIndex,
          modifications,
          description,
          rounds
        )
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
              // Update progress UI
              if (statusDiv && event.message) {
                statusDiv.innerHTML = `<span class="console-ts">[BT]</span><span>${event.message}</span>`;
              }
              if (progFill && event.progress !== undefined) {
                progFill.style.width = `${event.progress}%`;
              }

              if (event.phase === 'completed') {
                statusDiv.innerHTML = `<span class="console-ts" style="color:var(--accent);">[DONE]</span><span style="font-weight:700;color:var(--accent);">${event.message}</span>`;
                statusDiv.classList.remove('pulse');
                // After a short delay navigate to overview to see the new path
                setTimeout(() => {
                  currentView = 'overview';
                  backtrackNodeIndex = null;
                  renderResults(container);
                }, 1500);
              }

              if (event.phase === 'error') {
                statusDiv.innerHTML = `<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">${event.message}</span>`;
                statusDiv.classList.remove('pulse');
              }
            } catch (e) { /* skip */ }
          }
        }
      }
    } catch (e) {
      if (statusDiv) {
        statusDiv.innerHTML = `<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">回溯推演失败: ${e.message}</span>`;
        statusDiv.classList.remove('pulse');
      }
    }
  });
}

function renderBacktrackStateControls(node) {
  const stateData = node?.state_snapshot || {};
  return STATE_KEYS.map(key => {
    const val = stateData[key] || 0.5;
    const pct = Math.round(val * 100);
    return `
      <div class="bt-state-row">
        <span class="bt-state-label">${getStateLabel(key)}</span>
        <input type="range" class="slider bt-state-slider" data-key="${key}" min="0" max="1" step="0.05" value="${val}" />
        <span class="bt-state-val mono-xs">${pct}%</span>
      </div>
    `;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════════
// Report View
// ═══════════════════════════════════════════════════════════════════

async function renderReport(container, paths) {
  container.innerHTML = `
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">Comprehensive Report</h1>
          <p class="text-secondary mt-8">多路径对比分析与综合建议</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-from-report">[← ${t('btn_back')}]</button>
        </div>
      </div>

      <div id="report-content">
        <div class="text-center p-48 text-muted pulse mono-xs">正在生成综合评估报告...</div>
      </div>
    </div>
  `;

  document.getElementById('btn-back-from-report')?.addEventListener('click', () => {
    currentView = 'overview';
    renderResults(container);
  });

  // Load report from API
  try {
    const report = await api.getReport(state.projectId);
    renderReportContent(report);
  } catch (e) {
    document.getElementById('report-content').innerHTML = `
      <div class="p-32 text-center text-error">
        <p>报告生成失败: ${e.message}</p>
        <button class="btn btn-ghost mt-16" id="btn-retry-report">[RETRY]</button>
      </div>
    `;
    document.getElementById('btn-retry-report')?.addEventListener('click', () => {
      renderReport(container, paths);
    });
  }
}

function renderReportContent(report) {
  const content = document.getElementById('report-content');
  if (!content) return;

  const comparisons = report.path_comparison || [];
  const criticalNodes = report.critical_nodes || [];
  const nextSteps = report.next_steps || [];

  content.innerHTML = `
    <div class="fade-in">
      <!-- Executive Summary -->
      <div class="card mb-24" style="border-left:4px solid var(--accent);padding:32px;">
        <h2 style="margin-bottom:16px;">${report.title || 'REPORT'}</h2>
        <p style="font-size:16px;line-height:1.8;color:var(--secondary);">${report.executive_summary || ''}</p>
      </div>

      <!-- Path Comparison -->
      ${comparisons.length > 0 ? `
      <div class="mb-32">
        <h2 style="margin-bottom:24px;">[PATH_COMPARISON]</h2>
        <div class="grid gap-16" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));">
          ${comparisons.map(comp => `
            <div class="card">
              <h3 style="margin-bottom:12px;color:var(--accent);">${comp.path_name || '路径'}</h3>
              <div style="margin-bottom:12px;">
                <div class="mono-xs text-muted mb-8">STRENGTHS</div>
                ${(comp.strengths || []).map(s => `<div class="advice-item" style="border-left-color:#2E7D32;">${s}</div>`).join('')}
              </div>
              <div style="margin-bottom:12px;">
                <div class="mono-xs text-muted mb-8">RISKS</div>
                ${(comp.risks || []).map(r => `<div class="advice-item" style="border-left-color:var(--error);">${r}</div>`).join('')}
              </div>
              ${comp.key_turning_point ? `
              <div class="mono-xs mt-8" style="padding:8px;background:var(--surface-low);">
                TURNING_POINT: ${comp.key_turning_point}
              </div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Critical Nodes -->
      ${criticalNodes.length > 0 ? `
      <div class="mb-32">
        <h2 style="margin-bottom:24px;">[CRITICAL_NODES]</h2>
        ${criticalNodes.map((cn, i) => `
          <div class="card mb-16" style="border-left:3px solid ${i === 0 ? 'var(--accent)' : 'var(--outline-variant)'};">
            <div class="flex justify-between items-center mb-8">
              <span class="tag tag-${i === 0 ? 'accent' : 'outline'}">${cn.time_label || `NODE_${i+1}`}</span>
            </div>
            <p style="font-size:14px;margin-bottom:8px;">${cn.description || ''}</p>
            ${cn.recommendation ? `<div class="mono-xs text-accent">→ ${cn.recommendation}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Overall Recommendation -->
      ${report.overall_recommendation ? `
      <div class="card mb-24" style="background:var(--primary);color:var(--white);padding:32px;">
        <h2 style="color:var(--accent);margin-bottom:16px;">[OVERALL_RECOMMENDATION]</h2>
        <p style="font-size:16px;line-height:1.8;">${report.overall_recommendation}</p>
      </div>
      ` : ''}

      <!-- Next Steps -->
      ${nextSteps.length > 0 ? `
      <div class="card mb-24">
        <h2 style="margin-bottom:16px;">[NEXT_STEPS]</h2>
        ${nextSteps.map((step, i) => `
          <div class="flex gap-16 mb-16 items-start">
            <span class="text-accent" style="font-family:var(--font-mono);font-size:24px;font-weight:700;min-width:48px;">0${i+1}.</span>
            <p style="font-size:14px;line-height:1.6;padding-top:4px;">${step}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════
// Advice View
// ═══════════════════════════════════════════════════════════════════

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
