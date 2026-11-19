import { describe, expect, it } from 'vite-plus/test'

import { parallaxMotionVars } from './parallax'

const base = { speed: 0.5, direction: 'vertical', rotate: 0, scale: 0 } as const

describe('parallaxMotionVars', () => {
  it('moves up on y for vertical, right on x for horizontal', () => {
    expect(parallaxMotionVars(base)).toEqual({ y: -100 })
    expect(parallaxMotionVars({ ...base, direction: 'horizontal' })).toEqual({ x: 100 })
  })

  it('adds rotation and scale only when set', () => {
    expect(parallaxMotionVars({ ...base, rotate: 15, scale: 0.2 })).toEqual({
      y: -100,
      rotation: 15,
      scale: 1.2,
    })
  })

  it('returns nothing to animate at zero speed', () => {
    expect(parallaxMotionVars({ ...base, speed: 0 })).toEqual({})
  })
})
