// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Noise Helper Functions
 * Provides primitive functions required by 3D/4D noise algorithms
 */
import { abs, dot, floor, fract, lessThan, mod, mul, sub, vec3, vec4 } from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Mod289 Functions
// ============================================

/**
 * Mod289 for vec3 - used in simplex noise to avoid precision issues
 */
export function mod289Vec3(x: TSLNode): TSLNode {
  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0))
}

/**
 * Mod289 for vec4 - used in simplex noise to avoid precision issues
 */
export function mod289Vec4(x: TSLNode): TSLNode {
  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0))
}

/**
 * Mod289 for float - used in simplex noise to avoid precision issues
 */
export function mod289Float(x: TSLNode): TSLNode {
  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0))
}

// ============================================
// Fade Function
// ============================================

/**
 * Quintic fade function for smooth interpolation
 * fade(t) = t³(t(t×6 - 15) + 10)
 */
export function fade(t: TSLNode): TSLNode {
  return t
    .mul(t)
    .mul(t)
    .mul(t.mul(t.mul(6.0).sub(15.0)).add(10.0))
}

// ============================================
// Permutation Functions
// ============================================

/**
 * Permutation function for vec4
 * Used to generate pseudo-random values in noise functions
 */
export function permuteVec4(x: TSLNode): TSLNode {
  return mod(x.mul(34.0).add(1.0).mul(x), 289.0)
}

/**
 * Permutation function for float
 * Used to generate pseudo-random values in noise functions
 */
export function permuteFloat(x: TSLNode): TSLNode {
  return floor(mod(x.mul(34.0).add(1.0).mul(x), 289.0))
}

// ============================================
// Taylor Inverse Square Root
// ============================================

/**
 * Taylor inverse square root approximation for vec4
 * Used for normalizing gradient vectors efficiently
 */
export function taylorInvSqrtVec4(r: TSLNode): TSLNode {
  return sub(1.79284291400159, mul(0.85373472095314, r))
}

/**
 * Taylor inverse square root approximation for float
 * Used for normalizing gradient vectors efficiently
 */
export function taylorInvSqrtFloat(r: TSLNode): TSLNode {
  return sub(1.79284291400159, mul(0.85373472095314, r))
}

// ============================================
// Gradient Functions
// ============================================

/**
 * 4D gradient function for simplex noise
 * @param j - Index value
 * @param ip - Input permutation vector
 * @returns Gradient vector
 */
export function grad4(j: TSLNode, ip: TSLNode): TSLNode {
  const ones = vec4(1.0, 1.0, 1.0, -1.0)
  const p = vec4().toVar()
  const s = vec4().toVar()

  p.xyz.assign(
    floor(fract(vec3(j).mul(ip.xyz)).mul(7.0))
      .mul(ip.z)
      .sub(1.0)
  )
  p.w.assign(sub(1.5, dot(abs(p.xyz), ones.xyz)))
  s.assign(vec4(lessThan(p, vec4(0.0))))
  p.xyz.assign(p.xyz.add(s.xyz.mul(2.0).sub(1.0).mul(s.www)))

  return p
}
