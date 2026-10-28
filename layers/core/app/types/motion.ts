import type { MotionDuration, MotionEase } from './tokens'

/**
 * Entrance presets shared by every motion layer (MotionTransition, MotionStaggered, page
 * transitions). Each one names a "from" state; transitions.css defines them once as custom
 * properties, so the same name looks the same wherever it's used.
 */
export type MotionPreset = 'fade' | 'rise' | 'drop' | 'slide-start' | 'slide-end' | 'scale' | 'blur'

/**
 * Timing for any motion prop. Durations are always milliseconds (or a token) — v6 mixed ms,
 * seconds and percent-of-viewport under the same `duration` name.
 * `| undefined` on each is explicit (not just `?`) for exactOptionalPropertyTypes.
 */
export type TimingProps = {
  duration?: MotionDuration | number | undefined
  delay?: number | undefined
  ease?: MotionEase | (string & {}) | undefined
}
