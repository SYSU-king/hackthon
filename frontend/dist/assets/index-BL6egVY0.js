(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const _e="";async function tt(t,e,n=null){const i={method:t,headers:{"Content-Type":"application/json"}};n&&(i.body=JSON.stringify(n));const a=await fetch(`${_e}${e}`,i);if(!a.ok){const s=await a.json().catch(()=>({detail:a.statusText}));throw new Error(s.detail||"API Error")}return a.json()}const it={health:()=>tt("GET","/api/health"),createProject:t=>tt("POST","/api/projects",{title:t}),listProjects:()=>tt("GET","/api/projects"),getProject:t=>tt("GET",`/api/projects/${t}`),deleteProject:t=>tt("DELETE",`/api/projects/${t}`),submitProfile:(t,e)=>tt("POST",`/api/projects/${t}/profile`,e),submitParameters:(t,e)=>tt("POST",`/api/projects/${t}/parameters`,{parameters:e}),startSimulation:(t,e=12,n="quarter")=>fetch(`${_e}/api/projects/${t}/simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rounds:e,time_unit:n})}),reSimulate:(t,e=12,n="quarter")=>fetch(`${_e}/api/projects/${t}/re-simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rounds:e,time_unit:n})}),getPaths:t=>tt("GET",`/api/projects/${t}/paths`),getPathDetail:(t,e)=>tt("GET",`/api/projects/${t}/paths/${e}`),getAdvice:(t,e,n="satisfied")=>tt("POST",`/api/projects/${t}/paths/${e}/advice`,{feedback:n}),getGraph:t=>tt("GET",`/api/projects/${t}/graph`),getAgents:t=>tt("GET",`/api/projects/${t}/agents`),getReport:t=>tt("GET",`/api/projects/${t}/report`),getTreeEvents:t=>tt("GET",`/api/projects/${t}/tree-events`)},Ue={zh:{nav_simulation:"推演",nav_graph:"图谱",nav_reports:"报告",nav_system:"系统",landing_tag:"[PROLOGUE_01]",landing_title_1:"人生不是终点。",landing_title_2:"它是一个变量。",landing_desc:"通过多智能体仿真推演，量化人生轨迹中的关键节点。调一下参数，看看你的未来会走向哪里。",landing_cta:"[开始推演]",landing_history:"[历史记录]",onboarding_title:"构建你的人物模型",step_personality:"性格分析",step_education:"教育背景",step_academic:"学术信息",step_family:"家庭背景",step_career:"职业倾向",step_concern:"核心困惑",btn_next:"下一步",btn_prev:"上一步",btn_submit:"提交档案",param_title:"定义关注参数",param_desc:"明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。",param_add:"+ 添加参数",param_primary:"主参数",param_secondary:"次参数",sim_config:"推演配置",sim_rounds:"推演轮数",sim_time_unit:"时间单位",sim_quarter:"每季度",btn_start_sim:"开始推演",btn_back_profile:"返回档案",sim_viewport:"SIMULATION_VIEWPORT",sim_tree_title:"人生路径树",sim_event_stream:"事件流",sim_metrics:"系统指标",sim_progress:"进度",sim_paths:"路径数",sim_branches:"分支数",sim_round:"当前轮次",sim_initializing:"初始化中",sim_waiting:"等待推演开始...",sim_state:"当前状态",sim_completed_view:"推演已完成",sim_completed_msg:"本项目的推演已完成，点击下方按钮查看结果。",sim_tab_tree:"推演树",sim_tab_actions:"结果导航",sim_tree_readonly:"只读模式",sim_tree_summary:"推演摘要",btn_view_graph:"查看知识图谱",btn_view_results:"查看推演报告",btn_re_simulate:"重新推演",graph_title:"人生图谱",graph_agents:"智能体",graph_node_detail:"节点详情",graph_no_agents:"暂无智能体数据",graph_no_data:"暂无图谱数据",graph_load_error:"图谱加载失败",btn_view_report:"查看推演结果",results_title:"路径分析报告",results_desc:"系统已完成推演，生成 {count} 条人生路径。点击路径卡片查看详情。",results_status:"状态: 已完成",path_optimal:"最优路径",path_conservative:"稳健路径",path_risk:"冒险路径",path_balanced:"平衡路径",path_satisfaction:"满意度预测",path_nodes:"节点数",path_risk_label:"风险",btn_new_sim:"新建推演",btn_back:"返回",detail_node_seq:"节点序列",detail_description:"描述",detail_trigger:"触发原因",detail_state_snapshot:"状态快照",btn_get_advice:"获取 AI 建议",advice_title:"策略规划",advice_desc:"针对「{path}」的 AI 行动建议",advice_satisfied:"满意模式",advice_unsatisfied:"不满意模式",advice_choose:"选择反馈模式以生成建议...",advice_generating:"正在生成建议...",advice_immediate:"近期行动",advice_mid_term:"中期布局",advice_risk_mit:"风险规避",advice_risk_analysis:"风险分析",advice_intervention:"干预节点",advice_alternative:"替代路径",advice_mental:"心理支持",advice_key_nodes:"关键节点",state_education:"学业",state_career:"职业",state_finance:"经济",state_health:"健康",state_mental:"心理",state_relationship:"关系",state_family_support:"家庭",state_social_capital:"社会资本",state_optionality:"可选择空间",state_goal_alignment:"目标达成",lang_switch:"EN",error_loading:"加载失败"},en:{nav_simulation:"SIMULATE",nav_graph:"GRAPH",nav_reports:"REPORTS",nav_system:"SYSTEM",landing_tag:"[PROLOGUE_01]",landing_title_1:"Life is not a destination.",landing_title_2:"It's a variable.",landing_desc:"Simulate life trajectories through multi-agent modeling. Tweak the parameters and see where your future leads.",landing_cta:"[START SIMULATION]",landing_history:"[VIEW HISTORY]",onboarding_title:"Build Your Profile",step_personality:"Personality",step_education:"Education",step_academic:"Academic",step_family:"Family",step_career:"Career",step_concern:"Core Concern",btn_next:"Next",btn_prev:"Previous",btn_submit:"Submit Profile",param_title:"Define Concern Parameters",param_desc:"Define your core questions. The system will diverge multi-layer influence factors and generate agents around your concerns.",param_add:"+ Add Parameter",param_primary:"Primary",param_secondary:"Secondary",sim_config:"Simulation Config",sim_rounds:"Rounds",sim_time_unit:"Time Unit",sim_quarter:"Quarterly",btn_start_sim:"Start Simulation",btn_back_profile:"Back to Profile",sim_viewport:"SIMULATION_VIEWPORT",sim_tree_title:"Life-Path Tree",sim_event_stream:"EVENT_STREAM",sim_metrics:"SYSTEM_METRICS",sim_progress:"PROGRESS",sim_paths:"PATHS",sim_branches:"BRANCHES",sim_round:"ROUND",sim_initializing:"INITIALIZING",sim_waiting:"Waiting for simulation start...",sim_state:"CURRENT_STATE",sim_completed_view:"Simulation Complete",sim_completed_msg:"Simulation has already finished. Click below to view results.",sim_tab_tree:"Derivation Tree",sim_tab_actions:"Result Hub",sim_tree_readonly:"Read-only",sim_tree_summary:"Summary",btn_view_graph:"View Knowledge Graph",btn_view_results:"View Simulation Report",btn_re_simulate:"Re-simulate",graph_title:"LIFE_GRAPH",graph_agents:"AGENTS",graph_node_detail:"NODE_DETAIL",graph_no_agents:"No agents data yet",graph_no_data:"No graph data available",graph_load_error:"GRAPH_LOAD_ERROR",btn_view_report:"View Results",results_title:"Path Analysis Report",results_desc:"Simulation complete. {count} life paths generated. Click a card to view details.",results_status:"STATUS: COMPLETED",path_optimal:"Optimal Path",path_conservative:"Conservative Path",path_risk:"Risk Path",path_balanced:"Balanced Path",path_satisfaction:"Satisfaction",path_nodes:"Nodes",path_risk_label:"Risk",btn_new_sim:"New Simulation",btn_back:"Back",detail_node_seq:"NODE_SEQUENCE",detail_description:"Description",detail_trigger:"Trigger Reason",detail_state_snapshot:"State Snapshot",btn_get_advice:"Get AI Advice",advice_title:"Strategy Protocol",advice_desc:'AI-powered advice for "{path}"',advice_satisfied:"Satisfied Mode",advice_unsatisfied:"Unsatisfied Mode",advice_choose:"Choose feedback mode to generate advice...",advice_generating:"GENERATING_ADVICE...",advice_immediate:"Immediate Actions",advice_mid_term:"Mid-term Plan",advice_risk_mit:"Risk Mitigation",advice_risk_analysis:"Risk Analysis",advice_intervention:"Intervention Points",advice_alternative:"Alternative Paths",advice_mental:"Mental Support",advice_key_nodes:"Key Nodes",state_education:"Education",state_career:"Career",state_finance:"Finance",state_health:"Health",state_mental:"Mental",state_relationship:"Relationship",state_family_support:"Family",state_social_capital:"Social Capital",state_optionality:"Optionality",state_goal_alignment:"Goal Alignment",lang_switch:"中文",error_loading:"Loading failed"}};let Re=localStorage.getItem("lifepath_lang")||"zh";function T(t){var e;return((e=Ue[Re])==null?void 0:e[t])||Ue.zh[t]||t}function fi(t){Re=t,localStorage.setItem("lifepath_lang",t)}function pi(){fi(Re==="zh"?"en":"zh")}function wn(t){return T(`state_${t}`)}const hi=["education","career","finance","health","mental","relationship","family_support","social_capital","optionality","goal_alignment"];function mi(t){t.innerHTML=`
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-left">
        <div class="mono-xs hero-tag">${T("landing_tag")}</div>
        <h1 class="hero-title">${T("landing_title_1")}<br/><em>${T("landing_title_2")}</em></h1>
        <p class="hero-desc">${T("landing_desc")}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="btn-questionnaire">${T("landing_cta")}</button>
          <button class="btn btn-ghost" id="btn-history">${T("landing_history")}</button>
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
            <path d="M50 300 L 750 300" stroke="#FF4500" stroke-width="1.5"/>
            <rect x="395" y="145" width="10" height="10" fill="white" stroke="black"/>
            <rect x="395" y="295" width="10" height="10" fill="#FF4500"/>
            <rect x="395" y="445" width="10" height="10" fill="white" stroke="black"/>
            <text x="415" y="155" font-family="Space Grotesk" font-size="10" fill="black">BRANCH_A: OPTIMAL</text>
            <text x="415" y="305" font-family="Space Grotesk" font-size="10" fill="#FF4500">CURRENT_PATH</text>
            <text x="415" y="455" font-family="Space Grotesk" font-size="10" fill="black">BRANCH_B: DEGRADED</text>
            <circle cx="50" cy="300" r="4" fill="black"/>
            <circle cx="400" cy="300" r="6" fill="#FF4500"/>
            <circle cx="750" cy="300" r="4" fill="black"/>
          </svg>
          <div style="position:absolute;top:40px;left:40px;" class="mono-xs text-muted">NODE_ID: 0x4F2A<br/><span class="status-dot status-active" style="display:inline-block;margin-right:4px;"></span>LIVE</div>
          <div style="position:absolute;bottom:40px;right:40px;text-align:right;" class="mono-xs text-muted">
            LIVE_RENDER_ACTIVE
            <div style="display:flex;gap:4px;justify-content:flex-end;margin-top:8px;">
              <div style="width:16px;height:4px;background:#FF4500;"></div>
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
        <span class="mono-xs muted">© 2025 LIFEPATH-ENGINE. Based on MiroFish Architecture.</span>
      </div>
    </footer>
  `,document.getElementById("btn-questionnaire").addEventListener("click",async()=>{try{const e=await it.createProject("New Simulation");D.projectId=e.id,D.project=e,ct("onboarding")}catch(e){alert("Failed to create project: "+e.message)}}),document.getElementById("btn-history").addEventListener("click",async()=>{try{const e=await it.listProjects();if(e.length>0){const n=e[0];D.projectId=n.id;const i=await it.getProject(n.id);D.project=i,i.status==="completed"?(D.simComplete=!0,ct("results")):ct("onboarding")}else alert("No history projects found. Start a new simulation!")}catch(e){alert("Error: "+e.message)}})}const gt=[{key:"personality",label:"PERSONALITY_TYPE",title:"性格倾向"},{key:"education",label:"EDUCATION_STAGE",title:"教育阶段"},{key:"background",label:"ACADEMIC_BACKGROUND",title:"学业背景"},{key:"family",label:"FAMILY_CONDITIONS",title:"家庭情况"},{key:"preference",label:"CAREER_PREFERENCE",title:"职业偏好"},{key:"concern",label:"CORE_CONCERN",title:"核心困惑"}];let W=0,B={personality_type:"",education_stage:"",school:"",major:"",gpa_range:"",family_economy:"",family_expectation:"",city_preference:"",career_preference:"",risk_preference:"balanced",current_concern:""};const qt={personality:[{value:"INTJ",label:"战略家 INTJ",desc:"独立思考、目标导向"},{value:"INFP",label:"调停者 INFP",desc:"理想主义、富有同情"},{value:"ENTP",label:"辩论家 ENTP",desc:"创新求变、挑战常规"},{value:"ISFJ",label:"守卫者 ISFJ",desc:"踏实稳重、富有责任"},{value:"ENTJ",label:"指挥官 ENTJ",desc:"强势果断、天生领导"},{value:"INTP",label:"逻辑学家 INTP",desc:"分析深入、追求真理"}],education:[{value:"high_school",label:"高中在读",desc:"面临高考选择"},{value:"undergraduate",label:"本科在读",desc:"面临保研/考研/就业"},{value:"graduate",label:"研究生在读",desc:"面临就业/读博"},{value:"working_1_3",label:"工作 1-3 年",desc:"面临转型/深造"},{value:"working_3_plus",label:"工作 3 年以上",desc:"面临突破/转行"}],career:[{value:"大厂",label:"互联网大厂",desc:"高薪高压，快速成长"},{value:"体制内",label:"体制内/国企",desc:"稳定安全，节奏适中"},{value:"科研",label:"科研院所/高校",desc:"深耕学术，自由度高"},{value:"创业",label:"自主创业",desc:"风险极高，回报无上限"},{value:"外企",label:"外资企业",desc:"Work-life balance"},{value:"自由",label:"自由职业",desc:"灵活自主，收入不稳"}],risk:[{value:"conservative",label:"保守型",desc:"优先稳定，规避风险"},{value:"balanced",label:"平衡型",desc:"可接受适度风险"},{value:"aggressive",label:"激进型",desc:"追求高回报，敢于冒险"}]};function xe(){const t=gt[W];switch(t.key){case"personality":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">选择最接近你的性格类型</p>
        <div class="radio-grid">
          ${qt.personality.map(e=>`
            <div class="radio-card ${B.personality_type===e.value?"selected":""}" data-field="personality_type" data-value="${e.value}">
              <div class="radio-card-title">${e.label}</div>
              <div class="radio-card-desc">${e.desc}</div>
            </div>
          `).join("")}
        </div>
      `;case"education":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">你当前处于哪个阶段？</p>
        <div class="radio-grid">
          ${qt.education.map(e=>`
            <div class="radio-card ${B.education_stage===e.value?"selected":""}" data-field="education_stage" data-value="${e.value}">
              <div class="radio-card-title">${e.label}</div>
              <div class="radio-card-desc">${e.desc}</div>
            </div>
          `).join("")}
        </div>
      `;case"background":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">学业背景信息</p>
        <div class="grid-2 gap-16">
          <div class="form-group">
            <label class="form-label">学校名称</label>
            <input class="form-input" id="field-school" value="${B.school}" placeholder="如：中山大学" />
          </div>
          <div class="form-group">
            <label class="form-label">专业方向</label>
            <input class="form-input" id="field-major" value="${B.major}" placeholder="如：计算机科学" />
          </div>
          <div class="form-group">
            <label class="form-label">GPA 区间</label>
            <select class="form-select" id="field-gpa">
              <option value="">请选择</option>
              <option value="3.8+" ${B.gpa_range==="3.8+"?"selected":""}>3.8+（优秀）</option>
              <option value="3.5-3.8" ${B.gpa_range==="3.5-3.8"?"selected":""}>3.5-3.8（良好）</option>
              <option value="3.0-3.5" ${B.gpa_range==="3.0-3.5"?"selected":""}>3.0-3.5（中等）</option>
              <option value="<3.0" ${B.gpa_range==="<3.0"?"selected":""}>3.0 以下</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">城市偏好</label>
            <select class="form-select" id="field-city">
              <option value="">请选择</option>
              <option value="一线城市" ${B.city_preference==="一线城市"?"selected":""}>一线城市（北上广深）</option>
              <option value="新一线" ${B.city_preference==="新一线"?"selected":""}>新一线（杭州、成都、武汉…）</option>
              <option value="二线城市" ${B.city_preference==="二线城市"?"selected":""}>二线城市</option>
              <option value="家乡" ${B.city_preference==="家乡"?"selected":""}>留在家乡</option>
              <option value="无所谓" ${B.city_preference==="无所谓"?"selected":""}>无所谓</option>
            </select>
          </div>
        </div>
      `;case"family":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">家庭背景与支持情况</p>
        <div class="form-group">
          <label class="form-label">家庭经济状况</label>
          <div class="radio-grid">
            ${["优越","中等","一般","困难"].map(e=>`
              <div class="radio-card ${B.family_economy===e?"selected":""}" data-field="family_economy" data-value="${e}">
                <div class="radio-card-title">${e}</div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="form-group mt-24">
          <label class="form-label">家庭期望</label>
          <div class="radio-grid">
            ${["考公/体制内","留在本省","高薪优先","自由选择","读博深造"].map(e=>`
              <div class="radio-card ${B.family_expectation===e?"selected":""}" data-field="family_expectation" data-value="${e}">
                <div class="radio-card-title">${e}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;case"preference":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">职业方向与风险偏好</p>
        <div class="form-group">
          <label class="form-label">职业方向偏好</label>
          <div class="radio-grid">
            ${qt.career.map(e=>`
              <div class="radio-card ${B.career_preference===e.value?"selected":""}" data-field="career_preference" data-value="${e.value}">
                <div class="radio-card-title">${e.label}</div>
                <div class="radio-card-desc">${e.desc}</div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="form-group mt-24">
          <label class="form-label">风险偏好</label>
          <div class="radio-grid">
            ${qt.risk.map(e=>`
              <div class="radio-card ${B.risk_preference===e.value?"selected":""}" data-field="risk_preference" data-value="${e.value}">
                <div class="radio-card-title">${e.label}</div>
                <div class="radio-card-desc">${e.desc}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;case"concern":return`
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${t.title}</h2>
        <p class="text-secondary mb-24">你当前最想推演的问题是什么？</p>
        <div class="form-group">
          <label class="form-label">核心困惑（自由描述）</label>
          <textarea class="form-textarea" id="field-concern" placeholder="例如：我应该保研还是直接就业？如果选择保研，3年后的发展会比直接工作更好吗？">${B.current_concern}</textarea>
        </div>
        <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
          <div class="mono-xs text-accent" style="margin-bottom:8px;">ANALYST_NOTE:</div>
          <p style="font-size:13px;color:var(--secondary);font-style:italic;">
            "尽量描述具体的分歧点和纠结原因。系统会从你的困惑中提取关键变量，
            自动发散出多层影响因素，生成智能体并开始推演。"
          </p>
        </div>
      `}}function Zt(t){t.innerHTML=`
    <div class="onboarding-layout">
      <div class="onboarding-sidebar">
        <div class="mono-xs text-muted" style="margin-bottom:8px;">SYSTEM_ENTITY</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-size:18px;margin-bottom:4px;">[PROFILE_BUILDER]</div>
        <div class="mono-xs flex items-center gap-4"><span class="status-dot status-stable"></span> STEP ${W+1}/${gt.length}</div>
        <div class="step-indicator" style="margin-top:24px;" id="step-nav">
          ${gt.map((e,n)=>`
            <div class="step-item ${n===W?"active":""} ${n<W?"completed":""}" data-step="${n}">
              [${e.label}]
            </div>
          `).join("")}
        </div>
      </div>
      <div class="onboarding-main">
        <div style="margin-bottom:16px;" class="mono-xs text-muted">BRANCH_ID: ${D.projectId||"N/A"} // STEP ${W+1} OF ${gt.length}</div>
        <div id="step-content" class="fade-in">
          ${xe()}
        </div>
        <div class="flex justify-between mt-32">
          <button class="btn btn-ghost" id="btn-prev" ${W===0?'disabled style="opacity:0.3"':""}>[PREVIOUS]</button>
          <button class="btn ${W===gt.length-1?"btn-accent":"btn-primary"}" id="btn-next">
            ${W===gt.length-1?"[SUBMIT_PROFILE]":"[NEXT_STEP]"}
          </button>
        </div>
      </div>
    </div>
  `,t.querySelectorAll(".radio-card").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.field,i=e.dataset.value;B[n]=i,document.getElementById("step-content").innerHTML=xe(),$n(t)})}),t.querySelectorAll(".step-item").forEach(e=>{e.addEventListener("click",()=>{const n=parseInt(e.dataset.step);n<=W&&(W=n,Zt(t))})}),document.getElementById("btn-prev").addEventListener("click",()=>{W>0&&(Ve(),W--,Zt(t))}),document.getElementById("btn-next").addEventListener("click",async()=>{if(Ve(),W<gt.length-1)W++,Zt(t);else try{await it.submitProfile(D.projectId,B),W=0,ct("parameters")}catch(e){alert("Profile submission failed: "+e.message)}})}function $n(t){t.querySelectorAll(".radio-card").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.field,i=e.dataset.value;B[n]=i,document.getElementById("step-content").innerHTML=xe(),$n(t)})})}function Ve(){var e,n,i,a,s;switch(gt[W].key){case"background":B.school=((e=document.getElementById("field-school"))==null?void 0:e.value)||"",B.major=((n=document.getElementById("field-major"))==null?void 0:n.value)||"",B.gpa_range=((i=document.getElementById("field-gpa"))==null?void 0:i.value)||"",B.city_preference=((a=document.getElementById("field-city"))==null?void 0:a.value)||"";break;case"concern":B.current_concern=((s=document.getElementById("field-concern"))==null?void 0:s.value)||"";break}}let ft=[{name:"",description:"",priority:"primary",weight:1}];const gi=["primary","secondary","constraint"],vi={primary:"主参数",secondary:"次参数",constraint:"约束条件"};function be(t){t.innerHTML=`
    <div style="padding:48px 64px;max-width:960px;margin:0 auto;">
      <div class="mono-xs text-muted mb-8">PROJECT_ID: ${D.projectId} // PHASE: PARAMETER_DEFINITION</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:48px;">
        <h1 style="font-size:40px;">Define Concern Parameters</h1>
        <p class="text-secondary mt-8" style="font-size:16px;max-width:600px;">
          明确本次推演的核心问题。系统将围绕你的关注参数，自动发散多层影响因素并生成智能体。
        </p>
      </div>

      <div id="params-list">
        ${ft.map((e,n)=>yi(e,n)).join("")}
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
  `,document.getElementById("btn-add-param").addEventListener("click",()=>{ft.push({name:"",description:"",priority:"secondary",weight:.7}),be(t)}),document.getElementById("rounds-slider").addEventListener("input",e=>{document.getElementById("rounds-value").textContent=e.target.value}),document.getElementById("btn-back").addEventListener("click",()=>ct("onboarding")),document.getElementById("btn-start").addEventListener("click",async()=>{_i();const e=ft.filter(n=>n.name.trim());if(e.length===0){alert("请至少填写一个关注参数");return}try{await it.submitParameters(D.projectId,e);const n=parseInt(document.getElementById("rounds-slider").value),i=document.getElementById("time-unit").value;D.simConfig={rounds:n,timeUnit:i},ct("simulation")}catch(n){alert("Failed: "+n.message)}}),t.querySelectorAll(".param-remove").forEach(e=>{e.addEventListener("click",()=>{const n=parseInt(e.dataset.index);ft.splice(n,1),ft.length===0&&ft.push({name:"",description:"",priority:"primary",weight:1}),be(t)})}),t.querySelectorAll(".priority-select").forEach(e=>{e.addEventListener("change",n=>{const i=parseInt(e.dataset.index);ft[i].priority=n.target.value})})}function yi(t,e){return`
    <div class="param-card">
      <div class="param-priority">
        <select class="form-select priority-select" data-index="${e}" style="font-size:10px;padding:6px;">
          ${gi.map(n=>`
            <option value="${n}" ${t.priority===n?"selected":""}>${vi[n]}</option>
          `).join("")}
        </select>
      </div>
      <div class="param-name" style="flex:1;">
        <input class="form-input param-name-input" data-index="${e}" value="${t.name}" placeholder="如：保研 vs 就业" style="border-bottom-color:var(--accent);" />
      </div>
      <div class="param-weight" style="width:180px;">
        <div class="slider-container">
          <input type="range" class="slider param-weight-slider" data-index="${e}" min="0" max="1" step="0.1" value="${t.weight}" />
          <span class="mono-xs">${t.weight.toFixed(1)}</span>
        </div>
      </div>
      <button class="param-remove" data-index="${e}">×</button>
    </div>
  `}function _i(){document.querySelectorAll(".param-name-input").forEach(t=>{const e=parseInt(t.dataset.index);ft[e].name=t.value}),document.querySelectorAll(".param-weight-slider").forEach(t=>{const e=parseInt(t.dataset.index);ft[e].weight=parseFloat(t.value)})}let j=[],Dt=[],Mt="tree";function xi(t){var e,n,i;if(D.simComplete||((e=D.project)==null?void 0:e.status)==="completed"){En(t);return}t.innerHTML=`
    <div class="sim-layout">
      <!-- Canvas: Dynamic Tree Visualization -->
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${T("sim_viewport")}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${T("sim_tree_title")}: Session-${((n=D.projectId)==null?void 0:n.slice(0,4))||"X"}
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
            <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;text-transform:uppercase;">${T("sim_event_stream")}</span>
            <span class="status-dot status-active pulse" id="status-dot"></span>
          </div>
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${((i=D.projectId)==null?void 0:i.slice(0,4))||"0000"}</div>
        </div>
        <div class="sim-panel-body" id="event-log">
          <div class="console-line console-latest">
            <span class="console-ts">[--:--:--]</span>
            <span>${T("sim_waiting")}</span>
          </div>
        </div>
        <div style="padding:16px;background:var(--primary);color:var(--white);">
          <div class="flex items-center gap-8 mb-8">
            <span class="material-symbols-outlined icon-sm">info</span>
            <span class="mono-xs">${T("sim_metrics")}</span>
          </div>
          <div class="grid-2 gap-16" style="font-family:var(--font-mono);font-size:10px;">
            <div><span style="opacity:0.6;display:block;">${T("sim_progress")}</span><span id="metric-progress">0%</span></div>
            <div><span style="opacity:0.6;display:block;">${T("sim_paths")}</span><span id="metric-paths">0</span></div>
            <div><span style="opacity:0.6;display:block;">${T("sim_branches")}</span><span id="metric-branches">1</span></div>
            <div><span style="opacity:0.6;display:block;">${T("sim_round")}</span><span id="metric-round">0</span></div>
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
        <div class="mono-xs text-muted">${T("sim_state")}</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-style:italic;font-size:16px;" id="state-label">${T("sim_initializing")}</div>
      </div>
    </footer>
  `,j=[],Dt=[],kn(),$i(t)}function En(t){t.innerHTML=`
    <div class="sim-completed-tabbed">
      <!-- Tab Bar -->
      <div class="sim-tab-bar">
        <button class="sim-tab ${Mt==="tree"?"sim-tab-active":""}" data-tab="tree">
          <span class="material-symbols-outlined icon-sm">account_tree</span>
          ${T("sim_tab_tree")||"推演树"}
        </button>
        <button class="sim-tab ${Mt==="actions"?"sim-tab-active":""}" data-tab="actions">
          <span class="material-symbols-outlined icon-sm">dashboard</span>
          ${T("sim_tab_actions")||"结果导航"}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="sim-tab-content" id="sim-tab-content"></div>
    </div>
  `,t.querySelectorAll(".sim-tab").forEach(n=>{n.addEventListener("click",()=>{Mt=n.dataset.tab,En(t)})});const e=document.getElementById("sim-tab-content");Mt==="tree"?bi(e):wi(e)}async function bi(t){var e,n;t.innerHTML=`
    <div class="sim-layout" style="height:calc(100vh - var(--topnav-h) - 56px);">
      <section class="sim-canvas">
        <div style="position:absolute;top:16px;left:24px;z-index:10;">
          <span class="mono-xs text-muted">[SYS-882] ${T("sim_viewport")}</span>
          <h1 style="font-family:var(--font-headline);font-size:28px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">
            ${T("sim_tree_title")}: Session-${((e=D.projectId)==null?void 0:e.slice(0,4))||"X"}
          </h1>
          <div class="mono-xs text-accent" style="margin-top:8px;">
            <span class="material-symbols-outlined icon-sm" style="font-size:14px;vertical-align:text-bottom;">check_circle</span>
            ${T("sim_completed_view")||"推演已完成"} · ${T("sim_tree_readonly")||"只读模式"}
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
            <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;text-transform:uppercase;">${T("sim_tree_summary")||"推演摘要"}</span>
            <span class="status-dot status-stable"></span>
          </div>
          <div class="mono-xs text-muted">SESSION_ID: LP-E_${((n=D.projectId)==null?void 0:n.slice(0,4))||"0000"}</div>
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
            <span class="mono-xs">${T("sim_metrics")}</span>
          </div>
          <div class="grid-2 gap-16" style="font-family:var(--font-mono);font-size:10px;">
            <div><span style="opacity:0.6;display:block;">${T("sim_progress")}</span><span id="metric-progress">100%</span></div>
            <div><span style="opacity:0.6;display:block;">${T("sim_paths")}</span><span id="metric-paths">—</span></div>
            <div><span style="opacity:0.6;display:block;">${T("sim_branches")}</span><span id="metric-branches">—</span></div>
            <div><span style="opacity:0.6;display:block;">NODES</span><span id="metric-nodes">—</span></div>
          </div>
        </div>
      </aside>
    </div>
  `,j=[],Dt=[],kn();try{const a=(await it.getTreeEvents(D.projectId)).events||[];if(a.length===0){document.getElementById("tree-summary-panel").innerHTML=`
        <div class="console-line">
          <span class="console-ts">[INFO]</span>
          <span style="color:var(--outline);">暂无推演树数据</span>
        </div>
      `;return}for(const l of a)An(l);const s=j.filter(l=>l.isBranch).length,r=document.getElementById("metric-branches");r&&(r.textContent=s||1);const o=document.getElementById("metric-nodes");o&&(o.textContent=j.length);const c=document.getElementById("tree-summary-panel");c&&(c.innerHTML=`
        <div class="console-line" style="border-left:2px solid var(--accent);padding-left:12px;margin-bottom:4px;">
          <span class="console-ts" style="color:var(--accent);">[DONE]</span>
          <span style="font-weight:700;color:var(--accent);">推演完成，共 ${j.length} 个节点</span>
        </div>
        ${j.slice(0,20).map(l=>`
          <div class="console-line" style="cursor:pointer;" data-node-id="${l.id}">
            <span class="console-ts">[R${l.round}]</span>
            <span>${l.isBranch?"🔶":"⚫"} ${l.label||"—"}</span>
          </div>
        `).join("")}
        ${j.length>20?`
          <div class="console-line">
            <span class="console-ts">[...]</span>
            <span style="color:var(--outline);">还有 ${j.length-20} 个节点</span>
          </div>
        `:""}
      `,c.querySelectorAll("[data-node-id]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.nodeId,_=j.find(h=>h.id===d);_&&Sn(_,{clientX:0,clientY:0,stopPropagation:()=>{}})})}))}catch(i){document.getElementById("tree-summary-panel").innerHTML=`
      <div class="console-line">
        <span class="console-ts">[ERR]</span>
        <span style="color:var(--error);">加载失败: ${i.message}</span>
      </div>
    `}}function wi(t){var e;t.innerHTML=`
    <div style="min-height:calc(100vh - var(--topnav-h) - 56px);display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;max-width:560px;padding:48px;">
        <span class="material-symbols-outlined" style="font-size:64px;color:var(--accent);margin-bottom:24px;display:block;">check_circle</span>
        <h1 style="font-size:40px;margin-bottom:16px;">${T("sim_completed_view")}</h1>
        <p class="text-secondary" style="margin-bottom:48px;font-size:16px;line-height:1.7;">
          ${T("sim_completed_msg")}
        </p>
        <div class="flex gap-16 justify-center" style="flex-wrap:wrap;">
          <button class="btn btn-accent" onclick="navigateTo('graph')">
            <span class="material-symbols-outlined icon-sm">hub</span> ${T("btn_view_graph")}
          </button>
          <button class="btn btn-primary" onclick="navigateTo('results')">
            <span class="material-symbols-outlined icon-sm">assessment</span> ${T("btn_view_results")}
          </button>
          <button class="btn btn-ghost" id="btn-resim">
            <span class="material-symbols-outlined icon-sm">replay</span> ${T("btn_re_simulate")}
          </button>
        </div>
      </div>
    </div>
  `,(e=document.getElementById("btn-resim"))==null||e.addEventListener("click",async()=>{D.simComplete=!1,D.project&&(D.project.status="simulating"),Mt="tree",ct("simulation")})}async function $i(t){const e=D.simConfig||{rounds:12,timeUnit:"quarter"};try{const i=(await it.startSimulation(D.projectId,e.rounds,e.timeUnit)).body.getReader(),a=new TextDecoder;let s="";for(;;){const{done:r,value:o}=await i.read();if(r)break;s+=a.decode(o,{stream:!0});const c=s.split(`

`);s=c.pop()||"";for(const l of c)if(l.startsWith("data: "))try{const d=JSON.parse(l.slice(6));Ei(d,t)}catch{}}}catch(n){Tn("ERROR",`Simulation failed: ${n.message}`,!0)}}function Ei(t,e){const{phase:n,progress:i,message:a,round:s,total:r,path_count:o,agent_count:c,engine:l,tree_event:d}=t,_=document.getElementById("progress-fill"),h=document.getElementById("progress-label");_&&h&&i!==void 0&&(_.style.width=`${i}%`,h.style.left=`${i}%`,h.textContent=`${i}%`);const m=document.getElementById("metric-progress");if(m&&i!==void 0&&(m.textContent=`${i}%`),n==="tree_event"&&d){An(d);return}if(a){const y=new Date().toLocaleTimeString("en-US",{hour12:!1});Tn(y,a,n==="completed"||n==="branch")}if(n==="branch"){const y=document.getElementById("metric-branches");if(y){const x=parseInt(y.textContent)||1;y.textContent=x+1}}if(n==="simulating"){const y=document.getElementById("metric-round");if(y&&a){const x=a.match(/第 (\d+)/);x&&(y.textContent=x[1])}}const $=document.getElementById("state-label");if($){if(n==="init")$.textContent="⚡ AI_ENGINE";else if(n==="parameter_expansion")$.textContent="AI_EXPAND";else if(n==="agent_generation")$.textContent="AGENT_GEN";else if(n==="graph_building")$.textContent="GRAPH_BUILD";else if(n==="simulating")$.textContent="SIM_ACTIVE";else if(n==="branch")$.textContent="🌿 BRANCH";else if(n==="generating_paths")$.textContent="PATH_GEN";else if(n==="error"){$.textContent="❌ ERROR";const y=document.getElementById("status-dot");y&&(y.classList.remove("pulse"),y.classList.add("status-error"))}else if(n==="completed"){$.textContent="✅ AI_COMPLETE";const y=document.getElementById("status-dot");y&&(y.classList.remove("pulse"),y.classList.add("status-stable"));const x=document.getElementById("metric-paths");x&&(x.textContent=o||0),D.simComplete=!0;const g=c>0?"graph":"results";setTimeout(()=>ct(g),1500)}}}function Tn(t,e,n=!1){const i=document.getElementById("event-log");if(!i)return;i.querySelectorAll(".console-latest").forEach(s=>s.classList.remove("console-latest"));const a=document.createElement("div");a.className=`console-line ${n?"console-latest":""}`,a.innerHTML=`
    <span class="console-ts">[${t}]</span>
    <span ${n?'style="font-weight:700;color:var(--accent);"':""}>${e}</span>
  `,i.prepend(a)}const Xe={decision:"#FF4500",opportunity:"#2E7D32",result:"#555",cascade:"#1565C0",risk:"#BA1A1A",reflection:"#777",branch:"#FF4500",default:"#444"},we={optimal:"#2E7D32",conservative:"#555",risk:"#FF4500",balanced:"#1565C0"};function kn(){const t=document.getElementById("tree-svg");if(!t)return;const e=document.getElementById("tree-container"),n=(e==null?void 0:e.clientWidth)||800,i=(e==null?void 0:e.clientHeight)||600;t.setAttribute("viewBox",`0 0 ${n} ${i}`),t.innerHTML=`
    <defs>
      <filter id="tree-glow"><feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g id="tree-edges"></g>
    <g id="tree-nodes"></g>
  `}function An(t){t.type==="add_node"?Ti(t):t.type==="branch"&&ki(t),Ai()}function Ti(t){if(j.find(n=>n.id===t.id))return;let e=t.parent;if(e&&!j.find(n=>n.id===e)){const n=j.find(i=>!i.parent);e=n?n.id:null}j.push({id:t.id,parent:e,label:t.label||"",round:t.round||0,time_label:t.time_label||"",type:t.node_type||"result",isBranch:!1,tendency:""})}function ki(t){var n;if(j.find(i=>i.id===t.id))return;let e=t.parent;if(e&&!j.find(i=>i.id===e)){const i=j.filter(a=>a.round<=(t.round||0)).sort((a,s)=>s.round-a.round);e=i.length>0?i[0].id:((n=j[0])==null?void 0:n.id)||null}j.push({id:t.id,parent:e,label:t.label||"",round:t.round||0,time_label:t.time_label||"",type:"branch",isBranch:!0,tendency:t.tendency||"balanced"})}function Ai(){const t=document.getElementById("tree-svg");if(!t)return;const e=document.getElementById("tree-container"),n=(e==null?void 0:e.clientWidth)||800,i=(e==null?void 0:e.clientHeight)||600,a={},s={};for(const u of j)s[u.id]=u,u.parent&&(a[u.parent]=a[u.parent]||[]).push(u);const r=80,o=70,c=140,l=j.find(u=>!u.parent);if(!l)return;function d(u){const w=a[u]||[];return w.length===0?1:w.reduce((I,S)=>I+d(S.id),0)}function _(u,w=0){const I=a[u]||[];return I.length===0?w:Math.max(...I.map(S=>_(S.id,w+1)))}const h=_(l.id),m=d(l.id),$=Math.max(n,m*c+80),y=Math.max(i,r+(h+1)*o+60);t.setAttribute("viewBox",`0 0 ${$} ${y}`);function x(u,w,I,S){const E=s[u];if(!E)return;E.x=w+I/2,E.y=r+S*o;const M=a[u]||[];if(M.length===0)return;const R=M.reduce((F,q)=>F+d(q.id),0);let z=w;for(const F of M){const v=d(F.id)/R*I;x(F.id,z,Math.max(v,c),S+1),z+=v}}x(l.id,40,$-80,0),Dt=[];for(const u of j)u.parent&&s[u.parent]&&Dt.push({from:s[u.parent],to:u});const g="http://www.w3.org/2000/svg",k=t.querySelector("#tree-edges"),C=t.querySelector("#tree-nodes");k.innerHTML="",C.innerHTML="";for(const u of Dt){if(u.from.x===void 0||u.to.x===void 0)continue;const w=document.createElementNS(g,"path"),I=u.from.x,S=u.from.y,E=u.to.x,M=u.to.y,R=(S+M)/2;w.setAttribute("d",`M${I},${S} C${I},${R} ${E},${R} ${E},${M}`),w.setAttribute("stroke",u.to.isBranch?we[u.to.tendency]||"#FF4500":"#666"),w.setAttribute("stroke-width",u.to.isBranch?"2.5":"1.5"),w.setAttribute("fill","none"),w.setAttribute("stroke-opacity","0.6"),u.to.isBranch&&w.setAttribute("stroke-dasharray","6,3"),w.style.opacity="0",w.style.transition="opacity 0.5s",k.appendChild(w),requestAnimationFrame(()=>{w.style.opacity="1"})}for(const u of j){if(u.x===void 0)continue;const w=document.createElementNS(g,"g");w.setAttribute("data-node-id",u.id),w.style.opacity="0",w.style.transition="opacity 0.4s",w.style.cursor="pointer";const I=u.isBranch?we[u.tendency]||"#FF4500":Xe[u.type]||Xe.default;if(u.isBranch){const E=document.createElementNS(g,"polygon"),M=14;E.setAttribute("points",`${u.x},${u.y-M} ${u.x+M},${u.y} ${u.x},${u.y+M} ${u.x-M},${u.y}`),E.setAttribute("fill",I),E.setAttribute("filter","url(#tree-glow)"),w.appendChild(E)}else if(u.parent){const E=document.createElementNS(g,"rect");E.setAttribute("x",u.x-50),E.setAttribute("y",u.y-14),E.setAttribute("width",100),E.setAttribute("height",28),E.setAttribute("fill","#F3F3F3"),E.setAttribute("stroke",I),E.setAttribute("stroke-width","1"),w.appendChild(E);const M=document.createElementNS(g,"rect");M.setAttribute("x",u.x-50),M.setAttribute("y",u.y-14),M.setAttribute("width",4),M.setAttribute("height",28),M.setAttribute("fill",I),w.appendChild(M)}else{const E=document.createElementNS(g,"rect");E.setAttribute("x",u.x-45),E.setAttribute("y",u.y-14),E.setAttribute("width",90),E.setAttribute("height",28),E.setAttribute("fill","#000"),w.appendChild(E)}const S=document.createElementNS(g,"text");if(S.setAttribute("x",u.x),S.setAttribute("y",u.y+4),S.setAttribute("text-anchor","middle"),S.setAttribute("fill",u.parent?"#333":"#fff"),S.setAttribute("font-family","Space Grotesk"),S.setAttribute("font-size",u.parent?"9":"10"),S.setAttribute("font-weight",u.isBranch?"bold":"normal"),S.textContent=(u.label||"").slice(0,14),w.appendChild(S),u.time_label&&u.parent){const E=document.createElementNS(g,"text");E.setAttribute("x",u.x),E.setAttribute("y",u.y+24),E.setAttribute("text-anchor","middle"),E.setAttribute("fill","#999"),E.setAttribute("font-family","Space Grotesk"),E.setAttribute("font-size","8"),E.textContent=u.time_label,w.appendChild(E)}w.addEventListener("click",E=>{E.stopPropagation(),Sn(u,E)}),C.appendChild(w),requestAnimationFrame(()=>{w.style.opacity="1"})}t.addEventListener("click",()=>{In()})}function Sn(t,e){var l;const n=document.getElementById("tree-node-tooltip");if(!n)return;const i={decision:"🔴 决策节点",opportunity:"🟢 机会节点",result:"⚫ 结果节点",cascade:"🔵 连锁节点",risk:"🟥 风险节点",reflection:"⬜ 反思节点",branch:"🔶 分支起点"},a={optimal:"最优路径",conservative:"稳健路径",risk:"冒险路径",balanced:"平衡路径"},r=document.getElementById("tree-container").getBoundingClientRect();let o=(e.clientX||r.left+r.width/2)-r.left+16,c=(e.clientY||r.top+r.height/2)-r.top-10;o+260>r.width&&(o=o-276),c+160>r.height&&(c=r.height-170),o<0&&(o=10),c<0&&(c=10),n.style.left=`${o}px`,n.style.top=`${c}px`,n.style.display="block",n.innerHTML=`
    <div class="tree-tooltip-header">
      <span>${i[t.type]||t.type}</span>
      <button class="tree-tooltip-close" id="tooltip-close">✕</button>
    </div>
    <div class="tree-tooltip-title">${t.label||"—"}</div>
    ${t.time_label?`<div class="tree-tooltip-time">${t.time_label} · Round ${t.round}</div>`:""}
    ${t.isBranch&&t.tendency?`<div class="tree-tooltip-tendency" style="color:${we[t.tendency]||"#666"};">${a[t.tendency]||t.tendency}</div>`:""}
  `,(l=document.getElementById("tooltip-close"))==null||l.addEventListener("click",d=>{d.stopPropagation(),In()})}function In(){const t=document.getElementById("tree-node-tooltip");t&&(t.style.display="none")}let Tt=null,ot="overview";const $e={decision:"var(--primary)",opportunity:"var(--accent)",result:"#2E7D32",cascade:"#5E5E5E",risk:"var(--error)",reflection:"#1565C0"};async function $t(t){let e=[];try{e=(await it.getPaths(D.projectId)).paths||[]}catch(n){t.innerHTML=`<div class="p-48 text-center"><h1>${T("error_loading")}</h1><p>${n.message}</p></div>`;return}ot==="overview"?We(t,e):ot==="detail"&&Tt?Ni(t,Tt):ot==="advice"&&Tt?Li(t,Tt):ot==="report"?Nn(t):We(t,e)}function We(t,e){var i;const n=T("results_desc").replace("{count}",e.length);t.innerHTML=`
    <div class="results-header">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end">
        <div>
          <h1 style="font-size:48px;">${T("results_title")}</h1>
          <p class="text-secondary mt-8" style="max-width:600px;">${n}</p>
        </div>
        <div class="text-right">
          <div class="mono-xs text-muted">PROJECT: ${D.projectId}</div>
          <div class="mono-xs text-muted">${T("results_status")}</div>
        </div>
      </div>
    </div>
    <div class="results-body">
      ${e.map(a=>Si(a)).join("")}
      <div class="flex justify-between mt-32" style="flex-wrap:wrap;gap:12px;">
        <div class="flex gap-8" style="flex-wrap:wrap;">
          <button class="btn btn-ghost" onclick="navigateTo('graph')">
            <span class="material-symbols-outlined icon-sm">hub</span> ${T("nav_graph")}
          </button>
          <button class="btn btn-ghost" onclick="navigateTo('landing')">[${T("btn_new_sim")}]</button>
        </div>
        <button class="btn btn-accent" id="btn-report">
          <span class="material-symbols-outlined icon-sm">summarize</span> ${T("btn_view_report")||"VIEW REPORT"}
        </button>
      </div>
    </div>
  `,t.querySelectorAll(".path-card").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.pathId;Tt=e.find(r=>r.id===s),ot="detail",$t(t)})}),(i=document.getElementById("btn-report"))==null||i.addEventListener("click",()=>{ot="report",$t(t)})}function Si(t){var i;T("path_optimal"),T("path_conservative"),T("path_risk"),T("path_balanced");const e={low:"#2E7D32",medium:"#FF8F00",high:"var(--error)"},n=Math.round(t.satisfaction_score*100);return`
    <div class="path-card" data-path-id="${t.id}">
      <div class="path-card-header">
        <div>
          <span class="tag tag-${t.path_type==="optimal"?"accent":t.path_type==="risk"?"primary":"outline"}">[${t.path_type.toUpperCase()}]</span>
          <div class="path-card-name mt-8">${t.name}</div>
        </div>
        <div style="text-align:right;">
          <div class="mono-xs text-muted">${((i=t.nodes)==null?void 0:i.length)||0} ${T("path_nodes")}</div>
          <div class="mono-xs" style="color:${e[t.risk_level]||e.medium};">${T("path_risk_label")}: ${t.risk_level.toUpperCase()}</div>
        </div>
      </div>
      <p class="path-card-summary">${t.summary}</p>
      <div class="path-card-stats">
        <div class="path-stat">
          <div class="path-stat-value" style="color:${n>70?"#2E7D32":n>50?"#FF8F00":"var(--error)"};">${n}%</div>
          <div class="path-stat-label">${T("path_satisfaction")}</div>
        </div>
        ${Ii(t.final_state)}
      </div>
    </div>
  `}function Ii(t){return t?["education","career","finance","health"].map(n=>`
    <div class="path-stat">
      <div class="path-stat-value">${Math.round((t[n]||0)*100)}%</div>
      <div class="path-stat-label">${wn(n)}</div>
    </div>
  `).join(""):""}function Ni(t,e){const n=e.nodes||[],i=n[0];t.innerHTML=`
    <div class="detail-header">
      <div class="flex items-center gap-16 mb-8">
        <button class="btn btn-ghost" id="btn-back-overview" style="padding:8px 16px;">[← ${T("btn_back")}]</button>
        <span class="tag tag-primary">[${e.path_type.toUpperCase()}]</span>
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
        <h2 style="margin-bottom:16px;">[${T("detail_node_seq")}]</h2>
        <div id="node-list">
          ${n.map((a,s)=>`
            <div class="node-card ${s===0?"active":""}" data-index="${s}">
              <div class="node-type" style="color:${$e[a.node_type]||"var(--outline)"};">${a.node_type}</div>
              <div class="node-title">${a.title}</div>
              <div class="node-time">${a.time_label}</div>
            </div>
          `).join("")}
        </div>
        <div class="mt-24">
          <button class="btn btn-accent btn-full" id="btn-advice">[${T("btn_get_advice")}]</button>
        </div>
      </div>

      <!-- Main: Node Detail + State Chart -->
      <div class="detail-main" id="node-detail-container">
        ${i?Ke(i,0,n.length):'<p class="p-32 text-muted">No nodes</p>'}
      </div>
    </div>
  `,document.getElementById("btn-back-overview").addEventListener("click",()=>{ot="overview",$t(t)}),t.querySelectorAll(".node-card").forEach(a=>{a.addEventListener("click",()=>{t.querySelectorAll(".node-card").forEach(r=>r.classList.remove("active")),a.classList.add("active");const s=parseInt(a.dataset.index);document.getElementById("node-detail-container").innerHTML=Ke(n[s],s,n.length)})}),document.getElementById("btn-advice").addEventListener("click",()=>{ot="advice",$t(t)})}function Ke(t,e,n){const i=t.state_snapshot||{};return`
    <div class="fade-in">
      <div class="mono-xs text-muted mb-8">NODE ${e+1} OF ${n} // ${t.time_label}</div>
      <div class="border-l-primary" style="padding-left:24px;margin-bottom:32px;">
        <h1 style="font-size:32px;">${t.title}</h1>
        <div class="flex items-center gap-8 mt-8">
          <span class="tag" style="background:${$e[t.node_type]||"var(--outline)"};color:var(--white);">${t.node_type.toUpperCase()}</span>
          <span class="mono-xs">${t.time_label}</span>
        </div>
      </div>

      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">${T("detail_description")}</h3>
        <p style="font-size:14px;line-height:1.7;color:var(--secondary);">${t.description}</p>
      </div>

      ${t.trigger_reason?`
      <div class="card mb-24" style="border-left:2px solid var(--accent);">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">${T("detail_trigger")}:</div>
        <p style="font-size:14px;color:var(--secondary);">${t.trigger_reason}</p>
      </div>
      `:""}

      ${t.agent_actions&&t.agent_actions.length>0?`
      <div class="card mb-24">
        <h3 style="margin-bottom:12px;">AGENT_ACTIONS</h3>
        ${t.agent_actions.map(a=>{var s;return`
          <div style="padding:8px 12px;border-left:2px solid ${$e[(s=a.action_type)==null?void 0:s.toLowerCase()]||"#666"};margin-bottom:8px;background:var(--surface-low);">
            <div class="mono-xs" style="margin-bottom:4px;">[${a.agent_type||"AGENT"}] ${a.action_type||"ACTION"}</div>
            <p style="font-size:13px;color:var(--secondary);">${a.narrative||""}</p>
          </div>
        `}).join("")}
      </div>
      `:""}

      <div class="card mb-24">
        <h3 style="margin-bottom:16px;">${T("detail_state_snapshot")}</h3>
        ${hi.map(a=>{const s=i[a]||0,r=Math.round(s*100),o=r>70?"#2E7D32":r>40?"#FF8F00":"var(--error)";return`
            <div class="state-bar-container">
              <div class="state-bar-label">
                <span>${wn(a)}</span>
                <span style="color:${o}">${r}%</span>
              </div>
              <div class="state-bar">
                <div class="state-bar-fill" style="width:${r}%;background:${o};"></div>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}async function Nn(t,e){var n,i;t.innerHTML=`
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">Comprehensive Report</h1>
          <p class="text-secondary mt-8">多路径对比分析与综合建议</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-from-report">[← ${T("btn_back")}]</button>
        </div>
      </div>

      <div id="report-content">
        <div class="text-center p-48 text-muted pulse mono-xs">正在生成综合评估报告...</div>
      </div>
    </div>
  `,(n=document.getElementById("btn-back-from-report"))==null||n.addEventListener("click",()=>{ot="overview",$t(t)});try{const a=await it.getReport(D.projectId);Ci(a)}catch(a){document.getElementById("report-content").innerHTML=`
      <div class="p-32 text-center text-error">
        <p>报告生成失败: ${a.message}</p>
        <button class="btn btn-ghost mt-16" id="btn-retry-report">[RETRY]</button>
      </div>
    `,(i=document.getElementById("btn-retry-report"))==null||i.addEventListener("click",()=>{Nn(t)})}}function Ci(t){const e=document.getElementById("report-content");if(!e)return;const n=t.path_comparison||[],i=t.critical_nodes||[],a=t.next_steps||[];e.innerHTML=`
    <div class="fade-in">
      <!-- Executive Summary -->
      <div class="card mb-24" style="border-left:4px solid var(--accent);padding:32px;">
        <h2 style="margin-bottom:16px;">${t.title||"REPORT"}</h2>
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
  `}async function Li(t,e){t.innerHTML=`
    <div style="padding:48px 64px;">
      <div class="mono-xs text-accent mb-8">[SYSTEM_DIRECTIVE]</div>
      <div class="flex justify-between items-end mb-48">
        <div>
          <h1 style="font-size:48px;">${T("advice_title")}</h1>
          <p class="text-secondary mt-8">${T("advice_desc").replace("{path}",e.name)}</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-ghost" id="btn-back-detail">[← ${T("btn_back")}]</button>
        </div>
      </div>

      <div class="flex gap-16 mb-32">
        <button class="btn btn-accent" id="btn-satisfied">[${T("advice_satisfied")}]</button>
        <button class="btn btn-ghost" id="btn-unsatisfied">[${T("advice_unsatisfied")}]</button>
      </div>

      <div id="advice-content">
        <div class="text-center p-48 text-muted">${T("advice_choose")}</div>
      </div>
    </div>
  `,document.getElementById("btn-back-detail").addEventListener("click",()=>{ot="detail",$t(t)}),document.getElementById("btn-satisfied").addEventListener("click",()=>Je(t,"satisfied")),document.getElementById("btn-unsatisfied").addEventListener("click",()=>Je(t,"unsatisfied"))}async function Je(t,e){const n=document.getElementById("advice-content");n.innerHTML=`<div class="p-32 text-center mono-xs pulse">${T("advice_generating")}</div>`;try{const i=await it.getAdvice(D.projectId,Tt.id,e);e==="satisfied"?n.innerHTML=`
        <div class="fade-in">
          <h2 style="font-family:var(--font-headline);font-size:28px;font-weight:700;margin-bottom:32px;">${i.title}</h2>
          <div class="grid-3 gap-16" style="border:1px solid rgba(198,198,198,0.3);">
            <div style="padding:24px;background:var(--surface-low);border-right:1px solid rgba(198,198,198,0.3);">
              <div class="flex justify-between items-center mb-24">
                <h2>${T("advice_immediate")}</h2>
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
                <h2>${T("advice_mid_term")}</h2>
                <span class="tag tag-outline">[PHASE]</span>
              </div>
              ${(i.mid_term_plan||[]).map(a=>`
                <div class="card mb-8"><p style="font-size:13px;">${a}</p></div>
              `).join("")}
            </div>
            <div style="padding:24px;background:var(--surface-low);">
              <div class="flex justify-between items-center mb-24">
                <h2>${T("advice_risk_mit")}</h2>
                <span class="tag tag-muted">[DEFENSIVE]</span>
              </div>
              ${(i.risk_mitigation||[]).map(a=>`
                <div class="card mb-8"><p style="font-size:13px;">${a}</p></div>
              `).join("")}
            </div>
          </div>
          ${(i.key_nodes||[]).length?`
          <div class="card mt-24" style="border-left:2px solid var(--accent);">
            <div class="mono-xs text-accent mb-8">${T("advice_key_nodes")}:</div>
            ${i.key_nodes.map(a=>`<div class="advice-item">${a}</div>`).join("")}
          </div>`:""}
        </div>
      `:n.innerHTML=`
        <div class="fade-in">
          <h2 style="font-family:var(--font-headline);font-size:28px;font-weight:700;margin-bottom:32px;">${i.title}</h2>
          <div class="grid-2 gap-16">
            <div>
              <div class="advice-section">
                <h3 class="text-accent">${T("advice_risk_analysis")}</h3>
                ${(i.risk_analysis||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
              <div class="advice-section">
                <h3>${T("advice_intervention")}</h3>
                ${(i.intervention_points||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
            </div>
            <div>
              <div class="advice-section">
                <h3>${T("advice_alternative")}</h3>
                ${(i.alternative_paths||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
              <div class="advice-section">
                <h3>${T("advice_mental")}</h3>
                ${(i.mental_support||[]).map(a=>`<div class="advice-item">${a}</div>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `}catch(i){n.innerHTML=`<div class="p-32 text-center text-error">Error: ${i.message}</div>`}}var Mi={value:()=>{}};function jt(){for(var t=0,e=arguments.length,n={},i;t<e;++t){if(!(i=arguments[t]+"")||i in n||/[\s.]/.test(i))throw new Error("illegal type: "+i);n[i]=[]}return new te(n)}function te(t){this._=t}function Ri(t,e){return t.trim().split(/^|\s+/).map(function(n){var i="",a=n.indexOf(".");if(a>=0&&(i=n.slice(a+1),n=n.slice(0,a)),n&&!e.hasOwnProperty(n))throw new Error("unknown type: "+n);return{type:n,name:i}})}te.prototype=jt.prototype={constructor:te,on:function(t,e){var n=this._,i=Ri(t+"",n),a,s=-1,r=i.length;if(arguments.length<2){for(;++s<r;)if((a=(t=i[s]).type)&&(a=Pi(n[a],t.name)))return a;return}if(e!=null&&typeof e!="function")throw new Error("invalid callback: "+e);for(;++s<r;)if(a=(t=i[s]).type)n[a]=Qe(n[a],t.name,e);else if(e==null)for(a in n)n[a]=Qe(n[a],t.name,null);return this},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new te(t)},call:function(t,e){if((a=arguments.length-2)>0)for(var n=new Array(a),i=0,a,s;i<a;++i)n[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(s=this._[t],i=0,a=s.length;i<a;++i)s[i].value.apply(e,n)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var i=this._[t],a=0,s=i.length;a<s;++a)i[a].value.apply(e,n)}};function Pi(t,e){for(var n=0,i=t.length,a;n<i;++n)if((a=t[n]).name===e)return a.value}function Qe(t,e,n){for(var i=0,a=t.length;i<a;++i)if(t[i].name===e){t[i]=Mi,t=t.slice(0,i).concat(t.slice(i+1));break}return n!=null&&t.push({name:e,value:n}),t}var Ee="http://www.w3.org/1999/xhtml";const Ze={svg:"http://www.w3.org/2000/svg",xhtml:Ee,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function de(t){var e=t+="",n=e.indexOf(":");return n>=0&&(e=t.slice(0,n))!=="xmlns"&&(t=t.slice(n+1)),Ze.hasOwnProperty(e)?{space:Ze[e],local:t}:t}function Di(t){return function(){var e=this.ownerDocument,n=this.namespaceURI;return n===Ee&&e.documentElement.namespaceURI===Ee?e.createElement(t):e.createElementNS(n,t)}}function Oi(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function Cn(t){var e=de(t);return(e.local?Oi:Di)(e)}function zi(){}function Pe(t){return t==null?zi:function(){return this.querySelector(t)}}function Bi(t){typeof t!="function"&&(t=Pe(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=new Array(r),c,l,d=0;d<r;++d)(c=s[d])&&(l=t.call(c,c.__data__,d,s))&&("__data__"in c&&(l.__data__=c.__data__),o[d]=l);return new nt(i,this._parents)}function Fi(t){return t==null?[]:Array.isArray(t)?t:Array.from(t)}function Hi(){return[]}function Ln(t){return t==null?Hi:function(){return this.querySelectorAll(t)}}function ji(t){return function(){return Fi(t.apply(this,arguments))}}function Gi(t){typeof t=="function"?t=ji(t):t=Ln(t);for(var e=this._groups,n=e.length,i=[],a=[],s=0;s<n;++s)for(var r=e[s],o=r.length,c,l=0;l<o;++l)(c=r[l])&&(i.push(t.call(c,c.__data__,l,r)),a.push(c));return new nt(i,a)}function Mn(t){return function(){return this.matches(t)}}function Rn(t){return function(e){return e.matches(t)}}var Yi=Array.prototype.find;function qi(t){return function(){return Yi.call(this.children,t)}}function Ui(){return this.firstElementChild}function Vi(t){return this.select(t==null?Ui:qi(typeof t=="function"?t:Rn(t)))}var Xi=Array.prototype.filter;function Wi(){return Array.from(this.children)}function Ki(t){return function(){return Xi.call(this.children,t)}}function Ji(t){return this.selectAll(t==null?Wi:Ki(typeof t=="function"?t:Rn(t)))}function Qi(t){typeof t!="function"&&(t=Mn(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=[],c,l=0;l<r;++l)(c=s[l])&&t.call(c,c.__data__,l,s)&&o.push(c);return new nt(i,this._parents)}function Pn(t){return new Array(t.length)}function Zi(){return new nt(this._enter||this._groups.map(Pn),this._parents)}function ae(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}ae.prototype={constructor:ae,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};function ta(t){return function(){return t}}function ea(t,e,n,i,a,s){for(var r=0,o,c=e.length,l=s.length;r<l;++r)(o=e[r])?(o.__data__=s[r],i[r]=o):n[r]=new ae(t,s[r]);for(;r<c;++r)(o=e[r])&&(a[r]=o)}function na(t,e,n,i,a,s,r){var o,c,l=new Map,d=e.length,_=s.length,h=new Array(d),m;for(o=0;o<d;++o)(c=e[o])&&(h[o]=m=r.call(c,c.__data__,o,e)+"",l.has(m)?a[o]=c:l.set(m,c));for(o=0;o<_;++o)m=r.call(t,s[o],o,s)+"",(c=l.get(m))?(i[o]=c,c.__data__=s[o],l.delete(m)):n[o]=new ae(t,s[o]);for(o=0;o<d;++o)(c=e[o])&&l.get(h[o])===c&&(a[o]=c)}function ia(t){return t.__data__}function aa(t,e){if(!arguments.length)return Array.from(this,ia);var n=e?na:ea,i=this._parents,a=this._groups;typeof t!="function"&&(t=ta(t));for(var s=a.length,r=new Array(s),o=new Array(s),c=new Array(s),l=0;l<s;++l){var d=i[l],_=a[l],h=_.length,m=sa(t.call(d,d&&d.__data__,l,i)),$=m.length,y=o[l]=new Array($),x=r[l]=new Array($),g=c[l]=new Array(h);n(d,_,y,x,g,m,e);for(var k=0,C=0,u,w;k<$;++k)if(u=y[k]){for(k>=C&&(C=k+1);!(w=x[C])&&++C<$;);u._next=w||null}}return r=new nt(r,i),r._enter=o,r._exit=c,r}function sa(t){return typeof t=="object"&&"length"in t?t:Array.from(t)}function ra(){return new nt(this._exit||this._groups.map(Pn),this._parents)}function oa(t,e,n){var i=this.enter(),a=this,s=this.exit();return typeof t=="function"?(i=t(i),i&&(i=i.selection())):i=i.append(t+""),e!=null&&(a=e(a),a&&(a=a.selection())),n==null?s.remove():n(s),i&&a?i.merge(a).order():a}function la(t){for(var e=t.selection?t.selection():t,n=this._groups,i=e._groups,a=n.length,s=i.length,r=Math.min(a,s),o=new Array(a),c=0;c<r;++c)for(var l=n[c],d=i[c],_=l.length,h=o[c]=new Array(_),m,$=0;$<_;++$)(m=l[$]||d[$])&&(h[$]=m);for(;c<a;++c)o[c]=n[c];return new nt(o,this._parents)}function ca(){for(var t=this._groups,e=-1,n=t.length;++e<n;)for(var i=t[e],a=i.length-1,s=i[a],r;--a>=0;)(r=i[a])&&(s&&r.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(r,s),s=r);return this}function da(t){t||(t=ua);function e(_,h){return _&&h?t(_.__data__,h.__data__):!_-!h}for(var n=this._groups,i=n.length,a=new Array(i),s=0;s<i;++s){for(var r=n[s],o=r.length,c=a[s]=new Array(o),l,d=0;d<o;++d)(l=r[d])&&(c[d]=l);c.sort(e)}return new nt(a,this._parents).order()}function ua(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function fa(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this}function pa(){return Array.from(this)}function ha(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var i=t[e],a=0,s=i.length;a<s;++a){var r=i[a];if(r)return r}return null}function ma(){let t=0;for(const e of this)++t;return t}function ga(){return!this.node()}function va(t){for(var e=this._groups,n=0,i=e.length;n<i;++n)for(var a=e[n],s=0,r=a.length,o;s<r;++s)(o=a[s])&&t.call(o,o.__data__,s,a);return this}function ya(t){return function(){this.removeAttribute(t)}}function _a(t){return function(){this.removeAttributeNS(t.space,t.local)}}function xa(t,e){return function(){this.setAttribute(t,e)}}function ba(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function wa(t,e){return function(){var n=e.apply(this,arguments);n==null?this.removeAttribute(t):this.setAttribute(t,n)}}function $a(t,e){return function(){var n=e.apply(this,arguments);n==null?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n)}}function Ea(t,e){var n=de(t);if(arguments.length<2){var i=this.node();return n.local?i.getAttributeNS(n.space,n.local):i.getAttribute(n)}return this.each((e==null?n.local?_a:ya:typeof e=="function"?n.local?$a:wa:n.local?ba:xa)(n,e))}function Dn(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function Ta(t){return function(){this.style.removeProperty(t)}}function ka(t,e,n){return function(){this.style.setProperty(t,e,n)}}function Aa(t,e,n){return function(){var i=e.apply(this,arguments);i==null?this.style.removeProperty(t):this.style.setProperty(t,i,n)}}function Sa(t,e,n){return arguments.length>1?this.each((e==null?Ta:typeof e=="function"?Aa:ka)(t,e,n??"")):It(this.node(),t)}function It(t,e){return t.style.getPropertyValue(e)||Dn(t).getComputedStyle(t,null).getPropertyValue(e)}function Ia(t){return function(){delete this[t]}}function Na(t,e){return function(){this[t]=e}}function Ca(t,e){return function(){var n=e.apply(this,arguments);n==null?delete this[t]:this[t]=n}}function La(t,e){return arguments.length>1?this.each((e==null?Ia:typeof e=="function"?Ca:Na)(t,e)):this.node()[t]}function On(t){return t.trim().split(/^|\s+/)}function De(t){return t.classList||new zn(t)}function zn(t){this._node=t,this._names=On(t.getAttribute("class")||"")}zn.prototype={add:function(t){var e=this._names.indexOf(t);e<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};function Bn(t,e){for(var n=De(t),i=-1,a=e.length;++i<a;)n.add(e[i])}function Fn(t,e){for(var n=De(t),i=-1,a=e.length;++i<a;)n.remove(e[i])}function Ma(t){return function(){Bn(this,t)}}function Ra(t){return function(){Fn(this,t)}}function Pa(t,e){return function(){(e.apply(this,arguments)?Bn:Fn)(this,t)}}function Da(t,e){var n=On(t+"");if(arguments.length<2){for(var i=De(this.node()),a=-1,s=n.length;++a<s;)if(!i.contains(n[a]))return!1;return!0}return this.each((typeof e=="function"?Pa:e?Ma:Ra)(n,e))}function Oa(){this.textContent=""}function za(t){return function(){this.textContent=t}}function Ba(t){return function(){var e=t.apply(this,arguments);this.textContent=e??""}}function Fa(t){return arguments.length?this.each(t==null?Oa:(typeof t=="function"?Ba:za)(t)):this.node().textContent}function Ha(){this.innerHTML=""}function ja(t){return function(){this.innerHTML=t}}function Ga(t){return function(){var e=t.apply(this,arguments);this.innerHTML=e??""}}function Ya(t){return arguments.length?this.each(t==null?Ha:(typeof t=="function"?Ga:ja)(t)):this.node().innerHTML}function qa(){this.nextSibling&&this.parentNode.appendChild(this)}function Ua(){return this.each(qa)}function Va(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function Xa(){return this.each(Va)}function Wa(t){var e=typeof t=="function"?t:Cn(t);return this.select(function(){return this.appendChild(e.apply(this,arguments))})}function Ka(){return null}function Ja(t,e){var n=typeof t=="function"?t:Cn(t),i=e==null?Ka:typeof e=="function"?e:Pe(e);return this.select(function(){return this.insertBefore(n.apply(this,arguments),i.apply(this,arguments)||null)})}function Qa(){var t=this.parentNode;t&&t.removeChild(this)}function Za(){return this.each(Qa)}function ts(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function es(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function ns(t){return this.select(t?es:ts)}function is(t){return arguments.length?this.property("__data__",t):this.node().__data__}function as(t){return function(e){t.call(this,e,this.__data__)}}function ss(t){return t.trim().split(/^|\s+/).map(function(e){var n="",i=e.indexOf(".");return i>=0&&(n=e.slice(i+1),e=e.slice(0,i)),{type:e,name:n}})}function rs(t){return function(){var e=this.__on;if(e){for(var n=0,i=-1,a=e.length,s;n<a;++n)s=e[n],(!t.type||s.type===t.type)&&s.name===t.name?this.removeEventListener(s.type,s.listener,s.options):e[++i]=s;++i?e.length=i:delete this.__on}}}function os(t,e,n){return function(){var i=this.__on,a,s=as(e);if(i){for(var r=0,o=i.length;r<o;++r)if((a=i[r]).type===t.type&&a.name===t.name){this.removeEventListener(a.type,a.listener,a.options),this.addEventListener(a.type,a.listener=s,a.options=n),a.value=e;return}}this.addEventListener(t.type,s,n),a={type:t.type,name:t.name,value:e,listener:s,options:n},i?i.push(a):this.__on=[a]}}function ls(t,e,n){var i=ss(t+""),a,s=i.length,r;if(arguments.length<2){var o=this.node().__on;if(o){for(var c=0,l=o.length,d;c<l;++c)for(a=0,d=o[c];a<s;++a)if((r=i[a]).type===d.type&&r.name===d.name)return d.value}return}for(o=e?os:rs,a=0;a<s;++a)this.each(o(i[a],e,n));return this}function Hn(t,e,n){var i=Dn(t),a=i.CustomEvent;typeof a=="function"?a=new a(e,n):(a=i.document.createEvent("Event"),n?(a.initEvent(e,n.bubbles,n.cancelable),a.detail=n.detail):a.initEvent(e,!1,!1)),t.dispatchEvent(a)}function cs(t,e){return function(){return Hn(this,t,e)}}function ds(t,e){return function(){return Hn(this,t,e.apply(this,arguments))}}function us(t,e){return this.each((typeof e=="function"?ds:cs)(t,e))}function*fs(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var i=t[e],a=0,s=i.length,r;a<s;++a)(r=i[a])&&(yield r)}var jn=[null];function nt(t,e){this._groups=t,this._parents=e}function Gt(){return new nt([[document.documentElement]],jn)}function ps(){return this}nt.prototype=Gt.prototype={constructor:nt,select:Bi,selectAll:Gi,selectChild:Vi,selectChildren:Ji,filter:Qi,data:aa,enter:Zi,exit:ra,join:oa,merge:la,selection:ps,order:ca,sort:da,call:fa,nodes:pa,node:ha,size:ma,empty:ga,each:va,attr:Ea,style:Sa,property:La,classed:Da,text:Fa,html:Ya,raise:Ua,lower:Xa,append:Wa,insert:Ja,remove:Za,clone:ns,datum:is,on:ls,dispatch:us,[Symbol.iterator]:fs};function K(t){return typeof t=="string"?new nt([[document.querySelector(t)]],[document.documentElement]):new nt([[t]],jn)}function hs(t){let e;for(;e=t.sourceEvent;)t=e;return t}function pt(t,e){if(t=hs(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var i=n.createSVGPoint();return i.x=t.clientX,i.y=t.clientY,i=i.matrixTransform(e.getScreenCTM().inverse()),[i.x,i.y]}if(e.getBoundingClientRect){var a=e.getBoundingClientRect();return[t.clientX-a.left-e.clientLeft,t.clientY-a.top-e.clientTop]}}return[t.pageX,t.pageY]}const ms={passive:!1},Ot={capture:!0,passive:!1};function he(t){t.stopImmediatePropagation()}function At(t){t.preventDefault(),t.stopImmediatePropagation()}function Gn(t){var e=t.document.documentElement,n=K(t).on("dragstart.drag",At,Ot);"onselectstart"in e?n.on("selectstart.drag",At,Ot):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function Yn(t,e){var n=t.document.documentElement,i=K(t).on("dragstart.drag",null);e&&(i.on("click.drag",At,Ot),setTimeout(function(){i.on("click.drag",null)},0)),"onselectstart"in n?i.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}const Ut=t=>()=>t;function Te(t,{sourceEvent:e,subject:n,target:i,identifier:a,active:s,x:r,y:o,dx:c,dy:l,dispatch:d}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},subject:{value:n,enumerable:!0,configurable:!0},target:{value:i,enumerable:!0,configurable:!0},identifier:{value:a,enumerable:!0,configurable:!0},active:{value:s,enumerable:!0,configurable:!0},x:{value:r,enumerable:!0,configurable:!0},y:{value:o,enumerable:!0,configurable:!0},dx:{value:c,enumerable:!0,configurable:!0},dy:{value:l,enumerable:!0,configurable:!0},_:{value:d}})}Te.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};function gs(t){return!t.ctrlKey&&!t.button}function vs(){return this.parentNode}function ys(t,e){return e??{x:t.x,y:t.y}}function _s(){return navigator.maxTouchPoints||"ontouchstart"in this}function xs(){var t=gs,e=vs,n=ys,i=_s,a={},s=jt("start","drag","end"),r=0,o,c,l,d,_=0;function h(u){u.on("mousedown.drag",m).filter(i).on("touchstart.drag",x).on("touchmove.drag",g,ms).on("touchend.drag touchcancel.drag",k).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function m(u,w){if(!(d||!t.call(this,u,w))){var I=C(this,e.call(this,u,w),u,w,"mouse");I&&(K(u.view).on("mousemove.drag",$,Ot).on("mouseup.drag",y,Ot),Gn(u.view),he(u),l=!1,o=u.clientX,c=u.clientY,I("start",u))}}function $(u){if(At(u),!l){var w=u.clientX-o,I=u.clientY-c;l=w*w+I*I>_}a.mouse("drag",u)}function y(u){K(u.view).on("mousemove.drag mouseup.drag",null),Yn(u.view,l),At(u),a.mouse("end",u)}function x(u,w){if(t.call(this,u,w)){var I=u.changedTouches,S=e.call(this,u,w),E=I.length,M,R;for(M=0;M<E;++M)(R=C(this,S,u,w,I[M].identifier,I[M]))&&(he(u),R("start",u,I[M]))}}function g(u){var w=u.changedTouches,I=w.length,S,E;for(S=0;S<I;++S)(E=a[w[S].identifier])&&(At(u),E("drag",u,w[S]))}function k(u){var w=u.changedTouches,I=w.length,S,E;for(d&&clearTimeout(d),d=setTimeout(function(){d=null},500),S=0;S<I;++S)(E=a[w[S].identifier])&&(he(u),E("end",u,w[S]))}function C(u,w,I,S,E,M){var R=s.copy(),z=pt(M||I,w),F,q,v;if((v=n.call(u,new Te("beforestart",{sourceEvent:I,target:h,identifier:E,active:r,x:z[0],y:z[1],dx:0,dy:0,dispatch:R}),S))!=null)return F=v.x-z[0]||0,q=v.y-z[1]||0,function p(f,b,A){var N=z,L;switch(f){case"start":a[E]=p,L=r++;break;case"end":delete a[E],--r;case"drag":z=pt(A||b,w),L=r;break}R.call(f,u,new Te(f,{sourceEvent:b,subject:v,target:h,identifier:E,active:L,x:z[0]+F,y:z[1]+q,dx:z[0]-N[0],dy:z[1]-N[1],dispatch:R}),S)}}return h.filter=function(u){return arguments.length?(t=typeof u=="function"?u:Ut(!!u),h):t},h.container=function(u){return arguments.length?(e=typeof u=="function"?u:Ut(u),h):e},h.subject=function(u){return arguments.length?(n=typeof u=="function"?u:Ut(u),h):n},h.touchable=function(u){return arguments.length?(i=typeof u=="function"?u:Ut(!!u),h):i},h.on=function(){var u=s.on.apply(s,arguments);return u===s?h:u},h.clickDistance=function(u){return arguments.length?(_=(u=+u)*u,h):Math.sqrt(_)},h}function Oe(t,e,n){t.prototype=e.prototype=n,n.constructor=t}function qn(t,e){var n=Object.create(t.prototype);for(var i in e)n[i]=e[i];return n}function Yt(){}var zt=.7,se=1/zt,St="\\s*([+-]?\\d+)\\s*",Bt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",lt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",bs=/^#([0-9a-f]{3,8})$/,ws=new RegExp(`^rgb\\(${St},${St},${St}\\)$`),$s=new RegExp(`^rgb\\(${lt},${lt},${lt}\\)$`),Es=new RegExp(`^rgba\\(${St},${St},${St},${Bt}\\)$`),Ts=new RegExp(`^rgba\\(${lt},${lt},${lt},${Bt}\\)$`),ks=new RegExp(`^hsl\\(${Bt},${lt},${lt}\\)$`),As=new RegExp(`^hsla\\(${Bt},${lt},${lt},${Bt}\\)$`),tn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Oe(Yt,Ft,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:en,formatHex:en,formatHex8:Ss,formatHsl:Is,formatRgb:nn,toString:nn});function en(){return this.rgb().formatHex()}function Ss(){return this.rgb().formatHex8()}function Is(){return Un(this).formatHsl()}function nn(){return this.rgb().formatRgb()}function Ft(t){var e,n;return t=(t+"").trim().toLowerCase(),(e=bs.exec(t))?(n=e[1].length,e=parseInt(e[1],16),n===6?an(e):n===3?new et(e>>8&15|e>>4&240,e>>4&15|e&240,(e&15)<<4|e&15,1):n===8?Vt(e>>24&255,e>>16&255,e>>8&255,(e&255)/255):n===4?Vt(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|e&240,((e&15)<<4|e&15)/255):null):(e=ws.exec(t))?new et(e[1],e[2],e[3],1):(e=$s.exec(t))?new et(e[1]*255/100,e[2]*255/100,e[3]*255/100,1):(e=Es.exec(t))?Vt(e[1],e[2],e[3],e[4]):(e=Ts.exec(t))?Vt(e[1]*255/100,e[2]*255/100,e[3]*255/100,e[4]):(e=ks.exec(t))?on(e[1],e[2]/100,e[3]/100,1):(e=As.exec(t))?on(e[1],e[2]/100,e[3]/100,e[4]):tn.hasOwnProperty(t)?an(tn[t]):t==="transparent"?new et(NaN,NaN,NaN,0):null}function an(t){return new et(t>>16&255,t>>8&255,t&255,1)}function Vt(t,e,n,i){return i<=0&&(t=e=n=NaN),new et(t,e,n,i)}function Ns(t){return t instanceof Yt||(t=Ft(t)),t?(t=t.rgb(),new et(t.r,t.g,t.b,t.opacity)):new et}function ke(t,e,n,i){return arguments.length===1?Ns(t):new et(t,e,n,i??1)}function et(t,e,n,i){this.r=+t,this.g=+e,this.b=+n,this.opacity=+i}Oe(et,ke,qn(Yt,{brighter(t){return t=t==null?se:Math.pow(se,t),new et(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=t==null?zt:Math.pow(zt,t),new et(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new et(wt(this.r),wt(this.g),wt(this.b),re(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:sn,formatHex:sn,formatHex8:Cs,formatRgb:rn,toString:rn}));function sn(){return`#${bt(this.r)}${bt(this.g)}${bt(this.b)}`}function Cs(){return`#${bt(this.r)}${bt(this.g)}${bt(this.b)}${bt((isNaN(this.opacity)?1:this.opacity)*255)}`}function rn(){const t=re(this.opacity);return`${t===1?"rgb(":"rgba("}${wt(this.r)}, ${wt(this.g)}, ${wt(this.b)}${t===1?")":`, ${t})`}`}function re(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function wt(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function bt(t){return t=wt(t),(t<16?"0":"")+t.toString(16)}function on(t,e,n,i){return i<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new at(t,e,n,i)}function Un(t){if(t instanceof at)return new at(t.h,t.s,t.l,t.opacity);if(t instanceof Yt||(t=Ft(t)),!t)return new at;if(t instanceof at)return t;t=t.rgb();var e=t.r/255,n=t.g/255,i=t.b/255,a=Math.min(e,n,i),s=Math.max(e,n,i),r=NaN,o=s-a,c=(s+a)/2;return o?(e===s?r=(n-i)/o+(n<i)*6:n===s?r=(i-e)/o+2:r=(e-n)/o+4,o/=c<.5?s+a:2-s-a,r*=60):o=c>0&&c<1?0:r,new at(r,o,c,t.opacity)}function Ls(t,e,n,i){return arguments.length===1?Un(t):new at(t,e,n,i??1)}function at(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}Oe(at,Ls,qn(Yt,{brighter(t){return t=t==null?se:Math.pow(se,t),new at(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=t==null?zt:Math.pow(zt,t),new at(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+(this.h<0)*360,e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*e,a=2*n-i;return new et(me(t>=240?t-240:t+120,a,i),me(t,a,i),me(t<120?t+240:t-120,a,i),this.opacity)},clamp(){return new at(ln(this.h),Xt(this.s),Xt(this.l),re(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=re(this.opacity);return`${t===1?"hsl(":"hsla("}${ln(this.h)}, ${Xt(this.s)*100}%, ${Xt(this.l)*100}%${t===1?")":`, ${t})`}`}}));function ln(t){return t=(t||0)%360,t<0?t+360:t}function Xt(t){return Math.max(0,Math.min(1,t||0))}function me(t,e,n){return(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)*255}const Vn=t=>()=>t;function Ms(t,e){return function(n){return t+n*e}}function Rs(t,e,n){return t=Math.pow(t,n),e=Math.pow(e,n)-t,n=1/n,function(i){return Math.pow(t+i*e,n)}}function Ps(t){return(t=+t)==1?Xn:function(e,n){return n-e?Rs(e,n,t):Vn(isNaN(e)?n:e)}}function Xn(t,e){var n=e-t;return n?Ms(t,n):Vn(isNaN(t)?e:t)}const cn=function t(e){var n=Ps(e);function i(a,s){var r=n((a=ke(a)).r,(s=ke(s)).r),o=n(a.g,s.g),c=n(a.b,s.b),l=Xn(a.opacity,s.opacity);return function(d){return a.r=r(d),a.g=o(d),a.b=c(d),a.opacity=l(d),a+""}}return i.gamma=t,i}(1);function vt(t,e){return t=+t,e=+e,function(n){return t*(1-n)+e*n}}var Ae=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,ge=new RegExp(Ae.source,"g");function Ds(t){return function(){return t}}function Os(t){return function(e){return t(e)+""}}function zs(t,e){var n=Ae.lastIndex=ge.lastIndex=0,i,a,s,r=-1,o=[],c=[];for(t=t+"",e=e+"";(i=Ae.exec(t))&&(a=ge.exec(e));)(s=a.index)>n&&(s=e.slice(n,s),o[r]?o[r]+=s:o[++r]=s),(i=i[0])===(a=a[0])?o[r]?o[r]+=a:o[++r]=a:(o[++r]=null,c.push({i:r,x:vt(i,a)})),n=ge.lastIndex;return n<e.length&&(s=e.slice(n),o[r]?o[r]+=s:o[++r]=s),o.length<2?c[0]?Os(c[0].x):Ds(e):(e=c.length,function(l){for(var d=0,_;d<e;++d)o[(_=c[d]).i]=_.x(l);return o.join("")})}var dn=180/Math.PI,Se={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function Wn(t,e,n,i,a,s){var r,o,c;return(r=Math.sqrt(t*t+e*e))&&(t/=r,e/=r),(c=t*n+e*i)&&(n-=t*c,i-=e*c),(o=Math.sqrt(n*n+i*i))&&(n/=o,i/=o,c/=o),t*i<e*n&&(t=-t,e=-e,c=-c,r=-r),{translateX:a,translateY:s,rotate:Math.atan2(e,t)*dn,skewX:Math.atan(c)*dn,scaleX:r,scaleY:o}}var Wt;function Bs(t){const e=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(t+"");return e.isIdentity?Se:Wn(e.a,e.b,e.c,e.d,e.e,e.f)}function Fs(t){return t==null||(Wt||(Wt=document.createElementNS("http://www.w3.org/2000/svg","g")),Wt.setAttribute("transform",t),!(t=Wt.transform.baseVal.consolidate()))?Se:(t=t.matrix,Wn(t.a,t.b,t.c,t.d,t.e,t.f))}function Kn(t,e,n,i){function a(l){return l.length?l.pop()+" ":""}function s(l,d,_,h,m,$){if(l!==_||d!==h){var y=m.push("translate(",null,e,null,n);$.push({i:y-4,x:vt(l,_)},{i:y-2,x:vt(d,h)})}else(_||h)&&m.push("translate("+_+e+h+n)}function r(l,d,_,h){l!==d?(l-d>180?d+=360:d-l>180&&(l+=360),h.push({i:_.push(a(_)+"rotate(",null,i)-2,x:vt(l,d)})):d&&_.push(a(_)+"rotate("+d+i)}function o(l,d,_,h){l!==d?h.push({i:_.push(a(_)+"skewX(",null,i)-2,x:vt(l,d)}):d&&_.push(a(_)+"skewX("+d+i)}function c(l,d,_,h,m,$){if(l!==_||d!==h){var y=m.push(a(m)+"scale(",null,",",null,")");$.push({i:y-4,x:vt(l,_)},{i:y-2,x:vt(d,h)})}else(_!==1||h!==1)&&m.push(a(m)+"scale("+_+","+h+")")}return function(l,d){var _=[],h=[];return l=t(l),d=t(d),s(l.translateX,l.translateY,d.translateX,d.translateY,_,h),r(l.rotate,d.rotate,_,h),o(l.skewX,d.skewX,_,h),c(l.scaleX,l.scaleY,d.scaleX,d.scaleY,_,h),l=d=null,function(m){for(var $=-1,y=h.length,x;++$<y;)_[(x=h[$]).i]=x.x(m);return _.join("")}}}var Hs=Kn(Bs,"px, ","px)","deg)"),js=Kn(Fs,", ",")",")"),Gs=1e-12;function un(t){return((t=Math.exp(t))+1/t)/2}function Ys(t){return((t=Math.exp(t))-1/t)/2}function qs(t){return((t=Math.exp(2*t))-1)/(t+1)}const Us=function t(e,n,i){function a(s,r){var o=s[0],c=s[1],l=s[2],d=r[0],_=r[1],h=r[2],m=d-o,$=_-c,y=m*m+$*$,x,g;if(y<Gs)g=Math.log(h/l)/e,x=function(S){return[o+S*m,c+S*$,l*Math.exp(e*S*g)]};else{var k=Math.sqrt(y),C=(h*h-l*l+i*y)/(2*l*n*k),u=(h*h-l*l-i*y)/(2*h*n*k),w=Math.log(Math.sqrt(C*C+1)-C),I=Math.log(Math.sqrt(u*u+1)-u);g=(I-w)/e,x=function(S){var E=S*g,M=un(w),R=l/(n*k)*(M*qs(e*E+w)-Ys(w));return[o+R*m,c+R*$,l*M/un(e*E+w)]}}return x.duration=g*1e3*e/Math.SQRT2,x}return a.rho=function(s){var r=Math.max(.001,+s),o=r*r,c=o*o;return t(r,o,c)},a}(Math.SQRT2,2,4);var Nt=0,Rt=0,Ct=0,Jn=1e3,oe,Pt,le=0,Et=0,ue=0,Ht=typeof performance=="object"&&performance.now?performance:Date,Qn=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function ze(){return Et||(Qn(Vs),Et=Ht.now()+ue)}function Vs(){Et=0}function ce(){this._call=this._time=this._next=null}ce.prototype=Be.prototype={constructor:ce,restart:function(t,e,n){if(typeof t!="function")throw new TypeError("callback is not a function");n=(n==null?ze():+n)+(e==null?0:+e),!this._next&&Pt!==this&&(Pt?Pt._next=this:oe=this,Pt=this),this._call=t,this._time=n,Ie()},stop:function(){this._call&&(this._call=null,this._time=1/0,Ie())}};function Be(t,e,n){var i=new ce;return i.restart(t,e,n),i}function Xs(){ze(),++Nt;for(var t=oe,e;t;)(e=Et-t._time)>=0&&t._call.call(void 0,e),t=t._next;--Nt}function fn(){Et=(le=Ht.now())+ue,Nt=Rt=0;try{Xs()}finally{Nt=0,Ks(),Et=0}}function Ws(){var t=Ht.now(),e=t-le;e>Jn&&(ue-=e,le=t)}function Ks(){for(var t,e=oe,n,i=1/0;e;)e._call?(i>e._time&&(i=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:oe=n);Pt=t,Ie(i)}function Ie(t){if(!Nt){Rt&&(Rt=clearTimeout(Rt));var e=t-Et;e>24?(t<1/0&&(Rt=setTimeout(fn,t-Ht.now()-ue)),Ct&&(Ct=clearInterval(Ct))):(Ct||(le=Ht.now(),Ct=setInterval(Ws,Jn)),Nt=1,Qn(fn))}}function pn(t,e,n){var i=new ce;return e=e==null?0:+e,i.restart(a=>{i.stop(),t(a+e)},e,n),i}var Js=jt("start","end","cancel","interrupt"),Qs=[],Zn=0,hn=1,Ne=2,ee=3,mn=4,Ce=5,ne=6;function fe(t,e,n,i,a,s){var r=t.__transition;if(!r)t.__transition={};else if(n in r)return;Zs(t,n,{name:e,index:i,group:a,on:Js,tween:Qs,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:Zn})}function Fe(t,e){var n=st(t,e);if(n.state>Zn)throw new Error("too late; already scheduled");return n}function dt(t,e){var n=st(t,e);if(n.state>ee)throw new Error("too late; already running");return n}function st(t,e){var n=t.__transition;if(!n||!(n=n[e]))throw new Error("transition not found");return n}function Zs(t,e,n){var i=t.__transition,a;i[e]=n,n.timer=Be(s,0,n.time);function s(l){n.state=hn,n.timer.restart(r,n.delay,n.time),n.delay<=l&&r(l-n.delay)}function r(l){var d,_,h,m;if(n.state!==hn)return c();for(d in i)if(m=i[d],m.name===n.name){if(m.state===ee)return pn(r);m.state===mn?(m.state=ne,m.timer.stop(),m.on.call("interrupt",t,t.__data__,m.index,m.group),delete i[d]):+d<e&&(m.state=ne,m.timer.stop(),m.on.call("cancel",t,t.__data__,m.index,m.group),delete i[d])}if(pn(function(){n.state===ee&&(n.state=mn,n.timer.restart(o,n.delay,n.time),o(l))}),n.state=Ne,n.on.call("start",t,t.__data__,n.index,n.group),n.state===Ne){for(n.state=ee,a=new Array(h=n.tween.length),d=0,_=-1;d<h;++d)(m=n.tween[d].value.call(t,t.__data__,n.index,n.group))&&(a[++_]=m);a.length=_+1}}function o(l){for(var d=l<n.duration?n.ease.call(null,l/n.duration):(n.timer.restart(c),n.state=Ce,1),_=-1,h=a.length;++_<h;)a[_].call(t,d);n.state===Ce&&(n.on.call("end",t,t.__data__,n.index,n.group),c())}function c(){n.state=ne,n.timer.stop(),delete i[e];for(var l in i)return;delete t.__transition}}function ie(t,e){var n=t.__transition,i,a,s=!0,r;if(n){e=e==null?null:e+"";for(r in n){if((i=n[r]).name!==e){s=!1;continue}a=i.state>Ne&&i.state<Ce,i.state=ne,i.timer.stop(),i.on.call(a?"interrupt":"cancel",t,t.__data__,i.index,i.group),delete n[r]}s&&delete t.__transition}}function tr(t){return this.each(function(){ie(this,t)})}function er(t,e){var n,i;return function(){var a=dt(this,t),s=a.tween;if(s!==n){i=n=s;for(var r=0,o=i.length;r<o;++r)if(i[r].name===e){i=i.slice(),i.splice(r,1);break}}a.tween=i}}function nr(t,e,n){var i,a;if(typeof n!="function")throw new Error;return function(){var s=dt(this,t),r=s.tween;if(r!==i){a=(i=r).slice();for(var o={name:e,value:n},c=0,l=a.length;c<l;++c)if(a[c].name===e){a[c]=o;break}c===l&&a.push(o)}s.tween=a}}function ir(t,e){var n=this._id;if(t+="",arguments.length<2){for(var i=st(this.node(),n).tween,a=0,s=i.length,r;a<s;++a)if((r=i[a]).name===t)return r.value;return null}return this.each((e==null?er:nr)(n,t,e))}function He(t,e,n){var i=t._id;return t.each(function(){var a=dt(this,i);(a.value||(a.value={}))[e]=n.apply(this,arguments)}),function(a){return st(a,i).value[e]}}function ti(t,e){var n;return(typeof e=="number"?vt:e instanceof Ft?cn:(n=Ft(e))?(e=n,cn):zs)(t,e)}function ar(t){return function(){this.removeAttribute(t)}}function sr(t){return function(){this.removeAttributeNS(t.space,t.local)}}function rr(t,e,n){var i,a=n+"",s;return function(){var r=this.getAttribute(t);return r===a?null:r===i?s:s=e(i=r,n)}}function or(t,e,n){var i,a=n+"",s;return function(){var r=this.getAttributeNS(t.space,t.local);return r===a?null:r===i?s:s=e(i=r,n)}}function lr(t,e,n){var i,a,s;return function(){var r,o=n(this),c;return o==null?void this.removeAttribute(t):(r=this.getAttribute(t),c=o+"",r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o)))}}function cr(t,e,n){var i,a,s;return function(){var r,o=n(this),c;return o==null?void this.removeAttributeNS(t.space,t.local):(r=this.getAttributeNS(t.space,t.local),c=o+"",r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o)))}}function dr(t,e){var n=de(t),i=n==="transform"?js:ti;return this.attrTween(t,typeof e=="function"?(n.local?cr:lr)(n,i,He(this,"attr."+t,e)):e==null?(n.local?sr:ar)(n):(n.local?or:rr)(n,i,e))}function ur(t,e){return function(n){this.setAttribute(t,e.call(this,n))}}function fr(t,e){return function(n){this.setAttributeNS(t.space,t.local,e.call(this,n))}}function pr(t,e){var n,i;function a(){var s=e.apply(this,arguments);return s!==i&&(n=(i=s)&&fr(t,s)),n}return a._value=e,a}function hr(t,e){var n,i;function a(){var s=e.apply(this,arguments);return s!==i&&(n=(i=s)&&ur(t,s)),n}return a._value=e,a}function mr(t,e){var n="attr."+t;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;var i=de(t);return this.tween(n,(i.local?pr:hr)(i,e))}function gr(t,e){return function(){Fe(this,t).delay=+e.apply(this,arguments)}}function vr(t,e){return e=+e,function(){Fe(this,t).delay=e}}function yr(t){var e=this._id;return arguments.length?this.each((typeof t=="function"?gr:vr)(e,t)):st(this.node(),e).delay}function _r(t,e){return function(){dt(this,t).duration=+e.apply(this,arguments)}}function xr(t,e){return e=+e,function(){dt(this,t).duration=e}}function br(t){var e=this._id;return arguments.length?this.each((typeof t=="function"?_r:xr)(e,t)):st(this.node(),e).duration}function wr(t,e){if(typeof e!="function")throw new Error;return function(){dt(this,t).ease=e}}function $r(t){var e=this._id;return arguments.length?this.each(wr(e,t)):st(this.node(),e).ease}function Er(t,e){return function(){var n=e.apply(this,arguments);if(typeof n!="function")throw new Error;dt(this,t).ease=n}}function Tr(t){if(typeof t!="function")throw new Error;return this.each(Er(this._id,t))}function kr(t){typeof t!="function"&&(t=Mn(t));for(var e=this._groups,n=e.length,i=new Array(n),a=0;a<n;++a)for(var s=e[a],r=s.length,o=i[a]=[],c,l=0;l<r;++l)(c=s[l])&&t.call(c,c.__data__,l,s)&&o.push(c);return new mt(i,this._parents,this._name,this._id)}function Ar(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,n=t._groups,i=e.length,a=n.length,s=Math.min(i,a),r=new Array(i),o=0;o<s;++o)for(var c=e[o],l=n[o],d=c.length,_=r[o]=new Array(d),h,m=0;m<d;++m)(h=c[m]||l[m])&&(_[m]=h);for(;o<i;++o)r[o]=e[o];return new mt(r,this._parents,this._name,this._id)}function Sr(t){return(t+"").trim().split(/^|\s+/).every(function(e){var n=e.indexOf(".");return n>=0&&(e=e.slice(0,n)),!e||e==="start"})}function Ir(t,e,n){var i,a,s=Sr(e)?Fe:dt;return function(){var r=s(this,t),o=r.on;o!==i&&(a=(i=o).copy()).on(e,n),r.on=a}}function Nr(t,e){var n=this._id;return arguments.length<2?st(this.node(),n).on.on(t):this.each(Ir(n,t,e))}function Cr(t){return function(){var e=this.parentNode;for(var n in this.__transition)if(+n!==t)return;e&&e.removeChild(this)}}function Lr(){return this.on("end.remove",Cr(this._id))}function Mr(t){var e=this._name,n=this._id;typeof t!="function"&&(t=Pe(t));for(var i=this._groups,a=i.length,s=new Array(a),r=0;r<a;++r)for(var o=i[r],c=o.length,l=s[r]=new Array(c),d,_,h=0;h<c;++h)(d=o[h])&&(_=t.call(d,d.__data__,h,o))&&("__data__"in d&&(_.__data__=d.__data__),l[h]=_,fe(l[h],e,n,h,l,st(d,n)));return new mt(s,this._parents,e,n)}function Rr(t){var e=this._name,n=this._id;typeof t!="function"&&(t=Ln(t));for(var i=this._groups,a=i.length,s=[],r=[],o=0;o<a;++o)for(var c=i[o],l=c.length,d,_=0;_<l;++_)if(d=c[_]){for(var h=t.call(d,d.__data__,_,c),m,$=st(d,n),y=0,x=h.length;y<x;++y)(m=h[y])&&fe(m,e,n,y,h,$);s.push(h),r.push(d)}return new mt(s,r,e,n)}var Pr=Gt.prototype.constructor;function Dr(){return new Pr(this._groups,this._parents)}function Or(t,e){var n,i,a;return function(){var s=It(this,t),r=(this.style.removeProperty(t),It(this,t));return s===r?null:s===n&&r===i?a:a=e(n=s,i=r)}}function ei(t){return function(){this.style.removeProperty(t)}}function zr(t,e,n){var i,a=n+"",s;return function(){var r=It(this,t);return r===a?null:r===i?s:s=e(i=r,n)}}function Br(t,e,n){var i,a,s;return function(){var r=It(this,t),o=n(this),c=o+"";return o==null&&(c=o=(this.style.removeProperty(t),It(this,t))),r===c?null:r===i&&c===a?s:(a=c,s=e(i=r,o))}}function Fr(t,e){var n,i,a,s="style."+e,r="end."+s,o;return function(){var c=dt(this,t),l=c.on,d=c.value[s]==null?o||(o=ei(e)):void 0;(l!==n||a!==d)&&(i=(n=l).copy()).on(r,a=d),c.on=i}}function Hr(t,e,n){var i=(t+="")=="transform"?Hs:ti;return e==null?this.styleTween(t,Or(t,i)).on("end.style."+t,ei(t)):typeof e=="function"?this.styleTween(t,Br(t,i,He(this,"style."+t,e))).each(Fr(this._id,t)):this.styleTween(t,zr(t,i,e),n).on("end.style."+t,null)}function jr(t,e,n){return function(i){this.style.setProperty(t,e.call(this,i),n)}}function Gr(t,e,n){var i,a;function s(){var r=e.apply(this,arguments);return r!==a&&(i=(a=r)&&jr(t,r,n)),i}return s._value=e,s}function Yr(t,e,n){var i="style."+(t+="");if(arguments.length<2)return(i=this.tween(i))&&i._value;if(e==null)return this.tween(i,null);if(typeof e!="function")throw new Error;return this.tween(i,Gr(t,e,n??""))}function qr(t){return function(){this.textContent=t}}function Ur(t){return function(){var e=t(this);this.textContent=e??""}}function Vr(t){return this.tween("text",typeof t=="function"?Ur(He(this,"text",t)):qr(t==null?"":t+""))}function Xr(t){return function(e){this.textContent=t.call(this,e)}}function Wr(t){var e,n;function i(){var a=t.apply(this,arguments);return a!==n&&(e=(n=a)&&Xr(a)),e}return i._value=t,i}function Kr(t){var e="text";if(arguments.length<1)return(e=this.tween(e))&&e._value;if(t==null)return this.tween(e,null);if(typeof t!="function")throw new Error;return this.tween(e,Wr(t))}function Jr(){for(var t=this._name,e=this._id,n=ni(),i=this._groups,a=i.length,s=0;s<a;++s)for(var r=i[s],o=r.length,c,l=0;l<o;++l)if(c=r[l]){var d=st(c,e);fe(c,t,n,l,r,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new mt(i,this._parents,t,n)}function Qr(){var t,e,n=this,i=n._id,a=n.size();return new Promise(function(s,r){var o={value:r},c={value:function(){--a===0&&s()}};n.each(function(){var l=dt(this,i),d=l.on;d!==t&&(e=(t=d).copy(),e._.cancel.push(o),e._.interrupt.push(o),e._.end.push(c)),l.on=e}),a===0&&s()})}var Zr=0;function mt(t,e,n,i){this._groups=t,this._parents=e,this._name=n,this._id=i}function ni(){return++Zr}var ut=Gt.prototype;mt.prototype={constructor:mt,select:Mr,selectAll:Rr,selectChild:ut.selectChild,selectChildren:ut.selectChildren,filter:kr,merge:Ar,selection:Dr,transition:Jr,call:ut.call,nodes:ut.nodes,node:ut.node,size:ut.size,empty:ut.empty,each:ut.each,on:Nr,attr:dr,attrTween:mr,style:Hr,styleTween:Yr,text:Vr,textTween:Kr,remove:Lr,tween:ir,delay:yr,duration:br,ease:$r,easeVarying:Tr,end:Qr,[Symbol.iterator]:ut[Symbol.iterator]};function to(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}var eo={time:null,delay:0,duration:250,ease:to};function no(t,e){for(var n;!(n=t.__transition)||!(n=n[e]);)if(!(t=t.parentNode))throw new Error(`transition ${e} not found`);return n}function io(t){var e,n;t instanceof mt?(e=t._id,t=t._name):(e=ni(),(n=eo).time=ze(),t=t==null?null:t+"");for(var i=this._groups,a=i.length,s=0;s<a;++s)for(var r=i[s],o=r.length,c,l=0;l<o;++l)(c=r[l])&&fe(c,t,e,l,r,n||no(c,e));return new mt(i,this._parents,t,e)}Gt.prototype.interrupt=tr;Gt.prototype.transition=io;function ao(t,e){var n,i=1;t==null&&(t=0),e==null&&(e=0);function a(){var s,r=n.length,o,c=0,l=0;for(s=0;s<r;++s)o=n[s],c+=o.x,l+=o.y;for(c=(c/r-t)*i,l=(l/r-e)*i,s=0;s<r;++s)o=n[s],o.x-=c,o.y-=l}return a.initialize=function(s){n=s},a.x=function(s){return arguments.length?(t=+s,a):t},a.y=function(s){return arguments.length?(e=+s,a):e},a.strength=function(s){return arguments.length?(i=+s,a):i},a}function so(t){const e=+this._x.call(null,t),n=+this._y.call(null,t);return ii(this.cover(e,n),e,n,t)}function ii(t,e,n,i){if(isNaN(e)||isNaN(n))return t;var a,s=t._root,r={data:i},o=t._x0,c=t._y0,l=t._x1,d=t._y1,_,h,m,$,y,x,g,k;if(!s)return t._root=r,t;for(;s.length;)if((y=e>=(_=(o+l)/2))?o=_:l=_,(x=n>=(h=(c+d)/2))?c=h:d=h,a=s,!(s=s[g=x<<1|y]))return a[g]=r,t;if(m=+t._x.call(null,s.data),$=+t._y.call(null,s.data),e===m&&n===$)return r.next=s,a?a[g]=r:t._root=r,t;do a=a?a[g]=new Array(4):t._root=new Array(4),(y=e>=(_=(o+l)/2))?o=_:l=_,(x=n>=(h=(c+d)/2))?c=h:d=h;while((g=x<<1|y)===(k=($>=h)<<1|m>=_));return a[k]=s,a[g]=r,t}function ro(t){var e,n,i=t.length,a,s,r=new Array(i),o=new Array(i),c=1/0,l=1/0,d=-1/0,_=-1/0;for(n=0;n<i;++n)isNaN(a=+this._x.call(null,e=t[n]))||isNaN(s=+this._y.call(null,e))||(r[n]=a,o[n]=s,a<c&&(c=a),a>d&&(d=a),s<l&&(l=s),s>_&&(_=s));if(c>d||l>_)return this;for(this.cover(c,l).cover(d,_),n=0;n<i;++n)ii(this,r[n],o[n],t[n]);return this}function oo(t,e){if(isNaN(t=+t)||isNaN(e=+e))return this;var n=this._x0,i=this._y0,a=this._x1,s=this._y1;if(isNaN(n))a=(n=Math.floor(t))+1,s=(i=Math.floor(e))+1;else{for(var r=a-n||1,o=this._root,c,l;n>t||t>=a||i>e||e>=s;)switch(l=(e<i)<<1|t<n,c=new Array(4),c[l]=o,o=c,r*=2,l){case 0:a=n+r,s=i+r;break;case 1:n=a-r,s=i+r;break;case 2:a=n+r,i=s-r;break;case 3:n=a-r,i=s-r;break}this._root&&this._root.length&&(this._root=o)}return this._x0=n,this._y0=i,this._x1=a,this._y1=s,this}function lo(){var t=[];return this.visit(function(e){if(!e.length)do t.push(e.data);while(e=e.next)}),t}function co(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function J(t,e,n,i,a){this.node=t,this.x0=e,this.y0=n,this.x1=i,this.y1=a}function uo(t,e,n){var i,a=this._x0,s=this._y0,r,o,c,l,d=this._x1,_=this._y1,h=[],m=this._root,$,y;for(m&&h.push(new J(m,a,s,d,_)),n==null?n=1/0:(a=t-n,s=e-n,d=t+n,_=e+n,n*=n);$=h.pop();)if(!(!(m=$.node)||(r=$.x0)>d||(o=$.y0)>_||(c=$.x1)<a||(l=$.y1)<s))if(m.length){var x=(r+c)/2,g=(o+l)/2;h.push(new J(m[3],x,g,c,l),new J(m[2],r,g,x,l),new J(m[1],x,o,c,g),new J(m[0],r,o,x,g)),(y=(e>=g)<<1|t>=x)&&($=h[h.length-1],h[h.length-1]=h[h.length-1-y],h[h.length-1-y]=$)}else{var k=t-+this._x.call(null,m.data),C=e-+this._y.call(null,m.data),u=k*k+C*C;if(u<n){var w=Math.sqrt(n=u);a=t-w,s=e-w,d=t+w,_=e+w,i=m.data}}return i}function fo(t){if(isNaN(d=+this._x.call(null,t))||isNaN(_=+this._y.call(null,t)))return this;var e,n=this._root,i,a,s,r=this._x0,o=this._y0,c=this._x1,l=this._y1,d,_,h,m,$,y,x,g;if(!n)return this;if(n.length)for(;;){if(($=d>=(h=(r+c)/2))?r=h:c=h,(y=_>=(m=(o+l)/2))?o=m:l=m,e=n,!(n=n[x=y<<1|$]))return this;if(!n.length)break;(e[x+1&3]||e[x+2&3]||e[x+3&3])&&(i=e,g=x)}for(;n.data!==t;)if(a=n,!(n=n.next))return this;return(s=n.next)&&delete n.next,a?(s?a.next=s:delete a.next,this):e?(s?e[x]=s:delete e[x],(n=e[0]||e[1]||e[2]||e[3])&&n===(e[3]||e[2]||e[1]||e[0])&&!n.length&&(i?i[g]=n:this._root=n),this):(this._root=s,this)}function po(t){for(var e=0,n=t.length;e<n;++e)this.remove(t[e]);return this}function ho(){return this._root}function mo(){var t=0;return this.visit(function(e){if(!e.length)do++t;while(e=e.next)}),t}function go(t){var e=[],n,i=this._root,a,s,r,o,c;for(i&&e.push(new J(i,this._x0,this._y0,this._x1,this._y1));n=e.pop();)if(!t(i=n.node,s=n.x0,r=n.y0,o=n.x1,c=n.y1)&&i.length){var l=(s+o)/2,d=(r+c)/2;(a=i[3])&&e.push(new J(a,l,d,o,c)),(a=i[2])&&e.push(new J(a,s,d,l,c)),(a=i[1])&&e.push(new J(a,l,r,o,d)),(a=i[0])&&e.push(new J(a,s,r,l,d))}return this}function vo(t){var e=[],n=[],i;for(this._root&&e.push(new J(this._root,this._x0,this._y0,this._x1,this._y1));i=e.pop();){var a=i.node;if(a.length){var s,r=i.x0,o=i.y0,c=i.x1,l=i.y1,d=(r+c)/2,_=(o+l)/2;(s=a[0])&&e.push(new J(s,r,o,d,_)),(s=a[1])&&e.push(new J(s,d,o,c,_)),(s=a[2])&&e.push(new J(s,r,_,d,l)),(s=a[3])&&e.push(new J(s,d,_,c,l))}n.push(i)}for(;i=n.pop();)t(i.node,i.x0,i.y0,i.x1,i.y1);return this}function yo(t){return t[0]}function _o(t){return arguments.length?(this._x=t,this):this._x}function xo(t){return t[1]}function bo(t){return arguments.length?(this._y=t,this):this._y}function je(t,e,n){var i=new Ge(e??yo,n??xo,NaN,NaN,NaN,NaN);return t==null?i:i.addAll(t)}function Ge(t,e,n,i,a,s){this._x=t,this._y=e,this._x0=n,this._y0=i,this._x1=a,this._y1=s,this._root=void 0}function gn(t){for(var e={data:t.data},n=e;t=t.next;)n=n.next={data:t.data};return e}var Z=je.prototype=Ge.prototype;Z.copy=function(){var t=new Ge(this._x,this._y,this._x0,this._y0,this._x1,this._y1),e=this._root,n,i;if(!e)return t;if(!e.length)return t._root=gn(e),t;for(n=[{source:e,target:t._root=new Array(4)}];e=n.pop();)for(var a=0;a<4;++a)(i=e.source[a])&&(i.length?n.push({source:i,target:e.target[a]=new Array(4)}):e.target[a]=gn(i));return t};Z.add=so;Z.addAll=ro;Z.cover=oo;Z.data=lo;Z.extent=co;Z.find=uo;Z.remove=fo;Z.removeAll=po;Z.root=ho;Z.size=mo;Z.visit=go;Z.visitAfter=vo;Z.x=_o;Z.y=bo;function Q(t){return function(){return t}}function _t(t){return(t()-.5)*1e-6}function wo(t){return t.x+t.vx}function $o(t){return t.y+t.vy}function Eo(t){var e,n,i,a=1,s=1;typeof t!="function"&&(t=Q(t==null?1:+t));function r(){for(var l,d=e.length,_,h,m,$,y,x,g=0;g<s;++g)for(_=je(e,wo,$o).visitAfter(o),l=0;l<d;++l)h=e[l],y=n[h.index],x=y*y,m=h.x+h.vx,$=h.y+h.vy,_.visit(k);function k(C,u,w,I,S){var E=C.data,M=C.r,R=y+M;if(E){if(E.index>h.index){var z=m-E.x-E.vx,F=$-E.y-E.vy,q=z*z+F*F;q<R*R&&(z===0&&(z=_t(i),q+=z*z),F===0&&(F=_t(i),q+=F*F),q=(R-(q=Math.sqrt(q)))/q*a,h.vx+=(z*=q)*(R=(M*=M)/(x+M)),h.vy+=(F*=q)*R,E.vx-=z*(R=1-R),E.vy-=F*R)}return}return u>m+R||I<m-R||w>$+R||S<$-R}}function o(l){if(l.data)return l.r=n[l.data.index];for(var d=l.r=0;d<4;++d)l[d]&&l[d].r>l.r&&(l.r=l[d].r)}function c(){if(e){var l,d=e.length,_;for(n=new Array(d),l=0;l<d;++l)_=e[l],n[_.index]=+t(_,l,e)}}return r.initialize=function(l,d){e=l,i=d,c()},r.iterations=function(l){return arguments.length?(s=+l,r):s},r.strength=function(l){return arguments.length?(a=+l,r):a},r.radius=function(l){return arguments.length?(t=typeof l=="function"?l:Q(+l),c(),r):t},r}function To(t){return t.index}function vn(t,e){var n=t.get(e);if(!n)throw new Error("node not found: "+e);return n}function ko(t){var e=To,n=_,i,a=Q(30),s,r,o,c,l,d=1;t==null&&(t=[]);function _(x){return 1/Math.min(o[x.source.index],o[x.target.index])}function h(x){for(var g=0,k=t.length;g<d;++g)for(var C=0,u,w,I,S,E,M,R;C<k;++C)u=t[C],w=u.source,I=u.target,S=I.x+I.vx-w.x-w.vx||_t(l),E=I.y+I.vy-w.y-w.vy||_t(l),M=Math.sqrt(S*S+E*E),M=(M-s[C])/M*x*i[C],S*=M,E*=M,I.vx-=S*(R=c[C]),I.vy-=E*R,w.vx+=S*(R=1-R),w.vy+=E*R}function m(){if(r){var x,g=r.length,k=t.length,C=new Map(r.map((w,I)=>[e(w,I,r),w])),u;for(x=0,o=new Array(g);x<k;++x)u=t[x],u.index=x,typeof u.source!="object"&&(u.source=vn(C,u.source)),typeof u.target!="object"&&(u.target=vn(C,u.target)),o[u.source.index]=(o[u.source.index]||0)+1,o[u.target.index]=(o[u.target.index]||0)+1;for(x=0,c=new Array(k);x<k;++x)u=t[x],c[x]=o[u.source.index]/(o[u.source.index]+o[u.target.index]);i=new Array(k),$(),s=new Array(k),y()}}function $(){if(r)for(var x=0,g=t.length;x<g;++x)i[x]=+n(t[x],x,t)}function y(){if(r)for(var x=0,g=t.length;x<g;++x)s[x]=+a(t[x],x,t)}return h.initialize=function(x,g){r=x,l=g,m()},h.links=function(x){return arguments.length?(t=x,m(),h):t},h.id=function(x){return arguments.length?(e=x,h):e},h.iterations=function(x){return arguments.length?(d=+x,h):d},h.strength=function(x){return arguments.length?(n=typeof x=="function"?x:Q(+x),$(),h):n},h.distance=function(x){return arguments.length?(a=typeof x=="function"?x:Q(+x),y(),h):a},h}const Ao=1664525,So=1013904223,yn=4294967296;function Io(){let t=1;return()=>(t=(Ao*t+So)%yn)/yn}function No(t){return t.x}function Co(t){return t.y}var Lo=10,Mo=Math.PI*(3-Math.sqrt(5));function Ro(t){var e,n=1,i=.001,a=1-Math.pow(i,1/300),s=0,r=.6,o=new Map,c=Be(_),l=jt("tick","end"),d=Io();t==null&&(t=[]);function _(){h(),l.call("tick",e),n<i&&(c.stop(),l.call("end",e))}function h(y){var x,g=t.length,k;y===void 0&&(y=1);for(var C=0;C<y;++C)for(n+=(s-n)*a,o.forEach(function(u){u(n)}),x=0;x<g;++x)k=t[x],k.fx==null?k.x+=k.vx*=r:(k.x=k.fx,k.vx=0),k.fy==null?k.y+=k.vy*=r:(k.y=k.fy,k.vy=0);return e}function m(){for(var y=0,x=t.length,g;y<x;++y){if(g=t[y],g.index=y,g.fx!=null&&(g.x=g.fx),g.fy!=null&&(g.y=g.fy),isNaN(g.x)||isNaN(g.y)){var k=Lo*Math.sqrt(.5+y),C=y*Mo;g.x=k*Math.cos(C),g.y=k*Math.sin(C)}(isNaN(g.vx)||isNaN(g.vy))&&(g.vx=g.vy=0)}}function $(y){return y.initialize&&y.initialize(t,d),y}return m(),e={tick:h,restart:function(){return c.restart(_),e},stop:function(){return c.stop(),e},nodes:function(y){return arguments.length?(t=y,m(),o.forEach($),e):t},alpha:function(y){return arguments.length?(n=+y,e):n},alphaMin:function(y){return arguments.length?(i=+y,e):i},alphaDecay:function(y){return arguments.length?(a=+y,e):+a},alphaTarget:function(y){return arguments.length?(s=+y,e):s},velocityDecay:function(y){return arguments.length?(r=1-y,e):1-r},randomSource:function(y){return arguments.length?(d=y,o.forEach($),e):d},force:function(y,x){return arguments.length>1?(x==null?o.delete(y):o.set(y,$(x)),e):o.get(y)},find:function(y,x,g){var k=0,C=t.length,u,w,I,S,E;for(g==null?g=1/0:g*=g,k=0;k<C;++k)S=t[k],u=y-S.x,w=x-S.y,I=u*u+w*w,I<g&&(E=S,g=I);return E},on:function(y,x){return arguments.length>1?(l.on(y,x),e):l.on(y)}}}function Po(){var t,e,n,i,a=Q(-30),s,r=1,o=1/0,c=.81;function l(m){var $,y=t.length,x=je(t,No,Co).visitAfter(_);for(i=m,$=0;$<y;++$)e=t[$],x.visit(h)}function d(){if(t){var m,$=t.length,y;for(s=new Array($),m=0;m<$;++m)y=t[m],s[y.index]=+a(y,m,t)}}function _(m){var $=0,y,x,g=0,k,C,u;if(m.length){for(k=C=u=0;u<4;++u)(y=m[u])&&(x=Math.abs(y.value))&&($+=y.value,g+=x,k+=x*y.x,C+=x*y.y);m.x=k/g,m.y=C/g}else{y=m,y.x=y.data.x,y.y=y.data.y;do $+=s[y.data.index];while(y=y.next)}m.value=$}function h(m,$,y,x){if(!m.value)return!0;var g=m.x-e.x,k=m.y-e.y,C=x-$,u=g*g+k*k;if(C*C/c<u)return u<o&&(g===0&&(g=_t(n),u+=g*g),k===0&&(k=_t(n),u+=k*k),u<r&&(u=Math.sqrt(r*u)),e.vx+=g*m.value*i/u,e.vy+=k*m.value*i/u),!0;if(m.length||u>=o)return;(m.data!==e||m.next)&&(g===0&&(g=_t(n),u+=g*g),k===0&&(k=_t(n),u+=k*k),u<r&&(u=Math.sqrt(r*u)));do m.data!==e&&(C=s[m.data.index]*i/u,e.vx+=g*C,e.vy+=k*C);while(m=m.next)}return l.initialize=function(m,$){t=m,n=$,d()},l.strength=function(m){return arguments.length?(a=typeof m=="function"?m:Q(+m),d(),l):a},l.distanceMin=function(m){return arguments.length?(r=m*m,l):Math.sqrt(r)},l.distanceMax=function(m){return arguments.length?(o=m*m,l):Math.sqrt(o)},l.theta=function(m){return arguments.length?(c=m*m,l):Math.sqrt(c)},l}function Do(t){var e=Q(.1),n,i,a;typeof t!="function"&&(t=Q(t==null?0:+t));function s(o){for(var c=0,l=n.length,d;c<l;++c)d=n[c],d.vx+=(a[c]-d.x)*i[c]*o}function r(){if(n){var o,c=n.length;for(i=new Array(c),a=new Array(c),o=0;o<c;++o)i[o]=isNaN(a[o]=+t(n[o],o,n))?0:+e(n[o],o,n)}}return s.initialize=function(o){n=o,r()},s.strength=function(o){return arguments.length?(e=typeof o=="function"?o:Q(+o),r(),s):e},s.x=function(o){return arguments.length?(t=typeof o=="function"?o:Q(+o),r(),s):t},s}function Oo(t){var e=Q(.1),n,i,a;typeof t!="function"&&(t=Q(t==null?0:+t));function s(o){for(var c=0,l=n.length,d;c<l;++c)d=n[c],d.vy+=(a[c]-d.y)*i[c]*o}function r(){if(n){var o,c=n.length;for(i=new Array(c),a=new Array(c),o=0;o<c;++o)i[o]=isNaN(a[o]=+t(n[o],o,n))?0:+e(n[o],o,n)}}return s.initialize=function(o){n=o,r()},s.strength=function(o){return arguments.length?(e=typeof o=="function"?o:Q(+o),r(),s):e},s.y=function(o){return arguments.length?(t=typeof o=="function"?o:Q(+o),r(),s):t},s}const Kt=t=>()=>t;function zo(t,{sourceEvent:e,target:n,transform:i,dispatch:a}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:i,enumerable:!0,configurable:!0},_:{value:a}})}function ht(t,e,n){this.k=t,this.x=e,this.y=n}ht.prototype={constructor:ht,scale:function(t){return t===1?this:new ht(this.k*t,this.x,this.y)},translate:function(t,e){return t===0&e===0?this:new ht(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var ai=new ht(1,0,0);ht.prototype;function ve(t){t.stopImmediatePropagation()}function Lt(t){t.preventDefault(),t.stopImmediatePropagation()}function Bo(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function Fo(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function _n(){return this.__zoom||ai}function Ho(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function jo(){return navigator.maxTouchPoints||"ontouchstart"in this}function Go(t,e,n){var i=t.invertX(e[0][0])-n[0][0],a=t.invertX(e[1][0])-n[1][0],s=t.invertY(e[0][1])-n[0][1],r=t.invertY(e[1][1])-n[1][1];return t.translate(a>i?(i+a)/2:Math.min(0,i)||Math.max(0,a),r>s?(s+r)/2:Math.min(0,s)||Math.max(0,r))}function Yo(){var t=Bo,e=Fo,n=Go,i=Ho,a=jo,s=[0,1/0],r=[[-1/0,-1/0],[1/0,1/0]],o=250,c=Us,l=jt("start","zoom","end"),d,_,h,m=500,$=150,y=0,x=10;function g(v){v.property("__zoom",_n).on("wheel.zoom",E,{passive:!1}).on("mousedown.zoom",M).on("dblclick.zoom",R).filter(a).on("touchstart.zoom",z).on("touchmove.zoom",F).on("touchend.zoom touchcancel.zoom",q).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}g.transform=function(v,p,f,b){var A=v.selection?v.selection():v;A.property("__zoom",_n),v!==A?w(v,p,f,b):A.interrupt().each(function(){I(this,arguments).event(b).start().zoom(null,typeof p=="function"?p.apply(this,arguments):p).end()})},g.scaleBy=function(v,p,f,b){g.scaleTo(v,function(){var A=this.__zoom.k,N=typeof p=="function"?p.apply(this,arguments):p;return A*N},f,b)},g.scaleTo=function(v,p,f,b){g.transform(v,function(){var A=e.apply(this,arguments),N=this.__zoom,L=f==null?u(A):typeof f=="function"?f.apply(this,arguments):f,P=N.invert(L),O=typeof p=="function"?p.apply(this,arguments):p;return n(C(k(N,O),L,P),A,r)},f,b)},g.translateBy=function(v,p,f,b){g.transform(v,function(){return n(this.__zoom.translate(typeof p=="function"?p.apply(this,arguments):p,typeof f=="function"?f.apply(this,arguments):f),e.apply(this,arguments),r)},null,b)},g.translateTo=function(v,p,f,b,A){g.transform(v,function(){var N=e.apply(this,arguments),L=this.__zoom,P=b==null?u(N):typeof b=="function"?b.apply(this,arguments):b;return n(ai.translate(P[0],P[1]).scale(L.k).translate(typeof p=="function"?-p.apply(this,arguments):-p,typeof f=="function"?-f.apply(this,arguments):-f),N,r)},b,A)};function k(v,p){return p=Math.max(s[0],Math.min(s[1],p)),p===v.k?v:new ht(p,v.x,v.y)}function C(v,p,f){var b=p[0]-f[0]*v.k,A=p[1]-f[1]*v.k;return b===v.x&&A===v.y?v:new ht(v.k,b,A)}function u(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function w(v,p,f,b){v.on("start.zoom",function(){I(this,arguments).event(b).start()}).on("interrupt.zoom end.zoom",function(){I(this,arguments).event(b).end()}).tween("zoom",function(){var A=this,N=arguments,L=I(A,N).event(b),P=e.apply(A,N),O=f==null?u(P):typeof f=="function"?f.apply(A,N):f,U=Math.max(P[1][0]-P[0][0],P[1][1]-P[0][1]),H=A.__zoom,Y=typeof p=="function"?p.apply(A,N):p,V=c(H.invert(O).concat(U/H.k),Y.invert(O).concat(U/Y.k));return function(G){if(G===1)G=Y;else{var X=V(G),xt=U/X[2];G=new ht(xt,O[0]-X[0]*xt,O[1]-X[1]*xt)}L.zoom(null,G)}})}function I(v,p,f){return!f&&v.__zooming||new S(v,p)}function S(v,p){this.that=v,this.args=p,this.active=0,this.sourceEvent=null,this.extent=e.apply(v,p),this.taps=0}S.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,p){return this.mouse&&v!=="mouse"&&(this.mouse[1]=p.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=p.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=p.invert(this.touch1[0])),this.that.__zoom=p,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var p=K(this.that).datum();l.call(v,this.that,new zo(v,{sourceEvent:this.sourceEvent,target:g,transform:this.that.__zoom,dispatch:l}),p)}};function E(v,...p){if(!t.apply(this,arguments))return;var f=I(this,p).event(v),b=this.__zoom,A=Math.max(s[0],Math.min(s[1],b.k*Math.pow(2,i.apply(this,arguments)))),N=pt(v);if(f.wheel)(f.mouse[0][0]!==N[0]||f.mouse[0][1]!==N[1])&&(f.mouse[1]=b.invert(f.mouse[0]=N)),clearTimeout(f.wheel);else{if(b.k===A)return;f.mouse=[N,b.invert(N)],ie(this),f.start()}Lt(v),f.wheel=setTimeout(L,$),f.zoom("mouse",n(C(k(b,A),f.mouse[0],f.mouse[1]),f.extent,r));function L(){f.wheel=null,f.end()}}function M(v,...p){if(h||!t.apply(this,arguments))return;var f=v.currentTarget,b=I(this,p,!0).event(v),A=K(v.view).on("mousemove.zoom",O,!0).on("mouseup.zoom",U,!0),N=pt(v,f),L=v.clientX,P=v.clientY;Gn(v.view),ve(v),b.mouse=[N,this.__zoom.invert(N)],ie(this),b.start();function O(H){if(Lt(H),!b.moved){var Y=H.clientX-L,V=H.clientY-P;b.moved=Y*Y+V*V>y}b.event(H).zoom("mouse",n(C(b.that.__zoom,b.mouse[0]=pt(H,f),b.mouse[1]),b.extent,r))}function U(H){A.on("mousemove.zoom mouseup.zoom",null),Yn(H.view,b.moved),Lt(H),b.event(H).end()}}function R(v,...p){if(t.apply(this,arguments)){var f=this.__zoom,b=pt(v.changedTouches?v.changedTouches[0]:v,this),A=f.invert(b),N=f.k*(v.shiftKey?.5:2),L=n(C(k(f,N),b,A),e.apply(this,p),r);Lt(v),o>0?K(this).transition().duration(o).call(w,L,b,v):K(this).call(g.transform,L,b,v)}}function z(v,...p){if(t.apply(this,arguments)){var f=v.touches,b=f.length,A=I(this,p,v.changedTouches.length===b).event(v),N,L,P,O;for(ve(v),L=0;L<b;++L)P=f[L],O=pt(P,this),O=[O,this.__zoom.invert(O),P.identifier],A.touch0?!A.touch1&&A.touch0[2]!==O[2]&&(A.touch1=O,A.taps=0):(A.touch0=O,N=!0,A.taps=1+!!d);d&&(d=clearTimeout(d)),N&&(A.taps<2&&(_=O[0],d=setTimeout(function(){d=null},m)),ie(this),A.start())}}function F(v,...p){if(this.__zooming){var f=I(this,p).event(v),b=v.changedTouches,A=b.length,N,L,P,O;for(Lt(v),N=0;N<A;++N)L=b[N],P=pt(L,this),f.touch0&&f.touch0[2]===L.identifier?f.touch0[0]=P:f.touch1&&f.touch1[2]===L.identifier&&(f.touch1[0]=P);if(L=f.that.__zoom,f.touch1){var U=f.touch0[0],H=f.touch0[1],Y=f.touch1[0],V=f.touch1[1],G=(G=Y[0]-U[0])*G+(G=Y[1]-U[1])*G,X=(X=V[0]-H[0])*X+(X=V[1]-H[1])*X;L=k(L,Math.sqrt(G/X)),P=[(U[0]+Y[0])/2,(U[1]+Y[1])/2],O=[(H[0]+V[0])/2,(H[1]+V[1])/2]}else if(f.touch0)P=f.touch0[0],O=f.touch0[1];else return;f.zoom("touch",n(C(L,P,O),f.extent,r))}}function q(v,...p){if(this.__zooming){var f=I(this,p).event(v),b=v.changedTouches,A=b.length,N,L;for(ve(v),h&&clearTimeout(h),h=setTimeout(function(){h=null},m),N=0;N<A;++N)L=b[N],f.touch0&&f.touch0[2]===L.identifier?delete f.touch0:f.touch1&&f.touch1[2]===L.identifier&&delete f.touch1;if(f.touch1&&!f.touch0&&(f.touch0=f.touch1,delete f.touch1),f.touch0)f.touch0[1]=this.__zoom.invert(f.touch0[0]);else if(f.end(),f.taps===2&&(L=pt(L,this),Math.hypot(_[0]-L[0],_[1]-L[1])<x)){var P=K(this).on("dblclick.zoom");P&&P.apply(this,arguments)}}}return g.wheelDelta=function(v){return arguments.length?(i=typeof v=="function"?v:Kt(+v),g):i},g.filter=function(v){return arguments.length?(t=typeof v=="function"?v:Kt(!!v),g):t},g.touchable=function(v){return arguments.length?(a=typeof v=="function"?v:Kt(!!v),g):a},g.extent=function(v){return arguments.length?(e=typeof v=="function"?v:Kt([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),g):e},g.scaleExtent=function(v){return arguments.length?(s[0]=+v[0],s[1]=+v[1],g):[s[0],s[1]]},g.translateExtent=function(v){return arguments.length?(r[0][0]=+v[0][0],r[1][0]=+v[1][0],r[0][1]=+v[0][1],r[1][1]=+v[1][1],g):[[r[0][0],r[0][1]],[r[1][0],r[1][1]]]},g.constrain=function(v){return arguments.length?(n=v,g):n},g.duration=function(v){return arguments.length?(o=+v,g):o},g.interpolate=function(v){return arguments.length?(c=v,g):c},g.on=function(){var v=l.on.apply(l,arguments);return v===l?g:v},g.clickDistance=function(v){return arguments.length?(y=(v=+v)*v,g):Math.sqrt(y)},g.tapDistance=function(v){return arguments.length?(x=+v,g):x},g}let Jt=null,rt=null,kt=!0,Le=null,Me=null,yt=new Set;const xn=["#FF6B35","#004E89","#7B2D8E","#1A936F","#C5283D","#E9724C","#3498db","#9b59b6","#27ae60","#f39c12"];function qo(t){var n;const e=window.appState.projectId;rt=null,yt=new Set,t.innerHTML=`
    <div class="page-graph">
      <header class="page-header">
        <div class="page-header-left">
          <button class="btn btn-ghost" onclick="navigateTo('results')" style="padding:8px 16px;">
            <span class="material-symbols-outlined icon-sm">arrow_back</span> ${T("btn_back")}
          </button>
        </div>
        <div class="page-header-center">
          <h1 class="mono-sm">${T("graph_title")}</h1>
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
              <input type="checkbox" id="edge-label-checkbox" ${kt?"checked":""} />
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
            <h3 class="mono-xs panel-title">${T("graph_agents")}</h3>
            <div id="agents-list" class="agents-list"></div>
          </div>
        </aside>
      </div>

      <div class="page-actions">
        <button class="btn btn-accent" onclick="navigateTo('results')">
          ${T("btn_view_report")} <span class="material-symbols-outlined icon-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `,(n=document.getElementById("edge-label-checkbox"))==null||n.addEventListener("change",i=>{kt=i.target.checked,Le&&Le.style("display",kt?"block":"none"),Me&&Me.style("display",kt?"block":"none")}),e&&Uo(e)}async function Uo(t){try{const[e,n]=await Promise.all([it.getGraph(t),it.getAgents(t)]),i=e.nodes||[],a=e.edges||[],s=n.agents||[];document.getElementById("graph-stats").textContent=`NODES: ${i.length} | EDGES: ${a.length} | AGENTS: ${s.length}`,Vo(s),Xo(i,a)}catch(e){document.getElementById("graph-stats").textContent=T("graph_load_error"),console.error("Graph load error:",e)}}function Vo(t){const e=document.getElementById("agents-list");if(!t.length){e.innerHTML=`<p class="muted mono-xs">${T("graph_no_agents")}</p>`;return}const n={Self:"person",Family:"family_restroom",Mentor:"school",Partner:"favorite",School:"domain",Employer:"business",City:"location_city",Industry:"trending_up",Risk:"warning"};e.innerHTML=t.map(i=>`
    <div class="agent-card" data-agent-type="${i.agent_type}" style="border-left: 3px solid ${bn(i.agent_type)}">
      <div class="agent-card-header">
        <span class="material-symbols-outlined icon-sm" style="color:${bn(i.agent_type)}">${n[i.agent_type]||"smart_toy"}</span>
        <strong class="mono-xs">${i.name||i.agent_type}</strong>
        <span class="badge badge-sm">${i.agent_type}</span>
      </div>
      <p class="agent-persona">${i.persona||""}</p>
      ${i.stance?`<div class="mono-xs muted">STANCE: ${i.stance} | INFLUENCE: ${(i.influence*100).toFixed(0)}%</div>`:""}
    </div>
  `).join("")}function bn(t){return{Self:"#c9a0ff",Factor:"#556677",Family:"#ff9eb1",Mentor:"#7ecfff",School:"#ffd17e",Employer:"#7eff9e",City:"#ff7eb3",Industry:"#b4ff7e",Risk:"#ff7e7e",Partner:"#ffb07e",Person:"#888"}[t]||"#666"}function Xo(t,e){Jt&&(Jt.stop(),Jt=null);const n=document.getElementById("graph-canvas-wrap"),i=K("#graph-svg"),a=n.clientWidth||800,s=n.clientHeight||600;if(i.attr("width",a).attr("height",s).attr("viewBox",`0 0 ${a} ${s}`),i.selectAll("*").remove(),!t.length){i.append("text").attr("x",a/2).attr("y",s/2).attr("text-anchor","middle").attr("fill","#666").attr("font-family","monospace").text(T("graph_no_data"));return}const r={};t.forEach(p=>{r[p.uuid||p.id]=p});const o={};let c=0;t.forEach(p=>{var b;const f=((b=p.labels)==null?void 0:b.find(A=>A!=="Entity"))||p.type||p.group||"Entity";o[f]||(o[f]=xn[c%xn.length],c++)});const l=p=>o[p]||"#999",d=t.map(p=>{var f;return{id:p.uuid||p.id,name:p.name||"Unnamed",type:((f=p.labels)==null?void 0:f.find(b=>b!=="Entity"))||p.type||p.group||"Entity",rawData:p}}),_=new Set(d.map(p=>p.id)),h={},m={},$=new Set,y=e.filter(p=>{const f=p.source_node_uuid||p.source,b=p.target_node_uuid||p.target;return _.has(f)&&_.has(b)});y.forEach(p=>{var A,N;const f=p.source_node_uuid||p.source,b=p.target_node_uuid||p.target;if(f===b)m[f]||(m[f]=[]),m[f].push({...p,source_name:(A=r[f])==null?void 0:A.name,target_name:(N=r[b])==null?void 0:N.name});else{const L=[f,b].sort().join("_");h[L]=(h[L]||0)+1}});const x={},g=[];y.forEach(p=>{var H,Y,V;const f=p.source_node_uuid||p.source,b=p.target_node_uuid||p.target;if(f===b){if($.has(f))return;$.add(f);const G=m[f],X=((H=r[f])==null?void 0:H.name)||"Unknown";g.push({source:f,target:b,type:"SELF_LOOP",name:`Self (${G.length})`,curvature:0,isSelfLoop:!0,rawData:{isSelfLoopGroup:!0,source_name:X,target_name:X,selfLoopCount:G.length,selfLoopEdges:G}});return}const N=[f,b].sort().join("_"),L=h[N],P=x[N]||0;x[N]=P+1;const O=f>b;let U=0;if(L>1){const G=Math.min(1.2,.6+L*.15);U=(P/(L-1)-.5)*G*2,O&&(U=-U)}g.push({source:f,target:b,type:p.fact_type||p.relation||p.name||"RELATED",name:p.name||p.relation||p.fact_type||"RELATED",curvature:U,isSelfLoop:!1,pairIndex:P,pairTotal:L,rawData:{...p,source_name:(Y=r[f])==null?void 0:Y.name,target_name:(V=r[b])==null?void 0:V.name}})});const k=Ro(d).force("link",ko(g).id(p=>p.id).distance(p=>150+((p.pairTotal||1)-1)*50)).force("charge",Po().strength(-400)).force("center",ao(a/2,s/2)).force("collide",Eo(50)).force("x",Do(a/2).strength(.04)).force("y",Oo(s/2).strength(.04));Jt=k,i.append("defs").html(`
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-strong"><feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  `);const u=i.append("g");i.call(Yo().extent([[0,0],[a,s]]).scaleExtent([.1,4]).on("zoom",p=>{u.attr("transform",p.transform)}));function w(p){const f=p.source.x,b=p.source.y,A=p.target.x,N=p.target.y;if(p.isSelfLoop){const li=f+8,ci=b-4,di=f+8,ui=b+4;return`M${li},${ci} A30,30 0 1,1 ${di},${ui}`}if(p.curvature===0)return`M${f},${b} L${A},${N}`;const L=A-f,P=N-b,O=Math.sqrt(L*L+P*P)||1,H=.25+(p.pairTotal||1)*.05,Y=Math.max(35,O*H),V=-P/O*p.curvature*Y,G=L/O*p.curvature*Y,X=(f+A)/2+V,xt=(b+N)/2+G;return`M${f},${b} Q${X},${xt} ${A},${N}`}function I(p){const f=p.source.x,b=p.source.y,A=p.target.x,N=p.target.y;if(p.isSelfLoop)return{x:f+70,y:b};if(p.curvature===0)return{x:(f+A)/2,y:(b+N)/2};const L=A-f,P=N-b,O=Math.sqrt(L*L+P*P)||1,H=.25+(p.pairTotal||1)*.05,Y=Math.max(35,O*H),V=-P/O*p.curvature*Y,G=L/O*p.curvature*Y,X=(f+A)/2+V,xt=(b+N)/2+G;return{x:.25*f+.5*X+.25*A,y:.25*b+.5*xt+.25*N}}const S=u.append("g").attr("class","links"),E=S.selectAll("path").data(g).enter().append("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5).attr("fill","none").style("cursor","pointer").on("click",(p,f)=>{p.stopPropagation(),ye(S,F,M,R),K(p.target).attr("stroke","#3498db").attr("stroke-width",3),Qt({type:"edge",data:f.rawData})}),M=S.selectAll("rect.link-label-bg").data(g).enter().append("rect").attr("class","link-label-bg").attr("fill","rgba(255,255,255,0.95)").attr("rx",3).attr("ry",3).style("cursor","pointer").style("pointer-events","all").style("display",kt?"block":"none").on("click",(p,f)=>{p.stopPropagation(),ye(S,F,M,R),E.filter(b=>b===f).attr("stroke","#3498db").attr("stroke-width",3),Qt({type:"edge",data:f.rawData})}),R=S.selectAll("text.link-label").data(g).enter().append("text").attr("class","link-label").text(p=>p.name).attr("font-size","9px").attr("fill","#999").attr("text-anchor","middle").attr("dominant-baseline","middle").style("cursor","pointer").style("pointer-events","all").style("font-family","'Inter', system-ui, sans-serif").style("display",kt?"block":"none").on("click",(p,f)=>{p.stopPropagation(),ye(S,F,M,R),E.filter(b=>b===f).attr("stroke","#3498db").attr("stroke-width",3),Qt({type:"edge",data:f.rawData})});Le=R,Me=M;const z=u.append("g").attr("class","nodes"),F=z.selectAll("circle").data(d).enter().append("circle").attr("r",12).attr("fill",p=>l(p.type)).attr("stroke","#fff").attr("stroke-width",2.5).style("cursor","pointer").attr("filter","url(#glow)").call(xs().on("start",(p,f)=>{f.fx=f.x,f.fy=f.y,f._dragStartX=p.x,f._dragStartY=p.y,f._isDragging=!1}).on("drag",(p,f)=>{const b=p.x-f._dragStartX,A=p.y-f._dragStartY,N=Math.sqrt(b*b+A*A);!f._isDragging&&N>3&&(f._isDragging=!0,k.alphaTarget(.3).restart()),f._isDragging&&(f.fx=p.x,f.fy=p.y)}).on("end",(p,f)=>{f._isDragging&&k.alphaTarget(0),f.fx=null,f.fy=null,f._isDragging=!1})).on("click",(p,f)=>{p.stopPropagation(),F.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)"),S.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),K(p.target).attr("stroke","#FF4500").attr("stroke-width",4).attr("filter","url(#glow-strong)"),E.filter(A=>A.source.id===f.id||A.target.id===f.id).attr("stroke","#FF4500").attr("stroke-width",2.5);const b=document.getElementById("graph-hint");b&&(b.style.display="none"),Qt({type:"node",data:f.rawData,entityType:f.type,color:l(f.type)})}).on("mouseenter",(p,f)=>{var b,A;(!rt||(((b=rt.data)==null?void 0:b.uuid)||((A=rt.data)==null?void 0:A.id))!==(f.rawData.uuid||f.rawData.id))&&K(p.target).attr("stroke","#333").attr("stroke-width",3)}).on("mouseleave",(p,f)=>{var b,A;(!rt||(((b=rt.data)==null?void 0:b.uuid)||((A=rt.data)==null?void 0:A.id))!==(f.rawData.uuid||f.rawData.id))&&K(p.target).attr("stroke","#fff").attr("stroke-width",2.5)}),q=z.selectAll("text").data(d).enter().append("text").text(p=>p.name.length>8?p.name.substring(0,8)+"…":p.name).attr("font-size","11px").attr("fill","#bbb").attr("font-weight","500").attr("dx",16).attr("dy",4).style("pointer-events","none").style("font-family","'Inter', sans-serif");k.on("tick",()=>{E.attr("d",p=>w(p)),R.each(function(p){const f=I(p);K(this).attr("x",f.x).attr("y",f.y).attr("transform","")}),M.each(function(p,f){const b=I(p),A=R.nodes()[f];if(A){const N=A.getBBox();K(this).attr("x",b.x-N.width/2-4).attr("y",b.y-N.height/2-2).attr("width",N.width+8).attr("height",N.height+4).attr("transform","")}}),F.attr("cx",p=>p.x).attr("cy",p=>p.y),q.attr("x",p=>p.x).attr("y",p=>p.y)}),i.on("click",()=>{rt=null,F.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)"),S.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),M.attr("fill","rgba(255,255,255,0.95)"),R.attr("fill","#999"),pe()}),Jo(o);const v=()=>{const p=n.clientWidth,f=n.clientHeight;i.attr("width",p).attr("height",f).attr("viewBox",`0 0 ${p} ${f}`)};window.addEventListener("resize",v)}function ye(t,e,n,i){t&&t.selectAll("path").attr("stroke","#C0C0C0").attr("stroke-width",1.5),n&&n.attr("fill","rgba(255,255,255,0.95)"),i&&i.attr("fill","#999"),e&&e.attr("stroke","#fff").attr("stroke-width",2.5).attr("filter","url(#glow)")}function Qt(t){rt=t;const e=document.getElementById("graph-detail-panel");e&&(e.style.display="flex",t.type==="node"?Wo(e,t):Ko(e,t))}function pe(){const t=document.getElementById("graph-detail-panel");t&&(t.style.display="none"),rt=null,yt=new Set}function Wo(t,e){var r;const n=e.data,i=n.attributes||n.properties||{},a=n.labels||[],s=n.summary||n.persona||n.description||"";t.innerHTML=`
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
        <span class="gd-value">${Ye(n.created_at)}</span>
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
  `,(r=document.getElementById("gd-close"))==null||r.addEventListener("click",o=>{o.stopPropagation(),pe()})}function Ko(t,e){var i,a;const n=e.data;if(n.isSelfLoopGroup){si(t,n);return}t.innerHTML=`
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
        <span class="gd-value">${Ye(n.created_at)}</span>
      </div>`:""}
    </div>
  `,(a=document.getElementById("gd-close"))==null||a.addEventListener("click",s=>{s.stopPropagation(),pe()})}function si(t,e){var i;const n=e.selfLoopEdges||[];t.innerHTML=`
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
                ${a.created_at?`<div class="gd-row"><span class="gd-label">Created:</span><span class="gd-value">${Ye(a.created_at)}</span></div>`:""}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,t.querySelectorAll("[data-toggle-id]").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.toggleId,r=isNaN(s)?s:parseInt(s);yt.has(r)?yt.delete(r):yt.add(r),si(t,e)})}),(i=document.getElementById("gd-close"))==null||i.addEventListener("click",a=>{a.stopPropagation(),pe()})}function Jo(t){const e=document.getElementById("graph-legend-panel");if(!e)return;const n=Object.entries(t);n.length!==0&&(e.innerHTML=`
    <span class="gl-title">Entity Types</span>
    <div class="gl-items">
      ${n.map(([i,a])=>`
        <div class="gl-item">
          <span class="gl-dot" style="background:${a};"></span>
          <span class="gl-label">${i}</span>
        </div>
      `).join("")}
    </div>
  `)}function Ye(t){if(!t)return"";try{return new Date(t).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}catch{return t}}const D={currentPage:"landing",projectId:null,project:null,simComplete:!1},ri={landing:mi,onboarding:Zt,parameters:be,simulation:xi,results:$t,graph:qo};function ct(t,e={}){D.currentPage=t,Object.assign(D,e),window.location.hash=t,qe()}window.navigateTo=ct;window.appState=D;window.t=T;function qe(){const t=document.getElementById("app"),e=ri[D.currentPage];e&&e(t),Qo(),Zo()}function Qo(){const t={landing:"nav_simulation",graph:"nav_graph",results:"nav_reports",simulation:"nav_system"};document.querySelectorAll(".nav-link[data-page]").forEach(e=>{const n=e.dataset.page;e.classList.toggle("active",n===D.currentPage);const i=t[n];i&&(e.textContent=T(i))})}function Zo(){const t=document.getElementById("lang-toggle");t&&(t.textContent=T("lang_switch"))}function oi(){const t=window.location.hash.slice(1)||"landing";ri[t]&&(D.currentPage=t,qe())}window.addEventListener("hashchange",oi);window.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".nav-link[data-page]").forEach(e=>{e.addEventListener("click",n=>{n.preventDefault(),ct(e.dataset.page)})});const t=document.getElementById("lang-toggle");t&&t.addEventListener("click",()=>{pi(),qe()}),oi()});
