import { describe, expect, it } from 'vite-plus/test'

import { approachProgress, resolveLoadingConfig, trickleProgress } from './loading'

const FRAME = 1 / 60

describe('resolveLoadingConfig', () => {
  it('fills unset keys with defaults but keeps falsy values that were set', () => {
    expect(resolveLoadingConfig(undefined)).toMatchObject({ enabled: true, minDuration: 1500 })
    expect(resolveLoadingConfig({ loading: { minDuration: 0, label: '' } })).toMatchObject({
      enabled: true,
      minDuration: 0,
      label: '',
    })
  })
})

describe('trickleProgress', () => {
  it('starts at 0, rises with time, and stays below the cap', () => {
    expect(trickleProgress(0, 1200)).toBe(0)
    expect(trickleProgress(-500, 1200)).toBe(0)
    expect(trickleProgress(1200, 1200)).toBeGreaterThan(trickleProgress(600, 1200))
    expect(trickleProgress(60_000, 1200)).toBeLessThanOrEqual(90)
  })
})

describe('approachProgress', () => {
  it('counts 0 → 100 in small per-frame steps and lands exactly on the target', () => {
    let current = 0
    let frames = 0
    while (current < 100) {
      const next = approachProgress(current, 100, FRAME)
      expect(next).toBeGreaterThan(current)
      expect(Math.floor(next) - Math.floor(current)).toBeLessThanOrEqual(3)
      current = next
      frames++
    }
    expect(current).toBe(100)
    // A visible count of at least ~0.7s, not a jump
    expect(frames).toBeGreaterThan(40)
  })

  it('never moves backwards or overshoots', () => {
    expect(approachProgress(60, 40, FRAME)).toBe(60)
    expect(approachProgress(0, 90, -0.008)).toBe(0)
    expect(approachProgress(99.9, 100, 1)).toBe(100)
  })
})
