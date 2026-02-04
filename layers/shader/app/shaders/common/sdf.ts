// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL SDF (Signed Distance Field) Utilities
 * Provides 2D/3D SDF shapes and operations for procedural geometry
 */
import {
  abs,
  add,
  clamp,
  length,
  max,
  min,
  mul,
  select,
  sign,
  sqrt,
  sub,
  vec2,
  vec3,
} from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// SDF Operations
// ============================================

/**
 * Smooth minimum of two SDF values
 * Creates smooth blending between shapes
 * @param a - First SDF value
 * @param b - Second SDF value
 * @param factor - Smoothing factor (higher = smoother blend)
 */
export function smin(a: TSLNode, b: TSLNode, factor: TSLNode | number): TSLNode {
  const k = typeof factor === 'number' ? float(factor) : factor
  const h = max(k.sub(abs(a.sub(b))), 0).div(k)
  return min(a, b).sub(h.mul(h).mul(k).mul(0.25))
}

/**
 * Smooth maximum of two SDF values
 * @param a - First SDF value
 * @param b - Second SDF value
 * @param factor - Smoothing factor
 */
export function smax(a: TSLNode, b: TSLNode, factor: TSLNode | number = 0): TSLNode {
  const k = typeof factor === 'number' ? float(factor) : factor
  return smin(a, b, k.negate())
}

// ============================================
// 2D SDF Shapes
// ============================================

/**
 * Sphere/Circle SDF
 * @param uv - UV coordinates (centered)
 * @param r - Radius
 */
export function sdSphere(uv: TSLNode, r: TSLNode | number = 0): TSLNode {
  const radius = typeof r === 'number' ? float(r) : r
  return length(uv).sub(radius)
}

/**
 * 2D Box SDF
 * @param uv - UV coordinates (centered)
 * @param size - Half-size (extent) of the box
 */
export function sdBox2d(uv: TSLNode, size: TSLNode | number = 0): TSLNode {
  const s = typeof size === 'number' ? float(size) : size
  return max(abs(uv.x), abs(uv.y)).sub(s)
}

/**
 * Diamond SDF (rotated square)
 * @param uv - UV coordinates (centered)
 * @param r - Radius
 */
export function sdDiamond(uv: TSLNode, r: TSLNode | number = 0): TSLNode {
  const radius = typeof r === 'number' ? float(r) : r
  return abs(uv.x).add(abs(uv.y)).sub(radius)
}

/**
 * Hexagon SDF
 * @param p - Point coordinates
 * @param r - Radius
 */
export function sdHexagon(p: TSLNode, r: TSLNode | number = 0.5): TSLNode {
  const radius = typeof r === 'number' ? float(r) : r
  const k = vec3(-0.866025404, 0.5, 0.577350269)

  const _p = abs(p).toVar()
  _p.subAssign(float(2.0).mul(min(dot(k.xy, _p), 0.0).mul(k.xy)))
  _p.subAssign(vec2(clamp(_p.x, k.z.negate().mul(radius), k.z.mul(radius)), radius))

  return length(_p).mul(sign(_p.y))
}

/**
 * Equilateral Triangle SDF
 * @param p - Point coordinates
 * @param r - Radius (distance from center to vertex)
 */
export function sdEquilateralTriangle(p: TSLNode, r: TSLNode | number = 0.1): TSLNode {
  const radius = typeof r === 'number' ? float(r) : r
  const k = sqrt(3.0)
  const _p = (p ?? vec2(0)).toVar()

  _p.x = abs(_p.x).sub(radius).toVar()
  _p.y = _p.y.add(radius.div(k)).toVar()

  If(_p.x.add(k.mul(_p.y)).greaterThan(0), () => {
    _p.assign(vec2(_p.x.sub(k.mul(_p.y)), k.negate().mul(_p.x).sub(_p.y)).div(2))
  })

  _p.x.subAssign(clamp(_p.x, radius.mul(-2), 0.0))
  return length(_p).negate().mul(sign(_p.y))
}

