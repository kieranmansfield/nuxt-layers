// types/loading.ts

/**
 * Loading screen configuration interface
 */
export type LoadingConfig = {
  /** Master toggle - set to false to disable completely */
  enabled: boolean
  /** Minimum time (ms, from navigation start) the count runs before it may reach 100 */
  minDuration: number
  /** Longest wait (ms, after the app mounts) for fonts and images before finishing anyway */
  maxDuration: number
  /** Small caption above the counter - empty string hides it */
  label: string
  /** Background color */
  background: string
  /** Progress text color */
  textColor: string
  /** Stack order */
  zIndex: number
}

/**
 * Boot loading screen lifecycle, shared so other layers can hold their own motion until the
 * page is revealed: covering the page → playing its exit → gone (or never mounted)
 */
export type LoadingScreenState = 'visible' | 'leaving' | 'hidden'

/**
 * Loading state interface
 */
export type LoadingState = {
  /** Current loading state */
  isLoading: boolean
  /** Progress percentage (0-100) */
  progress: number
}

/**
 * Loading composable return interface
 */
export type UseLoadingReturn = {
  /** True until the displayed progress has counted up to 100 (readonly) */
  isLoading: Readonly<Ref<boolean>>
  /** Displayed progress 0-100, eased every frame - never jumps or moves backwards (readonly) */
  progress: Readonly<Ref<number>>
  /** Boot loading screen lifecycle (readonly) */
  screen: Readonly<Ref<LoadingScreenState>>
  /** Start simulated progress, timed from `since` (a `performance.now()` value; default now) */
  startLoading: (since?: number) => void
  /** Mark work done - the count finishes to 100 once `minDuration` has passed */
  stopLoading: () => void
  /** Raise the progress floor (0-99) - only `stopLoading` completes */
  updateProgress: (value: number) => void
  /** Execute async function with loading state */
  withLoading: (fn: () => Promise<void>) => Promise<void>
}
