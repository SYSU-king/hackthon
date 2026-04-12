/**
 * About Page — Project Mission & Introduction
 * Design inspired by "The Forensic Expert" / Technical Journal aesthetic
 */

import { navigateTo } from '../app.js';
import { t, getLang } from '../i18n.js';

export function renderAbout(container) {
  const lang = getLang();

  container.innerHTML = `
    <!-- Background Grid Layer -->
    <div class="about-bg-grid"></div>

    <main class="about-main">
      <!-- ═══ Hero Section ═══ -->
      <header class="about-hero">
        <div class="about-hero-body">
          <div class="about-hero-badges about-reveal">
            <span class="about-badge-orange">Hackathon Track: AI for Social Good</span>
            <div class="about-hairline-h"></div>
            <span class="about-sys-label">[System Log: LP-01-MISSION]</span>
          </div>
          <h1 class="about-hero-title about-stagger-text">
            <span class="about-reveal-word" style="animation-delay:0.1s">LIFEPATH-</span><br/>
            <span class="about-reveal-word" style="animation-delay:0.2s">ENGINE:</span><br/>
            <span class="about-reveal-word about-hero-italic" style="animation-delay:0.3s">${t('about_hero_accent')}</span>
          </h1>
          <p class="about-hero-desc about-reveal" style="animation-delay:0.4s">
            ${t('about_hero_desc')}
          </p>
        </div>
        <div class="about-hero-sidebar about-reveal" style="animation-delay:0.5s">
          <div class="about-status-panel">
            <div class="about-status-header">
              <div class="about-status-dot"></div>
              <span class="about-sys-label" style="letter-spacing:0.2em;font-weight:700">System Status</span>
            </div>
            <div class="about-status-rows">
              <div class="about-status-row">
                <span>CORE_ENGINE</span>
                <span class="about-status-val-black">Multi-Agent</span>
              </div>
              <div class="about-status-row">
                <span>SIMULATION_TYPE</span>
                <span class="about-status-val-accent">Tree-Based</span>
              </div>
              <div class="about-status-row">
                <span>TRACK</span>
                <span class="about-status-val-black">AI向善</span>
              </div>
              <div class="about-status-row-footer">
                <span class="about-sys-label" style="font-size:9px;letter-spacing:0">Target Vector:</span>
                <div class="about-vector-hash">0x4F2A...SOCIAL_GOOD</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══ Section: The Problem ═══ -->
      <section class="about-section about-section-border-top">
        <div class="about-section-grid">
          <div class="about-section-left">
            <span class="about-section-tag">${t('about_problem_tag')}</span>
            <h2 class="about-section-title">${t('about_problem_title')}</h2>
            <p class="about-section-body">${t('about_problem_body')}</p>
            <div class="about-insight-box">
              <span class="about-sys-label" style="display:block;margin-bottom:8px">Technical Insight</span>
              <p class="about-insight-text">${t('about_problem_insight')}</p>
            </div>
          </div>
          <div class="about-section-right about-viz-panel">
            <div class="about-viz-label">Model: Outcome Divergence [LP-X]</div>
            <div class="about-svg-container">
              <svg class="about-svg" viewBox="0 0 800 400">
                <path class="about-path-bg" d="M0,350 Q200,350 400,200 T800,50"></path>
                <path class="about-path-anim" d="M0,350 Q200,350 400,200 T800,50"></path>
                <circle class="about-node-start" cx="0" cy="350" r="4"></circle>
                <circle class="about-node-mid" cx="400" cy="200" r="6"></circle>
                <circle class="about-node-end" cx="800" cy="50" r="4"></circle>
                <line class="about-path-branch" x1="400" x2="800" y1="200" y2="380" stroke-dasharray="4"></line>
                <text class="about-svg-text-accent" x="415" y="190">Critical Divergence</text>
                <text class="about-svg-text-muted" x="700" y="370">Sub-optimal Path</text>
              </svg>
            </div>
            <div class="about-stats-row">
              <div class="about-stat-item">
                <span class="about-stat-label">${t('about_stat_cost')}</span>
                <div class="about-stat-value">${t('about_stat_cost_val')}</div>
              </div>
              <div class="about-stat-item">
                <span class="about-stat-label">${t('about_stat_gap')}</span>
                <div class="about-stat-value about-text-accent">${t('about_stat_gap_val')}</div>
              </div>
              <div class="about-stat-item">
                <span class="about-stat-label">${t('about_stat_anxiety')}</span>
                <div class="about-stat-value">${t('about_stat_anxiety_val')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Section: System Logic (Multi-Agent) ═══ -->
      <section class="about-section">
        <div class="about-logic-header">
          <h2 class="about-logic-title">System Logic</h2>
          <span class="about-logic-sub">[Multi-Agent Orchestration]</span>
        </div>
        <div class="about-agents-grid">
          <div class="about-agent-card">
            <div class="about-agent-icon">
              <span class="material-symbols-outlined">person</span>
            </div>
            <h3 class="about-agent-name">Agent 01: ${t('about_agent1_name')}</h3>
            <p class="about-agent-desc">${t('about_agent1_desc')}</p>
            <div class="about-agent-module">Module: Persona_Vector_Init</div>
          </div>
          <div class="about-agent-card">
            <div class="about-agent-icon about-agent-icon-accent">
              <span class="material-symbols-outlined">groups</span>
            </div>
            <h3 class="about-agent-name">Agent 02: ${t('about_agent2_name')}</h3>
            <p class="about-agent-desc">${t('about_agent2_desc')}</p>
            <div class="about-agent-module">Module: Network_Stress_Test</div>
          </div>
          <div class="about-agent-card">
            <div class="about-agent-icon">
              <span class="material-symbols-outlined">auto_graph</span>
            </div>
            <h3 class="about-agent-name">Agent 03: ${t('about_agent3_name')}</h3>
            <p class="about-agent-desc">${t('about_agent3_desc')}</p>
            <div class="about-agent-module">Module: Success_Path_RAG</div>
          </div>
        </div>
      </section>

      <!-- ═══ Section: Core Features ═══ -->
      <section class="about-section about-section-border-top">
        <div class="about-section-grid">
          <div class="about-section-sidebar-sticky">
            <span class="about-section-tag">${t('about_features_tag')}</span>
            <h2 class="about-section-title">${t('about_features_title')}</h2>
            <div class="about-feature-nav">
              <div class="about-feature-nav-item about-feature-nav-active">01 / ${t('about_feature1_nav')}</div>
              <div class="about-feature-nav-item">02 / ${t('about_feature2_nav')}</div>
              <div class="about-feature-nav-item">03 / ${t('about_feature3_nav')}</div>
            </div>
          </div>
          <div class="about-features-content">
            <div class="about-feature-block">
              <div class="about-feature-block-header">
                <span class="about-sys-label" style="color:var(--outline)">Feature_01</span>
                <h3 class="about-feature-block-title">${t('about_feature1_title')}</h3>
              </div>
              <div class="about-feature-block-body">
                <p class="about-feature-desc">${t('about_feature1_desc')}</p>
              </div>
            </div>
            <div class="about-feature-block">
              <div class="about-feature-block-header">
                <span class="about-sys-label" style="color:var(--outline)">Feature_02</span>
                <h3 class="about-feature-block-title">${t('about_feature2_title')}</h3>
              </div>
              <div class="about-feature-block-body">
                <p class="about-feature-desc">${t('about_feature2_desc')}</p>
              </div>
            </div>
            <div class="about-feature-block">
              <div class="about-feature-block-header">
                <span class="about-sys-label" style="color:var(--outline)">Feature_03</span>
                <h3 class="about-feature-block-title">${t('about_feature3_title')}</h3>
              </div>
              <div class="about-feature-block-body">
                <p class="about-feature-desc">${t('about_feature3_desc')}</p>
              </div>
            </div>

            <!-- Live console stream -->
            <div class="about-console">
              <div class="about-console-header">
                <span class="about-sys-label">Live Engine Stream</span>
                <div class="about-console-status">
                  <span class="about-console-dot"></span>
                  <span class="about-sys-label">Processing...</span>
                </div>
              </div>
              <div class="about-console-body">
                <div>[SYSTEM] FETCHING SOCIO_ECONOMIC_TRENDS_2025... DONE</div>
                <div>[AGENT_REF] MAPPING PSYCHOLOGICAL_RESILIENCE_VECTOR... DONE</div>
                <div>[ENGINE] GENERATING 10,000 MONTE CARLO ITERATIONS...</div>
                <div class="about-console-warn">[WARNING] HIGH_VARIANCE_DETECTED IN QUARTILE 4</div>
                <div>[SYSTEM] OPTIMIZING FOR MAX_STABILITY_OUTCOME...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Section: Technical Architecture ═══ -->
      <section class="about-section">
        <div class="about-tech-panel">
          <div class="about-tech-badge">System Architecture [STABLE]</div>
          <div class="about-section-grid">
            <div class="about-tech-left">
              <div class="about-tech-block">
                <span class="about-sys-label" style="display:block;margin-bottom:16px">API SNAPSHOT</span>
                <div class="about-tech-api">
                  <pre><span class="about-api-method">GET</span> /engine/v1/inference_nodes
{
  "active_nodes": 124,
  "logic_framework": "Multi-Agent-ReAct",
  "memory_depth": "Recursive-RAG",
  "viz_engine": "Canvas-2D-Projection"
}</pre>
                </div>
              </div>
              <div class="about-tech-block" style="margin-top:32px">
                <span class="about-sys-label" style="display:block;margin-bottom:16px">TECH STACK</span>
                <div class="about-tech-stack-grid">
                  <div class="about-tech-stack-card">
                    <div class="about-tech-stack-name">LLM-01</div>
                    <div class="about-tech-stack-role">Context Engine</div>
                  </div>
                  <div class="about-tech-stack-card">
                    <div class="about-tech-stack-name">VectorDB</div>
                    <div class="about-tech-stack-role">Long-Term Memory</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="about-tech-right">
              <h2 class="about-tech-title">${t('about_tech_title')}</h2>
              <p class="about-tech-desc">${t('about_tech_desc')}</p>
              <div class="about-tech-metrics">
                <div>
                  <div class="about-tech-metric-val">2.4M</div>
                  <div class="about-tech-metric-label">${t('about_tech_paths')}</div>
                </div>
                <div>
                  <div class="about-tech-metric-val">94%</div>
                  <div class="about-tech-metric-label">${t('about_tech_confidence')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Section: Social Impact ═══ -->
      <section class="about-section">
        <div class="about-impact-grid">
          <div class="about-impact-card">
            <div class="about-impact-num">01</div>
            <h3 class="about-impact-title">${t('about_impact1_title')}</h3>
            <p class="about-impact-desc">${t('about_impact1_desc')}</p>
          </div>
          <div class="about-impact-card">
            <div class="about-impact-num">02</div>
            <h3 class="about-impact-title">${t('about_impact2_title')}</h3>
            <p class="about-impact-desc">${t('about_impact2_desc')}</p>
          </div>
          <div class="about-impact-card">
            <div class="about-impact-num">03</div>
            <h3 class="about-impact-title">${t('about_impact3_title')}</h3>
            <p class="about-impact-desc">${t('about_impact3_desc')}</p>
          </div>
        </div>
      </section>

      <!-- ═══ Final CTA (Vision) ═══ -->
      <section class="about-cta">
        <div class="about-cta-bg-ring about-cta-ring-lg"></div>
        <div class="about-cta-bg-ring about-cta-ring-sm"></div>
        <div class="about-cta-inner">
          <span class="about-cta-tag">Final Transmission</span>
          <blockquote class="about-cta-quote about-stagger-text">
            <span class="about-reveal-word" style="animation-delay:0.1s">"We cannot</span>
            <span class="about-reveal-word" style="animation-delay:0.2s">predict the</span>
            <span class="about-reveal-word about-cta-accent" style="animation-delay:0.3s">future,</span><br/>
            <span class="about-reveal-word" style="animation-delay:0.4s">but we can</span>
            <span class="about-reveal-word" style="animation-delay:0.5s">simulate it into</span>
            <span class="about-reveal-word" style="animation-delay:0.6s">reality."</span>
          </blockquote>
          <div class="about-cta-actions">
            <button class="about-cta-btn-primary" id="about-begin-btn">${t('about_cta_begin')}</button>
            <button class="about-cta-btn-ghost" id="about-learn-btn">${t('about_cta_learn')}</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">LIFEPATH-ENGINE</div>
          <p class="footer-text">
            ${t('about_footer_text')}
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

  // --- Event Listeners ---
  document.getElementById('about-begin-btn')?.addEventListener('click', () => {
    navigateTo('landing');
  });

  document.getElementById('about-learn-btn')?.addEventListener('click', () => {
    // Scroll to the top of the about page smoothly
    container.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Intersection Observer for scroll-reveal animation
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('about-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  container.querySelectorAll('.about-section, .about-impact-card, .about-agent-card, .about-feature-block').forEach(el => {
    el.classList.add('about-scroll-reveal');
    revealObserver.observe(el);
  });
}
