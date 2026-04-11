/**
 * Parameters Configuration Page
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';

let params = [
  { name: '', description: '', priority: 'primary', weight: 1.0 },
];

const PRIORITY_OPTIONS = ['primary', 'secondary', 'constraint'];
const PRIORITY_LABELS = { primary: '主参数', secondary: '次参数', constraint: '约束条件' };

export function renderParameters(container) {
  container.innerHTML = `
    <div style="padding:48px 64px;max-width:960px;margin:0 auto;">
      <div class="mono-xs text-muted mb-8">PROJECT_ID: ${state.projectId} // PHASE: PARAMETER_DEFINITION</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:48px;">
        <h1 style="font-size:40px;">Define Concern Parameters</h1>
        <p class="text-secondary mt-8" style="font-size:16px;max-width:600px;">
          明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。
        </p>
      </div>

      <div id="params-list">
        ${params.map((p, i) => renderParamCard(p, i)).join('')}
      </div>

      <button class="btn btn-ghost mt-16" id="btn-add-param">
        <span class="material-symbols-outlined icon-sm">add</span> [ADD_PARAMETER]
      </button>

      <div class="card mt-32" style="background:var(--surface-low);padding:24px;">
        <h2 style="margin-bottom:16px;">[SIMULATION_CONFIG]</h2>
        <div class="grid-2 gap-16">
          <div class="form-group">
            <label class="form-label">推演轮数</label>
            <div class="slider-container">
              <input type="range" class="slider" id="rounds-slider" min="4" max="20" value="12" />
              <span class="mono-sm" id="rounds-value" style="min-width:40px;">12</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">时间单位</label>
            <select class="form-select" id="time-unit">
              <option value="quarter">每季度</option>
              <option value="semester">每学期</option>
              <option value="year">每年</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-32">
        <button class="btn btn-ghost" id="btn-back">[BACK_TO_PROFILE]</button>
        <button class="btn btn-accent" id="btn-start">[START_SIMULATION]</button>
      </div>
    </div>
  `;

  // Bind events
  document.getElementById('btn-add-param').addEventListener('click', () => {
    params.push({ name: '', description: '', priority: 'secondary', weight: 0.7 });
    renderParameters(container);
  });

  document.getElementById('rounds-slider').addEventListener('input', (e) => {
    document.getElementById('rounds-value').textContent = e.target.value;
  });

  document.getElementById('btn-back').addEventListener('click', () => navigateTo('onboarding'));

  document.getElementById('btn-start').addEventListener('click', async () => {
    collectParams();
    const validParams = params.filter(p => p.name.trim());
    if (validParams.length === 0) {
      alert('请至少填写一个关注参数');
      return;
    }
    try {
      await api.submitParameters(state.projectId, validParams);
      const rounds = parseInt(document.getElementById('rounds-slider').value);
      const timeUnit = document.getElementById('time-unit').value;
      state.simConfig = { rounds, timeUnit };
      navigateTo('simulation');
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  });

  // Remove buttons
  container.querySelectorAll('.param-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      params.splice(idx, 1);
      if (params.length === 0) params.push({ name: '', description: '', priority: 'primary', weight: 1.0 });
      renderParameters(container);
    });
  });

  // Priority select
  container.querySelectorAll('.priority-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(sel.dataset.index);
      params[idx].priority = e.target.value;
    });
  });
}

function renderParamCard(p, i) {
  return `
    <div class="param-card">
      <div class="param-priority">
        <select class="form-select priority-select" data-index="${i}" style="font-size:10px;padding:6px;">
          ${PRIORITY_OPTIONS.map(opt => `
            <option value="${opt}" ${p.priority === opt ? 'selected' : ''}>${PRIORITY_LABELS[opt]}</option>
          `).join('')}
        </select>
      </div>
      <div class="param-name" style="flex:1;">
        <input class="form-input param-name-input" data-index="${i}" value="${p.name}" placeholder="如：保研 vs 就业" style="border-bottom-color:var(--accent);" />
      </div>
      <div class="param-weight" style="width:180px;">
        <div class="slider-container">
          <input type="range" class="slider param-weight-slider" data-index="${i}" min="0" max="1" step="0.1" value="${p.weight}" />
          <span class="mono-xs">${p.weight.toFixed(1)}</span>
        </div>
      </div>
      <button class="param-remove" data-index="${i}">×</button>
    </div>
  `;
}

function collectParams() {
  document.querySelectorAll('.param-name-input').forEach(input => {
    const idx = parseInt(input.dataset.index);
    params[idx].name = input.value;
  });
  document.querySelectorAll('.param-weight-slider').forEach(slider => {
    const idx = parseInt(slider.dataset.index);
    params[idx].weight = parseFloat(slider.value);
  });
}
