import { describe, expect, it } from 'vite-plus/test'

import { approachProgress, resolveLoadingConfig } from './loading'

const FRAME = 1 / 60

describe('resolveLoadingConfig', () => {
  it('fills unset keys with defaults but keeps falsy values that were set', () => {
    expect(resolveLoadingConfig(undefined)).toMatchObject({
      enabled: false,
      minDuration: 0,
      maxDuration: 1500,
      showAfter: 400,
    })
    expect(resolveLoadingConfig({ loading: { minDuration: 0, label: '' } })).toMatchObject({
      enabled: false,
      minDuration: 0,
      label: '',
    })
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
