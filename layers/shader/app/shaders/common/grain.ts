// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Grain & Film Effects
 * Provides composable grain and texture overlay functions
 */
import { clamp, dot, float, floor, fract, mix, sin, smoothstep, vec2, vec3 } from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Basic Grain
// ============================================

/**
 * Simple film grain
 */
export function grain(
  uv: TSLNode,
  intensity: TSLNode | number = 0.1,
  seed: TSLNode | number = 0
): TSLNode {
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const s = typeof seed === 'number' ? float(seed) : seed

  const noise = fract(sin(dot(uv.add(s), vec2(12.9898, 78.233))).mul(43758.5453))
  return noise.sub(0.5).mul(int)
}

/**
 * Animated film grain
 */
export function animatedGrain(
  uv: TSLNode,
  time: TSLNode,
  intensity: TSLNode | number = 0.1,
  speed: TSLNode | number = 1
): TSLNode {
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const spd = typeof speed === 'number' ? float(speed) : speed

  // Use time as seed for animation
  const seed = floor(time.mul(spd).mul(24)) // 24 fps grain
  return grain(uv, int, seed)
}

/**
 * Colored film grain (RGB noise)
 */
export function coloredGrain(
  uv: TSLNode,
  intensity: TSLNode | number = 0.1,
  seed: TSLNode | number = 0
): TSLNode {
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const s = typeof seed === 'number' ? float(seed) : seed

  const r = grain(uv, int, s)
  const g = grain(uv.add(vec2(1.0, 0.0)), int, s)
  const b = grain(uv.add(vec2(0.0, 1.0)), int, s)

  return vec3(r, g, b)
}

// ============================================
// Dithering
// ============================================

/**
 * Bayer 2x2 dithering matrix
 */
export function bayer2x2(uv: TSLNode, scale: TSLNode | number = 1): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const pos = floor(uv.mul(s)).mod(2)
  const matrix = vec2(0.25, 0.75)
  return mix(mix(matrix.x, matrix.y, pos.x), mix(matrix.y, matrix.x, pos.x), pos.y)
}

/**
 * Bayer 4x4 dithering (simplified)
 */
export function bayer4x4(uv: TSLNode, scale: TSLNode | number = 1): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const pos = floor(uv.mul(s)).mod(4)

  // Simplified 4x4 Bayer matrix approximation
  const bayer2 = bayer2x2(uv, s)
  const offset = bayer2x2(uv.mul(0.5), s).mul(0.25)

  return bayer2.add(offset).sub(0.5)
}

/**
 * Apply dithering to color
 */
export function ditherColor(
  color: TSLNode,
  uv: TSLNode,
  levels: TSLNode | number = 16,
  strength: TSLNode | number = 1
): TSLNode {
  const lvl = typeof levels === 'number' ? float(levels) : levels
  const str = typeof strength === 'number' ? float(strength) : strength

  const threshold = bayer4x4(uv, 4).mul(str).div(lvl)
  const dithered = floor(color.mul(lvl).add(threshold)).div(lvl)

  return clamp(dithered, 0, 1)
}

// ============================================
// Scanlines
// ============================================

/**
 * CRT scanlines
 */
export function scanlines(
  uv: TSLNode,
  density: TSLNode | number = 400,
  intensity: TSLNode | number = 0.25,
  offset: TSLNode | number = 0
): TSLNode {
  const d = typeof density === 'number' ? float(density) : density
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const off = typeof offset === 'number' ? float(offset) : offset

  const line = sin(uv.y.add(off).mul(d).mul(Math.PI)).mul(0.5).add(0.5)
  return float(1).sub(line.mul(int))
}

/**
 * Interlaced scanlines (every other line)
 */
export function interlace(
  uv: TSLNode,
  density: TSLNode | number = 400,
  intensity: TSLNode | number = 0.5,
  frame: TSLNode | number = 0
): TSLNode {
  const d = typeof density === 'number' ? float(density) : density
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const f = typeof frame === 'number' ? float(frame) : frame

  const line = floor(uv.y.mul(d)).add(f).mod(2)
  return float(1).sub(line.mul(int))
}

// ============================================
// Vignette
// ============================================

/**
 * Circular vignette
 */
