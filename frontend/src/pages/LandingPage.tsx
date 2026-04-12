import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import { formatNarrativeText, formatProviderLabel, formatRuntimeMode } from '../lib/i18n'

export function LandingPage() {
  const { state } = useDashboard()
  const profile = state?.profile
  const topPath = state?.paths[0]
  const stitchAssets = state?.stitch.assets ?? []
  const runtimeNote = formatNarrativeText(
    state?.llm.last_response_preview ?? '导演代理的运行注记将在下一轮生成。',
  )
  const activeBranch = state?.branches.find((branch) => branch.id === state.active_branch_id)

  return (
    <div className="landing-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">[prologue_01]</div>
          <h1 className="display-title">
            人生不是终点。
            <br />
            <span>它是一组可推演变量。</span>
          </h1>
          <p className="lead">
            以前端 Stitch 技术稿为壳，用本地生命模拟引擎驱动问卷建模、图谱变形、代理协作、
            状态回写与分支扩张，整条链路都落在本地文件里运行。
          </p>
          <div className="hero-actions">
            <Link className="chrome-button" to="/simulation">
              进入模拟总览
            </Link>
            <Link className="chrome-button chrome-button--ghost" to="/strategy">
              查看策略协议
            </Link>
          </div>
          <div className="meta-strip">
            <span>{profile?.stage ?? '模拟初始化中'}</span>
            <span>{profile?.location ?? 'Shanghai'}</span>
            <span>时间同步已启用</span>
          </div>
          <div className="hero-command-line">
            <span>命令面板</span>
            <span>分支: {activeBranch?.title ?? '科研路径'}</span>
            <span>运行模式: {formatRuntimeMode(state?.llm.mode ?? 'fallback')}</span>
            <span>资源数: {stitchAssets.length}</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="grid-backdrop" />
          <svg className="hero-visual__svg" viewBox="0 0 800 600">
            <path d="M50 300 Q 220 300 400 150 T 760 110" />
            <path className="hero-visual__ghost" d="M50 300 Q 240 300 410 450 T 760 500" />
            <path className="hero-visual__active" d="M50 300 L 760 300" />
            <rect height="10" width="10" x="395" y="145" />
            <rect className="hero-visual__active-box" height="10" width="10" x="395" y="295" />
            <rect height="10" width="10" x="395" y="445" />
            <text x="420" y="156">分支 A: 优势路径</text>
            <text x="420" y="306">当前主路径</text>
            <text x="420" y="456">分支 B: 退化路径</text>
          </svg>
          <div className="hero-visual__artifact">
            <div className="eyebrow">系统日志</div>
            <strong>{activeBranch?.title ?? '前沿分支已锁定'}</strong>
            <p>{runtimeNote}</p>
          </div>
        </div>
      </section>

      <section className="landing-columns">
        <article>
          <div className="eyebrow">01.0</div>
          <h2>参数化建模</h2>
          <p>用户输入会被规整成状态向量、图谱节点、代理角色与可编辑路径检查点。</p>
        </article>
        <article>
          <div className="eyebrow">02.0</div>
          <h2>路径分支</h2>
          <p>引擎会同时保留多条未来分支，并按置信度、收益、风险和指标投影排序。</p>
        </article>
        <article>
          <div className="eyebrow">03.0</div>
          <h2>记忆回写</h2>
          <p>每一轮都会追加状态、事实与倾向记忆，让后续分支继承累积后果。</p>
        </article>
      </section>

      <section className="landing-forensics">
        <article className="gallery-card">
          <div className="eyebrow">方法索引</div>
          <h3>技术流程总览</h3>
          <p>输入建模、分支排序、记忆回写、反事实改写和报告生成，被当作一条连续协议执行。</p>
          <div className="landing-list">
            <span>[01] 档案摄取</span>
            <span>[02] 图谱变形</span>
            <span>[03] 代理协作</span>
            <span>[04] 分支保留</span>
          </div>
        </article>

        <article className="gallery-card">
          <div className="eyebrow">系统日志</div>
          <h3>最新导演注记</h3>
          <p>{runtimeNote}</p>
          <div className="landing-list">
            <span>轮次 {state?.current_cycle ?? 1}</span>
            <span>提供方: {formatProviderLabel(state?.llm.provider ?? 'local-fallback')}</span>
            <span>API Key {state?.llm.api_key_present ? '已加载' : '未加载'}</span>
          </div>
        </article>
      </section>

      <section className="source-gallery">
        <article className="gallery-card">
          <div className="eyebrow">当前活跃分支</div>
          <h3>{topPath?.title ?? '等待分支排序完成'}</h3>
          <p>{formatNarrativeText(topPath?.summary ?? '种子状态载入后，这里会出现首条候选路径。')}</p>
          <div className="landing-list">
            <span>置信度 {topPath?.confidence ?? '--'}</span>
            <span>收益 {topPath?.payoff ?? '--'}</span>
            <span>风险 {topPath?.risk ?? '--'}</span>
          </div>
        </article>
        <article className="gallery-card">
          <div className="eyebrow">系统真源</div>
          <h3>Stitch 界面 + 本地引擎</h3>
          <p>前端布局遵循下载到本地的 Stitch 技术稿，数据持久化落在本地文件，后端全程不使用数据库。</p>
          <div className="landing-list">
            {stitchAssets.slice(0, 4).map((asset) => (
              <span key={asset.id}>{asset.name}</span>
            ))}
          </div>
        </article>
      </section>

      <footer className="forensic-footer">
        <span>lifepath-engine / local-state / no-db</span>
        <span>项目 8477727617233002131</span>
        <span>设计系统已与 Stitch 导出同步</span>
      </footer>
    </div>
  )
}
