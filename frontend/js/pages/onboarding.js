/**
 * Onboarding / Questionnaire Page
 */

import { api } from '../api.js';
import { navigateTo, state } from '../app.js';

const STEPS = [
  { key: 'personality', label: 'PERSONALITY_TYPE', title: '性格倾向' },
  { key: 'education', label: 'EDUCATION_STAGE', title: '教育阶段' },
  { key: 'background', label: 'ACADEMIC_BACKGROUND', title: '学业背景' },
  { key: 'family', label: 'FAMILY_CONDITIONS', title: '家庭情况' },
  { key: 'preference', label: 'CAREER_PREFERENCE', title: '职业偏好' },
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
    { value: 'high_school', label: '高中在读', desc: '面临高考选择' },
    { value: 'undergraduate', label: '本科在读', desc: '面临保研/考研/就业' },
    { value: 'graduate', label: '研究生在读', desc: '面临就业/读博' },
    { value: 'working_1_3', label: '工作 1-3 年', desc: '面临转型/深造' },
    { value: 'working_3_plus', label: '工作 3 年以上', desc: '面临突破/转行' },
  ],
  career: [
    { value: '大厂', label: '互联网大厂', desc: '高薪高压，快速成长' },
    { value: '体制内', label: '体制内/国企', desc: '稳定安全，节奏适中' },
    { value: '科研', label: '科研院所/高校', desc: '深耕学术，自由度高' },
    { value: '创业', label: '自主创业', desc: '风险极高，回报无上限' },
    { value: '外企', label: '外资企业', desc: 'Work-life balance' },
    { value: '自由', label: '自由职业', desc: '灵活自主，收入不稳' },
  ],
  risk: [
    { value: 'conservative', label: '保守型', desc: '优先稳定，规避风险' },
    { value: 'balanced', label: '平衡型', desc: '可接受适度风险' },
    { value: 'aggressive', label: '激进型', desc: '追求高回报，敢于冒险' },
  ],
};

