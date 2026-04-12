/**
 * Results Page — Path overview + detail + advice + report + backtracking (with i18n)
 * 
 * §14.2 可反事实: "如果我选另一条路" — backtracking from any node
 * §14.4 可交互: User modifies params mid-simulation — re-derive new path
 */

import { api } from '../api.js';
import { navigateTo, state, pushTreeEvent, resetTreeEvents } from '../app.js';
import { t, getStateLabel, STATE_KEYS } from '../i18n.js';

const NODE_TYPE_COLORS = {
  decision: 'var(--accent)',
  opportunity: '#7C3AED',
  result: '#0F766E',
  cascade: '#475569',
  risk: 'var(--error)',
  reflection: '#2563EB',
  branch: '#8B5CF6',
};

function sanitizeDisplayTitle(title) {
  const cleaned = (title || '').replace(/[（(][^）)]*[）)]/g, '').trim();
  return cleaned || '综合报告';
}

function renderBacktrackEventLine(event) {
  const icon = event.type === 'branch' ? '◇' : '•';
  const round = event.round !== undefined ? `R${event.round}` : '--';
  const meta = [event.time_label, event.node_type].filter(Boolean).join(' · ');
  return `
    <div class="console-line" style="padding:8px 0;border-bottom:1px solid rgba(198,198,198,0.12);">
      <span class="console-ts">[${round}]</span>
      <span>${icon} ${event.label || '未命名节点'}${meta ? ` <span class="text-muted">/ ${meta}</span>` : ''}</span>
    </div>
  `;
}

function prependBacktrackEvent(listEl, event) {
  if (!listEl || !event?.id) return;
  if (listEl.querySelector(`[data-event-id="${event.id}"]`)) return;
  const wrapper = document.createElement('div');
  wrapper.dataset.eventId = event.id;
  wrapper.innerHTML = renderBacktrackEventLine(event);
  listEl.prepend(wrapper);
}

const futureSelfSessions = new Map();

function getFutureSelfSessionKey(pathId, nodeIndex) {
  return `${pathId}:${nodeIndex}`;
}

function getFutureSelfSession(pathId, nodeIndex) {
  const key = getFutureSelfSessionKey(pathId, nodeIndex);
  if (!futureSelfSessions.has(key)) {
    futureSelfSessions.set(key, {
      agent: null,
      messages: [],
      loading: false,
    });
  }
  return futureSelfSessions.get(key);
}

function renderFutureSelfChat(pathId, node, nodeIndex) {
  const session = getFutureSelfSession(pathId, nodeIndex);
  const messages = session.messages.length
    ? session.messages.map(msg => `
      <div style="padding:10px 12px;background:${msg.role === 'assistant' ? 'var(--surface-low)' : 'var(--white)'};border-left:2px solid ${msg.role === 'assistant' ? 'var(--accent)' : 'var(--outline-variant)'};margin-bottom:8px;">
        <div class="mono-xs" style="margin-bottom:6px;color:${msg.role === 'assistant' ? 'var(--accent)' : 'var(--outline)'};">${msg.role === 'assistant' ? '未来的你' : '你'}</div>
        <div style="font-size:13px;line-height:1.7;color:var(--secondary);white-space:pre-wrap;">${msg.content}</div>
      </div>
    `).join('')
    : `<div class="mono-xs text-muted">和这个节点上的未来的你聊聊。系统会只加载该节点之前的历史，不会读取之后的剧情。</div>`;

  return `
    <div class="card mb-24" style="border-left:3px solid var(--accent);">
      <div class="flex justify-between items-center mb-12" style="gap:12px;flex-wrap:wrap;">
        <div>
          <h3 style="margin-bottom:4px;">和未来的自己对话</h3>
          <div class="mono-xs text-muted">${node.time_label} · ${node.title}</div>
        </div>
        <span class="tag tag-accent">[FUTURE_SELF_AGENT]</span>
      </div>
      ${session.agent ? `<div class="mono-xs text-accent mb-12">${session.agent.name} · ${session.agent.persona || ''}</div>` : ''}
      <div id="future-self-messages">${messages}</div>
      <div class="form-group mt-16" style="margin-bottom:0;">
        <textarea class="form-textarea" id="future-self-input" placeholder="向这个节点上的未来的你提问，例如：如果我现在坚持申请海外大学，真正的代价是什么？" style="min-height:88px;"></textarea>
      </div>
      <div class="flex justify-end mt-12">
        <button class="btn btn-accent" id="btn-future-self-send" ${session.loading ? 'disabled style="opacity:0.5;"' : ''}>
          ${session.loading ? '思考中...' : '发送给未来的你'}
        </button>
      </div>
    </div>
  `;
}

