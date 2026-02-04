import { abs, float, floor, Fn, fract, length, min, mod, sin, vec2 } from 'three/tsl'
import type { TSLNode } from '../../types'
import { rotateUV } from './uv'

/**
 * Checkerboard pattern
 */
export const checker = Fn(([uv, scale]: [TSLNode, TSLNode]) => {
  const scaledUV = uv.mul(scale)
  const check = mod(floor(scaledUV.x).add(floor(scaledUV.y)), 2.0)
  return check
})

/**
 * Grid lines pattern
 */
export const grid = Fn(([uv, scale, lineWidth]: [TSLNode, TSLNode, TSLNode]) => {
  const scaledUV = fract(uv.mul(scale))
  const halfWidth = lineWidth.mul(0.5)
  const xLine = scaledUV.x.lessThan(halfWidth).or(scaledUV.x.greaterThan(float(1.0).sub(halfWidth)))
  const yLine = scaledUV.y.lessThan(halfWidth).or(scaledUV.y.greaterThan(float(1.0).sub(halfWidth)))
  return xLine.or(yLine).select(float(1.0), float(0.0))
})

/**
 * Dot pattern
 */
export const dots = Fn(([uv, scale, radius]: [TSLNode, TSLNode, TSLNode]) => {
  const scaledUV = fract(uv.mul(scale))
  const center = vec2(0.5, 0.5)
  const dist = length(scaledUV.sub(center))
  return dist.lessThan(radius).select(float(1.0), float(0.0))
})

/**
 * Smooth dots pattern (with anti-aliasing)
 */
export const dotsSmooth = Fn(
  ([uv, scale, radius, softness]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const scaledUV = fract(uv.mul(scale))
    const center = vec2(0.5, 0.5)
    const dist = length(scaledUV.sub(center))
    return float(1.0).sub(dist.sub(radius).div(softness).clamp(0.0, 1.0))
  }
)

/**
 * Stripes pattern
 */
export const stripes = Fn(([uv, scale, angle]: [TSLNode, TSLNode, TSLNode]) => {
  const rotated = rotateUV(uv, angle, vec2(0.5))
  return mod(floor(rotated.x.mul(scale)), 2.0)
})

/**
 * Smooth stripes with configurable width
 */
export const stripesSmooth = Fn(
  ([uv, scale, angle, width, softness]: [TSLNode, TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const rotated = rotateUV(uv, angle, vec2(0.5))
    const pattern = fract(rotated.x.mul(scale))
    const stripe = abs(pattern.sub(0.5)).mul(2.0)
    return float(1.0).sub(stripe.sub(width).div(softness).clamp(0.0, 1.0))
  }
)

/**
 * Hexagonal grid
 */
export const hexGrid = Fn(([uv, scale]: [TSLNode, TSLNode]) => {
  const scaledUV = uv.mul(scale)

  // Hexagon dimensions
  const s = vec2(1.0, 1.732) // 1, sqrt(3)
  const h = s.mul(0.5)

  const a = mod(scaledUV, s).sub(h)
  const b = mod(scaledUV.sub(h), s).sub(h)

  const gv = length(a).lessThan(length(b)).select(a, b)

  // Distance to edge
  const edgeDist = min(
    abs(gv.x.mul(1.5).add(gv.y.mul(0.866))),
    min(abs(gv.x.mul(1.5).sub(gv.y.mul(0.866))), abs(gv.y.mul(1.732)))
  )

  return edgeDist
})

/**
 * Brick pattern
 */
export const bricks = Fn(([uv, scale, ratio, gap]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
  const scaledUV = uv.mul(scale)

  // Offset every other row
  const row = floor(scaledUV.y)
  const offset = mod(row, 2.0).mul(0.5)
  const brickUV = vec2(scaledUV.x.add(offset), scaledUV.y)

  const fractUV = fract(brickUV.mul(vec2(1.0, ratio)))
  const halfGap = gap.mul(0.5)

  const xGap = fractUV.x.lessThan(halfGap).or(fractUV.x.greaterThan(float(1.0).sub(halfGap)))
  const yGap = fractUV.y.lessThan(halfGap).or(fractUV.y.greaterThan(float(1.0).sub(halfGap)))

  return xGap.or(yGap).select(float(0.0), float(1.0))
})

/**
 * Concentric circles
 */
export const concentricCircles = Fn(
  ([uv, center, scale, width]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const dist = length(uv.sub(center))
    const rings = fract(dist.mul(scale))
    return rings.lessThan(width).select(float(1.0), float(0.0))
  }
)

/**
 * Radial lines (sunburst)
 */
export const radialLines = Fn(
  ([uv, center, count, width]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const centered = uv.sub(center)
    const angle = centered.y
      .atan2(centered.x)
      .div(Math.PI * 2)
      .add(0.5)
    const segment = fract(angle.mul(count))
    return segment.lessThan(width).select(float(1.0), float(0.0))
  }
)

/**
 * Diamond pattern
 */
export const diamonds = Fn(([uv, scale]: [TSLNode, TSLNode]) => {
  const scaledUV = fract(uv.mul(scale))
  const centered = abs(scaledUV.sub(0.5))
  return centered.x.add(centered.y).lessThan(0.5).select(float(1.0), float(0.0))
})

/**
 * Triangle pattern
 */
export const triangles = Fn(([uv, scale]: [TSLNode, TSLNode]) => {
  const scaledUV = uv.mul(scale)
  const p = fract(scaledUV)
  const row = floor(scaledUV.y)
  const flip = mod(row, 2.0)

  // Triangle test
  const t = flip
    .equal(0.0)
    .select(p.x.add(p.y).lessThan(1.0), p.x.sub(p.y.sub(1.0)).greaterThan(0.0))

  return t.select(float(1.0), float(0.0))
})

/**
 * Waves pattern
 */
export const waves = Fn(
  ([uv, scale, amplitude, frequency]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const wave = sin(uv.x.mul(frequency)).mul(amplitude)
    const y = fract(uv.y.mul(scale).add(wave))
    return y.lessThan(0.5).select(float(1.0), float(0.0))
  }
)

/**
 * Zigzag pattern
 */
export const zigzag = Fn(([uv, scale, amplitude]: [TSLNode, TSLNode, TSLNode]) => {
  const scaledUV = uv.mul(scale)
  const x = fract(scaledUV.x)
  const zigzagY = x.lessThan(0.5).select(x.mul(2.0), float(1.0).sub(x).mul(2.0))
  const offset = zigzagY.mul(amplitude)
  return mod(floor(scaledUV.y.add(offset)), 2.0)
})
