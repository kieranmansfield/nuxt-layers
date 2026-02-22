// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Palette & Color Utilities
 * Provides composable color palette functions for shader effects
 */
import { Color } from 'three'
import {
  abs,
  clamp,
  cos,
  float,
  floor,
  fract,
  max,
  min,
  mix,
  smoothstep,
  step,
  vec3,
  vec4,
} from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Color Stop Types
// ============================================

export interface ColorStop {
  position: number
  color: string | [number, number, number]
}

// ============================================
// Basic Palette Functions
// ============================================

/**
 * Simple 2-color gradient
 */
export function gradient2(t: TSLNode, color1: TSLNode | string, color2: TSLNode | string): TSLNode {
  const c1 = typeof color1 === 'string' ? hexToVec3(color1) : color1
  const c2 = typeof color2 === 'string' ? hexToVec3(color2) : color2
  return mix(c1, c2, clamp(t, 0, 1))
}

/**
 * 3-color gradient
 */
export function gradient3(
  t: TSLNode,
  color1: TSLNode | string,
  color2: TSLNode | string,
  color3: TSLNode | string
): TSLNode {
  const c1 = typeof color1 === 'string' ? hexToVec3(color1) : color1
  const c2 = typeof color2 === 'string' ? hexToVec3(color2) : color2
  const c3 = typeof color3 === 'string' ? hexToVec3(color3) : color3

  const tClamped = clamp(t, 0, 1)
  const first = mix(c1, c2, clamp(tClamped.mul(2), 0, 1))
  const second = mix(c2, c3, clamp(tClamped.sub(0.5).mul(2), 0, 1))

  return mix(first, second, step(0.5, tClamped))
}

/**
 * 4-color gradient
 */
export function gradient4(
  t: TSLNode,
  color1: TSLNode | string,
  color2: TSLNode | string,
  color3: TSLNode | string,
  color4: TSLNode | string
): TSLNode {
  const c1 = typeof color1 === 'string' ? hexToVec3(color1) : color1
  const c2 = typeof color2 === 'string' ? hexToVec3(color2) : color2
  const c3 = typeof color3 === 'string' ? hexToVec3(color3) : color3
  const c4 = typeof color4 === 'string' ? hexToVec3(color4) : color4

  const tClamped = clamp(t, 0, 1)

  // 0.0 - 0.33: c1 -> c2
  // 0.33 - 0.66: c2 -> c3
  // 0.66 - 1.0: c3 -> c4
  const seg1 = mix(c1, c2, smoothstep(0, 0.33, tClamped))
  const seg2 = mix(seg1, c3, smoothstep(0.33, 0.66, tClamped))
  const seg3 = mix(seg2, c4, smoothstep(0.66, 1, tClamped))

  return seg3
}

/**
 * Multi-stop gradient with custom positions
 */
export function gradientMulti(t: TSLNode, stops: ColorStop[]): TSLNode {
  if (stops.length < 2) {
    throw new Error('Gradient requires at least 2 color stops')
  }

  // Sort stops by position
  const sortedStops = [...stops].sort((a, b) => a.position - b.position)

  let result = hexToVec3(sortedStops[0].color)

  for (let i = 1; i < sortedStops.length; i++) {
    const prevStop = sortedStops[i - 1]
    const currStop = sortedStops[i]

    const prevColor = hexToVec3(prevStop.color)
    const currColor = hexToVec3(currStop.color)

    const localT = clamp(t.sub(prevStop.position).div(currStop.position - prevStop.position), 0, 1)

    result = mix(result, currColor, step(prevStop.position, t).mul(localT)) as TSLNode
  }

  return result
}

// ============================================
// Cosine Palette (IQ-style)
// ============================================

/**
 * IQ's cosine palette formula
 * Creates smooth, cyclic color palettes
 * @see https://iquilezles.org/articles/palettes/
 */
export function cosinePalette(
  t: TSLNode,
  brightness: TSLNode | [number, number, number] = [0.5, 0.5, 0.5],
  contrast: TSLNode | [number, number, number] = [0.5, 0.5, 0.5],
  frequency: TSLNode | [number, number, number] = [1.0, 1.0, 1.0],
  phase: TSLNode | [number, number, number] = [0.0, 0.33, 0.67]
): TSLNode {
  const a = Array.isArray(brightness) ? vec3(...brightness) : brightness
  const b = Array.isArray(contrast) ? vec3(...contrast) : contrast
  const c = Array.isArray(frequency) ? vec3(...frequency) : frequency
  const d = Array.isArray(phase) ? vec3(...phase) : phase

  // a + b * cos(2π * (c * t + d))
  return a.add(
    b.mul(
      cos(
        c
          .mul(t)
          .add(d)
          .mul(Math.PI * 2)
      )
    )
  )
}

// ============================================
// Preset Palettes
// ============================================

