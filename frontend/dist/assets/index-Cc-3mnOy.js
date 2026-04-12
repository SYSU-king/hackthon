(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const ne="";async function W(t,e,n=null){const i={method:t,headers:{"Content-Type":"application/json"}};n&&(i.body=JSON.stringify(n));const a=await fetch(`${ne}${e}`,i);if(!a.ok){const s=await a.json().catch(()=>({detail:a.statusText}));throw new Error(s.detail||"API Error")}return a.json()}const U={health:()=>W("GET","/api/health"),createProject:t=>W("POST","/api/projects",{title:t}),importProject:t=>W("POST","/api/projects/import",t),listProjects:()=>W("GET","/api/projects"),getProject:t=>W("GET",`/api/projects/${t}`),deleteProject:t=>W("DELETE",`/api/projects/${t}`),submitProfile:(t,e)=>W("POST",`/api/projects/${t}/profile`,e),submitParameters:(t,e)=>W("POST",`/api/projects/${t}/parameters`,{parameters:e}),startSimulation:(t,e=12,n="quarter",i=6)=>fetch(`${ne}/api/projects/${t}/simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rounds:e,time_unit:n,agent_count:i})}),reSimulate:(t,e=12,n="quarter",i=6)=>fetch(`${ne}/api/projects/${t}/re-simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rounds:e,time_unit:n,agent_count:i})}),backtrack:(t,e,n,i,a,s=6)=>fetch(`${ne}/api/projects/${t}/backtrack`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path_id:e,node_index:n,modifications:i,description:a,rounds:s})}),getPaths:t=>W("GET",`/api/projects/${t}/paths`),getPathDetail:(t,e)=>W("GET",`/api/projects/${t}/paths/${e}`),getAdvice:(t,e,n="satisfied")=>W("POST",`/api/projects/${t}/paths/${e}/advice`,{feedback:n}),getStory:(t,e,n=!1)=>W("POST",`/api/projects/${t}/paths/${e}/story`,{regenerate:n}),futureSelfChat:(t,e,n,i,a=[])=>W("POST",`/api/projects/${t}/paths/${e}/nodes/${n}/future-self-chat`,{message:i,history:a}),getGraph:t=>W("GET",`/api/projects/${t}/graph`),getAgents:t=>W("GET",`/api/projects/${t}/agents`),getReport:t=>W("GET",`/api/projects/${t}/report`),getTreeEvents:t=>W("GET",`/api/projects/${t}/tree-events`)},gn={zh:{nav_simulation:"推演",nav_graph:"图谱",nav_reports:"报告",nav_system:"系统",landing_tag:"[PROLOGUE_01]",landing_title_1:"Life is not a destination.",landing_title_2:"It's a variable.",landing_desc:"通过多智能体仿真推演，量化人生轨迹中的关键节点。调一下参数，看看你的未来会走向哪里。",landing_cta:"[开始推演]",landing_history:"[历史记录]",onboarding_title:"构建你的人物模型",step_personality:"性格分析",step_education:"教育背景",step_academic:"学术信息",step_family:"家庭背景",step_career:"职业倾向",step_concern:"核心困惑",btn_next:"下一步",btn_prev:"上一步",btn_submit:"提交档案",param_title:"定义关注参数",param_desc:"明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。",param_add:"+ 添加参数",param_primary:"主参数",param_secondary:"次参数",sim_config:"推演配置",sim_rounds:"推演轮数",sim_time_unit:"时间单位",sim_quarter:"每季度",btn_start_sim:"开始推演",btn_back_profile:"返回档案",sim_viewport:"SIMULATION_VIEWPORT",sim_tree_title:"人生路径树",sim_event_stream:"事件流",sim_metrics:"系统指标",sim_progress:"进度",sim_paths:"路径数",sim_branches:"分支数",sim_round:"当前轮次",sim_initializing:"初始化中",sim_waiting:"等待推演开始...",sim_state:"当前状态",sim_completed_view:"推演已完成",sim_completed_msg:"本项目的推演已完成，点击下方按钮查看结果。",sim_tab_tree:"推演树",sim_tab_actions:"结果导航",sim_tree_readonly:"只读模式",sim_tree_summary:"推演摘要",btn_view_graph:"查看知识图谱",btn_view_results:"查看推演报告",btn_re_simulate:"重新推演",graph_title:"人生图谱",graph_agents:"智能体",graph_node_detail:"节点详情",graph_no_agents:"暂无智能体数据",graph_no_data:"暂无图谱数据",graph_load_error:"图谱加载失败",btn_view_report:"查看推演结果",results_title:"路径分析报告",results_desc:"系统已完成推演，生成 {count} 条人生路径。点击路径卡片查看详情。",results_status:"状态: 已完成",path_optimal:"最优路径",path_conservative:"稳健路径",path_risk:"冒险路径",path_balanced:"平衡路径",path_satisfaction:"满意度预测",path_nodes:"节点数",path_risk_label:"风险",btn_new_sim:"新建推演",btn_back:"返回",detail_node_seq:"节点序列",detail_description:"描述",detail_trigger:"触发原因",detail_state_snapshot:"状态快照",btn_get_advice:"获取 AI 建议",btn_get_story:"生成人生故事",story_title:"人生剧本",story_generating:"正在编撰您的故事...",advice_title:"策略规划",advice_desc:"针对「{path}」的 AI 行动建议",advice_satisfied:"满意模式",advice_unsatisfied:"不满意模式",advice_choose:"选择反馈模式以生成建议...",advice_generating:"正在生成建议...",advice_immediate:"近期行动",advice_mid_term:"中期布局",advice_risk_mit:"风险规避",advice_risk_analysis:"风险分析",advice_intervention:"干预节点",advice_alternative:"替代路径",advice_mental:"心理支持",advice_key_nodes:"关键节点",state_education:"学业",state_career:"职业",state_finance:"经济",state_health:"健康",state_mental:"心理",state_relationship:"关系",state_family_support:"家庭",state_social_capital:"社会资本",state_optionality:"可选择空间",state_goal_alignment:"目标达成",lang_switch:"EN",error_loading:"加载失败"},en:{nav_simulation:"SIMULATE",nav_graph:"GRAPH",nav_reports:"REPORTS",nav_system:"SYSTEM",landing_tag:"[PROLOGUE_01]",landing_title_1:"Life is not a destination.",landing_title_2:"It's a variable.",landing_desc:"Simulate life trajectories through multi-agent modeling. Tweak the parameters and see where your future leads.",landing_cta:"[START SIMULATION]",landing_history:"[VIEW HISTORY]",onboarding_title:"Build Your Profile",step_personality:"Personality",step_education:"Education",step_academic:"Academic",step_family:"Family",step_career:"Career",step_concern:"Core Concern",btn_next:"Next",btn_prev:"Previous",btn_submit:"Submit Profile",param_title:"Define Concern Parameters",param_desc:"Define your core questions. The system will diverge multi-layer influence factors and generate agents around your concerns.",param_add:"+ Add Parameter",param_primary:"Primary",param_secondary:"Secondary",sim_config:"Simulation Config",sim_rounds:"Rounds",sim_time_unit:"Time Unit",sim_quarter:"Quarterly",btn_start_sim:"Start Simulation",btn_back_profile:"Back to Profile",sim_viewport:"SIMULATION_VIEWPORT",sim_tree_title:"Life-Path Tree",sim_event_stream:"EVENT_STREAM",sim_metrics:"SYSTEM_METRICS",sim_progress:"PROGRESS",sim_paths:"PATHS",sim_branches:"BRANCHES",sim_round:"ROUND",sim_initializing:"INITIALIZING",sim_waiting:"Waiting for simulation start...",sim_state:"CURRENT_STATE",sim_completed_view:"Simulation Complete",sim_completed_msg:"Simulation has already finished. Click below to view results.",sim_tab_tree:"Derivation Tree",sim_tab_actions:"Result Hub",sim_tree_readonly:"Read-only",sim_tree_summary:"Summary",btn_view_graph:"View Knowledge Graph",btn_view_results:"View Simulation Report",btn_re_simulate:"Re-simulate",graph_title:"LIFE_GRAPH",graph_agents:"AGENTS",graph_node_detail:"NODE_DETAIL",graph_no_agents:"No agents data yet",graph_no_data:"No graph data available",graph_load_error:"GRAPH_LOAD_ERROR",btn_view_report:"View Results",results_title:"Path Analysis Report",results_desc:"Simulation complete. {count} life paths generated. Click a card to view details.",results_status:"STATUS: COMPLETED",path_optimal:"Optimal Path",path_conservative:"Conservative Path",path_risk:"Risk Path",path_balanced:"Balanced Path",path_satisfaction:"Satisfaction",path_nodes:"Nodes",path_risk_label:"Risk",btn_new_sim:"New Simulation",btn_back:"Back",detail_node_seq:"NODE_SEQUENCE",detail_description:"Description",detail_trigger:"Trigger Reason",detail_state_snapshot:"State Snapshot",btn_get_advice:"Get AI Advice",btn_get_story:"Generate Story",story_title:"Life Story",story_generating:"Writing your story...",advice_title:"Strategy Protocol",advice_desc:'AI-powered advice for "{path}"',advice_satisfied:"Satisfied Mode",advice_unsatisfied:"Unsatisfied Mode",advice_choose:"Choose feedback mode to generate advice...",advice_generating:"GENERATING_ADVICE...",advice_immediate:"Immediate Actions",advice_mid_term:"Mid-term Plan",advice_risk_mit:"Risk Mitigation",advice_risk_analysis:"Risk Analysis",advice_intervention:"Intervention Points",advice_alternative:"Alternative Paths",advice_mental:"Mental Support",advice_key_nodes:"Key Nodes",state_education:"Education",state_career:"Career",state_finance:"Finance",state_health:"Health",state_mental:"Mental",state_relationship:"Relationship",state_family_support:"Family",state_social_capital:"Social Capital",state_optionality:"Optionality",state_goal_alignment:"Goal Alignment",lang_switch:"中文",error_loading:"Loading failed"}};let We=localStorage.getItem("lifepath_lang")||"zh";function S(t){var e;return((e=gn[We])==null?void 0:e[t])||gn.zh[t]||t}function Vi(t){We=t,localStorage.setItem("lifepath_lang",t)}function qi(){Vi(We==="zh"?"en":"zh")}function Je(t){return S(`state_${t}`)}const Yn=["education","career","finance","health","mental","relationship","family_support","social_capital","optionality","goal_alignment"];function Ui(t){t.innerHTML=`
    <section class="hero">
      <div class="hero-left">
        <div class="mono-xs hero-tag">${S("landing_tag")}</div>
        <h1 class="hero-title">${S("landing_title_1")}<br/><em>${S("landing_title_2")}</em></h1>
        <p class="hero-desc">${S("landing_desc")}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="btn-questionnaire">${S("landing_cta")}</button>
          <button class="btn btn-ghost" id="btn-history">${S("landing_history")}</button>
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
  `;const e=document.getElementById("history-panel"),n=document.getElementById("history-file-input");document.getElementById("btn-questionnaire").addEventListener("click",async()=>{try{Vl();const i=await U.createProject("New Simulation");Ri(i,{simComplete:!1}),J("onboarding")}catch(i){alert("Failed to create project: "+i.message)}}),document.getElementById("btn-history").addEventListener("click",async()=>{const i=e.style.display==="block";e.style.display=i?"none":"block",i||await Xi(e,n)}),n.addEventListener("change",async i=>{const[a]=i.target.files||[];if(a)try{const s=await a.text(),r=JSON.parse(s),o=await U.importProject(r);ie(o)}catch(s){alert("JSON 导入失败: "+s.message)}finally{i.target.value=""}})}async function Xi(t,e){var n,i;t.innerHTML=`
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
  `,(n=document.getElementById("btn-import-json"))==null||n.addEventListener("click",()=>e.click()),(i=document.getElementById("btn-load-demo"))==null||i.addEventListener("click",async()=>{try{const a=await fetch("/demo/high-end-demo.json");if(!a.ok)throw new Error("演示 JSON 读取失败");const s=await a.json(),r=await U.importProject(s);ie(r)}catch(a){alert("加载演示档失败: "+a.message)}});try{const a=await U.listProjects(),s=document.getElementById("history-projects");if(!a.length){s.innerHTML='<div class="mono-xs text-muted">当前没有系统内项目，优先试试内置演示 JSON。</div>';return}s.innerHTML=a.map(r=>`
      <div class="card" style="padding:18px 20px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.75);">
        <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;">
          <div>
            <div style="font-weight:700;margin-bottom:6px;">${r.title}</div>
            <div class="mono-xs text-muted">ID: ${r.id} · STATUS: ${r.status} · ${r.created_at}</div>
          </div>
          <span class="tag tag-${r.status==="completed"?"accent":"outline"}">${r.status.toUpperCase()}</span>
        </div>
        <div class="flex gap-8 mt-16" style="flex-wrap:wrap;">
          <button class="btn btn-primary history-open-view" data-project-id="${r.id}" style="padding:10px 18px;">直接查看</button>
          <button class="btn btn-ghost history-open-continue" data-project-id="${r.id}" style="padding:10px 18px;">继续操作</button>
        </div>
      </div>
    `).join(""),s.querySelectorAll(".history-open-view").forEach(r=>{r.addEventListener("click",async()=>{const o=await U.getProject(r.dataset.projectId);ie(o,"view")})}),s.querySelectorAll(".history-open-continue").forEach(r=>{r.addEventListener("click",async()=>{const o=await U.getProject(r.dataset.projectId);ie(o,"continue")})})}catch(a){document.getElementById("history-projects").innerHTML=`<div class="mono-xs text-error">历史记录读取失败: ${a.message}</div>`}}function ie(t,e="continue"){if(Ri(t),e==="view"){t.status==="completed"||(t.paths||[]).length?J("results"):t.status==="configured"?J("simulation"):t.status==="profiled"?J("parameters"):J("onboarding");return}t.status==="completed"||(t.paths||[]).length?J("simulation",{simulationTab:"tree"}):t.status==="configured"?J("simulation"):t.status==="profiled"?J("parameters"):J("onboarding")}const Wi=[{key:"personality",label:"PERSONALITY_TYPE",title:"性格倾向"},{key:"education",label:"EDUCATION_STAGE",title:"当前阶段"},{key:"background",label:"STAGE_CONTEXT",title:"阶段背景"},{key:"family",label:"FAMILY_CONDITIONS",title:"家庭情况"},{key:"preference",label:"CAREER_PREFERENCE",title:"方向偏好"},{key:"concern",label:"CORE_CONCERN",title:"核心困惑"}];let Z=0,R={personality_type:"",education_stage:"",school:"",major:"",gpa_range:"",family_economy:"",family_expectation:"",city_preference:"",career_preference:"",risk_preference:"balanced",current_concern:""};const Ut={personality:[{value:"INTJ",label:"战略家 INTJ",desc:"独立思考、目标导向"},{value:"INFP",label:"调停者 INFP",desc:"理想主义、富有同情"},{value:"ENTP",label:"辩论家 ENTP",desc:"创新求变、挑战常规"},{value:"ISFJ",label:"守卫者 ISFJ",desc:"踏实稳重、富有责任"},{value:"ENTJ",label:"指挥官 ENTJ",desc:"强势果断、天生领导"},{value:"INTP",label:"逻辑学家 INTP",desc:"分析深入、追求真理"}],education:[{value:"high_school",label:"高中在读",desc:"面临高考与志愿选择"},{value:"undergraduate",label:"本科在读",desc:"面临保研/考研/就业/申请海外大学"},{value:"graduate",label:"研究生在读",desc:"面临就业/读博/海外申请/转方向"},{value:"working_1_3",label:"工作 1-3 年",desc:"面临转型、跳槽或深造"},{value:"working_3_plus",label:"工作 3 年以上",desc:"面临晋升突破、换赛道或创业"}],career:[{value:"大厂",label:"互联网大厂",desc:"高薪高压，追求高速成长"},{value:"体制内",label:"体制内/国企",desc:"稳定安全，节奏适中"},{value:"科研",label:"科研院所/高校",desc:"深耕学术，自由度高"},{value:"创业",label:"自主创业",desc:"风险高，但上限更高"},{value:"外企",label:"外资企业",desc:"国际化环境，强调平衡"},{value:"自由",label:"自由职业",desc:"自主灵活，收入波动更大"}],risk:[{value:"conservative",label:"保守型",desc:"优先稳定，规避风险"},{value:"balanced",label:"平衡型",desc:"接受适度风险"},{value:"aggressive",label:"激进型",desc:"追求高回报，愿意冒险"}]};function $t(t=R.education_stage){return["working_1_3","working_3_plus"].includes(t)}function Vn(){return Wi.map(t=>t.key!=="background"?t:$t()?{...t,label:"CAREER_CONTEXT",title:"职业背景"}:R.education_stage==="high_school"?{...t,label:"ACADEMIC_CONTEXT",title:"学业基础"}:{...t,label:"ACADEMIC_BACKGROUND",title:"学业背景"})}function qn(){return Vn()[Z]}function $e(t,e){R[t]=e,t==="education_stage"&&$t(e)&&(R.gpa_range="")}function Tt(t,e,n,{allowCustom:i=!1,customPlaceholder:a="输入自定义内容"}={}){const s=t.map(o=>o.value),r=n&&!s.includes(n)?n:"";return`
    <div class="radio-grid">
      ${t.map(o=>`
        <div class="radio-card ${n===o.value?"selected":""}" data-field="${e}" data-value="${o.value}">
          <div class="radio-card-title">${o.label}</div>
          ${o.desc?`<div class="radio-card-desc">${o.desc}</div>`:""}
        </div>
      `).join("")}
      ${i?`
        <div class="radio-card ${r?"selected":""}" data-custom-card="true" data-field="${e}">
          <div class="radio-card-title">自定义输入</div>
          <input class="form-input radio-custom-input" data-field="${e}" value="${r}" placeholder="${a}" style="margin-top:8px;background:var(--white);" />
        </div>
      `:""}
    </div>
  `}function Ji(){return $t()?`
      <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">职业背景</h2>
      <p class="text-secondary mb-24">基于你的工作阶段，只保留会影响职业推演的问题。</p>
      <div class="grid-2 gap-16">
        <div class="form-group">
          <label class="form-label">最高学历院校</label>
          <input class="form-input" id="field-school" value="${R.school}" placeholder="如：华南理工大学" />
        </div>
        <div class="form-group">
          <label class="form-label">专业 / 当前赛道</label>
          <input class="form-input" id="field-major" value="${R.major}" placeholder="如：软件工程 / AI 产品" />
        </div>
        <div class="form-group" style="grid-column:1 / span 2;">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${R.city_preference==="一线城市"?"selected":""}>一线城市（资源密集，竞争强）</option>
            <option value="新一线" ${R.city_preference==="新一线"?"selected":""}>新一线（机会与生活成本更平衡）</option>
            <option value="二线城市" ${R.city_preference==="二线城市"?"selected":""}>二线城市（稳定发展）</option>
            <option value="家乡" ${R.city_preference==="家乡"?"selected":""}>回到家乡 / 本省</option>
            <option value="无所谓" ${R.city_preference==="无所谓"?"selected":""}>地点开放</option>
          </select>
        </div>
      </div>
      <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">FLOW_NOTE:</div>
        <p style="font-size:13px;color:var(--secondary);line-height:1.7;">
          你已选择工作阶段，系统会自动跳过 GPA、保研等学生向问题，后续分支会更偏向跳槽、晋升、海外 offer、创业与城市迁移。
        </p>
      </div>
    `:R.education_stage==="high_school"?`
      <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">学业基础</h2>
      <p class="text-secondary mb-24">围绕高考与专业选择补全背景。</p>
      <div class="grid-2 gap-16">
        <div class="form-group">
          <label class="form-label">当前学校</label>
          <input class="form-input" id="field-school" value="${R.school}" placeholder="如：广雅中学" />
        </div>
        <div class="form-group">
          <label class="form-label">意向专业 / 学科方向</label>
          <input class="form-input" id="field-major" value="${R.major}" placeholder="如：计算机 / 金融 / 临床医学" />
        </div>
        <div class="form-group">
          <label class="form-label">当前成绩段</label>
          <select class="form-select" id="field-gpa">
            <option value="">请选择</option>
            <option value="top_10%" ${R.gpa_range==="top_10%"?"selected":""}>年级前 10%</option>
            <option value="top_30%" ${R.gpa_range==="top_30%"?"selected":""}>年级前 30%</option>
            <option value="mid" ${R.gpa_range==="mid"?"selected":""}>中等稳定</option>
            <option value="unstable" ${R.gpa_range==="unstable"?"selected":""}>波动较大</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${R.city_preference==="一线城市"?"selected":""}>一线城市</option>
            <option value="新一线" ${R.city_preference==="新一线"?"selected":""}>新一线</option>
            <option value="省会" ${R.city_preference==="省会"?"selected":""}>省会城市</option>
            <option value="家乡" ${R.city_preference==="家乡"?"selected":""}>留在家乡</option>
            <option value="无所谓" ${R.city_preference==="无所谓"?"selected":""}>无所谓</option>
          </select>
        </div>
      </div>
    `:`
    <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">学业背景</h2>
    <p class="text-secondary mb-24">补充会直接影响学业与职业推演的关键变量。</p>
    <div class="grid-2 gap-16">
      <div class="form-group">
        <label class="form-label">学校名称</label>
        <input class="form-input" id="field-school" value="${R.school}" placeholder="如：中山大学" />
      </div>
      <div class="form-group">
        <label class="form-label">专业方向</label>
        <input class="form-input" id="field-major" value="${R.major}" placeholder="如：计算机科学" />
      </div>
      <div class="form-group">
        <label class="form-label">GPA 区间</label>
        <select class="form-select" id="field-gpa">
          <option value="">请选择</option>
          <option value="3.8+" ${R.gpa_range==="3.8+"?"selected":""}>3.8+（优秀）</option>
          <option value="3.5-3.8" ${R.gpa_range==="3.5-3.8"?"selected":""}>3.5-3.8（良好）</option>
          <option value="3.0-3.5" ${R.gpa_range==="3.0-3.5"?"selected":""}>3.0-3.5（中等）</option>
          <option value="<3.0" ${R.gpa_range==="<3.0"?"selected":""}>3.0 以下</option>
        </select>
      </div>
        <div class="form-group">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${R.city_preference==="一线城市"?"selected":""}>一线城市（北上广深）</option>
            <option value="新一线" ${R.city_preference==="新一线"?"selected":""}>新一线（杭州、成都、武汉…）</option>
            <option value="海外城市" ${R.city_preference==="海外城市"?"selected":""}>海外城市（港新英美澳等）</option>
            <option value="二线城市" ${R.city_preference==="二线城市"?"selected":""}>二线城市</option>
            <option value="家乡" ${R.city_preference==="家乡"?"selected":""}>留在家乡</option>
            <option value="无所谓" ${R.city_preference==="无所谓"?"selected":""}>无所谓</option>
          </select>
      </div>
    </div>
  `}function Un(){const t=qn();switch(t.key){case"personality":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">选择最接近你的性格类型</p>
        ${Tt(Ut.personality,"personality_type",R.personality_type,{allowCustom:!0,customPlaceholder:"如：ENFJ / INFJ / 其他人格标签"})}
      `;case"education":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">你的当前阶段会决定后续问题分支。</p>
        ${Tt(Ut.education,"education_stage",R.education_stage)}
      `;case"background":return Ji();case"family":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">家庭约束和支持会显著改变路径分叉。</p>
        <div class="form-group">
          <label class="form-label">家庭经济状况</label>
          ${Tt(["优越","中等","一般","困难"].map(e=>({value:e,label:e})),"family_economy",R.family_economy,{allowCustom:!0,customPlaceholder:"如：家庭有房贷压力 / 现金流紧张"})}
        </div>
        <div class="form-group mt-24">
          <label class="form-label">家庭期望</label>
          ${Tt(($t()?["稳定发展","尽快晋升","回本省定居","收入优先","自由选择"]:["考公/体制内","留在本省","高薪优先","自由选择","读博深造"]).map(e=>({value:e,label:e})),"family_expectation",R.family_expectation,{allowCustom:!0,customPlaceholder:"如：支持出国 / 支持 gap / 希望尽早结婚"})}
        </div>
      `;case"preference":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">${$t()?"职业路线、转型方式、海外机会和风险承受度会直接影响回溯分支。":"职业方向、继续深造、海外申请与风险偏好会影响后续推演走向。"}</p>
        <div class="form-group">
          <label class="form-label">职业方向偏好</label>
          ${Tt(Ut.career,"career_preference",R.career_preference,{allowCustom:!0,customPlaceholder:"如：申请海外大学 / NGO / 艺术创作 / 医疗方向"})}
        </div>
        <div class="form-group mt-24">
          <label class="form-label">风险偏好</label>
          ${Tt(Ut.risk,"risk_preference",R.risk_preference,{allowCustom:!0,customPlaceholder:"如：阶段性激进 / 对出国冒险更开放"})}
        </div>
      `;case"concern":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">你当前最想推演的问题是什么？</p>
        <div class="form-group">
          <label class="form-label">核心困惑（自由描述）</label>
          <textarea class="form-textarea" id="field-concern" placeholder="${$t()?"例如：我是继续留在当前公司争取管理岗，还是接受海外团队 offer 去新赛道？":"例如：我应该保研、直接就业，还是申请海外大学？如果选择出国，3 年后的发展会更好吗？"}">${R.current_concern}</textarea>
        </div>
        <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
          <div class="mono-xs text-accent" style="margin-bottom:8px;">ANALYST_NOTE:</div>
          <p style="font-size:13px;color:var(--secondary);font-style:italic;line-height:1.7;">
            尽量写清楚分歧点、现实约束和你最在意的代价。系统会从这里抽取变量，自动发散影响因素并生成推演树。
          </p>
        </div>
      `;default:return""}}function ae(t){const e=Vn();e[Z],t.innerHTML=`
    <div class="onboarding-layout">
      <div class="onboarding-sidebar">
        <div class="mono-xs text-muted" style="margin-bottom:8px;">SYSTEM_ENTITY</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-size:18px;margin-bottom:4px;">[PROFILE_BUILDER]</div>
        <div class="mono-xs flex items-center gap-4"><span class="status-dot status-stable"></span> STEP ${Z+1}/${e.length}</div>
        <div class="step-indicator" style="margin-top:24px;" id="step-nav">
          ${e.map((n,i)=>`
            <div class="step-item ${i===Z?"active":""} ${i<Z?"completed":""}" data-step="${i}">
              [${n.label}]
            </div>
          `).join("")}
        </div>
      </div>
      <div class="onboarding-main">
        <div style="margin-bottom:16px;" class="mono-xs text-muted">BRANCH_ID: ${E.projectId||"N/A"} // STEP ${Z+1} OF ${e.length}</div>
        <div id="step-content" class="fade-in">
          ${Un()}
        </div>
        <div class="flex justify-between mt-32">
          <button class="btn btn-ghost" id="btn-prev" ${Z===0?'disabled style="opacity:0.3"':""}>[PREVIOUS]</button>
          <button class="btn ${Z===e.length-1?"btn-accent":"btn-primary"}" id="btn-next">
            ${Z===e.length-1?"[SUBMIT_PROFILE]":"[NEXT_STEP]"}
          </button>
        </div>
      </div>
    </div>
  `,Xn(t),t.querySelectorAll(".step-item").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.dataset.step,10);i<=Z&&(ke(),Z=i,ae(t))})}),document.getElementById("btn-prev").addEventListener("click",()=>{Z>0&&(ke(),Z-=1,ae(t))}),document.getElementById("btn-next").addEventListener("click",async()=>{if(ke(),Z<e.length-1){Z+=1,ae(t);return}try{await U.submitProfile(E.projectId,R),Z=0,J("parameters")}catch(n){alert("Profile submission failed: "+n.message)}})}function Xn(t){t.querySelectorAll(".radio-card").forEach(n=>{n.addEventListener("click",()=>{var s;if(n.dataset.customCard==="true"){(s=n.querySelector(".radio-custom-input"))==null||s.focus();return}const i=n.dataset.field,a=n.dataset.value;$e(i,a),document.getElementById("step-content").innerHTML=Un(),Xn(t)})});function e(n,i){t.querySelectorAll(`.radio-card[data-field="${n}"]`).forEach(a=>{a.dataset.customCard==="true"?a.classList.toggle("selected",!!i.trim()):a.dataset.value&&a.classList.toggle("selected",a.dataset.value===i)})}t.querySelectorAll(".radio-custom-input").forEach(n=>{n.addEventListener("click",i=>i.stopPropagation()),n.addEventListener("focus",()=>{e(n.dataset.field,n.value)}),n.addEventListener("input",()=>{$e(n.dataset.field,n.value),e(n.dataset.field,n.value)}),n.addEventListener("blur",()=>{const i=n.value.trim();$e(n.dataset.field,i),n.value=i,e(n.dataset.field,i)})})}function ke(){var e,n,i,a,s;switch(qn().key){case"background":R.school=((e=document.getElementById("field-school"))==null?void 0:e.value)||"",R.major=((n=document.getElementById("field-major"))==null?void 0:n.value)||"",R.gpa_range=$t()?"":((i=document.getElementById("field-gpa"))==null?void 0:i.value)||"",R.city_preference=((a=document.getElementById("field-city"))==null?void 0:a.value)||"";break;case"concern":R.current_concern=((s=document.getElementById("field-concern"))==null?void 0:s.value)||"";break}}let at=[{name:"",description:"",priority:"primary",weight:1}],vn=null;const Ki=["primary","secondary","constraint"],Qi={primary:"主参数",secondary:"次参数",constraint:"约束条件"};function Me(t){var e,n;vn!==E.projectId&&(vn=E.projectId,Array.isArray((e=E.project)==null?void 0:e.parameters)&&E.project.parameters.length>0?at=E.project.parameters.map(i=>({name:i.name||"",description:i.description||"",priority:i.priority||"primary",weight:Number.isFinite(i.weight)?i.weight:1})):at=[{name:"",description:"",priority:"primary",weight:1}]),Array.isArray((n=E.project)==null?void 0:n.parameters)&&E.project.parameters.length>0&&at.length===0&&(at=E.project.parameters.map(i=>({name:i.name||"",description:i.description||"",priority:i.priority||"primary",weight:Number.isFinite(i.weight)?i.weight:1}))),t.innerHTML=`
    <div style="padding:48px 64px;max-width:960px;margin:0 auto;">
      <div class="mono-xs text-muted mb-8">PROJECT_ID: ${E.projectId} // PHASE: PARAMETER_DEFINITION</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:48px;">
        <h1 style="font-size:40px;">Define Concern Parameters</h1>
        <p class="text-secondary mt-8" style="font-size:16px;max-width:600px;">
          明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。
        </p>
      </div>

      <div id="params-list">
        ${at.map((i,a)=>Zi(i,a)).join("")}
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
  `,document.getElementById("btn-add-param").addEventListener("click",()=>{Ie(t),at.push({name:"",description:"",priority:"secondary",weight:.7}),Me(t)}),document.getElementById("rounds-slider").addEventListener("input",i=>{document.getElementById("rounds-value").textContent=i.target.value}),document.getElementById("agent-count-slider").addEventListener("input",i=>{document.getElementById("agent-count-value").textContent=i.target.value}),document.getElementById("btn-back").addEventListener("click",()=>J("onboarding")),document.getElementById("btn-start").addEventListener("click",async()=>{Ie();const i=at.filter(a=>a.name.trim());if(i.length===0){alert("请至少填写一个关注参数");return}try{await U.submitParameters(E.projectId,i),E.project&&(E.project.parameters=i,E.project.status="configured");const a=parseInt(document.getElementById("rounds-slider").value),s=document.getElementById("time-unit").value,r=parseInt(document.getElementById("agent-count-slider").value);E.simConfig={rounds:a,timeUnit:s,agentCount:r},J("simulation")}catch(a){alert("Failed: "+a.message)}}),t.querySelectorAll(".param-remove").forEach(i=>{i.addEventListener("click",()=>{Ie(t);const a=parseInt(i.dataset.index);at.splice(a,1),at.length===0&&at.push({name:"",description:"",priority:"primary",weight:1}),Me(t)})}),t.querySelectorAll(".priority-select").forEach(i=>{i.addEventListener("change",a=>{const s=parseInt(i.dataset.index);at[s].priority=a.target.value})}),t.querySelectorAll(".param-weight-slider").forEach(i=>{i.addEventListener("input",a=>{const s=parseInt(i.dataset.index),r=parseFloat(a.target.value);at[s].weight=r;const o=t.querySelector(`.param-weight-value[data-index="${s}"]`);o&&(o.textContent=r.toFixed(1))})})}function Zi(t,e){return`
    <div class="param-card">
      <div class="param-priority">
        <select class="form-select priority-select" data-index="${e}" style="font-size:10px;padding:6px;">
          ${Ki.map(n=>`
            <option value="${n}" ${t.priority===n?"selected":""}>${Qi[n]}</option>
          `).join("")}
        </select>
      </div>
      <div class="param-name" style="flex:1;">
        <input class="form-input param-name-input" data-index="${e}" value="${t.name}" placeholder="如：国内读研 vs 申请海外大学" style="border-bottom-color:var(--accent);" />
      </div>
      <div class="param-weight" style="width:180px;">
        <div class="slider-container">
          <input type="range" class="slider param-weight-slider" data-index="${e}" min="0" max="1" step="0.1" value="${t.weight}" />
          <span class="mono-xs param-weight-value" data-index="${e}">${t.weight.toFixed(1)}</span>
        </div>
      </div>
      <button class="param-remove" data-index="${e}">×</button>
    </div>
  `}function Ie(t=document){t.querySelectorAll(".param-name-input").forEach(e=>{const n=parseInt(e.dataset.index);at[n].name=e.value}),t.querySelectorAll(".param-weight-slider").forEach(e=>{const n=parseInt(e.dataset.index);at[n].weight=parseFloat(e.value)})}let F=[],Dt=[],wt="tree",se=null,D={contentW:800,contentH:600,viewBox:null,autoFit:!0,dragPointerId:null,dragStartClientX:0,dragStartClientY:0,dragStartViewBox:null};function ta(){return{type:"add_node",id:"root",parent:null,label:"BASE",round:0,time_label:"起点",node_type:"decision",description:"基础状态已载入，推演树准备开始。",trigger_reason:"系统初始化",state_snapshot:{},state_summary:[]}}function ea(){F.some(t=>t.id==="root")||(ti(ta()),Ke(),Qe())}function na(t){var e,n,i;if(wt=E.simulationTab||"tree",E.simComplete||((e=E.project)==null?void 0:e.status)==="completed"){Ze(t);return}E.project&&(E.project.status="simulating"),t.innerHTML=`
    <div class="sim-layout">
      <!-- Canvas: Dynamic Tree Visualization -->
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${S("sim_viewport")}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${S("sim_tree_title")}: Session-${((n=E.projectId)==null?void 0:n.slice(0,4))||"X"}
          </h1>
        </div>
        <div style="position:absolute;top:16px;right:24px;z-index:10;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="mono-xs text-muted">滚轮缩放 · 拖拽平移</span>
          <button class="btn btn-ghost tree-zoom-btn" id="tree-zoom-out" style="padding:8px 12px;">-</button>
          <button class="btn btn-ghost tree-zoom-btn" id="tree-zoom-in" style="padding:8px 12px;">+</button>
          <button class="btn btn-ghost tree-zoom-btn" id="tree-zoom-reset" style="padding:8px 12px;">重置视图</button>
        </div>
        <div class="sim-tree-container" id="tree-container">
          <svg id="tree-svg" width="100%" height="100%"></svg>
        </div>
        <!-- Node detail tooltip (overlay on canvas) -->
        <div class="tree-node-tooltip" id="tree-node-tooltip" style="display:none;"></div>
      </section>

      <!-- Event Stream Panel -->
      <aside class="sim-panel">
        <div class="sim-panel-header">
          <div class="flex items-center justify-between mb-4">
            <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;text-transform:uppercase;">${S("sim_event_stream")}</span>
            <span class="status-dot status-active pulse" id="status-dot"></span>
          </div>
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${((i=E.projectId)==null?void 0:i.slice(0,4))||"0000"}</div>
        </div>
        <div class="sim-panel-body" id="event-log">
          <div class="console-line console-latest">
            <span class="console-ts">[--:--:--]</span>
            <span>${S("sim_waiting")}</span>
          </div>
        </div>
        <div style="padding:16px;background:var(--primary);color:var(--white);">
          <div class="flex items-center gap-8 mb-8">
            <span class="material-symbols-outlined icon-sm">info</span>
            <span class="mono-xs">${S("sim_metrics")}</span>
          </div>
          <div class="grid-2 gap-16" style="font-family:var(--font-mono);font-size:10px;">
            <div><span style="opacity:0.6;display:block;">${S("sim_progress")}</span><span id="metric-progress">0%</span></div>
            <div><span style="opacity:0.6;display:block;">${S("sim_paths")}</span><span id="metric-paths">0</span></div>
            <div><span style="opacity:0.6;display:block;">${S("sim_branches")}</span><span id="metric-branches">1</span></div>
            <div><span style="opacity:0.6;display:block;">${S("sim_round")}</span><span id="metric-round">0</span></div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Time Progression Footer -->
    <footer class="sim-footer">
      <div class="flex items-center gap-8">
        <button class="btn btn-primary" id="btn-control" style="padding:8px 12px;">
          <span class="material-symbols-outlined">play_arrow</span>
        </button>
      </div>
      <div style="flex:1;position:relative;">
        <div class="flex justify-between mono-xs text-muted" style="margin-bottom:4px;">
          <span>YEAR_0</span><span>YEAR_5</span><span>YEAR_10</span><span>YEAR_15</span><span>YEAR_20</span>
        </div>
        <div class="sim-progress-bar">
          <div class="sim-progress-fill" id="progress-fill" style="width:0%;"></div>
          <div class="sim-progress-label" id="progress-label" style="left:0%;">0%</div>
        </div>
      </div>
      <div style="width:200px;text-align:right;">
        <div class="mono-xs text-muted">${S("sim_state")}</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-style:italic;font-size:16px;" id="state-label">${S("sim_initializing")}</div>
      </div>
    </footer>
  `,F=[],Dt=[],Kn(),Qn(),be(),Mt([]),Wn(),ea(),sa(t)}function be(){se&&(se(),se=null)}function Wn({replay:t=!1}={}){be(),se=Yl(e=>{ti(e),Ke(),Qe()},{replay:t})}function Ke(){const t=F.filter(i=>i.isBranch).length,e=document.getElementById("metric-branches");e&&(e.textContent=t||(F.length?1:"—"));const n=document.getElementById("metric-nodes");n&&(n.textContent=F.length||"—")}function Qe(){const t=document.getElementById("tree-summary-panel");if(t){if(F.length===0){t.innerHTML=`
      <div class="console-line">
        <span class="console-ts">[INFO]</span>
        <span style="color:var(--outline);">暂无推演树数据</span>
      </div>
    `;return}t.innerHTML=`
    <div class="console-line" style="border-left:2px solid var(--accent);padding-left:12px;margin-bottom:4px;">
      <span class="console-ts" style="color:var(--accent);">[LIVE]</span>
      <span style="font-weight:700;color:var(--accent);">推演树实时更新中，当前 ${F.length} 个节点</span>
    </div>
    ${F.slice(-20).reverse().map(e=>`
      <div class="console-line" style="cursor:pointer;" data-node-id="${e.id}">
        <span class="console-ts">[R${e.round}]</span>
        <span>${e.isBranch?"🔶":"⚫"} ${e.label||"—"}</span>
      </div>
    `).join("")}
    ${F.length>20?`
      <div class="console-line">
        <span class="console-ts">[...]</span>
        <span style="color:var(--outline);">更早节点 ${F.length-20} 个</span>
      </div>
    `:""}
  `,t.querySelectorAll("[data-node-id]").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.nodeId,i=F.find(a=>a.id===n);i&&ei(i)})})}}function Ze(t){t.innerHTML=`
    <div class="sim-completed-tabbed">
      <!-- Tab Bar -->
      <div class="sim-tab-bar">
        <button class="sim-tab ${wt==="tree"?"sim-tab-active":""}" data-tab="tree">
          <span class="material-symbols-outlined icon-sm">account_tree</span>
          ${S("sim_tab_tree")||"推演树"}
        </button>
        <button class="sim-tab ${wt==="actions"?"sim-tab-active":""}" data-tab="actions">
          <span class="material-symbols-outlined icon-sm">dashboard</span>
          ${S("sim_tab_actions")||"结果导航"}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="sim-tab-content" id="sim-tab-content"></div>
    </div>
  `,t.querySelectorAll(".sim-tab").forEach(n=>{n.addEventListener("click",()=>{wt=n.dataset.tab,E.simulationTab=wt,Ze(t)})});const e=document.getElementById("sim-tab-content");wt==="tree"?ia(e):(be(),aa(e))}async function ia(t){var e,n,i,a;t.innerHTML=`
    <div class="sim-layout" style="height:calc(100vh - var(--topnav-h) - 56px);">
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${S("sim_viewport")}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${S("sim_tree_title")}: Session-${((e=E.projectId)==null?void 0:e.slice(0,4))||"X"}
          </h1>
          <div class="mono-xs text-accent" style="margin-top:8px;">
            <span class="material-symbols-outlined icon-sm" style="font-size:14px;vertical-align:text-bottom;">check_circle</span>
            ${S("sim_completed_view")||"推演已完成"} · ${S("sim_tree_readonly")||"只读模式"}
          </div>
        </div>
        <div style="position:absolute;top:16px;right:24px;z-index:10;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="mono-xs text-muted">滚轮缩放 · 拖拽平移</span>
          <button class="btn btn-ghost tree-zoom-btn" id="tree-zoom-out" style="padding:8px 12px;">-</button>
          <button class="btn btn-ghost tree-zoom-btn" id="tree-zoom-in" style="padding:8px 12px;">+</button>
          <button class="btn btn-ghost tree-zoom-btn" id="tree-zoom-reset" style="padding:8px 12px;">重置视图</button>
        </div>
        <div class="sim-tree-container" id="tree-container">
          <svg id="tree-svg" width="100%" height="100%"></svg>
        </div>
        <div class="tree-node-tooltip" id="tree-node-tooltip" style="display:none;"></div>
      </section>

      <!-- Summary sidebar -->
      <aside class="sim-panel">
        <div class="sim-panel-header">
          <div class="flex items-center justify-between mb-4">
            <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;text-transform:uppercase;">${S("sim_tree_summary")||"推演摘要"}</span>
            <span class="status-dot status-stable"></span>
          </div>
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${((n=E.projectId)==null?void 0:n.slice(0,4))||"0000"}</div>
        </div>
        <div class="sim-panel-body" id="tree-summary-panel">
          <div class="console-line pulse">
            <span class="console-ts">[LOAD]</span>
            <span>正在加载推演树数据...</span>
          </div>
        </div>
        <div style="padding:16px;background:var(--primary);color:var(--white);">
          <div class="flex items-center gap-8 mb-8">
            <span class="material-symbols-outlined icon-sm">info</span>
            <span class="mono-xs">${S("sim_metrics")}</span>
          </div>
          <div class="grid-2 gap-16" style="font-family:var(--font-mono);font-size:10px;">
            <div><span style="opacity:0.6;display:block;">${S("sim_progress")}</span><span id="metric-progress">100%</span></div>
            <div><span style="opacity:0.6;display:block;">${S("sim_paths")}</span><span id="metric-paths">—</span></div>
            <div><span style="opacity:0.6;display:block;">${S("sim_branches")}</span><span id="metric-branches">—</span></div>
            <div><span style="opacity:0.6;display:block;">NODES</span><span id="metric-nodes">—</span></div>
          </div>
        </div>
      </aside>
    </div>
  `,F=[],Dt=[],Kn(),Qn(),be();try{if(!((i=E.treeEvents)!=null&&i.length)){const r=(await U.getTreeEvents(E.projectId)).events||[];(a=E.treeEvents)!=null&&a.length?r.forEach(fn):Mt(r)}Wn({replay:!0}),Ke(),Qe()}catch(s){document.getElementById("tree-summary-panel").innerHTML=`
      <div class="console-line">
        <span class="console-ts">[ERR]</span>
        <span style="color:var(--error);">加载失败: ${s.message}</span>
      </div>
    `}}function aa(t){var e;t.innerHTML=`
    <div style="min-height:calc(100vh - var(--topnav-h) - 56px);display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;max-width:560px;padding:48px;">
        <span class="material-symbols-outlined" style="font-size:64px;color:var(--accent);margin-bottom:24px;display:block;">check_circle</span>
        <h1 style="font-size:40px;margin-bottom:16px;">${S("sim_completed_view")}</h1>
        <p class="text-secondary" style="margin-bottom:48px;font-size:16px;line-height:1.7;">
          ${S("sim_completed_msg")}
        </p>
        <div class="flex gap-16 justify-center" style="flex-wrap:wrap;">
          <button class="btn btn-accent" onclick="navigateTo('graph')">
            <span class="material-symbols-outlined icon-sm">hub</span> ${S("btn_view_graph")}
          </button>
          <button class="btn btn-primary" onclick="navigateTo('results')">
            <span class="material-symbols-outlined icon-sm">assessment</span> ${S("btn_view_results")}
          </button>
          <button class="btn btn-ghost" id="btn-resim">
            <span class="material-symbols-outlined icon-sm">replay</span> ${S("btn_re_simulate")}
          </button>
        </div>
      </div>
    </div>
  `,(e=document.getElementById("btn-resim"))==null||e.addEventListener("click",async()=>{E.simComplete=!1,E.project&&(E.project.status="simulating"),wt="tree",E.simulationTab="tree",Mt([]),J("simulation")})}async function sa(t){const e=E.simConfig||{rounds:12,timeUnit:"quarter",agentCount:8};try{const i=(await U.startSimulation(E.projectId,e.rounds,e.timeUnit,e.agentCount||6)).body.getReader(),a=new TextDecoder;let s="";for(;;){const{done:r,value:o}=await i.read();if(r)break;s+=a.decode(o,{stream:!0});const c=s.split(`

`);s=c.pop()||"";for(const l of c)if(l.startsWith("data: "))try{const d=JSON.parse(l.slice(6));ra(d,t)}catch{}}}catch(n){Jn("ERROR",`Simulation failed: ${n.message}`,!0)}}function ra(t,e){const{phase:n,progress:i,message:a,round:s,total:r,path_count:o,agent_count:c,engine:l,tree_event:d}=t,_=document.getElementById("progress-fill"),f=document.getElementById("progress-label");_&&f&&i!==void 0&&(_.style.width=`${i}%`,f.style.left=`${i}%`,f.textContent=`${i}%`);const h=document.getElementById("metric-progress");if(h&&i!==void 0&&(h.textContent=`${i}%`),n==="tree_event"&&d){fn(d);return}if(a){const y=new Date().toLocaleTimeString("en-US",{hour12:!1});Jn(y,a,n==="completed"||n==="branch")}if(n==="branch"){const y=document.getElementById("metric-branches");if(y){const x=parseInt(y.textContent)||1;y.textContent=x+1}}if(n==="simulating"){const y=document.getElementById("metric-round");if(y&&a){const x=a.match(/第 (\d+)/);x&&(y.textContent=x[1])}}const k=document.getElementById("state-label");if(k){if(n==="init")k.textContent="⚡ AI_ENGINE";else if(n==="parameter_expansion")k.textContent="AI_EXPAND";else if(n==="agent_generation")k.textContent="AGENT_GEN";else if(n==="graph_building")k.textContent="GRAPH_BUILD";else if(n==="simulating")k.textContent="SIM_ACTIVE";else if(n==="branch")k.textContent="🌿 BRANCH";else if(n==="generating_paths")k.textContent="PATH_GEN";else if(n==="error"){k.textContent="❌ ERROR";const y=document.getElementById("status-dot");y&&(y.classList.remove("pulse"),y.classList.add("status-error"))}else if(n==="completed"){k.textContent="✅ AI_COMPLETE";const y=document.getElementById("status-dot");y&&(y.classList.remove("pulse"),y.classList.add("status-stable"));const x=document.getElementById("metric-paths");x&&(x.textContent=o||0),E.simComplete=!0,E.project&&(E.project.status="completed"),E.simulationTab="tree",setTimeout(()=>Ze(e),700)}}}function Jn(t,e,n=!1){const i=document.getElementById("event-log");if(!i)return;i.querySelectorAll(".console-latest").forEach(s=>s.classList.remove("console-latest"));const a=document.createElement("div");a.className=`console-line ${n?"console-latest":""}`,a.innerHTML=`
    <span class="console-ts">[${t}]</span>
    <span ${n?'style="font-weight:700;color:var(--accent);"':""}>${e}</span>
  `,i.prepend(a)}const Xt={decision:"#0F766E",opportunity:"#2563EB",result:"#334155",cascade:"#7C3AED",risk:"#DC2626",reflection:"#0891B2",branch:"#8B5CF6",default:"#475569"},Be={optimal:"#0F766E",conservative:"#2563EB",risk:"#DC2626",balanced:"#475569",counterfactual:"#8B5CF6"};function Kn(){const t=document.getElementById("tree-svg");if(!t)return;const e=document.getElementById("tree-container"),n=(e==null?void 0:e.clientWidth)||800,i=(e==null?void 0:e.clientHeight)||600;D={contentW:n,contentH:i,viewBox:{x:0,y:0,width:n,height:i},autoFit:!0,dragPointerId:null,dragStartClientX:0,dragStartClientY:0,dragStartViewBox:null},t.setAttribute("viewBox",`0 0 ${n} ${i}`),t.style.cursor="grab",la(t),t.innerHTML=`
    <defs>
      <filter id="tree-glow"><feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g id="tree-edges"></g>
    <g id="tree-nodes"></g>
  `}function Qn(){var t,e,n;(t=document.getElementById("tree-zoom-in"))==null||t.addEventListener("click",()=>Pe(.82)),(e=document.getElementById("tree-zoom-out"))==null||e.addEventListener("click",()=>Pe(1.22)),(n=document.getElementById("tree-zoom-reset"))==null||n.addEventListener("click",()=>ca(!0))}function oa(t){return typeof(t==null?void 0:t.closest)=="function"&&!!t.closest("[data-node-id]")}function la(t){if(!t||t.dataset.viewportBound==="true")return;t.dataset.viewportBound="true",t.addEventListener("wheel",n=>{n.preventDefault();const i=t.getBoundingClientRect(),a=i.width?(n.clientX-i.left)/i.width:.5,s=i.height?(n.clientY-i.top)/i.height:.5;Pe(n.deltaY<0?.88:1.14,a,s)},{passive:!1}),t.addEventListener("pointerdown",n=>{n.button===0&&(oa(n.target)||(D.dragPointerId=n.pointerId,D.dragStartClientX=n.clientX,D.dragStartClientY=n.clientY,D.dragStartViewBox={...D.viewBox||{x:0,y:0,width:D.contentW,height:D.contentH}},t.setPointerCapture(n.pointerId),t.style.cursor="grabbing"))}),t.addEventListener("pointermove",n=>{if(D.dragPointerId!==n.pointerId||!D.dragStartViewBox)return;const i=t.getBoundingClientRect();if(!i.width||!i.height)return;D.autoFit=!1;const a=(n.clientX-D.dragStartClientX)/i.width*D.dragStartViewBox.width,s=(n.clientY-D.dragStartClientY)/i.height*D.dragStartViewBox.height;D.viewBox=tn({x:D.dragStartViewBox.x-a,y:D.dragStartViewBox.y-s,width:D.dragStartViewBox.width,height:D.dragStartViewBox.height}),en()});const e=n=>{D.dragPointerId===n.pointerId&&(D.dragPointerId=null,D.dragStartViewBox=null,t.style.cursor="grab")};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e),t.addEventListener("mouseleave",()=>{D.dragPointerId===null&&(t.style.cursor="grab")})}function tn(t){const e=Math.min(Math.max(t.width,220),Math.max(D.contentW,220)),n=Math.min(Math.max(t.height,180),Math.max(D.contentH,180)),i=Math.max(0,D.contentW-e),a=Math.max(0,D.contentH-n);return{x:Math.min(Math.max(t.x,0),i),y:Math.min(Math.max(t.y,0),a),width:e,height:n}}function en(){const t=document.getElementById("tree-svg");if(!t||!D.viewBox)return;const{x:e,y:n,width:i,height:a}=D.viewBox;t.setAttribute("viewBox",`${e} ${n} ${i} ${a}`)}function ca(t=!1){D.autoFit=!0,t&&(D.viewBox={x:0,y:0,width:D.contentW,height:D.contentH}),Zn()}function Zn(){D.autoFit||!D.viewBox?D.viewBox={x:0,y:0,width:D.contentW,height:D.contentH}:D.viewBox=tn(D.viewBox),en()}function Pe(t,e=.5,n=.5){if(!D.viewBox)return;const i=D.viewBox,a=i.width*t,s=i.height*t,r=i.x+i.width*e,o=i.y+i.height*n;D.autoFit=!1,D.viewBox=tn({x:r-a*e,y:o-s*n,width:a,height:s}),en()}function ti(t){t.type==="add_node"?da(t):t.type==="branch"&&ua(t),pa()}function da(t){if(F.find(n=>n.id===t.id))return;let e=t.parent;if(e&&!F.find(n=>n.id===e)){const n=F.find(i=>e.startsWith(i.id)||i.id.startsWith(e));if(n)e=n.id;else{const i=F.find(a=>!a.parent);e=i?i.id:null}}F.push({id:t.id,parent:e,label:t.label||"",round:t.round||0,time_label:t.time_label||"",type:t.node_type||"result",isBranch:!1,tendency:"",description:t.description||"",trigger_reason:t.trigger_reason||"",state_summary:t.state_summary||[],state_snapshot:t.state_snapshot||{},agent_actions:t.agent_actions||[],source_path_id:t.source_path_id||"",source_node_index:t.source_node_index,rawEvent:t})}function ua(t){var n;if(F.find(i=>i.id===t.id))return;let e=t.parent;if(e&&!F.find(i=>i.id===e)){const i=F.find(a=>e.startsWith(a.id)||a.id.startsWith(e));if(i)e=i.id;else{const a=F.filter(s=>s.round<=(t.round||0)).sort((s,r)=>r.round-s.round);e=a.length>0?a[0].id:((n=F[0])==null?void 0:n.id)||null}}F.push({id:t.id,parent:e,label:t.label||"",round:t.round||0,time_label:t.time_label||"",type:"branch",isBranch:!0,tendency:t.tendency||"balanced",description:t.description||"",trigger_reason:t.trigger_reason||"",state_summary:t.state_summary||[],state_snapshot:t.state_snapshot||{},agent_actions:t.agent_actions||[],source_path_id:t.source_path_id||"",source_node_index:t.source_node_index,rawEvent:t})}function pa(){const t=document.getElementById("tree-svg");if(!t)return;const e=document.getElementById("tree-container"),n=(e==null?void 0:e.clientWidth)||800,i=(e==null?void 0:e.clientHeight)||600,a={},s={};for(const b of F)s[b.id]=b,b.parent&&(a[b.parent]=a[b.parent]||[]).push(b);const r=F.filter(b=>!b.parent||!s[b.parent]);if(r.length===0)return;const o=r[0],c=80,l=70,d=140;function _(b){const $=a[b]||[];return $.length===0?1:$.reduce((M,B)=>M+_(B.id),0)}function f(b,$=0){const M=a[b]||[];return M.length===0?$:Math.max(...M.map(B=>f(B.id,$+1)))}const h=f(o.id),k=_(o.id),y=Math.max(n,k*d+80),x=Math.max(i,c+(h+1)*l+60);function g(b,$,M,B){const T=s[b];if(!T)return;T.x=$+M/2,T.y=c+B*l;const O=a[b]||[];if(O.length===0)return;const j=O.reduce((m,u)=>m+_(u.id),0);let Y=$;for(const m of O){const p=_(m.id)/j*M;g(m.id,Y,Math.max(p,d),B+1),Y+=p}}g(o.id,40,y-80,0);let I=0;for(const b of r)if(b.id!==o.id){f(b.id);const $=_(b.id),M=Math.max(300,$*d),B=y+I;g(b.id,B,M,0),I+=M+40}D.contentW=y+I,D.contentH=x,Zn(),Dt=[];for(const b of F)b.parent&&s[b.parent]&&Dt.push({from:s[b.parent],to:b});const N="http://www.w3.org/2000/svg",v=t.querySelector("#tree-edges"),C=t.querySelector("#tree-nodes");v.innerHTML="",C.innerHTML="";for(const b of Dt){if(b.from.x===void 0||b.to.x===void 0)continue;const $=document.createElementNS(N,"path"),M=b.from.x,B=b.from.y,T=b.to.x,O=b.to.y,j=(B+O)/2;$.setAttribute("d",`M${M},${B} C${M},${j} ${T},${j} ${T},${O}`),$.setAttribute("stroke",b.to.isBranch?Be[b.to.tendency]||Xt.branch:"#64748B"),$.setAttribute("stroke-width",b.to.isBranch?"2.5":"1.5"),$.setAttribute("fill","none"),$.setAttribute("stroke-opacity","0.6"),b.to.isBranch&&$.setAttribute("stroke-dasharray","6,3"),$.style.opacity="0",$.style.transition="opacity 0.5s",v.appendChild($),requestAnimationFrame(()=>{$.style.opacity="1"})}for(const b of F){if(b.x===void 0)continue;const $=document.createElementNS(N,"g");$.setAttribute("data-node-id",b.id),$.style.opacity="0",$.style.transition="opacity 0.4s",$.style.cursor="pointer";const M=b.isBranch?Be[b.tendency]||Xt.branch:Xt[b.type]||Xt.default;if(b.isBranch){const T=document.createElementNS(N,"polygon"),O=14;T.setAttribute("points",`${b.x},${b.y-O} ${b.x+O},${b.y} ${b.x},${b.y+O} ${b.x-O},${b.y}`),T.setAttribute("fill",M),T.setAttribute("filter","url(#tree-glow)"),$.appendChild(T)}else if(b.parent){const T=document.createElementNS(N,"rect");T.setAttribute("x",b.x-50),T.setAttribute("y",b.y-14),T.setAttribute("width",100),T.setAttribute("height",28),T.setAttribute("fill","#F3F3F3"),T.setAttribute("stroke",M),T.setAttribute("stroke-width","1"),$.appendChild(T);const O=document.createElementNS(N,"rect");O.setAttribute("x",b.x-50),O.setAttribute("y",b.y-14),O.setAttribute("width",4),O.setAttribute("height",28),O.setAttribute("fill",M),$.appendChild(O)}else{const T=document.createElementNS(N,"rect");T.setAttribute("x",b.x-45),T.setAttribute("y",b.y-14),T.setAttribute("width",90),T.setAttribute("height",28),T.setAttribute("fill","#000"),$.appendChild(T)}const B=document.createElementNS(N,"text");if(B.setAttribute("x",b.x),B.setAttribute("y",b.y+4),B.setAttribute("text-anchor","middle"),B.setAttribute("fill",b.parent?"#333":"#fff"),B.setAttribute("font-family","Space Grotesk"),B.setAttribute("font-size",b.parent?"9":"10"),B.setAttribute("font-weight",b.isBranch?"bold":"normal"),B.textContent=(b.label||"").slice(0,14),$.appendChild(B),b.time_label&&b.parent){const T=document.createElementNS(N,"text");T.setAttribute("x",b.x),T.setAttribute("y",b.y+24),T.setAttribute("text-anchor","middle"),T.setAttribute("fill","#999"),T.setAttribute("font-family","Space Grotesk"),T.setAttribute("font-size","8"),T.textContent=b.time_label,$.appendChild(T)}$.addEventListener("click",T=>{T.stopPropagation(),ei(b)}),C.appendChild($),requestAnimationFrame(()=>{$.style.opacity="1"})}t.onclick=()=>{ni()}}function ei(t){var C,b;const e=document.getElementById("tree-node-tooltip");if(!e)return;const n={decision:"🔴 决策节点",opportunity:"🟢 机会节点",result:"⚫ 结果节点",cascade:"🔵 连锁节点",risk:"🟥 风险节点",reflection:"⬜ 反思节点",branch:"🔶 分支起点"},i={optimal:"最优路径",conservative:"稳健路径",risk:"冒险路径",balanced:"平衡路径",counterfactual:"反事实路径"},a=t.state_summary||[],s=t.agent_actions||[],r=document.getElementById("tree-container"),o=document.getElementById("tree-svg");if(!r||!o||t.x===void 0)return;const c=r.getBoundingClientRect(),l=o.getBoundingClientRect(),d=o.getAttribute("viewBox");if(!d)return;const[_,f,h,k]=d.split(" ").map(Number),y=l.width/h,x=l.height/k;let g=(t.x-_)*y+(l.left-c.left)+16,I=(t.y-f)*x+(l.top-c.top)-10;const N=360,v=320;g+N>c.width&&(g=g-N-32),I+v>c.height&&(I=c.height-v-10),g<0&&(g=10),I<0&&(I=10),e.style.left=`${g}px`,e.style.top=`${I}px`,e.style.display="block",e.innerHTML=`
    <div class="tree-tooltip-header">
      <span>${n[t.type]||t.type}</span>
      <button class="tree-tooltip-close" id="tooltip-close">✕</button>
    </div>
    <div class="tree-tooltip-title">${t.label||"—"}</div>
    ${t.time_label?`<div class="tree-tooltip-time">${t.time_label} · Round ${t.round}</div>`:""}
    ${t.isBranch&&t.tendency?`<div class="tree-tooltip-tendency" style="color:${Be[t.tendency]||"#666"};">${i[t.tendency]||t.tendency}</div>`:""}
    ${t.description?`<div class="tree-tooltip-block"><div class="tree-tooltip-label">事件说明</div><p>${t.description}</p></div>`:""}
    ${t.trigger_reason?`<div class="tree-tooltip-block"><div class="tree-tooltip-label">触发原因</div><p>${t.trigger_reason}</p></div>`:""}
    ${s.length>0?`
      <div class="tree-tooltip-block">
        <div class="tree-tooltip-label">多 Agent 动作</div>
        <div class="tree-tooltip-list">
          ${s.map($=>`
            <div class="tree-tooltip-item">
              <div class="tree-tooltip-item-title">${$.agent_type||"Agent"} · ${($.action_type||"ACTION").replaceAll("_"," ")}</div>
              <div class="tree-tooltip-item-text">${$.narrative||"已执行动作。"}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}
    ${a.length>0?`
      <div class="tree-tooltip-block">
        <div class="tree-tooltip-label">状态摘要</div>
        <div class="tree-tooltip-metrics">
          ${a.map($=>`<span>${$.label}: ${$.percent}%</span>`).join("")}
        </div>
      </div>
    `:""}
    ${t.source_path_id?`
      <div class="tree-tooltip-block">
        <button class="btn btn-accent" id="tooltip-future-self" style="width:100%;justify-content:center;">和未来的自己对话</button>
      </div>
    `:""}
  `,(C=document.getElementById("tooltip-close"))==null||C.addEventListener("click",$=>{$.stopPropagation(),ni()}),(b=document.getElementById("tooltip-future-self"))==null||b.addEventListener("click",$=>{$.stopPropagation(),J("results",{resultsView:"detail",selectedPathId:t.source_path_id,selectedNodeIndex:t.source_node_index??0})})}function ni(){const t=document.getElementById("tree-node-tooltip");t&&(t.style.display="none")}const Re={decision:"var(--accent)",opportunity:"#7C3AED",result:"#0F766E",cascade:"#475569",risk:"var(--error)",reflection:"#2563EB",branch:"#8B5CF6"};function fa(t){return(t||"").replace(/[（(][^）)]*[）)]/g,"").trim()||"综合报告"}function Oe(t){const e=t.type==="branch"?"◇":"•",n=t.round!==void 0?`R${t.round}`:"--",i=[t.time_label,t.node_type].filter(Boolean).join(" · ");return`
    <div class="console-line" style="padding:8px 0;border-bottom:1px solid rgba(198,198,198,0.12);">
      <span class="console-ts">[${n}]</span>
      <span>${e} ${t.label||"未命名节点"}${i?` <span class="text-muted">/ ${i}</span>`:""}</span>
    </div>
  `}function ha(t,e){if(!t||!(e!=null&&e.id)||t.querySelector(`[data-event-id="${e.id}"]`))return;const n=document.createElement("div");n.dataset.eventId=e.id,n.innerHTML=Oe(e),t.prepend(n)}const Te=new Map;function ma(t,e){return`${t}:${e}`}function ii(t,e){const n=ma(t,e);return Te.has(n)||Te.set(n,{agent:null,messages:[],loading:!1}),Te.get(n)}function ga(t,e,n){const i=ii(t,n),a=i.messages.length?i.messages.map(s=>`
      <div style="padding:10px 12px;background:${s.role==="assistant"?"var(--surface-low)":"var(--white)"};border-left:2px solid ${s.role==="assistant"?"var(--accent)":"var(--outline-variant)"};margin-bottom:8px;">
        <div class="mono-xs" style="margin-bottom:6px;color:${s.role==="assistant"?"var(--accent)":"var(--outline)"};">${s.role==="assistant"?"未来的你":"你"}</div>
        <div style="font-size:13px;line-height:1.7;color:var(--secondary);white-space:pre-wrap;">${s.content}</div>
      </div>
    `).join(""):'<div class="mono-xs text-muted">和这个节点上的未来的你聊聊。系统会只加载该节点之前的历史，不会读取之后的剧情。</div>';return`
    <div class="card mb-24" style="border-left:3px solid var(--accent);">
      <div class="flex justify-between items-center mb-12" style="gap:12px;flex-wrap:wrap;">
        <div>
          <h3 style="margin-bottom:4px;">和未来的自己对话</h3>
          <div class="mono-xs text-muted">${e.time_label} · ${e.title}</div>
        </div>
        <span class="tag tag-accent">[FUTURE_SELF_AGENT]</span>
      </div>
      ${i.agent?`<div class="mono-xs text-accent mb-12">${i.agent.name} · ${i.agent.persona||""}</div>`:""}
      <div id="future-self-messages">${a}</div>
      <div class="form-group mt-16" style="margin-bottom:0;">
        <textarea class="form-textarea" id="future-self-input" placeholder="向这个节点上的未来的你提问，例如：如果我现在坚持申请海外大学，真正的代价是什么？" style="min-height:88px;"></textarea>
      </div>
      <div class="flex justify-end mt-12">
        <button class="btn btn-accent" id="btn-future-self-send" ${i.loading?'disabled style="opacity:0.5;"':""}>
          ${i.loading?"思考中...":"发送给未来的你"}
        </button>
      </div>
    </div>
  `}function va(t=[]){return E.selectedPathId&&t.find(e=>e.id===E.selectedPathId)||null}function ot(t,e={}){Object.assign(E,{resultsView:t,...e})}async function lt(t){let e=[];try{e=(await U.getPaths(E.projectId)).paths||[]}catch(a){t.innerHTML=`<div class="p-48 text-center"><h1>${S("error_loading")}</h1><p>${a.message}</p></div>`;return}const n=E.resultsView||"overview",i=va(e);n==="overview"?yn(t,e):n==="detail"&&i?_a(t,i):n==="advice"&&i?Ea(t,i):n==="story"&&i?$a(t,i):n==="report"?si(t):n==="backtrack"&&i?ai(t,i):(ot("overview",{selectedPathId:null,backtrackNodeIndex:null}),yn(t,e))}function yn(t,e){var i;const n=S("results_desc").replace("{count}",e.length);t.innerHTML=`
    <div class="results-header">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end">
        <div>
          <h1 style="font-size:48px;">${S("results_title")}</h1>
          <p class="text-secondary mt-8" style="max-width:600px;">${n}</p>
        </div>
        <div class="text-right">
          <div class="mono-xs text-muted">PROJECT: ${E.projectId}</div>
          <div class="mono-xs text-muted">${S("results_status")}</div>
        </div>
      </div>
    </div>
    <div class="results-body">
      ${e.map(a=>ya(a)).join("")}
      <div class="flex justify-between mt-32" style="flex-wrap:wrap;gap:12px;">
        <div class="flex gap-8" style="flex-wrap:wrap;">
          <button class="btn btn-ghost" onclick="navigateTo('graph')">
            <span class="material-symbols-outlined icon-sm">hub</span> ${S("nav_graph")}
          </button>
          <button class="btn btn-ghost" onclick="navigateTo('landing')">[${S("btn_new_sim")}]</button>
        </div>
        <button class="btn btn-accent" id="btn-report">
          <span class="material-symbols-outlined icon-sm">summarize</span> ${S("btn_view_report")||"VIEW REPORT"}
        </button>
      </div>
    </div>
  `,t.querySelectorAll(".path-card").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.pathId;ot("detail",{selectedPathId:s,backtrackNodeIndex:null}),lt(t)})}),(i=document.getElementById("btn-report"))==null||i.addEventListener("click",()=>{ot("report",{backtrackNodeIndex:null}),lt(t)})}function ya(t){var a;const e={low:"#2E7D32",medium:"#FF8F00",high:"var(--error)"},n=Math.round(t.satisfaction_score*100),i=t.path_type==="counterfactual";return`
    <div class="path-card ${i?"path-card-counterfactual":""}" data-path-id="${t.id}">
      <div class="path-card-header">
        <div>
          <span class="tag tag-${t.path_type==="optimal"?"accent":t.path_type==="risk"||i?"primary":"outline"}">[${(t.path_type||"balanced").toUpperCase()}]</span>
          <div class="path-card-name mt-8">${t.name}</div>
        </div>
        <div style="text-align:right;">
          <div class="mono-xs text-muted">${((a=t.nodes)==null?void 0:a.length)||0} ${S("path_nodes")}</div>
          <div class="mono-xs" style="color:${e[t.risk_level]||e.medium};">${S("path_risk_label")}: ${(t.risk_level||"medium").toUpperCase()}</div>
        </div>
      </div>
      <p class="path-card-summary">${t.summary}</p>
      <div class="path-card-stats">
        <div class="path-stat">
          <div class="path-stat-value" style="color:${n>70?"#2E7D32":n>50?"#FF8F00":"var(--error)"};">${n}%</div>
          <div class="path-stat-label">${S("path_satisfaction")}</div>
        </div>
        ${ba(t.final_state)}
      </div>
    </div>
  `}function ba(t){return t?["education","career","finance","health"].map(n=>`
    <div class="path-stat">
      <div class="path-stat-value">${Math.round((t[n]||0)*100)}%</div>
      <div class="path-stat-label">${Je(n)}</div>
    </div>
  `).join(""):""}function _a(t,e){const n=e.nodes||[],i=Math.min(Math.max(E.selectedNodeIndex||0,0),Math.max(n.length-1,0));E.selectedNodeIndex=i;const a=n[i];t.innerHTML=`
    <div class="detail-header">
      <div class="flex items-center gap-16 mb-8">
        <button class="btn btn-ghost" id="btn-back-overview" style="padding:8px 16px;">[← ${S("btn_back")}]</button>
        <span class="tag tag-primary">[${(e.path_type||"balanced").toUpperCase()}]</span>
        <span class="mono-xs text-muted flex items-center gap-4">
          <span class="status-dot status-active"></span> 
          ${n.length} NODES
        </span>
      </div>
      <h1 style="font-size:40px;">${e.name}</h1>
    </div>
    <div class="detail-body">
      <!-- Sidebar: Node List -->
      <div class="detail-sidebar">
        <h2 style="margin-bottom:16px;">[${S("detail_node_seq")}]</h2>
        <div id="node-list">
          ${n.map((s,r)=>`
            <div class="node-card ${r===i?"active":""}" data-index="${r}">
              <div class="node-type" style="color:${Re[s.node_type]||"var(--outline)"};">${s.node_type}</div>
              <div class="node-title">${s.title}</div>
              <div class="node-time">${s.time_label}</div>
            </div>
          `).join("")}
        </div>
        <div class="mt-24" style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-accent btn-full" id="btn-story" style="background:var(--secondary);color:white;">
            <span class="material-symbols-outlined icon-sm">auto_awesome</span> [${S("btn_get_story")}]
          </button>
          <button class="btn btn-accent btn-full" id="btn-advice">[${S("btn_get_advice")}]</button>
          <button class="btn btn-primary btn-full" id="btn-backtrack" style="background:var(--branch-accent);">
            <span class="material-symbols-outlined icon-sm">undo</span> [回溯推演]
          </button>
        </div>
      </div>

      <!-- Main: Node Detail + State Chart -->
      <div class="detail-main" id="node-detail-container">
        ${a?de(e.id,a,i,n.length):'<p class="p-32 text-muted">No nodes</p>'}
      </div>
    </div>
  `,document.getElementById("btn-back-overview").addEventListener("click",()=>{ot("overview",{selectedPathId:null,backtrackNodeIndex:null}),lt(t)}),t.querySelectorAll(".node-card").forEach(s=>{s.addEventListener("click",()=>{t.querySelectorAll(".node-card").forEach(o=>o.classList.remove("active")),s.classList.add("active");const r=parseInt(s.dataset.index);E.selectedNodeIndex=r,document.getElementById("node-detail-container").innerHTML=de(e.id,n[r],r,n.length),ue(t,e,n[r],r)})}),a&&ue(t,e,a,i),t.querySelector("#btn-story").addEventListener("click",()=>{ot("story"),lt(t)}),document.getElementById("btn-advice").addEventListener("click",()=>{ot("advice"),lt(t)}),document.getElementById("btn-backtrack").addEventListener("click",()=>{ot("backtrack",{backtrackNodeIndex:0}),lt(t)})}function de(t,e,n,i){const a=e.state_snapshot||{},s=e.agent_actions||[];return`
    <div class="fade-in">
      <div class="mono-xs text-muted mb-8">NODE ${n+1} OF ${i} // ${e.time_label}</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:32px;">
        <h1 style="font-size:32px;">${e.title}</h1>
        <div class="flex items-center gap-8 mt-8">
          <span class="tag" style="background:${Re[e.node_type]||"var(--outline)"};color:var(--white);">${e.node_type.toUpperCase()}</span>
          <span class="mono-xs">${e.time_label}</span>
        </div>
      </div>

      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">${S("detail_description")}</h3>
        <p style="font-size:14px;line-height:1.7;color:var(--secondary);">${e.description}</p>
      </div>

      ${s.length>0?`
      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">推演细节</h3>
        ${s.map(r=>`
          <div style="padding:10px 12px;border-left:2px solid ${Re[e.node_type]||"var(--accent)"};margin-bottom:10px;background:var(--surface-low);">
            <div class="mono-xs" style="margin-bottom:6px;">[${r.agent_type||"AGENT"}] ${(r.action_type||"ACTION").replaceAll("_"," ")}</div>
            <p style="font-size:13px;color:var(--secondary);line-height:1.6;">${r.narrative||"该轮行动已记录。"}</p>
          </div>
        `).join("")}
      </div>
      `:""}

      ${e.trigger_reason?`
      <div class="card mb-24" style="border-left:2px solid var(--accent);">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">${S("detail_trigger")}:</div>
        <p style="font-size:14px;color:var(--secondary);">${e.trigger_reason}</p>
      </div>
      `:""}

      <div class="card mb-24">
        <h3 style="margin-bottom:16px;">${S("detail_state_snapshot")}</h3>
        ${Yn.map(r=>{const o=a[r]||0,c=Math.round(o*100),l=c>70?"#2E7D32":c>40?"#FF8F00":"var(--error)";return`
            <div class="state-bar-container">
              <div class="state-bar-label">
                <span>${Je(r)}</span>
                <span style="color:${l}">${c}%</span>
              </div>
              <div class="state-bar">
                <div class="state-bar-fill" style="width:${c}%;background:${l};"></div>
              </div>
            </div>
          `}).join("")}
      </div>

      ${ga(t,e,n)}
    </div>
  `}function ue(t,e,n,i){const a=document.getElementById("btn-future-self-send"),s=document.getElementById("future-self-input");!a||!s||a.addEventListener("click",async()=>{const r=s.value.trim();if(!r)return;const o=ii(e.id,i);o.messages.push({role:"user",content:r}),o.loading=!0,document.getElementById("node-detail-container").innerHTML=de(e.id,n,i,(e.nodes||[]).length),ue(t,e,n,i);try{const c=o.messages.slice(0,-1).map(d=>({role:d.role,content:d.content})),l=await U.futureSelfChat(E.projectId,e.id,i,r,c);o.agent=l.agent||o.agent,o.messages.push({role:"assistant",content:l.reply||"未来的你暂时没有回答。"})}catch(c){o.messages.push({role:"assistant",content:`未来的你暂时失联：${c.message}`})}finally{o.loading=!1,document.getElementById("node-detail-container").innerHTML=de(e.id,n,i,(e.nodes||[]).length),ue(t,e,n,i)}})}function ai(t,e){var s,r,o;const n=e.nodes||[],i=E.backtrackNodeIndex,a=i===null?null:n[i];t.innerHTML=`
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
          <button class="btn btn-ghost" id="btn-back-from-bt">[← ${S("btn_back")}]</button>
        </div>
      </div>

      <div class="card mb-24" style="border-left:4px solid var(--branch-accent);padding:24px;">
        <h3 style="margin-bottom:16px;">1. 选择回溯节点</h3>
        <p class="mono-xs text-muted mb-16">点击选择你想修改条件的节点，系统会从该节点长出新的反事实分支。</p>
        <div class="backtrack-node-list" id="bt-node-list">
          ${n.map((c,l)=>`
            <div class="bt-node-card ${i===l?"bt-selected":""}" data-index="${l}">
              <div class="bt-node-idx">${l+1}</div>
              <div class="bt-node-info">
                <div class="bt-node-title">${c.title}</div>
                <div class="bt-node-meta">${c.time_label} · ${c.node_type}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card mb-24" style="padding:24px;${i===null?"opacity:0.5;pointer-events:none;":""}">
        <h3 style="margin-bottom:16px;">2. 修改条件</h3>
        <div class="form-group">
          <label class="form-label">修改描述（自然语言）</label>
          <textarea class="form-textarea" id="bt-description" placeholder="例如：假设保研成功 / 假设拿到了大厂 offer / 假设家庭经济好转"></textarea>
        </div>
        <div class="form-group mt-16">
          <label class="form-label">状态参数调整</label>
          <div class="bt-state-controls" id="bt-state-controls">
            ${xa(a||n[0])}
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
        <button class="btn btn-accent" id="btn-run-backtrack" ${i===null?'disabled style="opacity:0.5;"':""}>
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
            ${a?Oe({type:"source",round:i+1,time_label:a.time_label,node_type:a.node_type,label:`源节点: ${a.title}`}):'<div class="console-line"><span class="console-ts">[--]</span><span>等待选择节点...</span></div>'}
          </div>
          <div id="bt-result-actions" class="mt-16" style="display:none;"></div>
        </div>
      </div>
    </div>
  `,(s=document.getElementById("btn-back-from-bt"))==null||s.addEventListener("click",()=>{ot("detail",{backtrackNodeIndex:null}),lt(t)}),t.querySelectorAll(".bt-node-card").forEach(c=>{c.addEventListener("click",()=>{E.backtrackNodeIndex=parseInt(c.dataset.index,10),ai(t,e)})}),(r=document.getElementById("bt-rounds"))==null||r.addEventListener("input",c=>{document.getElementById("bt-rounds-value").textContent=c.target.value}),(o=document.getElementById("btn-run-backtrack"))==null||o.addEventListener("click",async()=>{var g,I,N,v,C;if(i===null)return;const c=((g=document.getElementById("bt-description"))==null?void 0:g.value)||"",l=parseInt(((I=document.getElementById("bt-rounds"))==null?void 0:I.value)||"6",10),d=document.getElementById("btn-run-backtrack"),_=document.getElementById("bt-progress"),f=document.getElementById("bt-status"),h=document.getElementById("bt-progress-fill"),k=document.getElementById("bt-tree-live"),y=document.getElementById("bt-result-actions"),x={};document.querySelectorAll(".bt-state-slider").forEach(b=>{x[b.dataset.key]=parseFloat(b.value)}),_&&(_.style.display="block"),d&&(d.disabled=!0,d.style.opacity="0.5"),k&&(k.innerHTML=a?Oe({type:"source",round:i+1,time_label:a.time_label,node_type:a.node_type,label:`源节点: ${a.title}`}):""),y&&(y.style.display="none");try{if(!((N=E.treeEvents)!=null&&N.length)){const O=await U.getTreeEvents(E.projectId);Mt(O.events||[])}const $=(await U.backtrack(E.projectId,e.id,i,x,c,l)).body.getReader(),M=new TextDecoder;let B="",T=null;for(;;){const{done:O,value:j}=await $.read();if(O)break;B+=M.decode(j,{stream:!0});const Y=B.split(`

`);B=Y.pop()||"";for(const m of Y)if(m.startsWith("data: "))try{const u=JSON.parse(m.slice(6));f!=null&&f.isConnected&&u.message&&(f.innerHTML=`<span class="console-ts">[BT]</span><span>${u.message}</span>`),h!=null&&h.isConnected&&u.progress!==void 0&&(h.style.width=`${u.progress}%`),u.phase==="tree_event"&&u.tree_event&&(fn(u.tree_event),ha(k,u.tree_event)),u.phase==="completed"&&(T=u.new_path_id||null,E.simComplete=!0,E.simulationTab="tree",E.project&&(E.project.status="completed"),f!=null&&f.isConnected&&(f.innerHTML=`<span class="console-ts" style="color:var(--accent);">[DONE]</span><span style="font-weight:700;color:var(--accent);">${u.message}</span>`,f.classList.remove("pulse")),y&&(y.style.display="flex",y.style.gap="8px",y.style.flexWrap="wrap",y.innerHTML=`
                  <button class="btn btn-primary" id="bt-open-tree">查看推演树</button>
                  <button class="btn btn-accent" id="bt-open-path" ${T?"":'disabled style="opacity:0.5;"'}>查看新路径</button>
                `,(v=document.getElementById("bt-open-tree"))==null||v.addEventListener("click",()=>{J("simulation",{simulationTab:"tree"})}),(C=document.getElementById("bt-open-path"))==null||C.addEventListener("click",()=>{T&&(ot("detail",{selectedPathId:T,backtrackNodeIndex:null}),lt(t))}))),u.phase==="error"&&(f!=null&&f.isConnected)&&(f.innerHTML=`<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">${u.message}</span>`,f.classList.remove("pulse"))}catch{}}}catch(b){f&&(f.innerHTML=`<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">回溯推演失败: ${b.message}</span>`,f.classList.remove("pulse"))}finally{d&&(d.disabled=!1,d.style.opacity="1")}})}function xa(t){const e=(t==null?void 0:t.state_snapshot)||{};return Yn.map(n=>{const i=e[n]||.5,a=Math.round(i*100);return`
      <div class="bt-state-row">
        <span class="bt-state-label">${Je(n)}</span>
        <input type="range" class="slider bt-state-slider" data-key="${n}" min="0" max="1" step="0.05" value="${i}" />
        <span class="bt-state-val mono-xs">${a}%</span>
      </div>
    `}).join("")}async function si(t,e){var n,i;t.innerHTML=`
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:44px;">综合报告</h1>
          <p class="text-secondary mt-8">多路径对比、关键节点与下一步建议</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-from-report">[← ${S("btn_back")}]</button>
        </div>
      </div>

      <div id="report-content">
        <div class="text-center p-48 text-muted pulse mono-xs">正在生成综合评估报告...</div>
      </div>
    </div>
  `,(n=document.getElementById("btn-back-from-report"))==null||n.addEventListener("click",()=>{ot("overview"),lt(t)});try{const a=await U.getReport(E.projectId);wa(a)}catch(a){document.getElementById("report-content").innerHTML=`
      <div class="p-32 text-center text-error">
        <p>报告生成失败: ${a.message}</p>
        <button class="btn btn-ghost mt-16" id="btn-retry-report">[RETRY]</button>
      </div>
    `,(i=document.getElementById("btn-retry-report"))==null||i.addEventListener("click",()=>{si(t)})}}function wa(t){const e=document.getElementById("report-content");if(!e)return;const n=t.path_comparison||[],i=t.critical_nodes||[],a=t.next_steps||[];e.innerHTML=`
    <div class="fade-in">
      <!-- Executive Summary -->
      <div class="card mb-24" style="border-left:4px solid var(--accent);padding:32px;">
        <h2 style="margin-bottom:16px;line-height:1.3;word-break:break-word;">${fa(t.title)}</h2>
        <p style="font-size:16px;line-height:1.8;color:var(--secondary);">${t.executive_summary||""}</p>
      </div>

      <!-- Path Comparison -->
      ${n.length>0?`
      <div class="mb-32">
        <h2 style="margin-bottom:24px;">[PATH_COMPARISON]</h2>
        <div class="grid gap-16" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));">
          ${n.map(s=>`
            <div class="card">
              <h3 style="margin-bottom:12px;color:var(--accent);">${s.path_name||"路径"}</h3>
              <div style="margin-bottom:12px;">
                <div class="mono-xs text-muted mb-8">STRENGTHS</div>
                ${(s.strengths||[]).map(r=>`<div class="advice-item" style="border-left-color:#2E7D32;">${r}</div>`).join("")}
              </div>
              <div style="margin-bottom:12px;">
                <div class="mono-xs text-muted mb-8">RISKS</div>
                ${(s.risks||[]).map(r=>`<div class="advice-item" style="border-left-color:var(--error);">${r}</div>`).join("")}
              </div>
              ${s.key_turning_point?`
              <div class="mono-xs mt-8" style="padding:8px;background:var(--surface-low);">
                TURNING_POINT: ${s.key_turning_point}
              </div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
      `:""}

      <!-- Critical Nodes -->
      ${i.length>0?`
      <div class="mb-32">
        <h2 style="margin-bottom:24px;">[CRITICAL_NODES]</h2>
        ${i.map((s,r)=>`
          <div class="card mb-16" style="border-left:3px solid ${r===0?"var(--accent)":"var(--outline-variant)"};">
            <div class="flex justify-between items-center mb-8">
              <span class="tag tag-${r===0?"accent":"outline"}">${s.time_label||`NODE_${r+1}`}</span>
            </div>
            <p style="font-size:14px;margin-bottom:8px;">${s.description||""}</p>
            ${s.recommendation?`<div class="mono-xs text-accent">→ ${s.recommendation}</div>`:""}
          </div>
        `).join("")}
      </div>
      `:""}

      <!-- Overall Recommendation -->
      ${t.overall_recommendation?`
      <div class="card mb-24" style="background:var(--primary);color:var(--white);padding:32px;">
        <h2 style="color:var(--accent);margin-bottom:16px;">[OVERALL_RECOMMENDATION]</h2>
        <p style="font-size:16px;line-height:1.8;">${t.overall_recommendation}</p>
      </div>
      `:""}

      <!-- Next Steps -->
      ${a.length>0?`
      <div class="card mb-24">
        <h2 style="margin-bottom:16px;">[NEXT_STEPS]</h2>
        ${a.map((s,r)=>`
          <div class="flex gap-16 mb-16 items-start">
            <span class="text-accent" style="font-family:var(--font-mono);font-size:24px;font-weight:700;min-width:48px;">0${r+1}.</span>
            <p style="font-size:14px;line-height:1.6;padding-top:4px;">${s}</p>
          </div>
        `).join("")}
      </div>
      `:""}
    </div>
  `}async function Ea(t,e){t.innerHTML=`
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">${S("advice_title")}</h1>
          <p class="text-secondary mt-8">${S("advice_desc").replace("{path}",e.name)}</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-detail">[← ${S("btn_back")}]</button>
        </div>
      </div>

      <div class="flex gap-16 mb-32">
        <button class="btn btn-accent" id="btn-satisfied">[${S("advice_satisfied")}]</button>
        <button class="btn btn-ghost" id="btn-unsatisfied">[${S("advice_unsatisfied")}]</button>
      </div>

      <div id="advice-content">
        <div class="text-center p-48 text-muted">${S("advice_choose")}</div>
      </div>
    </div>
  `,document.getElementById("btn-back-detail").addEventListener("click",()=>{ot("detail"),lt(t)}),document.getElementById("btn-satisfied").addEventListener("click",()=>bn(t,"satisfied")),document.getElementById("btn-unsatisfied").addEventListener("click",()=>bn(t,"unsatisfied"))}async function bn(t,e){const n=document.getElementById("advice-content");n.innerHTML=`<div class="p-32 text-center mono-xs pulse">${S("advice_generating")}</div>`;try{const i=await U.getAdvice(E.projectId,E.selectedPathId,e);e==="satisfied"?n.innerHTML=`
        <div class="fade-in">
          <h2 style="font-family:var(--font-headline);font-size:28px;font-weight:700;margin-bottom:32px;">${i.title}</h2>
          <div class="grid-3 gap-16" style="border:1px solid rgba(198,198,198,0.3);">
            <div style="padding:24px;background:var(--surface-low);border-right:1px solid rgba(198,198,198,0.3);">
              <div class="flex justify-between items-center mb-24">
                <h2>${S("advice_immediate")}</h2>
                <span class="tag tag-accent">[PRIORITY]</span>
              </div>
              ${(i.immediate_actions||[]).map((a,s)=>`
                <div class="card mb-8">
                  <div class="flex gap-16"><span class="text-accent" style="font-family:var(--font-mono);font-size:18px;font-weight:700;">0${s+1}.</span><p style="font-size:13px;">${a}</p></div>
                </div>
              `).join("")}
            </div>
            <div style="padding:24px;border-right:1px solid rgba(198,198,198,0.3);">
              <div class="flex justify-between items-center mb-24">
                <h2>${S("advice_mid_term")}</h2>
                <span class="tag tag-outline">[PHASE]</span>
              </div>
              ${(i.mid_term_plan||[]).map(a=>`
                <div class="card mb-8"><p style="font-size:13px;">${a}</p></div>
              `).join("")}
            </div>
            <div style="padding:24px;background:var(--surface-low);">
              <div class="flex justify-between items-center mb-24">
                <h2>${S("advice_risk_mit")}</h2>
                <span class="tag tag-muted">[DEFENSIVE]</span>
              </div>
              ${(i.risk_mitigation||[]).map(a=>`
                <div class="card mb-8"><p style="font-size:13px;">${a}</p></div>
              `).join("")}
            </div>
          </div>
          ${(i.key_nodes||[]).length?`
          <div class="card mt-24" style="border-left:2px solid var(--accent);">
            <div class="mono-xs text-accent mb-8">${S("advice_key_nodes")}:</div>
            ${i.key_nodes.map(a=>`<div class="advice-item">${a}</div>`).join("")}
          </div>`:""}
        </div>
      `:n.innerHTML=`
        <div class="fade-in">
          <h2 style="font-family:var(--font-headline);font-size:28px;font-weight:700;margin-bottom:32px;">${i.title}</h2>
          <div class="grid-2 gap-16">
            <div>
              <div class="advice-section">
                <h3 class="text-accent">${S("advice_risk_analysis")}</h3>
                ${(i.risk_analysis||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
              <div class="advice-section">
                <h3>${S("advice_intervention")}</h3>
                ${(i.intervention_points||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
            </div>
            <div>
              <div class="advice-section">
                <h3>${S("advice_alternative")}</h3>
                ${(i.alternative_paths||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
              <div class="advice-section">
                <h3>${S("advice_mental")}</h3>
                ${(i.mental_support||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `}catch(i){n.innerHTML=`<div class="p-32 text-center text-error">Error: ${i.message}</div>`}}async function $a(t,e){t.innerHTML=`
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[NARRATIVE_ENGINE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">${S("story_title")}</h1>
          <p class="text-secondary mt-8">AI generated life story for "${e.name}"</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-accent" id="btn-regenerate-story">[重新生成]</button>
          <button class="btn btn-ghost" id="btn-back-detail-from-story">[← ${S("btn_back")}]</button>
        </div>
      </div>

      <div id="story-content">
        <div class="p-48 text-center mono-xs pulse">${S("story_generating")}</div>
      </div>
    </div>
  `,document.getElementById("btn-back-detail-from-story").addEventListener("click",()=>{ot("detail"),lt(t)}),document.getElementById("btn-regenerate-story").addEventListener("click",()=>{_n(t,!0)}),_n(t,!1)}async function _n(t,e=!1){const n=document.getElementById("story-content");if(n){n.innerHTML=`<div class="p-48 text-center mono-xs pulse">${e?"正在重新生成剧本...":S("story_generating")}</div>`;try{const i=await U.getStory(E.projectId,E.selectedPathId,e);let a=i.story||i;a=a.split("\\n").join("<br/>").split("\\n\\n").join("<br/><br/>").split("\\n").join("<br/>").replace(/\\n/g,"<br/>").replace(/\\r/g,"").replace(/\\n/g,"<br/>"),typeof a=="string"&&(a=a.replace(/\\n/g,"<br/><br/>").replace(/\n/g,"<br/><br/>")),n.innerHTML=`
      <div class="fade-in card" style="padding: 48px; background: var(--white); box-shadow: 0 4px 24px rgba(0,0,0,0.02); max-width: 800px; margin: 0 auto;">
        <div class="mono-xs text-muted mb-16">${i.cached?"[已保存缓存]":"[刚刚重新生成]"}</div>
        <p style="font-size:16px; line-height: 2; color: var(--on-surface); text-indent: 2em; letter-spacing: 0.5px; font-family: var(--font-headline);">
          ${a}
        </p>
      </div>
    `}catch(i){n.innerHTML=`<div class="p-32 text-center text-error">Failed to generate story: ${i.message}</div>`}}}var ka={value:()=>{}};function Yt(){for(var t=0,e=arguments.length,n={},i;t<e;++t){if(!(i=arguments[t]+"")||i in n||/[\s.]/.test(i))throw new Error("illegal type: "+i);n[i]=[]}return new re(n)}function re(t){this._=t}function Ia(t,e){return t.trim().split(/^|\s+/).map(function(n){var i="",a=n.indexOf(".");if(a>=0&&(i=n.slice(a+1),n=n.slice(0,a)),n&&!e.hasOwnProperty(n))throw new Error("unknown type: "+n);return{type:n,name:i}})}re.prototype=Yt.prototype={constructor:re,on:function(t,e){var n=this._,i=Ia(t+"",n),a,s=-1,r=i.length;if(arguments.length<2){for(;++s<r;)if((a=(t=i[s]).type)&&(a=Ta(n[a],t.name)))return a;return}if(e!=null&&typeof e!="function")throw new Error("invalid callback: "+e);for(;++s<r;)if(a=(t=i[s]).type)n[a]=xn(n[a],t.name,e);else if(e==null)for(a in n)n[a]=xn(n[a],t.name,null);return this},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new re(t)},call:function(t,e){if((a=arguments.length-2)>0)for(var n=new Array(a),i=0,a,s;i<a;++i)n[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(s=this._[t],i=0,a=s.length;i<a;++i)s[i].value.apply(e,n)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var i=this._[t],a=0,s=i.length;a<s;++a)i[a].value.apply(e,n)}};function Ta(t,e){for(var n=0,i=t.length,a;n<i;++n)if((a=t[n]).name===e)return a.value}function xn(t,e,n){for(var i=0,a=t.length;i<a;++i)if(t[i].name===e){t[i]=ka,t=t.slice(0,i).concat(t.slice(i+1));break}return n!=null&&t.push({name:e,value:n}),t}var De="http://www.w3.org/1999/xhtml";const wn={svg:"http://www.w3.org/2000/svg",xhtml:De,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function _e(t){var e=t+="",n=e.indexOf(":");return n>=0&&(e=t.slice(0,n))!=="xmlns"&&(t=t.slice(n+1)),wn.hasOwnProperty(e)?{space:wn[e],local:t}:t}function Sa(t){return function(){var e=this.ownerDocument,n=this.namespaceURI;return n===De&&e.documentElement.namespaceURI===De?e.createElement(t):e.createElementNS(n,t)}}function Aa(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function ri(t){var e=_e(t);return(e.local?Aa:Sa)(e)}function Na(){}function nn(t){return t==null?Na:function(){return this.querySelector(t)}}function Ca(t){typeof t!="function"&&(t=nn(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=new Array(r),c,l,d=0;d<r;++d)(c=s[d])&&(l=t.call(c,c.__data__,d,s))&&("__data__"in c&&(l.__data__=c.__data__),o[d]=l);return new rt(i,this._parents)}function La(t){return t==null?[]:Array.isArray(t)?t:Array.from(t)}function Ma(){return[]}function oi(t){return t==null?Ma:function(){return this.querySelectorAll(t)}}function Ba(t){return function(){return La(t.apply(this,arguments))}}function Pa(t){typeof t=="function"?t=Ba(t):t=oi(t);for(var e=this._groups,n=e.length,i=[],a=[],s=0;s<n;++s)for(var r=e[s],o=r.length,c,l=0;l<o;++l)(c=r[l])&&(i.push(t.call(c,c.__data__,l,r)),a.push(c));return new rt(i,a)}function li(t){return function(){return this.matches(t)}}function ci(t){return function(e){return e.matches(t)}}var Ra=Array.prototype.find;function Oa(t){return function(){return Ra.call(this.children,t)}}function Da(){return this.firstElementChild}function za(t){return this.select(t==null?Da:Oa(typeof t=="function"?t:ci(t)))}var Ha=Array.prototype.filter;function ja(){return Array.from(this.children)}function Fa(t){return function(){return Ha.call(this.children,t)}}function Ga(t){return this.selectAll(t==null?ja:Fa(typeof t=="function"?t:ci(t)))}function Ya(t){typeof t!="function"&&(t=li(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=[],c,l=0;l<r;++l)(c=s[l])&&t.call(c,c.__data__,l,s)&&o.push(c);return new rt(i,this._parents)}function di(t){return new Array(t.length)}function Va(){return new rt(this._enter||this._groups.map(di),this._parents)}function pe(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}pe.prototype={constructor:pe,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};function qa(t){return function(){return t}}function Ua(t,e,n,i,a,s){for(var r=0,o,c=e.length,l=s.length;r<l;++r)(o=e[r])?(o.__data__=s[r],i[r]=o):n[r]=new pe(t,s[r]);for(;r<c;++r)(o=e[r])&&(a[r]=o)}function Xa(t,e,n,i,a,s,r){var o,c,l=new Map,d=e.length,_=s.length,f=new Array(d),h;for(o=0;o<d;++o)(c=e[o])&&(f[o]=h=r.call(c,c.__data__,o,e)+"",l.has(h)?a[o]=c:l.set(h,c));for(o=0;o<_;++o)h=r.call(t,s[o],o,s)+"",(c=l.get(h))?(i[o]=c,c.__data__=s[o],l.delete(h)):n[o]=new pe(t,s[o]);for(o=0;o<d;++o)(c=e[o])&&l.get(f[o])===c&&(a[o]=c)}function Wa(t){return t.__data__}function Ja(t,e){if(!arguments.length)return Array.from(this,Wa);var n=e?Xa:Ua,i=this._parents,a=this._groups;typeof t!="function"&&(t=qa(t));for(var s=a.length,r=new Array(s),o=new Array(s),c=new Array(s),l=0;l<s;++l){var d=i[l],_=a[l],f=_.length,h=Ka(t.call(d,d&&d.__data__,l,i)),k=h.length,y=o[l]=new Array(k),x=r[l]=new Array(k),g=c[l]=new Array(f);n(d,_,y,x,g,h,e);for(var I=0,N=0,v,C;I<k;++I)if(v=y[I]){for(I>=N&&(N=I+1);!(C=x[N])&&++N<k;);v._next=C||null}}return r=new rt(r,i),r._enter=o,r._exit=c,r}function Ka(t){return typeof t=="object"&&"length"in t?t:Array.from(t)}function Qa(){return new rt(this._exit||this._groups.map(di),this._parents)}function Za(t,e,n){var i=this.enter(),a=this,s=this.exit();return typeof t=="function"?(i=t(i),i&&(i=i.selection())):i=i.append(t+""),e!=null&&(a=e(a),a&&(a=a.selection())),n==null?s.remove():n(s),i&&a?i.merge(a).order():a}function ts(t){for(var e=t.selection?t.selection():t,n=this._groups,i=e._groups,a=n.length,s=i.length,r=Math.min(a,s),o=new Array(a),c=0;c<r;++c)for(var l=n[c],d=i[c],_=l.length,f=o[c]=new Array(_),h,k=0;k<_;++k)(h=l[k]||d[k])&&(f[k]=h);for(;c<a;++c)o[c]=n[c];return new rt(o,this._parents)}function es(){for(var t=this._groups,e=-1,n=t.length;++e<n;)for(var i=t[e],a=i.length-1,s=i[a],r;--a>=0;)(r=i[a])&&(s&&r.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(r,s),s=r);return this}function ns(t){t||(t=is);function e(_,f){return _&&f?t(_.__data__,f.__data__):!_-!f}for(var n=this._groups,i=n.length,a=new Array(i),s=0;s<i;++s){for(var r=n[s],o=r.length,c=a[s]=new Array(o),l,d=0;d<o;++d)(l=r[d])&&(c[d]=l);c.sort(e)}return new rt(a,this._parents).order()}function is(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function as(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this}function ss(){return Array.from(this)}function rs(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var i=t[e],a=0,s=i.length;a<s;++a){var r=i[a];if(r)return r}return null}function os(){let t=0;for(const e of this)++t;return t}function ls(){return!this.node()}function cs(t){for(var e=this._groups,n=0,i=e.length;n<i;++n)for(var a=e[n],s=0,r=a.length,o;s<r;++s)(o=a[s])&&t.call(o,o.__data__,s,a);return this}function ds(t){return function(){this.removeAttribute(t)}}function us(t){return function(){this.removeAttributeNS(t.space,t.local)}}function ps(t,e){return function(){this.setAttribute(t,e)}}function fs(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function hs(t,e){return function(){var n=e.apply(this,arguments);n==null?this.removeAttribute(t):this.setAttribute(t,n)}}function ms(t,e){return function(){var n=e.apply(this,arguments);n==null?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n)}}function gs(t,e){var n=_e(t);if(arguments.length<2){var i=this.node();return n.local?i.getAttributeNS(n.space,n.local):i.getAttribute(n)}return this.each((e==null?n.local?us:ds:typeof e=="function"?n.local?ms:hs:n.local?fs:ps)(n,e))}function ui(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function vs(t){return function(){this.style.removeProperty(t)}}function ys(t,e,n){return function(){this.style.setProperty(t,e,n)}}function bs(t,e,n){return function(){var i=e.apply(this,arguments);i==null?this.style.removeProperty(t):this.style.setProperty(t,i,n)}}function _s(t,e,n){return arguments.length>1?this.each((e==null?vs:typeof e=="function"?bs:ys)(t,e,n??"")):Ct(this.node(),t)}function Ct(t,e){return t.style.getPropertyValue(e)||ui(t).getComputedStyle(t,null).getPropertyValue(e)}function xs(t){return function(){delete this[t]}}function ws(t,e){return function(){this[t]=e}}function Es(t,e){return function(){var n=e.apply(this,arguments);n==null?delete this[t]:this[t]=n}}function $s(t,e){return arguments.length>1?this.each((e==null?xs:typeof e=="function"?Es:ws)(t,e)):this.node()[t]}function pi(t){return t.trim().split(/^|\s+/)}function an(t){return t.classList||new fi(t)}function fi(t){this._node=t,this._names=pi(t.getAttribute("class")||"")}fi.prototype={add:function(t){var e=this._names.indexOf(t);e<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};function hi(t,e){for(var n=an(t),i=-1,a=e.length;++i<a;)n.add(e[i])}function mi(t,e){for(var n=an(t),i=-1,a=e.length;++i<a;)n.remove(e[i])}function ks(t){return function(){hi(this,t)}}function Is(t){return function(){mi(this,t)}}function Ts(t,e){return function(){(e.apply(this,arguments)?hi:mi)(this,t)}}function Ss(t,e){var n=pi(t+"");if(arguments.length<2){for(var i=an(this.node()),a=-1,s=n.length;++a<s;)if(!i.contains(n[a]))return!1;return!0}return this.each((typeof e=="function"?Ts:e?ks:Is)(n,e))}function As(){this.textContent=""}function Ns(t){return function(){this.textContent=t}}function Cs(t){return function(){var e=t.apply(this,arguments);this.textContent=e??""}}function Ls(t){return arguments.length?this.each(t==null?As:(typeof t=="function"?Cs:Ns)(t)):this.node().textContent}function Ms(){this.innerHTML=""}function Bs(t){return function(){this.innerHTML=t}}function Ps(t){return function(){var e=t.apply(this,arguments);this.innerHTML=e??""}}function Rs(t){return arguments.length?this.each(t==null?Ms:(typeof t=="function"?Ps:Bs)(t)):this.node().innerHTML}function Os(){this.nextSibling&&this.parentNode.appendChild(this)}function Ds(){return this.each(Os)}function zs(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function Hs(){return this.each(zs)}function js(t){var e=typeof t=="function"?t:ri(t);return this.select(function(){return this.appendChild(e.apply(this,arguments))})}function Fs(){return null}function Gs(t,e){var n=typeof t=="function"?t:ri(t),i=e==null?Fs:typeof e=="function"?e:nn(e);return this.select(function(){return this.insertBefore(n.apply(this,arguments),i.apply(this,arguments)||null)})}function Ys(){var t=this.parentNode;t&&t.removeChild(this)}function Vs(){return this.each(Ys)}function qs(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Us(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Xs(t){return this.select(t?Us:qs)}function Ws(t){return arguments.length?this.property("__data__",t):this.node().__data__}function Js(t){return function(e){t.call(this,e,this.__data__)}}function Ks(t){return t.trim().split(/^|\s+/).map(function(e){var n="",i=e.indexOf(".");return i>=0&&(n=e.slice(i+1),e=e.slice(0,i)),{type:e,name:n}})}function Qs(t){return function(){var e=this.__on;if(e){for(var n=0,i=-1,a=e.length,s;n<a;++n)s=e[n],(!t.type||s.type===t.type)&&s.name===t.name?this.removeEventListener(s.type,s.listener,s.options):e[++i]=s;++i?e.length=i:delete this.__on}}}function Zs(t,e,n){return function(){var i=this.__on,a,s=Js(e);if(i){for(var r=0,o=i.length;r<o;++r)if((a=i[r]).type===t.type&&a.name===t.name){this.removeEventListener(a.type,a.listener,a.options),this.addEventListener(a.type,a.listener=s,a.options=n),a.value=e;return}}this.addEventListener(t.type,s,n),a={type:t.type,name:t.name,value:e,listener:s,options:n},i?i.push(a):this.__on=[a]}}function tr(t,e,n){var i=Ks(t+""),a,s=i.length,r;if(arguments.length<2){var o=this.node().__on;if(o){for(var c=0,l=o.length,d;c<l;++c)for(a=0,d=o[c];a<s;++a)if((r=i[a]).type===d.type&&r.name===d.name)return d.value}return}for(o=e?Zs:Qs,a=0;a<s;++a)this.each(o(i[a],e,n));return this}function gi(t,e,n){var i=ui(t),a=i.CustomEvent;typeof a=="function"?a=new a(e,n):(a=i.document.createEvent("Event"),n?(a.initEvent(e,n.bubbles,n.cancelable),a.detail=n.detail):a.initEvent(e,!1,!1)),t.dispatchEvent(a)}function er(t,e){return function(){return gi(this,t,e)}}function nr(t,e){return function(){return gi(this,t,e.apply(this,arguments))}}function ir(t,e){return this.each((typeof e=="function"?nr:er)(t,e))}function*ar(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var i=t[e],a=0,s=i.length,r;a<s;++a)(r=i[a])&&(yield r)}var vi=[null];function rt(t,e){this._groups=t,this._parents=e}function Vt(){return new rt([[document.documentElement]],vi)}function sr(){return this}rt.prototype=Vt.prototype={constructor:rt,select:Ca,selectAll:Pa,selectChild:za,selectChildren:Ga,filter:Ya,data:Ja,enter:Va,exit:Qa,join:Za,merge:ts,selection:sr,order:es,sort:ns,call:as,nodes:ss,node:rs,size:os,empty:ls,each:cs,attr:gs,style:_s,property:$s,classed:Ss,text:Ls,html:Rs,raise:Ds,lower:Hs,append:js,insert:Gs,remove:Vs,clone:Xs,datum:Ws,on:tr,dispatch:ir,[Symbol.iterator]:ar};function tt(t){return typeof t=="string"?new rt([[document.querySelector(t)]],[document.documentElement]):new rt([[t]],vi)}function rr(t){let e;for(;e=t.sourceEvent;)t=e;return t}function mt(t,e){if(t=rr(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var i=n.createSVGPoint();return i.x=t.clientX,i.y=t.clientY,i=i.matrixTransform(e.getScreenCTM().inverse()),[i.x,i.y]}if(e.getBoundingClientRect){var a=e.getBoundingClientRect();return[t.clientX-a.left-e.clientLeft,t.clientY-a.top-e.clientTop]}}return[t.pageX,t.pageY]}const or={passive:!1},zt={capture:!0,passive:!1};function Se(t){t.stopImmediatePropagation()}function At(t){t.preventDefault(),t.stopImmediatePropagation()}function yi(t){var e=t.document.documentElement,n=tt(t).on("dragstart.drag",At,zt);"onselectstart"in e?n.on("selectstart.drag",At,zt):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function bi(t,e){var n=t.document.documentElement,i=tt(t).on("dragstart.drag",null);e&&(i.on("click.drag",At,zt),setTimeout(function(){i.on("click.drag",null)},0)),"onselectstart"in n?i.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}const Wt=t=>()=>t;function ze(t,{sourceEvent:e,subject:n,target:i,identifier:a,active:s,x:r,y:o,dx:c,dy:l,dispatch:d}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},subject:{value:n,enumerable:!0,configurable:!0},target:{value:i,enumerable:!0,configurable:!0},identifier:{value:a,enumerable:!0,configurable:!0},active:{value:s,enumerable:!0,configurable:!0},x:{value:r,enumerable:!0,configurable:!0},y:{value:o,enumerable:!0,configurable:!0},dx:{value:c,enumerable:!0,configurable:!0},dy:{value:l,enumerable:!0,configurable:!0},_:{value:d}})}ze.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};function lr(t){return!t.ctrlKey&&!t.button}function cr(){return this.parentNode}function dr(t,e){return e??{x:t.x,y:t.y}}function ur(){return navigator.maxTouchPoints||"ontouchstart"in this}function pr(){var t=lr,e=cr,n=dr,i=ur,a={},s=Yt("start","drag","end"),r=0,o,c,l,d,_=0;function f(v){v.on("mousedown.drag",h).filter(i).on("touchstart.drag",x).on("touchmove.drag",g,or).on("touchend.drag touchcancel.drag",I).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function h(v,C){if(!(d||!t.call(this,v,C))){var b=N(this,e.call(this,v,C),v,C,"mouse");b&&(tt(v.view).on("mousemove.drag",k,zt).on("mouseup.drag",y,zt),yi(v.view),Se(v),l=!1,o=v.clientX,c=v.clientY,b("start",v))}}function k(v){if(At(v),!l){var C=v.clientX-o,b=v.clientY-c;l=C*C+b*b>_}a.mouse("drag",v)}function y(v){tt(v.view).on("mousemove.drag mouseup.drag",null),bi(v.view,l),At(v),a.mouse("end",v)}function x(v,C){if(t.call(this,v,C)){var b=v.changedTouches,$=e.call(this,v,C),M=b.length,B,T;for(B=0;B<M;++B)(T=N(this,$,v,C,b[B].identifier,b[B]))&&(Se(v),T("start",v,b[B]))}}function g(v){var C=v.changedTouches,b=C.length,$,M;for($=0;$<b;++$)(M=a[C[$].identifier])&&(At(v),M("drag",v,C[$]))}function I(v){var C=v.changedTouches,b=C.length,$,M;for(d&&clearTimeout(d),d=setTimeout(function(){d=null},500),$=0;$<b;++$)(M=a[C[$].identifier])&&(Se(v),M("end",v,C[$]))}function N(v,C,b,$,M,B){var T=s.copy(),O=mt(B||b,C),j,Y,m;if((m=n.call(v,new ze("beforestart",{sourceEvent:b,target:f,identifier:M,active:r,x:O[0],y:O[1],dx:0,dy:0,dispatch:T}),$))!=null)return j=m.x-O[0]||0,Y=m.y-O[1]||0,function u(p,w,A){var L=O,P;switch(p){case"start":a[M]=u,P=r++;break;case"end":delete a[M],--r;case"drag":O=mt(A||w,C),P=r;break}T.call(p,v,new ze(p,{sourceEvent:w,subject:m,target:f,identifier:M,active:P,x:O[0]+j,y:O[1]+Y,dx:O[0]-L[0],dy:O[1]-L[1],dispatch:T}),$)}}return f.filter=function(v){return arguments.length?(t=typeof v=="function"?v:Wt(!!v),f):t},f.container=function(v){return arguments.length?(e=typeof v=="function"?v:Wt(v),f):e},f.subject=function(v){return arguments.length?(n=typeof v=="function"?v:Wt(v),f):n},f.touchable=function(v){return arguments.length?(i=typeof v=="function"?v:Wt(!!v),f):i},f.on=function(){var v=s.on.apply(s,arguments);return v===s?f:v},f.clickDistance=function(v){return arguments.length?(_=(v=+v)*v,f):Math.sqrt(_)},f}function sn(t,e,n){t.prototype=e.prototype=n,n.constructor=t}function _i(t,e){var n=Object.create(t.prototype);for(var i in e)n[i]=e[i];return n}function qt(){}var Ht=.7,fe=1/Ht,Nt="\\s*([+-]?\\d+)\\s*",jt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",pt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",fr=/^#([0-9a-f]{3,8})$/,hr=new RegExp(`^rgb\\(${Nt},${Nt},${Nt}\\)$`),mr=new RegExp(`^rgb\\(${pt},${pt},${pt}\\)$`),gr=new RegExp(`^rgba\\(${Nt},${Nt},${Nt},${jt}\\)$`),vr=new RegExp(`^rgba\\(${pt},${pt},${pt},${jt}\\)$`),yr=new RegExp(`^hsl\\(${jt},${pt},${pt}\\)$`),br=new RegExp(`^hsla\\(${jt},${pt},${pt},${jt}\\)$`),En={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};sn(qt,Ft,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:$n,formatHex:$n,formatHex8:_r,formatHsl:xr,formatRgb:kn,toString:kn});function $n(){return this.rgb().formatHex()}function _r(){return this.rgb().formatHex8()}function xr(){return xi(this).formatHsl()}function kn(){return this.rgb().formatRgb()}function Ft(t){var e,n;return t=(t+"").trim().toLowerCase(),(e=fr.exec(t))?(n=e[1].length,e=parseInt(e[1],16),n===6?In(e):n===3?new st(e>>8&15|e>>4&240,e>>4&15|e&240,(e&15)<<4|e&15,1):n===8?Jt(e>>24&255,e>>16&255,e>>8&255,(e&255)/255):n===4?Jt(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|e&240,((e&15)<<4|e&15)/255):null):(e=hr.exec(t))?new st(e[1],e[2],e[3],1):(e=mr.exec(t))?new st(e[1]*255/100,e[2]*255/100,e[3]*255/100,1):(e=gr.exec(t))?Jt(e[1],e[2],e[3],e[4]):(e=vr.exec(t))?Jt(e[1]*255/100,e[2]*255/100,e[3]*255/100,e[4]):(e=yr.exec(t))?An(e[1],e[2]/100,e[3]/100,1):(e=br.exec(t))?An(e[1],e[2]/100,e[3]/100,e[4]):En.hasOwnProperty(t)?In(En[t]):t==="transparent"?new st(NaN,NaN,NaN,0):null}function In(t){return new st(t>>16&255,t>>8&255,t&255,1)}function Jt(t,e,n,i){return i<=0&&(t=e=n=NaN),new st(t,e,n,i)}function wr(t){return t instanceof qt||(t=Ft(t)),t?(t=t.rgb(),new st(t.r,t.g,t.b,t.opacity)):new st}function He(t,e,n,i){return arguments.length===1?wr(t):new st(t,e,n,i??1)}function st(t,e,n,i){this.r=+t,this.g=+e,this.b=+n,this.opacity=+i}sn(st,He,_i(qt,{brighter(t){return t=t==null?fe:Math.pow(fe,t),new st(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=t==null?Ht:Math.pow(Ht,t),new st(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new st(kt(this.r),kt(this.g),kt(this.b),he(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Tn,formatHex:Tn,formatHex8:Er,formatRgb:Sn,toString:Sn}));function Tn(){return`#${Et(this.r)}${Et(this.g)}${Et(this.b)}`}function Er(){return`#${Et(this.r)}${Et(this.g)}${Et(this.b)}${Et((isNaN(this.opacity)?1:this.opacity)*255)}`}function Sn(){const t=he(this.opacity);return`${t===1?"rgb(":"rgba("}${kt(this.r)}, ${kt(this.g)}, ${kt(this.b)}${t===1?")":`, ${t})`}`}function he(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function kt(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function Et(t){return t=kt(t),(t<16?"0":"")+t.toString(16)}function An(t,e,n,i){return i<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new ct(t,e,n,i)}function xi(t){if(t instanceof ct)return new ct(t.h,t.s,t.l,t.opacity);if(t instanceof qt||(t=Ft(t)),!t)return new ct;if(t instanceof ct)return t;t=t.rgb();var e=t.r/255,n=t.g/255,i=t.b/255,a=Math.min(e,n,i),s=Math.max(e,n,i),r=NaN,o=s-a,c=(s+a)/2;return o?(e===s?r=(n-i)/o+(n<i)*6:n===s?r=(i-e)/o+2:r=(e-n)/o+4,o/=c<.5?s+a:2-s-a,r*=60):o=c>0&&c<1?0:r,new ct(r,o,c,t.opacity)}function $r(t,e,n,i){return arguments.length===1?xi(t):new ct(t,e,n,i??1)}function ct(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}sn(ct,$r,_i(qt,{brighter(t){return t=t==null?fe:Math.pow(fe,t),new ct(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=t==null?Ht:Math.pow(Ht,t),new ct(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+(this.h<0)*360,e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*e,a=2*n-i;return new st(Ae(t>=240?t-240:t+120,a,i),Ae(t,a,i),Ae(t<120?t+240:t-120,a,i),this.opacity)},clamp(){return new ct(Nn(this.h),Kt(this.s),Kt(this.l),he(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=he(this.opacity);return`${t===1?"hsl(":"hsla("}${Nn(this.h)}, ${Kt(this.s)*100}%, ${Kt(this.l)*100}%${t===1?")":`, ${t})`}`}}));function Nn(t){return t=(t||0)%360,t<0?t+360:t}function Kt(t){return Math.max(0,Math.min(1,t||0))}function Ae(t,e,n){return(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)*255}const wi=t=>()=>t;function kr(t,e){return function(n){return t+n*e}}function Ir(t,e,n){return t=Math.pow(t,n),e=Math.pow(e,n)-t,n=1/n,function(i){return Math.pow(t+i*e,n)}}function Tr(t){return(t=+t)==1?Ei:function(e,n){return n-e?Ir(e,n,t):wi(isNaN(e)?n:e)}}function Ei(t,e){var n=e-t;return n?kr(t,n):wi(isNaN(t)?e:t)}const Cn=function t(e){var n=Tr(e);function i(a,s){var r=n((a=He(a)).r,(s=He(s)).r),o=n(a.g,s.g),c=n(a.b,s.b),l=Ei(a.opacity,s.opacity);return function(d){return a.r=r(d),a.g=o(d),a.b=c(d),a.opacity=l(d),a+""}}return i.gamma=t,i}(1);function yt(t,e){return t=+t,e=+e,function(n){return t*(1-n)+e*n}}var je=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Ne=new RegExp(je.source,"g");function Sr(t){return function(){return t}}function Ar(t){return function(e){return t(e)+""}}function Nr(t,e){var n=je.lastIndex=Ne.lastIndex=0,i,a,s,r=-1,o=[],c=[];for(t=t+"",e=e+"";(i=je.exec(t))&&(a=Ne.exec(e));)(s=a.index)>n&&(s=e.slice(n,s),o[r]?o[r]+=s:o[++r]=s),(i=i[0])===(a=a[0])?o[r]?o[r]+=a:o[++r]=a:(o[++r]=null,c.push({i:r,x:yt(i,a)})),n=Ne.lastIndex;return n<e.length&&(s=e.slice(n),o[r]?o[r]+=s:o[++r]=s),o.length<2?c[0]?Ar(c[0].x):Sr(e):(e=c.length,function(l){for(var d=0,_;d<e;++d)o[(_=c[d]).i]=_.x(l);return o.join("")})}var Ln=180/Math.PI,Fe={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function $i(t,e,n,i,a,s){var r,o,c;return(r=Math.sqrt(t*t+e*e))&&(t/=r,e/=r),(c=t*n+e*i)&&(n-=t*c,i-=e*c),(o=Math.sqrt(n*n+i*i))&&(n/=o,i/=o,c/=o),t*i<e*n&&(t=-t,e=-e,c=-c,r=-r),{translateX:a,translateY:s,rotate:Math.atan2(e,t)*Ln,skewX:Math.atan(c)*Ln,scaleX:r,scaleY:o}}var Qt;function Cr(t){const e=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(t+"");return e.isIdentity?Fe:$i(e.a,e.b,e.c,e.d,e.e,e.f)}function Lr(t){return t==null||(Qt||(Qt=document.createElementNS("http://www.w3.org/2000/svg","g")),Qt.setAttribute("transform",t),!(t=Qt.transform.baseVal.consolidate()))?Fe:(t=t.matrix,$i(t.a,t.b,t.c,t.d,t.e,t.f))}function ki(t,e,n,i){function a(l){return l.length?l.pop()+" ":""}function s(l,d,_,f,h,k){if(l!==_||d!==f){var y=h.push("translate(",null,e,null,n);k.push({i:y-4,x:yt(l,_)},{i:y-2,x:yt(d,f)})}else(_||f)&&h.push("translate("+_+e+f+n)}function r(l,d,_,f){l!==d?(l-d>180?d+=360:d-l>180&&(l+=360),f.push({i:_.push(a(_)+"rotate(",null,i)-2,x:yt(l,d)})):d&&_.push(a(_)+"rotate("+d+i)}function o(l,d,_,f){l!==d?f.push({i:_.push(a(_)+"skewX(",null,i)-2,x:yt(l,d)}):d&&_.push(a(_)+"skewX("+d+i)}function c(l,d,_,f,h,k){if(l!==_||d!==f){var y=h.push(a(h)+"scale(",null,",",null,")");k.push({i:y-4,x:yt(l,_)},{i:y-2,x:yt(d,f)})}else(_!==1||f!==1)&&h.push(a(h)+"scale("+_+","+f+")")}return function(l,d){var _=[],f=[];return l=t(l),d=t(d),s(l.translateX,l.translateY,d.translateX,d.translateY,_,f),r(l.rotate,d.rotate,_,f),o(l.skewX,d.skewX,_,f),c(l.scaleX,l.scaleY,d.scaleX,d.scaleY,_,f),l=d=null,function(h){for(var k=-1,y=f.length,x;++k<y;)_[(x=f[k]).i]=x.x(h);return _.join("")}}}var Mr=ki(Cr,"px, ","px)","deg)"),Br=ki(Lr,", ",")",")"),Pr=1e-12;function Mn(t){return((t=Math.exp(t))+1/t)/2}function Rr(t){return((t=Math.exp(t))-1/t)/2}function Or(t){return((t=Math.exp(2*t))-1)/(t+1)}const Dr=function t(e,n,i){function a(s,r){var o=s[0],c=s[1],l=s[2],d=r[0],_=r[1],f=r[2],h=d-o,k=_-c,y=h*h+k*k,x,g;if(y<Pr)g=Math.log(f/l)/e,x=function($){return[o+$*h,c+$*k,l*Math.exp(e*$*g)]};else{var I=Math.sqrt(y),N=(f*f-l*l+i*y)/(2*l*n*I),v=(f*f-l*l-i*y)/(2*f*n*I),C=Math.log(Math.sqrt(N*N+1)-N),b=Math.log(Math.sqrt(v*v+1)-v);g=(b-C)/e,x=function($){var M=$*g,B=Mn(C),T=l/(n*I)*(B*Or(e*M+C)-Rr(C));return[o+T*h,c+T*k,l*B/Mn(e*M+C)]}}return x.duration=g*1e3*e/Math.SQRT2,x}return a.rho=function(s){var r=Math.max(.001,+s),o=r*r,c=o*o;return t(r,o,c)},a}(Math.SQRT2,2,4);var Lt=0,Rt=0,Bt=0,Ii=1e3,me,Ot,ge=0,It=0,xe=0,Gt=typeof performance=="object"&&performance.now?performance:Date,Ti=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function rn(){return It||(Ti(zr),It=Gt.now()+xe)}function zr(){It=0}function ve(){this._call=this._time=this._next=null}ve.prototype=on.prototype={constructor:ve,restart:function(t,e,n){if(typeof t!="function")throw new TypeError("callback is not a function");n=(n==null?rn():+n)+(e==null?0:+e),!this._next&&Ot!==this&&(Ot?Ot._next=this:me=this,Ot=this),this._call=t,this._time=n,Ge()},stop:function(){this._call&&(this._call=null,this._time=1/0,Ge())}};function on(t,e,n){var i=new ve;return i.restart(t,e,n),i}function Hr(){rn(),++Lt;for(var t=me,e;t;)(e=It-t._time)>=0&&t._call.call(void 0,e),t=t._next;--Lt}function Bn(){It=(ge=Gt.now())+xe,Lt=Rt=0;try{Hr()}finally{Lt=0,Fr(),It=0}}function jr(){var t=Gt.now(),e=t-ge;e>Ii&&(xe-=e,ge=t)}function Fr(){for(var t,e=me,n,i=1/0;e;)e._call?(i>e._time&&(i=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:me=n);Ot=t,Ge(i)}function Ge(t){if(!Lt){Rt&&(Rt=clearTimeout(Rt));var e=t-It;e>24?(t<1/0&&(Rt=setTimeout(Bn,t-Gt.now()-xe)),Bt&&(Bt=clearInterval(Bt))):(Bt||(ge=Gt.now(),Bt=setInterval(jr,Ii)),Lt=1,Ti(Bn))}}function Pn(t,e,n){var i=new ve;return e=e==null?0:+e,i.restart(a=>{i.stop(),t(a+e)},e,n),i}var Gr=Yt("start","end","cancel","interrupt"),Yr=[],Si=0,Rn=1,Ye=2,oe=3,On=4,Ve=5,le=6;function we(t,e,n,i,a,s){var r=t.__transition;if(!r)t.__transition={};else if(n in r)return;Vr(t,n,{name:e,index:i,group:a,on:Gr,tween:Yr,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:Si})}function ln(t,e){var n=dt(t,e);if(n.state>Si)throw new Error("too late; already scheduled");return n}function ft(t,e){var n=dt(t,e);if(n.state>oe)throw new Error("too late; already running");return n}function dt(t,e){var n=t.__transition;if(!n||!(n=n[e]))throw new Error("transition not found");return n}function Vr(t,e,n){var i=t.__transition,a;i[e]=n,n.timer=on(s,0,n.time);function s(l){n.state=Rn,n.timer.restart(r,n.delay,n.time),n.delay<=l&&r(l-n.delay)}function r(l){var d,_,f,h;if(n.state!==Rn)return c();for(d in i)if(h=i[d],h.name===n.name){if(h.state===oe)return Pn(r);h.state===On?(h.state=le,h.timer.stop(),h.on.call("interrupt",t,t.__data__,h.index,h.group),delete i[d]):+d<e&&(h.state=le,h.timer.stop(),h.on.call("cancel",t,t.__data__,h.index,h.group),delete i[d])}if(Pn(function(){n.state===oe&&(n.state=On,n.timer.restart(o,n.delay,n.time),o(l))}),n.state=Ye,n.on.call("start",t,t.__data__,n.index,n.group),n.state===Ye){for(n.state=oe,a=new Array(f=n.tween.length),d=0,_=-1;d<f;++d)(h=n.tween[d].value.call(t,t.__data__,n.index,n.group))&&(a[++_]=h);a.length=_+1}}function o(l){for(var d=l<n.duration?n.ease.call(null,l/n.duration):(n.timer.restart(c),n.state=Ve,1),_=-1,f=a.length;++_<f;)a[_].call(t,d);n.state===Ve&&(n.on.call("end",t,t.__data__,n.index,n.group),c())}function c(){n.state=le,n.timer.stop(),delete i[e];for(var l in i)return;delete t.__transition}}function ce(t,e){var n=t.__transition,i,a,s=!0,r;if(n){e=e==null?null:e+"";for(r in n){if((i=n[r]).name!==e){s=!1;continue}a=i.state>Ye&&i.state<Ve,i.state=le,i.timer.stop(),i.on.call(a?"interrupt":"cancel",t,t.__data__,i.index,i.group),delete n[r]}s&&delete t.__transition}}function qr(t){return this.each(function(){ce(this,t)})}function Ur(t,e){var n,i;return function(){var a=ft(this,t),s=a.tween;if(s!==n){i=n=s;for(var r=0,o=i.length;r<o;++r)if(i[r].name===e){i=i.slice(),i.splice(r,1);break}}a.tween=i}}function Xr(t,e,n){var i,a;if(typeof n!="function")throw new Error;return function(){var s=ft(this,t),r=s.tween;if(r!==i){a=(i=r).slice();for(var o={name:e,value:n},c=0,l=a.length;c<l;++c)if(a[c].name===e){a[c]=o;break}c===l&&a.push(o)}s.tween=a}}function Wr(t,e){var n=this._id;if(t+="",arguments.length<2){for(var i=dt(this.node(),n).tween,a=0,s=i.length,r;a<s;++a)if((r=i[a]).name===t)return r.value;return null}return this.each((e==null?Ur:Xr)(n,t,e))}function cn(t,e,n){var i=t._id;return t.each(function(){var a=ft(this,i);(a.value||(a.value={}))[e]=n.apply(this,arguments)}),function(a){return dt(a,i).value[e]}}function Ai(t,e){var n;return(typeof e=="number"?yt:e instanceof Ft?Cn:(n=Ft(e))?(e=n,Cn):Nr)(t,e)}function Jr(t){return function(){this.removeAttribute(t)}}function Kr(t){return function(){this.removeAttributeNS(t.space,t.local)}}function Qr(t,e,n){var i,a=n+"",s;return function(){var r=this.getAttribute(t);return r===a?null:r===i?s:s=e(i=r,n)}}function Zr(t,e,n){var i,a=n+"",s;return function(){var r=this.getAttributeNS(t.space,t.local);return r===a?null:r===i?s:s=e(i=r,n)}}function to(t,e,n){var i,a,s;return function(){var r,o=n(this),c;return o==null?void this.removeAttribute(t):(r=this.getAttribute(t),c=o+"",r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o)))}}function eo(t,e,n){var i,a,s;return function(){var r,o=n(this),c;return o==null?void this.removeAttributeNS(t.space,t.local):(r=this.getAttributeNS(t.space,t.local),c=o+"",r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o)))}}function no(t,e){var n=_e(t),i=n==="transform"?Br:Ai;return this.attrTween(t,typeof e=="function"?(n.local?eo:to)(n,i,cn(this,"attr."+t,e)):e==null?(n.local?Kr:Jr)(n):(n.local?Zr:Qr)(n,i,e))}function io(t,e){return function(n){this.setAttribute(t,e.call(this,n))}}function ao(t,e){return function(n){this.setAttributeNS(t.space,t.local,e.call(this,n))}}function so(t,e){var n,i;function a(){var s=e.apply(this,arguments);return s!==i&&(n=(i=s)&&ao(t,s)),n}return a._value=e,a}function ro(t,e){var n,i;function a(){var s=e.apply(this,arguments);return s!==i&&(n=(i=s)&&io(t,s)),n}return a._value=e,a}function oo(t,e){var n="attr."+t;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;var i=_e(t);return this.tween(n,(i.local?so:ro)(i,e))}function lo(t,e){return function(){ln(this,t).delay=+e.apply(this,arguments)}}function co(t,e){return e=+e,function(){ln(this,t).delay=e}}function uo(t){var e=this._id;return arguments.length?this.each((typeof t=="function"?lo:co)(e,t)):dt(this.node(),e).delay}function po(t,e){return function(){ft(this,t).duration=+e.apply(this,arguments)}}function fo(t,e){return e=+e,function(){ft(this,t).duration=e}}function ho(t){var e=this._id;return arguments.length?this.each((typeof t=="function"?po:fo)(e,t)):dt(this.node(),e).duration}function mo(t,e){if(typeof e!="function")throw new Error;return function(){ft(this,t).ease=e}}function go(t){var e=this._id;return arguments.length?this.each(mo(e,t)):dt(this.node(),e).ease}function vo(t,e){return function(){var n=e.apply(this,arguments);if(typeof n!="function")throw new Error;ft(this,t).ease=n}}function yo(t){if(typeof t!="function")throw new Error;return this.each(vo(this._id,t))}function bo(t){typeof t!="function"&&(t=li(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=[],c,l=0;l<r;++l)(c=s[l])&&t.call(c,c.__data__,l,s)&&o.push(c);return new vt(i,this._parents,this._name,this._id)}function _o(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,n=t._groups,i=e.length,a=n.length,s=Math.min(i,a),r=new Array(i),o=0;o<s;++o)for(var c=e[o],l=n[o],d=c.length,_=r[o]=new Array(d),f,h=0;h<d;++h)(f=c[h]||l[h])&&(_[h]=f);for(;o<i;++o)r[o]=e[o];return new vt(r,this._parents,this._name,this._id)}function xo(t){return(t+"").trim().split(/^|\s+/).every(function(e){var n=e.indexOf(".");return n>=0&&(e=e.slice(0,n)),!e||e==="start"})}function wo(t,e,n){var i,a,s=xo(e)?ln:ft;return function(){var r=s(this,t),o=r.on;o!==i&&(a=(i=o).copy()).on(e,n),r.on=a}}function Eo(t,e){var n=this._id;return arguments.length<2?dt(this.node(),n).on.on(t):this.each(wo(n,t,e))}function $o(t){return function(){var e=this.parentNode;for(var n in this.__transition)if(+n!==t)return;e&&e.removeChild(this)}}function ko(){return this.on("end.remove",$o(this._id))}function Io(t){var e=this._name,n=this._id;typeof t!="function"&&(t=nn(t));for(var i=this._groups,a=i.length,s=new Array(a),r=0;r<a;++r)for(var o=i[r],c=o.length,l=s[r]=new Array(c),d,_,f=0;f<c;++f)(d=o[f])&&(_=t.call(d,d.__data__,f,o))&&("__data__"in d&&(_.__data__=d.__data__),l[f]=_,we(l[f],e,n,f,l,dt(d,n)));return new vt(s,this._parents,e,n)}function To(t){var e=this._name,n=this._id;typeof t!="function"&&(t=oi(t));for(var i=this._groups,a=i.length,s=[],r=[],o=0;o<a;++o)for(var c=i[o],l=c.length,d,_=0;_<l;++_)if(d=c[_]){for(var f=t.call(d,d.__data__,_,c),h,k=dt(d,n),y=0,x=f.length;y<x;++y)(h=f[y])&&we(h,e,n,y,f,k);s.push(f),r.push(d)}return new vt(s,r,e,n)}var So=Vt.prototype.constructor;function Ao(){return new So(this._groups,this._parents)}function No(t,e){var n,i,a;return function(){var s=Ct(this,t),r=(this.style.removeProperty(t),Ct(this,t));return s===r?null:s===n&&r===i?a:a=e(n=s,i=r)}}function Ni(t){return function(){this.style.removeProperty(t)}}function Co(t,e,n){var i,a=n+"",s;return function(){var r=Ct(this,t);return r===a?null:r===i?s:s=e(i=r,n)}}function Lo(t,e,n){var i,a,s;return function(){var r=Ct(this,t),o=n(this),c=o+"";return o==null&&(c=o=(this.style.removeProperty(t),Ct(this,t))),r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o))}}function Mo(t,e){var n,i,a,s="style."+e,r="end."+s,o;return function(){var c=ft(this,t),l=c.on,d=c.value[s]==null?o||(o=Ni(e)):void 0;(l!==n||a!==d)&&(i=(n=l).copy()).on(r,a=d),c.on=i}}function Bo(t,e,n){var i=(t+="")=="transform"?Mr:Ai;return e==null?this.styleTween(t,No(t,i)).on("end.style."+t,Ni(t)):typeof e=="function"?this.styleTween(t,Lo(t,i,cn(this,"style."+t,e))).each(Mo(this._id,t)):this.styleTween(t,Co(t,i,e),n).on("end.style."+t,null)}function Po(t,e,n){return function(i){this.style.setProperty(t,e.call(this,i),n)}}function Ro(t,e,n){var i,a;function s(){var r=e.apply(this,arguments);return r!==a&&(i=(a=r)&&Po(t,r,n)),i}return s._value=e,s}function Oo(t,e,n){var i="style."+(t+="");if(arguments.length<2)return(i=this.tween(i))&&i._value;if(e==null)return this.tween(i,null);if(typeof e!="function")throw new Error;return this.tween(i,Ro(t,e,n??""))}function Do(t){return function(){this.textContent=t}}function zo(t){return function(){var e=t(this);this.textContent=e??""}}function Ho(t){return this.tween("text",typeof t=="function"?zo(cn(this,"text",t)):Do(t==null?"":t+""))}function jo(t){return function(e){this.textContent=t.call(this,e)}}function Fo(t){var e,n;function i(){var a=t.apply(this,arguments);return a!==n&&(e=(n=a)&&jo(a)),e}return i._value=t,i}function Go(t){var e="text";if(arguments.length<1)return(e=this.tween(e))&&e._value;if(t==null)return this.tween(e,null);if(typeof t!="function")throw new Error;return this.tween(e,Fo(t))}function Yo(){for(var t=this._name,e=this._id,n=Ci(),i=this._groups,a=i.length,s=0;s<a;++s)for(var r=i[s],o=r.length,c,l=0;l<o;++l)if(c=r[l]){var d=dt(c,e);we(c,t,n,l,r,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new vt(i,this._parents,t,n)}function Vo(){var t,e,n=this,i=n._id,a=n.size();return new Promise(function(s,r){var o={value:r},c={value:function(){--a===0&&s()}};n.each(function(){var l=ft(this,i),d=l.on;d!==t&&(e=(t=d).copy(),e._.cancel.push(o),e._.interrupt.push(o),e._.end.push(c)),l.on=e}),a===0&&s()})}var qo=0;function vt(t,e,n,i){this._groups=t,this._parents=e,this._name=n,this._id=i}function Ci(){return++qo}var ht=Vt.prototype;vt.prototype={constructor:vt,select:Io,selectAll:To,selectChild:ht.selectChild,selectChildren:ht.selectChildren,filter:bo,merge:_o,selection:Ao,transition:Yo,call:ht.call,nodes:ht.nodes,node:ht.node,size:ht.size,empty:ht.empty,each:ht.each,on:Eo,attr:no,attrTween:oo,style:Bo,styleTween:Oo,text:Ho,textTween:Go,remove:ko,tween:Wr,delay:uo,duration:ho,ease:go,easeVarying:yo,end:Vo,[Symbol.iterator]:ht[Symbol.iterator]};function Uo(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}var Xo={time:null,delay:0,duration:250,ease:Uo};function Wo(t,e){for(var n;!(n=t.__transition)||!(n=n[e]);)if(!(t=t.parentNode))throw new Error(`transition ${e} not found`);return n}function Jo(t){var e,n;t instanceof vt?(e=t._id,t=t._name):(e=Ci(),(n=Xo).time=rn(),t=t==null?null:t+"");for(var i=this._groups,a=i.length,s=0;s<a;++s)for(var r=i[s],o=r.length,c,l=0;l<o;++l)(c=r[l])&&we(c,t,e,l,r,n||Wo(c,e));return new vt(i,this._parents,t,e)}Vt.prototype.interrupt=qr;Vt.prototype.transition=Jo;function Ko(t,e){var n,i=1;t==null&&(t=0),e==null&&(e=0);function a(){var s,r=n.length,o,c=0,l=0;for(s=0;s<r;++s)o=n[s],c+=o.x,l+=o.y;for(c=(c/r-t)*i,l=(l/r-e)*i,s=0;s<r;++s)o=n[s],o.x-=c,o.y-=l}return a.initialize=function(s){n=s},a.x=function(s){return arguments.length?(t=+s,a):t},a.y=function(s){return arguments.length?(e=+s,a):e},a.strength=function(s){return arguments.length?(i=+s,a):i},a}function Qo(t){const e=+this._x.call(null,t),n=+this._y.call(null,t);return Li(this.cover(e,n),e,n,t)}function Li(t,e,n,i){if(isNaN(e)||isNaN(n))return t;var a,s=t._root,r={data:i},o=t._x0,c=t._y0,l=t._x1,d=t._y1,_,f,h,k,y,x,g,I;if(!s)return t._root=r,t;for(;s.length;)if((y=e>=(_=(o+l)/2))?o=_:l=_,(x=n>=(f=(c+d)/2))?c=f:d=f,a=s,!(s=s[g=x<<1|y]))return a[g]=r,t;if(h=+t._x.call(null,s.data),k=+t._y.call(null,s.data),e===h&&n===k)return r.next=s,a?a[g]=r:t._root=r,t;do a=a?a[g]=new Array(4):t._root=new Array(4),(y=e>=(_=(o+l)/2))?o=_:l=_,(x=n>=(f=(c+d)/2))?c=f:d=f;while((g=x<<1|y)===(I=(k>=f)<<1|h>=_));return a[I]=s,a[g]=r,t}function Zo(t){var e,n,i=t.length,a,s,r=new Array(i),o=new Array(i),c=1/0,l=1/0,d=-1/0,_=-1/0;for(n=0;n<i;++n)isNaN(a=+this._x.call(null,e=t[n]))||isNaN(s=+this._y.call(null,e))||(r[n]=a,o[n]=s,a<c&&(c=a),a>d&&(d=a),s<l&&(l=s),s>_&&(_=s));if(c>d||l>_)return this;for(this.cover(c,l).cover(d,_),n=0;n<i;++n)Li(this,r[n],o[n],t[n]);return this}function tl(t,e){if(isNaN(t=+t)||isNaN(e=+e))return this;var n=this._x0,i=this._y0,a=this._x1,s=this._y1;if(isNaN(n))a=(n=Math.floor(t))+1,s=(i=Math.floor(e))+1;else{for(var r=a-n||1,o=this._root,c,l;n>t||t>=a||i>e||e>=s;)switch(l=(e<i)<<1|t<n,c=new Array(4),c[l]=o,o=c,r*=2,l){case 0:a=n+r,s=i+r;break;case 1:n=a-r,s=i+r;break;case 2:a=n+r,i=s-r;break;case 3:n=a-r,i=s-r;break}this._root&&this._root.length&&(this._root=o)}return this._x0=n,this._y0=i,this._x1=a,this._y1=s,this}function el(){var t=[];return this.visit(function(e){if(!e.length)do t.push(e.data);while(e=e.next)}),t}function nl(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function et(t,e,n,i,a){this.node=t,this.x0=e,this.y0=n,this.x1=i,this.y1=a}function il(t,e,n){var i,a=this._x0,s=this._y0,r,o,c,l,d=this._x1,_=this._y1,f=[],h=this._root,k,y;for(h&&f.push(new et(h,a,s,d,_)),n==null?n=1/0:(a=t-n,s=e-n,d=t+n,_=e+n,n*=n);k=f.pop();)if(!(!(h=k.node)||(r=k.x0)>d||(o=k.y0)>_||(c=k.x1)<a||(l=k.y1)<s))if(h.length){var x=(r+c)/2,g=(o+l)/2;f.push(new et(h[3],x,g,c,l),new et(h[2],r,g,x,l),new et(h[1],x,o,c,g),new et(h[0],r,o,x,g)),(y=(e>=g)<<1|t>=x)&&(k=f[f.length-1],f[f.length-1]=f[f.length-1-y],f[f.length-1-y]=k)}else{var I=t-+this._x.call(null,h.data),N=e-+this._y.call(null,h.data),v=I*I+N*N;if(v<n){var C=Math.sqrt(n=v);a=t-C,s=e-C,d=t+C,_=e+C,i=h.data}}return i}function al(t){if(isNaN(d=+this._x.call(null,t))||isNaN(_=+this._y.call(null,t)))return this;var e,n=this._root,i,a,s,r=this._x0,o=this._y0,c=this._x1,l=this._y1,d,_,f,h,k,y,x,g;if(!n)return this;if(n.length)for(;;){if((k=d>=(f=(r+c)/2))?r=f:c=f,(y=_>=(h=(o+l)/2))?o=h:l=h,e=n,!(n=n[x=y<<1|k]))return this;if(!n.length)break;(e[x+1&3]||e[x+2&3]||e[x+3&3])&&(i=e,g=x)}for(;n.data!==t;)if(a=n,!(n=n.next))return this;return(s=n.next)&&delete n.next,a?(s?a.next=s:delete a.next,this):e?(s?e[x]=s:delete e[x],(n=e[0]||e[1]||e[2]||e[3])&&n===(e[3]||e[2]||e[1]||e[0])&&!n.length&&(i?i[g]=n:this._root=n),this):(this._root=s,this)}function sl(t){for(var e=0,n=t.length;e<n;++e)this.remove(t[e]);return this}function rl(){return this._root}function ol(){var t=0;return this.visit(function(e){if(!e.length)do++t;while(e=e.next)}),t}function ll(t){var e=[],n,i=this._root,a,s,r,o,c;for(i&&e.push(new et(i,this._x0,this._y0,this._x1,this._y1));n=e.pop();)if(!t(i=n.node,s=n.x0,r=n.y0,o=n.x1,c=n.y1)&&i.length){var l=(s+o)/2,d=(r+c)/2;(a=i[3])&&e.push(new et(a,l,d,o,c)),(a=i[2])&&e.push(new et(a,s,d,l,c)),(a=i[1])&&e.push(new et(a,l,r,o,d)),(a=i[0])&&e.push(new et(a,s,r,l,d))}return this}function cl(t){var e=[],n=[],i;for(this._root&&e.push(new et(this._root,this._x0,this._y0,this._x1,this._y1));i=e.pop();){var a=i.node;if(a.length){var s,r=i.x0,o=i.y0,c=i.x1,l=i.y1,d=(r+c)/2,_=(o+l)/2;(s=a[0])&&e.push(new et(s,r,o,d,_)),(s=a[1])&&e.push(new et(s,d,o,c,_)),(s=a[2])&&e.push(new et(s,r,_,d,l)),(s=a[3])&&e.push(new et(s,d,_,c,l))}n.push(i)}for(;i=n.pop();)t(i.node,i.x0,i.y0,i.x1,i.y1);return this}function dl(t){return t[0]}function ul(t){return arguments.length?(this._x=t,this):this._x}function pl(t){return t[1]}function fl(t){return arguments.length?(this._y=t,this):this._y}function dn(t,e,n){var i=new un(e??dl,n??pl,NaN,NaN,NaN,NaN);return t==null?i:i.addAll(t)}function un(t,e,n,i,a,s){this._x=t,this._y=e,this._x0=n,this._y0=i,this._x1=a,this._y1=s,this._root=void 0}function Dn(t){for(var e={data:t.data},n=e;t=t.next;)n=n.next={data:t.data};return e}var it=dn.prototype=un.prototype;it.copy=function(){var t=new un(this._x,this._y,this._x0,this._y0,this._x1,this._y1),e=this._root,n,i;if(!e)return t;if(!e.length)return t._root=Dn(e),t;for(n=[{source:e,target:t._root=new Array(4)}];e=n.pop();)for(var a=0;a<4;++a)(i=e.source[a])&&(i.length?n.push({source:i,target:e.target[a]=new Array(4)}):e.target[a]=Dn(i));return t};it.add=Qo;it.addAll=Zo;it.cover=tl;it.data=el;it.extent=nl;it.find=il;it.remove=al;it.removeAll=sl;it.root=rl;it.size=ol;it.visit=ll;it.visitAfter=cl;it.x=ul;it.y=fl;function nt(t){return function(){return t}}function _t(t){return(t()-.5)*1e-6}function hl(t){return t.x+t.vx}function ml(t){return t.y+t.vy}function gl(t){var e,n,i,a=1,s=1;typeof t!="function"&&(t=nt(t==null?1:+t));function r(){for(var l,d=e.length,_,f,h,k,y,x,g=0;g<s;++g)for(_=dn(e,hl,ml).visitAfter(o),l=0;l<d;++l)f=e[l],y=n[f.index],x=y*y,h=f.x+f.vx,k=f.y+f.vy,_.visit(I);function I(N,v,C,b,$){var M=N.data,B=N.r,T=y+B;if(M){if(M.index>f.index){var O=h-M.x-M.vx,j=k-M.y-M.vy,Y=O*O+j*j;Y<T*T&&(O===0&&(O=_t(i),Y+=O*O),j===0&&(j=_t(i),Y+=j*j),Y=(T-(Y=Math.sqrt(Y)))/Y*a,f.vx+=(O*=Y)*(T=(B*=B)/(x+B)),f.vy+=(j*=Y)*T,M.vx-=O*(T=1-T),M.vy-=j*T)}return}return v>h+T||b<h-T||C>k+T||$<k-T}}function o(l){if(l.data)return l.r=n[l.data.index];for(var d=l.r=0;d<4;++d)l[d]&&l[d].r>l.r&&(l.r=l[d].r)}function c(){if(e){var l,d=e.length,_;for(n=new Array(d),l=0;l<d;++l)_=e[l],n[_.index]=+t(_,l,e)}}return r.initialize=function(l,d){e=l,i=d,c()},r.iterations=function(l){return arguments.length?(s=+l,r):s},r.strength=function(l){return arguments.length?(a=+l,r):a},r.radius=function(l){return arguments.length?(t=typeof l=="function"?l:nt(+l),c(),r):t},r}function vl(t){return t.index}function zn(t,e){var n=t.get(e);if(!n)throw new Error("node not found: "+e);return n}function yl(t){var e=vl,n=_,i,a=nt(30),s,r,o,c,l,d=1;t==null&&(t=[]);function _(x){return 1/Math.min(o[x.source.index],o[x.target.index])}function f(x){for(var g=0,I=t.length;g<d;++g)for(var N=0,v,C,b,$,M,B,T;N<I;++N)v=t[N],C=v.source,b=v.target,$=b.x+b.vx-C.x-C.vx||_t(l),M=b.y+b.vy-C.y-C.vy||_t(l),B=Math.sqrt($*$+M*M),B=(B-s[N])/B*x*i[N],$*=B,M*=B,b.vx-=$*(T=c[N]),b.vy-=M*T,C.vx+=$*(T=1-T),C.vy+=M*T}function h(){if(r){var x,g=r.length,I=t.length,N=new Map(r.map((C,b)=>[e(C,b,r),C])),v;for(x=0,o=new Array(g);x<I;++x)v=t[x],v.index=x,typeof v.source!="object"&&(v.source=zn(N,v.source)),typeof v.target!="object"&&(v.target=zn(N,v.target)),o[v.source.index]=(o[v.source.index]||0)+1,o[v.target.index]=(o[v.target.index]||0)+1;for(x=0,c=new Array(I);x<I;++x)v=t[x],c[x]=o[v.source.index]/(o[v.source.index]+o[v.target.index]);i=new Array(I),k(),s=new Array(I),y()}}function k(){if(r)for(var x=0,g=t.length;x<g;++x)i[x]=+n(t[x],x,t)}function y(){if(r)for(var x=0,g=t.length;x<g;++x)s[x]=+a(t[x],x,t)}return f.initialize=function(x,g){r=x,l=g,h()},f.links=function(x){return arguments.length?(t=x,h(),f):t},f.id=function(x){return arguments.length?(e=x,f):e},f.iterations=function(x){return arguments.length?(d=+x,f):d},f.strength=function(x){return arguments.length?(n=typeof x=="function"?x:nt(+x),k(),f):n},f.distance=function(x){return arguments.length?(a=typeof x=="function"?x:nt(+x),y(),f):a},f}const bl=1664525,_l=1013904223,Hn=4294967296;function xl(){let t=1;return()=>(t=(bl*t+_l)%Hn)/Hn}function wl(t){return t.x}function El(t){return t.y}var $l=10,kl=Math.PI*(3-Math.sqrt(5));function Il(t){var e,n=1,i=.001,a=1-Math.pow(i,1/300),s=0,r=.6,o=new Map,c=on(_),l=Yt("tick","end"),d=xl();t==null&&(t=[]);function _(){f(),l.call("tick",e),n<i&&(c.stop(),l.call("end",e))}function f(y){var x,g=t.length,I;y===void 0&&(y=1);for(var N=0;N<y;++N)for(n+=(s-n)*a,o.forEach(function(v){v(n)}),x=0;x<g;++x)I=t[x],I.fx==null?I.x+=I.vx*=r:(I.x=I.fx,I.vx=0),I.fy==null?I.y+=I.vy*=r:(I.y=I.fy,I.vy=0);return e}function h(){for(var y=0,x=t.length,g;y<x;++y){if(g=t[y],g.index=y,g.fx!=null&&(g.x=g.fx),g.fy!=null&&(g.y=g.fy),isNaN(g.x)||isNaN(g.y)){var I=$l*Math.sqrt(.5+y),N=y*kl;g.x=I*Math.cos(N),g.y=I*Math.sin(N)}(isNaN(g.vx)||isNaN(g.vy))&&(g.vx=g.vy=0)}}function k(y){return y.initialize&&y.initialize(t,d),y}return h(),e={tick:f,restart:function(){return c.restart(_),e},stop:function(){return c.stop(),e},nodes:function(y){return arguments.length?(t=y,h(),o.forEach(k),e):t},alpha:function(y){return arguments.length?(n=+y,e):n},alphaMin:function(y){return arguments.length?(i=+y,e):i},alphaDecay:function(y){return arguments.length?(a=+y,e):+a},alphaTarget:function(y){return arguments.length?(s=+y,e):s},velocityDecay:function(y){return arguments.length?(r=1-y,e):1-r},randomSource:function(y){return arguments.length?(d=y,o.forEach(k),e):d},force:function(y,x){return arguments.length>1?(x==null?o.delete(y):o.set(y,k(x)),e):o.get(y)},find:function(y,x,g){var I=0,N=t.length,v,C,b,$,M;for(g==null?g=1/0:g*=g,I=0;I<N;++I)$=t[I],v=y-$.x,C=x-$.y,b=v*v+C*C,b<g&&(M=$,g=b);return M},on:function(y,x){return arguments.length>1?(l.on(y,x),e):l.on(y)}}}function Tl(){var t,e,n,i,a=nt(-30),s,r=1,o=1/0,c=.81;function l(h){var k,y=t.length,x=dn(t,wl,El).visitAfter(_);for(i=h,k=0;k<y;++k)e=t[k],x.visit(f)}function d(){if(t){var h,k=t.length,y;for(s=new Array(k),h=0;h<k;++h)y=t[h],s[y.index]=+a(y,h,t)}}function _(h){var k=0,y,x,g=0,I,N,v;if(h.length){for(I=N=v=0;v<4;++v)(y=h[v])&&(x=Math.abs(y.value))&&(k+=y.value,g+=x,I+=x*y.x,N+=x*y.y);h.x=I/g,h.y=N/g}else{y=h,y.x=y.data.x,y.y=y.data.y;do k+=s[y.data.index];while(y=y.next)}h.value=k}function f(h,k,y,x){if(!h.value)return!0;var g=h.x-e.x,I=h.y-e.y,N=x-k,v=g*g+I*I;if(N*N/c<v)return v<o&&(g===0&&(g=_t(n),v+=g*g),I===0&&(I=_t(n),v+=I*I),v<r&&(v=Math.sqrt(r*v)),e.vx+=g*h.value*i/v,e.vy+=I*h.value*i/v),!0;if(h.length||v>=o)return;(h.data!==e||h.next)&&(g===0&&(g=_t(n),v+=g*g),I===0&&(I=_t(n),v+=I*I),v<r&&(v=Math.sqrt(r*v)));do h.data!==e&&(N=s[h.data.index]*i/v,e.vx+=g*N,e.vy+=I*N);while(h=h.next)}return l.initialize=function(h,k){t=h,n=k,d()},l.strength=function(h){return arguments.length?(a=typeof h=="function"?h:nt(+h),d(),l):a},l.distanceMin=function(h){return arguments.length?(r=h*h,l):Math.sqrt(r)},l.distanceMax=function(h){return arguments.length?(o=h*h,l):Math.sqrt(o)},l.theta=function(h){return arguments.length?(c=h*h,l):Math.sqrt(c)},l}function Sl(t){var e=nt(.1),n,i,a;typeof t!="function"&&(t=nt(t==null?0:+t));function s(o){for(var c=0,l=n.length,d;c<l;++c)d=n[c],d.vx+=(a[c]-d.x)*i[c]*o}function r(){if(n){var o,c=n.length;for(i=new Array(c),a=new Array(c),o=0;o<c;++o)i[o]=isNaN(a[o]=+t(n[o],o,n))?0:+e(n[o],o,n)}}return s.initialize=function(o){n=o,r()},s.strength=function(o){return arguments.length?(e=typeof o=="function"?o:nt(+o),r(),s):e},s.x=function(o){return arguments.length?(t=typeof o=="function"?o:nt(+o),r(),s):t},s}function Al(t){var e=nt(.1),n,i,a;typeof t!="function"&&(t=nt(t==null?0:+t));function s(o){for(var c=0,l=n.length,d;c<l;++c)d=n[c],d.vy+=(a[c]-d.y)*i[c]*o}function r(){if(n){var o,c=n.length;for(i=new Array(c),a=new Array(c),o=0;o<c;++o)i[o]=isNaN(a[o]=+t(n[o],o,n))?0:+e(n[o],o,n)}}return s.initialize=function(o){n=o,r()},s.strength=function(o){return arguments.length?(e=typeof o=="function"?o:nt(+o),r(),s):e},s.y=function(o){return arguments.length?(t=typeof o=="function"?o:nt(+o),r(),s):t},s}const Zt=t=>()=>t;function Nl(t,{sourceEvent:e,target:n,transform:i,dispatch:a}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:i,enumerable:!0,configurable:!0},_:{value:a}})}function gt(t,e,n){this.k=t,this.x=e,this.y=n}gt.prototype={constructor:gt,scale:function(t){return t===1?this:new gt(this.k*t,this.x,this.y)},translate:function(t,e){return t===0&e===0?this:new gt(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var Mi=new gt(1,0,0);gt.prototype;function Ce(t){t.stopImmediatePropagation()}function Pt(t){t.preventDefault(),t.stopImmediatePropagation()}function Cl(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function Ll(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function jn(){return this.__zoom||Mi}function Ml(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function Bl(){return navigator.maxTouchPoints||"ontouchstart"in this}function Pl(t,e,n){var i=t.invertX(e[0][0])-n[0][0],a=t.invertX(e[1][0])-n[1][0],s=t.invertY(e[0][1])-n[0][1],r=t.invertY(e[1][1])-n[1][1];return t.translate(a>i?(i+a)/2:Math.min(0,i)||Math.max(0,a),r>s?(s+r)/2:Math.min(0,s)||Math.max(0,r))}function Rl(){var t=Cl,e=Ll,n=Pl,i=Ml,a=Bl,s=[0,1/0],r=[[-1/0,-1/0],[1/0,1/0]],o=250,c=Dr,l=Yt("start","zoom","end"),d,_,f,h=500,k=150,y=0,x=10;function g(m){m.property("__zoom",jn).on("wheel.zoom",M,{passive:!1}).on("mousedown.zoom",B).on("dblclick.zoom",T).filter(a).on("touchstart.zoom",O).on("touchmove.zoom",j).on("touchend.zoom touchcancel.zoom",Y).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}g.transform=function(m,u,p,w){var A=m.selection?m.selection():m;A.property("__zoom",jn),m!==A?C(m,u,p,w):A.interrupt().each(function(){b(this,arguments).event(w).start().zoom(null,typeof u=="function"?u.apply(this,arguments):u).end()})},g.scaleBy=function(m,u,p,w){g.scaleTo(m,function(){var A=this.__zoom.k,L=typeof u=="function"?u.apply(this,arguments):u;return A*L},p,w)},g.scaleTo=function(m,u,p,w){g.transform(m,function(){var A=e.apply(this,arguments),L=this.__zoom,P=p==null?v(A):typeof p=="function"?p.apply(this,arguments):p,z=L.invert(P),H=typeof u=="function"?u.apply(this,arguments):u;return n(N(I(L,H),P,z),A,r)},p,w)},g.translateBy=function(m,u,p,w){g.transform(m,function(){return n(this.__zoom.translate(typeof u=="function"?u.apply(this,arguments):u,typeof p=="function"?p.apply(this,arguments):p),e.apply(this,arguments),r)},null,w)},g.translateTo=function(m,u,p,w,A){g.transform(m,function(){var L=e.apply(this,arguments),P=this.__zoom,z=w==null?v(L):typeof w=="function"?w.apply(this,arguments):w;return n(Mi.translate(z[0],z[1]).scale(P.k).translate(typeof u=="function"?-u.apply(this,arguments):-u,typeof p=="function"?-p.apply(this,arguments):-p),L,r)},w,A)};function I(m,u){return u=Math.max(s[0],Math.min(s[1],u)),u===m.k?m:new gt(u,m.x,m.y)}function N(m,u,p){var w=u[0]-p[0]*m.k,A=u[1]-p[1]*m.k;return w===m.x&&A===m.y?m:new gt(m.k,w,A)}function v(m){return[(+m[0][0]+ +m[1][0])/2,(+m[0][1]+ +m[1][1])/2]}function C(m,u,p,w){m.on("start.zoom",function(){b(this,arguments).event(w).start()}).on("interrupt.zoom end.zoom",function(){b(this,arguments).event(w).end()}).tween("zoom",function(){var A=this,L=arguments,P=b(A,L).event(w),z=e.apply(A,L),H=p==null?v(z):typeof p=="function"?p.apply(A,L):p,X=Math.max(z[1][0]-z[0][0],z[1][1]-z[0][1]),G=A.__zoom,q=typeof u=="function"?u.apply(A,L):u,K=c(G.invert(H).concat(X/G.k),q.invert(H).concat(X/q.k));return function(V){if(V===1)V=q;else{var Q=K(V),xt=X/Q[2];V=new gt(xt,H[0]-Q[0]*xt,H[1]-Q[1]*xt)}P.zoom(null,V)}})}function b(m,u,p){return!p&&m.__zooming||new $(m,u)}function $(m,u){this.that=m,this.args=u,this.active=0,this.sourceEvent=null,this.extent=e.apply(m,u),this.taps=0}$.prototype={event:function(m){return m&&(this.sourceEvent=m),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(m,u){return this.mouse&&m!=="mouse"&&(this.mouse[1]=u.invert(this.mouse[0])),this.touch0&&m!=="touch"&&(this.touch0[1]=u.invert(this.touch0[0])),this.touch1&&m!=="touch"&&(this.touch1[1]=u.invert(this.touch1[0])),this.that.__zoom=u,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(m){var u=tt(this.that).datum();l.call(m,this.that,new Nl(m,{sourceEvent:this.sourceEvent,target:g,transform:this.that.__zoom,dispatch:l}),u)}};function M(m,...u){if(!t.apply(this,arguments))return;var p=b(this,u).event(m),w=this.__zoom,A=Math.max(s[0],Math.min(s[1],w.k*Math.pow(2,i.apply(this,arguments)))),L=mt(m);if(p.wheel)(p.mouse[0][0]!==L[0]||p.mouse[0][1]!==L[1])&&(p.mouse[1]=w.invert(p.mouse[0]=L)),clearTimeout(p.wheel);else{if(w.k===A)return;p.mouse=[L,w.invert(L)],ce(this),p.start()}Pt(m),p.wheel=setTimeout(P,k),p.zoom("mouse",n(N(I(w,A),p.mouse[0],p.mouse[1]),p.extent,r));function P(){p.wheel=null,p.end()}}function B(m,...u){if(f||!t.apply(this,arguments))return;var p=m.currentTarget,w=b(this,u,!0).event(m),A=tt(m.view).on("mousemove.zoom",H,!0).on("mouseup.zoom",X,!0),L=mt(m,p),P=m.clientX,z=m.clientY;yi(m.view),Ce(m),w.mouse=[L,this.__zoom.invert(L)],ce(this),w.start();function H(G){if(Pt(G),!w.moved){var q=G.clientX-P,K=G.clientY-z;w.moved=q*q+K*K>y}w.event(G).zoom("mouse",n(N(w.that.__zoom,w.mouse[0]=mt(G,p),w.mouse[1]),w.extent,r))}function X(G){A.on("mousemove.zoom mouseup.zoom",null),bi(G.view,w.moved),Pt(G),w.event(G).end()}}function T(m,...u){if(t.apply(this,arguments)){var p=this.__zoom,w=mt(m.changedTouches?m.changedTouches[0]:m,this),A=p.invert(w),L=p.k*(m.shiftKey?.5:2),P=n(N(I(p,L),w,A),e.apply(this,u),r);Pt(m),o>0?tt(this).transition().duration(o).call(C,P,w,m):tt(this).call(g.transform,P,w,m)}}function O(m,...u){if(t.apply(this,arguments)){var p=m.touches,w=p.length,A=b(this,u,m.changedTouches.length===w).event(m),L,P,z,H;for(Ce(m),P=0;P<w;++P)z=p[P],H=mt(z,this),H=[H,this.__zoom.invert(H),z.identifier],A.touch0?!A.touch1&&A.touch0[2]!==H[2]&&(A.touch1=H,A.taps=0):(A.touch0=H,L=!0,A.taps=1+!!d);d&&(d=clearTimeout(d)),L&&(A.taps<2&&(_=H[0],d=setTimeout(function(){d=null},h)),ce(this),A.start())}}function j(m,...u){if(this.__zooming){var p=b(this,u).event(m),w=m.changedTouches,A=w.length,L,P,z,H;for(Pt(m),L=0;L<A;++L)P=w[L],z=mt(P,this),p.touch0&&p.touch0[2]===P.identifier?p.touch0[0]=z:p.touch1&&p.touch1[2]===P.identifier&&(p.touch1[0]=z);if(P=p.that.__zoom,p.touch1){var X=p.touch0[0],G=p.touch0[1],q=p.touch1[0],K=p.touch1[1],V=(V=q[0]-X[0])*V+(V=q[1]-X[1])*V,Q=(Q=K[0]-G[0])*Q+(Q=K[1]-G[1])*Q;P=I(P,Math.sqrt(V/Q)),z=[(X[0]+q[0])/2,(X[1]+q[1])/2],H=[(G[0]+K[0])/2,(G[1]+K[1])/2]}else if(p.touch0)z=p.touch0[0],H=p.touch0[1];else return;p.zoom("touch",n(N(P,z,H),p.extent,r))}}function Y(m,...u){if(this.__zooming){var p=b(this,u).event(m),w=m.changedTouches,A=w.length,L,P;for(Ce(m),f&&clearTimeout(f),f=setTimeout(function(){f=null},h),L=0;L<A;++L)P=w[L],p.touch0&&p.touch0[2]===P.identifier?delete p.touch0:p.touch1&&p.touch1[2]===P.identifier&&delete p.touch1;if(p.touch1&&!p.touch0&&(p.touch0=p.touch1,delete p.touch1),p.touch0)p.touch0[1]=this.__zoom.invert(p.touch0[0]);else if(p.end(),p.taps===2&&(P=mt(P,this),Math.hypot(_[0]-P[0],_[1]-P[1])<x)){var z=tt(this).on("dblclick.zoom");z&&z.apply(this,arguments)}}}return g.wheelDelta=function(m){return arguments.length?(i=typeof m=="function"?m:Zt(+m),g):i},g.filter=function(m){return arguments.length?(t=typeof m=="function"?m:Zt(!!m),g):t},g.touchable=function(m){return arguments.length?(a=typeof m=="function"?m:Zt(!!m),g):a},g.extent=function(m){return arguments.length?(e=typeof m=="function"?m:Zt([[+m[0][0],+m[0][1]],[+m[1][0],+m[1][1]]]),g):e},g.scaleExtent=function(m){return arguments.length?(s[0]=+m[0],s[1]=+m[1],g):[s[0],s[1]]},g.translateExtent=function(m){return arguments.length?(r[0][0]=+m[0][0],r[1][0]=+m[1][0],r[0][1]=+m[0][1],r[1][1]=+m[1][1],g):[[r[0][0],r[0][1]],[r[1][0],r[1][1]]]},g.constrain=function(m){return arguments.length?(n=m,g):n},g.duration=function(m){return arguments.length?(o=+m,g):o},g.interpolate=function(m){return arguments.length?(c=m,g):c},g.on=function(){var m=l.on.apply(l,arguments);return m===l?g:m},g.clickDistance=function(m){return arguments.length?(y=(m=+m)*m,g):Math.sqrt(y)},g.tapDistance=function(m){return arguments.length?(x=+m,g):x},g}let te=null,ut=null,St=!0,qe=null,Ue=null,bt=new Set;const Fn=["#FF6B35","#004E89","#7B2D8E","#1A936F","#C5283D","#E9724C","#3498db","#9b59b6","#27ae60","#f39c12"];function Ol(t){var n;const e=window.appState.projectId;ut=null,bt=new Set,t.innerHTML=`
    <div class="page-graph">
      <header class="page-header">
        <div class="page-header-left">
          <button class="btn btn-ghost" onclick="navigateTo('results')" style="padding:8px 16px;">
            <span class="material-symbols-outlined icon-sm">arrow_back</span> ${S("btn_back")}
          </button>
        </div>
        <div class="page-header-center">
          <h1 class="mono-sm">${S("graph_title")}</h1>
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
              <input type="checkbox" id="edge-label-checkbox" ${St?"checked":""} />
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
            <h3 class="mono-xs panel-title">${S("graph_agents")}</h3>
            <div id="agents-list" class="agents-list"></div>
          </div>
        </aside>
      </div>

      <div class="page-actions">
        <button class="btn btn-accent" onclick="navigateTo('results')">
          ${S("btn_view_report")} <span class="material-symbols-outlined icon-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `,(n=document.getElementById("edge-label-checkbox"))==null||n.addEventListener("change",i=>{St=i.target.checked,qe&&qe.style("display",St?"block":"none"),Ue&&Ue.style("display",St?"block":"none")}),e&&Dl(e)}async function Dl(t){try{const[e,n]=await Promise.all([U.getGraph(t),U.getAgents(t)]),i=e.nodes||[],a=e.edges||[],s=n.agents||[];document.getElementById("graph-stats").textContent=`NODES: ${i.length} | EDGES: ${a.length} | AGENTS: ${s.length}`,zl(s),Hl(i,a)}catch(e){document.getElementById("graph-stats").textContent=S("graph_load_error"),console.error("Graph load error:",e)}}function zl(t){const e=document.getElementById("agents-list");if(!t.length){e.innerHTML=`<p class="muted mono-xs">${S("graph_no_agents")}</p>`;return}const n={Self:"person",Family:"family_restroom",Mentor:"school",Partner:"favorite",School:"domain",Employer:"business",City:"location_city",Industry:"trending_up",Risk:"warning"};e.innerHTML=t.map(i=>`
    <div class="agent-card" data-agent-type="${i.agent_type}" style="border-left: 3px solid ${Gn(i.agent_type)}">
      <div class="agent-card-header">
        <span class="material-symbols-outlined icon-sm" style="color:${Gn(i.agent_type)}">${n[i.agent_type]||"smart_toy"}</span>
        <strong class="mono-xs">${i.name||i.agent_type}</strong>
        <span class="badge badge-sm">${i.agent_type}</span>
      </div>
      <p class="agent-persona">${i.persona||""}</p>
      ${i.stance?`<div class="mono-xs muted">STANCE: ${i.stance} | INFLUENCE: ${(i.influence*100).toFixed(0)}%</div>`:""}
    </div>
  `).join("")}function Gn(t){return{Self:"#c9a0ff",Factor:"#556677",Family:"#ff9eb1",Mentor:"#7ecfff",School:"#ffd17e",Employer:"#7eff9e",City:"#ff7eb3",Industry:"#b4ff7e",Risk:"#ff7e7e",Partner:"#ffb07e",Person:"#888"}[t]||"#666"}function Hl(t,e){te&&(te.stop(),te=null);const n=document.getElementById("graph-canvas-wrap"),i=tt("#graph-svg"),a=n.clientWidth||800,s=n.clientHeight||600;if(i.attr("width",a).attr("height",s).attr("viewBox",`0 0 ${a} ${s}`),i.selectAll("*").remove(),!t.length){i.append("text").attr("x",a/2).attr("y",s/2).attr("text-anchor","middle").attr("fill","#666").attr("font-family","monospace").text(S("graph_no_data"));return}const r={};t.forEach(u=>{r[u.uuid||u.id]=u});const o={};let c=0;t.forEach(u=>{var w;const p=((w=u.labels)==null?void 0:w.find(A=>A!=="Entity"))||u.type||u.group||"Entity";o[p]||(o[p]=Fn[c%Fn.length],c++)});const l=u=>o[u]||"#999",d=t.map(u=>{var p;return{id:u.uuid||u.id,name:u.name||"Unnamed",type:((p=u.labels)==null?void 0:p.find(w=>w!=="Entity"))||u.type||u.group||"Entity",rawData:u}}),_=new Set(d.map(u=>u.id)),f={},h={},k=new Set,y=e.filter(u=>{const p=u.source_node_uuid||u.source,w=u.target_node_uuid||u.target;return _.has(p)&&_.has(w)});y.forEach(u=>{var A,L;const p=u.source_node_uuid||u.source,w=u.target_node_uuid||u.target;if(p===w)h[p]||(h[p]=[]),h[p].push({...u,source_name:(A=r[p])==null?void 0:A.name,target_name:(L=r[w])==null?void 0:L.name});else{const P=[p,w].sort().join("_");f[P]=(f[P]||0)+1}});const x={},g=[];y.forEach(u=>{var G,q,K;const p=u.source_node_uuid||u.source,w=u.target_node_uuid||u.target;if(p===w){if(k.has(p))return;k.add(p);const V=h[p],Q=((G=r[p])==null?void 0:G.name)||"Unknown";g.push({source:p,target:w,type:"SELF_LOOP",name:`Self (${V.length})`,curvature:0,isSelfLoop:!0,rawData:{isSelfLoopGroup:!0,source_name:Q,target_name:Q,selfLoopCount:V.length,selfLoopEdges:V}});return}const L=[p,w].sort().join("_"),P=f[L],z=x[L]||0;x[L]=z+1;const H=p>w;let X=0;if(P>1){const V=Math.min(1.2,.6+P*.15);X=(z/(P-1)-.5)*V*2,H&&(X=-X)}g.push({source:p,target:w,type:u.fact_type||u.relation||u.name||"RELATED",name:u.name||u.relation||u.fact_type||"RELATED",curvature:X,isSelfLoop:!1,pairIndex:z,pairTotal:P,rawData:{...u,source_name:(q=r[p])==null?void 0:q.name,target_name:(K=r[w])==null?void 0:K.name}})});const I=Il(d).force("link",yl(g).id(u=>u.id).distance(u=>150+((u.pairTotal||1)-1)*50)).force("charge",Tl().strength(-400)).force("center",Ko(a/2,s/2)).force("collide",gl(50)).force("x",Sl(a/2).strength(.04)).force("y",Al(s/2).strength(.04));te=I,i.append("defs").html(`
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-strong"><feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  `);const v=i.append("g");i.call(Rl().extent([[0,0],[a,s]]).scaleExtent([.1,4]).on("zoom",u=>{v.attr("transform",u.transform)}));function C(u){const p=u.source.x,w=u.source.y,A=u.target.x,L=u.target.y;if(u.isSelfLoop){const ji=p+8,Fi=w-4,Gi=p+8,Yi=w+4;return`M${ji},${Fi} A30,30 0 1,1 ${Gi},${Yi}`}if(u.curvature===0)return`M${p},${w} L${A},${L}`;const P=A-p,z=L-w,H=Math.sqrt(P*P+z*z)||1,G=.25+(u.pairTotal||1)*.05,q=Math.max(35,H*G),K=-z/H*u.curvature*q,V=P/H*u.curvature*q,Q=(p+A)/2+K,xt=(w+L)/2+V;return`M${p},${w} Q${Q},${xt} ${A},${L}`}function b(u){const p=u.source.x,w=u.source.y,A=u.target.x,L=u.target.y;if(u.isSelfLoop)return{x:p+70,y:w};if(u.curvature===0)return{x:(p+A)/2,y:(w+L)/2};const P=A-p,z=L-w,H=Math.sqrt(P*P+z*z)||1,G=.25+(u.pairTotal||1)*.05,q=Math.max(35,H*G),K=-z/H*u.curvature*q,V=P/H*u.curvature*q,Q=(p+A)/2+K,xt=(w+L)/2+V;return{x:.25*p+.5*Q+.25*A,y:.25*w+.5*xt+.25*L}}const $=v.append("g").attr("class","links"),M=$.selectAll("path").data(g).enter().append("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5).attr("fill","none").style("cursor","pointer").on("click",(u,p)=>{u.stopPropagation(),Le($,j,B,T),tt(u.target).attr("stroke","#3498db").attr("stroke-width",3),ee({type:"edge",data:p.rawData})}),B=$.selectAll("rect.link-label-bg").data(g).enter().append("rect").attr("class","link-label-bg").attr("fill","rgba(255,255,255,0.95)").attr("rx",3).attr("ry",3).style("cursor","pointer").style("pointer-events","all").style("display",St?"block":"none").on("click",(u,p)=>{u.stopPropagation(),Le($,j,B,T),M.filter(w=>w===p).attr("stroke","#3498db").attr("stroke-width",3),ee({type:"edge",data:p.rawData})}),T=$.selectAll("text.link-label").data(g).enter().append("text").attr("class","link-label").text(u=>u.name).attr("font-size","9px").attr("fill","#999").attr("text-anchor","middle").attr("dominant-baseline","middle").style("cursor","pointer").style("pointer-events","all").style("font-family","'Inter', system-ui, sans-serif").style("display",St?"block":"none").on("click",(u,p)=>{u.stopPropagation(),Le($,j,B,T),M.filter(w=>w===p).attr("stroke","#3498db").attr("stroke-width",3),ee({type:"edge",data:p.rawData})});qe=T,Ue=B;const O=v.append("g").attr("class","nodes"),j=O.selectAll("circle").data(d).enter().append("circle").attr("r",12).attr("fill",u=>l(u.type)).attr("stroke","#fff").attr("stroke-width",2.5).style("cursor","pointer").attr("filter","url(#glow)").call(pr().on("start",(u,p)=>{p.fx=p.x,p.fy=p.y,p._dragStartX=u.x,p._dragStartY=u.y,p._isDragging=!1}).on("drag",(u,p)=>{const w=u.x-p._dragStartX,A=u.y-p._dragStartY,L=Math.sqrt(w*w+A*A);!p._isDragging&&L>3&&(p._isDragging=!0,I.alphaTarget(.3).restart()),p._isDragging&&(p.fx=u.x,p.fy=u.y)}).on("end",(u,p)=>{p._isDragging&&I.alphaTarget(0),p.fx=null,p.fy=null,p._isDragging=!1})).on("click",(u,p)=>{u.stopPropagation(),j.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)"),$.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),tt(u.target).attr("stroke","#0F766E").attr("stroke-width",4).attr("filter","url(#glow-strong)"),M.filter(A=>A.source.id===p.id||A.target.id===p.id).attr("stroke","#0F766E").attr("stroke-width",2.5);const w=document.getElementById("graph-hint");w&&(w.style.display="none"),ee({type:"node",data:p.rawData,entityType:p.type,color:l(p.type)})}).on("mouseenter",(u,p)=>{var w,A;(!ut||(((w=ut.data)==null?void 0:w.uuid)||((A=ut.data)==null?void 0:A.id))!==(p.rawData.uuid||p.rawData.id))&&tt(u.target).attr("stroke","#333").attr("stroke-width",3)}).on("mouseleave",(u,p)=>{var w,A;(!ut||(((w=ut.data)==null?void 0:w.uuid)||((A=ut.data)==null?void 0:A.id))!==(p.rawData.uuid||p.rawData.id))&&tt(u.target).attr("stroke","#fff").attr("stroke-width",2.5)}),Y=O.selectAll("text").data(d).enter().append("text").text(u=>u.name.length>8?u.name.substring(0,8)+"…":u.name).attr("font-size","11px").attr("fill","#bbb").attr("font-weight","500").attr("dx",16).attr("dy",4).style("pointer-events","none").style("font-family","'Inter', sans-serif");I.on("tick",()=>{M.attr("d",u=>C(u)),T.each(function(u){const p=b(u);tt(this).attr("x",p.x).attr("y",p.y).attr("transform","")}),B.each(function(u,p){const w=b(u),A=T.nodes()[p];if(A){const L=A.getBBox();tt(this).attr("x",w.x-L.width/2-4).attr("y",w.y-L.height/2-2).attr("width",L.width+8).attr("height",L.height+4).attr("transform","")}}),j.attr("cx",u=>u.x).attr("cy",u=>u.y),Y.attr("x",u=>u.x).attr("y",u=>u.y)}),i.on("click",()=>{ut=null,j.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)"),$.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),B.attr("fill","rgba(255,255,255,0.95)"),T.attr("fill","#999"),Ee()}),Gl(o);const m=()=>{const u=n.clientWidth,p=n.clientHeight;i.attr("width",u).attr("height",p).attr("viewBox",`0 0 ${u} ${p}`)};window.addEventListener("resize",m)}function Le(t,e,n,i){t&&t.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),n&&n.attr("fill","rgba(255,255,255,0.95)"),i&&i.attr("fill","#999"),e&&e.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)")}function ee(t){ut=t;const e=document.getElementById("graph-detail-panel");e&&(e.style.display="flex",t.type==="node"?jl(e,t):Fl(e,t))}function Ee(){const t=document.getElementById("graph-detail-panel");t&&(t.style.display="none"),ut=null,bt=new Set}function jl(t,e){var r;const n=e.data,i=n.attributes||n.properties||{},a=n.labels||[],s=n.summary||n.persona||n.description||"";t.innerHTML=`
    <div class="gd-panel-header">
      <span class="gd-title">Node Details</span>
      <span class="gd-type-badge" style="background:${e.color};color:#fff;">${e.entityType}</span>
      <button class="gd-close" id="gd-close">×</button>
    </div>
    <div class="gd-content">
      <div class="gd-row">
        <span class="gd-label">Name:</span>
        <span class="gd-value">${n.name||"—"}</span>
      </div>
      ${n.uuid?`
      <div class="gd-row">
        <span class="gd-label">UUID:</span>
        <span class="gd-value gd-uuid">${n.uuid}</span>
      </div>`:""}
      ${n.id&&!n.uuid?`
      <div class="gd-row">
        <span class="gd-label">ID:</span>
        <span class="gd-value gd-uuid">${n.id}</span>
      </div>`:""}
      ${n.created_at?`
      <div class="gd-row">
        <span class="gd-label">Created:</span>
        <span class="gd-value">${pn(n.created_at)}</span>
      </div>`:""}

      ${Object.keys(i).length>0?`
      <div class="gd-section">
        <div class="gd-section-title">Properties:</div>
        ${Object.entries(i).map(([o,c])=>`
          <div class="gd-prop">
            <span class="gd-prop-key">${o}:</span>
            <span class="gd-prop-val">${c||"None"}</span>
          </div>
        `).join("")}
      </div>`:""}

      ${s?`
      <div class="gd-section">
        <div class="gd-section-title">Summary:</div>
        <div class="gd-summary">${s}</div>
      </div>`:""}

      ${a.length>0?`
      <div class="gd-section">
        <div class="gd-section-title">Labels:</div>
        <div class="gd-labels">
          ${a.map(o=>`<span class="gd-label-tag">${o}</span>`).join("")}
        </div>
      </div>`:""}

      ${n.stance?`
      <div class="gd-section">
        <div class="gd-section-title">Agent Info:</div>
        <div class="gd-prop"><span class="gd-prop-key">Stance:</span><span class="gd-prop-val">${n.stance}</span></div>
        ${n.influence!==void 0?`<div class="gd-prop"><span class="gd-prop-key">Influence:</span><span class="gd-prop-val">${(n.influence*100).toFixed(0)}%</span></div>`:""}
        ${n.impact?`<div class="gd-prop"><span class="gd-prop-key">Impact:</span><span class="gd-prop-val gd-impact-${n.impact}">${n.impact.toUpperCase()}</span></div>`:""}
      </div>`:""}
    </div>
  `,(r=document.getElementById("gd-close"))==null||r.addEventListener("click",o=>{o.stopPropagation(),Ee()})}function Fl(t,e){var i,a;const n=e.data;if(n.isSelfLoopGroup){Bi(t,n);return}t.innerHTML=`
    <div class="gd-panel-header">
      <span class="gd-title">Relationship</span>
      <button class="gd-close" id="gd-close">×</button>
    </div>
    <div class="gd-content">
      <div class="gd-edge-header">
        ${n.source_name||"?"} → ${n.name||n.relation||"RELATED_TO"} → ${n.target_name||"?"}
      </div>
      ${n.uuid?`
      <div class="gd-row">
        <span class="gd-label">UUID:</span>
        <span class="gd-value gd-uuid">${n.uuid}</span>
      </div>`:""}
      <div class="gd-row">
        <span class="gd-label">Label:</span>
        <span class="gd-value">${n.name||n.relation||"RELATED_TO"}</span>
      </div>
      <div class="gd-row">
        <span class="gd-label">Type:</span>
        <span class="gd-value">${n.fact_type||n.relation_type||"Unknown"}</span>
      </div>
      ${n.fact?`
      <div class="gd-row">
        <span class="gd-label">Fact:</span>
        <span class="gd-value gd-fact">${n.fact}</span>
      </div>`:""}
      ${n.weight!==void 0?`
      <div class="gd-row">
        <span class="gd-label">Weight:</span>
        <span class="gd-value">${n.weight}</span>
      </div>`:""}
      ${((i=n.episodes)==null?void 0:i.length)>0?`
      <div class="gd-section">
        <div class="gd-section-title">Episodes:</div>
        <div class="gd-episodes">
          ${n.episodes.map(s=>`<span class="gd-episode-tag">${s}</span>`).join("")}
        </div>
      </div>`:""}
      ${n.created_at?`
      <div class="gd-row">
        <span class="gd-label">Created:</span>
        <span class="gd-value">${pn(n.created_at)}</span>
      </div>`:""}
    </div>
  `,(a=document.getElementById("gd-close"))==null||a.addEventListener("click",s=>{s.stopPropagation(),Ee()})}function Bi(t,e){var i;const n=e.selfLoopEdges||[];t.innerHTML=`
    <div class="gd-panel-header">
      <span class="gd-title">Self Relations</span>
      <button class="gd-close" id="gd-close">×</button>
    </div>
    <div class="gd-content">
      <div class="gd-edge-header gd-self-loop-hdr">
        ${e.source_name} — Self Relations
        <span class="gd-self-count">${e.selfLoopCount} items</span>
      </div>
      <div class="gd-self-list" id="gd-self-list">
        ${n.map((a,s)=>{const r=a.uuid||s;return`
            <div class="gd-self-item ${bt.has(r)?"expanded":""}" data-self-id="${r}">
              <div class="gd-self-item-header" data-toggle-id="${r}">
                <span class="gd-self-idx">#${s+1}</span>
                <span class="gd-self-name">${a.name||a.fact_type||"RELATED"}</span>
                <span class="gd-self-toggle">${bt.has(r)?"−":"+"}</span>
              </div>
              <div class="gd-self-item-content" style="display:${bt.has(r)?"block":"none"};">
                ${a.uuid?`<div class="gd-row"><span class="gd-label">UUID:</span><span class="gd-value gd-uuid">${a.uuid}</span></div>`:""}
                ${a.fact?`<div class="gd-row"><span class="gd-label">Fact:</span><span class="gd-value gd-fact">${a.fact}</span></div>`:""}
                ${a.fact_type?`<div class="gd-row"><span class="gd-label">Type:</span><span class="gd-value">${a.fact_type}</span></div>`:""}
                ${a.created_at?`<div class="gd-row"><span class="gd-label">Created:</span><span class="gd-value">${pn(a.created_at)}</span></div>`:""}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,t.querySelectorAll("[data-toggle-id]").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.toggleId,r=isNaN(s)?s:parseInt(s);bt.has(r)?bt.delete(r):bt.add(r),Bi(t,e)})}),(i=document.getElementById("gd-close"))==null||i.addEventListener("click",a=>{a.stopPropagation(),Ee()})}function Gl(t){const e=document.getElementById("graph-legend-panel");if(!e)return;const n=Object.entries(t);n.length!==0&&(e.innerHTML=`
    <span class="gl-title">Entity Types</span>
    <div class="gl-items">
      ${n.map(([i,a])=>`
        <div class="gl-item">
          <span class="gl-dot" style="background:${a};"></span>
          <span class="gl-label">${i}</span>
        </div>
      `).join("")}
    </div>
  `)}function pn(t){if(!t)return"";try{return new Date(t).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}catch{return t}}const E={currentPage:"landing",projectId:null,project:null,simComplete:!1,simConfig:{rounds:12,timeUnit:"quarter",agentCount:8},simulationTab:"tree",resultsView:"overview",selectedPathId:null,selectedNodeIndex:0,backtrackNodeIndex:null,treeEvents:[]},Pi={landing:Ui,onboarding:ae,parameters:Me,simulation:na,results:lt,graph:Ol},Xe=new Set;function Mt(t=[]){E.treeEvents=Array.isArray(t)?[...t]:[]}function fn(t){t!=null&&t.id&&(E.treeEvents.some(e=>e.id===t.id)||(E.treeEvents=[...E.treeEvents,t],Xe.forEach(e=>e(t))))}function Yl(t,{replay:e=!1}={}){return Xe.add(t),e&&E.treeEvents.forEach(n=>t(n)),()=>Xe.delete(t)}function Ri(t,e={}){t!=null&&t.id&&(E.projectId=t.id,E.project=t,E.simComplete=t.status==="completed"||Array.isArray(t.paths)&&t.paths.length>0,E.simulationTab=e.simulationTab||"tree",E.resultsView=e.resultsView||"overview",E.selectedPathId=e.selectedPathId||null,E.selectedNodeIndex=e.selectedNodeIndex??0,E.backtrackNodeIndex=null,Mt(t._tree_events||[]),Object.assign(E,e))}function Vl(){E.simComplete=!1,E.simulationTab="tree",E.resultsView="overview",E.selectedPathId=null,E.selectedNodeIndex=0,E.backtrackNodeIndex=null,Mt([])}function Oi(){var t;return E.currentPage==="simulation"&&!E.simComplete&&((t=E.project)==null?void 0:t.status)!=="completed"}function Di(t){var e,n;return t==="landing"?!0:E.projectId?t==="simulation"?["profiled","configured","simulating","completed"].includes(((e=E.project)==null?void 0:e.status)||""):t==="graph"||t==="results"?E.simComplete||((n=E.project)==null?void 0:n.status)==="completed":!0:!1}function zi(t){return Di(t)?Oi()&&t!=="simulation":!0}function J(t,e={}){if(zi(t)){ye();return}Object.assign(E,e);const n=hn(t);if(n===E.currentPage&&Object.keys(e).length===0){ye();return}E.currentPage=n,window.location.hash=n,mn()}function hn(t){var e;return!E.projectId&&["simulation","graph","results"].includes(t)?"landing":["graph","results"].includes(t)&&!E.simComplete&&((e=E.project)==null?void 0:e.status)!=="completed"?"simulation":t}window.navigateTo=J;window.appState=E;window.t=S;function mn(){const t=document.getElementById("app"),e=hn(E.currentPage);E.currentPage=e;const n=Pi[e];n&&n(t),ye(),ql()}function ye(){const t={landing:"nav_simulation",simulation:"nav_system",graph:"nav_graph",results:"nav_reports"},e=Oi();document.querySelectorAll(".nav-link[data-page]").forEach(n=>{const i=n.dataset.page,a=!Di(i)||e&&i!=="simulation";n.classList.toggle("active",i===E.currentPage),n.classList.toggle("nav-disabled",a),n.setAttribute("aria-disabled",a?"true":"false");const s=t[i];s&&(n.textContent=S(s))})}function ql(){const t=document.getElementById("lang-toggle");t&&(t.textContent=S("lang_switch"))}function Hi(){const t=window.location.hash.slice(1)||"landing";if(Pi[t]){if(zi(t)){window.location.hash!=="#simulation"&&(window.location.hash="simulation"),ye();return}E.currentPage=hn(t),mn()}}window.addEventListener("hashchange",Hi);window.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".nav-link[data-page]").forEach(e=>{e.addEventListener("click",n=>{n.preventDefault(),J(e.dataset.page)})});const t=document.getElementById("lang-toggle");t&&t.addEventListener("click",()=>{qi(),mn()}),Hi()});
