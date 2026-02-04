import { atan2, cos, float, Fn, fract, length, sin, vec2 } from 'three/tsl'
import type { TSLNode } from '../../types'

/**
 * Tile UV coordinates
 */
export const tileUV = Fn(([uv, scale]: [TSLNode, TSLNode]) => {
  return fract(uv.mul(scale))
})

/**
 * Rotate UV around a center point
 */
export const rotateUV = Fn(([uv, angle, center]: [TSLNode, TSLNode, TSLNode]) => {
  const cosA = cos(angle)
  const sinA = sin(angle)
  const centered = uv.sub(center)
  const rotated = vec2(
    centered.x.mul(cosA).sub(centered.y.mul(sinA)),
    centered.x.mul(sinA).add(centered.y.mul(cosA))
  )
  return rotated.add(center)
})

/**
 * Distort UV with a noise function
 */
export const distortUV = Fn(([uv, noiseValue, strength]: [TSLNode, TSLNode, TSLNode]) => {
  return uv.add(noiseValue.mul(strength))
})

/**
 * Convert UV to polar coordinates (angle, radius)
 */
export const polarUV = Fn(([uv, center]: [TSLNode, TSLNode]) => {
  const centered = uv.sub(center)
  const angle = atan2(centered.y, centered.x)
    .div(Math.PI * 2)
    .add(0.5)
  const radius = length(centered)
  return vec2(angle, radius)
})

/**
 * Convert polar coordinates back to cartesian
 */
export const cartesianUV = Fn(([polar, center]: [TSLNode, TSLNode]) => {
  const angle = polar.x.sub(0.5).mul(Math.PI * 2)
  const radius = polar.y
  return vec2(cos(angle).mul(radius), sin(angle).mul(radius)).add(center)
})

/**
 * Wave distortion on UV
 */
export const waveUV = Fn(([uv, freq, amp, time]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
  const waveX = sin(uv.y.mul(freq).add(time)).mul(amp)
  const waveY = sin(uv.x.mul(freq).add(time)).mul(amp)
  return uv.add(vec2(waveX, waveY))
})

/**
 * Ripple effect from center
 */
export const rippleUV = Fn(
  ([uv, center, freq, amp, time]: [TSLNode, TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const dist = length(uv.sub(center))
    const wave = sin(dist.mul(freq).sub(time)).mul(amp)
    const dir = uv.sub(center).normalize()
    return uv.add(dir.mul(wave))
  }
)

/**
 * Zoom UV from center
 */
export const zoomUV = Fn(([uv, center, zoom]: [TSLNode, TSLNode, TSLNode]) => {
  return uv.sub(center).div(zoom).add(center)
})

/**
 * Mirror UV at edges
 */
export const mirrorUV = Fn(([uv]: [TSLNode]) => {
  const mx = uv.x.mod(2.0)
  const my = uv.y.mod(2.0)
  const mirroredX = mx.greaterThan(1.0).select(float(2.0).sub(mx), mx)
  const mirroredY = my.greaterThan(1.0).select(float(2.0).sub(my), my)
  return vec2(mirroredX, mirroredY)
})

/**
 * Kaleidoscope effect
 */
export const kaleidoscopeUV = Fn(([uv, center, segments]: [TSLNode, TSLNode, TSLNode]) => {
  const centered = uv.sub(center)
  const angle = atan2(centered.y, centered.x)
  const radius = length(centered)

  const segmentAngle = float(Math.PI * 2).div(segments)
  const newAngle = angle.mod(segmentAngle)
  const mirroredAngle = newAngle
    .greaterThan(segmentAngle.mul(0.5))
    .select(segmentAngle.sub(newAngle), newAngle)

  return vec2(cos(mirroredAngle).mul(radius), sin(mirroredAngle).mul(radius)).add(center)
})

/**
 * Barrel distortion (fisheye-like)
 */
export const barrelUV = Fn(([uv, center, strength]: [TSLNode, TSLNode, TSLNode]) => {
  const centered = uv.sub(center)
  const dist = length(centered)
  const distorted = centered.mul(float(1.0).add(dist.mul(dist).mul(strength)))
  return distorted.add(center)
})

/**
 * Pincushion distortion (inverse barrel)
 */
export const pincushionUV = Fn(([uv, center, strength]: [TSLNode, TSLNode, TSLNode]) => {
  const centered = uv.sub(center)
  const dist = length(centered)
  const distorted = centered.mul(float(1.0).sub(dist.mul(dist).mul(strength)))
  return distorted.add(center)
})

/**
 * Swirl distortion
 */
export const swirlUV = Fn(
  ([uv, center, strength, radius]: [TSLNode, TSLNode, TSLNode, TSLNode]) => {
    const centered = uv.sub(center)
    const dist = length(centered)
    const angle = strength.mul(float(1.0).sub(dist.div(radius).min(1.0)))
    const cosA = cos(angle)
    const sinA = sin(angle)
    const rotated = vec2(
      centered.x.mul(cosA).sub(centered.y.mul(sinA)),
      centered.x.mul(sinA).add(centered.y.mul(cosA))
    )
    return dist.lessThan(radius).select(rotated.add(center), uv)
  }
)
