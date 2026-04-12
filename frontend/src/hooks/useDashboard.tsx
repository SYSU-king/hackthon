import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { getProject, rerunPath, resetProject, runSimulation } from '../lib/api'
import type { DashboardState } from '../lib/types'

type DashboardContextValue = {
  state: DashboardState | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  reset: () => Promise<void>
  runSimulation: () => Promise<void>
  rerunCounterfactual: (
    pathId: string,
    payload: { node_id: string; field_key: string; value: string },
  ) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DashboardState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const inFlight = useRef(false)

  async function assign(action: () => Promise<DashboardState>) {
    if (inFlight.current) {
      return
    }

    inFlight.current = true
    setLoading(true)

    try {
      const next = await action()
      startTransition(() => {
        setState(next)
        setError(null)
      })
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : '未知错误'
      startTransition(() => setError(message))
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  async function refresh() {
    await assign(getProject)
  }

  async function reset() {
    await assign(resetProject)
  }

  async function advance() {
    await assign(runSimulation)
  }

  async function rerunCounterfactual(
    pathId: string,
    payload: { node_id: string; field_key: string; value: string },
  ) {
    await assign(() => rerunPath(pathId, payload))
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        state,
        loading,
        error,
        refresh,
        reset,
        runSimulation: advance,
        rerunCounterfactual,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const value = useContext(DashboardContext)
  if (!value) {
    throw new Error('useDashboard must be used inside DashboardProvider')
  }
  return value
}
