/**
 * Modular TSL UV Manipulation Utilities
 * Provides composable UV transformation functions
 */
import { abs, atan, cos, float, floor, fract, length, mix, pow, sin, smoothstep, vec2 } from 'three/tsl'

import type { TSLNode } from '../types'
import { toScalarNode, toVec2Node } from './nodes'

// ============================================
// Basic Transformations
// ============================================

/**
 * Scale UV from center
 */
export function scaleUV(
  uv: TSLNode,
  scale: TSLNode | number | [number, number],
  center: TSLNode | [number, number] = [0.5, 0.5]
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const s = toVec2Node(scale)

  return uv.sub(c).div(s).add(c)
}

/**
 * Rotate UV around center
 */
export function rotateUV(
  uv: TSLNode,
  angle: TSLNode | number,
  center: TSLNode | [number, number] = [0.5, 0.5]
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const a = typeof angle === 'number' ? float(angle) : angle

  const cosA = cos(a)
  const sinA = sin(a)

  const centered = uv.sub(c)
  const rotated = vec2(
    centered.x.mul(cosA).sub(centered.y.mul(sinA)),
    centered.x.mul(sinA).add(centered.y.mul(cosA))
  )

  return rotated.add(c)
}

/**
 * Translate UV
 */
export function translateUV(uv: TSLNode, offset: TSLNode | [number, number]): TSLNode {
  const o = Array.isArray(offset) ? vec2(offset[0], offset[1]) : offset
  return uv.add(o)
}

/**
 * Tile UV (repeat)
 */
export function tileUV(uv: TSLNode, tiles: TSLNode | number | [number, number]): TSLNode {
  const t = toVec2Node(tiles)

  return fract(uv.mul(t))
}

/**
 * Mirror UV at edges
 */
export function mirrorUV(uv: TSLNode): TSLNode {
  const floored = floor(uv)
  const mirrored = abs(fract(uv).sub(floored.mod(2)))
  return mirrored
}

// ============================================
// Coordinate Conversions
// ============================================

/**
 * Convert to polar coordinates
 * Returns vec2(radius, angle)
 */
export function toPolar(uv: TSLNode, center: TSLNode | [number, number] = [0.5, 0.5]): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const centered = uv.sub(c)

  const radius = length(centered)
  const angle = atan(centered.y, centered.x)
    .add(Math.PI)
    .div(Math.PI * 2)

  return vec2(radius, angle)
}

/**
 * Convert from polar to cartesian
 */
export function fromPolar(
  polar: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5]
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const radius: TSLNode = polar.x
  const angle: TSLNode = polar.y.mul(Math.PI * 2).sub(Math.PI)

  const x: TSLNode = cos(angle).mul(radius)
  const y: TSLNode = sin(angle).mul(radius)
  return vec2(x, y).add(c)
}

// ============================================
// Distortions
// ============================================

/**
 * Wave distortion
 */
export function waveUV(
  uv: TSLNode,
  ...args: [
    frequency?: TSLNode | number,
    amplitude?: TSLNode | number,
    time?: TSLNode | number,
    direction?: 'x' | 'y' | 'both',
  ]
): TSLNode {
  const [frequency = 10, amplitude = 0.05, time = 0, direction = 'y'] = args
  const freq = toScalarNode(frequency)
  const amp = toScalarNode(amplitude)
  const t = toScalarNode(time)

  if (direction === 'x') {
    const offset = sin(uv.y.mul(freq).add(t)).mul(amp)
    return vec2(uv.x.add(offset), uv.y)
  }
  if (direction === 'y') {
    const offset = sin(uv.x.mul(freq).add(t)).mul(amp)
    return vec2(uv.x, uv.y.add(offset))
  }
  const offsetX = sin(uv.y.mul(freq).add(t)).mul(amp)
  const offsetY = sin(uv.x.mul(freq).add(t.mul(1.3))).mul(amp)
  return vec2(uv.x.add(offsetX), uv.y.add(offsetY))
}

