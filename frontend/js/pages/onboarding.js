/**
 * Onboarding / Questionnaire Page
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';

const BASE_STEPS = [
  { key: 'personality', label: 'PERSONALITY_TYPE', title: '性格倾向' },
  { key: 'education', label: 'EDUCATION_STAGE', title: '当前阶段' },
  { key: 'background', label: 'STAGE_CONTEXT', title: '阶段背景' },
  { key: 'family', label: 'FAMILY_CONDITIONS', title: '家庭情况' },
  { key: 'preference', label: 'CAREER_PREFERENCE', title: '方向偏好' },
  { key: 'concern', label: 'CORE_CONCERN', title: '核心困惑' },
];

let currentStep = 0;
let formData = {
  personality_type: '',
  education_stage: '',
  school: '',
  major: '',
  gpa_range: '',
  family_economy: '',
  family_expectation: '',
  city_preference: '',
  career_preference: '',
  risk_preference: 'balanced',
  current_concern: '',
};

const OPTIONS = {
  personality: [
    { value: 'INTJ', label: '战略家 INTJ', desc: '独立思考、目标导向' },
    { value: 'INFP', label: '调停者 INFP', desc: '理想主义、富有同情' },
    { value: 'ENTP', label: '辩论家 ENTP', desc: '创新求变、挑战常规' },
    { value: 'ISFJ', label: '守卫者 ISFJ', desc: '踏实稳重、富有责任' },
    { value: 'ENTJ', label: '指挥官 ENTJ', desc: '强势果断、天生领导' },
    { value: 'INTP', label: '逻辑学家 INTP', desc: '分析深入、追求真理' },
  ],
  education: [
    { value: 'high_school', label: '高中在读', desc: '面临高考与志愿选择' },
    { value: 'undergraduate', label: '本科在读', desc: '面临保研/考研/就业/申请海外大学' },
    { value: 'graduate', label: '研究生在读', desc: '面临就业/读博/海外申请/转方向' },
    { value: 'working_1_3', label: '工作 1-3 年', desc: '面临转型、跳槽或深造' },
    { value: 'working_3_plus', label: '工作 3 年以上', desc: '面临晋升突破、换赛道或创业' },
  ],
  career: [
    { value: '大厂', label: '互联网大厂', desc: '高薪高压，追求高速成长' },
    { value: '体制内', label: '体制内/国企', desc: '稳定安全，节奏适中' },
    { value: '科研', label: '科研院所/高校', desc: '深耕学术，自由度高' },
    { value: '创业', label: '自主创业', desc: '风险高，但上限更高' },
    { value: '外企', label: '外资企业', desc: '国际化环境，强调平衡' },
    { value: '自由', label: '自由职业', desc: '自主灵活，收入波动更大' },
  ],
  risk: [
    { value: 'conservative', label: '保守型', desc: '优先稳定，规避风险' },
    { value: 'balanced', label: '平衡型', desc: '接受适度风险' },
    { value: 'aggressive', label: '激进型', desc: '追求高回报，愿意冒险' },
  ],
};

function isWorkingStage(stage = formData.education_stage) {
  return ['working_1_3', 'working_3_plus'].includes(stage);
}

function isStudentStage(stage = formData.education_stage) {
  return ['high_school', 'undergraduate', 'graduate'].includes(stage);
}

function getSteps() {
  return BASE_STEPS.map(step => {
    if (step.key !== 'background') return step;
    if (isWorkingStage()) {
      return { ...step, label: 'CAREER_CONTEXT', title: '职业背景' };
    }
    if (formData.education_stage === 'high_school') {
      return { ...step, label: 'ACADEMIC_CONTEXT', title: '学业基础' };
    }
    return { ...step, label: 'ACADEMIC_BACKGROUND', title: '学业背景' };
  });
}

function getCurrentStep() {
  return getSteps()[currentStep];
}

function setField(field, value) {
  formData[field] = value;
  if (field === 'education_stage' && isWorkingStage(value)) {
    formData.gpa_range = '';
  }
}

function renderRadioGrid(options, field, selectedValue, { allowCustom = false, customPlaceholder = '输入自定义内容' } = {}) {
  const optionValues = options.map(option => option.value);
  const customValue = selectedValue && !optionValues.includes(selectedValue) ? selectedValue : '';
  return `
    <div class="radio-grid">
      ${options.map(o => `
        <div class="radio-card ${selectedValue === o.value ? 'selected' : ''}" data-field="${field}" data-value="${o.value}">
          <div class="radio-card-title">${o.label}</div>
          ${o.desc ? `<div class="radio-card-desc">${o.desc}</div>` : ''}
        </div>
      `).join('')}
      ${allowCustom ? `
        <div class="radio-card ${customValue ? 'selected' : ''}" data-custom-card="true" data-field="${field}">
          <div class="radio-card-title">自定义输入</div>
          <input class="form-input radio-custom-input" data-field="${field}" value="${customValue}" placeholder="${customPlaceholder}" style="margin-top:8px;background:var(--white);" />
        </div>
      ` : ''}
    </div>
  `;
}

function renderBackgroundStep() {
  if (isWorkingStage()) {
    return `
      <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">职业背景</h2>
      <p class="text-secondary mb-24">基于你的工作阶段，只保留会影响职业推演的问题。</p>
      <div class="grid-2 gap-16">
        <div class="form-group">
          <label class="form-label">最高学历院校</label>
          <input class="form-input" id="field-school" value="${formData.school}" placeholder="如：华南理工大学" />
        </div>
        <div class="form-group">
          <label class="form-label">专业 / 当前赛道</label>
          <input class="form-input" id="field-major" value="${formData.major}" placeholder="如：软件工程 / AI 产品" />
        </div>
        <div class="form-group" style="grid-column:1 / span 2;">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${formData.city_preference === '一线城市' ? 'selected' : ''}>一线城市（资源密集，竞争强）</option>
            <option value="新一线" ${formData.city_preference === '新一线' ? 'selected' : ''}>新一线（机会与生活成本更平衡）</option>
            <option value="二线城市" ${formData.city_preference === '二线城市' ? 'selected' : ''}>二线城市（稳定发展）</option>
            <option value="家乡" ${formData.city_preference === '家乡' ? 'selected' : ''}>回到家乡 / 本省</option>
            <option value="无所谓" ${formData.city_preference === '无所谓' ? 'selected' : ''}>地点开放</option>
          </select>
        </div>
      </div>
      <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
        <div class="mono-xs text-accent" style="margin-bottom:8px;">FLOW_NOTE:</div>
        <p style="font-size:13px;color:var(--secondary);line-height:1.7;">
          你已选择工作阶段，系统会自动跳过 GPA、保研等学生向问题，后续分支会更偏向跳槽、晋升、海外 offer、创业与城市迁移。
        </p>
      </div>
    `;
  }

  if (formData.education_stage === 'high_school') {
    return `
      <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">学业基础</h2>
      <p class="text-secondary mb-24">围绕高考与专业选择补全背景。</p>
      <div class="grid-2 gap-16">
        <div class="form-group">
          <label class="form-label">当前学校</label>
          <input class="form-input" id="field-school" value="${formData.school}" placeholder="如：广雅中学" />
        </div>
        <div class="form-group">
          <label class="form-label">意向专业 / 学科方向</label>
          <input class="form-input" id="field-major" value="${formData.major}" placeholder="如：计算机 / 金融 / 临床医学" />
        </div>
        <div class="form-group">
          <label class="form-label">当前成绩段</label>
          <select class="form-select" id="field-gpa">
            <option value="">请选择</option>
            <option value="top_10%" ${formData.gpa_range === 'top_10%' ? 'selected' : ''}>年级前 10%</option>
            <option value="top_30%" ${formData.gpa_range === 'top_30%' ? 'selected' : ''}>年级前 30%</option>
            <option value="mid" ${formData.gpa_range === 'mid' ? 'selected' : ''}>中等稳定</option>
            <option value="unstable" ${formData.gpa_range === 'unstable' ? 'selected' : ''}>波动较大</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${formData.city_preference === '一线城市' ? 'selected' : ''}>一线城市</option>
            <option value="新一线" ${formData.city_preference === '新一线' ? 'selected' : ''}>新一线</option>
            <option value="省会" ${formData.city_preference === '省会' ? 'selected' : ''}>省会城市</option>
            <option value="家乡" ${formData.city_preference === '家乡' ? 'selected' : ''}>留在家乡</option>
            <option value="无所谓" ${formData.city_preference === '无所谓' ? 'selected' : ''}>无所谓</option>
          </select>
        </div>
      </div>
    `;
  }

  return `
    <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">学业背景</h2>
    <p class="text-secondary mb-24">补充会直接影响学业与职业推演的关键变量。</p>
    <div class="grid-2 gap-16">
      <div class="form-group">
        <label class="form-label">学校名称</label>
        <input class="form-input" id="field-school" value="${formData.school}" placeholder="如：中山大学" />
      </div>
      <div class="form-group">
        <label class="form-label">专业方向</label>
        <input class="form-input" id="field-major" value="${formData.major}" placeholder="如：计算机科学" />
      </div>
      <div class="form-group">
        <label class="form-label">GPA 区间</label>
        <select class="form-select" id="field-gpa">
          <option value="">请选择</option>
          <option value="3.8+" ${formData.gpa_range === '3.8+' ? 'selected' : ''}>3.8+（优秀）</option>
          <option value="3.5-3.8" ${formData.gpa_range === '3.5-3.8' ? 'selected' : ''}>3.5-3.8（良好）</option>
          <option value="3.0-3.5" ${formData.gpa_range === '3.0-3.5' ? 'selected' : ''}>3.0-3.5（中等）</option>
          <option value="<3.0" ${formData.gpa_range === '<3.0' ? 'selected' : ''}>3.0 以下</option>
        </select>
      </div>
        <div class="form-group">
          <label class="form-label">城市偏好</label>
          <select class="form-select" id="field-city">
            <option value="">请选择</option>
            <option value="一线城市" ${formData.city_preference === '一线城市' ? 'selected' : ''}>一线城市（北上广深）</option>
            <option value="新一线" ${formData.city_preference === '新一线' ? 'selected' : ''}>新一线（杭州、成都、武汉…）</option>
            <option value="海外城市" ${formData.city_preference === '海外城市' ? 'selected' : ''}>海外城市（港新英美澳等）</option>
            <option value="二线城市" ${formData.city_preference === '二线城市' ? 'selected' : ''}>二线城市</option>
            <option value="家乡" ${formData.city_preference === '家乡' ? 'selected' : ''}>留在家乡</option>
            <option value="无所谓" ${formData.city_preference === '无所谓' ? 'selected' : ''}>无所谓</option>
          </select>
      </div>
    </div>
  `;
}

function renderStepContent() {
  const step = getCurrentStep();
  switch (step.key) {
    case 'personality':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">选择最接近你的性格类型</p>
        ${renderRadioGrid(OPTIONS.personality, 'personality_type', formData.personality_type, { allowCustom: true, customPlaceholder: '如：ENFJ / INFJ / 其他人格标签' })}
      `;
    case 'education':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">你的当前阶段会决定后续问题分支。</p>
        ${renderRadioGrid(OPTIONS.education, 'education_stage', formData.education_stage)}
      `;
    case 'background':
      return renderBackgroundStep();
    case 'family':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">家庭约束和支持会显著改变路径分叉。</p>
        <div class="form-group">
          <label class="form-label">家庭经济状况</label>
          ${renderRadioGrid(['优越', '中等', '一般', '困难'].map(v => ({ value: v, label: v })), 'family_economy', formData.family_economy, { allowCustom: true, customPlaceholder: '如：家庭有房贷压力 / 现金流紧张' })}
        </div>
        <div class="form-group mt-24">
          <label class="form-label">家庭期望</label>
          ${renderRadioGrid(
            (isWorkingStage()
              ? ['稳定发展', '尽快晋升', '回本省定居', '收入优先', '自由选择']
              : ['考公/体制内', '留在本省', '高薪优先', '自由选择', '读博深造']
            ).map(v => ({ value: v, label: v })),
            'family_expectation',
            formData.family_expectation,
            { allowCustom: true, customPlaceholder: '如：支持出国 / 支持 gap / 希望尽早结婚' }
          )}
        </div>
      `;
    case 'preference':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">${isWorkingStage() ? '职业路线、转型方式、海外机会和风险承受度会直接影响回溯分支。' : '职业方向、继续深造、海外申请与风险偏好会影响后续推演走向。'}</p>
        <div class="form-group">
          <label class="form-label">职业方向偏好</label>
          ${renderRadioGrid(OPTIONS.career, 'career_preference', formData.career_preference, { allowCustom: true, customPlaceholder: '如：申请海外大学 / NGO / 艺术创作 / 医疗方向' })}
        </div>
        <div class="form-group mt-24">
          <label class="form-label">风险偏好</label>
          ${renderRadioGrid(OPTIONS.risk, 'risk_preference', formData.risk_preference, { allowCustom: true, customPlaceholder: '如：阶段性激进 / 对出国冒险更开放' })}
        </div>
      `;
    case 'concern':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">你当前最想推演的问题是什么？</p>
        <div class="form-group">
          <label class="form-label">核心困惑（自由描述）</label>
          <textarea class="form-textarea" id="field-concern" placeholder="${isWorkingStage() ? '例如：我是继续留在当前公司争取管理岗，还是接受海外团队 offer 去新赛道？' : '例如：我应该保研、直接就业，还是申请海外大学？如果选择出国，3 年后的发展会更好吗？'}">${formData.current_concern}</textarea>
        </div>
        <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
          <div class="mono-xs text-accent" style="margin-bottom:8px;">ANALYST_NOTE:</div>
          <p style="font-size:13px;color:var(--secondary);font-style:italic;line-height:1.7;">
            尽量写清楚分歧点、现实约束和你最在意的代价。系统会从这里抽取变量，自动发散影响因素并生成推演树。
          </p>
        </div>
      `;
    default:
      return '';
  }
}

export function renderOnboarding(container) {
  const steps = getSteps();
  const step = steps[currentStep];

  container.innerHTML = `
    <div class="onboarding-layout">
      <div class="onboarding-sidebar">
        <div class="mono-xs text-muted" style="margin-bottom:8px;">SYSTEM_ENTITY</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-size:18px;margin-bottom:4px;">[PROFILE_BUILDER]</div>
        <div class="mono-xs flex items-center gap-4"><span class="status-dot status-stable"></span> STEP ${currentStep + 1}/${steps.length}</div>
        <div class="step-indicator" style="margin-top:24px;" id="step-nav">
          ${steps.map((s, i) => `
            <div class="step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}" data-step="${i}">
              [${s.label}]
            </div>
          `).join('')}
        </div>
      </div>
      <div class="onboarding-main">
        <div style="margin-bottom:16px;" class="mono-xs text-muted">BRANCH_ID: ${state.projectId || 'N/A'} // STEP ${currentStep + 1} OF ${steps.length}</div>
        <div id="step-content" class="fade-in">
          ${renderStepContent()}
        </div>
        <div class="flex justify-between mt-32">
          <button class="btn btn-ghost" id="btn-prev" ${currentStep === 0 ? 'disabled style="opacity:0.3"' : ''}>[PREVIOUS]</button>
          <button class="btn ${currentStep === steps.length - 1 ? 'btn-accent' : 'btn-primary'}" id="btn-next">
            ${currentStep === steps.length - 1 ? '[SUBMIT_PROFILE]' : '[NEXT_STEP]'}
          </button>
        </div>
      </div>
    </div>
  `;

  attachInteractiveHandlers(container);

  container.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = parseInt(item.dataset.step, 10);
      if (target <= currentStep) {
        saveCurrentStepData();
        currentStep = target;
        renderOnboarding(container);
      }
    });
  });

  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentStep > 0) {
      saveCurrentStepData();
      currentStep -= 1;
      renderOnboarding(container);
    }
  });

  document.getElementById('btn-next').addEventListener('click', async () => {
    saveCurrentStepData();
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      renderOnboarding(container);
      return;
    }

    try {
      await api.submitProfile(state.projectId, formData);
      currentStep = 0;
      navigateTo('parameters');
    } catch (e) {
      alert('Profile submission failed: ' + e.message);
    }
  });
}

function attachInteractiveHandlers(container) {
  container.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.customCard === 'true') {
        card.querySelector('.radio-custom-input')?.focus();
        return;
      }
      const field = card.dataset.field;
      const value = card.dataset.value;
      setField(field, value);
      document.getElementById('step-content').innerHTML = renderStepContent();
      attachInteractiveHandlers(container);
    });
  });

  function syncCustomCardState(field, value) {
    container.querySelectorAll(`.radio-card[data-field="${field}"]`).forEach(card => {
      if (card.dataset.customCard === 'true') {
        card.classList.toggle('selected', !!value.trim());
      } else if (card.dataset.value) {
        card.classList.toggle('selected', card.dataset.value === value);
      }
    });
  }

  container.querySelectorAll('.radio-custom-input').forEach(input => {
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('focus', () => {
      syncCustomCardState(input.dataset.field, input.value);
    });
    input.addEventListener('input', () => {
      setField(input.dataset.field, input.value);
      syncCustomCardState(input.dataset.field, input.value);
    });
    input.addEventListener('blur', () => {
      const normalized = input.value.trim();
      setField(input.dataset.field, normalized);
      input.value = normalized;
      syncCustomCardState(input.dataset.field, normalized);
    });
  });
}

function saveCurrentStepData() {
  const step = getCurrentStep();
  switch (step.key) {
    case 'background':
      formData.school = document.getElementById('field-school')?.value || '';
      formData.major = document.getElementById('field-major')?.value || '';
      formData.gpa_range = isWorkingStage() ? '' : document.getElementById('field-gpa')?.value || '';
      formData.city_preference = document.getElementById('field-city')?.value || '';
      break;
    case 'concern':
      formData.current_concern = document.getElementById('field-concern')?.value || '';
      break;
    default:
      break;
  }
}
