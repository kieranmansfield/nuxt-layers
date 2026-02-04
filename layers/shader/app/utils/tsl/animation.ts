import { abs, cos, float, Fn, mod, pow, sin } from 'three/tsl'
import type { TSLNode } from '../../types'

/**
 * Ping-pong oscillation between 0 and 1
 */
export const pingPong = Fn(([time, duration]: [TSLNode, TSLNode]) => {
  const t = mod(time, duration.mul(2.0))
  return t.lessThan(duration).select(t.div(duration), float(2.0).sub(t.div(duration)))
})

/**
 * Sine wave oscillation
 */
export const oscillate = Fn(([time, freq, amp]: [TSLNode, TSLNode, TSLNode]) => {
  return sin(time.mul(freq).mul(Math.PI * 2))
    .mul(amp)
    .add(0.5)
})

/**
 * Loop time with duration
 */
export const loopTime = Fn(([time, duration]: [TSLNode, TSLNode]) => {
  return mod(time, duration)
})

/**
 * Easing functions
 */
export const easing = {
  // Quadratic
  easeInQuad: Fn(([t]: [TSLNode]) => t.mul(t)),
  easeOutQuad: Fn(([t]: [TSLNode]) => t.mul(float(2.0).sub(t))),
  easeInOutQuad: Fn(([t]: [TSLNode]) => {
    return t
      .lessThan(0.5)
      .select(t.mul(t).mul(2.0), float(1.0).sub(float(-2.0).mul(t).add(2.0).pow(2.0).div(2.0)))
  }),

  // Cubic
  easeInCubic: Fn(([t]: [TSLNode]) => t.mul(t).mul(t)),
  easeOutCubic: Fn(([t]: [TSLNode]) => float(1.0).sub(pow(float(1.0).sub(t), 3.0))),
  easeInOutCubic: Fn(([t]: [TSLNode]) => {
    return t
      .lessThan(0.5)
      .select(
        t.mul(t).mul(t).mul(4.0),
        float(1.0).sub(pow(float(-2.0).mul(t).add(2.0), 3.0).div(2.0))
      )
  }),

  // Quartic
  easeInQuart: Fn(([t]: [TSLNode]) => t.mul(t).mul(t).mul(t)),
  easeOutQuart: Fn(([t]: [TSLNode]) => float(1.0).sub(pow(float(1.0).sub(t), 4.0))),
  easeInOutQuart: Fn(([t]: [TSLNode]) => {
    return t
      .lessThan(0.5)
      .select(
        t.mul(t).mul(t).mul(t).mul(8.0),
        float(1.0).sub(pow(float(-2.0).mul(t).add(2.0), 4.0).div(2.0))
      )
  }),

  // Exponential
  easeInExpo: Fn(([t]: [TSLNode]) => {
    return t.equal(0.0).select(float(0.0), pow(2.0, t.mul(10.0).sub(10.0)))
  }),
  easeOutExpo: Fn(([t]: [TSLNode]) => {
    return t.equal(1.0).select(float(1.0), float(1.0).sub(pow(2.0, t.mul(-10.0))))
  }),
  easeInOutExpo: Fn(([t]: [TSLNode]) => {
    const isStart = t.equal(0.0)
    const isEnd = t.equal(1.0)
    const firstHalf = pow(2.0, t.mul(20.0).sub(10.0)).div(2.0)
    const secondHalf = float(2.0)
      .sub(pow(2.0, t.mul(-20.0).add(10.0)))
      .div(2.0)
    return isStart.select(
      float(0.0),
      isEnd.select(float(1.0), t.lessThan(0.5).select(firstHalf, secondHalf))
    )
  }),

  // Sine
  easeInSine: Fn(([t]: [TSLNode]) => {
    return float(1.0).sub(cos(t.mul(Math.PI / 2)))
  }),
  easeOutSine: Fn(([t]: [TSLNode]) => {
    return sin(t.mul(Math.PI / 2))
  }),
  easeInOutSine: Fn(([t]: [TSLNode]) => {
    return float(1.0)
      .sub(cos(t.mul(Math.PI)))
      .div(2.0)
  }),

  // Circular
  easeInCirc: Fn(([t]: [TSLNode]) => {
    return float(1.0).sub(float(1.0).sub(t.mul(t)).sqrt())
  }),
  easeOutCirc: Fn(([t]: [TSLNode]) => {
    return float(1.0).sub(t).mul(float(1.0).sub(t).negate().add(2.0)).sqrt()
  }),
  easeInOutCirc: Fn(([t]: [TSLNode]) => {
    const firstHalf = float(1.0)
      .sub(float(1.0).sub(t.mul(2.0).pow(2.0)).sqrt())
      .div(2.0)
    const secondHalf = float(1.0).sub(t.mul(-2.0).add(2.0).pow(2.0)).sqrt().add(1.0).div(2.0)
    return t.lessThan(0.5).select(firstHalf, secondHalf)
  }),

  // Back (overshoot)
  easeInBack: Fn(([t]: [TSLNode]) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return t.mul(t).mul(t.mul(c3).sub(c1))
  }),
  easeOutBack: Fn(([t]: [TSLNode]) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    const tm1 = t.sub(1.0)
    return tm1.mul(tm1).mul(tm1.mul(c3).add(c1)).add(1.0)
  }),
  easeInOutBack: Fn(([t]: [TSLNode]) => {
    const c1 = 1.70158
    const c2 = c1 * 1.525
    const firstHalf = t
      .mul(2.0)
      .pow(2.0)
      .mul(
        t
          .mul(2.0)
          .mul(c2 + 1)
          .sub(c2)
      )
      .div(2.0)
    const secondHalf = t
      .mul(2.0)
      .sub(2.0)
      .pow(2.0)
      .mul(
        t
          .mul(2.0)
          .sub(2.0)
          .mul(c2 + 1)
          .add(c2)
      )
      .add(2.0)
      .div(2.0)
    return t.lessThan(0.5).select(firstHalf, secondHalf)
  }),

  // Elastic
  easeInElastic: Fn(([t]: [TSLNode]) => {
    const c4 = (2 * Math.PI) / 3
    const isZero = t.equal(0.0)
    const isOne = t.equal(1.0)
    const elastic = pow(2.0, t.mul(10.0).sub(10.0))
      .mul(sin(t.mul(10.0).sub(10.75).mul(c4)))
      .negate()
    return isZero.select(float(0.0), isOne.select(float(1.0), elastic))
  }),
  easeOutElastic: Fn(([t]: [TSLNode]) => {
    const c4 = (2 * Math.PI) / 3
    const isZero = t.equal(0.0)
    const isOne = t.equal(1.0)
    const elastic = pow(2.0, t.mul(-10.0))
      .mul(sin(t.mul(10.0).sub(0.75).mul(c4)))
      .add(1.0)
    return isZero.select(float(0.0), isOne.select(float(1.0), elastic))
  }),

  // Bounce
  easeOutBounce: Fn(([t]: [TSLNode]) => {
    const n1 = 7.5625
    const d1 = 2.75

    const c1 = t.lessThan(1.0 / d1).select(t.mul(t).mul(n1), float(0.0))
    const c2 = t
      .greaterThanEqual(1.0 / d1)
      .mul(t.lessThan(2.0 / d1))
      .select(
        t
          .sub(1.5 / d1)
          .mul(t.sub(1.5 / d1))
          .mul(n1)
          .add(0.75),
        float(0.0)
      )
    const c3 = t
      .greaterThanEqual(2.0 / d1)
      .mul(t.lessThan(2.5 / d1))
      .select(
        t
          .sub(2.25 / d1)
          .mul(t.sub(2.25 / d1))
          .mul(n1)
          .add(0.9375),
        float(0.0)
      )
    const c4 = t.greaterThanEqual(2.5 / d1).select(
      t
        .sub(2.625 / d1)
        .mul(t.sub(2.625 / d1))
        .mul(n1)
        .add(0.984375),
      float(0.0)
    )

    return c1.add(c2).add(c3).add(c4)
  }),
  easeInBounce: Fn(([t]: [TSLNode]) => {
    return float(1.0).sub(easing.easeOutBounce(float(1.0).sub(t)))
  }),
}

/**
 * Step function with threshold
 */
export const tslStep = Fn(([edge, x]: [TSLNode, TSLNode]) => {
  return x.greaterThanEqual(edge).select(float(1.0), float(0.0))
})

/**
 * Pulse (on for a duration, then off)
 */
export const pulse = Fn(([time, start, duration]: [TSLNode, TSLNode, TSLNode]) => {
  return time.greaterThanEqual(start).mul(time.lessThan(start.add(duration)))
})

/**
 * Sawtooth wave
 */
export const sawtooth = Fn(([time, freq]: [TSLNode, TSLNode]) => {
  return mod(time.mul(freq), 1.0)
})

/**
 * Triangle wave
 */
export const triangle = Fn(([time, freq]: [TSLNode, TSLNode]) => {
  return abs(mod(time.mul(freq), 1.0).mul(2.0).sub(1.0))
})

/**
 * Square wave
 */
export const square = Fn(([time, freq]: [TSLNode, TSLNode]) => {
  return mod(time.mul(freq), 1.0).lessThan(0.5).select(float(0.0), float(1.0))
})