/**
 * Rainbow palette
 */
export function rainbow(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.0, 0.33, 0.67])
}

/**
 * Sunset palette (warm colors)
 */
export function sunset(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 0.7, 0.4], [0.0, 0.15, 0.2])
}

/**
 * Ocean palette (cool colors)
 */
export function ocean(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.3, 0.2, 0.2])
}

/**
 * Fire palette
 */
export function fire(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 0.5, 0.0], [0.0, 0.1, 0.2])
}

/**
 * Ice palette
 */
export function ice(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.5, 0.5, 0.5], [0.4, 0.4, 0.5], [0.0, 0.1, 0.2], [0.0, 0.0, 0.0])
}

/**
 * Neon palette
 */
export function neon(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [2.0, 1.0, 0.0], [0.5, 0.2, 0.25])
}

/**
 * Pastel palette
 */
export function pastel(t: TSLNode): TSLNode {
  return cosinePalette(t, [0.8, 0.8, 0.8], [0.2, 0.2, 0.2], [1.0, 1.0, 1.0], [0.0, 0.33, 0.67])
}

/**
 * Grayscale palette
 */
export function grayscale(t: TSLNode): TSLNode {
  const gray = clamp(t, 0, 1)
  return vec3(gray, gray, gray)
}

// ============================================
// Color Manipulation
// ============================================

/**
 * Hue shift
 */
export function hueShift(color: TSLNode, amount: TSLNode | number): TSLNode {
  const shift = typeof amount === 'number' ? float(amount) : amount

  // Convert RGB to HSV
  const K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0)
  const p = mix(
    vec4(color.z, color.y, K.w, K.z),
    vec4(color.y, color.z, K.x, K.y),
    step(color.z, color.y)
  )
  const q = mix(vec4(p.x, p.y, p.w, color.x), vec4(color.x, p.y, p.z, p.x), step(p.x, color.x))

  const d = q.x.sub(min(q.w, q.y))
  const e = float(1.0e-10)

  const h = abs(q.z.add(q.w.sub(q.y).div(d.mul(6).add(e))))
  const s = d.div(q.x.add(e))
  const v = q.x

  // Shift hue
  const newH = fract(h.add(shift))

  // Convert back to RGB
  const hue = abs(newH.mul(6).sub(vec3(3, 2, 4)))
  const clamped = clamp(hue.sub(1), 0, 1)
  return v.mul(mix(vec3(1, 1, 1), clamped, s))
}

/**
 * Temperature shift (warm/cool)
 */
export function temperature(color: TSLNode, amount: TSLNode | number): TSLNode {
  const amt = typeof amount === 'number' ? float(amount) : amount
  const warm = vec3(1.0, 0.9, 0.7)
  const cool = vec3(0.7, 0.9, 1.0)
  const tint = mix(cool, warm, amt.add(0.5))
  return color.mul(tint)
}

/**
 * Vibrance adjustment
 */
export function vibrance(color: TSLNode, amount: TSLNode | number): TSLNode {
  const amt = typeof amount === 'number' ? float(amount) : amount
  const average = color.x.add(color.y).add(color.z).div(3)
  const mx = max(max(color.x, color.y), color.z)
  const saturation = mx.sub(average).mul(3)
  const vibranceScale = float(1).add(amt.mul(float(1).sub(saturation)))
  return mix(vec3(average, average, average), color, vibranceScale)
}

// ============================================
// Utility Functions
// ============================================

/**
 * Convert hex color to vec3
 */
export function hexToVec3(hex: string | [number, number, number]): TSLNode {
  if (Array.isArray(hex)) {
    return vec3(hex[0], hex[1], hex[2])
  }

  const color = new Color(hex)
  return vec3(color.r, color.g, color.b)
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: TSLNode): TSLNode {
  const h = hsl.x
  const s = hsl.y
  const l = hsl.z

  const c = float(1)
    .sub(abs(l.mul(2).sub(1)))
    .mul(s)
  const x = c.mul(float(1).sub(abs(fract(h.mul(6)).mul(2).sub(1))))
  const m = l.sub(c.div(2))

  const hue = fract(h).mul(6)

  // Choose color based on hue sector
  const r = mix(mix(c, x, step(1, hue)), mix(float(0), x, step(4, hue)), step(2, hue))
  const g = mix(mix(x, c, step(1, hue)), mix(x, float(0), step(4, hue)), step(2, hue))
  const b = mix(float(0), mix(c, x, step(4, hue)), step(3, hue))

  return vec3(r, g, b).add(m)
}

/**
 * Quantize color to fewer levels (posterize)
 */
export function quantize(color: TSLNode, levels: TSLNode | number): TSLNode {
  const lvl = typeof levels === 'number' ? float(levels) : levels
  return floor(color.mul(lvl)).div(lvl.sub(1))
}
