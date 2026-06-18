/**
 * Modular TSL Shape Utilities
 * Provides composable shape functions for shader effects
 */
import {
  abs,
  atan,
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
  step,
} from 'three/tsl'

import type { TSLNode } from '../types'
import { toScalarNode, toVec2Node } from './nodes'

// ============================================
// Basic Shapes
// ============================================

/**
 * Soft circular blob
 */
export function blob(
  uv: TSLNode,
  ...args: [
    center?: TSLNode | [number, number],
    radius?: TSLNode | number,
    softness?: TSLNode | number,
  ]
): TSLNode {
  const [center = [0.5, 0.5], radius = 0.3, softness = 0.1] = args
  const c = toVec2Node(center)
  const r = toScalarNode(radius)
  const s = toScalarNode(softness)

  const d = length(uv.sub(c))
  return smoothstep(r.add(s), r.sub(s), d)
}

/**
 * Hard-edged circle
 */
export function circle(
  uv: TSLNode,
  ...args: [center?: TSLNode | [number, number], radius?: TSLNode | number]
): TSLNode {
  const [center = [0.5, 0.5], radius = 0.3] = args
  const c = toVec2Node(center)
  const r = toScalarNode(radius)

  const d = length(uv.sub(c))
  return step(d, r)
}

/**
 * Ring shape (donut)
 */
export function ring(
  uv: TSLNode,
  ...args: [
    center?: TSLNode | [number, number],
    innerRadius?: TSLNode | number,
    outerRadius?: TSLNode | number,
    softness?: TSLNode | number,
  ]
): TSLNode {
  const [center = [0.5, 0.5], innerRadius = 0.2, outerRadius = 0.3, softness = 0.02] = args
  const c = toVec2Node(center)
  const inner = toScalarNode(innerRadius)
  const outer = toScalarNode(outerRadius)
  const s = toScalarNode(softness)

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
  ...args: [center?: TSLNode | [number, number], scale?: TSLNode | number]
): TSLNode {
  const [center = [0.5, 0.5], scale = 1] = args
  const c = toVec2Node(center)
  const s = toScalarNode(scale)

  return max(float(0), float(1).sub(length(uv.sub(c)).mul(s)))
}

/**
 * Rounded rectangle / box
 */
export function roundedRect(
  uv: TSLNode,
  ...args: [
    center?: TSLNode | [number, number],
    size?: TSLNode | [number, number],
    cornerRadius?: TSLNode | number,
    softness?: TSLNode | number,
  ]
): TSLNode {
  const [center = [0.5, 0.5], size = [0.4, 0.3], cornerRadius = 0.05, softness = 0.01] = args
  const c = toVec2Node(center)
  const sz = toVec2Node(size)
  const r = toScalarNode(cornerRadius)
  const s = toScalarNode(softness)

  const p: TSLNode = abs(uv.sub(c)).sub(sz.div(2)).add(r)
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
  ...args: [center?: TSLNode | [number, number], size?: TSLNode | [number, number]]
): TSLNode {
  const [center = [0.5, 0.5], size = [0.4, 0.3]] = args
  const c = toVec2Node(center)
  const sz = toVec2Node(size)

  const p: TSLNode = abs(uv.sub(c))
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
  ...args: [y?: TSLNode | number, thickness?: TSLNode | number, softness?: TSLNode | number]
): TSLNode {
  const [y = 0.5, thickness = 0.02, softness = 0.005] = args
  const yPos = toScalarNode(y)
  const t = toScalarNode(thickness)
  const s = toScalarNode(softness)

  const d = abs(uv.y.sub(yPos))
  return smoothstep(t.div(2).add(s), t.div(2).sub(s), d)
}

/**
 * Vertical line
 */
export function verticalLine(
  uv: TSLNode,
  ...args: [x?: TSLNode | number, thickness?: TSLNode | number, softness?: TSLNode | number]
): TSLNode {
  const [x = 0.5, thickness = 0.02, softness = 0.005] = args
  const xPos = toScalarNode(x)
  const t = toScalarNode(thickness)
  const s = toScalarNode(softness)

  const d = abs(uv.x.sub(xPos))
  return smoothstep(t.div(2).add(s), t.div(2).sub(s), d)
}

/**
 * Repeating horizontal stripes
 */
