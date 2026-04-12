(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const ee="";async function Q(t,e,n=null){const i={method:t,headers:{"Content-Type":"application/json"}};n&&(i.body=JSON.stringify(n));const a=await fetch(`${ee}${e}`,i);if(!a.ok){const s=await a.json().catch(()=>({detail:a.statusText}));throw new Error(s.detail||"API Error")}return a.json()}const K={health:()=>Q("GET","/api/health"),createProject:t=>Q("POST","/api/projects",{title:t}),importProject:t=>Q("POST","/api/projects/import",t),listProjects:()=>Q("GET","/api/projects"),getProject:t=>Q("GET",`/api/projects/${t}`),deleteProject:t=>Q("DELETE",`/api/projects/${t}`),submitProfile:(t,e)=>Q("POST",`/api/projects/${t}/profile`,e),submitParameters:(t,e)=>Q("POST",`/api/projects/${t}/parameters`,{parameters:e}),startSimulation:(t,e=12,n="quarter",i=6)=>fetch(`${ee}/api/projects/${t}/simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rounds:e,time_unit:n,agent_count:i})}),reSimulate:(t,e=12,n="quarter",i=6)=>fetch(`${ee}/api/projects/${t}/re-simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rounds:e,time_unit:n,agent_count:i})}),backtrack:(t,e,n,i,a,s=6)=>fetch(`${ee}/api/projects/${t}/backtrack`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path_id:e,node_index:n,modifications:i,description:a,rounds:s})}),getPaths:t=>Q("GET",`/api/projects/${t}/paths`),getPathDetail:(t,e)=>Q("GET",`/api/projects/${t}/paths/${e}`),getAdvice:(t,e,n="satisfied")=>Q("POST",`/api/projects/${t}/paths/${e}/advice`,{feedback:n}),getGraph:t=>Q("GET",`/api/projects/${t}/graph`),getAgents:t=>Q("GET",`/api/projects/${t}/agents`),getReport:t=>Q("GET",`/api/projects/${t}/report`),getTreeEvents:t=>Q("GET",`/api/projects/${t}/tree-events`)},on={zh:{nav_simulation:"推演",nav_graph:"图谱",nav_reports:"报告",nav_system:"系统",landing_tag:"[PROLOGUE_01]",landing_title_1:"人生不是终点。",landing_title_2:"它是一个变量。",landing_desc:"通过多智能体仿真推演，量化人生轨迹中的关键节点。调一下参数，看看你的未来会走向哪里。",landing_cta:"[开始推演]",landing_history:"[历史记录]",onboarding_title:"构建你的人物模型",step_personality:"性格分析",step_education:"教育背景",step_academic:"学术信息",step_family:"家庭背景",step_career:"职业倾向",step_concern:"核心困惑",btn_next:"下一步",btn_prev:"上一步",btn_submit:"提交档案",param_title:"定义关注参数",param_desc:"明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。",param_add:"+ 添加参数",param_primary:"主参数",param_secondary:"次参数",sim_config:"推演配置",sim_rounds:"推演轮数",sim_time_unit:"时间单位",sim_quarter:"每季度",btn_start_sim:"开始推演",btn_back_profile:"返回档案",sim_viewport:"SIMULATION_VIEWPORT",sim_tree_title:"人生路径树",sim_event_stream:"事件流",sim_metrics:"系统指标",sim_progress:"进度",sim_paths:"路径数",sim_branches:"分支数",sim_round:"当前轮次",sim_initializing:"初始化中",sim_waiting:"等待推演开始...",sim_state:"当前状态",sim_completed_view:"推演已完成",sim_completed_msg:"本项目的推演已完成，点击下方按钮查看结果。",sim_tab_tree:"推演树",sim_tab_actions:"结果导航",sim_tree_readonly:"只读模式",sim_tree_summary:"推演摘要",btn_view_graph:"查看知识图谱",btn_view_results:"查看推演报告",btn_re_simulate:"重新推演",graph_title:"人生图谱",graph_agents:"智能体",graph_node_detail:"节点详情",graph_no_agents:"暂无智能体数据",graph_no_data:"暂无图谱数据",graph_load_error:"图谱加载失败",btn_view_report:"查看推演结果",results_title:"路径分析报告",results_desc:"系统已完成推演，生成 {count} 条人生路径。点击路径卡片查看详情。",results_status:"状态: 已完成",path_optimal:"最优路径",path_conservative:"稳健路径",path_risk:"冒险路径",path_balanced:"平衡路径",path_satisfaction:"满意度预测",path_nodes:"节点数",path_risk_label:"风险",btn_new_sim:"新建推演",btn_back:"返回",detail_node_seq:"节点序列",detail_description:"描述",detail_trigger:"触发原因",detail_state_snapshot:"状态快照",btn_get_advice:"获取 AI 建议",advice_title:"策略规划",advice_desc:"针对「{path}」的 AI 行动建议",advice_satisfied:"满意模式",advice_unsatisfied:"不满意模式",advice_choose:"选择反馈模式以生成建议...",advice_generating:"正在生成建议...",advice_immediate:"近期行动",advice_mid_term:"中期布局",advice_risk_mit:"风险规避",advice_risk_analysis:"风险分析",advice_intervention:"干预节点",advice_alternative:"替代路径",advice_mental:"心理支持",advice_key_nodes:"关键节点",state_education:"学业",state_career:"职业",state_finance:"经济",state_health:"健康",state_mental:"心理",state_relationship:"关系",state_family_support:"家庭",state_social_capital:"社会资本",state_optionality:"可选择空间",state_goal_alignment:"目标达成",lang_switch:"EN",error_loading:"加载失败"},en:{nav_simulation:"SIMULATE",nav_graph:"GRAPH",nav_reports:"REPORTS",nav_system:"SYSTEM",landing_tag:"[PROLOGUE_01]",landing_title_1:"Life is not a destination.",landing_title_2:"It's a variable.",landing_desc:"Simulate life trajectories through multi-agent modeling. Tweak the parameters and see where your future leads.",landing_cta:"[START SIMULATION]",landing_history:"[VIEW HISTORY]",onboarding_title:"Build Your Profile",step_personality:"Personality",step_education:"Education",step_academic:"Academic",step_family:"Family",step_career:"Career",step_concern:"Core Concern",btn_next:"Next",btn_prev:"Previous",btn_submit:"Submit Profile",param_title:"Define Concern Parameters",param_desc:"Define your core questions. The system will diverge multi-layer influence factors and generate agents around your concerns.",param_add:"+ Add Parameter",param_primary:"Primary",param_secondary:"Secondary",sim_config:"Simulation Config",sim_rounds:"Rounds",sim_time_unit:"Time Unit",sim_quarter:"Quarterly",btn_start_sim:"Start Simulation",btn_back_profile:"Back to Profile",sim_viewport:"SIMULATION_VIEWPORT",sim_tree_title:"Life-Path Tree",sim_event_stream:"EVENT_STREAM",sim_metrics:"SYSTEM_METRICS",sim_progress:"PROGRESS",sim_paths:"PATHS",sim_branches:"BRANCHES",sim_round:"ROUND",sim_initializing:"INITIALIZING",sim_waiting:"Waiting for simulation start...",sim_state:"CURRENT_STATE",sim_completed_view:"Simulation Complete",sim_completed_msg:"Simulation has already finished. Click below to view results.",sim_tab_tree:"Derivation Tree",sim_tab_actions:"Result Hub",sim_tree_readonly:"Read-only",sim_tree_summary:"Summary",btn_view_graph:"View Knowledge Graph",btn_view_results:"View Simulation Report",btn_re_simulate:"Re-simulate",graph_title:"LIFE_GRAPH",graph_agents:"AGENTS",graph_node_detail:"NODE_DETAIL",graph_no_agents:"No agents data yet",graph_no_data:"No graph data available",graph_load_error:"GRAPH_LOAD_ERROR",btn_view_report:"View Results",results_title:"Path Analysis Report",results_desc:"Simulation complete. {count} life paths generated. Click a card to view details.",results_status:"STATUS: COMPLETED",path_optimal:"Optimal Path",path_conservative:"Conservative Path",path_risk:"Risk Path",path_balanced:"Balanced Path",path_satisfaction:"Satisfaction",path_nodes:"Nodes",path_risk_label:"Risk",btn_new_sim:"New Simulation",btn_back:"Back",detail_node_seq:"NODE_SEQUENCE",detail_description:"Description",detail_trigger:"Trigger Reason",detail_state_snapshot:"State Snapshot",btn_get_advice:"Get AI Advice",advice_title:"Strategy Protocol",advice_desc:'AI-powered advice for "{path}"',advice_satisfied:"Satisfied Mode",advice_unsatisfied:"Unsatisfied Mode",advice_choose:"Choose feedback mode to generate advice...",advice_generating:"GENERATING_ADVICE...",advice_immediate:"Immediate Actions",advice_mid_term:"Mid-term Plan",advice_risk_mit:"Risk Mitigation",advice_risk_analysis:"Risk Analysis",advice_intervention:"Intervention Points",advice_alternative:"Alternative Paths",advice_mental:"Mental Support",advice_key_nodes:"Key Nodes",state_education:"Education",state_career:"Career",state_finance:"Finance",state_health:"Health",state_mental:"Mental",state_relationship:"Relationship",state_family_support:"Family",state_social_capital:"Social Capital",state_optionality:"Optionality",state_goal_alignment:"Goal Alignment",lang_switch:"中文",error_loading:"Loading failed"}};let Fe=localStorage.getItem("lifepath_lang")||"zh";function S(t){var e;return((e=on[Fe])==null?void 0:e[t])||on.zh[t]||t}function Li(t){Fe=t,localStorage.setItem("lifepath_lang",t)}function Mi(){Li(Fe==="zh"?"en":"zh")}function Ge(t){return S(`state_${t}`)}const Pn=["education","career","finance","health","mental","relationship","family_support","social_capital","optionality","goal_alignment"];function Pi(t){t.innerHTML=`
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
  `;const e=document.getElementById("history-panel"),n=document.getElementById("history-file-input");document.getElementById("btn-questionnaire").addEventListener("click",async()=>{try{Sl();const i=await K.createProject("New Simulation");Ei(i,{simComplete:!1}),at("onboarding")}catch(i){alert("Failed to create project: "+i.message)}}),document.getElementById("btn-history").addEventListener("click",async()=>{const i=e.style.display==="block";e.style.display=i?"none":"block",i||await Ri(e,n)}),n.addEventListener("change",async i=>{const[a]=i.target.files||[];if(a)try{const s=await a.text(),r=JSON.parse(s),o=await K.importProject(r);Te(o)}catch(s){alert("JSON 导入失败: "+s.message)}finally{i.target.value=""}})}async function Ri(t,e){var n,i;t.innerHTML=`
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
  `,(n=document.getElementById("btn-import-json"))==null||n.addEventListener("click",()=>e.click()),(i=document.getElementById("btn-load-demo"))==null||i.addEventListener("click",async()=>{try{const a=await fetch("/demo/high-end-demo.json");if(!a.ok)throw new Error("演示 JSON 读取失败");const s=await a.json(),r=await K.importProject(s);Te(r)}catch(a){alert("加载演示档失败: "+a.message)}});try{const a=await K.listProjects(),s=document.getElementById("history-projects");if(!a.length){s.innerHTML='<div class="mono-xs text-muted">当前没有系统内项目，优先试试内置演示 JSON。</div>';return}s.innerHTML=a.map(r=>`
      <button class="card" data-project-id="${r.id}" style="text-align:left;padding:18px 20px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.75);cursor:pointer;">
        <div style="display:flex;justify-content:space-between;gap:16px;align-items:center;">
          <div>
            <div style="font-weight:700;margin-bottom:6px;">${r.title}</div>
            <div class="mono-xs text-muted">ID: ${r.id} · STATUS: ${r.status} · ${r.created_at}</div>
          </div>
          <span class="tag tag-${r.status==="completed"?"accent":"outline"}">${r.status.toUpperCase()}</span>
        </div>
      </button>
    `).join(""),s.querySelectorAll("[data-project-id]").forEach(r=>{r.addEventListener("click",async()=>{const o=await K.getProject(r.dataset.projectId);Te(o)})})}catch(a){document.getElementById("history-projects").innerHTML=`<div class="mono-xs text-error">历史记录读取失败: ${a.message}</div>`}}function Te(t){Ei(t),t.status==="completed"||(t.paths||[]).length?at("results"):t.status==="configured"?at("simulation"):t.status==="profiled"?at("parameters"):at("onboarding")}const Bi=[{key:"personality",label:"PERSONALITY_TYPE",title:"性格倾向"},{key:"education",label:"EDUCATION_STAGE",title:"当前阶段"},{key:"background",label:"STAGE_CONTEXT",title:"阶段背景"},{key:"family",label:"FAMILY_CONDITIONS",title:"家庭情况"},{key:"preference",label:"CAREER_PREFERENCE",title:"方向偏好"},{key:"concern",label:"CORE_CONCERN",title:"核心困惑"}];let W=0,O={personality_type:"",education_stage:"",school:"",major:"",gpa_range:"",family_economy:"",family_expectation:"",city_preference:"",career_preference:"",risk_preference:"balanced",current_concern:""};const Ut={personality:[{value:"INTJ",label:"战略家 INTJ",desc:"独立思考、目标导向"},{value:"INFP",label:"调停者 INFP",desc:"理想主义、富有同情"},{value:"ENTP",label:"辩论家 ENTP",desc:"创新求变、挑战常规"},{value:"ISFJ",label:"守卫者 ISFJ",desc:"踏实稳重、富有责任"},{value:"ENTJ",label:"指挥官 ENTJ",desc:"强势果断、天生领导"},{value:"INTP",label:"逻辑学家 INTP",desc:"分析深入、追求真理"}],education:[{value:"high_school",label:"高中在读",desc:"面临高考与志愿选择"},{value:"undergraduate",label:"本科在读",desc:"面临保研/考研/就业"},{value:"graduate",label:"研究生在读",desc:"面临就业/读博/转方向"},{value:"working_1_3",label:"工作 1-3 年",desc:"面临转型、跳槽或深造"},{value:"working_3_plus",label:"工作 3 年以上",desc:"面临晋升突破、换赛道或创业"}],career:[{value:"大厂",label:"互联网大厂",desc:"高薪高压，追求高速成长"},{value:"体制内",label:"体制内/国企",desc:"稳定安全，节奏适中"},{value:"科研",label:"科研院所/高校",desc:"深耕学术，自由度高"},{value:"创业",label:"自主创业",desc:"风险高，但上限更高"},{value:"外企",label:"外资企业",desc:"国际化环境，强调平衡"},{value:"自由",label:"自由职业",desc:"自主灵活，收入波动更大"}],risk:[{value:"conservative",label:"保守型",desc:"优先稳定，规避风险"},{value:"balanced",label:"平衡型",desc:"接受适度风险"},{value:"aggressive",label:"激进型",desc:"追求高回报，愿意冒险"}]};function Et(t=O.education_stage){return["working_1_3","working_3_plus"].includes(t)}function Rn(){return Bi.map(t=>t.key!=="background"?t:Et()?{...t,label:"CAREER_CONTEXT",title:"职业背景"}:O.education_stage==="high_school"?{...t,label:"ACADEMIC_CONTEXT",title:"学业基础"}:{...t,label:"ACADEMIC_BACKGROUND",title:"学业背景"})}function Bn(){return Rn()[W]}function Oi(t,e){O[t]=e,t==="education_stage"&&Et(e)&&(O.gpa_range="")}function Tt(t,e,n){return`
    <div class="radio-grid">
      ${t.map(i=>`
        <div class="radio-card ${n===i.value?"selected":""}" data-field="${e}" data-value="${i.value}">
          <div class="radio-card-title">${i.label}</div>
          ${i.desc?`<div class="radio-card-desc">${i.desc}</div>`:""}
        </div>
      `).join("")}
    </div>
  `}function Di(){return Et()?`
      <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">职业背景</h2>
      <p class="text-secondary mb-24">基于你的工作阶段，只保留会影响职业推演的问题。</p>
      <div class="grid-2 gap-16">
        <div class="form-group">
          <label class="form-label">最高学历院校</label>
          <input class="form-input" id="field-school" value="${O.school}" placeholder="如：华南理工大学" />
        </div>
        <div class="form-group">
          <label class="form-label">专业 / 当前赛道</label>
          <input class="form-input" id="field-major" value="${O.major}" placeholder="如：软件工程 / AI 产品" />
        </div>
        <div class="form-group" style="grid-column:1 / span 2;">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${O.city_preference==="一线城市"?"selected":""}>一线城市（资源密集，竞争强）</option>
            <option value="新一线" ${O.city_preference==="新一线"?"selected":""}>新一线（机会与生活成本更平衡）</option>
            <option value="二线城市" ${O.city_preference==="二线城市"?"selected":""}>二线城市（稳定发展）</option>
            <option value="家乡" ${O.city_preference==="家乡"?"selected":""}>回到家乡 / 本省</option>
            <option value="无所谓" ${O.city_preference==="无所谓"?"selected":""}>地点开放</option>
          </select>
        </div>
      </div>
      <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">FLOW_NOTE:</div>
        <p style="font-size:13px;color:var(--secondary);line-height:1.7;">
          你已选择工作阶段，系统会自动跳过 GPA、保研等学生向问题，后续分支会更偏向跳槽、晋升、读研、创业与城市迁移。
        </p>
      </div>
    `:O.education_stage==="high_school"?`
      <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">学业基础</h2>
      <p class="text-secondary mb-24">围绕高考与专业选择补全背景。</p>
      <div class="grid-2 gap-16">
        <div class="form-group">
          <label class="form-label">当前学校</label>
          <input class="form-input" id="field-school" value="${O.school}" placeholder="如：广雅中学" />
        </div>
        <div class="form-group">
          <label class="form-label">意向专业 / 学科方向</label>
          <input class="form-input" id="field-major" value="${O.major}" placeholder="如：计算机 / 金融 / 临床医学" />
        </div>
        <div class="form-group">
          <label class="form-label">当前成绩段</label>
          <select class="form-select" id="field-gpa">
            <option value="">请选择</option>
            <option value="top_10%" ${O.gpa_range==="top_10%"?"selected":""}>年级前 10%</option>
            <option value="top_30%" ${O.gpa_range==="top_30%"?"selected":""}>年级前 30%</option>
            <option value="mid" ${O.gpa_range==="mid"?"selected":""}>中等稳定</option>
            <option value="unstable" ${O.gpa_range==="unstable"?"selected":""}>波动较大</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${O.city_preference==="一线城市"?"selected":""}>一线城市</option>
            <option value="新一线" ${O.city_preference==="新一线"?"selected":""}>新一线</option>
            <option value="省会" ${O.city_preference==="省会"?"selected":""}>省会城市</option>
            <option value="家乡" ${O.city_preference==="家乡"?"selected":""}>留在家乡</option>
            <option value="无所谓" ${O.city_preference==="无所谓"?"selected":""}>无所谓</option>
          </select>
        </div>
      </div>
    `:`
    <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">学业背景</h2>
    <p class="text-secondary mb-24">补充会直接影响学业与职业推演的关键变量。</p>
    <div class="grid-2 gap-16">
      <div class="form-group">
        <label class="form-label">学校名称</label>
        <input class="form-input" id="field-school" value="${O.school}" placeholder="如：中山大学" />
      </div>
      <div class="form-group">
        <label class="form-label">专业方向</label>
        <input class="form-input" id="field-major" value="${O.major}" placeholder="如：计算机科学" />
      </div>
      <div class="form-group">
        <label class="form-label">GPA 区间</label>
        <select class="form-select" id="field-gpa">
          <option value="">请选择</option>
          <option value="3.8+" ${O.gpa_range==="3.8+"?"selected":""}>3.8+（优秀）</option>
          <option value="3.5-3.8" ${O.gpa_range==="3.5-3.8"?"selected":""}>3.5-3.8（良好）</option>
          <option value="3.0-3.5" ${O.gpa_range==="3.0-3.5"?"selected":""}>3.0-3.5（中等）</option>
          <option value="<3.0" ${O.gpa_range==="<3.0"?"selected":""}>3.0 以下</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">城市偏好</label>
        <select class="form-select" id="field-city">
          <option value="">请选择</option>
          <option value="一线城市" ${O.city_preference==="一线城市"?"selected":""}>一线城市（北上广深）</option>
          <option value="新一线" ${O.city_preference==="新一线"?"selected":""}>新一线（杭州、成都、武汉…）</option>
          <option value="二线城市" ${O.city_preference==="二线城市"?"selected":""}>二线城市</option>
          <option value="家乡" ${O.city_preference==="家乡"?"selected":""}>留在家乡</option>
          <option value="无所谓" ${O.city_preference==="无所谓"?"selected":""}>无所谓</option>
        </select>
      </div>
    </div>
  `}function On(){const t=Bn();switch(t.key){case"personality":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">选择最接近你的性格类型</p>
        ${Tt(Ut.personality,"personality_type",O.personality_type)}
      `;case"education":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">你的当前阶段会决定后续问题分支。</p>
        ${Tt(Ut.education,"education_stage",O.education_stage)}
      `;case"background":return Di();case"family":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">家庭约束和支持会显著改变路径分叉。</p>
        <div class="form-group">
          <label class="form-label">家庭经济状况</label>
          ${Tt(["优越","中等","一般","困难"].map(e=>({value:e,label:e})),"family_economy",O.family_economy)}
        </div>
        <div class="form-group mt-24">
          <label class="form-label">家庭期望</label>
          ${Tt((Et()?["稳定发展","尽快晋升","回本省定居","收入优先","自由选择"]:["考公/体制内","留在本省","高薪优先","自由选择","读博深造"]).map(e=>({value:e,label:e})),"family_expectation",O.family_expectation)}
        </div>
      `;case"preference":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">${Et()?"职业路线、转型方式和风险承受度会直接影响回溯分支。":"职业方向与风险偏好会影响后续推演走向。"}</p>
        <div class="form-group">
          <label class="form-label">职业方向偏好</label>
          ${Tt(Ut.career,"career_preference",O.career_preference)}
        </div>
        <div class="form-group mt-24">
          <label class="form-label">风险偏好</label>
          ${Tt(Ut.risk,"risk_preference",O.risk_preference)}
        </div>
      `;case"concern":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">你当前最想推演的问题是什么？</p>
        <div class="form-group">
          <label class="form-label">核心困惑（自由描述）</label>
          <textarea class="form-textarea" id="field-concern" placeholder="${Et()?"例如：我是继续留在当前公司争取管理岗，还是转去更高风险的新赛道？":"例如：我应该保研还是直接就业？如果选择保研，3 年后的发展会比直接工作更好吗？"}">${O.current_concern}</textarea>
        </div>
        <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
          <div class="mono-xs text-accent" style="margin-bottom:8px;">ANALYST_NOTE:</div>
          <p style="font-size:13px;color:var(--secondary);font-style:italic;line-height:1.7;">
            尽量写清楚分歧点、现实约束和你最在意的代价。系统会从这里抽取变量，自动发散影响因素并生成推演树。
          </p>
        </div>
      `;default:return""}}function ne(t){const e=Rn();e[W],t.innerHTML=`
    <div class="onboarding-layout">
      <div class="onboarding-sidebar">
        <div class="mono-xs text-muted" style="margin-bottom:8px;">SYSTEM_ENTITY</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-size:18px;margin-bottom:4px;">[PROFILE_BUILDER]</div>
        <div class="mono-xs flex items-center gap-4"><span class="status-dot status-stable"></span> STEP ${W+1}/${e.length}</div>
        <div class="step-indicator" style="margin-top:24px;" id="step-nav">
          ${e.map((n,i)=>`
            <div class="step-item ${i===W?"active":""} ${i<W?"completed":""}" data-step="${i}">
              [${n.label}]
            </div>
          `).join("")}
        </div>
      </div>
      <div class="onboarding-main">
        <div style="margin-bottom:16px;" class="mono-xs text-muted">BRANCH_ID: ${k.projectId||"N/A"} // STEP ${W+1} OF ${e.length}</div>
        <div id="step-content" class="fade-in">
          ${On()}
        </div>
        <div class="flex justify-between mt-32">
          <button class="btn btn-ghost" id="btn-prev" ${W===0?'disabled style="opacity:0.3"':""}>[PREVIOUS]</button>
          <button class="btn ${W===e.length-1?"btn-accent":"btn-primary"}" id="btn-next">
            ${W===e.length-1?"[SUBMIT_PROFILE]":"[NEXT_STEP]"}
          </button>
        </div>
      </div>
    </div>
  `,Dn(t),t.querySelectorAll(".step-item").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.dataset.step,10);i<=W&&(be(),W=i,ne(t))})}),document.getElementById("btn-prev").addEventListener("click",()=>{W>0&&(be(),W-=1,ne(t))}),document.getElementById("btn-next").addEventListener("click",async()=>{if(be(),W<e.length-1){W+=1,ne(t);return}try{await K.submitProfile(k.projectId,O),W=0,at("parameters")}catch(n){alert("Profile submission failed: "+n.message)}})}function Dn(t){t.querySelectorAll(".radio-card").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.field,i=e.dataset.value;Oi(n,i),document.getElementById("step-content").innerHTML=On(),Dn(t)})})}function be(){var e,n,i,a,s;switch(Bn().key){case"background":O.school=((e=document.getElementById("field-school"))==null?void 0:e.value)||"",O.major=((n=document.getElementById("field-major"))==null?void 0:n.value)||"",O.gpa_range=Et()?"":((i=document.getElementById("field-gpa"))==null?void 0:i.value)||"",O.city_preference=((a=document.getElementById("field-city"))==null?void 0:a.value)||"";break;case"concern":O.current_concern=((s=document.getElementById("field-concern"))==null?void 0:s.value)||"";break}}let st=[{name:"",description:"",priority:"primary",weight:1}];const zi=["primary","secondary","constraint"],ji={primary:"主参数",secondary:"次参数",constraint:"约束条件"};function Ie(t){var e;Array.isArray((e=k.project)==null?void 0:e.parameters)&&k.project.parameters.length>0&&(st=k.project.parameters.map(n=>({name:n.name||"",description:n.description||"",priority:n.priority||"primary",weight:Number.isFinite(n.weight)?n.weight:1}))),t.innerHTML=`
    <div style="padding:48px 64px;max-width:960px;margin:0 auto;">
      <div class="mono-xs text-muted mb-8">PROJECT_ID: ${k.projectId} // PHASE: PARAMETER_DEFINITION</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:48px;">
        <h1 style="font-size:40px;">Define Concern Parameters</h1>
        <p class="text-secondary mt-8" style="font-size:16px;max-width:600px;">
          明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。
        </p>
      </div>

      <div id="params-list">
        ${st.map((n,i)=>Hi(n,i)).join("")}
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
  `,document.getElementById("btn-add-param").addEventListener("click",()=>{st.push({name:"",description:"",priority:"secondary",weight:.7}),Ie(t)}),document.getElementById("rounds-slider").addEventListener("input",n=>{document.getElementById("rounds-value").textContent=n.target.value}),document.getElementById("agent-count-slider").addEventListener("input",n=>{document.getElementById("agent-count-value").textContent=n.target.value}),document.getElementById("btn-back").addEventListener("click",()=>at("onboarding")),document.getElementById("btn-start").addEventListener("click",async()=>{Fi();const n=st.filter(i=>i.name.trim());if(n.length===0){alert("请至少填写一个关注参数");return}try{await K.submitParameters(k.projectId,n),k.project&&(k.project.parameters=n,k.project.status="configured");const i=parseInt(document.getElementById("rounds-slider").value),a=document.getElementById("time-unit").value,s=parseInt(document.getElementById("agent-count-slider").value);k.simConfig={rounds:i,timeUnit:a,agentCount:s},at("simulation")}catch(i){alert("Failed: "+i.message)}}),t.querySelectorAll(".param-remove").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.dataset.index);st.splice(i,1),st.length===0&&st.push({name:"",description:"",priority:"primary",weight:1}),Ie(t)})}),t.querySelectorAll(".priority-select").forEach(n=>{n.addEventListener("change",i=>{const a=parseInt(n.dataset.index);st[a].priority=i.target.value})}),t.querySelectorAll(".param-weight-slider").forEach(n=>{n.addEventListener("input",i=>{const a=parseInt(n.dataset.index),s=parseFloat(i.target.value);st[a].weight=s;const r=t.querySelector(`.param-weight-value[data-index="${a}"]`);r&&(r.textContent=s.toFixed(1))})})}function Hi(t,e){return`
    <div class="param-card">
      <div class="param-priority">
        <select class="form-select priority-select" data-index="${e}" style="font-size:10px;padding:6px;">
          ${zi.map(n=>`
            <option value="${n}" ${t.priority===n?"selected":""}>${ji[n]}</option>
          `).join("")}
        </select>
      </div>
      <div class="param-name" style="flex:1;">
        <input class="form-input param-name-input" data-index="${e}" value="${t.name}" placeholder="如：保研 vs 就业" style="border-bottom-color:var(--accent);" />
      </div>
      <div class="param-weight" style="width:180px;">
        <div class="slider-container">
          <input type="range" class="slider param-weight-slider" data-index="${e}" min="0" max="1" step="0.1" value="${t.weight}" />
          <span class="mono-xs param-weight-value" data-index="${e}">${t.weight.toFixed(1)}</span>
        </div>
      </div>
      <button class="param-remove" data-index="${e}">×</button>
    </div>
  `}function Fi(){document.querySelectorAll(".param-name-input").forEach(t=>{const e=parseInt(t.dataset.index);st[e].name=t.value}),document.querySelectorAll(".param-weight-slider").forEach(t=>{const e=parseInt(t.dataset.index);st[e].weight=parseFloat(t.value)})}let H=[],Ot=[],xt="tree",ie=null;function Gi(){return{type:"add_node",id:"root",parent:null,label:"BASE",round:0,time_label:"起点",node_type:"decision",description:"基础状态已载入，推演树准备开始。",trigger_reason:"系统初始化",state_snapshot:{},state_summary:[]}}function Yi(){H.some(t=>t.id==="root")||(Fn(Gi()),Ye(),qe())}function qi(t){var e,n,i;if(xt=k.simulationTab||"tree",k.simComplete||((e=k.project)==null?void 0:e.status)==="completed"){Ue(t);return}k.project&&(k.project.status="simulating"),t.innerHTML=`
    <div class="sim-layout">
      <!-- Canvas: Dynamic Tree Visualization -->
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${S("sim_viewport")}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${S("sim_tree_title")}: Session-${((n=k.projectId)==null?void 0:n.slice(0,4))||"X"}
          </h1>
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
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${((i=k.projectId)==null?void 0:i.slice(0,4))||"0000"}</div>
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
  `,H=[],Ot=[],Hn(),me(),Lt([]),zn(),Yi(),Xi(t)}function me(){ie&&(ie(),ie=null)}function zn({replay:t=!1}={}){me(),ie=Il(e=>{Fn(e),Ye(),qe()},{replay:t})}function Ye(){const t=H.filter(i=>i.isBranch).length,e=document.getElementById("metric-branches");e&&(e.textContent=t||(H.length?1:"—"));const n=document.getElementById("metric-nodes");n&&(n.textContent=H.length||"—")}function qe(){const t=document.getElementById("tree-summary-panel");if(t){if(H.length===0){t.innerHTML=`
      <div class="console-line">
        <span class="console-ts">[INFO]</span>
        <span style="color:var(--outline);">暂无推演树数据</span>
      </div>
    `;return}t.innerHTML=`
    <div class="console-line" style="border-left:2px solid var(--accent);padding-left:12px;margin-bottom:4px;">
      <span class="console-ts" style="color:var(--accent);">[LIVE]</span>
      <span style="font-weight:700;color:var(--accent);">推演树实时更新中，当前 ${H.length} 个节点</span>
    </div>
    ${H.slice(-20).reverse().map(e=>`
      <div class="console-line" style="cursor:pointer;" data-node-id="${e.id}">
        <span class="console-ts">[R${e.round}]</span>
        <span>${e.isBranch?"🔶":"⚫"} ${e.label||"—"}</span>
      </div>
    `).join("")}
    ${H.length>20?`
      <div class="console-line">
        <span class="console-ts">[...]</span>
        <span style="color:var(--outline);">更早节点 ${H.length-20} 个</span>
      </div>
    `:""}
  `,t.querySelectorAll("[data-node-id]").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.nodeId,i=H.find(a=>a.id===n);i&&Gn(i)})})}}function Ue(t){t.innerHTML=`
    <div class="sim-completed-tabbed">
      <!-- Tab Bar -->
      <div class="sim-tab-bar">
        <button class="sim-tab ${xt==="tree"?"sim-tab-active":""}" data-tab="tree">
          <span class="material-symbols-outlined icon-sm">account_tree</span>
          ${S("sim_tab_tree")||"推演树"}
        </button>
        <button class="sim-tab ${xt==="actions"?"sim-tab-active":""}" data-tab="actions">
          <span class="material-symbols-outlined icon-sm">dashboard</span>
          ${S("sim_tab_actions")||"结果导航"}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="sim-tab-content" id="sim-tab-content"></div>
    </div>
  `,t.querySelectorAll(".sim-tab").forEach(n=>{n.addEventListener("click",()=>{xt=n.dataset.tab,k.simulationTab=xt,Ue(t)})});const e=document.getElementById("sim-tab-content");xt==="tree"?Ui(e):(me(),Vi(e))}async function Ui(t){var e,n,i,a;t.innerHTML=`
    <div class="sim-layout" style="height:calc(100vh - var(--topnav-h) - 56px);">
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${S("sim_viewport")}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${S("sim_tree_title")}: Session-${((e=k.projectId)==null?void 0:e.slice(0,4))||"X"}
          </h1>
          <div class="mono-xs text-accent" style="margin-top:8px;">
            <span class="material-symbols-outlined icon-sm" style="font-size:14px;vertical-align:text-bottom;">check_circle</span>
            ${S("sim_completed_view")||"推演已完成"} · ${S("sim_tree_readonly")||"只读模式"}
          </div>
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
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${((n=k.projectId)==null?void 0:n.slice(0,4))||"0000"}</div>
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
  `,H=[],Ot=[],Hn(),me();try{if(!((i=k.treeEvents)!=null&&i.length)){const r=(await K.getTreeEvents(k.projectId)).events||[];(a=k.treeEvents)!=null&&a.length?r.forEach(an):Lt(r)}zn({replay:!0}),Ye(),qe()}catch(s){document.getElementById("tree-summary-panel").innerHTML=`
      <div class="console-line">
        <span class="console-ts">[ERR]</span>
        <span style="color:var(--error);">加载失败: ${s.message}</span>
      </div>
    `}}function Vi(t){var e;t.innerHTML=`
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
  `,(e=document.getElementById("btn-resim"))==null||e.addEventListener("click",async()=>{k.simComplete=!1,k.project&&(k.project.status="simulating"),xt="tree",k.simulationTab="tree",Lt([]),at("simulation")})}async function Xi(t){const e=k.simConfig||{rounds:12,timeUnit:"quarter",agentCount:8};try{const i=(await K.startSimulation(k.projectId,e.rounds,e.timeUnit,e.agentCount||6)).body.getReader(),a=new TextDecoder;let s="";for(;;){const{done:r,value:o}=await i.read();if(r)break;s+=a.decode(o,{stream:!0});const c=s.split(`

`);s=c.pop()||"";for(const l of c)if(l.startsWith("data: "))try{const d=JSON.parse(l.slice(6));Wi(d,t)}catch{}}}catch(n){jn("ERROR",`Simulation failed: ${n.message}`,!0)}}function Wi(t,e){const{phase:n,progress:i,message:a,round:s,total:r,path_count:o,agent_count:c,engine:l,tree_event:d}=t,b=document.getElementById("progress-fill"),p=document.getElementById("progress-label");b&&p&&i!==void 0&&(b.style.width=`${i}%`,p.style.left=`${i}%`,p.textContent=`${i}%`);const h=document.getElementById("metric-progress");if(h&&i!==void 0&&(h.textContent=`${i}%`),n==="tree_event"&&d){an(d);return}if(a){const y=new Date().toLocaleTimeString("en-US",{hour12:!1});jn(y,a,n==="completed"||n==="branch")}if(n==="branch"){const y=document.getElementById("metric-branches");if(y){const x=parseInt(y.textContent)||1;y.textContent=x+1}}if(n==="simulating"){const y=document.getElementById("metric-round");if(y&&a){const x=a.match(/第 (\d+)/);x&&(y.textContent=x[1])}}const E=document.getElementById("state-label");if(E){if(n==="init")E.textContent="⚡ AI_ENGINE";else if(n==="parameter_expansion")E.textContent="AI_EXPAND";else if(n==="agent_generation")E.textContent="AGENT_GEN";else if(n==="graph_building")E.textContent="GRAPH_BUILD";else if(n==="simulating")E.textContent="SIM_ACTIVE";else if(n==="branch")E.textContent="🌿 BRANCH";else if(n==="generating_paths")E.textContent="PATH_GEN";else if(n==="error"){E.textContent="❌ ERROR";const y=document.getElementById("status-dot");y&&(y.classList.remove("pulse"),y.classList.add("status-error"))}else if(n==="completed"){E.textContent="✅ AI_COMPLETE";const y=document.getElementById("status-dot");y&&(y.classList.remove("pulse"),y.classList.add("status-stable"));const x=document.getElementById("metric-paths");x&&(x.textContent=o||0),k.simComplete=!0,k.project&&(k.project.status="completed"),k.simulationTab="tree",setTimeout(()=>Ue(e),700)}}}function jn(t,e,n=!1){const i=document.getElementById("event-log");if(!i)return;i.querySelectorAll(".console-latest").forEach(s=>s.classList.remove("console-latest"));const a=document.createElement("div");a.className=`console-line ${n?"console-latest":""}`,a.innerHTML=`
    <span class="console-ts">[${t}]</span>
    <span ${n?'style="font-weight:700;color:var(--accent);"':""}>${e}</span>
  `,i.prepend(a)}const Vt={decision:"#0F766E",opportunity:"#2563EB",result:"#334155",cascade:"#7C3AED",risk:"#DC2626",reflection:"#0891B2",branch:"#8B5CF6",default:"#475569"},Se={optimal:"#0F766E",conservative:"#2563EB",risk:"#DC2626",balanced:"#475569",counterfactual:"#8B5CF6"};function Hn(){const t=document.getElementById("tree-svg");if(!t)return;const e=document.getElementById("tree-container"),n=(e==null?void 0:e.clientWidth)||800,i=(e==null?void 0:e.clientHeight)||600;t.setAttribute("viewBox",`0 0 ${n} ${i}`),t.innerHTML=`
    <defs>
      <filter id="tree-glow"><feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g id="tree-edges"></g>
    <g id="tree-nodes"></g>
  `}function Fn(t){t.type==="add_node"?Ji(t):t.type==="branch"&&Ki(t),Qi()}function Ji(t){if(H.find(n=>n.id===t.id))return;let e=t.parent;if(e&&!H.find(n=>n.id===e)){const n=H.find(i=>e.startsWith(i.id)||i.id.startsWith(e));if(n)e=n.id;else{const i=H.find(a=>!a.parent);e=i?i.id:null}}H.push({id:t.id,parent:e,label:t.label||"",round:t.round||0,time_label:t.time_label||"",type:t.node_type||"result",isBranch:!1,tendency:"",description:t.description||"",trigger_reason:t.trigger_reason||"",state_summary:t.state_summary||[],state_snapshot:t.state_snapshot||{},agent_actions:t.agent_actions||[],source_path_id:t.source_path_id||"",source_node_index:t.source_node_index,rawEvent:t})}function Ki(t){var n;if(H.find(i=>i.id===t.id))return;let e=t.parent;if(e&&!H.find(i=>i.id===e)){const i=H.find(a=>e.startsWith(a.id)||a.id.startsWith(e));if(i)e=i.id;else{const a=H.filter(s=>s.round<=(t.round||0)).sort((s,r)=>r.round-s.round);e=a.length>0?a[0].id:((n=H[0])==null?void 0:n.id)||null}}H.push({id:t.id,parent:e,label:t.label||"",round:t.round||0,time_label:t.time_label||"",type:"branch",isBranch:!0,tendency:t.tendency||"balanced",description:t.description||"",trigger_reason:t.trigger_reason||"",state_summary:t.state_summary||[],state_snapshot:t.state_snapshot||{},agent_actions:t.agent_actions||[],source_path_id:t.source_path_id||"",source_node_index:t.source_node_index,rawEvent:t})}function Qi(){const t=document.getElementById("tree-svg");if(!t)return;const e=document.getElementById("tree-container"),n=(e==null?void 0:e.clientWidth)||800,i=(e==null?void 0:e.clientHeight)||600,a={},s={};for(const _ of H)s[_.id]=_,_.parent&&(a[_.parent]=a[_.parent]||[]).push(_);const r=H.filter(_=>!_.parent||!s[_.parent]);if(r.length===0)return;const o=r[0],c=80,l=70,d=140;function b(_){const T=a[_]||[];return T.length===0?1:T.reduce((M,P)=>M+b(P.id),0)}function p(_,T=0){const M=a[_]||[];return M.length===0?T:Math.max(...M.map(P=>p(P.id,T+1)))}const h=p(o.id),E=b(o.id),y=Math.max(n,E*d+80),x=Math.max(i,c+(h+1)*l+60);t.setAttribute("viewBox",`0 0 ${y} ${x}`);function g(_,T,M,P){const I=s[_];if(!I)return;I.x=T+M/2,I.y=c+P*l;const B=a[_]||[];if(B.length===0)return;const j=B.reduce((m,u)=>m+b(u.id),0);let G=T;for(const m of B){const f=b(m.id)/j*M;g(m.id,G,Math.max(f,d),P+1),G+=f}}g(o.id,40,y-80,0);let $=0;for(const _ of r)if(_.id!==o.id){p(_.id);const T=b(_.id),M=Math.max(300,T*d),P=y+$;g(_.id,P,M,0),$+=M+40}Ot=[];for(const _ of H)_.parent&&s[_.parent]&&Ot.push({from:s[_.parent],to:_});const N="http://www.w3.org/2000/svg",v=t.querySelector("#tree-edges"),C=t.querySelector("#tree-nodes");v.innerHTML="",C.innerHTML="";for(const _ of Ot){if(_.from.x===void 0||_.to.x===void 0)continue;const T=document.createElementNS(N,"path"),M=_.from.x,P=_.from.y,I=_.to.x,B=_.to.y,j=(P+B)/2;T.setAttribute("d",`M${M},${P} C${M},${j} ${I},${j} ${I},${B}`),T.setAttribute("stroke",_.to.isBranch?Se[_.to.tendency]||Vt.branch:"#64748B"),T.setAttribute("stroke-width",_.to.isBranch?"2.5":"1.5"),T.setAttribute("fill","none"),T.setAttribute("stroke-opacity","0.6"),_.to.isBranch&&T.setAttribute("stroke-dasharray","6,3"),T.style.opacity="0",T.style.transition="opacity 0.5s",v.appendChild(T),requestAnimationFrame(()=>{T.style.opacity="1"})}for(const _ of H){if(_.x===void 0)continue;const T=document.createElementNS(N,"g");T.setAttribute("data-node-id",_.id),T.style.opacity="0",T.style.transition="opacity 0.4s",T.style.cursor="pointer";const M=_.isBranch?Se[_.tendency]||Vt.branch:Vt[_.type]||Vt.default;if(_.isBranch){const I=document.createElementNS(N,"polygon"),B=14;I.setAttribute("points",`${_.x},${_.y-B} ${_.x+B},${_.y} ${_.x},${_.y+B} ${_.x-B},${_.y}`),I.setAttribute("fill",M),I.setAttribute("filter","url(#tree-glow)"),T.appendChild(I)}else if(_.parent){const I=document.createElementNS(N,"rect");I.setAttribute("x",_.x-50),I.setAttribute("y",_.y-14),I.setAttribute("width",100),I.setAttribute("height",28),I.setAttribute("fill","#F3F3F3"),I.setAttribute("stroke",M),I.setAttribute("stroke-width","1"),T.appendChild(I);const B=document.createElementNS(N,"rect");B.setAttribute("x",_.x-50),B.setAttribute("y",_.y-14),B.setAttribute("width",4),B.setAttribute("height",28),B.setAttribute("fill",M),T.appendChild(B)}else{const I=document.createElementNS(N,"rect");I.setAttribute("x",_.x-45),I.setAttribute("y",_.y-14),I.setAttribute("width",90),I.setAttribute("height",28),I.setAttribute("fill","#000"),T.appendChild(I)}const P=document.createElementNS(N,"text");if(P.setAttribute("x",_.x),P.setAttribute("y",_.y+4),P.setAttribute("text-anchor","middle"),P.setAttribute("fill",_.parent?"#333":"#fff"),P.setAttribute("font-family","Space Grotesk"),P.setAttribute("font-size",_.parent?"9":"10"),P.setAttribute("font-weight",_.isBranch?"bold":"normal"),P.textContent=(_.label||"").slice(0,14),T.appendChild(P),_.time_label&&_.parent){const I=document.createElementNS(N,"text");I.setAttribute("x",_.x),I.setAttribute("y",_.y+24),I.setAttribute("text-anchor","middle"),I.setAttribute("fill","#999"),I.setAttribute("font-family","Space Grotesk"),I.setAttribute("font-size","8"),I.textContent=_.time_label,T.appendChild(I)}T.addEventListener("click",I=>{I.stopPropagation(),Gn(_)}),C.appendChild(T),requestAnimationFrame(()=>{T.style.opacity="1"})}t.onclick=()=>{Yn()}}function Gn(t){var C;const e=document.getElementById("tree-node-tooltip");if(!e)return;const n={decision:"🔴 决策节点",opportunity:"🟢 机会节点",result:"⚫ 结果节点",cascade:"🔵 连锁节点",risk:"🟥 风险节点",reflection:"⬜ 反思节点",branch:"🔶 分支起点"},i={optimal:"最优路径",conservative:"稳健路径",risk:"冒险路径",balanced:"平衡路径",counterfactual:"反事实路径"},a=t.state_summary||[],s=t.agent_actions||[],r=document.getElementById("tree-container"),o=document.getElementById("tree-svg");if(!r||!o||t.x===void 0)return;const c=r.getBoundingClientRect(),l=o.getBoundingClientRect(),d=o.getAttribute("viewBox");if(!d)return;const[b,p,h,E]=d.split(" ").map(Number),y=l.width/h,x=l.height/E;let g=(t.x-b)*y+(l.left-c.left)+16,$=(t.y-p)*x+(l.top-c.top)-10;const N=360,v=320;g+N>c.width&&(g=g-N-32),$+v>c.height&&($=c.height-v-10),g<0&&(g=10),$<0&&($=10),e.style.left=`${g}px`,e.style.top=`${$}px`,e.style.display="block",e.innerHTML=`
    <div class="tree-tooltip-header">
      <span>${n[t.type]||t.type}</span>
      <button class="tree-tooltip-close" id="tooltip-close">✕</button>
    </div>
    <div class="tree-tooltip-title">${t.label||"—"}</div>
    ${t.time_label?`<div class="tree-tooltip-time">${t.time_label} · Round ${t.round}</div>`:""}
    ${t.isBranch&&t.tendency?`<div class="tree-tooltip-tendency" style="color:${Se[t.tendency]||"#666"};">${i[t.tendency]||t.tendency}</div>`:""}
    ${t.description?`<div class="tree-tooltip-block"><div class="tree-tooltip-label">事件说明</div><p>${t.description}</p></div>`:""}
    ${t.trigger_reason?`<div class="tree-tooltip-block"><div class="tree-tooltip-label">触发原因</div><p>${t.trigger_reason}</p></div>`:""}
    ${s.length>0?`
      <div class="tree-tooltip-block">
        <div class="tree-tooltip-label">多 Agent 动作</div>
        <div class="tree-tooltip-list">
          ${s.map(_=>`
            <div class="tree-tooltip-item">
              <div class="tree-tooltip-item-title">${_.agent_type||"Agent"} · ${(_.action_type||"ACTION").replaceAll("_"," ")}</div>
              <div class="tree-tooltip-item-text">${_.narrative||"已执行动作。"}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}
    ${a.length>0?`
      <div class="tree-tooltip-block">
        <div class="tree-tooltip-label">状态摘要</div>
        <div class="tree-tooltip-metrics">
          ${a.map(_=>`<span>${_.label}: ${_.percent}%</span>`).join("")}
        </div>
      </div>
    `:""}
  `,(C=document.getElementById("tooltip-close"))==null||C.addEventListener("click",_=>{_.stopPropagation(),Yn()})}function Yn(){const t=document.getElementById("tree-node-tooltip");t&&(t.style.display="none")}const Ae={decision:"var(--accent)",opportunity:"#7C3AED",result:"#0F766E",cascade:"#475569",risk:"var(--error)",reflection:"#2563EB",branch:"#8B5CF6"};function Zi(t){return(t||"").replace(/[（(][^）)]*[）)]/g,"").trim()||"综合报告"}function Ne(t){const e=t.type==="branch"?"◇":"•",n=t.round!==void 0?`R${t.round}`:"--",i=[t.time_label,t.node_type].filter(Boolean).join(" · ");return`
    <div class="console-line" style="padding:8px 0;border-bottom:1px solid rgba(198,198,198,0.12);">
      <span class="console-ts">[${n}]</span>
      <span>${e} ${t.label||"未命名节点"}${i?` <span class="text-muted">/ ${i}</span>`:""}</span>
    </div>
  `}function ta(t,e){if(!t||!(e!=null&&e.id)||t.querySelector(`[data-event-id="${e.id}"]`))return;const n=document.createElement("div");n.dataset.eventId=e.id,n.innerHTML=Ne(e),t.prepend(n)}function ea(t=[]){return k.selectedPathId&&t.find(e=>e.id===k.selectedPathId)||null}function ct(t,e={}){Object.assign(k,{resultsView:t,...e})}async function dt(t){let e=[];try{e=(await K.getPaths(k.projectId)).paths||[]}catch(a){t.innerHTML=`<div class="p-48 text-center"><h1>${S("error_loading")}</h1><p>${a.message}</p></div>`;return}const n=k.resultsView||"overview",i=ea(e);n==="overview"?ln(t,e):n==="detail"&&i?aa(t,i):n==="advice"&&i?oa(t,i):n==="report"?Un(t):n==="backtrack"&&i?qn(t,i):(ct("overview",{selectedPathId:null,backtrackNodeIndex:null}),ln(t,e))}function ln(t,e){var i;const n=S("results_desc").replace("{count}",e.length);t.innerHTML=`
    <div class="results-header">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end">
        <div>
          <h1 style="font-size:48px;">${S("results_title")}</h1>
          <p class="text-secondary mt-8" style="max-width:600px;">${n}</p>
        </div>
        <div class="text-right">
          <div class="mono-xs text-muted">PROJECT: ${k.projectId}</div>
          <div class="mono-xs text-muted">${S("results_status")}</div>
        </div>
      </div>
    </div>
    <div class="results-body">
      ${e.map(a=>na(a)).join("")}
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
  `,t.querySelectorAll(".path-card").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.pathId;ct("detail",{selectedPathId:s,backtrackNodeIndex:null}),dt(t)})}),(i=document.getElementById("btn-report"))==null||i.addEventListener("click",()=>{ct("report",{backtrackNodeIndex:null}),dt(t)})}function na(t){var a;const e={low:"#2E7D32",medium:"#FF8F00",high:"var(--error)"},n=Math.round(t.satisfaction_score*100),i=t.path_type==="counterfactual";return`
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
        ${ia(t.final_state)}
      </div>
    </div>
  `}function ia(t){return t?["education","career","finance","health"].map(n=>`
    <div class="path-stat">
      <div class="path-stat-value">${Math.round((t[n]||0)*100)}%</div>
      <div class="path-stat-label">${Ge(n)}</div>
    </div>
  `).join(""):""}function aa(t,e){const n=e.nodes||[],i=n[0];t.innerHTML=`
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
          ${n.map((a,s)=>`
            <div class="node-card ${s===0?"active":""}" data-index="${s}">
              <div class="node-type" style="color:${Ae[a.node_type]||"var(--outline)"};">${a.node_type}</div>
              <div class="node-title">${a.title}</div>
              <div class="node-time">${a.time_label}</div>
            </div>
          `).join("")}
        </div>
        <div class="mt-24" style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-accent btn-full" id="btn-advice">[${S("btn_get_advice")}]</button>
          <button class="btn btn-primary btn-full" id="btn-backtrack" style="background:var(--branch-accent);">
            <span class="material-symbols-outlined icon-sm">undo</span> [回溯推演]
          </button>
        </div>
      </div>

      <!-- Main: Node Detail + State Chart -->
      <div class="detail-main" id="node-detail-container">
        ${i?cn(i,0,n.length):'<p class="p-32 text-muted">No nodes</p>'}
      </div>
    </div>
  `,document.getElementById("btn-back-overview").addEventListener("click",()=>{ct("overview",{selectedPathId:null,backtrackNodeIndex:null}),dt(t)}),t.querySelectorAll(".node-card").forEach(a=>{a.addEventListener("click",()=>{t.querySelectorAll(".node-card").forEach(r=>r.classList.remove("active")),a.classList.add("active");const s=parseInt(a.dataset.index);document.getElementById("node-detail-container").innerHTML=cn(n[s],s,n.length)})}),document.getElementById("btn-advice").addEventListener("click",()=>{ct("advice"),dt(t)}),document.getElementById("btn-backtrack").addEventListener("click",()=>{ct("backtrack",{backtrackNodeIndex:0}),dt(t)})}function cn(t,e,n){const i=t.state_snapshot||{},a=t.agent_actions||[];return`
    <div class="fade-in">
      <div class="mono-xs text-muted mb-8">NODE ${e+1} OF ${n} // ${t.time_label}</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:32px;">
        <h1 style="font-size:32px;">${t.title}</h1>
        <div class="flex items-center gap-8 mt-8">
          <span class="tag" style="background:${Ae[t.node_type]||"var(--outline)"};color:var(--white);">${t.node_type.toUpperCase()}</span>
          <span class="mono-xs">${t.time_label}</span>
        </div>
      </div>

      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">${S("detail_description")}</h3>
        <p style="font-size:14px;line-height:1.7;color:var(--secondary);">${t.description}</p>
      </div>

      ${a.length>0?`
      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">推演细节</h3>
        ${a.map(s=>`
          <div style="padding:10px 12px;border-left:2px solid ${Ae[t.node_type]||"var(--accent)"};margin-bottom:10px;background:var(--surface-low);">
            <div class="mono-xs" style="margin-bottom:6px;">[${s.agent_type||"AGENT"}] ${(s.action_type||"ACTION").replaceAll("_"," ")}</div>
            <p style="font-size:13px;color:var(--secondary);line-height:1.6;">${s.narrative||"该轮行动已记录。"}</p>
          </div>
        `).join("")}
      </div>
      `:""}

      ${t.trigger_reason?`
      <div class="card mb-24" style="border-left:2px solid var(--accent);">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">${S("detail_trigger")}:</div>
        <p style="font-size:14px;color:var(--secondary);">${t.trigger_reason}</p>
      </div>
      `:""}

      <div class="card mb-24">
        <h3 style="margin-bottom:16px;">${S("detail_state_snapshot")}</h3>
        ${Pn.map(s=>{const r=i[s]||0,o=Math.round(r*100),c=o>70?"#2E7D32":o>40?"#FF8F00":"var(--error)";return`
            <div class="state-bar-container">
              <div class="state-bar-label">
                <span>${Ge(s)}</span>
                <span style="color:${c}">${o}%</span>
              </div>
              <div class="state-bar">
                <div class="state-bar-fill" style="width:${o}%;background:${c};"></div>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function qn(t,e){var s,r,o;const n=e.nodes||[],i=k.backtrackNodeIndex,a=i===null?null:n[i];t.innerHTML=`
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
            ${sa(a||n[0])}
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
            ${a?Ne({type:"source",round:i+1,time_label:a.time_label,node_type:a.node_type,label:`源节点: ${a.title}`}):'<div class="console-line"><span class="console-ts">[--]</span><span>等待选择节点...</span></div>'}
          </div>
          <div id="bt-result-actions" class="mt-16" style="display:none;"></div>
        </div>
      </div>
    </div>
  `,(s=document.getElementById("btn-back-from-bt"))==null||s.addEventListener("click",()=>{ct("detail",{backtrackNodeIndex:null}),dt(t)}),t.querySelectorAll(".bt-node-card").forEach(c=>{c.addEventListener("click",()=>{k.backtrackNodeIndex=parseInt(c.dataset.index,10),qn(t,e)})}),(r=document.getElementById("bt-rounds"))==null||r.addEventListener("input",c=>{document.getElementById("bt-rounds-value").textContent=c.target.value}),(o=document.getElementById("btn-run-backtrack"))==null||o.addEventListener("click",async()=>{var g,$,N,v,C;if(i===null)return;const c=((g=document.getElementById("bt-description"))==null?void 0:g.value)||"",l=parseInt((($=document.getElementById("bt-rounds"))==null?void 0:$.value)||"6",10),d=document.getElementById("btn-run-backtrack"),b=document.getElementById("bt-progress"),p=document.getElementById("bt-status"),h=document.getElementById("bt-progress-fill"),E=document.getElementById("bt-tree-live"),y=document.getElementById("bt-result-actions"),x={};document.querySelectorAll(".bt-state-slider").forEach(_=>{x[_.dataset.key]=parseFloat(_.value)}),b&&(b.style.display="block"),d&&(d.disabled=!0,d.style.opacity="0.5"),E&&(E.innerHTML=a?Ne({type:"source",round:i+1,time_label:a.time_label,node_type:a.node_type,label:`源节点: ${a.title}`}):""),y&&(y.style.display="none");try{if(!((N=k.treeEvents)!=null&&N.length)){const B=await K.getTreeEvents(k.projectId);Lt(B.events||[])}const T=(await K.backtrack(k.projectId,e.id,i,x,c,l)).body.getReader(),M=new TextDecoder;let P="",I=null;for(;;){const{done:B,value:j}=await T.read();if(B)break;P+=M.decode(j,{stream:!0});const G=P.split(`

`);P=G.pop()||"";for(const m of G)if(m.startsWith("data: "))try{const u=JSON.parse(m.slice(6));p!=null&&p.isConnected&&u.message&&(p.innerHTML=`<span class="console-ts">[BT]</span><span>${u.message}</span>`),h!=null&&h.isConnected&&u.progress!==void 0&&(h.style.width=`${u.progress}%`),u.phase==="tree_event"&&u.tree_event&&(an(u.tree_event),ta(E,u.tree_event)),u.phase==="completed"&&(I=u.new_path_id||null,k.simComplete=!0,k.simulationTab="tree",k.project&&(k.project.status="completed"),p!=null&&p.isConnected&&(p.innerHTML=`<span class="console-ts" style="color:var(--accent);">[DONE]</span><span style="font-weight:700;color:var(--accent);">${u.message}</span>`,p.classList.remove("pulse")),y&&(y.style.display="flex",y.style.gap="8px",y.style.flexWrap="wrap",y.innerHTML=`
                  <button class="btn btn-primary" id="bt-open-tree">查看推演树</button>
                  <button class="btn btn-accent" id="bt-open-path" ${I?"":'disabled style="opacity:0.5;"'}>查看新路径</button>
                `,(v=document.getElementById("bt-open-tree"))==null||v.addEventListener("click",()=>{at("simulation",{simulationTab:"tree"})}),(C=document.getElementById("bt-open-path"))==null||C.addEventListener("click",()=>{I&&(ct("detail",{selectedPathId:I,backtrackNodeIndex:null}),dt(t))}))),u.phase==="error"&&(p!=null&&p.isConnected)&&(p.innerHTML=`<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">${u.message}</span>`,p.classList.remove("pulse"))}catch{}}}catch(_){p&&(p.innerHTML=`<span class="console-ts" style="color:var(--error);">[ERR]</span><span style="color:var(--error);">回溯推演失败: ${_.message}</span>`,p.classList.remove("pulse"))}finally{d&&(d.disabled=!1,d.style.opacity="1")}})}function sa(t){const e=(t==null?void 0:t.state_snapshot)||{};return Pn.map(n=>{const i=e[n]||.5,a=Math.round(i*100);return`
      <div class="bt-state-row">
        <span class="bt-state-label">${Ge(n)}</span>
        <input type="range" class="slider bt-state-slider" data-key="${n}" min="0" max="1" step="0.05" value="${i}" />
        <span class="bt-state-val mono-xs">${a}%</span>
      </div>
    `}).join("")}async function Un(t,e){var n,i;t.innerHTML=`
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
  `,(n=document.getElementById("btn-back-from-report"))==null||n.addEventListener("click",()=>{ct("overview"),dt(t)});try{const a=await K.getReport(k.projectId);ra(a)}catch(a){document.getElementById("report-content").innerHTML=`
      <div class="p-32 text-center text-error">
        <p>报告生成失败: ${a.message}</p>
        <button class="btn btn-ghost mt-16" id="btn-retry-report">[RETRY]</button>
      </div>
    `,(i=document.getElementById("btn-retry-report"))==null||i.addEventListener("click",()=>{Un(t)})}}function ra(t){const e=document.getElementById("report-content");if(!e)return;const n=t.path_comparison||[],i=t.critical_nodes||[],a=t.next_steps||[];e.innerHTML=`
    <div class="fade-in">
      <!-- Executive Summary -->
      <div class="card mb-24" style="border-left:4px solid var(--accent);padding:32px;">
        <h2 style="margin-bottom:16px;line-height:1.3;word-break:break-word;">${Zi(t.title)}</h2>
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
  `}async function oa(t,e){t.innerHTML=`
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
  `,document.getElementById("btn-back-detail").addEventListener("click",()=>{ct("detail"),dt(t)}),document.getElementById("btn-satisfied").addEventListener("click",()=>dn(t,"satisfied")),document.getElementById("btn-unsatisfied").addEventListener("click",()=>dn(t,"unsatisfied"))}async function dn(t,e){const n=document.getElementById("advice-content");n.innerHTML=`<div class="p-32 text-center mono-xs pulse">${S("advice_generating")}</div>`;try{const i=await K.getAdvice(k.projectId,k.selectedPathId,e);e==="satisfied"?n.innerHTML=`
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
      `}catch(i){n.innerHTML=`<div class="p-32 text-center text-error">Error: ${i.message}</div>`}}var la={value:()=>{}};function Gt(){for(var t=0,e=arguments.length,n={},i;t<e;++t){if(!(i=arguments[t]+"")||i in n||/[\s.]/.test(i))throw new Error("illegal type: "+i);n[i]=[]}return new ae(n)}function ae(t){this._=t}function ca(t,e){return t.trim().split(/^|\s+/).map(function(n){var i="",a=n.indexOf(".");if(a>=0&&(i=n.slice(a+1),n=n.slice(0,a)),n&&!e.hasOwnProperty(n))throw new Error("unknown type: "+n);return{type:n,name:i}})}ae.prototype=Gt.prototype={constructor:ae,on:function(t,e){var n=this._,i=ca(t+"",n),a,s=-1,r=i.length;if(arguments.length<2){for(;++s<r;)if((a=(t=i[s]).type)&&(a=da(n[a],t.name)))return a;return}if(e!=null&&typeof e!="function")throw new Error("invalid callback: "+e);for(;++s<r;)if(a=(t=i[s]).type)n[a]=un(n[a],t.name,e);else if(e==null)for(a in n)n[a]=un(n[a],t.name,null);return this},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new ae(t)},call:function(t,e){if((a=arguments.length-2)>0)for(var n=new Array(a),i=0,a,s;i<a;++i)n[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(s=this._[t],i=0,a=s.length;i<a;++i)s[i].value.apply(e,n)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var i=this._[t],a=0,s=i.length;a<s;++a)i[a].value.apply(e,n)}};function da(t,e){for(var n=0,i=t.length,a;n<i;++n)if((a=t[n]).name===e)return a.value}function un(t,e,n){for(var i=0,a=t.length;i<a;++i)if(t[i].name===e){t[i]=la,t=t.slice(0,i).concat(t.slice(i+1));break}return n!=null&&t.push({name:e,value:n}),t}var Ce="http://www.w3.org/1999/xhtml";const fn={svg:"http://www.w3.org/2000/svg",xhtml:Ce,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function ge(t){var e=t+="",n=e.indexOf(":");return n>=0&&(e=t.slice(0,n))!=="xmlns"&&(t=t.slice(n+1)),fn.hasOwnProperty(e)?{space:fn[e],local:t}:t}function ua(t){return function(){var e=this.ownerDocument,n=this.namespaceURI;return n===Ce&&e.documentElement.namespaceURI===Ce?e.createElement(t):e.createElementNS(n,t)}}function fa(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function Vn(t){var e=ge(t);return(e.local?fa:ua)(e)}function pa(){}function Ve(t){return t==null?pa:function(){return this.querySelector(t)}}function ha(t){typeof t!="function"&&(t=Ve(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=new Array(r),c,l,d=0;d<r;++d)(c=s[d])&&(l=t.call(c,c.__data__,d,s))&&("__data__"in c&&(l.__data__=c.__data__),o[d]=l);return new it(i,this._parents)}function ma(t){return t==null?[]:Array.isArray(t)?t:Array.from(t)}function ga(){return[]}function Xn(t){return t==null?ga:function(){return this.querySelectorAll(t)}}function va(t){return function(){return ma(t.apply(this,arguments))}}function ya(t){typeof t=="function"?t=va(t):t=Xn(t);for(var e=this._groups,n=e.length,i=[],a=[],s=0;s<n;++s)for(var r=e[s],o=r.length,c,l=0;l<o;++l)(c=r[l])&&(i.push(t.call(c,c.__data__,l,r)),a.push(c));return new it(i,a)}function Wn(t){return function(){return this.matches(t)}}function Jn(t){return function(e){return e.matches(t)}}var _a=Array.prototype.find;function ba(t){return function(){return _a.call(this.children,t)}}function xa(){return this.firstElementChild}function wa(t){return this.select(t==null?xa:ba(typeof t=="function"?t:Jn(t)))}var Ea=Array.prototype.filter;function $a(){return Array.from(this.children)}function ka(t){return function(){return Ea.call(this.children,t)}}function Ta(t){return this.selectAll(t==null?$a:ka(typeof t=="function"?t:Jn(t)))}function Ia(t){typeof t!="function"&&(t=Wn(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=[],c,l=0;l<r;++l)(c=s[l])&&t.call(c,c.__data__,l,s)&&o.push(c);return new it(i,this._parents)}function Kn(t){return new Array(t.length)}function Sa(){return new it(this._enter||this._groups.map(Kn),this._parents)}function le(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}le.prototype={constructor:le,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};function Aa(t){return function(){return t}}function Na(t,e,n,i,a,s){for(var r=0,o,c=e.length,l=s.length;r<l;++r)(o=e[r])?(o.__data__=s[r],i[r]=o):n[r]=new le(t,s[r]);for(;r<c;++r)(o=e[r])&&(a[r]=o)}function Ca(t,e,n,i,a,s,r){var o,c,l=new Map,d=e.length,b=s.length,p=new Array(d),h;for(o=0;o<d;++o)(c=e[o])&&(p[o]=h=r.call(c,c.__data__,o,e)+"",l.has(h)?a[o]=c:l.set(h,c));for(o=0;o<b;++o)h=r.call(t,s[o],o,s)+"",(c=l.get(h))?(i[o]=c,c.__data__=s[o],l.delete(h)):n[o]=new le(t,s[o]);for(o=0;o<d;++o)(c=e[o])&&l.get(p[o])===c&&(a[o]=c)}function La(t){return t.__data__}function Ma(t,e){if(!arguments.length)return Array.from(this,La);var n=e?Ca:Na,i=this._parents,a=this._groups;typeof t!="function"&&(t=Aa(t));for(var s=a.length,r=new Array(s),o=new Array(s),c=new Array(s),l=0;l<s;++l){var d=i[l],b=a[l],p=b.length,h=Pa(t.call(d,d&&d.__data__,l,i)),E=h.length,y=o[l]=new Array(E),x=r[l]=new Array(E),g=c[l]=new Array(p);n(d,b,y,x,g,h,e);for(var $=0,N=0,v,C;$<E;++$)if(v=y[$]){for($>=N&&(N=$+1);!(C=x[N])&&++N<E;);v._next=C||null}}return r=new it(r,i),r._enter=o,r._exit=c,r}function Pa(t){return typeof t=="object"&&"length"in t?t:Array.from(t)}function Ra(){return new it(this._exit||this._groups.map(Kn),this._parents)}function Ba(t,e,n){var i=this.enter(),a=this,s=this.exit();return typeof t=="function"?(i=t(i),i&&(i=i.selection())):i=i.append(t+""),e!=null&&(a=e(a),a&&(a=a.selection())),n==null?s.remove():n(s),i&&a?i.merge(a).order():a}function Oa(t){for(var e=t.selection?t.selection():t,n=this._groups,i=e._groups,a=n.length,s=i.length,r=Math.min(a,s),o=new Array(a),c=0;c<r;++c)for(var l=n[c],d=i[c],b=l.length,p=o[c]=new Array(b),h,E=0;E<b;++E)(h=l[E]||d[E])&&(p[E]=h);for(;c<a;++c)o[c]=n[c];return new it(o,this._parents)}function Da(){for(var t=this._groups,e=-1,n=t.length;++e<n;)for(var i=t[e],a=i.length-1,s=i[a],r;--a>=0;)(r=i[a])&&(s&&r.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(r,s),s=r);return this}function za(t){t||(t=ja);function e(b,p){return b&&p?t(b.__data__,p.__data__):!b-!p}for(var n=this._groups,i=n.length,a=new Array(i),s=0;s<i;++s){for(var r=n[s],o=r.length,c=a[s]=new Array(o),l,d=0;d<o;++d)(l=r[d])&&(c[d]=l);c.sort(e)}return new it(a,this._parents).order()}function ja(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function Ha(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this}function Fa(){return Array.from(this)}function Ga(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var i=t[e],a=0,s=i.length;a<s;++a){var r=i[a];if(r)return r}return null}function Ya(){let t=0;for(const e of this)++t;return t}function qa(){return!this.node()}function Ua(t){for(var e=this._groups,n=0,i=e.length;n<i;++n)for(var a=e[n],s=0,r=a.length,o;s<r;++s)(o=a[s])&&t.call(o,o.__data__,s,a);return this}function Va(t){return function(){this.removeAttribute(t)}}function Xa(t){return function(){this.removeAttributeNS(t.space,t.local)}}function Wa(t,e){return function(){this.setAttribute(t,e)}}function Ja(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function Ka(t,e){return function(){var n=e.apply(this,arguments);n==null?this.removeAttribute(t):this.setAttribute(t,n)}}function Qa(t,e){return function(){var n=e.apply(this,arguments);n==null?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n)}}function Za(t,e){var n=ge(t);if(arguments.length<2){var i=this.node();return n.local?i.getAttributeNS(n.space,n.local):i.getAttribute(n)}return this.each((e==null?n.local?Xa:Va:typeof e=="function"?n.local?Qa:Ka:n.local?Ja:Wa)(n,e))}function Qn(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function ts(t){return function(){this.style.removeProperty(t)}}function es(t,e,n){return function(){this.style.setProperty(t,e,n)}}function ns(t,e,n){return function(){var i=e.apply(this,arguments);i==null?this.style.removeProperty(t):this.style.setProperty(t,i,n)}}function is(t,e,n){return arguments.length>1?this.each((e==null?ts:typeof e=="function"?ns:es)(t,e,n??"")):Nt(this.node(),t)}function Nt(t,e){return t.style.getPropertyValue(e)||Qn(t).getComputedStyle(t,null).getPropertyValue(e)}function as(t){return function(){delete this[t]}}function ss(t,e){return function(){this[t]=e}}function rs(t,e){return function(){var n=e.apply(this,arguments);n==null?delete this[t]:this[t]=n}}function os(t,e){return arguments.length>1?this.each((e==null?as:typeof e=="function"?rs:ss)(t,e)):this.node()[t]}function Zn(t){return t.trim().split(/^|\s+/)}function Xe(t){return t.classList||new ti(t)}function ti(t){this._node=t,this._names=Zn(t.getAttribute("class")||"")}ti.prototype={add:function(t){var e=this._names.indexOf(t);e<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};function ei(t,e){for(var n=Xe(t),i=-1,a=e.length;++i<a;)n.add(e[i])}function ni(t,e){for(var n=Xe(t),i=-1,a=e.length;++i<a;)n.remove(e[i])}function ls(t){return function(){ei(this,t)}}function cs(t){return function(){ni(this,t)}}function ds(t,e){return function(){(e.apply(this,arguments)?ei:ni)(this,t)}}function us(t,e){var n=Zn(t+"");if(arguments.length<2){for(var i=Xe(this.node()),a=-1,s=n.length;++a<s;)if(!i.contains(n[a]))return!1;return!0}return this.each((typeof e=="function"?ds:e?ls:cs)(n,e))}function fs(){this.textContent=""}function ps(t){return function(){this.textContent=t}}function hs(t){return function(){var e=t.apply(this,arguments);this.textContent=e??""}}function ms(t){return arguments.length?this.each(t==null?fs:(typeof t=="function"?hs:ps)(t)):this.node().textContent}function gs(){this.innerHTML=""}function vs(t){return function(){this.innerHTML=t}}function ys(t){return function(){var e=t.apply(this,arguments);this.innerHTML=e??""}}function _s(t){return arguments.length?this.each(t==null?gs:(typeof t=="function"?ys:vs)(t)):this.node().innerHTML}function bs(){this.nextSibling&&this.parentNode.appendChild(this)}function xs(){return this.each(bs)}function ws(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function Es(){return this.each(ws)}function $s(t){var e=typeof t=="function"?t:Vn(t);return this.select(function(){return this.appendChild(e.apply(this,arguments))})}function ks(){return null}function Ts(t,e){var n=typeof t=="function"?t:Vn(t),i=e==null?ks:typeof e=="function"?e:Ve(e);return this.select(function(){return this.insertBefore(n.apply(this,arguments),i.apply(this,arguments)||null)})}function Is(){var t=this.parentNode;t&&t.removeChild(this)}function Ss(){return this.each(Is)}function As(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Ns(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Cs(t){return this.select(t?Ns:As)}function Ls(t){return arguments.length?this.property("__data__",t):this.node().__data__}function Ms(t){return function(e){t.call(this,e,this.__data__)}}function Ps(t){return t.trim().split(/^|\s+/).map(function(e){var n="",i=e.indexOf(".");return i>=0&&(n=e.slice(i+1),e=e.slice(0,i)),{type:e,name:n}})}function Rs(t){return function(){var e=this.__on;if(e){for(var n=0,i=-1,a=e.length,s;n<a;++n)s=e[n],(!t.type||s.type===t.type)&&s.name===t.name?this.removeEventListener(s.type,s.listener,s.options):e[++i]=s;++i?e.length=i:delete this.__on}}}function Bs(t,e,n){return function(){var i=this.__on,a,s=Ms(e);if(i){for(var r=0,o=i.length;r<o;++r)if((a=i[r]).type===t.type&&a.name===t.name){this.removeEventListener(a.type,a.listener,a.options),this.addEventListener(a.type,a.listener=s,a.options=n),a.value=e;return}}this.addEventListener(t.type,s,n),a={type:t.type,name:t.name,value:e,listener:s,options:n},i?i.push(a):this.__on=[a]}}function Os(t,e,n){var i=Ps(t+""),a,s=i.length,r;if(arguments.length<2){var o=this.node().__on;if(o){for(var c=0,l=o.length,d;c<l;++c)for(a=0,d=o[c];a<s;++a)if((r=i[a]).type===d.type&&r.name===d.name)return d.value}return}for(o=e?Bs:Rs,a=0;a<s;++a)this.each(o(i[a],e,n));return this}function ii(t,e,n){var i=Qn(t),a=i.CustomEvent;typeof a=="function"?a=new a(e,n):(a=i.document.createEvent("Event"),n?(a.initEvent(e,n.bubbles,n.cancelable),a.detail=n.detail):a.initEvent(e,!1,!1)),t.dispatchEvent(a)}function Ds(t,e){return function(){return ii(this,t,e)}}function zs(t,e){return function(){return ii(this,t,e.apply(this,arguments))}}function js(t,e){return this.each((typeof e=="function"?zs:Ds)(t,e))}function*Hs(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var i=t[e],a=0,s=i.length,r;a<s;++a)(r=i[a])&&(yield r)}var ai=[null];function it(t,e){this._groups=t,this._parents=e}function Yt(){return new it([[document.documentElement]],ai)}function Fs(){return this}it.prototype=Yt.prototype={constructor:it,select:ha,selectAll:ya,selectChild:wa,selectChildren:Ta,filter:Ia,data:Ma,enter:Sa,exit:Ra,join:Ba,merge:Oa,selection:Fs,order:Da,sort:za,call:Ha,nodes:Fa,node:Ga,size:Ya,empty:qa,each:Ua,attr:Za,style:is,property:os,classed:us,text:ms,html:_s,raise:xs,lower:Es,append:$s,insert:Ts,remove:Ss,clone:Cs,datum:Ls,on:Os,dispatch:js,[Symbol.iterator]:Hs};function J(t){return typeof t=="string"?new it([[document.querySelector(t)]],[document.documentElement]):new it([[t]],ai)}function Gs(t){let e;for(;e=t.sourceEvent;)t=e;return t}function ht(t,e){if(t=Gs(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var i=n.createSVGPoint();return i.x=t.clientX,i.y=t.clientY,i=i.matrixTransform(e.getScreenCTM().inverse()),[i.x,i.y]}if(e.getBoundingClientRect){var a=e.getBoundingClientRect();return[t.clientX-a.left-e.clientLeft,t.clientY-a.top-e.clientTop]}}return[t.pageX,t.pageY]}const Ys={passive:!1},Dt={capture:!0,passive:!1};function xe(t){t.stopImmediatePropagation()}function St(t){t.preventDefault(),t.stopImmediatePropagation()}function si(t){var e=t.document.documentElement,n=J(t).on("dragstart.drag",St,Dt);"onselectstart"in e?n.on("selectstart.drag",St,Dt):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function ri(t,e){var n=t.document.documentElement,i=J(t).on("dragstart.drag",null);e&&(i.on("click.drag",St,Dt),setTimeout(function(){i.on("click.drag",null)},0)),"onselectstart"in n?i.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}const Xt=t=>()=>t;function Le(t,{sourceEvent:e,subject:n,target:i,identifier:a,active:s,x:r,y:o,dx:c,dy:l,dispatch:d}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},subject:{value:n,enumerable:!0,configurable:!0},target:{value:i,enumerable:!0,configurable:!0},identifier:{value:a,enumerable:!0,configurable:!0},active:{value:s,enumerable:!0,configurable:!0},x:{value:r,enumerable:!0,configurable:!0},y:{value:o,enumerable:!0,configurable:!0},dx:{value:c,enumerable:!0,configurable:!0},dy:{value:l,enumerable:!0,configurable:!0},_:{value:d}})}Le.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};function qs(t){return!t.ctrlKey&&!t.button}function Us(){return this.parentNode}function Vs(t,e){return e??{x:t.x,y:t.y}}function Xs(){return navigator.maxTouchPoints||"ontouchstart"in this}function Ws(){var t=qs,e=Us,n=Vs,i=Xs,a={},s=Gt("start","drag","end"),r=0,o,c,l,d,b=0;function p(v){v.on("mousedown.drag",h).filter(i).on("touchstart.drag",x).on("touchmove.drag",g,Ys).on("touchend.drag touchcancel.drag",$).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function h(v,C){if(!(d||!t.call(this,v,C))){var _=N(this,e.call(this,v,C),v,C,"mouse");_&&(J(v.view).on("mousemove.drag",E,Dt).on("mouseup.drag",y,Dt),si(v.view),xe(v),l=!1,o=v.clientX,c=v.clientY,_("start",v))}}function E(v){if(St(v),!l){var C=v.clientX-o,_=v.clientY-c;l=C*C+_*_>b}a.mouse("drag",v)}function y(v){J(v.view).on("mousemove.drag mouseup.drag",null),ri(v.view,l),St(v),a.mouse("end",v)}function x(v,C){if(t.call(this,v,C)){var _=v.changedTouches,T=e.call(this,v,C),M=_.length,P,I;for(P=0;P<M;++P)(I=N(this,T,v,C,_[P].identifier,_[P]))&&(xe(v),I("start",v,_[P]))}}function g(v){var C=v.changedTouches,_=C.length,T,M;for(T=0;T<_;++T)(M=a[C[T].identifier])&&(St(v),M("drag",v,C[T]))}function $(v){var C=v.changedTouches,_=C.length,T,M;for(d&&clearTimeout(d),d=setTimeout(function(){d=null},500),T=0;T<_;++T)(M=a[C[T].identifier])&&(xe(v),M("end",v,C[T]))}function N(v,C,_,T,M,P){var I=s.copy(),B=ht(P||_,C),j,G,m;if((m=n.call(v,new Le("beforestart",{sourceEvent:_,target:p,identifier:M,active:r,x:B[0],y:B[1],dx:0,dy:0,dispatch:I}),T))!=null)return j=m.x-B[0]||0,G=m.y-B[1]||0,function u(f,w,A){var L=B,R;switch(f){case"start":a[M]=u,R=r++;break;case"end":delete a[M],--r;case"drag":B=ht(A||w,C),R=r;break}I.call(f,v,new Le(f,{sourceEvent:w,subject:m,target:p,identifier:M,active:R,x:B[0]+j,y:B[1]+G,dx:B[0]-L[0],dy:B[1]-L[1],dispatch:I}),T)}}return p.filter=function(v){return arguments.length?(t=typeof v=="function"?v:Xt(!!v),p):t},p.container=function(v){return arguments.length?(e=typeof v=="function"?v:Xt(v),p):e},p.subject=function(v){return arguments.length?(n=typeof v=="function"?v:Xt(v),p):n},p.touchable=function(v){return arguments.length?(i=typeof v=="function"?v:Xt(!!v),p):i},p.on=function(){var v=s.on.apply(s,arguments);return v===s?p:v},p.clickDistance=function(v){return arguments.length?(b=(v=+v)*v,p):Math.sqrt(b)},p}function We(t,e,n){t.prototype=e.prototype=n,n.constructor=t}function oi(t,e){var n=Object.create(t.prototype);for(var i in e)n[i]=e[i];return n}function qt(){}var zt=.7,ce=1/zt,At="\\s*([+-]?\\d+)\\s*",jt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",ut="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Js=/^#([0-9a-f]{3,8})$/,Ks=new RegExp(`^rgb\\(${At},${At},${At}\\)$`),Qs=new RegExp(`^rgb\\(${ut},${ut},${ut}\\)$`),Zs=new RegExp(`^rgba\\(${At},${At},${At},${jt}\\)$`),tr=new RegExp(`^rgba\\(${ut},${ut},${ut},${jt}\\)$`),er=new RegExp(`^hsl\\(${jt},${ut},${ut}\\)$`),nr=new RegExp(`^hsla\\(${jt},${ut},${ut},${jt}\\)$`),pn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};We(qt,Ht,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:hn,formatHex:hn,formatHex8:ir,formatHsl:ar,formatRgb:mn,toString:mn});function hn(){return this.rgb().formatHex()}function ir(){return this.rgb().formatHex8()}function ar(){return li(this).formatHsl()}function mn(){return this.rgb().formatRgb()}function Ht(t){var e,n;return t=(t+"").trim().toLowerCase(),(e=Js.exec(t))?(n=e[1].length,e=parseInt(e[1],16),n===6?gn(e):n===3?new nt(e>>8&15|e>>4&240,e>>4&15|e&240,(e&15)<<4|e&15,1):n===8?Wt(e>>24&255,e>>16&255,e>>8&255,(e&255)/255):n===4?Wt(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|e&240,((e&15)<<4|e&15)/255):null):(e=Ks.exec(t))?new nt(e[1],e[2],e[3],1):(e=Qs.exec(t))?new nt(e[1]*255/100,e[2]*255/100,e[3]*255/100,1):(e=Zs.exec(t))?Wt(e[1],e[2],e[3],e[4]):(e=tr.exec(t))?Wt(e[1]*255/100,e[2]*255/100,e[3]*255/100,e[4]):(e=er.exec(t))?_n(e[1],e[2]/100,e[3]/100,1):(e=nr.exec(t))?_n(e[1],e[2]/100,e[3]/100,e[4]):pn.hasOwnProperty(t)?gn(pn[t]):t==="transparent"?new nt(NaN,NaN,NaN,0):null}function gn(t){return new nt(t>>16&255,t>>8&255,t&255,1)}function Wt(t,e,n,i){return i<=0&&(t=e=n=NaN),new nt(t,e,n,i)}function sr(t){return t instanceof qt||(t=Ht(t)),t?(t=t.rgb(),new nt(t.r,t.g,t.b,t.opacity)):new nt}function Me(t,e,n,i){return arguments.length===1?sr(t):new nt(t,e,n,i??1)}function nt(t,e,n,i){this.r=+t,this.g=+e,this.b=+n,this.opacity=+i}We(nt,Me,oi(qt,{brighter(t){return t=t==null?ce:Math.pow(ce,t),new nt(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=t==null?zt:Math.pow(zt,t),new nt(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new nt($t(this.r),$t(this.g),$t(this.b),de(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:vn,formatHex:vn,formatHex8:rr,formatRgb:yn,toString:yn}));function vn(){return`#${wt(this.r)}${wt(this.g)}${wt(this.b)}`}function rr(){return`#${wt(this.r)}${wt(this.g)}${wt(this.b)}${wt((isNaN(this.opacity)?1:this.opacity)*255)}`}function yn(){const t=de(this.opacity);return`${t===1?"rgb(":"rgba("}${$t(this.r)}, ${$t(this.g)}, ${$t(this.b)}${t===1?")":`, ${t})`}`}function de(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function $t(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function wt(t){return t=$t(t),(t<16?"0":"")+t.toString(16)}function _n(t,e,n,i){return i<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new rt(t,e,n,i)}function li(t){if(t instanceof rt)return new rt(t.h,t.s,t.l,t.opacity);if(t instanceof qt||(t=Ht(t)),!t)return new rt;if(t instanceof rt)return t;t=t.rgb();var e=t.r/255,n=t.g/255,i=t.b/255,a=Math.min(e,n,i),s=Math.max(e,n,i),r=NaN,o=s-a,c=(s+a)/2;return o?(e===s?r=(n-i)/o+(n<i)*6:n===s?r=(i-e)/o+2:r=(e-n)/o+4,o/=c<.5?s+a:2-s-a,r*=60):o=c>0&&c<1?0:r,new rt(r,o,c,t.opacity)}function or(t,e,n,i){return arguments.length===1?li(t):new rt(t,e,n,i??1)}function rt(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}We(rt,or,oi(qt,{brighter(t){return t=t==null?ce:Math.pow(ce,t),new rt(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=t==null?zt:Math.pow(zt,t),new rt(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+(this.h<0)*360,e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*e,a=2*n-i;return new nt(we(t>=240?t-240:t+120,a,i),we(t,a,i),we(t<120?t+240:t-120,a,i),this.opacity)},clamp(){return new rt(bn(this.h),Jt(this.s),Jt(this.l),de(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=de(this.opacity);return`${t===1?"hsl(":"hsla("}${bn(this.h)}, ${Jt(this.s)*100}%, ${Jt(this.l)*100}%${t===1?")":`, ${t})`}`}}));function bn(t){return t=(t||0)%360,t<0?t+360:t}function Jt(t){return Math.max(0,Math.min(1,t||0))}function we(t,e,n){return(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)*255}const ci=t=>()=>t;function lr(t,e){return function(n){return t+n*e}}function cr(t,e,n){return t=Math.pow(t,n),e=Math.pow(e,n)-t,n=1/n,function(i){return Math.pow(t+i*e,n)}}function dr(t){return(t=+t)==1?di:function(e,n){return n-e?cr(e,n,t):ci(isNaN(e)?n:e)}}function di(t,e){var n=e-t;return n?lr(t,n):ci(isNaN(t)?e:t)}const xn=function t(e){var n=dr(e);function i(a,s){var r=n((a=Me(a)).r,(s=Me(s)).r),o=n(a.g,s.g),c=n(a.b,s.b),l=di(a.opacity,s.opacity);return function(d){return a.r=r(d),a.g=o(d),a.b=c(d),a.opacity=l(d),a+""}}return i.gamma=t,i}(1);function vt(t,e){return t=+t,e=+e,function(n){return t*(1-n)+e*n}}var Pe=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Ee=new RegExp(Pe.source,"g");function ur(t){return function(){return t}}function fr(t){return function(e){return t(e)+""}}function pr(t,e){var n=Pe.lastIndex=Ee.lastIndex=0,i,a,s,r=-1,o=[],c=[];for(t=t+"",e=e+"";(i=Pe.exec(t))&&(a=Ee.exec(e));)(s=a.index)>n&&(s=e.slice(n,s),o[r]?o[r]+=s:o[++r]=s),(i=i[0])===(a=a[0])?o[r]?o[r]+=a:o[++r]=a:(o[++r]=null,c.push({i:r,x:vt(i,a)})),n=Ee.lastIndex;return n<e.length&&(s=e.slice(n),o[r]?o[r]+=s:o[++r]=s),o.length<2?c[0]?fr(c[0].x):ur(e):(e=c.length,function(l){for(var d=0,b;d<e;++d)o[(b=c[d]).i]=b.x(l);return o.join("")})}var wn=180/Math.PI,Re={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function ui(t,e,n,i,a,s){var r,o,c;return(r=Math.sqrt(t*t+e*e))&&(t/=r,e/=r),(c=t*n+e*i)&&(n-=t*c,i-=e*c),(o=Math.sqrt(n*n+i*i))&&(n/=o,i/=o,c/=o),t*i<e*n&&(t=-t,e=-e,c=-c,r=-r),{translateX:a,translateY:s,rotate:Math.atan2(e,t)*wn,skewX:Math.atan(c)*wn,scaleX:r,scaleY:o}}var Kt;function hr(t){const e=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(t+"");return e.isIdentity?Re:ui(e.a,e.b,e.c,e.d,e.e,e.f)}function mr(t){return t==null||(Kt||(Kt=document.createElementNS("http://www.w3.org/2000/svg","g")),Kt.setAttribute("transform",t),!(t=Kt.transform.baseVal.consolidate()))?Re:(t=t.matrix,ui(t.a,t.b,t.c,t.d,t.e,t.f))}function fi(t,e,n,i){function a(l){return l.length?l.pop()+" ":""}function s(l,d,b,p,h,E){if(l!==b||d!==p){var y=h.push("translate(",null,e,null,n);E.push({i:y-4,x:vt(l,b)},{i:y-2,x:vt(d,p)})}else(b||p)&&h.push("translate("+b+e+p+n)}function r(l,d,b,p){l!==d?(l-d>180?d+=360:d-l>180&&(l+=360),p.push({i:b.push(a(b)+"rotate(",null,i)-2,x:vt(l,d)})):d&&b.push(a(b)+"rotate("+d+i)}function o(l,d,b,p){l!==d?p.push({i:b.push(a(b)+"skewX(",null,i)-2,x:vt(l,d)}):d&&b.push(a(b)+"skewX("+d+i)}function c(l,d,b,p,h,E){if(l!==b||d!==p){var y=h.push(a(h)+"scale(",null,",",null,")");E.push({i:y-4,x:vt(l,b)},{i:y-2,x:vt(d,p)})}else(b!==1||p!==1)&&h.push(a(h)+"scale("+b+","+p+")")}return function(l,d){var b=[],p=[];return l=t(l),d=t(d),s(l.translateX,l.translateY,d.translateX,d.translateY,b,p),r(l.rotate,d.rotate,b,p),o(l.skewX,d.skewX,b,p),c(l.scaleX,l.scaleY,d.scaleX,d.scaleY,b,p),l=d=null,function(h){for(var E=-1,y=p.length,x;++E<y;)b[(x=p[E]).i]=x.x(h);return b.join("")}}}var gr=fi(hr,"px, ","px)","deg)"),vr=fi(mr,", ",")",")"),yr=1e-12;function En(t){return((t=Math.exp(t))+1/t)/2}function _r(t){return((t=Math.exp(t))-1/t)/2}function br(t){return((t=Math.exp(2*t))-1)/(t+1)}const xr=function t(e,n,i){function a(s,r){var o=s[0],c=s[1],l=s[2],d=r[0],b=r[1],p=r[2],h=d-o,E=b-c,y=h*h+E*E,x,g;if(y<yr)g=Math.log(p/l)/e,x=function(T){return[o+T*h,c+T*E,l*Math.exp(e*T*g)]};else{var $=Math.sqrt(y),N=(p*p-l*l+i*y)/(2*l*n*$),v=(p*p-l*l-i*y)/(2*p*n*$),C=Math.log(Math.sqrt(N*N+1)-N),_=Math.log(Math.sqrt(v*v+1)-v);g=(_-C)/e,x=function(T){var M=T*g,P=En(C),I=l/(n*$)*(P*br(e*M+C)-_r(C));return[o+I*h,c+I*E,l*P/En(e*M+C)]}}return x.duration=g*1e3*e/Math.SQRT2,x}return a.rho=function(s){var r=Math.max(.001,+s),o=r*r,c=o*o;return t(r,o,c)},a}(Math.SQRT2,2,4);var Ct=0,Rt=0,Mt=0,pi=1e3,ue,Bt,fe=0,kt=0,ve=0,Ft=typeof performance=="object"&&performance.now?performance:Date,hi=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function Je(){return kt||(hi(wr),kt=Ft.now()+ve)}function wr(){kt=0}function pe(){this._call=this._time=this._next=null}pe.prototype=Ke.prototype={constructor:pe,restart:function(t,e,n){if(typeof t!="function")throw new TypeError("callback is not a function");n=(n==null?Je():+n)+(e==null?0:+e),!this._next&&Bt!==this&&(Bt?Bt._next=this:ue=this,Bt=this),this._call=t,this._time=n,Be()},stop:function(){this._call&&(this._call=null,this._time=1/0,Be())}};function Ke(t,e,n){var i=new pe;return i.restart(t,e,n),i}function Er(){Je(),++Ct;for(var t=ue,e;t;)(e=kt-t._time)>=0&&t._call.call(void 0,e),t=t._next;--Ct}function $n(){kt=(fe=Ft.now())+ve,Ct=Rt=0;try{Er()}finally{Ct=0,kr(),kt=0}}function $r(){var t=Ft.now(),e=t-fe;e>pi&&(ve-=e,fe=t)}function kr(){for(var t,e=ue,n,i=1/0;e;)e._call?(i>e._time&&(i=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:ue=n);Bt=t,Be(i)}function Be(t){if(!Ct){Rt&&(Rt=clearTimeout(Rt));var e=t-kt;e>24?(t<1/0&&(Rt=setTimeout($n,t-Ft.now()-ve)),Mt&&(Mt=clearInterval(Mt))):(Mt||(fe=Ft.now(),Mt=setInterval($r,pi)),Ct=1,hi($n))}}function kn(t,e,n){var i=new pe;return e=e==null?0:+e,i.restart(a=>{i.stop(),t(a+e)},e,n),i}var Tr=Gt("start","end","cancel","interrupt"),Ir=[],mi=0,Tn=1,Oe=2,se=3,In=4,De=5,re=6;function ye(t,e,n,i,a,s){var r=t.__transition;if(!r)t.__transition={};else if(n in r)return;Sr(t,n,{name:e,index:i,group:a,on:Tr,tween:Ir,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:mi})}function Qe(t,e){var n=ot(t,e);if(n.state>mi)throw new Error("too late; already scheduled");return n}function ft(t,e){var n=ot(t,e);if(n.state>se)throw new Error("too late; already running");return n}function ot(t,e){var n=t.__transition;if(!n||!(n=n[e]))throw new Error("transition not found");return n}function Sr(t,e,n){var i=t.__transition,a;i[e]=n,n.timer=Ke(s,0,n.time);function s(l){n.state=Tn,n.timer.restart(r,n.delay,n.time),n.delay<=l&&r(l-n.delay)}function r(l){var d,b,p,h;if(n.state!==Tn)return c();for(d in i)if(h=i[d],h.name===n.name){if(h.state===se)return kn(r);h.state===In?(h.state=re,h.timer.stop(),h.on.call("interrupt",t,t.__data__,h.index,h.group),delete i[d]):+d<e&&(h.state=re,h.timer.stop(),h.on.call("cancel",t,t.__data__,h.index,h.group),delete i[d])}if(kn(function(){n.state===se&&(n.state=In,n.timer.restart(o,n.delay,n.time),o(l))}),n.state=Oe,n.on.call("start",t,t.__data__,n.index,n.group),n.state===Oe){for(n.state=se,a=new Array(p=n.tween.length),d=0,b=-1;d<p;++d)(h=n.tween[d].value.call(t,t.__data__,n.index,n.group))&&(a[++b]=h);a.length=b+1}}function o(l){for(var d=l<n.duration?n.ease.call(null,l/n.duration):(n.timer.restart(c),n.state=De,1),b=-1,p=a.length;++b<p;)a[b].call(t,d);n.state===De&&(n.on.call("end",t,t.__data__,n.index,n.group),c())}function c(){n.state=re,n.timer.stop(),delete i[e];for(var l in i)return;delete t.__transition}}function oe(t,e){var n=t.__transition,i,a,s=!0,r;if(n){e=e==null?null:e+"";for(r in n){if((i=n[r]).name!==e){s=!1;continue}a=i.state>Oe&&i.state<De,i.state=re,i.timer.stop(),i.on.call(a?"interrupt":"cancel",t,t.__data__,i.index,i.group),delete n[r]}s&&delete t.__transition}}function Ar(t){return this.each(function(){oe(this,t)})}function Nr(t,e){var n,i;return function(){var a=ft(this,t),s=a.tween;if(s!==n){i=n=s;for(var r=0,o=i.length;r<o;++r)if(i[r].name===e){i=i.slice(),i.splice(r,1);break}}a.tween=i}}function Cr(t,e,n){var i,a;if(typeof n!="function")throw new Error;return function(){var s=ft(this,t),r=s.tween;if(r!==i){a=(i=r).slice();for(var o={name:e,value:n},c=0,l=a.length;c<l;++c)if(a[c].name===e){a[c]=o;break}c===l&&a.push(o)}s.tween=a}}function Lr(t,e){var n=this._id;if(t+="",arguments.length<2){for(var i=ot(this.node(),n).tween,a=0,s=i.length,r;a<s;++a)if((r=i[a]).name===t)return r.value;return null}return this.each((e==null?Nr:Cr)(n,t,e))}function Ze(t,e,n){var i=t._id;return t.each(function(){var a=ft(this,i);(a.value||(a.value={}))[e]=n.apply(this,arguments)}),function(a){return ot(a,i).value[e]}}function gi(t,e){var n;return(typeof e=="number"?vt:e instanceof Ht?xn:(n=Ht(e))?(e=n,xn):pr)(t,e)}function Mr(t){return function(){this.removeAttribute(t)}}function Pr(t){return function(){this.removeAttributeNS(t.space,t.local)}}function Rr(t,e,n){var i,a=n+"",s;return function(){var r=this.getAttribute(t);return r===a?null:r===i?s:s=e(i=r,n)}}function Br(t,e,n){var i,a=n+"",s;return function(){var r=this.getAttributeNS(t.space,t.local);return r===a?null:r===i?s:s=e(i=r,n)}}function Or(t,e,n){var i,a,s;return function(){var r,o=n(this),c;return o==null?void this.removeAttribute(t):(r=this.getAttribute(t),c=o+"",r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o)))}}function Dr(t,e,n){var i,a,s;return function(){var r,o=n(this),c;return o==null?void this.removeAttributeNS(t.space,t.local):(r=this.getAttributeNS(t.space,t.local),c=o+"",r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o)))}}function zr(t,e){var n=ge(t),i=n==="transform"?vr:gi;return this.attrTween(t,typeof e=="function"?(n.local?Dr:Or)(n,i,Ze(this,"attr."+t,e)):e==null?(n.local?Pr:Mr)(n):(n.local?Br:Rr)(n,i,e))}function jr(t,e){return function(n){this.setAttribute(t,e.call(this,n))}}function Hr(t,e){return function(n){this.setAttributeNS(t.space,t.local,e.call(this,n))}}function Fr(t,e){var n,i;function a(){var s=e.apply(this,arguments);return s!==i&&(n=(i=s)&&Hr(t,s)),n}return a._value=e,a}function Gr(t,e){var n,i;function a(){var s=e.apply(this,arguments);return s!==i&&(n=(i=s)&&jr(t,s)),n}return a._value=e,a}function Yr(t,e){var n="attr."+t;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;var i=ge(t);return this.tween(n,(i.local?Fr:Gr)(i,e))}function qr(t,e){return function(){Qe(this,t).delay=+e.apply(this,arguments)}}function Ur(t,e){return e=+e,function(){Qe(this,t).delay=e}}function Vr(t){var e=this._id;return arguments.length?this.each((typeof t=="function"?qr:Ur)(e,t)):ot(this.node(),e).delay}function Xr(t,e){return function(){ft(this,t).duration=+e.apply(this,arguments)}}function Wr(t,e){return e=+e,function(){ft(this,t).duration=e}}function Jr(t){var e=this._id;return arguments.length?this.each((typeof t=="function"?Xr:Wr)(e,t)):ot(this.node(),e).duration}function Kr(t,e){if(typeof e!="function")throw new Error;return function(){ft(this,t).ease=e}}function Qr(t){var e=this._id;return arguments.length?this.each(Kr(e,t)):ot(this.node(),e).ease}function Zr(t,e){return function(){var n=e.apply(this,arguments);if(typeof n!="function")throw new Error;ft(this,t).ease=n}}function to(t){if(typeof t!="function")throw new Error;return this.each(Zr(this._id,t))}function eo(t){typeof t!="function"&&(t=Wn(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=[],c,l=0;l<r;++l)(c=s[l])&&t.call(c,c.__data__,l,s)&&o.push(c);return new gt(i,this._parents,this._name,this._id)}function no(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,n=t._groups,i=e.length,a=n.length,s=Math.min(i,a),r=new Array(i),o=0;o<s;++o)for(var c=e[o],l=n[o],d=c.length,b=r[o]=new Array(d),p,h=0;h<d;++h)(p=c[h]||l[h])&&(b[h]=p);for(;o<i;++o)r[o]=e[o];return new gt(r,this._parents,this._name,this._id)}function io(t){return(t+"").trim().split(/^|\s+/).every(function(e){var n=e.indexOf(".");return n>=0&&(e=e.slice(0,n)),!e||e==="start"})}function ao(t,e,n){var i,a,s=io(e)?Qe:ft;return function(){var r=s(this,t),o=r.on;o!==i&&(a=(i=o).copy()).on(e,n),r.on=a}}function so(t,e){var n=this._id;return arguments.length<2?ot(this.node(),n).on.on(t):this.each(ao(n,t,e))}function ro(t){return function(){var e=this.parentNode;for(var n in this.__transition)if(+n!==t)return;e&&e.removeChild(this)}}function oo(){return this.on("end.remove",ro(this._id))}function lo(t){var e=this._name,n=this._id;typeof t!="function"&&(t=Ve(t));for(var i=this._groups,a=i.length,s=new Array(a),r=0;r<a;++r)for(var o=i[r],c=o.length,l=s[r]=new Array(c),d,b,p=0;p<c;++p)(d=o[p])&&(b=t.call(d,d.__data__,p,o))&&("__data__"in d&&(b.__data__=d.__data__),l[p]=b,ye(l[p],e,n,p,l,ot(d,n)));return new gt(s,this._parents,e,n)}function co(t){var e=this._name,n=this._id;typeof t!="function"&&(t=Xn(t));for(var i=this._groups,a=i.length,s=[],r=[],o=0;o<a;++o)for(var c=i[o],l=c.length,d,b=0;b<l;++b)if(d=c[b]){for(var p=t.call(d,d.__data__,b,c),h,E=ot(d,n),y=0,x=p.length;y<x;++y)(h=p[y])&&ye(h,e,n,y,p,E);s.push(p),r.push(d)}return new gt(s,r,e,n)}var uo=Yt.prototype.constructor;function fo(){return new uo(this._groups,this._parents)}function po(t,e){var n,i,a;return function(){var s=Nt(this,t),r=(this.style.removeProperty(t),Nt(this,t));return s===r?null:s===n&&r===i?a:a=e(n=s,i=r)}}function vi(t){return function(){this.style.removeProperty(t)}}function ho(t,e,n){var i,a=n+"",s;return function(){var r=Nt(this,t);return r===a?null:r===i?s:s=e(i=r,n)}}function mo(t,e,n){var i,a,s;return function(){var r=Nt(this,t),o=n(this),c=o+"";return o==null&&(c=o=(this.style.removeProperty(t),Nt(this,t))),r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o))}}function go(t,e){var n,i,a,s="style."+e,r="end."+s,o;return function(){var c=ft(this,t),l=c.on,d=c.value[s]==null?o||(o=vi(e)):void 0;(l!==n||a!==d)&&(i=(n=l).copy()).on(r,a=d),c.on=i}}function vo(t,e,n){var i=(t+="")=="transform"?gr:gi;return e==null?this.styleTween(t,po(t,i)).on("end.style."+t,vi(t)):typeof e=="function"?this.styleTween(t,mo(t,i,Ze(this,"style."+t,e))).each(go(this._id,t)):this.styleTween(t,ho(t,i,e),n).on("end.style."+t,null)}function yo(t,e,n){return function(i){this.style.setProperty(t,e.call(this,i),n)}}function _o(t,e,n){var i,a;function s(){var r=e.apply(this,arguments);return r!==a&&(i=(a=r)&&yo(t,r,n)),i}return s._value=e,s}function bo(t,e,n){var i="style."+(t+="");if(arguments.length<2)return(i=this.tween(i))&&i._value;if(e==null)return this.tween(i,null);if(typeof e!="function")throw new Error;return this.tween(i,_o(t,e,n??""))}function xo(t){return function(){this.textContent=t}}function wo(t){return function(){var e=t(this);this.textContent=e??""}}function Eo(t){return this.tween("text",typeof t=="function"?wo(Ze(this,"text",t)):xo(t==null?"":t+""))}function $o(t){return function(e){this.textContent=t.call(this,e)}}function ko(t){var e,n;function i(){var a=t.apply(this,arguments);return a!==n&&(e=(n=a)&&$o(a)),e}return i._value=t,i}function To(t){var e="text";if(arguments.length<1)return(e=this.tween(e))&&e._value;if(t==null)return this.tween(e,null);if(typeof t!="function")throw new Error;return this.tween(e,ko(t))}function Io(){for(var t=this._name,e=this._id,n=yi(),i=this._groups,a=i.length,s=0;s<a;++s)for(var r=i[s],o=r.length,c,l=0;l<o;++l)if(c=r[l]){var d=ot(c,e);ye(c,t,n,l,r,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new gt(i,this._parents,t,n)}function So(){var t,e,n=this,i=n._id,a=n.size();return new Promise(function(s,r){var o={value:r},c={value:function(){--a===0&&s()}};n.each(function(){var l=ft(this,i),d=l.on;d!==t&&(e=(t=d).copy(),e._.cancel.push(o),e._.interrupt.push(o),e._.end.push(c)),l.on=e}),a===0&&s()})}var Ao=0;function gt(t,e,n,i){this._groups=t,this._parents=e,this._name=n,this._id=i}function yi(){return++Ao}var pt=Yt.prototype;gt.prototype={constructor:gt,select:lo,selectAll:co,selectChild:pt.selectChild,selectChildren:pt.selectChildren,filter:eo,merge:no,selection:fo,transition:Io,call:pt.call,nodes:pt.nodes,node:pt.node,size:pt.size,empty:pt.empty,each:pt.each,on:so,attr:zr,attrTween:Yr,style:vo,styleTween:bo,text:Eo,textTween:To,remove:oo,tween:Lr,delay:Vr,duration:Jr,ease:Qr,easeVarying:to,end:So,[Symbol.iterator]:pt[Symbol.iterator]};function No(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}var Co={time:null,delay:0,duration:250,ease:No};function Lo(t,e){for(var n;!(n=t.__transition)||!(n=n[e]);)if(!(t=t.parentNode))throw new Error(`transition ${e} not found`);return n}function Mo(t){var e,n;t instanceof gt?(e=t._id,t=t._name):(e=yi(),(n=Co).time=Je(),t=t==null?null:t+"");for(var i=this._groups,a=i.length,s=0;s<a;++s)for(var r=i[s],o=r.length,c,l=0;l<o;++l)(c=r[l])&&ye(c,t,e,l,r,n||Lo(c,e));return new gt(i,this._parents,t,e)}Yt.prototype.interrupt=Ar;Yt.prototype.transition=Mo;function Po(t,e){var n,i=1;t==null&&(t=0),e==null&&(e=0);function a(){var s,r=n.length,o,c=0,l=0;for(s=0;s<r;++s)o=n[s],c+=o.x,l+=o.y;for(c=(c/r-t)*i,l=(l/r-e)*i,s=0;s<r;++s)o=n[s],o.x-=c,o.y-=l}return a.initialize=function(s){n=s},a.x=function(s){return arguments.length?(t=+s,a):t},a.y=function(s){return arguments.length?(e=+s,a):e},a.strength=function(s){return arguments.length?(i=+s,a):i},a}function Ro(t){const e=+this._x.call(null,t),n=+this._y.call(null,t);return _i(this.cover(e,n),e,n,t)}function _i(t,e,n,i){if(isNaN(e)||isNaN(n))return t;var a,s=t._root,r={data:i},o=t._x0,c=t._y0,l=t._x1,d=t._y1,b,p,h,E,y,x,g,$;if(!s)return t._root=r,t;for(;s.length;)if((y=e>=(b=(o+l)/2))?o=b:l=b,(x=n>=(p=(c+d)/2))?c=p:d=p,a=s,!(s=s[g=x<<1|y]))return a[g]=r,t;if(h=+t._x.call(null,s.data),E=+t._y.call(null,s.data),e===h&&n===E)return r.next=s,a?a[g]=r:t._root=r,t;do a=a?a[g]=new Array(4):t._root=new Array(4),(y=e>=(b=(o+l)/2))?o=b:l=b,(x=n>=(p=(c+d)/2))?c=p:d=p;while((g=x<<1|y)===($=(E>=p)<<1|h>=b));return a[$]=s,a[g]=r,t}function Bo(t){var e,n,i=t.length,a,s,r=new Array(i),o=new Array(i),c=1/0,l=1/0,d=-1/0,b=-1/0;for(n=0;n<i;++n)isNaN(a=+this._x.call(null,e=t[n]))||isNaN(s=+this._y.call(null,e))||(r[n]=a,o[n]=s,a<c&&(c=a),a>d&&(d=a),s<l&&(l=s),s>b&&(b=s));if(c>d||l>b)return this;for(this.cover(c,l).cover(d,b),n=0;n<i;++n)_i(this,r[n],o[n],t[n]);return this}function Oo(t,e){if(isNaN(t=+t)||isNaN(e=+e))return this;var n=this._x0,i=this._y0,a=this._x1,s=this._y1;if(isNaN(n))a=(n=Math.floor(t))+1,s=(i=Math.floor(e))+1;else{for(var r=a-n||1,o=this._root,c,l;n>t||t>=a||i>e||e>=s;)switch(l=(e<i)<<1|t<n,c=new Array(4),c[l]=o,o=c,r*=2,l){case 0:a=n+r,s=i+r;break;case 1:n=a-r,s=i+r;break;case 2:a=n+r,i=s-r;break;case 3:n=a-r,i=s-r;break}this._root&&this._root.length&&(this._root=o)}return this._x0=n,this._y0=i,this._x1=a,this._y1=s,this}function Do(){var t=[];return this.visit(function(e){if(!e.length)do t.push(e.data);while(e=e.next)}),t}function zo(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function Z(t,e,n,i,a){this.node=t,this.x0=e,this.y0=n,this.x1=i,this.y1=a}function jo(t,e,n){var i,a=this._x0,s=this._y0,r,o,c,l,d=this._x1,b=this._y1,p=[],h=this._root,E,y;for(h&&p.push(new Z(h,a,s,d,b)),n==null?n=1/0:(a=t-n,s=e-n,d=t+n,b=e+n,n*=n);E=p.pop();)if(!(!(h=E.node)||(r=E.x0)>d||(o=E.y0)>b||(c=E.x1)<a||(l=E.y1)<s))if(h.length){var x=(r+c)/2,g=(o+l)/2;p.push(new Z(h[3],x,g,c,l),new Z(h[2],r,g,x,l),new Z(h[1],x,o,c,g),new Z(h[0],r,o,x,g)),(y=(e>=g)<<1|t>=x)&&(E=p[p.length-1],p[p.length-1]=p[p.length-1-y],p[p.length-1-y]=E)}else{var $=t-+this._x.call(null,h.data),N=e-+this._y.call(null,h.data),v=$*$+N*N;if(v<n){var C=Math.sqrt(n=v);a=t-C,s=e-C,d=t+C,b=e+C,i=h.data}}return i}function Ho(t){if(isNaN(d=+this._x.call(null,t))||isNaN(b=+this._y.call(null,t)))return this;var e,n=this._root,i,a,s,r=this._x0,o=this._y0,c=this._x1,l=this._y1,d,b,p,h,E,y,x,g;if(!n)return this;if(n.length)for(;;){if((E=d>=(p=(r+c)/2))?r=p:c=p,(y=b>=(h=(o+l)/2))?o=h:l=h,e=n,!(n=n[x=y<<1|E]))return this;if(!n.length)break;(e[x+1&3]||e[x+2&3]||e[x+3&3])&&(i=e,g=x)}for(;n.data!==t;)if(a=n,!(n=n.next))return this;return(s=n.next)&&delete n.next,a?(s?a.next=s:delete a.next,this):e?(s?e[x]=s:delete e[x],(n=e[0]||e[1]||e[2]||e[3])&&n===(e[3]||e[2]||e[1]||e[0])&&!n.length&&(i?i[g]=n:this._root=n),this):(this._root=s,this)}function Fo(t){for(var e=0,n=t.length;e<n;++e)this.remove(t[e]);return this}function Go(){return this._root}function Yo(){var t=0;return this.visit(function(e){if(!e.length)do++t;while(e=e.next)}),t}function qo(t){var e=[],n,i=this._root,a,s,r,o,c;for(i&&e.push(new Z(i,this._x0,this._y0,this._x1,this._y1));n=e.pop();)if(!t(i=n.node,s=n.x0,r=n.y0,o=n.x1,c=n.y1)&&i.length){var l=(s+o)/2,d=(r+c)/2;(a=i[3])&&e.push(new Z(a,l,d,o,c)),(a=i[2])&&e.push(new Z(a,s,d,l,c)),(a=i[1])&&e.push(new Z(a,l,r,o,d)),(a=i[0])&&e.push(new Z(a,s,r,l,d))}return this}function Uo(t){var e=[],n=[],i;for(this._root&&e.push(new Z(this._root,this._x0,this._y0,this._x1,this._y1));i=e.pop();){var a=i.node;if(a.length){var s,r=i.x0,o=i.y0,c=i.x1,l=i.y1,d=(r+c)/2,b=(o+l)/2;(s=a[0])&&e.push(new Z(s,r,o,d,b)),(s=a[1])&&e.push(new Z(s,d,o,c,b)),(s=a[2])&&e.push(new Z(s,r,b,d,l)),(s=a[3])&&e.push(new Z(s,d,b,c,l))}n.push(i)}for(;i=n.pop();)t(i.node,i.x0,i.y0,i.x1,i.y1);return this}function Vo(t){return t[0]}function Xo(t){return arguments.length?(this._x=t,this):this._x}function Wo(t){return t[1]}function Jo(t){return arguments.length?(this._y=t,this):this._y}function tn(t,e,n){var i=new en(e??Vo,n??Wo,NaN,NaN,NaN,NaN);return t==null?i:i.addAll(t)}function en(t,e,n,i,a,s){this._x=t,this._y=e,this._x0=n,this._y0=i,this._x1=a,this._y1=s,this._root=void 0}function Sn(t){for(var e={data:t.data},n=e;t=t.next;)n=n.next={data:t.data};return e}var et=tn.prototype=en.prototype;et.copy=function(){var t=new en(this._x,this._y,this._x0,this._y0,this._x1,this._y1),e=this._root,n,i;if(!e)return t;if(!e.length)return t._root=Sn(e),t;for(n=[{source:e,target:t._root=new Array(4)}];e=n.pop();)for(var a=0;a<4;++a)(i=e.source[a])&&(i.length?n.push({source:i,target:e.target[a]=new Array(4)}):e.target[a]=Sn(i));return t};et.add=Ro;et.addAll=Bo;et.cover=Oo;et.data=Do;et.extent=zo;et.find=jo;et.remove=Ho;et.removeAll=Fo;et.root=Go;et.size=Yo;et.visit=qo;et.visitAfter=Uo;et.x=Xo;et.y=Jo;function tt(t){return function(){return t}}function _t(t){return(t()-.5)*1e-6}function Ko(t){return t.x+t.vx}function Qo(t){return t.y+t.vy}function Zo(t){var e,n,i,a=1,s=1;typeof t!="function"&&(t=tt(t==null?1:+t));function r(){for(var l,d=e.length,b,p,h,E,y,x,g=0;g<s;++g)for(b=tn(e,Ko,Qo).visitAfter(o),l=0;l<d;++l)p=e[l],y=n[p.index],x=y*y,h=p.x+p.vx,E=p.y+p.vy,b.visit($);function $(N,v,C,_,T){var M=N.data,P=N.r,I=y+P;if(M){if(M.index>p.index){var B=h-M.x-M.vx,j=E-M.y-M.vy,G=B*B+j*j;G<I*I&&(B===0&&(B=_t(i),G+=B*B),j===0&&(j=_t(i),G+=j*j),G=(I-(G=Math.sqrt(G)))/G*a,p.vx+=(B*=G)*(I=(P*=P)/(x+P)),p.vy+=(j*=G)*I,M.vx-=B*(I=1-I),M.vy-=j*I)}return}return v>h+I||_<h-I||C>E+I||T<E-I}}function o(l){if(l.data)return l.r=n[l.data.index];for(var d=l.r=0;d<4;++d)l[d]&&l[d].r>l.r&&(l.r=l[d].r)}function c(){if(e){var l,d=e.length,b;for(n=new Array(d),l=0;l<d;++l)b=e[l],n[b.index]=+t(b,l,e)}}return r.initialize=function(l,d){e=l,i=d,c()},r.iterations=function(l){return arguments.length?(s=+l,r):s},r.strength=function(l){return arguments.length?(a=+l,r):a},r.radius=function(l){return arguments.length?(t=typeof l=="function"?l:tt(+l),c(),r):t},r}function tl(t){return t.index}function An(t,e){var n=t.get(e);if(!n)throw new Error("node not found: "+e);return n}function el(t){var e=tl,n=b,i,a=tt(30),s,r,o,c,l,d=1;t==null&&(t=[]);function b(x){return 1/Math.min(o[x.source.index],o[x.target.index])}function p(x){for(var g=0,$=t.length;g<d;++g)for(var N=0,v,C,_,T,M,P,I;N<$;++N)v=t[N],C=v.source,_=v.target,T=_.x+_.vx-C.x-C.vx||_t(l),M=_.y+_.vy-C.y-C.vy||_t(l),P=Math.sqrt(T*T+M*M),P=(P-s[N])/P*x*i[N],T*=P,M*=P,_.vx-=T*(I=c[N]),_.vy-=M*I,C.vx+=T*(I=1-I),C.vy+=M*I}function h(){if(r){var x,g=r.length,$=t.length,N=new Map(r.map((C,_)=>[e(C,_,r),C])),v;for(x=0,o=new Array(g);x<$;++x)v=t[x],v.index=x,typeof v.source!="object"&&(v.source=An(N,v.source)),typeof v.target!="object"&&(v.target=An(N,v.target)),o[v.source.index]=(o[v.source.index]||0)+1,o[v.target.index]=(o[v.target.index]||0)+1;for(x=0,c=new Array($);x<$;++x)v=t[x],c[x]=o[v.source.index]/(o[v.source.index]+o[v.target.index]);i=new Array($),E(),s=new Array($),y()}}function E(){if(r)for(var x=0,g=t.length;x<g;++x)i[x]=+n(t[x],x,t)}function y(){if(r)for(var x=0,g=t.length;x<g;++x)s[x]=+a(t[x],x,t)}return p.initialize=function(x,g){r=x,l=g,h()},p.links=function(x){return arguments.length?(t=x,h(),p):t},p.id=function(x){return arguments.length?(e=x,p):e},p.iterations=function(x){return arguments.length?(d=+x,p):d},p.strength=function(x){return arguments.length?(n=typeof x=="function"?x:tt(+x),E(),p):n},p.distance=function(x){return arguments.length?(a=typeof x=="function"?x:tt(+x),y(),p):a},p}const nl=1664525,il=1013904223,Nn=4294967296;function al(){let t=1;return()=>(t=(nl*t+il)%Nn)/Nn}function sl(t){return t.x}function rl(t){return t.y}var ol=10,ll=Math.PI*(3-Math.sqrt(5));function cl(t){var e,n=1,i=.001,a=1-Math.pow(i,1/300),s=0,r=.6,o=new Map,c=Ke(b),l=Gt("tick","end"),d=al();t==null&&(t=[]);function b(){p(),l.call("tick",e),n<i&&(c.stop(),l.call("end",e))}function p(y){var x,g=t.length,$;y===void 0&&(y=1);for(var N=0;N<y;++N)for(n+=(s-n)*a,o.forEach(function(v){v(n)}),x=0;x<g;++x)$=t[x],$.fx==null?$.x+=$.vx*=r:($.x=$.fx,$.vx=0),$.fy==null?$.y+=$.vy*=r:($.y=$.fy,$.vy=0);return e}function h(){for(var y=0,x=t.length,g;y<x;++y){if(g=t[y],g.index=y,g.fx!=null&&(g.x=g.fx),g.fy!=null&&(g.y=g.fy),isNaN(g.x)||isNaN(g.y)){var $=ol*Math.sqrt(.5+y),N=y*ll;g.x=$*Math.cos(N),g.y=$*Math.sin(N)}(isNaN(g.vx)||isNaN(g.vy))&&(g.vx=g.vy=0)}}function E(y){return y.initialize&&y.initialize(t,d),y}return h(),e={tick:p,restart:function(){return c.restart(b),e},stop:function(){return c.stop(),e},nodes:function(y){return arguments.length?(t=y,h(),o.forEach(E),e):t},alpha:function(y){return arguments.length?(n=+y,e):n},alphaMin:function(y){return arguments.length?(i=+y,e):i},alphaDecay:function(y){return arguments.length?(a=+y,e):+a},alphaTarget:function(y){return arguments.length?(s=+y,e):s},velocityDecay:function(y){return arguments.length?(r=1-y,e):1-r},randomSource:function(y){return arguments.length?(d=y,o.forEach(E),e):d},force:function(y,x){return arguments.length>1?(x==null?o.delete(y):o.set(y,E(x)),e):o.get(y)},find:function(y,x,g){var $=0,N=t.length,v,C,_,T,M;for(g==null?g=1/0:g*=g,$=0;$<N;++$)T=t[$],v=y-T.x,C=x-T.y,_=v*v+C*C,_<g&&(M=T,g=_);return M},on:function(y,x){return arguments.length>1?(l.on(y,x),e):l.on(y)}}}function dl(){var t,e,n,i,a=tt(-30),s,r=1,o=1/0,c=.81;function l(h){var E,y=t.length,x=tn(t,sl,rl).visitAfter(b);for(i=h,E=0;E<y;++E)e=t[E],x.visit(p)}function d(){if(t){var h,E=t.length,y;for(s=new Array(E),h=0;h<E;++h)y=t[h],s[y.index]=+a(y,h,t)}}function b(h){var E=0,y,x,g=0,$,N,v;if(h.length){for($=N=v=0;v<4;++v)(y=h[v])&&(x=Math.abs(y.value))&&(E+=y.value,g+=x,$+=x*y.x,N+=x*y.y);h.x=$/g,h.y=N/g}else{y=h,y.x=y.data.x,y.y=y.data.y;do E+=s[y.data.index];while(y=y.next)}h.value=E}function p(h,E,y,x){if(!h.value)return!0;var g=h.x-e.x,$=h.y-e.y,N=x-E,v=g*g+$*$;if(N*N/c<v)return v<o&&(g===0&&(g=_t(n),v+=g*g),$===0&&($=_t(n),v+=$*$),v<r&&(v=Math.sqrt(r*v)),e.vx+=g*h.value*i/v,e.vy+=$*h.value*i/v),!0;if(h.length||v>=o)return;(h.data!==e||h.next)&&(g===0&&(g=_t(n),v+=g*g),$===0&&($=_t(n),v+=$*$),v<r&&(v=Math.sqrt(r*v)));do h.data!==e&&(N=s[h.data.index]*i/v,e.vx+=g*N,e.vy+=$*N);while(h=h.next)}return l.initialize=function(h,E){t=h,n=E,d()},l.strength=function(h){return arguments.length?(a=typeof h=="function"?h:tt(+h),d(),l):a},l.distanceMin=function(h){return arguments.length?(r=h*h,l):Math.sqrt(r)},l.distanceMax=function(h){return arguments.length?(o=h*h,l):Math.sqrt(o)},l.theta=function(h){return arguments.length?(c=h*h,l):Math.sqrt(c)},l}function ul(t){var e=tt(.1),n,i,a;typeof t!="function"&&(t=tt(t==null?0:+t));function s(o){for(var c=0,l=n.length,d;c<l;++c)d=n[c],d.vx+=(a[c]-d.x)*i[c]*o}function r(){if(n){var o,c=n.length;for(i=new Array(c),a=new Array(c),o=0;o<c;++o)i[o]=isNaN(a[o]=+t(n[o],o,n))?0:+e(n[o],o,n)}}return s.initialize=function(o){n=o,r()},s.strength=function(o){return arguments.length?(e=typeof o=="function"?o:tt(+o),r(),s):e},s.x=function(o){return arguments.length?(t=typeof o=="function"?o:tt(+o),r(),s):t},s}function fl(t){var e=tt(.1),n,i,a;typeof t!="function"&&(t=tt(t==null?0:+t));function s(o){for(var c=0,l=n.length,d;c<l;++c)d=n[c],d.vy+=(a[c]-d.y)*i[c]*o}function r(){if(n){var o,c=n.length;for(i=new Array(c),a=new Array(c),o=0;o<c;++o)i[o]=isNaN(a[o]=+t(n[o],o,n))?0:+e(n[o],o,n)}}return s.initialize=function(o){n=o,r()},s.strength=function(o){return arguments.length?(e=typeof o=="function"?o:tt(+o),r(),s):e},s.y=function(o){return arguments.length?(t=typeof o=="function"?o:tt(+o),r(),s):t},s}const Qt=t=>()=>t;function pl(t,{sourceEvent:e,target:n,transform:i,dispatch:a}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:i,enumerable:!0,configurable:!0},_:{value:a}})}function mt(t,e,n){this.k=t,this.x=e,this.y=n}mt.prototype={constructor:mt,scale:function(t){return t===1?this:new mt(this.k*t,this.x,this.y)},translate:function(t,e){return t===0&e===0?this:new mt(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var bi=new mt(1,0,0);mt.prototype;function $e(t){t.stopImmediatePropagation()}function Pt(t){t.preventDefault(),t.stopImmediatePropagation()}function hl(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function ml(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function Cn(){return this.__zoom||bi}function gl(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function vl(){return navigator.maxTouchPoints||"ontouchstart"in this}function yl(t,e,n){var i=t.invertX(e[0][0])-n[0][0],a=t.invertX(e[1][0])-n[1][0],s=t.invertY(e[0][1])-n[0][1],r=t.invertY(e[1][1])-n[1][1];return t.translate(a>i?(i+a)/2:Math.min(0,i)||Math.max(0,a),r>s?(s+r)/2:Math.min(0,s)||Math.max(0,r))}function _l(){var t=hl,e=ml,n=yl,i=gl,a=vl,s=[0,1/0],r=[[-1/0,-1/0],[1/0,1/0]],o=250,c=xr,l=Gt("start","zoom","end"),d,b,p,h=500,E=150,y=0,x=10;function g(m){m.property("__zoom",Cn).on("wheel.zoom",M,{passive:!1}).on("mousedown.zoom",P).on("dblclick.zoom",I).filter(a).on("touchstart.zoom",B).on("touchmove.zoom",j).on("touchend.zoom touchcancel.zoom",G).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}g.transform=function(m,u,f,w){var A=m.selection?m.selection():m;A.property("__zoom",Cn),m!==A?C(m,u,f,w):A.interrupt().each(function(){_(this,arguments).event(w).start().zoom(null,typeof u=="function"?u.apply(this,arguments):u).end()})},g.scaleBy=function(m,u,f,w){g.scaleTo(m,function(){var A=this.__zoom.k,L=typeof u=="function"?u.apply(this,arguments):u;return A*L},f,w)},g.scaleTo=function(m,u,f,w){g.transform(m,function(){var A=e.apply(this,arguments),L=this.__zoom,R=f==null?v(A):typeof f=="function"?f.apply(this,arguments):f,D=L.invert(R),z=typeof u=="function"?u.apply(this,arguments):u;return n(N($(L,z),R,D),A,r)},f,w)},g.translateBy=function(m,u,f,w){g.transform(m,function(){return n(this.__zoom.translate(typeof u=="function"?u.apply(this,arguments):u,typeof f=="function"?f.apply(this,arguments):f),e.apply(this,arguments),r)},null,w)},g.translateTo=function(m,u,f,w,A){g.transform(m,function(){var L=e.apply(this,arguments),R=this.__zoom,D=w==null?v(L):typeof w=="function"?w.apply(this,arguments):w;return n(bi.translate(D[0],D[1]).scale(R.k).translate(typeof u=="function"?-u.apply(this,arguments):-u,typeof f=="function"?-f.apply(this,arguments):-f),L,r)},w,A)};function $(m,u){return u=Math.max(s[0],Math.min(s[1],u)),u===m.k?m:new mt(u,m.x,m.y)}function N(m,u,f){var w=u[0]-f[0]*m.k,A=u[1]-f[1]*m.k;return w===m.x&&A===m.y?m:new mt(m.k,w,A)}function v(m){return[(+m[0][0]+ +m[1][0])/2,(+m[0][1]+ +m[1][1])/2]}function C(m,u,f,w){m.on("start.zoom",function(){_(this,arguments).event(w).start()}).on("interrupt.zoom end.zoom",function(){_(this,arguments).event(w).end()}).tween("zoom",function(){var A=this,L=arguments,R=_(A,L).event(w),D=e.apply(A,L),z=f==null?v(D):typeof f=="function"?f.apply(A,L):f,U=Math.max(D[1][0]-D[0][0],D[1][1]-D[0][1]),F=A.__zoom,q=typeof u=="function"?u.apply(A,L):u,V=c(F.invert(z).concat(U/F.k),q.invert(z).concat(U/q.k));return function(Y){if(Y===1)Y=q;else{var X=V(Y),bt=U/X[2];Y=new mt(bt,z[0]-X[0]*bt,z[1]-X[1]*bt)}R.zoom(null,Y)}})}function _(m,u,f){return!f&&m.__zooming||new T(m,u)}function T(m,u){this.that=m,this.args=u,this.active=0,this.sourceEvent=null,this.extent=e.apply(m,u),this.taps=0}T.prototype={event:function(m){return m&&(this.sourceEvent=m),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(m,u){return this.mouse&&m!=="mouse"&&(this.mouse[1]=u.invert(this.mouse[0])),this.touch0&&m!=="touch"&&(this.touch0[1]=u.invert(this.touch0[0])),this.touch1&&m!=="touch"&&(this.touch1[1]=u.invert(this.touch1[0])),this.that.__zoom=u,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(m){var u=J(this.that).datum();l.call(m,this.that,new pl(m,{sourceEvent:this.sourceEvent,target:g,transform:this.that.__zoom,dispatch:l}),u)}};function M(m,...u){if(!t.apply(this,arguments))return;var f=_(this,u).event(m),w=this.__zoom,A=Math.max(s[0],Math.min(s[1],w.k*Math.pow(2,i.apply(this,arguments)))),L=ht(m);if(f.wheel)(f.mouse[0][0]!==L[0]||f.mouse[0][1]!==L[1])&&(f.mouse[1]=w.invert(f.mouse[0]=L)),clearTimeout(f.wheel);else{if(w.k===A)return;f.mouse=[L,w.invert(L)],oe(this),f.start()}Pt(m),f.wheel=setTimeout(R,E),f.zoom("mouse",n(N($(w,A),f.mouse[0],f.mouse[1]),f.extent,r));function R(){f.wheel=null,f.end()}}function P(m,...u){if(p||!t.apply(this,arguments))return;var f=m.currentTarget,w=_(this,u,!0).event(m),A=J(m.view).on("mousemove.zoom",z,!0).on("mouseup.zoom",U,!0),L=ht(m,f),R=m.clientX,D=m.clientY;si(m.view),$e(m),w.mouse=[L,this.__zoom.invert(L)],oe(this),w.start();function z(F){if(Pt(F),!w.moved){var q=F.clientX-R,V=F.clientY-D;w.moved=q*q+V*V>y}w.event(F).zoom("mouse",n(N(w.that.__zoom,w.mouse[0]=ht(F,f),w.mouse[1]),w.extent,r))}function U(F){A.on("mousemove.zoom mouseup.zoom",null),ri(F.view,w.moved),Pt(F),w.event(F).end()}}function I(m,...u){if(t.apply(this,arguments)){var f=this.__zoom,w=ht(m.changedTouches?m.changedTouches[0]:m,this),A=f.invert(w),L=f.k*(m.shiftKey?.5:2),R=n(N($(f,L),w,A),e.apply(this,u),r);Pt(m),o>0?J(this).transition().duration(o).call(C,R,w,m):J(this).call(g.transform,R,w,m)}}function B(m,...u){if(t.apply(this,arguments)){var f=m.touches,w=f.length,A=_(this,u,m.changedTouches.length===w).event(m),L,R,D,z;for($e(m),R=0;R<w;++R)D=f[R],z=ht(D,this),z=[z,this.__zoom.invert(z),D.identifier],A.touch0?!A.touch1&&A.touch0[2]!==z[2]&&(A.touch1=z,A.taps=0):(A.touch0=z,L=!0,A.taps=1+!!d);d&&(d=clearTimeout(d)),L&&(A.taps<2&&(b=z[0],d=setTimeout(function(){d=null},h)),oe(this),A.start())}}function j(m,...u){if(this.__zooming){var f=_(this,u).event(m),w=m.changedTouches,A=w.length,L,R,D,z;for(Pt(m),L=0;L<A;++L)R=w[L],D=ht(R,this),f.touch0&&f.touch0[2]===R.identifier?f.touch0[0]=D:f.touch1&&f.touch1[2]===R.identifier&&(f.touch1[0]=D);if(R=f.that.__zoom,f.touch1){var U=f.touch0[0],F=f.touch0[1],q=f.touch1[0],V=f.touch1[1],Y=(Y=q[0]-U[0])*Y+(Y=q[1]-U[1])*Y,X=(X=V[0]-F[0])*X+(X=V[1]-F[1])*X;R=$(R,Math.sqrt(Y/X)),D=[(U[0]+q[0])/2,(U[1]+q[1])/2],z=[(F[0]+V[0])/2,(F[1]+V[1])/2]}else if(f.touch0)D=f.touch0[0],z=f.touch0[1];else return;f.zoom("touch",n(N(R,D,z),f.extent,r))}}function G(m,...u){if(this.__zooming){var f=_(this,u).event(m),w=m.changedTouches,A=w.length,L,R;for($e(m),p&&clearTimeout(p),p=setTimeout(function(){p=null},h),L=0;L<A;++L)R=w[L],f.touch0&&f.touch0[2]===R.identifier?delete f.touch0:f.touch1&&f.touch1[2]===R.identifier&&delete f.touch1;if(f.touch1&&!f.touch0&&(f.touch0=f.touch1,delete f.touch1),f.touch0)f.touch0[1]=this.__zoom.invert(f.touch0[0]);else if(f.end(),f.taps===2&&(R=ht(R,this),Math.hypot(b[0]-R[0],b[1]-R[1])<x)){var D=J(this).on("dblclick.zoom");D&&D.apply(this,arguments)}}}return g.wheelDelta=function(m){return arguments.length?(i=typeof m=="function"?m:Qt(+m),g):i},g.filter=function(m){return arguments.length?(t=typeof m=="function"?m:Qt(!!m),g):t},g.touchable=function(m){return arguments.length?(a=typeof m=="function"?m:Qt(!!m),g):a},g.extent=function(m){return arguments.length?(e=typeof m=="function"?m:Qt([[+m[0][0],+m[0][1]],[+m[1][0],+m[1][1]]]),g):e},g.scaleExtent=function(m){return arguments.length?(s[0]=+m[0],s[1]=+m[1],g):[s[0],s[1]]},g.translateExtent=function(m){return arguments.length?(r[0][0]=+m[0][0],r[1][0]=+m[1][0],r[0][1]=+m[0][1],r[1][1]=+m[1][1],g):[[r[0][0],r[0][1]],[r[1][0],r[1][1]]]},g.constrain=function(m){return arguments.length?(n=m,g):n},g.duration=function(m){return arguments.length?(o=+m,g):o},g.interpolate=function(m){return arguments.length?(c=m,g):c},g.on=function(){var m=l.on.apply(l,arguments);return m===l?g:m},g.clickDistance=function(m){return arguments.length?(y=(m=+m)*m,g):Math.sqrt(y)},g.tapDistance=function(m){return arguments.length?(x=+m,g):x},g}let Zt=null,lt=null,It=!0,ze=null,je=null,yt=new Set;const Ln=["#FF6B35","#004E89","#7B2D8E","#1A936F","#C5283D","#E9724C","#3498db","#9b59b6","#27ae60","#f39c12"];function bl(t){var n;const e=window.appState.projectId;lt=null,yt=new Set,t.innerHTML=`
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
              <input type="checkbox" id="edge-label-checkbox" ${It?"checked":""} />
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
  `,(n=document.getElementById("edge-label-checkbox"))==null||n.addEventListener("change",i=>{It=i.target.checked,ze&&ze.style("display",It?"block":"none"),je&&je.style("display",It?"block":"none")}),e&&xl(e)}async function xl(t){try{const[e,n]=await Promise.all([K.getGraph(t),K.getAgents(t)]),i=e.nodes||[],a=e.edges||[],s=n.agents||[];document.getElementById("graph-stats").textContent=`NODES: ${i.length} | EDGES: ${a.length} | AGENTS: ${s.length}`,wl(s),El(i,a)}catch(e){document.getElementById("graph-stats").textContent=S("graph_load_error"),console.error("Graph load error:",e)}}function wl(t){const e=document.getElementById("agents-list");if(!t.length){e.innerHTML=`<p class="muted mono-xs">${S("graph_no_agents")}</p>`;return}const n={Self:"person",Family:"family_restroom",Mentor:"school",Partner:"favorite",School:"domain",Employer:"business",City:"location_city",Industry:"trending_up",Risk:"warning"};e.innerHTML=t.map(i=>`
    <div class="agent-card" data-agent-type="${i.agent_type}" style="border-left: 3px solid ${Mn(i.agent_type)}">
      <div class="agent-card-header">
        <span class="material-symbols-outlined icon-sm" style="color:${Mn(i.agent_type)}">${n[i.agent_type]||"smart_toy"}</span>
        <strong class="mono-xs">${i.name||i.agent_type}</strong>
        <span class="badge badge-sm">${i.agent_type}</span>
      </div>
      <p class="agent-persona">${i.persona||""}</p>
      ${i.stance?`<div class="mono-xs muted">STANCE: ${i.stance} | INFLUENCE: ${(i.influence*100).toFixed(0)}%</div>`:""}
    </div>
  `).join("")}function Mn(t){return{Self:"#c9a0ff",Factor:"#556677",Family:"#ff9eb1",Mentor:"#7ecfff",School:"#ffd17e",Employer:"#7eff9e",City:"#ff7eb3",Industry:"#b4ff7e",Risk:"#ff7e7e",Partner:"#ffb07e",Person:"#888"}[t]||"#666"}function El(t,e){Zt&&(Zt.stop(),Zt=null);const n=document.getElementById("graph-canvas-wrap"),i=J("#graph-svg"),a=n.clientWidth||800,s=n.clientHeight||600;if(i.attr("width",a).attr("height",s).attr("viewBox",`0 0 ${a} ${s}`),i.selectAll("*").remove(),!t.length){i.append("text").attr("x",a/2).attr("y",s/2).attr("text-anchor","middle").attr("fill","#666").attr("font-family","monospace").text(S("graph_no_data"));return}const r={};t.forEach(u=>{r[u.uuid||u.id]=u});const o={};let c=0;t.forEach(u=>{var w;const f=((w=u.labels)==null?void 0:w.find(A=>A!=="Entity"))||u.type||u.group||"Entity";o[f]||(o[f]=Ln[c%Ln.length],c++)});const l=u=>o[u]||"#999",d=t.map(u=>{var f;return{id:u.uuid||u.id,name:u.name||"Unnamed",type:((f=u.labels)==null?void 0:f.find(w=>w!=="Entity"))||u.type||u.group||"Entity",rawData:u}}),b=new Set(d.map(u=>u.id)),p={},h={},E=new Set,y=e.filter(u=>{const f=u.source_node_uuid||u.source,w=u.target_node_uuid||u.target;return b.has(f)&&b.has(w)});y.forEach(u=>{var A,L;const f=u.source_node_uuid||u.source,w=u.target_node_uuid||u.target;if(f===w)h[f]||(h[f]=[]),h[f].push({...u,source_name:(A=r[f])==null?void 0:A.name,target_name:(L=r[w])==null?void 0:L.name});else{const R=[f,w].sort().join("_");p[R]=(p[R]||0)+1}});const x={},g=[];y.forEach(u=>{var F,q,V;const f=u.source_node_uuid||u.source,w=u.target_node_uuid||u.target;if(f===w){if(E.has(f))return;E.add(f);const Y=h[f],X=((F=r[f])==null?void 0:F.name)||"Unknown";g.push({source:f,target:w,type:"SELF_LOOP",name:`Self (${Y.length})`,curvature:0,isSelfLoop:!0,rawData:{isSelfLoopGroup:!0,source_name:X,target_name:X,selfLoopCount:Y.length,selfLoopEdges:Y}});return}const L=[f,w].sort().join("_"),R=p[L],D=x[L]||0;x[L]=D+1;const z=f>w;let U=0;if(R>1){const Y=Math.min(1.2,.6+R*.15);U=(D/(R-1)-.5)*Y*2,z&&(U=-U)}g.push({source:f,target:w,type:u.fact_type||u.relation||u.name||"RELATED",name:u.name||u.relation||u.fact_type||"RELATED",curvature:U,isSelfLoop:!1,pairIndex:D,pairTotal:R,rawData:{...u,source_name:(q=r[f])==null?void 0:q.name,target_name:(V=r[w])==null?void 0:V.name}})});const $=cl(d).force("link",el(g).id(u=>u.id).distance(u=>150+((u.pairTotal||1)-1)*50)).force("charge",dl().strength(-400)).force("center",Po(a/2,s/2)).force("collide",Zo(50)).force("x",ul(a/2).strength(.04)).force("y",fl(s/2).strength(.04));Zt=$,i.append("defs").html(`
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-strong"><feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  `);const v=i.append("g");i.call(_l().extent([[0,0],[a,s]]).scaleExtent([.1,4]).on("zoom",u=>{v.attr("transform",u.transform)}));function C(u){const f=u.source.x,w=u.source.y,A=u.target.x,L=u.target.y;if(u.isSelfLoop){const Si=f+8,Ai=w-4,Ni=f+8,Ci=w+4;return`M${Si},${Ai} A30,30 0 1,1 ${Ni},${Ci}`}if(u.curvature===0)return`M${f},${w} L${A},${L}`;const R=A-f,D=L-w,z=Math.sqrt(R*R+D*D)||1,F=.25+(u.pairTotal||1)*.05,q=Math.max(35,z*F),V=-D/z*u.curvature*q,Y=R/z*u.curvature*q,X=(f+A)/2+V,bt=(w+L)/2+Y;return`M${f},${w} Q${X},${bt} ${A},${L}`}function _(u){const f=u.source.x,w=u.source.y,A=u.target.x,L=u.target.y;if(u.isSelfLoop)return{x:f+70,y:w};if(u.curvature===0)return{x:(f+A)/2,y:(w+L)/2};const R=A-f,D=L-w,z=Math.sqrt(R*R+D*D)||1,F=.25+(u.pairTotal||1)*.05,q=Math.max(35,z*F),V=-D/z*u.curvature*q,Y=R/z*u.curvature*q,X=(f+A)/2+V,bt=(w+L)/2+Y;return{x:.25*f+.5*X+.25*A,y:.25*w+.5*bt+.25*L}}const T=v.append("g").attr("class","links"),M=T.selectAll("path").data(g).enter().append("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5).attr("fill","none").style("cursor","pointer").on("click",(u,f)=>{u.stopPropagation(),ke(T,j,P,I),J(u.target).attr("stroke","#3498db").attr("stroke-width",3),te({type:"edge",data:f.rawData})}),P=T.selectAll("rect.link-label-bg").data(g).enter().append("rect").attr("class","link-label-bg").attr("fill","rgba(255,255,255,0.95)").attr("rx",3).attr("ry",3).style("cursor","pointer").style("pointer-events","all").style("display",It?"block":"none").on("click",(u,f)=>{u.stopPropagation(),ke(T,j,P,I),M.filter(w=>w===f).attr("stroke","#3498db").attr("stroke-width",3),te({type:"edge",data:f.rawData})}),I=T.selectAll("text.link-label").data(g).enter().append("text").attr("class","link-label").text(u=>u.name).attr("font-size","9px").attr("fill","#999").attr("text-anchor","middle").attr("dominant-baseline","middle").style("cursor","pointer").style("pointer-events","all").style("font-family","'Inter', system-ui, sans-serif").style("display",It?"block":"none").on("click",(u,f)=>{u.stopPropagation(),ke(T,j,P,I),M.filter(w=>w===f).attr("stroke","#3498db").attr("stroke-width",3),te({type:"edge",data:f.rawData})});ze=I,je=P;const B=v.append("g").attr("class","nodes"),j=B.selectAll("circle").data(d).enter().append("circle").attr("r",12).attr("fill",u=>l(u.type)).attr("stroke","#fff").attr("stroke-width",2.5).style("cursor","pointer").attr("filter","url(#glow)").call(Ws().on("start",(u,f)=>{f.fx=f.x,f.fy=f.y,f._dragStartX=u.x,f._dragStartY=u.y,f._isDragging=!1}).on("drag",(u,f)=>{const w=u.x-f._dragStartX,A=u.y-f._dragStartY,L=Math.sqrt(w*w+A*A);!f._isDragging&&L>3&&(f._isDragging=!0,$.alphaTarget(.3).restart()),f._isDragging&&(f.fx=u.x,f.fy=u.y)}).on("end",(u,f)=>{f._isDragging&&$.alphaTarget(0),f.fx=null,f.fy=null,f._isDragging=!1})).on("click",(u,f)=>{u.stopPropagation(),j.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)"),T.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),J(u.target).attr("stroke","#0F766E").attr("stroke-width",4).attr("filter","url(#glow-strong)"),M.filter(A=>A.source.id===f.id||A.target.id===f.id).attr("stroke","#0F766E").attr("stroke-width",2.5);const w=document.getElementById("graph-hint");w&&(w.style.display="none"),te({type:"node",data:f.rawData,entityType:f.type,color:l(f.type)})}).on("mouseenter",(u,f)=>{var w,A;(!lt||(((w=lt.data)==null?void 0:w.uuid)||((A=lt.data)==null?void 0:A.id))!==(f.rawData.uuid||f.rawData.id))&&J(u.target).attr("stroke","#333").attr("stroke-width",3)}).on("mouseleave",(u,f)=>{var w,A;(!lt||(((w=lt.data)==null?void 0:w.uuid)||((A=lt.data)==null?void 0:A.id))!==(f.rawData.uuid||f.rawData.id))&&J(u.target).attr("stroke","#fff").attr("stroke-width",2.5)}),G=B.selectAll("text").data(d).enter().append("text").text(u=>u.name.length>8?u.name.substring(0,8)+"…":u.name).attr("font-size","11px").attr("fill","#bbb").attr("font-weight","500").attr("dx",16).attr("dy",4).style("pointer-events","none").style("font-family","'Inter', sans-serif");$.on("tick",()=>{M.attr("d",u=>C(u)),I.each(function(u){const f=_(u);J(this).attr("x",f.x).attr("y",f.y).attr("transform","")}),P.each(function(u,f){const w=_(u),A=I.nodes()[f];if(A){const L=A.getBBox();J(this).attr("x",w.x-L.width/2-4).attr("y",w.y-L.height/2-2).attr("width",L.width+8).attr("height",L.height+4).attr("transform","")}}),j.attr("cx",u=>u.x).attr("cy",u=>u.y),G.attr("x",u=>u.x).attr("y",u=>u.y)}),i.on("click",()=>{lt=null,j.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)"),T.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),P.attr("fill","rgba(255,255,255,0.95)"),I.attr("fill","#999"),_e()}),Tl(o);const m=()=>{const u=n.clientWidth,f=n.clientHeight;i.attr("width",u).attr("height",f).attr("viewBox",`0 0 ${u} ${f}`)};window.addEventListener("resize",m)}function ke(t,e,n,i){t&&t.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),n&&n.attr("fill","rgba(255,255,255,0.95)"),i&&i.attr("fill","#999"),e&&e.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)")}function te(t){lt=t;const e=document.getElementById("graph-detail-panel");e&&(e.style.display="flex",t.type==="node"?$l(e,t):kl(e,t))}function _e(){const t=document.getElementById("graph-detail-panel");t&&(t.style.display="none"),lt=null,yt=new Set}function $l(t,e){var r;const n=e.data,i=n.attributes||n.properties||{},a=n.labels||[],s=n.summary||n.persona||n.description||"";t.innerHTML=`
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
        <span class="gd-value">${nn(n.created_at)}</span>
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
  `,(r=document.getElementById("gd-close"))==null||r.addEventListener("click",o=>{o.stopPropagation(),_e()})}function kl(t,e){var i,a;const n=e.data;if(n.isSelfLoopGroup){xi(t,n);return}t.innerHTML=`
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
        <span class="gd-value">${nn(n.created_at)}</span>
      </div>`:""}
    </div>
  `,(a=document.getElementById("gd-close"))==null||a.addEventListener("click",s=>{s.stopPropagation(),_e()})}function xi(t,e){var i;const n=e.selfLoopEdges||[];t.innerHTML=`
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
            <div class="gd-self-item ${yt.has(r)?"expanded":""}" data-self-id="${r}">
              <div class="gd-self-item-header" data-toggle-id="${r}">
                <span class="gd-self-idx">#${s+1}</span>
                <span class="gd-self-name">${a.name||a.fact_type||"RELATED"}</span>
                <span class="gd-self-toggle">${yt.has(r)?"−":"+"}</span>
              </div>
              <div class="gd-self-item-content" style="display:${yt.has(r)?"block":"none"};">
                ${a.uuid?`<div class="gd-row"><span class="gd-label">UUID:</span><span class="gd-value gd-uuid">${a.uuid}</span></div>`:""}
                ${a.fact?`<div class="gd-row"><span class="gd-label">Fact:</span><span class="gd-value gd-fact">${a.fact}</span></div>`:""}
                ${a.fact_type?`<div class="gd-row"><span class="gd-label">Type:</span><span class="gd-value">${a.fact_type}</span></div>`:""}
                ${a.created_at?`<div class="gd-row"><span class="gd-label">Created:</span><span class="gd-value">${nn(a.created_at)}</span></div>`:""}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,t.querySelectorAll("[data-toggle-id]").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.toggleId,r=isNaN(s)?s:parseInt(s);yt.has(r)?yt.delete(r):yt.add(r),xi(t,e)})}),(i=document.getElementById("gd-close"))==null||i.addEventListener("click",a=>{a.stopPropagation(),_e()})}function Tl(t){const e=document.getElementById("graph-legend-panel");if(!e)return;const n=Object.entries(t);n.length!==0&&(e.innerHTML=`
    <span class="gl-title">Entity Types</span>
    <div class="gl-items">
      ${n.map(([i,a])=>`
        <div class="gl-item">
          <span class="gl-dot" style="background:${a};"></span>
          <span class="gl-label">${i}</span>
        </div>
      `).join("")}
    </div>
  `)}function nn(t){if(!t)return"";try{return new Date(t).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}catch{return t}}const k={currentPage:"landing",projectId:null,project:null,simComplete:!1,simConfig:{rounds:12,timeUnit:"quarter",agentCount:8},simulationTab:"tree",resultsView:"overview",selectedPathId:null,backtrackNodeIndex:null,treeEvents:[]},wi={landing:Pi,onboarding:ne,parameters:Ie,simulation:qi,results:dt,graph:bl},He=new Set;function Lt(t=[]){k.treeEvents=Array.isArray(t)?[...t]:[]}function an(t){t!=null&&t.id&&(k.treeEvents.some(e=>e.id===t.id)||(k.treeEvents=[...k.treeEvents,t],He.forEach(e=>e(t))))}function Il(t,{replay:e=!1}={}){return He.add(t),e&&k.treeEvents.forEach(n=>t(n)),()=>He.delete(t)}function Ei(t,e={}){t!=null&&t.id&&(k.projectId=t.id,k.project=t,k.simComplete=t.status==="completed"||Array.isArray(t.paths)&&t.paths.length>0,k.simulationTab=e.simulationTab||"tree",k.resultsView=e.resultsView||"overview",k.selectedPathId=e.selectedPathId||null,k.backtrackNodeIndex=null,Lt(t._tree_events||[]),Object.assign(k,e))}function Sl(){k.simComplete=!1,k.simulationTab="tree",k.resultsView="overview",k.selectedPathId=null,k.backtrackNodeIndex=null,Lt([])}function $i(){var t;return k.currentPage==="simulation"&&!k.simComplete&&((t=k.project)==null?void 0:t.status)!=="completed"}function ki(t){var e,n;return t==="landing"?!0:k.projectId?t==="simulation"?["profiled","configured","simulating","completed"].includes(((e=k.project)==null?void 0:e.status)||""):t==="graph"||t==="results"?k.simComplete||((n=k.project)==null?void 0:n.status)==="completed":!0:!1}function Ti(t){return ki(t)?$i()&&t!=="simulation":!0}function at(t,e={}){if(Ti(t)){he();return}Object.assign(k,e);const n=sn(t);if(n===k.currentPage&&Object.keys(e).length===0){he();return}k.currentPage=n,window.location.hash=n,rn()}function sn(t){var e;return!k.projectId&&["simulation","graph","results"].includes(t)?"landing":["graph","results"].includes(t)&&!k.simComplete&&((e=k.project)==null?void 0:e.status)!=="completed"?"simulation":t}window.navigateTo=at;window.appState=k;window.t=S;function rn(){const t=document.getElementById("app"),e=sn(k.currentPage);k.currentPage=e;const n=wi[e];n&&n(t),he(),Al()}function he(){const t={landing:"nav_simulation",simulation:"nav_system",graph:"nav_graph",results:"nav_reports"},e=$i();document.querySelectorAll(".nav-link[data-page]").forEach(n=>{const i=n.dataset.page,a=!ki(i)||e&&i!=="simulation";n.classList.toggle("active",i===k.currentPage),n.classList.toggle("nav-disabled",a),n.setAttribute("aria-disabled",a?"true":"false");const s=t[i];s&&(n.textContent=S(s))})}function Al(){const t=document.getElementById("lang-toggle");t&&(t.textContent=S("lang_switch"))}function Ii(){const t=window.location.hash.slice(1)||"landing";if(wi[t]){if(Ti(t)){window.location.hash!=="#simulation"&&(window.location.hash="simulation"),he();return}k.currentPage=sn(t),rn()}}window.addEventListener("hashchange",Ii);window.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".nav-link[data-page]").forEach(e=>{e.addEventListener("click",n=>{n.preventDefault(),at(e.dataset.page)})});const t=document.getElementById("lang-toggle");t&&t.addEventListener("click",()=>{Mi(),rn()}),Ii()});
