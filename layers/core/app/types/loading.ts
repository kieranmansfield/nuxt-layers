// types/loading.ts

/**
 * Loading screen configuration interface
 */
export type LoadingConfig = {
  /** Master toggle - set to false to disable completely */
  enabled: boolean
  /** Minimum time (ms, from navigation start) before the count may reach 100 - 0 finishes
   * as soon as the work does */
  minDuration: number
  /** Longest wait (ms, from navigation start) for the page's assets and fonts before finishing
   * anyway, once the app has mounted */
  maxDuration: number
  /** Delay (ms, from the screen's first paint) before the counter fades in over the backdrop -
   * loads that finish sooner only see the backdrop fade away */
  showAfter: number
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
 * State the inline boot runtime (`bootLoading`) publishes on `window.__coreLoading`
 */
export type BootLoading = {
  /** Displayed progress 0-100 */
  progress: number
  /** The counter faded in: `showAfter` passed before the work finished */
  shown: boolean
  /** Ended by `finish()` rather than by counting up */
  skipped: boolean
  /** The count has reached 100 */
  done: boolean
  /** Called every frame with the displayed progress, and with `done` once it reaches 100 -
   * straight away if it already has */
  listen: (fn: (progress: number, done: boolean) => void) => void
  /** The app has mounted (hydration done) - its share of the count, and completion, wait on it */
  mounted: () => void
  /** End now, skipping the rest of the count */
  finish: () => void
}

declare global {
  // Augmenting a global needs declaration merging, which only an interface does
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __coreLoading?: BootLoading
  }
}

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
  /** True once `finishNow` has skipped the boot screen (readonly) */
  skipped: Readonly<Ref<boolean>>
  /** Start counting from 0, timed from `since` (a `performance.now()` value; default now) */
  startLoading: (since?: number) => void
  /** Mark work done - the count finishes to 100 once `minDuration` has passed */
  stopLoading: () => void
  /** Raise the target to a real milestone (0-99) - only `stopLoading` completes */
  updateProgress: (value: number) => void
  /** End the boot screen now, without its beat or exit animation. Call after hydration */
  finishNow: () => void
  /** Execute async function with loading state */
  withLoading: (fn: () => Promise<void>) => Promise<void>
}
