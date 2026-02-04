// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Tonemapping Utilities
 * Provides various tonemapping operators for HDR to LDR conversion
 */
import { float, mix, pow, smoothstep, vec3 } from 'three/tsl'
import type { TSLNode } from '../types'
import { tanh } from './math'

// ============================================
// Standard Tonemapping Operators
// ============================================

/**
 * Reinhard tonemapping
 * Simple and fast, good for general use
 * @param color - Input HDR color
 */
export function reinhardTonemap(color: TSLNode): TSLNode {
  return color.div(color.add(1.0))
}

/**
 * Reinhard extended tonemapping with white point
 * @param color - Input HDR color
 * @param whitePoint - Maximum luminance value
 */
export function reinhardExtendedTonemap(
  color: TSLNode,
  whitePoint: TSLNode | number = 4.0
): TSLNode {
  const wp = typeof whitePoint === 'number' ? float(whitePoint) : whitePoint
  const numerator = color.mul(float(1.0).add(color.div(wp.mul(wp))))
  return numerator.div(float(1.0).add(color))
}

/**
 * Uncharted 2 filmic tonemapping
 * Cinematic look with good highlight rolloff
 * @param color - Input HDR color
 */
export function uncharted2Tonemap(color: TSLNode): TSLNode {
  const col = color.mul(16.0).toVar()

  const a = float(0.15)
  const b = float(0.5)
  const c = float(0.1)
  const d = float(0.2)
  const e = float(0.02)
  const f = float(0.3)

  return col
    .mul(a.mul(col).add(c.mul(b)))
    .add(d.mul(e))
    .div(col.mul(a.mul(col).add(b)).add(d.mul(f)))
    .sub(e.div(f))
}

/**
 * ACES (Academy Color Encoding System) tonemapping
 * Industry standard for film and TV
 * @param color - Input HDR color
 */
export function acesTonemap(color: TSLNode): TSLNode {
  const a = float(2.51)
  const b = float(0.03)
  const c = float(2.43)
  const d = float(0.59)
  const e = float(0.14)

  return color.mul(a.mul(color).add(b)).div(color.mul(c.mul(color).add(d)).add(e))
}

/**
 * Unreal Engine tonemapping
 * Adapted from Unreal 3 color grading
 * Gamma 2.2 correction is baked in
 * @param color - Input HDR color
 */
export function unrealTonemap(color: TSLNode): TSLNode {
  return color.div(color.add(0.155)).mul(1.019)
}

/**
 * Hyperbolic tangent (tanh) based tonemapping
 * Smooth S-curve with natural highlight compression
 * @param color - Input HDR color
 */
export function tanhTonemap(color: TSLNode): TSLNode {
  return tanh(color)
}

// ============================================
// Stylized Tonemapping
// ============================================

/**
 * Cross-process tonemapping
 * Exaggerates blue, shifts red/green for a stylized look
 * @param color - Input color
 */
export function crossProcessTonemap(color: TSLNode): TSLNode {
  const r = pow(color.x, 0.8)
  const g = pow(color.y, 1.2)
  const b = pow(color.z, 1.5)
  return vec3(r, g, b).clamp(0.0, 1.0)
}

/**
 * Bleach bypass tonemapping
 * Increases contrast and desaturates for a cinematic look
 * @param color - Input color
 */
export function bleachBypassTonemap(color: TSLNode): TSLNode {
  const lum = color.dot(vec3(0.2126, 0.7152, 0.0722))
  const mixAmt = 0.7
  return mix(vec3(lum), color, mixAmt).mul(1.2).clamp(0.0, 1.0)
}

/**
 * Technicolor-inspired tonemapping
 * Splits and recombines channels for a retro look
 * @param color - Input color
 */
export function technicolorTonemap(color: TSLNode): TSLNode {
  const r = color.x.mul(1.5)
  const g = color.y.mul(1.2)
  const b = color.z.mul(0.8).add(color.x.mul(0.2))
  return vec3(r, g, b).clamp(0.0, 1.0)
}

/**
 * Cinematic S-curve tonemapping
 * Adds contrast and a slight color shift
 * @param color - Input color
 */
export function cinematicTonemap(color: TSLNode): TSLNode {
  const r = smoothstep(0.05, 0.95, color.x.mul(0.95).add(0.02))
  const g = smoothstep(0.05, 0.95, color.y.mul(1.05))
  const b = smoothstep(0.05, 0.95, color.z.mul(1.1))
  return vec3(r, g, b).clamp(0.0, 1.0)
}

// ============================================
// Utility Functions
// ============================================

/**
 * Apply tonemapping and gamma correction
 * @param color - Input HDR color
 * @param gamma - Gamma value (default 2.2)
 * @param tonemap - Tonemapping function to use
 */
export function tonemapWithGamma(
  color: TSLNode,
  gamma: TSLNode | number = 2.2,
  tonemap: (c: TSLNode) => TSLNode = acesTonemap
): TSLNode {
  const g = typeof gamma === 'number' ? float(gamma) : gamma
  const mapped = tonemap(color)
  return pow(mapped, float(1.0).div(g))
}

/**
 * Exposure adjustment
 * @param color - Input color
 * @param exposure - Exposure value (EV stops)
 */
export function applyExposure(color: TSLNode, exposure: TSLNode | number = 1.0): TSLNode {
  const exp = typeof exposure === 'number' ? float(exposure) : exposure
  return color.mul(pow(float(2.0), exp))
}
