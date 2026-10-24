import type { LoadingConfig } from '../types/loading'

/** Fallbacks for keys app.config leaves unset - core's app.config ships the same values. */
const LOADING_DEFAULTS: LoadingConfig = {
  enabled: false,
  minDuration: 0,
  maxDuration: 1500,
  showAfter: 400,
  label: 'Loading',
  background: '#0a0a0a',
  textColor: '#ffffff',
  zIndex: 10000,
}

/** Reads `coreLayer.loading` from app config, filling unset keys with the defaults. */
export function resolveLoadingConfig(coreLayer: unknown): LoadingConfig {
  const loading = (coreLayer as { loading?: Partial<LoadingConfig> } | undefined)?.loading
  return { ...LOADING_DEFAULTS, ...loading }
}

/*
 * Pure easing math behind `useLoading`'s progress counter. The target only moves at real
 * milestones; `approachProgress` runs once per animation frame to move the displayed value
 * toward it, so the counter climbs smoothly instead of jumping.
 */

/** Time constant (s) of the displayed value's exponential ease toward its target. */
const EASE = 0.15
/** Speed band (%/s) for the displayed value: no crawling at the tail, no leaps on big jumps. */
const MIN_SPEED = 24
const MAX_SPEED = 140

/**
 * Advances `current` toward `target` over `dt` seconds. Eases out as the gap closes, within the
 * speed band, and never moves backwards or past `target`. A rAF timestamp can precede the
 * `performance.now()` the loop started from, so `dt <= 0` is a no-op rather than a step back.
 */
export function approachProgress(current: number, target: number, dt: number): number {
  const gap = target - current
  if (gap <= 0 || dt <= 0) return current
  const eased = gap * (1 - Math.exp(-dt / EASE))
  const step = Math.min(Math.max(eased, MIN_SPEED * dt), MAX_SPEED * dt)
  return Math.min(current + step, target)
}
