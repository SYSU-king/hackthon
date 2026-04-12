/**
 * Landing Page
 */

import { api } from '../api.js';
import { navigateTo, hydrateProjectState, resetSessionState, state } from '../app.js';
import { t } from '../i18n.js';

export function renderLanding(container) {
  container.innerHTML = `
    <section class="hero">
      <div class="hero-left">
        <div class="mono-xs hero-tag">${t('landing_tag')}</div>
        <h1 class="hero-title">${t('landing_title_1')}<br/><em>${t('landing_title_2')}</em></h1>
        <p class="hero-desc">${t('landing_desc')}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="btn-questionnaire">${t('landing_cta')}</button>
          <button class="btn btn-ghost" id="btn-history">${t('landing_history')}</button>
        </div>
        <div id="history-panel" class="card mt-24" style="display:none;padding:24px;background:rgba(255,255,255,0.92);border:1px solid rgba(15,118,110,0.18);"></div>
        <input type="file" id="history-file-input" accept="application/json,.json" style="display:none;" />
        <div class="hero-meta">
          <span class="mono-xs">COORDINATES: 23.1291° N, 113.2644° E</span>
          <div class="hero-meta-divider"></div>
          <span class="mono-xs">TIME_SYNC: ACTIVE</span>
        </div>
      </div>
      <div class="hero-right">
        <div class="bg-grid" style="position:absolute;inset:0;opacity:0.2;"></div>
        <div class="hero-viz">
          <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
            <defs>
              <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-violet" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="fade-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0F766E" stop-opacity="0.1" />
                <stop offset="50%" stop-color="#0F766E" stop-opacity="1" />
                <stop offset="100%" stop-color="#0F766E" stop-opacity="0.1" />
              </linearGradient>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0F766E" />
              </marker>
              <marker id="arrow-violet" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#7C3AED" />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#BA1A1A" />
              </marker>
            </defs>
            
            <!-- Grid Background -->
            <g stroke="rgba(198, 198, 198, 0.15)" stroke-width="1">
              <line x1="0" y1="150" x2="800" y2="150" />
              <line x1="0" y1="300" x2="800" y2="300" />
              <line x1="0" y1="450" x2="800" y2="450" />
              <line x1="200" y1="0" x2="200" y2="600" />
              <line x1="400" y1="0" x2="400" y2="600" />
              <line x1="600" y1="0" x2="600" y2="600" />
            </g>

            <!-- Coordinate Crosshairs -->
            <path d="M390 300 H410 M400 290 V310" stroke="rgba(198, 198, 198, 0.4)" stroke-width="1" />
            <path d="M390 150 H410 M400 140 V160" stroke="rgba(198, 198, 198, 0.4)" stroke-width="1" />
            <path d="M390 450 H410 M400 440 V460" stroke="rgba(198, 198, 198, 0.4)" stroke-width="1" />

            <!-- Path BRANCH_A (Optimal) -->
            <path id="pathA" d="M50 300 Q 200 300 400 150 T 750 80" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.7" marker-end="url(#arrow-violet)" />
            <circle r="3" fill="#7C3AED" filter="url(#glow-violet)">
              <animateMotion dur="4s" repeatCount="indefinite">
                <mpath href="#pathA" />
              </animateMotion>
            </circle>

            <!-- Path BRANCH_B (Degraded) -->
            <path id="pathB" d="M50 300 Q 200 300 400 450 T 750 520" fill="none" stroke="#BA1A1A" stroke-width="1" stroke-dasharray="2 4" opacity="0.4" marker-end="url(#arrow-red)" />
            <circle r="3" fill="#BA1A1A">
              <animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                <mpath href="#pathB" />
              </animateMotion>
            </circle>

            <!-- CURRENT_PATH -->
            <path id="pathCurrent" d="M50 300 L 750 300" fill="none" stroke="#0F766E" stroke-width="2" marker-end="url(#arrow-teal)" />
            <!-- Glowing current wave layer -->
            <path d="M50 300 L 750 300" fill="none" stroke="#0F766E" stroke-width="4" opacity="0.4" filter="url(#glow-teal)">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
            </path>
            
            <circle r="4" fill="#0F766E" filter="url(#glow-teal)">
              <animateMotion dur="3s" repeatCount="indefinite">
                <mpath href="#pathCurrent" />
              </animateMotion>
            </circle>

            <!-- Nodes & Labels -->
            <!-- Optimal Branch Label -->
            <rect x="395" y="145" width="10" height="10" fill="white" stroke="#7C3AED"/>
            <text x="415" y="142" font-family="var(--font-mono)" font-size="10" fill="#7C3AED" font-weight="bold">BRANCH_A: OPTIMAL / +0.44δ</text>
            
            <!-- Current Branch Label -->
            <rect x="395" y="295" width="10" height="10" fill="#0F766E" filter="url(#glow-teal)"/>
            <text x="415" y="285" font-family="var(--font-mono)" font-size="10" fill="#0F766E" font-weight="bold" letter-spacing="1">CURRENT_PATH / STATUS: LIVE</text>
            
            <!-- Degraded Branch Label -->
            <rect x="395" y="445" width="10" height="10" fill="white" stroke="#BA1A1A" opacity="0.6"/>
            <text x="415" y="465" font-family="var(--font-mono)" font-size="10" fill="#BA1A1A" opacity="0.8">BRANCH_B: DEGRADED / -0.21δ</text>

            <!-- Start & End Anchors -->
            <circle cx="50" cy="300" r="5" fill="var(--on-surface)"/>
            <circle cx="50" cy="300" r="10" fill="none" stroke="var(--on-surface)" stroke-dasharray="2 2" stroke-width="1">
              <animateTransform attributeName="transform" type="rotate" from="0 50 300" to="360 50 300" dur="10s" repeatCount="indefinite"/>
            </circle>
            
            <circle cx="400" cy="300" r="6" fill="#0F766E"/>
            <circle cx="750" cy="300" r="3" fill="var(--outline)"/>
          </svg>
          <div style="position:absolute;top:40px;left:40px;" class="mono-xs text-muted">NODE_ID: 0x4F2A<br/><span class="status-dot status-active" style="display:inline-block;margin-right:4px;"></span>LIVE</div>
          <div style="position:absolute;bottom:40px;right:40px;text-align:right;" class="mono-xs text-muted">
            LIVE_RENDER_ACTIVE
            <div style="display:flex;gap:4px;justify-content:flex-end;margin-top:8px;">
              <div style="width:16px;height:4px;background:#0F766E;"></div>
              <div style="width:16px;height:4px;background:#000;"></div>
              <div style="width:16px;height:4px;background:#000;"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="methodology" style="background:var(--surface);">
      <div class="max-w-7xl">
        <div class="method-grid">
          <div class="method-index">
            <h2>[CORE_METHODOLOGY]</h2>
            <div style="margin-top:32px;">
              <div class="method-item"><span class="mono-xs text-muted method-num">01.0</span><span class="method-title">Parameterization</span></div>
              <div class="method-item"><span class="mono-xs text-muted method-num">02.0</span><span class="method-title">Path Branching</span></div>
              <div class="method-item"><span class="mono-xs text-muted method-num">03.0</span><span class="method-title">Entropy Mapping</span></div>
            </div>
          </div>
          <div>
            <div>
              <h3 class="text-accent">参数化建模</h3>
              <p class="method-detail">
                每个人生决策节点被赋予数值权重。我们将定性的人生选择 — 学业转向、职业节点、健康指标 —
                转化为可量化的向量。减少模糊性，计算未来事件的概率密度。
              </p>
            </div>
            <div style="padding-top:32px;border-top:1px solid rgba(198,198,198,0.3);margin-top:32px;">
              <h3>智能体驱动</h3>
              <p class="method-detail">
                系统自动生成 8-15 个影响角色（家人、导师、雇主、城市…），
                每个角色拥有独立立场、资源和行为模式，形成多维博弈。
              </p>
            </div>
          </div>
          <div>
            <div>
              <h3 class="text-accent">路径分支</h3>
              <p class="method-detail">
                结果不是线性的。引擎绘制「分支概率树」，可视化单个变量变化的连锁效应。
                通过推演 12-20 轮迭代，识别成功最可能聚集的「稳定走廊」。
              </p>
            </div>
            <div style="padding-top:32px;border-top:1px solid rgba(198,198,198,0.3);margin-top:32px;">
              <div class="method-log">
                <span class="mono-xs muted" style="display:block;margin-bottom:8px;">SYSTEM_LOG // REF: BRANCH_B</span>
                <div class="method-log-row"><span>STOCHASTIC_DRIFT:</span><span class="text-accent">0.0024</span></div>
                <div class="method-log-row"><span>RECURSION_DEPTH:</span><span>64_BIT</span></div>
                <div class="method-log-row"><span>MODEL_CONFIDENCE:</span><span>98.2%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="app-footer">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">LIFEPATH-ENGINE</div>
          <p class="footer-text">
            The LifePath Engine is a tool for life-path simulation and decision support.
            All simulations are based on multi-agent modeling and do not constitute deterministic prophecy.
          </p>
        </div>
        <div>
          <h4 class="footer-heading">[SYSTEM_LINKS]</h4>
          <a class="footer-link" href="#">API_DOCUMENTATION</a>
          <a class="footer-link" href="#">SECURITY_PROTOCOL</a>
          <a class="footer-link" href="#">NODE_STATUS</a>
        </div>
        <div>
          <h4 class="footer-heading">[LEGAL_METADATA]</h4>
          <span class="footer-link">PRIVACY_MANIFEST</span>
          <span class="footer-link">LICENSE_AGREEMENT</span>
          <span class="footer-link">ENCRYPTION_STANDARDS</span>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="flex items-center gap-8">
          <span class="status-dot status-active"></span>
          <span class="mono-xs">ALL_SYSTEMS_OPERATIONAL</span>
        </div>
        <span class="mono-xs muted">© 2025 LIFEPATH-ENGINE. Multi-agent life-path engine.</span>
      </div>
    </footer>
  `;

  const historyPanel = document.getElementById('history-panel');
  const fileInput = document.getElementById('history-file-input');

  document.getElementById('btn-questionnaire').addEventListener('click', async () => {
    try {
      resetSessionState();
      const project = await api.createProject('New Simulation');
      hydrateProjectState(project, { simComplete: false });
      navigateTo('onboarding');
    } catch (e) {
      alert('Failed to create project: ' + e.message);
    }
  });

  document.getElementById('btn-history').addEventListener('click', async () => {
    const isOpen = historyPanel.style.display === 'block';
    historyPanel.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      await renderHistoryPanel(historyPanel, fileInput);
    }
  });

  fileInput.addEventListener('change', async (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    try {
      const raw = await file.text();
      const payload = JSON.parse(raw);
      const imported = await api.importProject(payload);
      openProject(imported);
    } catch (e) {
      alert('JSON 导入失败: ' + e.message);
    } finally {
      event.target.value = '';
    }
  });
}

