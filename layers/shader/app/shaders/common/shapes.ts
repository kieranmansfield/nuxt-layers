// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Shape Utilities
 * Provides composable shape functions for shader effects
 */
import {
  abs,
  atan2,
  cos,
  float,
  floor,
  fract,
  length,
  max,
  min,
  mix,
  sin,
  smoothstep,
  vec2,
} from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Basic Shapes
// ============================================

/**
 * Soft circular blob
 */
export function blob(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  radius: TSLNode | number = 0.3,
  softness: TSLNode | number = 0.1
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const r = typeof radius === 'number' ? float(radius) : radius
  const s = typeof softness === 'number' ? float(softness) : softness

  const d = length(uv.sub(c))
  return smoothstep(r.add(s), r.sub(s), d)
}

/**
 * Hard-edged circle
 */
export function circle(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  radius: TSLNode | number = 0.3
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const r = typeof radius === 'number' ? float(radius) : radius

  const d = length(uv.sub(c))
  return step(d, r)
}

/**
 * Ring shape (donut)
 */
export function ring(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  innerRadius: TSLNode | number = 0.2,
  outerRadius: TSLNode | number = 0.3,
  softness: TSLNode | number = 0.02
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const inner = typeof innerRadius === 'number' ? float(innerRadius) : innerRadius
  const outer = typeof outerRadius === 'number' ? float(outerRadius) : outerRadius
  const s = typeof softness === 'number' ? float(softness) : softness

  const d = length(uv.sub(c))
  const outerEdge = smoothstep(outer.add(s), outer.sub(s), d)
  const innerEdge = smoothstep(inner.sub(s), inner.add(s), d)

  return outerEdge.mul(innerEdge)
}

/**
 * Radial gradient (1 at center, 0 at edges)
 */
export function radialGradient(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  scale: TSLNode | number = 1
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const s = typeof scale === 'number' ? float(scale) : scale

  return max(float(0), float(1).sub(length(uv.sub(c)).mul(s)))
}

/**
 * Rounded rectangle / box
 */
export function roundedRect(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  size: TSLNode | [number, number] = [0.4, 0.3],
  cornerRadius: TSLNode | number = 0.05,
  softness: TSLNode | number = 0.01
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const sz = Array.isArray(size) ? vec2(size[0], size[1]) : size
  const r = typeof cornerRadius === 'number' ? float(cornerRadius) : cornerRadius
  const s = typeof softness === 'number' ? float(softness) : softness

  const p = abs(uv.sub(c)).sub(sz.div(2)).add(r)
  const d = length(max(p, 0))
    .add(min(max(p.x, p.y), 0))
    .sub(r)

  return smoothstep(s, s.negate(), d)
}

/**
 * Rectangle / box (hard edges)
 */
export function rect(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  size: TSLNode | [number, number] = [0.4, 0.3]
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const sz = Array.isArray(size) ? vec2(size[0], size[1]) : size

  const p = abs(uv.sub(c))
  const halfSize = sz.div(2)

  return step(p.x, halfSize.x).mul(step(p.y, halfSize.y))
}

// ============================================
// Lines & Stripes
// ============================================

/**
 * Horizontal line
 */
export function horizontalLine(
  uv: TSLNode,
  y: TSLNode | number = 0.5,
  thickness: TSLNode | number = 0.02,
  softness: TSLNode | number = 0.005
): TSLNode {
  const yPos = typeof y === 'number' ? float(y) : y
  const t = typeof thickness === 'number' ? float(thickness) : thickness
  const s = typeof softness === 'number' ? float(softness) : softness

  const d = abs(uv.y.sub(yPos))
  return smoothstep(t.div(2).add(s), t.div(2).sub(s), d)
}

/**
 * Vertical line
 */
export function verticalLine(
  uv: TSLNode,
  x: TSLNode | number = 0.5,
  thickness: TSLNode | number = 0.02,
  softness: TSLNode | number = 0.005
): TSLNode {
  const xPos = typeof x === 'number' ? float(x) : x
  const t = typeof thickness === 'number' ? float(thickness) : thickness
  const s = typeof softness === 'number' ? float(softness) : softness

  const d = abs(uv.x.sub(xPos))
  return smoothstep(t.div(2).add(s), t.div(2).sub(s), d)
}

/**
 * Repeating horizontal stripes
 */
export function stripes(
  uv: TSLNode,
  frequency: TSLNode | number = 10,
  thickness: TSLNode | number = 0.5,
  angle: TSLNode | number = 0
): TSLNode {
  const freq = typeof frequency === 'number' ? float(frequency) : frequency
  const t = typeof thickness === 'number' ? float(thickness) : thickness
  const a = typeof angle === 'number' ? float(angle) : angle

  // Rotate UV
  const cosA = cos(a)
  const sinA = sin(a)
  const rotatedX = uv.x.mul(cosA).sub(uv.y.mul(sinA))

  const pattern = fract(rotatedX.mul(freq))
  return step(pattern, t)
}

