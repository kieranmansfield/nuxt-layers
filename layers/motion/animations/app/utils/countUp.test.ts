import { describe, expect, it } from 'vite-plus/test'

import { decimalPlaces, roundCountUp } from './countUp'

describe('decimalPlaces', () => {
  it('counts the digits after the point', () => {
    expect(decimalPlaces(12)).toBe(0)
    expect(decimalPlaces(4.5)).toBe(1)
    expect(decimalPlaces(0.25)).toBe(2)
    expect(decimalPlaces(-3.125)).toBe(3)
  })

  it('treats exponent notation and non-finite values as whole', () => {
    expect(decimalPlaces(1e-7)).toBe(0)
    expect(decimalPlaces(Number.NaN)).toBe(0)
    expect(decimalPlaces(Number.POSITIVE_INFINITY)).toBe(0)
  })
})

describe('roundCountUp', () => {
  it('keeps decimals mid-tween when the target has them', () => {
    expect(roundCountUp(2.34, 0, 4.5)).toBe(2.3)
    expect(roundCountUp(2.36, 0, 4.5)).toBe(2.4)
  })

  it('uses the larger precision of from and to', () => {
    expect(roundCountUp(1.2345, 0.25, 4.5)).toBe(1.23)
  })

  it('rounds to whole numbers for integer targets', () => {
    expect(roundCountUp(41.6, 0, 100)).toBe(42)
  })
})
