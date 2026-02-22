// @ts-nocheck - TSL types are complex
/**
 * OKLCH color space utilities for both TSL (GPU) and JS (CPU) use.
 */
import { Color } from 'three'
import { cos, float, mul, pow, sin, vec3 } from 'three/tsl'
import type { TSLNode } from '../../types'

// ============================================
// TSL-native (GPU-side)
// ============================================

/**
 * Convert OKLCH to linear sRGB as a TSL vec3 node.
 * Approximate conversion via OKLab intermediate.
 */
export function oklchToLinearSRGB(l: TSLNode, c: TSLNode, h: TSLNode): TSLNode {
  // OKLCH -> OKLab
  const hRad = mul(h, Math.PI / 180)
  const a = mul(c, cos(hRad))
  const b = mul(c, sin(hRad))

  // OKLab -> linear sRGB (approximate matrix transform)
  const l_ = l.add(mul(a, float(0.3963377774))).add(mul(b, float(0.2158037573)))
  const m_ = l.sub(mul(a, float(0.1055613458))).sub(mul(b, float(0.0638541728)))
  const s_ = l.sub(mul(a, float(0.0894841775))).sub(mul(b, float(1.2914855480)))

  const lCubed = pow(l_, 3)
  const mCubed = pow(m_, 3)
  const sCubed = pow(s_, 3)

  const r = mul(lCubed, float(4.0767416621)).sub(mul(mCubed, float(3.3077115913))).add(mul(sCubed, float(0.2309699292)))
  const g = mul(lCubed, float(-1.2684380046)).add(mul(mCubed, float(2.6097574011))).sub(mul(sCubed, float(0.3413193965)))
  const bOut = mul(lCubed, float(-0.0041960863)).sub(mul(mCubed, float(0.7034186147))).add(mul(sCubed, float(1.7076147010)))

  return vec3(r, g, bOut)
}

// ============================================
// JS-side (CPU)
// ============================================

/**
 * Parse a CSS `oklch(L C H)` string into [l, c, h] values.
 */
export function parseOKLCH(str: string): [number, number, number] {
  const match = str.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!match) {
    throw new Error(`Invalid OKLCH string: ${str}`)
  }

  let l = parseFloat(match[1])
  if (match[1].endsWith('%')) l /= 100

  const c = parseFloat(match[2])
  const h = parseFloat(match[3])

  return [l, c, h]
}

/**
 * Convert OKLCH values to a THREE.Color (sRGB).
 * Uses approximate OKLab -> sRGB conversion.
 */
export function oklchToColor(l: number, c: number, h: number): Color {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)

  // OKLab to linear sRGB (approximate)
  const l_ = l + a * 0.3963377774 + b * 0.2158037573
  const m_ = l - a * 0.1055613458 - b * 0.0638541728
  const s_ = l - a * 0.0894841775 - b * 1.2914855480

  const lCubed = l_ * l_ * l_
  const mCubed = m_ * m_ * m_
  const sCubed = s_ * s_ * s_

  const r = lCubed * 4.0767416621 - mCubed * 3.3077115913 + sCubed * 0.2309699292
  const g = lCubed * -1.2684380046 + mCubed * 2.6097574011 - sCubed * 0.3413193965
  const bOut = lCubed * -0.0041960863 - mCubed * 0.7034186147 + sCubed * 1.7076147010

  // Clamp to [0,1]
  const color = new Color()
  color.setRGB(
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, bOut))
  )
  return color
}
