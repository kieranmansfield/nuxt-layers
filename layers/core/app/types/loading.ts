// types/loading.ts

/**
 * Loading screen configuration interface
 */
export interface LoadingConfig {
  /** Master toggle - set to false to disable completely */
  enabled: boolean
  /** Minimum time to display loading screen (prevents flash) */
  minDuration: number
  /** Maximum time for simulated progress */
  maxDuration: number
  /** Background color */
  background: string
  /** Progress text color */
  textColor: string
  /** Stack order */
  zIndex: number
}

/**
 * Loading state interface
 */
export interface LoadingState {
  /** Current loading state */
  isLoading: boolean
  /** Progress percentage (0-100) */
  progress: number
}

/**
 * Loading composable return interface
 */
export interface UseLoadingReturn {
  /** Current loading state (readonly) */
  isLoading: Readonly<Ref<boolean>>
  /** Progress percentage 0-100 (readonly) */
  progress: Readonly<Ref<number>>
  /** Start loading with simulated progress */
  startLoading: () => void
  /** Stop loading and jump to 100% */
  stopLoading: () => void
  /** Manually update progress (0-100) */
  updateProgress: (value: number) => void
  /** Execute async function with loading state */
  withLoading: (fn: () => Promise<void>) => Promise<void>
}