/**
 * Line SDF (axis-aligned)
 * @param p - Coordinate value
 */
export function sdLine(p: TSLNode): TSLNode {
  return abs(p)
}

/**
 * Ring SDF
 * @param uv - UV coordinates (centered)
 * @param radius - Ring radius
 */
export function sdRing(uv: TSLNode, radius: TSLNode | number = 0.4): TSLNode {
  const r = typeof radius === 'number' ? float(radius) : radius
  return abs(length(uv).sub(r))
}

export interface ParallelogramOptions {
  width?: TSLNode | number
  height?: TSLNode | number
  skew?: TSLNode | number
}

/**
 * Parallelogram SDF
 * @param p - Point coordinates
 * @param options - Width, height, and skew parameters
 */
export function sdParallelogram(p: TSLNode, options: ParallelogramOptions = {}): TSLNode {
  const { width = 0.4, height = 0.1, skew = 0.1 } = options

  const wi = typeof width === 'number' ? float(width) : width
  const he = typeof height === 'number' ? float(height) : height
  const sk = typeof skew === 'number' ? float(skew) : skew

  const _p = p.toVar()
  const e = vec2(sk, he)

  _p.assign(select(_p.y.lessThan(0.0), _p.negate(), _p))

  const w = _p.sub(e)
  w.x.subAssign(clamp(w.x, wi.negate(), wi))

  const d = vec2(dot(w, w), w.y.negate()).toVar()
  const s = _p.x.mul(e.y).sub(_p.y.mul(e.x))

  _p.assign(select(s.lessThan(0.0), _p.negate(), _p))

  const v = _p.sub(vec2(wi, 0)).toVar()
  v.subAssign(e.mul(clamp(dot(v, e).div(dot(e, e)), -1.0, 1.0)))
  d.assign(min(d, vec2(dot(v, v), wi.mul(he).sub(abs(s)))))

  return sqrt(d.x).mul(sign(d.y.negate()))
}

/**
 * Helper function for rhombus SDF
 */
function ndot(a: TSLNode, b: TSLNode): TSLNode {
  return a.x.mul(b.x).sub(a.y.mul(b.y))
}

/**
 * Rhombus SDF
 * @param p - Point coordinates
 * @param b - Size as vec2
 */
export function sdRhombus(p: TSLNode, b: TSLNode | [number, number] = [0.4, 0.4]): TSLNode {
  const size = Array.isArray(b) ? vec2(b[0], b[1]) : b
  const _p = p.toVar()
  _p.assign(abs(_p))

  const h = clamp(ndot(size.sub(mul(2.0, _p)), size).div(dot(size, size)), -1.0, 1.0)
  const d = length(_p.sub(mul(0.5, size).mul(vec2(sub(1.0, h), add(1.0, h)))))

  return d.mul(sign(_p.x.mul(size.y).add(_p.y.mul(size.x).sub(size.x.mul(size.y)))))
}

/**
 * Simple Triangle SDF
 * @param p - Point coordinates
 * @param size - Size factor
 */
export function sdTriangle(p: TSLNode, size: TSLNode | number = 0.4): TSLNode {
  const s = typeof size === 'number' ? float(size) : size
  return max(abs(p.x.mul(s)).add(p.y), abs(p.y.mul(s).sub(0.5)).sub(0.5))
}

// ============================================
// 3D SDF Shapes
// ============================================

/**
 * 3D Box SDF
 * @param p - Point coordinates
 * @param b - Half-extents as vec3
 */
export function sdBox3d(p: TSLNode, b: TSLNode | [number, number, number] = [0, 0, 0]): TSLNode {
  const size = Array.isArray(b) ? vec3(b[0], b[1], b[2]) : b
  const q = abs(p).sub(size)
  return length(max(q, 0.0)).add(min(max(q.x, max(q.y, q.z)), 0.0))
}
