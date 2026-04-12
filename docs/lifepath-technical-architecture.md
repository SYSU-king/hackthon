# LifePath Engine 技术架构文档

## 1. 文档定位

本文档是 LifePath Engine 的**唯一技术架构参考**，合并了此前散落在多份文档中的引擎范式、前后端规划和 MiroFish 迁移策略，并补充了此前缺失的关键设计：

- 外部系统（Zep、OASIS）的使用策略与迁移方案
- 多 Agent 互动的**完整行为协议**
- LLM 调用策略与成本控制
- 人生推演引擎的回合执行细节

---

## 2. 系统总览

### 2.1 核心闭环

```
用户输入 → 本体生成 → Zep 图谱构建 → 实体过滤 → Agent 生成 → 推演配置 → 多轮模拟 → 记忆回写 → 报告生成
```

### 2.2 四层架构

| 层级 | 职责 | 技术选型 |
|------|------|----------|
| 前端交互层 | 建模、图谱查看、路径浏览、节点修改 | Vite + Vanilla JS（SPA，hash 路由） |
| 后端应用层 | API、项目管理、任务编排 | FastAPI + Pydantic |
| 推演引擎层 | 图谱、Agent、模拟、分支、记忆 | Python + OASIS（改造后） + Zep（预留） |
| 存储层 | 用户档案、路径版本、图谱 | **本地 JSON 文件存储**（每个项目一个 JSON 文件，`data/projects/{id}.json`） |

---

## 3. 外部系统使用策略

### 3.1 Zep — GraphRAG 记忆层（直接沿用）

**决策：完全沿用 MiroFish 对 Zep 的使用方式。**

Zep 在系统中承担以下角色：

| 功能 | 对应 MiroFish 模块 | 人生项目对应 |
|------|-------------------|-------------|
| 本体定义 | `ontology_generator.py` → `graph_builder.set_ontology()` | 生成人生实体类型（Self, Family, School, Employer, City...）和关系类型（influences, constrains, enables...） |
| 图谱构建 | `graph_builder.py` → `client.graph.add_batch()` | 把用户背景文本分块写入 Zep，自动抽取实体和关系 |
| 实体检索 | `zep_entity_reader.py` → `client.graph.search()` | 从图谱中读取与人生推演相关的实体 |
| 记忆回写 | `zep_graph_memory_updater.py` → `client.graph.add()` | 每轮推演产生的新事件写回图谱，形成时序记忆 |
| 上下文检索 | `oasis_profile_generator.py` → `client.graph.search()` | 为 Agent Profile 生成提供丰富的关系上下文 |

**迁移要点：**
- 本体类型从社交实体改为人生实体（详见 §4）
- 图谱的 `graph_id` 命名从 `mirofish_xxx` 改为 `lifepath_xxx`
- 记忆回写内容从社交动作（发帖/评论/转发）改为人生事件（决策/机会/风险）

### 3.2 OASIS — 仿真运行环境（改造使用）

**决策：沿用 OASIS 作为底层仿真引擎，但对其动作集和平台环境做改造。**

MiroFish 使用 OASIS 的方式：
```python
# 1. 加载 Agent Profile
agent_graph = await generate_reddit_agent_graph(profile_path, model, available_actions)

# 2. 创建环境
env = oasis.make(agent_graph=agent_graph, platform=oasis.DefaultPlatformType.REDDIT, ...)

# 3. 每轮推进：选择活跃 Agent，让 LLM 决定动作
actions = {agent: LLMAction() for _, agent in active_agents}
await env.step(actions)

# 4. 模拟后采访
actions = {agent: ManualAction(action_type=ActionType.INTERVIEW, action_args={"prompt": "..."})}
await env.step(actions)
```

**人生项目改造方案：**

| 维度 | MiroFish | LifePath Engine |
|------|----------|-----------------|
| 平台类型 | `REDDIT` / `TWITTER` | 自定义 `LIFE_STAGE` 平台类型（或复用 REDDIT 作为底层，仅改 prompt） |
| 动作集 | `CREATE_POST, LIKE, COMMENT, FOLLOW, REPOST...` | 自定义人生动作集（详见 §5.3） |
| 时间单位 | 每轮 30-60 分钟（模拟社交活跃度） | 每轮 = 1 个月 / 1 个学期 / 1 年 |
| Agent 数量 | 数十个（舆论主体） | 8-15 个（人生影响角色） |
| 并行世界 | Twitter + Reddit 双平台 | 多条人生路径分支 |