/**
 * Ripple distortion
 */
export function rippleUV(
  uv: TSLNode,
  ...args: [
    center?: TSLNode | [number, number],
    frequency?: TSLNode | number,
    amplitude?: TSLNode | number,
    time?: TSLNode | number,
    falloff?: TSLNode | number,
  ]
): TSLNode {
  const [center = [0.5, 0.5], frequency = 10, amplitude = 0.05, time = 0, falloff = 1] = args
  const c = toVec2Node(center)
  const freq = toScalarNode(frequency)
  const amp = toScalarNode(amplitude)
  const t = toScalarNode(time)
  const fall = toScalarNode(falloff)

  const diff = uv.sub(c)
  const dist: TSLNode = length(diff)

  const ripple = sin(dist.mul(freq).sub(t)).mul(amp)
  const falloffValue = pow(float(1).sub(dist.mul(fall)), 2).max(0)

  const direction = diff.normalize()
  return uv.add(direction.mul(ripple).mul(falloffValue))
}

/**
 * Swirl distortion
 */
export function swirlUV(
  uv: TSLNode,
  ...args: [center?: TSLNode | [number, number], strength?: TSLNode | number, radius?: TSLNode | number]
): TSLNode {
  const [center = [0.5, 0.5], strength = 1, radius = 0.5] = args
  const c = toVec2Node(center)
  const str = toScalarNode(strength)
  const r = toScalarNode(radius)

  const diff = uv.sub(c)
  const dist = length(diff)

  const falloff = smoothstep(r, 0, dist)
  const angle = falloff.mul(str)

  return rotateUV(uv, angle, c)
}

/**
 * Barrel distortion (fisheye)
 */
export function barrelUV(
  uv: TSLNode,
  strength: TSLNode | number = 0.5,
  center: TSLNode | [number, number] = [0.5, 0.5]
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const str = typeof strength === 'number' ? float(strength) : strength

  const centered = uv.sub(c)
  const dist = length(centered)
  const distPow = pow(dist, 2)

  const distorted = centered.mul(float(1).add(str.mul(distPow)))
  return distorted.add(c)
}

/**
 * Pincushion distortion (inverse barrel)
 */
export function pincushionUV(
  uv: TSLNode,
  strength: TSLNode | number = 0.5,
  center: TSLNode | [number, number] = [0.5, 0.5]
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const str = typeof strength === 'number' ? float(strength) : strength

  const centered = uv.sub(c)
  const dist = length(centered)
  const distPow = pow(dist, 2)

  const distorted = centered.mul(float(1).sub(str.mul(distPow)))
  return distorted.add(c)
}

/**
 * Kaleidoscope effect
 */
export function kaleidoscopeUV(
  uv: TSLNode,
  ...args: [segments?: number, center?: TSLNode | [number, number], rotation?: TSLNode | number]
): TSLNode {
  const [segments = 6, center = [0.5, 0.5], rotation = 0] = args
  const c = toVec2Node(center)
  const rot = toScalarNode(rotation)

  const polar = toPolar(uv, c)
  const segmentAngle = float(1 / segments)

  // Fold angle into one segment
  const foldedAngle = abs(fract(polar.y.add(rot).div(segmentAngle).add(0.5)).sub(0.5)).mul(
    segmentAngle
  )

  const newPolar = vec2(polar.x, foldedAngle)
  return fromPolar(newPolar, c)
}

/**
 * Zoom UV from center
 */
export function zoomUV(
  uv: TSLNode,
  zoom: TSLNode | number,
  center: TSLNode | [number, number] = [0.5, 0.5]
): TSLNode {
  const z = typeof zoom === 'number' ? float(zoom) : zoom
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center

  return uv.sub(c).div(z).add(c)
}

// ============================================
// Aspect Ratio & Viewport
// ============================================

/**
 * Correct UV for aspect ratio
 */