/**
 * Smooth repeating stripes
 */
export function smoothStripes(
  uv: TSLNode,
  frequency: TSLNode | number = 10,
  angle: TSLNode | number = 0
): TSLNode {
  const freq = typeof frequency === 'number' ? float(frequency) : frequency
  const a = typeof angle === 'number' ? float(angle) : angle

  const cosA = cos(a)
  const sinA = sin(a)
  const rotatedX = uv.x.mul(cosA).sub(uv.y.mul(sinA))

  return sin(rotatedX.mul(freq).mul(Math.PI * 2))
    .mul(0.5)
    .add(0.5)
}

// ============================================
// Grids & Patterns
// ============================================

/**
 * Grid pattern
 */
export function grid(
  uv: TSLNode,
  cellSize: TSLNode | number = 0.1,
  lineWidth: TSLNode | number = 0.02
): TSLNode {
  const size = typeof cellSize === 'number' ? float(cellSize) : cellSize
  const width = typeof lineWidth === 'number' ? float(lineWidth) : lineWidth

  const gridUV = fract(uv.div(size))
  const halfWidth = width.div(size).div(2)

  const xLine = step(gridUV.x, halfWidth).add(step(float(1).sub(halfWidth), gridUV.x))
  const yLine = step(gridUV.y, halfWidth).add(step(float(1).sub(halfWidth), gridUV.y))

  return max(xLine, yLine)
}

/**
 * Dot pattern
 */
export function dots(
  uv: TSLNode,
  cellSize: TSLNode | number = 0.1,
  dotRadius: TSLNode | number = 0.03
): TSLNode {
  const size = typeof cellSize === 'number' ? float(cellSize) : cellSize
  const radius = typeof dotRadius === 'number' ? float(dotRadius) : dotRadius

  const gridUV = fract(uv.div(size)).sub(0.5)
  const d = length(gridUV.mul(size))

  return step(d, radius)
}

/**
 * Checker pattern
 */
export function checker(uv: TSLNode, scale: TSLNode | number = 10): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const scaledUV = floor(uv.mul(s))
  return fract(scaledUV.x.add(scaledUV.y).mul(0.5)).mul(2)
}

// ============================================
// Polar / Radial Patterns
// ============================================

/**
 * Star shape
 */
export function star(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  points: number = 5,
  innerRadius: TSLNode | number = 0.1,
  outerRadius: TSLNode | number = 0.3
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const inner = typeof innerRadius === 'number' ? float(innerRadius) : innerRadius
  const outer = typeof outerRadius === 'number' ? float(outerRadius) : outerRadius

  const p = uv.sub(c)
  const angle = atan2(p.y, p.x)
  const dist = length(p)

  const segmentAngle = float((Math.PI * 2) / points)
  const halfSegment = segmentAngle.div(2)

  // Fold angle into one segment
  const foldedAngle = abs(fract(angle.div(segmentAngle).add(0.5)).sub(0.5)).mul(segmentAngle)

  // Interpolate radius based on angle within segment
  const t = foldedAngle.div(halfSegment)
  const targetRadius = mix(outer, inner, t)

  return step(dist, targetRadius)
}

/**
 * Radial lines (sunburst pattern)
 */
export function radialLines(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  numLines: number = 12,
  thickness: TSLNode | number = 0.5
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const t = typeof thickness === 'number' ? float(thickness) : thickness

  const p = uv.sub(c)
  const angle = atan2(p.y, p.x).add(Math.PI)
  const segment = float((Math.PI * 2) / numLines)

  const foldedAngle = fract(angle.div(segment))
  return step(foldedAngle, t)
}

/**
 * Concentric circles
 */
export function concentricCircles(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  frequency: TSLNode | number = 10,
  thickness: TSLNode | number = 0.5
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const freq = typeof frequency === 'number' ? float(frequency) : frequency
  const t = typeof thickness === 'number' ? float(thickness) : thickness

  const d = length(uv.sub(c))
  return step(fract(d.mul(freq)), t)
}

// ============================================
// Polygon
// ============================================

/**
 * Regular polygon
 */
export function polygon(
  uv: TSLNode,
  center: TSLNode | [number, number] = [0.5, 0.5],
  sides: number = 6,
  radius: TSLNode | number = 0.3,
  rotation: TSLNode | number = 0
): TSLNode {
  const c = Array.isArray(center) ? vec2(center[0], center[1]) : center
  const r = typeof radius === 'number' ? float(radius) : radius
  const rot = typeof rotation === 'number' ? float(rotation) : rotation

  const p = uv.sub(c)
  const angle = atan2(p.y, p.x).add(rot)
  const dist = length(p)

  const segmentAngle = float((Math.PI * 2) / sides)

  // Calculate distance to polygon edge
  const foldedAngle = abs(fract(angle.div(segmentAngle).add(0.5)).sub(0.5)).mul(segmentAngle)
  const edgeDist = r.mul(cos(segmentAngle.div(2))).div(cos(foldedAngle))

  return step(dist, edgeDist)
}