**最小改造路径（推荐）：**

复用 OASIS 的 Reddit 环境作为底层运行时，但通过 **Prompt 工程** 将社交动作语义替换为人生动作语义。具体来说：
- 仍然使用 `CREATE_POST` 动作类型，但在 Agent 的 persona prompt 中明确指示："你不是在社交媒体发帖，而是在做出一个人生决策/提供一个机会/施加一个约束"
- Agent 生成的 "帖子" 内容就是该 Agent 在本轮对用户人生施加的影响

这样可以 **零改动使用 OASIS**，同时通过 prompt 实现完全不同的语义。

---

## 4. 人生本体定义（替换 MiroFish 的舆论本体）

### 4.1 实体类型（10 个，Zep 上限）

| 类型名 | 描述 | 对应 MiroFish |
|--------|------|---------------|
| `Self` | 用户本人，核心主体 | 无对应（新增） |
| `FamilyMember` | 家人，提供支持/压力/约束 | Person |
| `Mentor` | 导师/前辈，提供指导和机会 | Professor |
| `Partner` | 伴侣，影响生活决策 | Person |
| `School` | 学校/院系，提供学术环境和规则 | University |
| `Employer` | 公司/雇主，提供职业机会 | Organization |
| `City` | 城市，代表地域机会和生活成本 | 无对应（新增） |
| `Industry` | 行业/赛道，代表市场景气度 | MediaOutlet 的位置 |
| `Person` | 个人兜底（朋友、同学等） | Person（兜底） |
| `Organization` | 组织兜底（政策系统、社群等） | Organization（兜底） |

### 4.2 关系类型（8 个）

| 关系名 | 描述 | source → target |
|--------|------|-----------------|
| `INFLUENCES` | 影响决策 | 任意 → Self |
| `CONSTRAINS` | 施加约束/限制 | FamilyMember, Employer → Self |
| `ENABLES` | 提供机会/可能性 | School, Mentor, City → Self |
| `DEPENDS_ON` | 依赖关系 | Self → School, Employer |
| `COMPETES_WITH` | 竞争关系 | Self → Person |
| `SUPPORTS` | 提供支持 | FamilyMember, Mentor, Partner → Self |
| `BELONGS_TO` | 归属关系 | Self → School, Employer, City |
| `CONFLICTS_WITH` | 冲突/矛盾关系 | 任意 → 任意 |

---

## 5. 多 Agent 互动协议（核心新增内容）

### 5.1 设计原则

MiroFish 的 Agent 互动机制：
- 每轮由 OASIS 环境调度活跃 Agent
- 每个活跃 Agent 由 LLM 决定执行哪个动作（发帖/评论/点赞等）
- 动作写入 SQLite 数据库
- 动作日志实时回写 Zep 图谱

人生项目复用这套机制，但**重新定义动作语义**。

### 5.2 Agent 分类与职责

#### A. 主体 Agent

| Agent | 持有属性 | 每轮行为 |
|-------|---------|----------|
| `Self Agent` | 能力、偏好、目标、承压能力、决策风格 | 做出人生选择（申请/放弃/投入/转向） |

#### B. 关系 Agent

| Agent | 持有属性 | 每轮行为 |
|-------|---------|----------|
| `Family Agent` | 经济条件、期望、支持度 | 提供支持或施加压力、改变经济支持 |
| `Mentor Agent` | 资源强度、支持意愿 | 提供推荐/机会或降低支持 |
| `Partner Agent` | 稳定度、支持度 | 增强或减弱情感支持 |

#### C. 机构 Agent

| Agent | 持有属性 | 每轮行为 |
|-------|---------|----------|
| `School Agent` | 保研名额、学术资源 | 提供/收回名额、调整门槛 |
| `Employer Agent` | 岗位数量、薪资区间、门槛 | 发放/收回 offer、调整招聘标准 |
| `City Agent` | 机会密度、生活成本 | 调整机会可用性和生活成本 |