export function aspectCorrect(uv: TSLNode, aspectRatio: TSLNode | number): TSLNode {
  const ar = typeof aspectRatio === 'number' ? float(aspectRatio) : aspectRatio
  return vec2(uv.x.mul(ar), uv.y)
}

/**
 * Fit UV to cover (like CSS background-size: cover)
 */
export function coverUV(
  uv: TSLNode,
  containerAspect: TSLNode | number,
  contentAspect: TSLNode | number
): TSLNode {
  const container = typeof containerAspect === 'number' ? float(containerAspect) : containerAspect
  const content = typeof contentAspect === 'number' ? float(contentAspect) : contentAspect

  const scale = container.div(content).max(1)
  const offset = float(1).sub(float(1).div(scale)).mul(0.5)

  return mix(
    vec2(uv.x.sub(offset).mul(scale), uv.y), // Wider container
    vec2(uv.x, uv.y.sub(offset).mul(scale)), // Taller container
    container.greaterThan(content)
  ) as TSLNode
}

/**
 * Fit UV to contain (like CSS background-size: contain)
 */
export function containUV(
  uv: TSLNode,
  containerAspect: TSLNode | number,
  contentAspect: TSLNode | number
): TSLNode {
  const container = typeof containerAspect === 'number' ? float(containerAspect) : containerAspect
  const content = typeof contentAspect === 'number' ? float(contentAspect) : contentAspect

  const scale = container.div(content).min(1)
  const offset = float(1).sub(scale).mul(0.5)

  return mix(
    vec2(uv.x.mul(scale).add(offset), uv.y), // Wider container
    vec2(uv.x, uv.y.mul(scale).add(offset)), // Taller container
    container.greaterThan(content)
  ) as TSLNode
}

// ============================================
// Scrolling & Animation
// ============================================

/**
 * Infinite scroll UV
 */
export function scrollUV(uv: TSLNode, speed: TSLNode | [number, number], time: TSLNode): TSLNode {
  const s = Array.isArray(speed) ? vec2(speed[0], speed[1]) : speed
  return fract(uv.add(s.mul(time)))
}

/**
 * Parallax UV offset
 */
export function parallaxUV(
  uv: TSLNode,
  offset: TSLNode | [number, number],
  depth: TSLNode | number = 1
): TSLNode {
  const o = Array.isArray(offset) ? vec2(offset[0], offset[1]) : offset
  const d = typeof depth === 'number' ? float(depth) : depth

  return uv.add(o.mul(d))
}

// ============================================
// Bulge/Pinch Distortion
// ============================================

export type BulgeUVOptions = {
  strength?: TSLNode | number
  radius?: TSLNode | number
  power?: TSLNode | number
  center?: TSLNode | [number, number]
}

/**
 * Bulge or pinch distortion
 * Positive strength creates a bulge (magnify), negative creates a pinch
 * @param uv - UV coordinates (aspect-corrected provides best results)
 * @param options - Distortion options
 */
export function bulgeUV(uv: TSLNode, options: BulgeUVOptions = {}): TSLNode {
  const { strength = 0.5, radius = 0.5, power = 1.0, center = [0, 0] } = options

  const _strength = typeof strength === 'number' ? float(strength) : strength
  const _radius = typeof radius === 'number' ? float(radius) : radius
  const _power = typeof power === 'number' ? float(power) : power
  const _center = Array.isArray(center) ? vec2(center[0], center[1]) : center

  const _uv = uv.toVar()
  const offset = _uv.sub(_center).toVar()
  const dist = length(offset).toVar()

  // Normalized distance within radius (0-1), smoothed for cleaner effect
  const normalizedDist = smoothstep(0, 1, dist.div(_radius).min(1)).toVar()

  // Use power curve to create stronger effect in the center
  const falloff = pow(float(1).sub(normalizedDist), _power).mul(_strength)

  // Apply radial displacement
  const direction = offset.normalize()
  const displacedUV = _center.add(direction.mul(dist.mul(falloff.add(float(1.0)))))

  return displacedUV
}