export function stripes(
  uv: TSLNode,
  ...args: [frequency?: TSLNode | number, thickness?: TSLNode | number, angle?: TSLNode | number]
): TSLNode {
  const [frequency = 10, thickness = 0.5, angle = 0] = args
  const freq = toScalarNode(frequency)
  const t = toScalarNode(thickness)
  const a = toScalarNode(angle)

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

  const gridUV: TSLNode = fract(uv.div(size))
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
  ...args: [cellSize?: TSLNode | number, dotRadius?: TSLNode | number, softness?: TSLNode | number]
): TSLNode {
  const [cellSize = 0.1, dotRadius = 0.03, softness] = args
  const size = toScalarNode(cellSize)
  const radius = toScalarNode(dotRadius)

  const gridUV: TSLNode = fract(uv.div(size)).sub(0.5)
  const d = length(gridUV.mul(size))

  if (softness === undefined) return step(d, radius)

  const soft = toScalarNode(softness)
  return float(1).sub(smoothstep(radius.sub(soft), radius.add(soft), d))
}

/**
 * Checker pattern
 */
export function checker(uv: TSLNode, scale: TSLNode | number = 10): TSLNode {
  const s = typeof scale === 'number' ? float(scale) : scale
  const scaledUV: TSLNode = floor(uv.mul(s))
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
  ...args: [
    center?: TSLNode | [number, number],
    points?: number,
    innerRadius?: TSLNode | number,
    outerRadius?: TSLNode | number,
    softness?: TSLNode | number,
  ]
): TSLNode {
  const [center = [0.5, 0.5], points = 5, innerRadius = 0.1, outerRadius = 0.3, softness] = args
  const c = toVec2Node(center)
  const inner = toScalarNode(innerRadius)
  const outer = toScalarNode(outerRadius)

  const p = uv.sub(c)
  const angle = atan(p.y, p.x)
  const dist = length(p)

  const segmentAngle = float((Math.PI * 2) / points)
  const halfSegment = segmentAngle.div(2)

  // Fold angle into one segment
  const foldedAngle = abs(fract(angle.div(segmentAngle).add(0.5)).sub(0.5)).mul(segmentAngle)

  // Interpolate radius based on angle within segment
  const t = foldedAngle.div(halfSegment)
  const targetRadius = mix(outer, inner, t)

  if (softness === undefined) return step(dist, targetRadius)

  const soft = toScalarNode(softness)
  return float(1).sub(smoothstep(targetRadius.sub(soft), targetRadius.add(soft), dist))
}

/**
 * Radial lines (sunburst pattern)
 */
export function radialLines(
  uv: TSLNode,
  ...args: [center?: TSLNode | [number, number], numLines?: number, thickness?: TSLNode | number]
): TSLNode {
  const [center = [0.5, 0.5], numLines = 12, thickness = 0.5] = args
  const c = toVec2Node(center)
  const t = toScalarNode(thickness)

  const p = uv.sub(c)
  const angle = atan(p.y, p.x).add(Math.PI)
  const segment = float((Math.PI * 2) / numLines)

  const foldedAngle = fract(angle.div(segment))
  return step(foldedAngle, t)
}

/**
 * Concentric circles
 */
export function concentricCircles(
  uv: TSLNode,
  ...args: [center?: TSLNode | [number, number], frequency?: TSLNode | number, thickness?: TSLNode | number]
): TSLNode {
  const [center = [0.5, 0.5], frequency = 10, thickness = 0.5] = args
  const c = toVec2Node(center)
  const freq = toScalarNode(frequency)
  const t = toScalarNode(thickness)

  const d: TSLNode = length(uv.sub(c))
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
  ...args: [
    center?: TSLNode | [number, number],
    sides?: number,
    radius?: TSLNode | number,
    rotation?: TSLNode | number,
    softness?: TSLNode | number,
  ]
): TSLNode {
  const [center = [0.5, 0.5], sides = 6, radius = 0.3, rotation = 0, softness] = args
  const c = toVec2Node(center)
  const r = toScalarNode(radius)
  const rot = toScalarNode(rotation)

  const p = uv.sub(c)
  const angle = atan(p.y, p.x).add(rot)
  const dist = length(p)

  const segmentAngle = float((Math.PI * 2) / sides)

  // Calculate distance to polygon edge
  const foldedAngle = abs(fract(angle.div(segmentAngle).add(0.5)).sub(0.5)).mul(segmentAngle)
  const edgeDist = r.mul(cos(segmentAngle.div(2))).div(cos(foldedAngle))

  if (softness === undefined) return step(dist, edgeDist)

  const soft = toScalarNode(softness)
  return float(1).sub(smoothstep(edgeDist.sub(soft), edgeDist.add(soft), dist))
}