export function vignette(
  uv: TSLNode,
  intensity: TSLNode | number = 0.5,
  smoothness: TSLNode | number = 0.5,
  roundness: TSLNode | number = 1
): TSLNode {
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const smooth = typeof smoothness === 'number' ? float(smoothness) : smoothness
  const round = typeof roundness === 'number' ? float(roundness) : roundness

  const center = uv.sub(0.5)
  const dist = center.length().mul(round)

  return float(1).sub(smoothstep(float(1).sub(smooth), float(1), dist.mul(int.mul(2))))
}

/**
 * Rectangular vignette
 */
export function rectVignette(
  uv: TSLNode,
  intensity: TSLNode | number = 0.5,
  smoothness: TSLNode | number = 0.3
): TSLNode {
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const smooth = typeof smoothness === 'number' ? float(smoothness) : smoothness

  const distX = smoothstep(0, smooth, uv.x).mul(smoothstep(0, smooth, float(1).sub(uv.x)))
  const distY = smoothstep(0, smooth, uv.y).mul(smoothstep(0, smooth, float(1).sub(uv.y)))

  return mix(float(1), distX.mul(distY), int)
}

// ============================================
// Paper / Texture Effects
// ============================================

/**
 * Paper texture noise
 */
export function paperTexture(
  uv: TSLNode,
  scale: TSLNode | number = 10,
  intensity: TSLNode | number = 0.1,
  seed: TSLNode | number = 0
): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const int = typeof intensity === 'number' ? float(intensity) : intensity
  const sd = typeof seed === 'number' ? float(seed) : seed

  // Multi-octave noise for paper texture
  const noise1 = grain(uv.mul(s), 1, sd)
  const noise2 = grain(uv.mul(s.mul(2)), 0.5, sd.add(1))
  const noise3 = grain(uv.mul(s.mul(4)), 0.25, sd.add(2))

  return noise1.add(noise2).add(noise3).mul(int)
}

/**
 * Halftone dot pattern
 */
export function halftone(
  uv: TSLNode,
  value: TSLNode,
  scale: TSLNode | number = 50,
  angle: TSLNode | number = 0
): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const a = typeof angle === 'number' ? float(angle) : angle

  // Rotate UV
  const cosA = a.cos()
  const sinA = a.sin()
  const rotatedUV = vec2(uv.x.mul(cosA).sub(uv.y.mul(sinA)), uv.x.mul(sinA).add(uv.y.mul(cosA)))

  const scaledUV = rotatedUV.mul(s)
  const center = fract(scaledUV).sub(0.5)
  const dist = center.length()

  // Dot size based on value
  const dotSize = value.mul(0.5)

  return smoothstep(dotSize.add(0.01), dotSize.sub(0.01), dist)
}

// ============================================
// Apply Effects to Color
// ============================================

/**
 * Apply grain to color
 */
export function applyGrain(
  color: TSLNode,
  uv: TSLNode,
  intensity: TSLNode | number = 0.05,
  seed: TSLNode | number = 0
): TSLNode {
  const grainValue = grain(uv, intensity, seed)
  return clamp(color.add(grainValue), 0, 1)
}

/**
 * Apply colored grain to color
 */
export function applyColoredGrain(
  color: TSLNode,
  uv: TSLNode,
  intensity: TSLNode | number = 0.05,
  seed: TSLNode | number = 0
): TSLNode {
  const grainValue = coloredGrain(uv, intensity, seed)
  return clamp(color.add(grainValue), 0, 1)
}

/**
 * Apply vignette to color
 */
export function applyVignette(
  color: TSLNode,
  uv: TSLNode,
  intensity: TSLNode | number = 0.5
): TSLNode {
  const vignetteValue = vignette(uv, intensity)
  return color.mul(vignetteValue)
}

/**
 * Apply scanlines to color
 */
export function applyScanlines(
  color: TSLNode,
  uv: TSLNode,
  density: TSLNode | number = 400,
  intensity: TSLNode | number = 0.25
): TSLNode {
  const scanlineValue = scanlines(uv, density, intensity)
  return color.mul(scanlineValue)
}

/**
 * Full CRT effect (scanlines + vignette + grain)
 */