function getSelectedPath(paths = []) {
  if (!state.selectedPathId) return null;
  return paths.find(path => path.id === state.selectedPathId) || null;
}

function setResultsView(view, extra = {}) {
  Object.assign(state, { resultsView: view, ...extra });
}

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

  const currentView = state.resultsView || 'overview';
  const selectedPath = getSelectedPath(paths);

  if (currentView === 'overview') {
    renderOverview(container, paths);
  } else if (currentView === 'detail' && selectedPath) {
    renderDetail(container, selectedPath);
  } else if (currentView === 'advice' && selectedPath) {
    renderAdvice(container, selectedPath);
  } else if (currentView === 'story' && selectedPath) {
    renderStory(container, selectedPath);
  } else if (currentView === 'report') {
    renderReport(container, paths);
  } else if (currentView === 'backtrack' && selectedPath) {
    renderBacktrackView(container, selectedPath);
  } else {
    // Fallback
    setResultsView('overview', { selectedPathId: null, backtrackNodeIndex: null });
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
      setResultsView('detail', { selectedPathId: pathId, backtrackNodeIndex: null });
      renderResults(container);
    });
  });

  // Report button
  document.getElementById('btn-report')?.addEventListener('click', () => {
    setResultsView('report', { backtrackNodeIndex: null });
    renderResults(container);
  });
}

function renderPathCard(path) {
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
  const activeIndex = Math.min(Math.max(state.selectedNodeIndex || 0, 0), Math.max(nodes.length - 1, 0));
  state.selectedNodeIndex = activeIndex;
  const activeNode = nodes[activeIndex];

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
            <div class="node-card ${i === activeIndex ? 'active' : ''}" data-index="${i}">
              <div class="node-type" style="color:${NODE_TYPE_COLORS[n.node_type] || 'var(--outline)'};">${n.node_type}</div>
              <div class="node-title">${n.title}</div>
              <div class="node-time">${n.time_label}</div>
            </div>
          `).join('')}
        </div>
        <div class="mt-24" style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-accent btn-full" id="btn-story" style="background:var(--secondary);color:white;">
            <span class="material-symbols-outlined icon-sm">auto_awesome</span> [${t('btn_get_story')}]
          </button>
          <button class="btn btn-accent btn-full" id="btn-advice">[${t('btn_get_advice')}]</button>
          <button class="btn btn-primary btn-full" id="btn-backtrack" style="background:var(--branch-accent);">
            <span class="material-symbols-outlined icon-sm">undo</span> [回溯推演]
          </button>
        </div>
      </div>

      <!-- Main: Node Detail + State Chart -->
      <div class="detail-main" id="node-detail-container">
        ${activeNode ? renderNodeDetail(path.id, activeNode, activeIndex, nodes.length) : '<p class="p-32 text-muted">No nodes</p>'}
      </div>
    </div>
  `;

  // Back button
  document.getElementById('btn-back-overview').addEventListener('click', () => {
    setResultsView('overview', { selectedPathId: null, backtrackNodeIndex: null });
    renderResults(container);
  });

  // Node card clicks
  container.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.node-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const idx = parseInt(card.dataset.index);
      state.selectedNodeIndex = idx;
      document.getElementById('node-detail-container').innerHTML = renderNodeDetail(path.id, nodes[idx], idx, nodes.length);
      bindFutureSelfChat(container, path, nodes[idx], idx);
    });
  });

  if (activeNode) {
    bindFutureSelfChat(container, path, activeNode, activeIndex);
  }

  // Story button
  container.querySelector('#btn-story').addEventListener('click', () => {
    setResultsView('story');
    renderResults(container);
  });

  // Advice button
  document.getElementById('btn-advice').addEventListener('click', () => {
    setResultsView('advice');
    renderResults(container);
  });

  // Backtrack button
  document.getElementById('btn-backtrack').addEventListener('click', () => {
    setResultsView('backtrack', { backtrackNodeIndex: 0 });
    renderResults(container);
  });
}

