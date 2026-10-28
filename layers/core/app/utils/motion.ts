import { DURATION_MS, type MotionDuration, type MotionEase } from '../types/tokens'

const EASE_TOKENS: readonly string[] = [
  'out',
  'in-out',
  'emphasized',
  'spring',
] satisfies MotionEase[]

/** A duration token or a number of milliseconds → milliseconds. */
export function resolveDurationMs(duration: MotionDuration | number): number {
  return typeof duration === 'number' ? duration : DURATION_MS[duration]
}

/** An ease token → its `var(--ease-*)`; any other string passes through as raw CSS. */
export function resolveEaseCss(ease: string): string {
  return EASE_TOKENS.includes(ease) ? `var(--ease-${ease})` : ease
}
