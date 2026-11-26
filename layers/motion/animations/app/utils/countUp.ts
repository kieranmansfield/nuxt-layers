/**
 * Decimal places of a number as written: 4.5 → 1, 12 → 0, 0.25 → 2.
 * useCountUp rounds each frame to this many places so decimal targets
 * count smoothly instead of stepping through whole numbers.
 */
export function decimalPlaces(n: number): number {
  // ponytail: exponent notation (1e-7) is not a count-up value; it reads as 0 places
  if (!Number.isFinite(n) || String(n).includes('e')) return 0
  return (String(n).split('.')[1] ?? '').length
}

/** Rounds `value` to the most decimal places used by `from` or `to`. */
export function roundCountUp(value: number, from: number, to: number): number {
  return Number(value.toFixed(Math.max(decimalPlaces(from), decimalPlaces(to))))
}