function renderNodeDetail(pathId, node, index, total) {
  const stateData = node.state_snapshot || {};
  const actions = node.agent_actions || [];
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

      ${actions.length > 0 ? `
      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">推演细节</h3>
        ${actions.map(a => `
          <div style="padding:10px 12px;border-left:2px solid ${NODE_TYPE_COLORS[node.node_type] || 'var(--accent)'};margin-bottom:10px;background:var(--surface-low);">
            <div class="mono-xs" style="margin-bottom:6px;">[${a.agent_type || 'AGENT'}] ${(a.action_type || 'ACTION').replaceAll('_', ' ')}</div>
            <p style="font-size:13px;color:var(--secondary);line-height:1.6;">${a.narrative || '该轮行动已记录。'}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

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

      ${renderFutureSelfChat(pathId, node, index)}
    </div>
  `;
}

function bindFutureSelfChat(container, path, node, nodeIndex) {
  const sendBtn = document.getElementById('btn-future-self-send');
  const input = document.getElementById('future-self-input');
  if (!sendBtn || !input) return;

  sendBtn.addEventListener('click', async () => {
    const message = input.value.trim();
    if (!message) return;

    const session = getFutureSelfSession(path.id, nodeIndex);
    session.messages.push({ role: 'user', content: message });
    session.loading = true;
    document.getElementById('node-detail-container').innerHTML = renderNodeDetail(path.id, node, nodeIndex, (path.nodes || []).length);
    bindFutureSelfChat(container, path, node, nodeIndex);

    try {
      const history = session.messages.slice(0, -1).map(msg => ({ role: msg.role, content: msg.content }));
      const resp = await api.futureSelfChat(state.projectId, path.id, nodeIndex, message, history);
      session.agent = resp.agent || session.agent;
      session.messages.push({ role: 'assistant', content: resp.reply || '未来的你暂时没有回答。' });
    } catch (e) {
      session.messages.push({ role: 'assistant', content: `未来的你暂时失联：${e.message}` });
    } finally {
      session.loading = false;
      document.getElementById('node-detail-container').innerHTML = renderNodeDetail(path.id, node, nodeIndex, (path.nodes || []).length);
      bindFutureSelfChat(container, path, node, nodeIndex);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// Backtrack / Counterfactual View (§14.2 + §14.4)
// ═══════════════════════════════════════════════════════════════════

function renderBacktrackView(container, path) {
  const nodes = path.nodes || [];
  const backtrackNodeIndex = state.backtrackNodeIndex;
  const selectedNode = backtrackNodeIndex === null ? null : nodes[backtrackNodeIndex];

  container.innerHTML = `
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[COUNTERFACTUAL_ENGINE]</div>
      <div class="flex justify-between items-end mb-32" style="flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:48px;">回溯推演</h1>
          <p class="text-secondary mt-8" style="max-width:680px;">
            选择任意节点，修改条件后重新推演。新的反事实分支会在当前页面实时追加，不再跳转到系统页。
          </p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-from-bt">[← ${t('btn_back')}]</button>
        </div>
      </div>

      <div class="card mb-24" style="border-left:4px solid var(--branch-accent);padding:24px;">
        <h3 style="margin-bottom:16px;">1. 选择回溯节点</h3>
        <p class="mono-xs text-muted mb-16">点击选择你想修改条件的节点，系统会从该节点长出新的反事实分支。</p>
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

      <div class="card mb-24" style="padding:24px;${backtrackNodeIndex === null ? 'opacity:0.5;pointer-events:none;' : ''}">
        <h3 style="margin-bottom:16px;">2. 修改条件</h3>
        <div class="form-group">
          <label class="form-label">修改描述（自然语言）</label>
          <textarea class="form-textarea" id="bt-description" placeholder="例如：假设保研成功 / 假设拿到了大厂 offer / 假设家庭经济好转"></textarea>
        </div>
        <div class="form-group mt-16">
          <label class="form-label">状态参数调整</label>
          <div class="bt-state-controls" id="bt-state-controls">
            ${renderBacktrackStateControls(selectedNode || nodes[0])}
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

      <div id="bt-progress" class="mt-32" style="display:none;">
        <div class="card mb-16" style="padding:24px;border-left:4px solid var(--branch-accent);">
          <div class="console-line pulse" id="bt-status">
            <span class="console-ts">[BT]</span>
            <span>准备回溯推演...</span>
          </div>
          <div class="sim-progress-bar mt-16">
            <div class="sim-progress-fill" id="bt-progress-fill" style="width:0%;background:var(--branch-accent);"></div>
          </div>
        </div>
        <div class="card" style="padding:24px;">
          <div class="flex justify-between items-center mb-16" style="flex-wrap:wrap;gap:8px;">
            <div>
              <h3 style="margin-bottom:4px;">实时回溯分支</h3>
              <div class="mono-xs text-muted">新的树节点会在这里即时出现，随后你可以再切到系统树视图查看全量结构。</div>
            </div>
            <div class="mono-xs text-accent">LIVE_BRANCH_STREAM</div>
          </div>
          <div id="bt-tree-live">
            ${selectedNode ? renderBacktrackEventLine({ id: 'source-preview', type: 'source', round: backtrackNodeIndex + 1, time_label: selectedNode.time_label, node_type: selectedNode.node_type, label: `源节点: ${selectedNode.title}` }) : '<div class="console-line"><span class="console-ts">[--]</span><span>等待选择节点...</span></div>'}
          </div>
          <div id="bt-result-actions" class="mt-16" style="display:none;"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-back-from-bt')?.addEventListener('click', () => {
    setResultsView('detail', { backtrackNodeIndex: null });
    renderResults(container);
  });

  container.querySelectorAll('.bt-node-card').forEach(card => {
    card.addEventListener('click', () => {
      state.backtrackNodeIndex = parseInt(card.dataset.index, 10);
      renderBacktrackView(container, path);
    });
  });

  document.getElementById('bt-rounds')?.addEventListener('input', (e) => {
    document.getElementById('bt-rounds-value').textContent = e.target.value;
  });

  document.getElementById('btn-run-backtrack')?.addEventListener('click', async () => {
    if (backtrackNodeIndex === null) return;

    const description = document.getElementById('bt-description')?.value || '';
    const rounds = parseInt(document.getElementById('bt-rounds')?.value || '6', 10);
    const runBtn = document.getElementById('btn-run-backtrack');
    const progDiv = document.getElementById('bt-progress');
    const statusDiv = document.getElementById('bt-status');
    const progFill = document.getElementById('bt-progress-fill');
    const liveTree = document.getElementById('bt-tree-live');
    const actionBox = document.getElementById('bt-result-actions');

    const modifications = {};
    document.querySelectorAll('.bt-state-slider').forEach(slider => {
      modifications[slider.dataset.key] = parseFloat(slider.value);
    });

    if (progDiv) progDiv.style.display = 'block';
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.style.opacity = '0.5';
    }
    if (liveTree) {
      liveTree.innerHTML = selectedNode
        ? renderBacktrackEventLine({ id: 'source-preview', type: 'source', round: backtrackNodeIndex + 1, time_label: selectedNode.time_label, node_type: selectedNode.node_type, label: `源节点: ${selectedNode.title}` })
        : '';
    }
    if (actionBox) actionBox.style.display = 'none';

    try {
      if (!state.treeEvents?.length) {
        const treeData = await api.getTreeEvents(state.projectId);
        resetTreeEvents(treeData.events || []);
      }

      const resp = await api.backtrack(
        state.projectId,
        path.id,
        backtrackNodeIndex,
        modifications,
        description,
        rounds
      );

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let newPathId = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (statusDiv?.isConnected && event.message) {
              statusDiv.innerHTML = `<span class="console-ts">[BT]</span><span>${event.message}</span>`;
            }
            if (progFill?.isConnected && event.progress !== undefined) {
              progFill.style.width = `${event.progress}%`;
            }

            if (event.phase === 'tree_event' && event.tree_event) {
              pushTreeEvent(event.tree_event);
              prependBacktrackEvent(liveTree, event.tree_event);
            }

            if (event.phase === 'completed') {
              newPathId = event.new_path_id || null;
              state.simComplete = true;
              state.simulationTab = 'tree';
              if (state.project) state.project.status = 'completed';
              if (statusDiv?.isConnected) {
                statusDiv.innerHTML = `<span class="console-ts" style="color:var(--accent);">[DONE]</span><span style="font-weight:700;color:var(--accent);">${event.message}</span>`;
                statusDiv.classList.remove('pulse');
              }
              if (actionBox) {
                actionBox.style.display = 'flex';
                actionBox.style.gap = '8px';
                actionBox.style.flexWrap = 'wrap';
                actionBox.innerHTML = `
                  <button class="btn btn-primary" id="bt-open-tree">查看推演树</button>
                  <button class="btn btn-accent" id="bt-open-path" ${newPathId ? '' : 'disabled style="opacity:0.5;"'}>查看新路径</button>
                `;
                document.getElementById('bt-open-tree')?.addEventListener('click', () => {
                  navigateTo('simulation', { simulationTab: 'tree' });
                });
                document.getElementById('bt-open-path')?.addEventListener('click', () => {
                  if (!newPathId) return;
                  setResultsView('detail', { selectedPathId: newPathId, backtrackNodeIndex: null });
                  renderResults(container);
                });
              }
            }

            if (event.phase === 'error' && statusDiv?.isConnected) {
              statusDiv.innerHTML = `<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">${event.message}</span>`;
              statusDiv.classList.remove('pulse');
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } catch (e) {
      if (statusDiv) {
        statusDiv.innerHTML = `<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">回溯推演失败: ${e.message}</span>`;
        statusDiv.classList.remove('pulse');
      }
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
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
          <h1 style="font-size:44px;">综合报告</h1>
          <p class="text-secondary mt-8">多路径对比、关键节点与下一步建议</p>
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
    setResultsView('overview');
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
        <h2 style="margin-bottom:16px;line-height:1.3;word-break:break-word;">${sanitizeDisplayTitle(report.title)}</h2>
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
    setResultsView('detail');
    renderResults(container);
  });

  document.getElementById('btn-satisfied').addEventListener('click', () => loadAdvice(container, 'satisfied'));
  document.getElementById('btn-unsatisfied').addEventListener('click', () => loadAdvice(container, 'unsatisfied'));
}

