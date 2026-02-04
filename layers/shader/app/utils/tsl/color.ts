import { abs, clamp, float, Fn, max, min, mix, mod, vec3 } from 'three/tsl'
import type { GradientStop, TSLNode } from '../../types'
import { circularDistance } from './math'

/**
 * Linear gradient with multiple color stops
 */
export const gradientLinear = Fn(([t, stops]: [TSLNode, GradientStop[]]) => {
  if (stops.length === 0) return vec3(0.0)
  if (stops.length === 1) return stops[0]!.color

  let result: TSLNode = stops[0]!.color

  for (let i = 1; i < stops.length; i++) {
    const prevStop = stops[i - 1]!
    const currStop = stops[i]!
    const localT = clamp(
      t.sub(prevStop.position).div(currStop.position - prevStop.position),
      0.0,
      1.0
    )
    result = mix(
      result,
      currStop.color,
      localT.mul(t.greaterThanEqual(prevStop.position).mul(t.lessThan(currStop.position)))
    )
  }

  // Handle end
  const lastStop = stops[stops.length - 1]!
  result = mix(result, lastStop.color, t.greaterThanEqual(lastStop.position))

  return result
})

/**
 * Radial gradient from center
 */
export const gradientRadial = Fn(([uv, center, stops]: [TSLNode, TSLNode, GradientStop[]]) => {
  const dist = circularDistance(uv, center)
  return gradientLinear(dist, stops)
})

/**
 * Blend modes
 */
export const blendMultiply = Fn(([base, blend]: [TSLNode, TSLNode]) => {
  return base.mul(blend)
})

export const blendScreen = Fn(([base, blend]: [TSLNode, TSLNode]) => {
  return float(1.0).sub(float(1.0).sub(base).mul(float(1.0).sub(blend)))
})

export const blendOverlay = Fn(([base, blend]: [TSLNode, TSLNode]) => {
  const isLight = base.lessThan(0.5)
  const dark = base.mul(blend).mul(2.0)
  const light = float(1.0).sub(float(1.0).sub(base).mul(float(1.0).sub(blend)).mul(2.0))
  return isLight.select(dark, light)
})

export const blendSoftLight = Fn(([base, blend]: [TSLNode, TSLNode]) => {
  const isLight = blend.lessThan(0.5)
  const dark = base.mul(blend.mul(2.0)).add(base.mul(base).mul(float(1.0).sub(blend.mul(2.0))))
  const light = base
    .mul(float(1.0).sub(blend.mul(2.0).sub(1.0)))
    .add(base.sqrt().mul(blend.mul(2.0).sub(1.0)))
  return isLight.select(dark, light)
})

export const blendAdd = Fn(([base, blend]: [TSLNode, TSLNode]) => {
  return min(base.add(blend), 1.0)
})

export const blendSubtract = Fn(([base, blend]: [TSLNode, TSLNode]) => {
  return max(base.sub(blend), 0.0)
})

/**
 * RGB to HSL conversion
 */
export const rgbToHsl = Fn(([rgb]: [TSLNode]) => {
  const r = rgb.x
  const g = rgb.y
  const b = rgb.z

  const maxC = max(max(r, g), b)
  const minC = min(min(r, g), b)
  const delta = maxC.sub(minC)

  const l = maxC.add(minC).mul(0.5)

  const s = delta
    .lessThan(0.00001)
    .select(
      float(0.0),
      l.lessThan(0.5).select(delta.div(maxC.add(minC)), delta.div(float(2.0).sub(maxC).sub(minC)))
    )

  // Hue calculation
  const rMax = maxC.equal(r).select(mod(g.sub(b).div(delta), 6.0), float(0.0))
  const gMax = maxC.equal(g).select(b.sub(r).div(delta).add(2.0), float(0.0))
  const bMax = maxC.equal(b).select(r.sub(g).div(delta).add(4.0), float(0.0))
  const h = delta.lessThan(0.00001).select(float(0.0), rMax.add(gMax).add(bMax).div(6.0))

  return vec3(h, s, l)
})

/**
 * HSL to RGB conversion
 */
export const hslToRgb = Fn(([hsl]: [TSLNode]) => {
  const h = hsl.x
  const s = hsl.y
  const l = hsl.z

  const c = float(1.0)
    .sub(abs(l.mul(2.0).sub(1.0)))
    .mul(s)
  const x = c.mul(float(1.0).sub(abs(mod(h.mul(6.0), 2.0).sub(1.0))))
  const m = l.sub(c.mul(0.5))

  const h6 = h.mul(6.0)

  const rgb0 = h6.lessThan(1.0).select(vec3(c, x, 0.0), vec3(0.0))
  const rgb1 = h6
    .greaterThanEqual(1.0)
    .mul(h6.lessThan(2.0))
    .select(vec3(x, c, 0.0), rgb0)
  const rgb2 = h6
    .greaterThanEqual(2.0)
    .mul(h6.lessThan(3.0))
    .select(vec3(0.0, c, x), rgb1)
  const rgb3 = h6
    .greaterThanEqual(3.0)
    .mul(h6.lessThan(4.0))
    .select(vec3(0.0, x, c), rgb2)
  const rgb4 = h6
    .greaterThanEqual(4.0)
    .mul(h6.lessThan(5.0))
    .select(vec3(x, 0.0, c), rgb3)
  const rgb5 = h6.greaterThanEqual(5.0).select(vec3(c, 0.0, x), rgb4)

  return rgb5.add(m)
})

/**
 * Shift hue by an amount (0-1)
 */
export const hueShift = Fn(([rgb, shift]: [TSLNode, TSLNode]) => {
  const hsl = rgbToHsl(rgb)
  const newH = mod(hsl.x.add(shift), 1.0)
  return hslToRgb(vec3(newH, hsl.y, hsl.z))
})

/**
 * Adjust saturation
 */
export const adjustSaturation = Fn(([rgb, amount]: [TSLNode, TSLNode]) => {
  const hsl = rgbToHsl(rgb)
  const newS = clamp(hsl.y.mul(amount), 0.0, 1.0)
  return hslToRgb(vec3(hsl.x, newS, hsl.z))
})

/**
 * Adjust contrast
 */
export const adjustContrast = Fn(([rgb, contrast]: [TSLNode, TSLNode]) => {
  return rgb.sub(0.5).mul(contrast).add(0.5)
})

/**
 * Adjust brightness
 */
export const adjustBrightness = Fn(([rgb, brightness]: [TSLNode, TSLNode]) => {
  return clamp(rgb.add(brightness), 0.0, 1.0)
})

/**
 * Vibrance adjustment (smarter saturation)
 */
export const adjustVibrance = Fn(([rgb, vibrance]: [TSLNode, TSLNode]) => {
  const maxC = max(max(rgb.x, rgb.y), rgb.z)
  const minC = min(min(rgb.x, rgb.y), rgb.z)
  const sat = maxC.sub(minC)
  const satFactor = float(1.0).sub(sat).mul(vibrance)
  const gray = rgb.x.mul(0.299).add(rgb.y.mul(0.587)).add(rgb.z.mul(0.114))
  return mix(vec3(gray), rgb, float(1.0).add(satFactor))
})
