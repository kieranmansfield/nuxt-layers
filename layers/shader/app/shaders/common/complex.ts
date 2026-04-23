// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Complex number arithmetic in TSL
 * Both functions operate on vec2 (x = real, y = imaginary).
 */
import { vec2, dot } from 'three/tsl'
import type { TSLNode } from '../types'

/**
 * Complex division: a / b
 * (a.x*b.x + a.y*b.y) / |b|² , (a.y*b.x - a.x*b.y) / |b|²
 * Used in imaginary2 for the Möbius transformation (z-p)/(z-q).
 */
export function complexDiv(a: TSLNode, b: TSLNode): TSLNode {
  const denom = dot(b, b)
  return vec2(
    a.x.mul(b.x).add(a.y.mul(b.y)).div(denom),
    a.y.mul(b.x).sub(a.x.mul(b.y)).div(denom),
  )
}

/**
 * Complex natural logarithm: ln(z)
 * Produces (ln|z|, arg(z)) — magnitude and winding angle.
 * Used in imaginary2 to extract the winding angle between two poles.
 */
export function complexLog(z: TSLNode): TSLNode {
  return vec2(z.length().log(), z.y.atan(z.x))
}
