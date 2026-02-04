// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Pattern Utilities
 * Provides procedural texture patterns
 */
import {
  float,
  fract,
  length,
  mix,
  PI,
  pow,
  screenSize,
  sin,
  smoothstep,
  step,
  vec2,
  vec3,
} from 'three/tsl'
import type { TSLNode } from '../types'
import { fbm3dSimplex, simplexNoise3d } from './noise'

// ============================================
// Canvas Weave Pattern
// ============================================

/**
 * Canvas weave pattern for fabric-like textures
 * Creates an organic woven fabric appearance
 * @param uv - UV coordinates
 */
export function canvasWeavePattern(uv: TSLNode): TSLNode {
  const grid = fract(uv.mul(200.0))

  // Add noise to warp the grid itself
  const noiseOffset = fbm3dSimplex(vec3(uv.mul(30.0), 0.0), { octaves: 3 }).mul(0.1)
  const warpedGrid = grid.add(noiseOffset)

  // Create irregular weave pattern
  const weaveX = sin(
    warpedGrid.x.mul(PI).add(fbm3dSimplex(vec3(uv.mul(100.0), 0.0), { octaves: 2 }).mul(0.5))
  )
  const weaveY = sin(
    warpedGrid.y
      .mul(PI)
      .add(fbm3dSimplex(vec3(uv.mul(100.0).add(0.5), 0.0), { octaves: 2 }).mul(0.5))
  )

  // Soften the intersections
  const weave = weaveX.mul(weaveY)
  const smoothedWeave = smoothstep(-0.3, 0.3, weave)

  return mix(0.9, 1.0, smoothedWeave)
}

// ============================================
// LED Pattern
// ============================================

export interface LEDPatternOptions {
  cellSize?: TSLNode | number
  intensity?: TSLNode | number
  intensityFalloff?: TSLNode | number
  edgeSoftness?: TSLNode | number
}

/**
 * LED screen pattern with configurable parameters
 * Creates a grid of circular LED dots
 * @param uv - UV coordinates (aspect-corrected recommended)
 * @param resolution - Screen resolution
 * @param options - Pattern options
 */
export function ledPattern(
  uv: TSLNode,
  resolution: TSLNode = screenSize,
  options: LEDPatternOptions = {}
): TSLNode {
  const { cellSize = 10, intensity = 0.5, intensityFalloff = 1.8, edgeSoftness = 0.2 } = options

  const _cellSize = typeof cellSize === 'number' ? float(cellSize) : cellSize
  const _intensity = typeof intensity === 'number' ? float(intensity) : intensity
  const _falloff = typeof intensityFalloff === 'number' ? float(intensityFalloff) : intensityFalloff
  const _softness = typeof edgeSoftness === 'number' ? float(edgeSoftness) : edgeSoftness

  const _uv = uv.toVar()

  // Scale UV by resolution divided by cell size
  const scaledRes = resolution.div(_cellSize)
  _uv.assign(fract(_uv.mul(scaledRes)).sub(0.5))

  // Circle pattern
  const pattern = length(_uv.div(_intensity)).oneMinus().toVar()
  pattern.assign(smoothstep(_softness, 1, pattern))
  pattern.assign(pow(pattern, _falloff))

  return pattern
}

// ============================================
// Speckled Noise Pattern
// ============================================

export interface SpeckledPatternOptions {
  density?: TSLNode | number
  warpAmount?: TSLNode | [number, number]
}

/**
 * Speckled noise pattern for scattered dot textures
 * Creates sparse organic speckles
 * @param uv - UV coordinates
 * @param options - Pattern options
 */
export function speckledNoisePattern(uv: TSLNode, options: SpeckledPatternOptions = {}): TSLNode {
  const { density = 0.75, warpAmount = [80, 120] } = options

  const _density = typeof density === 'number' ? float(density) : density
  const _warpAmount = Array.isArray(warpAmount) ? vec2(warpAmount[0], warpAmount[1]) : warpAmount

  // Warp the UVs for organic distribution
  const warpX = fbm3dSimplex(vec3(uv.mul(3.0), 0.0))
  const warpY = fbm3dSimplex(vec3(uv.mul(3.0).add(100.0), 0.0))
  const warp = vec2(warpX, warpY).sub(0.5).mul(0.1)

  const warpedUV = uv.add(warp)

  // Create very sparse speckles using multiple noise samples
  const noise1 = simplexNoise3d(vec3(warpedUV.mul(_warpAmount.x), 0.0))
  const noise2 = simplexNoise3d(vec3(warpedUV.mul(_warpAmount.y).add(50.0), 0.0))

  // Both noise values must be very high to create a speckle
  const speckles = step(_density, noise1).mul(step(_density, noise2))

  return speckles
}

// ============================================
// Dot Grid Pattern
// ============================================

export interface DotGridOptions {
  scale?: TSLNode | number
  dotSize?: TSLNode | number
  softness?: TSLNode | number
}

/**
 * Regular dot grid pattern
 * @param uv - UV coordinates
 * @param options - Pattern options
 */
export function dotGridPattern(uv: TSLNode, options: DotGridOptions = {}): TSLNode {
  const { scale = 10, dotSize = 0.3, softness = 0.1 } = options

  const _scale = typeof scale === 'number' ? float(scale) : scale
  const _dotSize = typeof dotSize === 'number' ? float(dotSize) : dotSize
  const _softness = typeof softness === 'number' ? float(softness) : softness

  const grid = fract(uv.mul(_scale)).sub(0.5)
  const dist = length(grid)

  return float(1).sub(smoothstep(_dotSize.sub(_softness), _dotSize, dist))
}

// ============================================
// Checker Pattern
// ============================================

/**
 * Checkerboard pattern
 * @param uv - UV coordinates
 * @param scale - Scale of the checker squares
 */
export function checkerPattern(uv: TSLNode, scale: TSLNode | number = 10): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const scaled = uv.mul(s)
  const checker = fract(scaled.x).step(0.5).add(fract(scaled.y).step(0.5))
  return fract(checker.mul(0.5)).step(0.25)
}

// ============================================
// Stripe Pattern
// ============================================

export interface StripeOptions {
  scale?: TSLNode | number
  thickness?: TSLNode | number
  angle?: TSLNode | number
  softness?: TSLNode | number
}

/**
 * Striped pattern with configurable angle
 * @param uv - UV coordinates
 * @param options - Pattern options
 */
export function stripePattern(uv: TSLNode, options: StripeOptions = {}): TSLNode {
  const { scale = 10, thickness = 0.5, angle = 0, softness = 0.01 } = options

  const _scale = typeof scale === 'number' ? float(scale) : scale
  const _thickness = typeof thickness === 'number' ? float(thickness) : thickness
  const _angle = typeof angle === 'number' ? float(angle) : angle
  const _softness = typeof softness === 'number' ? float(softness) : softness

  // Rotate UV
  const cosA = _angle.cos()
  const sinA = _angle.sin()
  const rotatedX = uv.x.mul(cosA).sub(uv.y.mul(sinA))

  // Create stripe
  const stripe = fract(rotatedX.mul(_scale))
  return smoothstep(_thickness.sub(_softness), _thickness, stripe).mul(
    smoothstep(float(1).sub(_softness), float(1).sub(_thickness), stripe).oneMinus()
  )
}
