// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Math Utilities
 * Provides hyperbolic functions, complex number operations, and coordinate utilities
 */
import {
  abs,
  add,
  clamp,
  cos,
  div,
  exp,
  If,
  length,
  log,
  mul,
  PI,
  pow,
  select,
  sin,
  smoothstep,
  sqrt,
  vec2,
  vec4,
} from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Hyperbolic Functions
// ============================================

/**
 * Hyperbolic tangent (tanh)
 * Fast approximation using exponentials
 */
export function tanh(val: TSLNode): TSLNode {
  const x = clamp(val, -40.0, 40.0)
  const tmp = exp(x)
  return tmp.sub(div(1.0, tmp)).div(tmp.add(div(1.0, tmp)))
}

/**
 * Hyperbolic sine (sinh)
 * Fast approximation using exponentials
 */
export function sinh(val: TSLNode): TSLNode {
  const tmp = exp(val)
  return tmp.sub(div(1.0, tmp)).div(2.0)
}

/**
 * Hyperbolic cosine (cosh)
 * Fast approximation using exponentials
 */
export function cosh(val: TSLNode): TSLNode {
  const tmp = exp(val)
  return tmp.add(div(1.0, tmp)).div(2.0)
}

// ============================================
// Complex Number Operations
// ============================================

/**
 * Convert complex number z (vec2) to polar form (r, theta)
 * @param z - Complex number as vec2(real, imaginary)
 * @returns Polar form: vec2(radius, angle)
 */
export function asPolar(z: TSLNode): TSLNode {
  return vec2(length(z), atan(z.y, z.x))
}

/**
 * Complex multiplication: (a * b) for complex numbers a, b (vec2)
 * @param a - First complex number
 * @param b - Second complex number
 * @returns Product as complex number
 */
export function complexMul(a: TSLNode, b: TSLNode): TSLNode {
  return vec2(a.x.mul(b.x).sub(mul(a.y, b.y)), a.x.mul(b.y).add(mul(a.y, b.x)))
}

/**
 * Complex division: (a / b) for complex numbers a, b (vec2)
 * @param a - Dividend complex number
 * @param b - Divisor complex number
 * @returns Result of division as complex number
 */
export function complexDiv(a: TSLNode, b: TSLNode): TSLNode {
  const denom = add(b.x.mul(b.x), b.y.mul(b.y))
  return vec2(
    div(a.x.mul(b.x).add(mul(a.y, b.y)), denom),
    div(a.y.mul(b.x).sub(mul(a.x, b.y)), denom)
  )
}

/**
 * Complex logarithm: log(a) for complex number a (vec2)
 * @param a - Complex number
 * @returns Logarithm in complex form
 */
export function complexLog(a: TSLNode): TSLNode {
  const polar = asPolar(a)
  const rPart = polar.x
  const iPart = float(polar.y).toVar()
  select(iPart.greaterThan(PI), iPart.assign(iPart.sub(mul(2.0, PI))), iPart.assign(polar.y))
  return vec2(log(rPart), iPart)
}

/**
 * Complex power: v^p for complex number v (vec2) and real p
 * @param v - Base complex number
 * @param p - Real exponent
 * @returns Power result as complex number
 */
export function complexPow(v: TSLNode, p: TSLNode | number): TSLNode {
  const z = asPolar(v)
  return pow(z.x, p).mul(vec2(cos(z.y.mul(p)), sin(z.y.mul(p))))
}

/**
 * Complex sine: sin(a) for complex number a (vec2)
 * @param a - Complex number
 * @returns Sine in complex form
 */
export function complexSin(a: TSLNode): TSLNode {
  return vec2(sin(a.x).mul(cosh(a.y)), cos(a.x).mul(sinh(a.y)))
}

/**
 * Complex cosine: cos(a) for complex number a (vec2)
 * @param a - Complex number
 * @returns Cosine in complex form
 */
export function complexCos(a: TSLNode): TSLNode {
  return vec2(cos(a.x).mul(cosh(a.y)), sin(a.x).mul(sinh(a.y)).negate())
}

/**
 * Complex tangent: tan(a) for complex number a (vec2)
 * @param a - Complex number
 * @returns Tangent in complex form
 */
