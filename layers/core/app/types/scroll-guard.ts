/**
 * Horizontal Scroll Guard types
 */

export interface ScrollGuardConfig {
  /** Master toggle — set to false to disable completely */
  enabled: boolean
  /** CSS selectors for elements allowed to overflow intentionally */
  excludeSelectors: string[]
  /** Enable automatic clamping of overflowing elements */
  strict: boolean
  /** Duration (ms) for element width clamp animations */
  transitionDuration: number
  /** Debounce delay (ms) for resize re-scans */
  resizeDebounce: number
  /** Temporarily highlight overflowing elements with a red outline */
  debug: boolean
}

export interface ScrollGuardState {
  /** Whether the guard is currently active */
  isEnabled: boolean
  /** Number of elements currently clamped */
  clampedCount: number
}
