import { clamp, dot, float, Fn, length, mix, normalize, pow, sub, vec2 } from 'three/tsl'
import type { TSLNode } from '../../types'

/**
 * Remap a value from one range to another
 */
export const remap = Fn(
  ([value, inMin, inMax, outMin, outMax]: [TSLNode, TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const t = clamp(value.sub(inMin).div(inMax.sub(inMin)), 0.0, 1.0)
    return mix(outMin, outMax, t)
  }
)

/**
 * Ken Perlin's improved smoothstep (smootherstep)
 * 6t^5 - 15t^4 + 10t^3
 */
export const smootherstep = Fn(([edge0, edge1, x]: [TSLNode, TSLNode, TSLNode]) => {
  const t = clamp(x.sub(edge0).div(edge1.sub(edge0)), 0.0, 1.0)
  return t
    .mul(t)
    .mul(t)
    .mul(t.mul(t.mul(6.0).sub(15.0)).add(10.0))
})

/**
 * Fresnel rim lighting effect
 */
export const fresnel = Fn(([viewDir, normal, power]: [TSLNode, TSLNode, TSLNode]) => {
  const nDotV = clamp(dot(normalize(normal), normalize(viewDir)), 0.0, 1.0)
  return pow(float(1.0).sub(nDotV), power)
})

/**
 * Bias function - shifts distribution towards 0 or 1
 * b < 0.5: shifts towards 0
 * b > 0.5: shifts towards 1
 */
export const bias = Fn(([x, b]: [TSLNode, TSLNode]) => {
  return x.div(float(1.0).sub(b).div(b).mul(float(1.0).sub(x)).add(1.0))
})

/**
 * Gain function - adjusts contrast around 0.5
 * g < 0.5: reduces contrast
 * g > 0.5: increases contrast
 */
export const gain = Fn(([x, g]: [TSLNode, TSLNode]) => {
  const a = float(1.0).sub(g).div(g)
  const isLessThanHalf = x.lessThan(0.5)
  const lowPart = x
    .mul(2.0)
    .div(a.mul(float(1.0).sub(x.mul(2.0))).add(1.0))
    .mul(0.5)
  const highPart = float(1.0).sub(
    float(1.0)
      .sub(x)
      .mul(2.0)
      .div(a.mul(x.mul(2.0).sub(1.0)).add(1.0))
      .mul(0.5)
  )
  return isLessThanHalf.select(lowPart, highPart)
})

/**
 * Circular distance from center point
 */
export const circularDistance = Fn(([uv, center]: [TSLNode, TSLNode]) => {
  return length(sub(uv, center))
})

/**
 * Box distance (Chebyshev distance)
 */
export const boxDistance = Fn(([uv, center, size]: [TSLNode, TSLNode, TSLNode]) => {
  const d = uv.sub(center).abs().sub(size)
  const outside = length(vec2(d.x.max(0.0), d.y.max(0.0)))
  const inside = d.x.max(d.y).min(0.0)
  return outside.add(inside)
})

/**
 * Signed distance to a line segment
 */
export const lineDistance = Fn(([uv, a, b]: [TSLNode, TSLNode, TSLNode]) => {
  const pa = uv.sub(a)
  const ba = b.sub(a)
  const t = clamp(dot(pa, ba).div(dot(ba, ba)), 0.0, 1.0)
  return length(pa.sub(ba.mul(t)))
})

/**
 * Quantize a value to discrete steps
 */
export const quantize = Fn(([value, steps]: [TSLNode, TSLNode]) => {
  return value.mul(steps).floor().div(steps)
})

/**
 * Exponential falloff
 */
export const expFalloff = Fn(([x, falloff]: [TSLNode, TSLNode]) => {
  return pow(float(2.0), x.mul(falloff).negate())
})

/**
 * Linear falloff with soft clamp
 */
export const linearFalloff = Fn(([x, start, end]: [TSLNode, TSLNode, TSLNode]) => {
  return clamp(float(1.0).sub(x.sub(start).div(end.sub(start))), 0.0, 1.0)
})