export function complexTan(a: TSLNode): TSLNode {
  return complexDiv(complexSin(a), complexCos(a))
}

// ============================================
// Coordinate Utilities
// ============================================

/**
 * Computes a bilinear gradient between four colors using barycentric coordinates
 * @param st - UV coordinates for the gradient
 * @param color1 - First color (top-left)
 * @param color2 - Second color (top-right)
 * @param color3 - Third color (bottom-left)
 * @param color4 - Fourth color (bottom-right)
 * @returns Interpolated color based on the four corner colors
 */
export function grad(
  st: TSLNode,
  color1: TSLNode,
  color2: TSLNode,
  color3: TSLNode,
  color4: TSLNode
): TSLNode {
  const _uv = vec2(st).toVar()
  const _color0 = vec4(color1, 1.0).toVar()
  const _color1 = vec4(color2, 1.0).toVar()
  const _color2 = vec4(color3, 1.0).toVar()
  const _color3 = vec4(color4, 1.0).toVar()

  const P0 = vec2(0.31, 0.3).toVar()
  const P1 = vec2(0.7, 0.32).toVar()
  const P2 = vec2(0.28, 0.71).toVar()
  const P3 = vec2(0.72, 0.75).toVar()

  const Q = vec2(P0.sub(P2)).toVar()
  const R = vec2(P1.sub(P0)).toVar()
  const S = vec2(R.add(P2.sub(P3))).toVar()
  const T = vec2(P0.sub(_uv)).toVar()

  const u = float().toVar()
  const t = float().toVar()

  If(Q.x.equal(0.0).and(S.x.equal(0.0)), () => {
    u.assign(T.x.negate().div(R.x))
    t.assign(T.y.add(u.mul(R.y)).div(Q.y.add(u.mul(S.y))))
  })
    .ElseIf(Q.y.equal(0.0).and(S.y.equal(0.0)), () => {
      u.assign(T.y.negate().div(R.y))
      t.assign(T.x.add(u.mul(R.x)).div(Q.x.add(u.mul(S.x))))
    })
    .Else(() => {
      const A = float(S.x.mul(R.y).sub(R.x.mul(S.y))).toVar()
      const B = float(
        S.x
          .mul(T.y)
          .sub(T.x.mul(S.y))
          .add(Q.x.mul(R.y).sub(R.x.mul(Q.y)))
      ).toVar()
      const C = float(Q.x.mul(T.y).sub(T.x.mul(Q.y))).toVar()

      If(abs(A).lessThan(0.0001), () => {
        u.assign(C.negate().div(B))
      }).Else(() => {
        u.assign(
          B.negate()
            .add(sqrt(B.mul(B).sub(mul(4.0, A).mul(C))))
            .div(mul(2.0, A))
        )
      })

      t.assign(T.y.add(u.mul(R.y)).div(Q.y.add(u.mul(S.y))))
    })

  u.assign(clamp(u, 0.0, 1.0))
  t.assign(clamp(t, 0.0, 1.0))
  t.assign(smoothstep(0.0, 1.0, t))
  u.assign(smoothstep(0.0, 1.0, u))

  const colorA = vec4(_color0.xyz.mix(_color1.xyz, u), 1.0).toVar()
  const colorB = vec4(_color2.xyz.mix(_color3.xyz, u), 1.0).toVar()

  return colorA.xyz.mix(colorB.xyz, t)
}

/**
 * Converts Cartesian coordinates to polar coordinates
 * @param p - 2D Cartesian coordinates (x, y)
 * @returns Polar coordinates (radius, angle) where angle is in radians
 */
export function cartesianToPolar(p: TSLNode): TSLNode {
  const r = length(p)
  const theta = atan(p.y, p.x)
  return vec2(r, theta)
}

/**
 * Converts polar coordinates to Cartesian coordinates
 * @param p - Polar coordinates (radius, angle) where angle is in radians
 * @returns Cartesian coordinates (x, y)
 */
export function polarToCartesian(p: TSLNode): TSLNode {
  const polar = vec2(p).toVar()
  const r = float(polar.x).toVar()
  const theta = float(polar.y).toVar()
  return vec2(r.mul(cos(theta)), r.mul(sin(theta)))
}