export function crtEffect(
  color: TSLNode,
  uv: TSLNode,
  options: {
    scanlinesDensity?: number
    scanlinesIntensity?: number
    vignetteIntensity?: number
    grainIntensity?: number
    grainSeed?: TSLNode | number
  } = {}
): TSLNode {
  const {
    scanlinesDensity = 300,
    scanlinesIntensity = 0.15,
    vignetteIntensity = 0.4,
    grainIntensity = 0.03,
    grainSeed = 0,
  } = options

  let result = color

  // Apply scanlines
  result = applyScanlines(result, uv, scanlinesDensity, scanlinesIntensity)

  // Apply vignette
  result = applyVignette(result, uv, vignetteIntensity)

  // Apply grain
  result = applyGrain(result, uv, grainIntensity, grainSeed)

  return result
}

// ============================================
// 8x8 Bayer Dithering
// ============================================

// 8x8 Bayer matrix values (normalized to 0-1 range)
const BAYER_8X8_MATRIX = [
  0.0 / 64.0,
  48.0 / 64.0,
  12.0 / 64.0,
  60.0 / 64.0,
  3.0 / 64.0,
  51.0 / 64.0,
  15.0 / 64.0,
  63.0 / 64.0,
  32.0 / 64.0,
  16.0 / 64.0,
  44.0 / 64.0,
  28.0 / 64.0,
  35.0 / 64.0,
  19.0 / 64.0,
  47.0 / 64.0,
  31.0 / 64.0,
  8.0 / 64.0,
  56.0 / 64.0,
  4.0 / 64.0,
  52.0 / 64.0,
  11.0 / 64.0,
  59.0 / 64.0,
  7.0 / 64.0,
  55.0 / 64.0,
  40.0 / 64.0,
  24.0 / 64.0,
  36.0 / 64.0,
  20.0 / 64.0,
  43.0 / 64.0,
  27.0 / 64.0,
  39.0 / 64.0,
  23.0 / 64.0,
  2.0 / 64.0,
  50.0 / 64.0,
  14.0 / 64.0,
  62.0 / 64.0,
  1.0 / 64.0,
  49.0 / 64.0,
  13.0 / 64.0,
  61.0 / 64.0,
  34.0 / 64.0,
  18.0 / 64.0,
  46.0 / 64.0,
  30.0 / 64.0,
  33.0 / 64.0,
  17.0 / 64.0,
  45.0 / 64.0,
  29.0 / 64.0,
  10.0 / 64.0,
  58.0 / 64.0,
  6.0 / 64.0,
  54.0 / 64.0,
  9.0 / 64.0,
  57.0 / 64.0,
  5.0 / 64.0,
  53.0 / 64.0,
  42.0 / 64.0,
  26.0 / 64.0,
  38.0 / 64.0,
  22.0 / 64.0,
  41.0 / 64.0,
  25.0 / 64.0,
  37.0 / 64.0,
  21.0 / 64.0,
]

/**
 * Get value from 8x8 Bayer matrix at given coordinates
 * Used for ordered dithering
 */
function getBayer8x8Value(x: TSLNode, y: TSLNode): TSLNode {
  const index = y.mul(8).add(x).toVar()
  const value = float(0.0).toVar()

  // Unroll array lookup using conditionals
  for (let i = 0; i < 64; i++) {
    value.assign(mix(value, float(BAYER_8X8_MATRIX[i]), index.equal(i)))
  }

  return value
}

/**
 * 8x8 Bayer dithering matrix
 * Higher quality than 4x4, better gradient reproduction
 * @param uv - UV coordinates
 * @param scale - Scale of the dithering pattern
 */
export function bayer8x8(uv: TSLNode, scale: TSLNode | number = 1): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const pos = floor(uv.mul(s)).mod(8)
  return getBayer8x8Value(pos.x, pos.y)
}

/**
 * Apply 8x8 dithering to color
 * @param color - Input color
 * @param uv - UV coordinates
 * @param levels - Number of color levels per channel
 * @param strength - Dithering strength
 * @param bias - Bias offset for threshold
 */
export function dither8x8Color(
  color: TSLNode,
  uv: TSLNode,
  levels: TSLNode | number = 16,
  strength: TSLNode | number = 1,
  bias: TSLNode | number = 0.5
): TSLNode {
  const lvl = typeof levels === 'number' ? float(levels) : levels
  const str = typeof strength === 'number' ? float(strength) : strength
  const b = typeof bias === 'number' ? float(bias) : bias

  const threshold = bayer8x8(uv, 8).sub(b).mul(str).div(lvl)
  const dithered = floor(color.mul(lvl).add(threshold)).div(lvl)

  return clamp(dithered, 0, 1)
}