#### D. 环境 Agent

| Agent | 持有属性 | 每轮行为 |
|-------|---------|----------|
| `Industry Agent` | 景气度、增长率 | 行业变热/变冷 |
| `Risk Agent` | 概率分布 | 随机触发健康/家庭/经济风险事件 |

#### E. 编排 Agent（不进入 OASIS，由后端逻辑实现）

| Agent | 职责 |
|-------|------|
| `Director Agent` | 控制时间推进、判断分支、管理路径 |
| `Report Agent` | 基于图谱和日志生成解释性报告 |

### 5.3 人生动作集（Action Types）

替换 OASIS 原有社交动作：

| 动作类型 | 执行者 | 语义 | 对应 OASIS 原始动作 |
|----------|--------|------|-------------------|
| `MAKE_DECISION` | Self | 做出一个选择（保研/就业/换城市等） | `CREATE_POST` |
| `PROVIDE_OPPORTUNITY` | School, Employer, City, Mentor | 提供一个机会（名额/offer/资源） | `CREATE_POST` |
| `APPLY_PRESSURE` | Family, Partner | 施加压力或提出期望 | `CREATE_COMMENT` |
| `GIVE_SUPPORT` | Family, Mentor, Partner | 提供支持（经济/情感/资源） | `LIKE_POST` |
| `WITHDRAW_SUPPORT` | Family, Mentor, Partner | 减少支持 | `DISLIKE_POST` |
| `CHANGE_CONDITION` | Industry, City, Risk | 改变外部条件（行业变冷/城市门槛变高） | `CREATE_POST` |
| `TRIGGER_RISK` | Risk | 触发风险事件（健康/经济/家庭突发） | `CREATE_POST` |
| `REFLECT` | Self | 阶段反思（评价当前状态） | `CREATE_COMMENT` |
| `DO_NOTHING` | 任意 | 本轮无行动 | `DO_NOTHING` |

### 5.4 行动协议格式

每个 Agent 每轮输出一个结构化行动：

```json
{
  "agent_id": "mentor_01",
  "agent_type": "Mentor",
  "round_num": 5,
  "time_label": "2027-Q3",
  "action_type": "WITHDRAW_SUPPORT",
  "target_agent": "self",
  "payload": {
    "support_delta": -0.3,
    "reason": "论文进度严重滞后，导师对学生的研究能力产生怀疑",
    "affected_states": ["academic_support", "mental_pressure"]
  },
  "narrative": "导师在组会后单独找你谈话，表示如果下学期还没有实质性突破，可能会建议你考虑转方向。"
}
```

### 5.5 行动输出到 OASIS 的映射

由于实际使用 OASIS Reddit 环境，Agent 的行动需要映射为 OASIS 可执行的格式：

```python
# Agent 的 persona prompt 中植入人生行为指令
persona = """
你是{agent_name}，一个{role_description}。
你不是在社交媒体上发帖，而是在对{user_name}的人生施加影响。
当前时间点：{time_label}
当前世界状态：{world_state_summary}
你的立场和资源：{agent_state}

请根据你的角色和当前处境，决定你在这个时间段对{user_name}做出什么行为。
输出格式：先写行动类型，再写具体内容和原因。
"""

# OASIS 执行时，Agent 的 "帖子" 内容就是其行动描述
# 后端解析帖子内容，提取结构化的 action 数据
```

### 5.6 每轮执行流程

```
1. Director 确定当前时间片（如 2027-Q3）
2. Director 根据时间和配置选择本轮活跃 Agent
3. 为每个活跃 Agent 加载当前图谱上下文（通过 Zep 检索）
4. 更新每个 Agent 的 persona prompt（注入最新世界状态）
5. 调用 OASIS env.step()，每个 Agent 由 LLM 生成行动
6. 后端从 OASIS 数据库读取本轮行动日志
7. 解析行动，更新人生状态向量
8. 将行动回写 Zep 图谱（通过 ZepGraphMemoryUpdater）
9. Director 判断是否触发分支（状态差异阈值检测）
10. 保存 checkpoint，进入下一轮
```

---

## 6. 人生状态模型

### 6.1 状态向量

每条路径在每轮结束后维护一个多维状态向量：