async function renderHistoryPanel(panel, fileInput) {
  panel.innerHTML = `
    <div class="mono-xs text-accent" style="margin-bottom:8px;">[HISTORY_IMPORT]</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:20px;">
      <div style="max-width:520px;">
        <h3 style="margin-bottom:8px;">从 JSON 或已有项目进入系统</h3>
        <p class="text-secondary" style="font-size:14px;line-height:1.7;">
          历史记录现在支持直接选择本地 JSON 导入，也支持一键加载内置高级演示档。导入后会变成系统里的正式项目，可直接查看推演树、图谱和报告。
        </p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" id="btn-import-json">导入本地 JSON</button>
        <button class="btn btn-accent" id="btn-load-demo">加载演示 JSON</button>
      </div>
    </div>
    <div id="history-projects" class="grid gap-12"></div>
  `;

  document.getElementById('btn-import-json')?.addEventListener('click', () => fileInput.click());
  document.getElementById('btn-load-demo')?.addEventListener('click', async () => {
    try {
      const resp = await fetch('/demo/high-end-demo.json');
      if (!resp.ok) throw new Error('演示 JSON 读取失败');
      const payload = await resp.json();
      const imported = await api.importProject(payload);
      openProject(imported);
    } catch (e) {
      alert('加载演示档失败: ' + e.message);
    }
  });

  try {
    const projects = await api.listProjects();
    const list = document.getElementById('history-projects');
    if (!projects.length) {
      list.innerHTML = `<div class="mono-xs text-muted">当前没有系统内项目，优先试试内置演示 JSON。</div>`;
      return;
    }

    list.innerHTML = projects.map(project => `
      <div class="card" style="padding:18px 20px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.75);">
        <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;">
          <div>
            <div style="font-weight:700;margin-bottom:6px;">${project.title}</div>
            <div class="mono-xs text-muted">ID: ${project.id} · STATUS: ${project.status} · ${project.created_at}</div>
          </div>
          <span class="tag tag-${project.status === 'completed' ? 'accent' : 'outline'}">${project.status.toUpperCase()}</span>
        </div>
        <div class="flex gap-8 mt-16" style="flex-wrap:wrap;">
          <button class="btn btn-primary history-open-view" data-project-id="${project.id}" style="padding:10px 18px;">直接查看</button>
          <button class="btn btn-ghost history-open-continue" data-project-id="${project.id}" style="padding:10px 18px;">继续操作</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.history-open-view').forEach(el => {
      el.addEventListener('click', async () => {
        const full = await api.getProject(el.dataset.projectId);
        openProject(full, 'view');
      });
    });

    list.querySelectorAll('.history-open-continue').forEach(el => {
      el.addEventListener('click', async () => {
        const full = await api.getProject(el.dataset.projectId);
        openProject(full, 'continue');
      });
    });
  } catch (e) {
    document.getElementById('history-projects').innerHTML = `<div class="mono-xs text-error">历史记录读取失败: ${e.message}</div>`;
  }
}

function openProject(project, mode = 'continue') {
  hydrateProjectState(project);

  if (mode === 'view') {
    if (project.status === 'completed' || (project.paths || []).length) {
      navigateTo('results');
    } else if (project.status === 'configured') {
      navigateTo('simulation');
    } else if (project.status === 'profiled') {
      navigateTo('parameters');
    } else {
      navigateTo('onboarding');
    }
    return;
  }

  if (project.status === 'completed' || (project.paths || []).length) {
    navigateTo('simulation', { simulationTab: 'tree' });
  } else if (project.status === 'configured') {
    navigateTo('simulation');
  } else if (project.status === 'profiled') {
    navigateTo('parameters');
  } else {
    navigateTo('onboarding');
  }
}
