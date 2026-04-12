import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DashboardProvider, useDashboard } from './hooks/useDashboard'
import { SystemChrome } from './components/SystemChrome'
import { LandingPage } from './pages/LandingPage'
import { SimulationPage } from './pages/SimulationPage'
import { StrategyPage } from './pages/StrategyPage'
import { PathDetailPage } from './pages/PathDetailPage'

function Shell() {
  const location = useLocation()
  const technical = location.pathname !== '/'
  const { state, loading, error, refresh, reset, runSimulation } = useDashboard()

  return (
    <SystemChrome
      error={error}
      loading={loading}
      onRefresh={refresh}
      onReset={reset}
      onRun={runSimulation}
      state={state}
      technical={technical}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/strategy" element={<StrategyPage />} />
        <Route path="/paths/:pathId" element={<PathDetailPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </SystemChrome>
  )
}

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </DashboardProvider>
  )
}