```python
@dataclass
class LifeState:
    """人生状态快照"""
    # 核心维度（0.0 - 1.0）
    education: float = 0.5       # 学业状态
    career: float = 0.0          # 职业发展
    finance: float = 0.3         # 经济状况
    health: float = 0.8          # 身心健康
    mental: float = 0.6          # 心理韧性
    relationship: float = 0.5    # 亲密关系
    family_support: float = 0.7  # 家庭支持度
    social_capital: float = 0.4  # 社会资本
    optionality: float = 0.8     # 可选择空间
    goal_alignment: float = 0.5  # 目标达成度

    # 元信息
    time_label: str = ""         # 如 "2027-Q3"
    branch_id: str = ""          # 所属分支
    round_num: int = 0           # 轮次
```

### 6.2 状态更新规则

状态更新 = **规则计算（70%）+ LLM 解释（30%）**

规则层：
- 每个 Action 预定义一组 `affected_states` 和 `delta` 范围
- 例如 `WITHDRAW_SUPPORT` → `academic_support -= 0.2~0.4`，`mental_pressure += 0.1~0.3`

LLM 层：
- 在规则更新完状态后，由 LLM 生成本轮的**叙事描述**和**连锁影响解释**
- 叙事用于前端展示和报告生成，不直接影响数值

---

## 7. 分支策略

### 7.1 分支触发条件

只有在以下情况下才生成新分支：

1. **关键决策发生**：Self Agent 面临 A/B 选择（如保研 vs 就业）
2. **关键机会出现**：收到 offer、获得名额等，存在接受/拒绝两种路径
3. **关键风险打断**：Risk Agent 触发重大事件（健康/家庭变故）
4. **核心状态差异达到阈值**：两条路径的状态向量欧氏距离 > 阈值

### 7.2 分支控制

| 参数 | 值 | 说明 |
|------|-----|------|
| 最大并行分支数 | 5 | 超过后触发剪枝 |
| 最终保留路径数 | 3-5 | 最优/保守/风险/平衡 |
| 状态差异阈值 | 0.3 | 低于此值的分支合并 |
| 最大推演轮数 | 20 | 对应 5 年（每季度一轮） |

---

## 8. LLM 调用策略

### 8.1 调用矩阵

| 步骤 | 使用 LLM | 使用规则 | 调用次数/推演 | 说明 |
|------|---------|---------|-------------|------|
| 本体生成 | ✅ | | 1 次 | 生成人生实体和关系类型 |
| 参数发散 | ✅ | | 1 次 | 最适合 LLM 的环节 |
| Agent Profile 生成 | ✅ | | 8-15 次 | 每个 Agent 一次，可并行 |
| 推演配置生成 | ✅ | | 3-5 次 | 分步生成，沿用 MiroFish 策略 |
| 每轮 Agent 行动 | ✅ | | 3-8 次/轮 | 只有活跃 Agent 调用 |
| 每轮状态更新 | | ✅ | 0 | 用公式计算 |
| 每轮叙事生成 | ✅ | | 1 次/轮 | 可选，给本轮加故事描述 |
| 分支判定 | | ✅ | 0 | 用阈值规则 |
| 报告生成 | ✅ | | 1 次 | 最终报告 |

### 8.2 成本估算（20 轮推演）

| 项目 | 调用次数 | Token/次 | 合计 Token |
|------|---------|---------|-----------|
| 前置步骤 | ~20 次 | ~2000 | ~40K |
| 每轮行动 | 20轮 × 5 Agent | ~1000 | ~100K |
| 每轮叙事 | 20 次 | ~500 | ~10K |
| 报告 | 1 次 | ~3000 | ~3K |
| **合计** | | | **~153K token** |

以 GPT-4o-mini 计算约 $0.02/次推演，可接受。

### 8.3 模型选择建议

- **推荐**：GPT-4o-mini（性价比最高，足够处理结构化人设和行动生成）
- **高质量模式**：GPT-4o / Claude 3.5 Sonnet（报告生成环节使用）
- **兼容方式**：通过 `.env` 的 `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL_NAME` 配置，与 MiroFish 完全一致

---

## 9. 与 MiroFish 的代码复用清单

### 9.1 可直接复用