function renderStepContent() {
  const step = STEPS[currentStep];
  switch (step.key) {
    case 'personality':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">选择最接近你的性格类型</p>
        <div class="radio-grid">
          ${OPTIONS.personality.map(o => `
            <div class="radio-card ${formData.personality_type === o.value ? 'selected' : ''}" data-field="personality_type" data-value="${o.value}">
              <div class="radio-card-title">${o.label}</div>
              <div class="radio-card-desc">${o.desc}</div>
            </div>
          `).join('')}
        </div>
      `;
    case 'education':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">你当前处于哪个阶段？</p>
        <div class="radio-grid">
          ${OPTIONS.education.map(o => `
            <div class="radio-card ${formData.education_stage === o.value ? 'selected' : ''}" data-field="education_stage" data-value="${o.value}">
              <div class="radio-card-title">${o.label}</div>
              <div class="radio-card-desc">${o.desc}</div>
            </div>
          `).join('')}
        </div>
      `;
    case 'background':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">学业背景信息</p>
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
              <option value="二线城市" ${formData.city_preference === '二线城市' ? 'selected' : ''}>二线城市</option>
              <option value="家乡" ${formData.city_preference === '家乡' ? 'selected' : ''}>留在家乡</option>
              <option value="无所谓" ${formData.city_preference === '无所谓' ? 'selected' : ''}>无所谓</option>
            </select>
          </div>
        </div>
      `;
    case 'family':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">家庭背景与支持情况</p>
        <div class="form-group">
          <label class="form-label">家庭经济状况</label>
          <div class="radio-grid">
            ${['优越', '中等', '一般', '困难'].map(v => `
              <div class="radio-card ${formData.family_economy === v ? 'selected' : ''}" data-field="family_economy" data-value="${v}">
                <div class="radio-card-title">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="form-group mt-24">
          <label class="form-label">家庭期望</label>
          <div class="radio-grid">
            ${['考公/体制内', '留在本省', '高薪优先', '自由选择', '读博深造'].map(v => `
              <div class="radio-card ${formData.family_expectation === v ? 'selected' : ''}" data-field="family_expectation" data-value="${v}">
                <div class="radio-card-title">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    case 'preference':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">职业方向与风险偏好</p>
        <div class="form-group">
          <label class="form-label">职业方向偏好</label>
          <div class="radio-grid">
            ${OPTIONS.career.map(o => `
              <div class="radio-card ${formData.career_preference === o.value ? 'selected' : ''}" data-field="career_preference" data-value="${o.value}">
                <div class="radio-card-title">${o.label}</div>
                <div class="radio-card-desc">${o.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="form-group mt-24">
          <label class="form-label">风险偏好</label>
          <div class="radio-grid">
            ${OPTIONS.risk.map(o => `
              <div class="radio-card ${formData.risk_preference === o.value ? 'selected' : ''}" data-field="risk_preference" data-value="${o.value}">
                <div class="radio-card-title">${o.label}</div>
                <div class="radio-card-desc">${o.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    case 'concern':
      return `
        <h2 style="font-family:var(--font-headline);font-size:32px;font-weight:700;margin-bottom:8px;">${step.title}</h2>
        <p class="text-secondary mb-24">你当前最想推演的问题是什么？</p>
        <div class="form-group">
          <label class="form-label">核心困惑（自由描述）</label>
          <textarea class="form-textarea" id="field-concern" placeholder="例如：我应该保研还是直接就业？如果选择保研，3年后的发展会比直接工作更好吗？">${formData.current_concern}</textarea>
        </div>
        <div class="card mt-24" style="background:var(--surface-low);border-left:2px solid var(--accent);padding:20px;">
          <div class="mono-xs text-accent" style="margin-bottom:8px;">ANALYST_NOTE:</div>
          <p style="font-size:13px;color:var(--secondary);font-style:italic;">
            "尽量描述具体的分歧点和纠结原因。系统会从你的困惑中提取关键变量，
            自动发散出多层影响因素，生成智能体并开始推演。"
          </p>
        </div>
      `;
  }
}

export function renderOnboarding(container) {
  container.innerHTML = `
    <div class="onboarding-layout">
      <div class="onboarding-sidebar">
        <div class="mono-xs text-muted" style="margin-bottom:8px;">SYSTEM_ENTITY</div>
        <div style="font-family:var(--font-headline);font-weight:700;font-size:18px;margin-bottom:4px;">[PROFILE_BUILDER]</div>
        <div class="mono-xs flex items-center gap-4"><span class="status-dot status-stable"></span> STEP ${currentStep + 1}/${STEPS.length}</div>
        <div class="step-indicator" style="margin-top:24px;" id="step-nav">
          ${STEPS.map((s, i) => `
            <div class="step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}" data-step="${i}">
              [${s.label}]
            </div>
          `).join('')}
        </div>
      </div>
      <div class="onboarding-main">
        <div style="margin-bottom:16px;" class="mono-xs text-muted">BRANCH_ID: ${state.projectId || 'N/A'} // STEP ${currentStep + 1} OF ${STEPS.length}</div>
        <div id="step-content" class="fade-in">
          ${renderStepContent()}
        </div>
        <div class="flex justify-between mt-32">
          <button class="btn btn-ghost" id="btn-prev" ${currentStep === 0 ? 'disabled style="opacity:0.3"' : ''}>[PREVIOUS]</button>
          <button class="btn ${currentStep === STEPS.length - 1 ? 'btn-accent' : 'btn-primary'}" id="btn-next">
            ${currentStep === STEPS.length - 1 ? '[SUBMIT_PROFILE]' : '[NEXT_STEP]'}
          </button>
        </div>
      </div>
    </div>
  `;

  // Radio card clicks
  container.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.dataset.field;
      const value = card.dataset.value;
      formData[field] = value;
      // Re-render step
      document.getElementById('step-content').innerHTML = renderStepContent();
      // Re-attach radio card handlers
      attachRadioHandlers(container);
    });
  });

  // Step nav clicks
  container.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step);
      if (step <= currentStep) {
        currentStep = step;
        renderOnboarding(container);
      }
    });
  });

  // Navigation
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentStep > 0) {
      saveCurrentStepData();
      currentStep--;
      renderOnboarding(container);
    }
  });

  document.getElementById('btn-next').addEventListener('click', async () => {
    saveCurrentStepData();
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderOnboarding(container);
    } else {
      // Submit profile
      try {
        await api.submitProfile(state.projectId, formData);
        currentStep = 0; // Reset for next time
        navigateTo('parameters');
      } catch (e) {
        alert('Profile submission failed: ' + e.message);
      }
    }
  });
}

function attachRadioHandlers(container) {
  container.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.dataset.field;
      const value = card.dataset.value;
      formData[field] = value;
      document.getElementById('step-content').innerHTML = renderStepContent();
      attachRadioHandlers(container);
    });
  });
}

function saveCurrentStepData() {
  const step = STEPS[currentStep];
  switch (step.key) {
    case 'background':
      formData.school = document.getElementById('field-school')?.value || '';
      formData.major = document.getElementById('field-major')?.value || '';
      formData.gpa_range = document.getElementById('field-gpa')?.value || '';
      formData.city_preference = document.getElementById('field-city')?.value || '';
      break;
    case 'concern':
      formData.current_concern = document.getElementById('field-concern')?.value || '';
      break;
  }
}
