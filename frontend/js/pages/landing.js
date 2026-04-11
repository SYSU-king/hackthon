/**
 * Landing Page
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';
import { t } from '../i18n.js';

export function renderLanding(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-left">
        <div class="mono-xs hero-tag">${t('landing_tag')}</div>
        <h1 class="hero-title">${t('landing_title_1')}<br/><em>${t('landing_title_2')}</em></h1>
        <p class="hero-desc">${t('landing_desc')}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="btn-questionnaire">${t('landing_cta')}</button>
          <button class="btn btn-ghost" id="btn-history">${t('landing_history')}</button>
        </div>
        <div class="hero-meta">
          <span class="mono-xs">COORDINATES: 23.1291° N, 113.2644° E</span>
          <div class="hero-meta-divider"></div>
          <span class="mono-xs">TIME_SYNC: ACTIVE</span>
        </div>
      </div>
      <div class="hero-right">
        <div class="bg-grid" style="position:absolute;inset:0;opacity:0.2;"></div>
        <div class="hero-viz">
          <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
            <path d="M50 300 Q 200 300 400 150 T 750 100" stroke="black" stroke-width="1" stroke-dasharray="4 4"/>
            <path d="M50 300 Q 200 300 400 450 T 750 500" stroke="black" stroke-width="1" stroke-dasharray="2 2" opacity="0.3"/>
            <path d="M50 300 L 750 300" stroke="#0F766E" stroke-width="1.5"/>
            <rect x="395" y="145" width="10" height="10" fill="white" stroke="black"/>
            <rect x="395" y="295" width="10" height="10" fill="#0F766E"/>
            <rect x="395" y="445" width="10" height="10" fill="white" stroke="black"/>
            <text x="415" y="155" font-family="Space Grotesk" font-size="10" fill="black">BRANCH_A: OPTIMAL</text>
            <text x="415" y="305" font-family="Space Grotesk" font-size="10" fill="#0F766E">CURRENT_PATH</text>
            <text x="415" y="455" font-family="Space Grotesk" font-size="10" fill="black">BRANCH_B: DEGRADED</text>
            <circle cx="50" cy="300" r="4" fill="black"/>
            <circle cx="400" cy="300" r="6" fill="#0F766E"/>
            <circle cx="750" cy="300" r="4" fill="black"/>
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

    <!-- Methodology Section -->
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

    <!-- Footer -->
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

  // Event handlers
  document.getElementById('btn-questionnaire').addEventListener('click', async () => {
    try {
      const project = await api.createProject('New Simulation');
      state.projectId = project.id;
      state.project = project;
      navigateTo('onboarding');
    } catch (e) {
      alert('Failed to create project: ' + e.message);
    }
  });

  document.getElementById('btn-history').addEventListener('click', async () => {
    try {
      const projects = await api.listProjects();
      if (projects.length > 0) {
        const last = projects[0];
        state.projectId = last.id;
        const full = await api.getProject(last.id);
        state.project = full;
        if (full.status === 'completed') {
          state.simComplete = true;  // prevent re-simulation
          navigateTo('results');
        } else {
          navigateTo('onboarding');
        }
      } else {
        alert('No history projects found. Start a new simulation!');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  });
}