async function loadAdvice(container, feedback) {
  const adviceContainer = document.getElementById('advice-content');
  adviceContainer.innerHTML = `<div class="p-32 text-center mono-xs pulse">${t('advice_generating')}</div>`;

  try {
    const advice = await api.getAdvice(state.projectId, state.selectedPathId, feedback);
    
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

// ═══════════════════════════════════════════════════════════════════
// STORY VIEW
// ═══════════════════════════════════════════════════════════════════

async function renderStory(container, path) {
  container.innerHTML = `
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[NARRATIVE_ENGINE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">${t('story_title')}</h1>
          <p class="text-secondary mt-8">AI generated life story for "${path.name}"</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-accent" id="btn-regenerate-story">[重新生成]</button>
          <button class="btn btn-ghost" id="btn-back-detail-from-story">[← ${t('btn_back')}]</button>
        </div>
      </div>

      <div id="story-content">
        <div class="p-48 text-center mono-xs pulse">${t('story_generating')}</div>
      </div>
    </div>
  `;

  document.getElementById('btn-back-detail-from-story').addEventListener('click', () => {
    setResultsView('detail');
    renderResults(container);
  });

  document.getElementById('btn-regenerate-story').addEventListener('click', () => {
    loadStoryContent(container, true);
  });

  loadStoryContent(container, false);
}

async function loadStoryContent(container, regenerate = false) {
  const storyContainer = document.getElementById('story-content');
  if (!storyContainer) return;
  storyContainer.innerHTML = `<div class="p-48 text-center mono-xs pulse">${regenerate ? '正在重新生成剧本...' : t('story_generating')}</div>`;

  try {
    const res = await api.getStory(state.projectId, state.selectedPathId, regenerate);
    let storyText = res.story || res;
    // Basic formatting for presentation
    storyText = storyText.split('\\n').join('<br/>')
                         .split('\\n\\n').join('<br/><br/>')
                         .split('\\n').join('<br/>')
                         .replace(/\\n/g, '<br/>')
                         .replace(/\\r/g, '')
                         .replace(/\\n/g, '<br/>');
    
    // Actually from json `story` might literally just be actual newlines
    if (typeof storyText === 'string') {
      // JSON replaces \n to actual newlines, so we replace them with <br/> for HTML
      storyText = storyText.replace(/\\n/g, '<br/><br/>').replace(/\n/g, '<br/><br/>');
    }
    
    storyContainer.innerHTML = `
      <div class="fade-in card" style="padding: 48px; background: var(--white); box-shadow: 0 4px 24px rgba(0,0,0,0.02); max-width: 800px; margin: 0 auto;">
        <div class="mono-xs text-muted mb-16">${res.cached ? '[已保存缓存]' : '[刚刚重新生成]'}</div>
        <p style="font-size:16px; line-height: 2; color: var(--on-surface); text-indent: 2em; letter-spacing: 0.5px; font-family: var(--font-headline);">
          ${storyText}
        </p>
      </div>
    `;
  } catch (e) {
    storyContainer.innerHTML = `<div class="p-32 text-center text-error">Failed to generate story: ${e.message}</div>`;
  }
}

