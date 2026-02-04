// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Color Blending Utilities
 * Provides composable blend mode functions for shader effects
 */
import { abs, clamp, float, max, min, mix, step, vec3 } from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Basic Blending
// ============================================

/**
 * Linear interpolation between two colors
 */
export function blendLinear(a: TSLNode, b: TSLNode, t: TSLNode | number): TSLNode {
  const factor = typeof t === 'number' ? float(t) : t
  return mix(a, b, factor)
}

/**
 * Additive blending
 */
export function blendAdd(base: TSLNode, blend: TSLNode, opacity: TSLNode | number = 1): TSLNode {
  const op = typeof opacity === 'number' ? float(opacity) : opacity
  return base.add(blend.mul(op))
}

/**
 * Subtractive blending
 */
export function blendSubtract(
  base: TSLNode,
  blend: TSLNode,
  opacity: TSLNode | number = 1
): TSLNode {
  const op = typeof opacity === 'number' ? float(opacity) : opacity
  return base.sub(blend.mul(op))
}

// ============================================
// Photoshop-style Blend Modes
// ============================================

/**
 * Multiply blend mode
 */
export function blendMultiply(base: TSLNode, blend: TSLNode): TSLNode {
  return base.mul(blend)
}

/**
 * Screen blend mode
 */
export function blendScreen(base: TSLNode, blend: TSLNode): TSLNode {
  return float(1).sub(float(1).sub(base).mul(float(1).sub(blend)))
}

/**
 * Overlay blend mode
 */
export function blendOverlay(base: TSLNode, blend: TSLNode): TSLNode {
  const threshold = float(0.5)
  const multiply = base.mul(blend).mul(2)
  const screen = float(1).sub(float(1).sub(base).mul(float(1).sub(blend)).mul(2))
  return mix(multiply, screen, step(threshold, base))
}

/**
 * Soft light blend mode
 */
export function blendSoftLight(base: TSLNode, blend: TSLNode): TSLNode {
  const threshold = float(0.5)
  const dark = base.mul(base.add(blend.mul(2).mul(float(1).sub(base))))
  const light = base.add(blend.mul(2).sub(1).mul(base.sqrt().sub(base)))
  return mix(dark, light, step(threshold, blend))
}

/**
 * Hard light blend mode
 */
export function blendHardLight(base: TSLNode, blend: TSLNode): TSLNode {
  return blendOverlay(blend, base)
}

/**
 * Difference blend mode
 */
export function blendDifference(base: TSLNode, blend: TSLNode): TSLNode {
  return abs(base.sub(blend))
}

/**
 * Exclusion blend mode
 */
export function blendExclusion(base: TSLNode, blend: TSLNode): TSLNode {
  return base.add(blend).sub(base.mul(blend).mul(2))
}

/**
 * Darken blend mode
 */
export function blendDarken(base: TSLNode, blend: TSLNode): TSLNode {
  return min(base, blend)
}

/**
 * Lighten blend mode
 */
export function blendLighten(base: TSLNode, blend: TSLNode): TSLNode {
  return max(base, blend)
}

/**
 * Color dodge blend mode
 */
export function blendColorDodge(base: TSLNode, blend: TSLNode): TSLNode {
  return clamp(base.div(float(1).sub(blend).add(0.0001)), 0, 1)
}

/**
 * Color burn blend mode
 */
export function blendColorBurn(base: TSLNode, blend: TSLNode): TSLNode {
  return float(1).sub(clamp(float(1).sub(base).div(blend.add(0.0001)), 0, 1))
}

/**
 * Linear dodge (add) blend mode
 */
export function blendLinearDodge(base: TSLNode, blend: TSLNode): TSLNode {
  return clamp(base.add(blend), 0, 1)
}

/**
 * Linear burn blend mode
 */
export function blendLinearBurn(base: TSLNode, blend: TSLNode): TSLNode {
  return clamp(base.add(blend).sub(1), 0, 1)
}

/**
 * Vivid light blend mode
 */
export function blendVividLight(base: TSLNode, blend: TSLNode): TSLNode {
  const threshold = float(0.5)
  const colorBurn = blendColorBurn(base, blend.mul(2))
  const colorDodge = blendColorDodge(base, blend.sub(0.5).mul(2))
  return mix(colorBurn, colorDodge, step(threshold, blend))
}

/**
 * Pin light blend mode
 */
export function blendPinLight(base: TSLNode, blend: TSLNode): TSLNode {
  const threshold = float(0.5)
  const darken = blendDarken(base, blend.mul(2))
  const lighten = blendLighten(base, blend.sub(0.5).mul(2))
  return mix(darken, lighten, step(threshold, blend))
}

// ============================================
// Advanced Blending
// ============================================

/**
 * Apply blend mode with opacity
 */
export function blendWithOpacity(
  base: TSLNode,
  blend: TSLNode,
  blendFn: (a: TSLNode, b: TSLNode) => TSLNode,
  opacity: TSLNode | number = 1
): TSLNode {
  const op = typeof opacity === 'number' ? float(opacity) : opacity
  const blended = blendFn(base, blend)
  return mix(base, blended, op)
}

/**
 * Blend multiple layers
 */
export function blendLayers(
  base: TSLNode,
  layers: Array<{
    color: TSLNode
    opacity: TSLNode | number
    blendMode?: (a: TSLNode, b: TSLNode) => TSLNode
  }>
): TSLNode {
  let result = base

  for (const layer of layers) {
    const blendFn = layer.blendMode || blendLinear
    result = blendWithOpacity(result, layer.color, blendFn, layer.opacity)
  }

  return result
}

// ============================================
// Color Space Utilities
// ============================================

/**
 * Luminance of RGB color
 */
export function luminance(color: TSLNode): TSLNode {
  // Using standard luminance coefficients (Rec. 709)
  return color.x.mul(0.2126).add(color.y.mul(0.7152)).add(color.z.mul(0.0722))
}

/**
 * Desaturate color
 */
export function desaturate(color: TSLNode, amount: TSLNode | number = 1): TSLNode {
  const amt = typeof amount === 'number' ? float(amount) : amount
  const gray = luminance(color)
  return mix(color, vec3(gray, gray, gray), amt)
}

/**
 * Saturate color
 */
export function saturate(color: TSLNode, amount: TSLNode | number = 1): TSLNode {
  const amt = typeof amount === 'number' ? float(amount) : amount
  const gray = luminance(color)
  const grayVec = vec3(gray, gray, gray)
  // Extrapolate away from gray
  return mix(grayVec, color, float(1).add(amt))
}

/**
 * Adjust brightness
 */
export function brightness(color: TSLNode, amount: TSLNode | number = 0): TSLNode {
  const amt = typeof amount === 'number' ? float(amount) : amount
  return color.add(amt)
}

/**
 * Adjust contrast
 */
export function contrast(color: TSLNode, amount: TSLNode | number = 1): TSLNode {
  const amt = typeof amount === 'number' ? float(amount) : amount
  const mid = float(0.5)
  return color.sub(mid).mul(amt).add(mid)
}

/**
 * Invert color
 */
export function invert(color: TSLNode): TSLNode {
  return float(1).sub(color)
}
