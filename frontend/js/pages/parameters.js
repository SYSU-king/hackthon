/**
 * Parameters Configuration Page
 * Includes: concern parameters, simulation rounds, time unit, agent count
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';

let params = [
  { name: '', description: '', priority: 'primary', weight: 1.0 },
];
let paramsProjectId = null;

const PRIORITY_OPTIONS = ['primary', 'secondary', 'constraint'];
const PRIORITY_LABELS = { primary: '主参数', secondary: '次参数', constraint: '约束条件' };

export function renderParameters(container) {
  if (paramsProjectId !== state.projectId) {
    paramsProjectId = state.projectId;
    if (Array.isArray(state.project?.parameters) && state.project.parameters.length > 0) {
      params = state.project.parameters.map(param => ({
        name: param.name || '',
        description: param.description || '',
        priority: param.priority || 'primary',
        weight: Number.isFinite(param.weight) ? param.weight : 1.0,
      }));
    } else {
      params = [{ name: '', description: '', priority: 'primary', weight: 1.0 }];
    }
  }

  if (Array.isArray(state.project?.parameters) && state.project.parameters.length > 0 && params.length === 0) {
    params = state.project.parameters.map(param => ({
      name: param.name || '',
      description: param.description || '',
      priority: param.priority || 'primary',
      weight: Number.isFinite(param.weight) ? param.weight : 1.0,
    }));
  }

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
            <div class="mono-xs text-muted" style="margin-top:4px;">每轮 ≈ 1个季度/学期</div>
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
        <div class="form-group mt-16">
          <label class="form-label">智能体数量</label>
          <div class="slider-container">
            <input type="range" class="slider" id="agent-count-slider" min="3" max="12" value="8" />
            <span class="mono-sm" id="agent-count-value" style="min-width:40px;">8</span>
          </div>
          <div class="mono-xs text-muted" style="margin-top:4px;">
            智能体包括：Self, Family, Mentor, School, Employer, City, Industry, Risk 等。数量越多推演越丰富，但耗时更长。
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
    collectParams(container);
    params.push({ name: '', description: '', priority: 'secondary', weight: 0.7 });
    renderParameters(container);
  });

  document.getElementById('rounds-slider').addEventListener('input', (e) => {
    document.getElementById('rounds-value').textContent = e.target.value;
  });

  document.getElementById('agent-count-slider').addEventListener('input', (e) => {
    document.getElementById('agent-count-value').textContent = e.target.value;
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
      if (state.project) {
        state.project.parameters = validParams;
        state.project.status = 'configured';
      }
      const rounds = parseInt(document.getElementById('rounds-slider').value);
      const timeUnit = document.getElementById('time-unit').value;
      const agentCount = parseInt(document.getElementById('agent-count-slider').value);
      state.simConfig = { rounds, timeUnit, agentCount };
      navigateTo('simulation');
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  });

  // Remove buttons
  container.querySelectorAll('.param-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      collectParams(container);
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

  container.querySelectorAll('.param-weight-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = parseInt(slider.dataset.index);
      const value = parseFloat(e.target.value);
      params[idx].weight = value;
      const output = container.querySelector(`.param-weight-value[data-index="${idx}"]`);
      if (output) output.textContent = value.toFixed(1);
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
        <input class="form-input param-name-input" data-index="${i}" value="${p.name}" placeholder="如：国内读研 vs 申请海外大学" style="border-bottom-color:var(--accent);" />
      </div>
      <div class="param-weight" style="width:180px;">
        <div class="slider-container">
          <input type="range" class="slider param-weight-slider" data-index="${i}" min="0" max="1" step="0.1" value="${p.weight}" />
          <span class="mono-xs param-weight-value" data-index="${i}">${p.weight.toFixed(1)}</span>
        </div>
      </div>
      <button class="param-remove" data-index="${i}">×</button>
    </div>
  `;
}

function collectParams(scope = document) {
  scope.querySelectorAll('.param-name-input').forEach(input => {
    const idx = parseInt(input.dataset.index);
    params[idx].name = input.value;
  });
  scope.querySelectorAll('.param-weight-slider').forEach(slider => {
    const idx = parseInt(slider.dataset.index);
    params[idx].weight = parseFloat(slider.value);
  });
}
