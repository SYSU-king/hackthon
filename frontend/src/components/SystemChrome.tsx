import type { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { formatStatusLabel } from '../lib/i18n'
import type { DashboardState } from '../lib/types'

type SystemChromeProps = PropsWithChildren<{
  technical: boolean
  state: DashboardState | null
  loading: boolean
  error: string | null
  onRefresh: () => Promise<void>
  onReset: () => Promise<void>
  onRun: () => Promise<void>
}>

const topLinks = [
  { to: '/simulation', label: '模拟总览' },
  { to: '/strategy', label: '策略协议' },
  { to: '/', label: '系统首页' },
]

export function SystemChrome({
  children,
  technical,
  state,
  loading,
  error,
  onRefresh,
  onReset,
  onRun,
}: SystemChromeProps) {
  const profile = state?.profile
  const activePath =
    state?.paths.find(
      (path) => path.branch_id === state.active_branch_id || path.id === state.active_branch_id,
    ) ??
    state?.paths[0] ??
    null
  const sideLinks = [
    { to: '/simulation', icon: 'analytics', label: '[模拟看板]' },
    { to: '/strategy', icon: 'terminal', label: '[策略日志]' },
    { to: activePath ? `/paths/${activePath.id}` : '/strategy', icon: 'biotech', label: '[分支取证]' },
    { to: '/', icon: 'inventory_2', label: '[系统归档]' },
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__brand">
          <Link className="brand-mark" to="/">
            人生路径引擎 [v1.0.4]
          </Link>
          <nav className="topbar__nav">
            {topLinks.map((link) => (
              <NavLink
                key={`${link.to}-${link.label}`}
                className={({ isActive }) =>
                  isActive ? 'topbar__link topbar__link--active' : 'topbar__link'
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="topbar__actions">
          <button className="chrome-button" disabled={loading} onClick={() => void onRun()} type="button">
            推进一轮
          </button>
          <button
            className="chrome-button chrome-button--ghost"
            disabled={loading}
            onClick={() => void onRefresh()}
            type="button"
          >
            刷新
          </button>
          <button
            className="chrome-button chrome-button--ghost"
            disabled={loading}
            onClick={() => void onReset()}
            type="button"
          >
            重置
          </button>
          <div className="topbar__status">
            <span>节点: 882-x</span>
            <span>{formatStatusLabel(loading ? 'syncing' : 'stable')}</span>
          </div>
        </div>
      </header>

      {technical && (
        <aside className="sidebar">
          <div className="sidebar__profile">
            <div className="sidebar__avatar">{profile?.name?.slice(0, 1) ?? 'L'}</div>
            <div>
              <div className="eyebrow">系统实体</div>
              <div className="sidebar__name">[{profile?.name?.toUpperCase() ?? 'ADMIN-01'}]</div>
              <div className="sidebar__meta">状态: {formatStatusLabel(loading ? 'syncing' : 'stable')}</div>
            </div>
          </div>
          <nav className="sidebar__nav">
            {sideLinks.map((link) => (
              <NavLink
                key={`${link.to}-${link.label}`}
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
                to={link.to}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      )}

      <main className={technical ? 'page-shell page-shell--technical' : 'page-shell'}>
        {error && <div className="system-banner">运行警告: {error}</div>}
        {children}
      </main>
    </div>
  )
}