| MiroFish 模块 | 复用方式 | 改动量 |
|--------------|---------|--------|
| `graph_builder.py` | 直接使用，改 graph_id 前缀 | 极小 |
| `ontology_generator.py` | 改 prompt 为人生实体 | 中等（改 prompt） |
| `zep_entity_reader.py` | 直接使用 | 无 |
| `zep_graph_memory_updater.py` | 改 `to_episode_text()` 为人生事件描述 | 中等 |
| `simulation_runner.py` | 改日志解析逻辑 | 中等 |
| `simulation_config_generator.py` | 大改 prompt，将社交参数改为人生参数 | 大 |
| `report_agent.py` | 改 prompt 为人生报告 | 大（改 prompt） |

### 9.2 需要新写

| 模块 | 说明 |
|------|------|
| `life_state.py` | 人生状态模型和状态更新规则 |
| `branch_manager.py` | 分支管理、剪枝、合并 |
| `checkpoint_manager.py` | 节点回退和 checkpoint 系统 |
| `advice_service.py` | AI 建议生成 |
| `questionnaire_service.py` | 问卷建模 |

### 9.3 前端复用

MiroFish 前端是 **Vue 3 + Vite + D3.js**，建议直接沿用同一技术栈：

| 可复用部分 | 说明 |
|-----------|------|
| D3.js 图谱渲染 | 节点动效和布局 |
| SSE 实时进度 | 推演过程反馈 |
| Vue Router 结构 | 页面路由 |

需要重写的部分：
- 所有页面的业务逻辑和 UI 布局
- API 对接层

---

## 10. 后端目录结构

```text
backend/
  app/
    api/
      projects.py          # 项目管理
      onboarding.py        # 用户建模（问卷/上传）
      graph.py             # 图谱操作
      simulation.py        # 推演控制
      paths.py             # 路径浏览/对比
      advice.py            # AI 建议
    core/
      config.py            # 配置（LLM、Zep、DB）
      db.py                # 数据库连接
      llm.py               # LLM 客户端
    domain/
      life_state.py        # 人生状态模型
      node.py              # 节点定义（决策/机会/结果/连锁/风险/反思）
      branch.py            # 分支定义
      agent.py             # Agent 定义
    services/
      # === 从 MiroFish 迁移 ===
      ontology_generator.py
      graph_builder.py
      zep_entity_reader.py
      oasis_profile_generator.py
      simulation_config_generator.py
      simulation_runner.py
      zep_graph_memory_updater.py
      report_agent.py
      # === 新增 ===
      questionnaire_service.py
      parameter_expansion_service.py
      life_graph_service.py
      agent_factory_service.py
      state_engine.py           # 状态更新引擎
      branch_manager.py
      checkpoint_manager.py
      advice_service.py
    repos/
      project_repo.py
      branch_repo.py
      node_repo.py
      checkpoint_repo.py
    workers/
      run_simulation_worker.py
      generate_advice_worker.py
```

---

## 11. 许可证注意事项

MiroFish 仓库使用 **GPL-3.0 许可证**。

- 如果直接复制代码，本项目也必须以 GPL-3.0 发布
- 如果只参考设计思路和架构、自己重新实现，则不受限制
- 建议在 Hackathon 阶段标注 "Based on MiroFish architecture"，后续根据项目性质决定许可证策略

---

## 12. 开发顺序建议

### Phase 1: 最小可运行推演（目标：1-2 天）

1. 复制 MiroFish 的 Zep 相关模块
2. 修改 `ontology_generator.py` 的 prompt 为人生实体
3. 修改 `oasis_profile_generator.py` 的 prompt 为人生角色
4. 实现 `life_state.py` 状态模型
5. 用 OASIS Reddit 环境跑一次 5 轮推演
6. 前端用 D3.js 展示图谱 + 路径卡片

### Phase 2: 分支与回退（目标：1-2 天）

7. 实现 `branch_manager.py`
8. 实现 `checkpoint_manager.py` + 节点回退
9. 前端添加路径对比页

### Phase 3: 报告与建议（目标：1 天）

10. 修改 `report_agent.py` 生成人生报告
11. 实现 `advice_service.py`
12. 前端添加报告页和建议页
