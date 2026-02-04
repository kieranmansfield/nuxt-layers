// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Noise Utilities
 * Provides composable noise functions for shader effects
 */
import {
  abs,
  clamp,
  cross,
  dot,
  EPSILON,
  float,
  floor,
  fract,
  Loop,
  mat2,
  max,
  min,
  mix,
  mod,
  mul,
  sin,
  step,
  sub,
  vec2,
  vec3,
  vec4,
} from 'three/tsl'
import type { TSLNode } from '../types'
import {
  fade,
  grad4,
  mod289Vec3,
  permuteFloat,
  permuteVec4,
  taylorInvSqrtVec4,
} from './noiseHelpers'

// ============================================
// Hash Functions
// ============================================

/**
 * 2D hash function returning a single float
 */
export function hash21(p: TSLNode): TSLNode {
  const p3 = fract(vec3(p.x, p.y, p.x).mul(0.1031))
  const dotP = dot(p3, p3.add(vec3(33.33, 33.33, 33.33)))
  return fract(dotP.mul(p3.x.add(p3.y)).mul(2))
}

/**
 * 2D hash function returning vec2
 */
export function hash22(p: TSLNode): TSLNode {
  const k = vec2(0.3183099, 0.3678794)
  const px = p.x.mul(k.x).add(p.y.mul(k.y))
  const py = p.x.mul(k.y).add(p.y.mul(k.x))
  return fract(sin(vec2(px, py).mul(43758.5453)).mul(2).sub(1))
}

/**
 * 3D hash function returning vec3
 */
export function hash33(p: TSLNode): TSLNode {
  const dotA = dot(p, vec3(127.1, 311.7, 74.7))
  const dotB = dot(p, vec3(269.5, 183.3, 246.1))
  const dotC = dot(p, vec3(113.5, 271.9, 124.6))
  return fract(sin(vec3(dotA, dotB, dotC)).mul(43758.5453123))
    .mul(2)
    .sub(1)
}

// ============================================
// 2D Noise Functions
// ============================================

/**
 * Simple 2D value noise
 */
export function valueNoise2D(st: TSLNode): TSLNode {
  const i = floor(st)
  const f = fract(st)

  // Four corners
  const a = hash21(i)
  const b = hash21(i.add(vec2(1, 0)))
  const c = hash21(i.add(vec2(0, 1)))
  const d = hash21(i.add(vec2(1, 1)))

  // Smooth interpolation
  const u = f.mul(f).mul(float(3).sub(f.mul(2)))

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y)
}

/**
 * Simplex 2D noise (gradient noise)
 */
export function simplexNoise2D(v: TSLNode): TSLNode {
  const C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439)

  const i = floor(v.add(dot(v, C.yy)))
  const x0 = v.sub(i).add(dot(i, C.xx))

  const i1x = step(x0.y, x0.x)
  const i1y = float(1).sub(i1x)
  const i1 = vec2(i1x, i1y)

  const x12 = x0.xyxy.add(C.xxzz)
  const x12_mod = vec4(x12.x.sub(i1.x), x12.y.sub(i1.y), x12.z, x12.w)

  const iMod = mod(i, 289)
  const p1 = mod(
    iMod.y
      .add(vec3(0, i1.y, 1))
      .mul(34)
      .add(1)
      .mul(iMod.y.add(vec3(0, i1.y, 1))),
    289
  )
  const p = mod(
    p1
      .add(iMod.x)
      .add(vec3(0, i1.x, 1))
      .mul(34)
      .add(1)
      .mul(p1.add(iMod.x).add(vec3(0, i1.x, 1))),
    289
  )

  const m = max(
    float(0.5).sub(
      vec3(
        dot(x0, x0),
        dot(vec2(x12_mod.x, x12_mod.y), vec2(x12_mod.x, x12_mod.y)),
        dot(vec2(x12_mod.z, x12_mod.w), vec2(x12_mod.z, x12_mod.w))
      )
    ),
    0
  )

  const m2 = m.mul(m)
  const m4 = m2.mul(m2)

  const x = fract(p.mul(C.www)).mul(2).sub(1)
  const h = abs(x).sub(0.5)
  const ox = floor(x.add(0.5))
  const a0 = x.sub(ox)

  const mMod = m4.mul(float(1.79284291400159).sub(a0.mul(a0).add(h.mul(h)).mul(0.85373472095314)))

  const gx = a0.x.mul(x0.x).add(h.x.mul(x0.y))
  const gy = a0.y.mul(x12_mod.x).add(h.y.mul(x12_mod.y))
  const gz = a0.z.mul(x12_mod.z).add(h.z.mul(x12_mod.w))

  return dot(mMod, vec3(gx, gy, gz)).mul(130)
}

// ============================================
// 3D Noise Functions
// ============================================

/**
 * 3D gradient noise
 */
export function gradientNoise3D(p: TSLNode): TSLNode {
  const i = floor(p)
  const f = fract(p)
  const u = f.mul(f).mul(float(3).sub(f.mul(2)))

  return mix(
    mix(
      mix(
        dot(hash33(i.add(vec3(0, 0, 0))), f.sub(vec3(0, 0, 0))),
        dot(hash33(i.add(vec3(1, 0, 0))), f.sub(vec3(1, 0, 0))),
        u.x
      ),
      mix(
        dot(hash33(i.add(vec3(0, 1, 0))), f.sub(vec3(0, 1, 0))),
        dot(hash33(i.add(vec3(1, 1, 0))), f.sub(vec3(1, 1, 0))),
        u.x
      ),
      u.y
    ),
    mix(
      mix(
        dot(hash33(i.add(vec3(0, 0, 1))), f.sub(vec3(0, 0, 1))),
        dot(hash33(i.add(vec3(1, 0, 1))), f.sub(vec3(1, 0, 1))),
        u.x
      ),
      mix(
        dot(hash33(i.add(vec3(0, 1, 1))), f.sub(vec3(0, 1, 1))),
        dot(hash33(i.add(vec3(1, 1, 1))), f.sub(vec3(1, 1, 1))),
        u.x
      ),
      u.y
    ),
    u.z
  )
}

// ============================================
// FBM (Fractal Brownian Motion)
// ============================================

export interface FBMOptions {
  octaves?: number
  lacunarity?: number
  gain?: number
  amplitude?: number
  frequency?: number
}

/**
 * 2D Fractal Brownian Motion
 */
export function fbm2D(p: TSLNode, options: FBMOptions = {}): TSLNode {
  const { octaves = 5, lacunarity = 2.0, gain = 0.5, amplitude = 0.5, frequency = 1.0 } = options

  let value = float(0)
  let amp = float(amplitude)
  let freq = float(frequency)
  const currentP = p

  for (let i = 0; i < octaves; i++) {
    value = value.add(amp.mul(simplexNoise2D(currentP.mul(freq))))
    amp = amp.mul(gain)
    freq = freq.mul(lacunarity)
  }

  return value
}

/**
 * 3D Fractal Brownian Motion
 */
export function fbm3D(p: TSLNode, options: FBMOptions = {}): TSLNode {
  const { octaves = 5, lacunarity = 2.0, gain = 0.5, amplitude = 0.5, frequency = 1.0 } = options

  let value = float(0)
  let amp = float(amplitude)
  let freq = float(frequency)

  for (let i = 0; i < octaves; i++) {
    value = value.add(amp.mul(gradientNoise3D(p.mul(freq))))
    amp = amp.mul(gain)
    freq = freq.mul(lacunarity)
  }

  return value
}

// ============================================
// Voronoi / Cellular Noise
// ============================================

export interface VoronoiResult {
  distance: TSLNode
  cellId: TSLNode
}

/**
 * Voronoi cellular noise
 */
export function voronoi2D(uv: TSLNode, scale: TSLNode | number = 1): VoronoiResult {
  const scaledUV = typeof scale === 'number' ? uv.mul(scale) : uv.mul(scale)
  const i = floor(scaledUV)
  const f = fract(scaledUV)

  let minDist = float(1)
  let cellId = vec2(0, 0)

  // Check 3x3 neighborhood
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      const neighbor = vec2(x, y)
      const point = hash22(i.add(neighbor))
      const diff = neighbor.add(point).sub(f)
      const dist = dot(diff, diff)

      const isCloser = step(dist, minDist)
      minDist = mix(minDist, dist, isCloser)
      cellId = mix(cellId, i.add(neighbor), isCloser) as TSLNode
    }
  }

  return {
    distance: minDist.sqrt(),
    cellId,
  }
}

// ============================================
// Domain Warping
// ============================================

/**
 * Apply domain warping to noise
 */
export function domainWarp2D(
  p: TSLNode,
  warpStrength: TSLNode | number = 0.5,
  warpScale: TSLNode | number = 2
): TSLNode {
  const strength = typeof warpStrength === 'number' ? float(warpStrength) : warpStrength
  const scale = typeof warpScale === 'number' ? float(warpScale) : warpScale

  const q = vec2(fbm2D(p), fbm2D(p.add(vec2(5.2, 1.3))))

  const r = vec2(
    fbm2D(p.add(q.mul(scale)).add(vec2(1.7, 9.2))),
    fbm2D(p.add(q.mul(scale)).add(vec2(8.3, 2.8)))
  )

  return fbm2D(p.add(r.mul(strength)))
}

// ============================================
// Turbulence
// ============================================

/**
 * Turbulence (absolute value of FBM)
 */
export function turbulence2D(p: TSLNode, options: FBMOptions = {}): TSLNode {
  const { octaves = 5, lacunarity = 2.0, gain = 0.5, amplitude = 0.5, frequency = 1.0 } = options

  let value = float(0)
  let amp = float(amplitude)
  let freq = float(frequency)

  for (let i = 0; i < octaves; i++) {
    value = value.add(amp.mul(abs(simplexNoise2D(p.mul(freq)))))
    amp = amp.mul(gain)
    freq = freq.mul(lacunarity)
  }

  return value
}

// ============================================
// 3D Simplex Noise
// ============================================

/**
 * 3D simplex noise function
 * Higher quality than gradient noise, produces smoother results
 */
export function simplexNoise3d(v: TSLNode): TSLNode {
  const C = vec2(1.0 / 6.0, 1.0 / 3.0)
  const D = vec4(0.0, 0.5, 1.0, 2.0)

  const i = vec3(floor(v.add(dot(v, C.yyy)))).toVar()
  const x0 = vec3(v.sub(i).add(dot(i, C.xxx))).toVar()

  const g = vec3(step(x0.yzx, x0.xyz)).toVar()
  const l = vec3(sub(1.0, g)).toVar()
  const i1 = vec3(min(g.xyz, l.zxy)).toVar()
  const i2 = vec3(max(g.xyz, l.zxy)).toVar()

  const x1 = vec3(x0.sub(i1).add(mul(1.0, C.xxx))).toVar()
  const x2 = vec3(x0.sub(i2).add(mul(2.0, C.xxx))).toVar()
  const x3 = vec3(x0.sub(1).add(mul(3.0, C.xxx))).toVar()

  i.assign(mod(i, 289.0))

  const p = vec4(
    permuteVec4(
      permuteVec4(
        permuteVec4(i.z.add(vec4(0.0, i1.z, i2.z, 1.0))).add(i.y.add(vec4(0.0, i1.y, i2.y, 1.0)))
      ).add(i.x.add(vec4(0.0, i1.x, i2.x, 1.0)))
    )
  ).toVar()

  const n_ = float(1.0 / 7.0).toVar()
  const ns = vec3(n_.mul(D.wyz).sub(D.xzx)).toVar()

  const j = vec4(p.sub(mul(49.0, floor(p.mul(ns.z.mul(ns.z)))))).toVar()
  const x_ = vec4(floor(j.mul(ns.z))).toVar()
  const y_ = vec4(floor(j.sub(mul(7.0, x_)))).toVar()
  const x = vec4(x_.mul(ns.x).add(ns.yyyy)).toVar()
  const y = vec4(y_.mul(ns.x).add(ns.yyyy)).toVar()
  const h = vec4(sub(1.0, abs(x).sub(abs(y)))).toVar()

  const b0 = vec4(x.xy, y.xy).toVar()
  const b1 = vec4(x.zw, y.zw).toVar()

  const s0 = vec4(floor(b0).mul(2.0).add(1.0)).toVar()
  const s1 = vec4(floor(b1).mul(2.0).add(1.0)).toVar()
  const sh = vec4(step(h, vec4(0.0)).negate()).toVar()

  const a0 = vec4(b0.xzyw.add(s0.xzyw.mul(sh.xxyy))).toVar()
  const a1 = vec4(b1.xzyw.add(s1.xzyw.mul(sh.zzww))).toVar()

  const p0 = vec3(a0.xy, h.x).toVar()
  const p1 = vec3(a0.zw, h.y).toVar()
  const p2 = vec3(a1.xy, h.z).toVar()
  const p3 = vec3(a1.zw, h.w).toVar()

  const norm = vec4(
    taylorInvSqrtVec4(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)))
  ).toVar()
  p0.mulAssign(norm.x)
  p1.mulAssign(norm.y)
  p2.mulAssign(norm.z)
  p3.mulAssign(norm.w)

  const m = vec4(
    max(sub(0.6, vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3))), 0.0)
  ).toVar()
  m.assign(m.mul(m))

  return mul(42.0, dot(m.mul(m), vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))))
}

// ============================================
// 4D Simplex Noise
// ============================================

/**
 * 4D simplex noise function
 * Useful for animating 3D noise smoothly over time
 */
export function simplexNoise4d(v: TSLNode): TSLNode {
  const C = vec2(0.138196601125010504, 0.309016994374947451)

  const i = vec4(floor(v.add(dot(v, C.yyyy)))).toVar()
  const x0 = vec4(v.sub(i).add(dot(i, C.xxxx))).toVar()

  const i0 = vec4().toVar()
  const isX = vec3(step(x0.yzw, x0.xxx)).toVar()
  const isYZ = vec3(step(x0.zww, x0.yyz)).toVar()

  i0.x.assign(isX.x.add(isX.y).add(isX.z))
  i0.yzw.assign(sub(1.0, isX))
  i0.y.addAssign(isYZ.x.add(isYZ.y))
  i0.zw.addAssign(sub(1.0, isYZ.xy))
  i0.z.addAssign(isYZ.z)
  i0.w.addAssign(sub(1.0, isYZ.z))

  const i3 = vec4(clamp(i0, 0.0, 1.0)).toVar()
  const i2 = vec4(clamp(i0.sub(1.0), 0.0, 1.0)).toVar()
  const i1 = vec4(clamp(i0.sub(2.0), 0.0, 1.0)).toVar()

  const x1 = vec4(x0.sub(i1).add(mul(1.0, C.xxxx))).toVar()
  const x2 = vec4(x0.sub(i2).add(mul(2.0, C.xxxx))).toVar()
  const x3 = vec4(x0.sub(i3).add(mul(3.0, C.xxxx))).toVar()
  const x4 = vec4(x0.sub(1.0).add(mul(4.0, C.xxxx))).toVar()

  i.assign(mod(i, 289.0))

  const j0 = float(
    permuteFloat(permuteFloat(permuteFloat(permuteFloat(i.w).add(i.z)).add(i.y)).add(i.x))
  ).toVar()

  const j1 = vec4(
    permuteVec4(
      permuteVec4(
        permuteVec4(
          permuteVec4(i.w.add(vec4(i1.w, i2.w, i3.w, 1.0)))
            .add(i.z)
            .add(vec4(i1.z, i2.z, i3.z, 1.0))
        )
          .add(i.y)
          .add(vec4(i1.y, i2.y, i3.y, 1.0))
      )
        .add(i.x)
        .add(vec4(i1.x, i2.x, i3.x, 1.0))
    )
  ).toVar()

  const ip = vec4(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0).toVar()

  const gp0 = vec4(grad4(j0, ip)).toVar()
  const gp1 = vec4(grad4(j1.x, ip)).toVar()
  const gp2 = vec4(grad4(j1.y, ip)).toVar()
  const gp3 = vec4(grad4(j1.z, ip)).toVar()
  const gp4 = vec4(grad4(j1.w, ip)).toVar()

  const norm = vec4(
    taylorInvSqrtVec4(vec4(dot(gp0, gp0), dot(gp1, gp1), dot(gp2, gp2), dot(gp3, gp3)))
  ).toVar()
  gp0.mulAssign(norm.x)
  gp1.mulAssign(norm.y)
  gp2.mulAssign(norm.z)
  gp3.mulAssign(norm.w)
  gp4.mulAssign(taylorInvSqrtVec4(vec4(dot(gp4, gp4))).x)

  const m0 = vec3(max(sub(0.6, vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2))), 0.0)).toVar()
  const m1 = vec2(max(sub(0.6, vec2(dot(x3, x3), dot(x4, x4))), 0.0)).toVar()
  m0.assign(m0.mul(m0))
  m1.assign(m1.mul(m1))

  return mul(
    49.0,
    dot(m0.mul(m0), vec3(dot(gp0, x0), dot(gp1, x1), dot(gp2, x2))).add(
      dot(m1.mul(m1), vec2(dot(gp3, x3), dot(gp4, x4)))
    )
  )
}

// ============================================
// 3D Perlin Noise
// ============================================

/**
 * Classic 3D Perlin noise
 * Different character than simplex noise, more "blocky" artifacts
 */
export function perlinNoise3d(P: TSLNode): TSLNode {
  const Pi0 = vec3(floor(P)).toVar()
  const Pi1 = vec3(Pi0.add(vec3(1.0))).toVar()
  Pi0.assign(mod289Vec3(Pi0))
  Pi1.assign(mod289Vec3(Pi1))

  const Pf0 = vec3(fract(P)).toVar()
  const Pf1 = vec3(Pf0.sub(vec3(1.0))).toVar()

  const ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x).toVar()
  const iy = vec4(Pi0.yy, Pi1.yy).toVar()
  const iz0 = vec4(Pi0.zzzz).toVar()
  const iz1 = vec4(Pi1.zzzz).toVar()

  const ixy = vec4(permuteVec4(permuteVec4(ix).add(iy))).toVar()
  const ixy0 = vec4(permuteVec4(ixy.add(iz0))).toVar()
  const ixy1 = vec4(permuteVec4(ixy.add(iz1))).toVar()

  const gx0 = vec4(ixy0.mul(1.0 / 7.0)).toVar()
  const gy0 = vec4(fract(floor(gx0).mul(1.0 / 7.0)).sub(0.5)).toVar()
  gx0.assign(fract(gx0))
  const gz0 = vec4(vec4(0.5).sub(abs(gx0)).sub(abs(gy0))).toVar()
  const sz0 = vec4(step(gz0, vec4(0.0))).toVar()
  gx0.subAssign(sz0.mul(step(0.0, gx0).sub(0.5)))
  gy0.subAssign(sz0.mul(step(0.0, gy0).sub(0.5)))

  const gx1 = vec4(ixy1.mul(1.0 / 7.0)).toVar()
  const gy1 = vec4(fract(floor(gx1).mul(1.0 / 7.0)).sub(0.5)).toVar()
  gx1.assign(fract(gx1))
  const gz1 = vec4(vec4(0.5).sub(abs(gx1)).sub(abs(gy1))).toVar()
  const sz1 = vec4(step(gz1, vec4(0.0))).toVar()
  gx1.subAssign(sz1.mul(step(0.0, gx1).sub(0.5)))
  gy1.subAssign(sz1.mul(step(0.0, gy1).sub(0.5)))

  const g000 = vec3(gx0.x, gy0.x, gz0.x).toVar()
  const g100 = vec3(gx0.y, gy0.y, gz0.y).toVar()
  const g010 = vec3(gx0.z, gy0.z, gz0.z).toVar()
  const g110 = vec3(gx0.w, gy0.w, gz0.w).toVar()
  const g001 = vec3(gx1.x, gy1.x, gz1.x).toVar()
  const g101 = vec3(gx1.y, gy1.y, gz1.y).toVar()
  const g011 = vec3(gx1.z, gy1.z, gz1.z).toVar()
  const g111 = vec3(gx1.w, gy1.w, gz1.w).toVar()

  const norm0 = vec4(
    taylorInvSqrtVec4(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)))
  ).toVar()
  g000.mulAssign(norm0.x)
  g010.mulAssign(norm0.y)
  g100.mulAssign(norm0.z)
  g110.mulAssign(norm0.w)

  const norm1 = vec4(
    taylorInvSqrtVec4(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)))
  ).toVar()
  g001.mulAssign(norm1.x)
  g011.mulAssign(norm1.y)
  g101.mulAssign(norm1.z)
  g111.mulAssign(norm1.w)

  const n000 = float(dot(g000, Pf0)).toVar()
  const n100 = float(dot(g100, vec3(Pf1.x, Pf0.yz))).toVar()
  const n010 = float(dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z))).toVar()
  const n110 = float(dot(g110, vec3(Pf1.xy, Pf0.z))).toVar()
  const n001 = float(dot(g001, vec3(Pf0.xy, Pf1.z))).toVar()
  const n101 = float(dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z))).toVar()
  const n011 = float(dot(g011, vec3(Pf0.x, Pf1.yz))).toVar()
  const n111 = float(dot(g111, Pf1)).toVar()

  const fade_xyz = vec3(fade(Pf0)).toVar()
  const n_z = vec4(
    mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z)
  ).toVar()
  const n_yz = vec2(mix(n_z.xy, n_z.zw, fade_xyz.y)).toVar()
  const n_xyz = float(mix(n_yz.x, n_yz.y, fade_xyz.x)).toVar()

  return mul(2.2, n_xyz)
}

// ============================================
// 3D Curl Noise
// ============================================

/**
 * 3D curl noise using simplex noise
 * Produces divergence-free flow fields, useful for fluid-like motion
 */
export function curlNoise3d(inputA: TSLNode): TSLNode {
  // X
  const aXPos = simplexNoise3d(inputA.add(vec3(EPSILON, 0, 0)))
  const aXNeg = simplexNoise3d(inputA.sub(vec3(EPSILON, 0, 0)))
  const aXAverage = aXPos.sub(aXNeg).div(EPSILON.mul(2))

  // Y
  const aYPos = simplexNoise3d(inputA.add(vec3(0, EPSILON, 0)))
  const aYNeg = simplexNoise3d(inputA.sub(vec3(0, EPSILON, 0)))
  const aYAverage = aYPos.sub(aYNeg).div(EPSILON.mul(2))

  // Z
  const aZPos = simplexNoise3d(inputA.add(vec3(0, 0, EPSILON)))
  const aZNeg = simplexNoise3d(inputA.sub(vec3(0, 0, EPSILON)))
  const aZAverage = aZPos.sub(aZNeg).div(EPSILON.mul(2))

  const aGrabNoise = vec3(aXAverage, aYAverage, aZAverage).normalize()

  // Offset position for second noise read
  const inputB = inputA.add(3.5)

  // X
  const bXPos = simplexNoise3d(inputB.add(vec3(EPSILON, 0, 0)))
  const bXNeg = simplexNoise3d(inputB.sub(vec3(EPSILON, 0, 0)))
  const bXAverage = bXPos.sub(bXNeg).div(EPSILON.mul(2))

  // Y
  const bYPos = simplexNoise3d(inputB.add(vec3(0, EPSILON, 0)))
  const bYNeg = simplexNoise3d(inputB.sub(vec3(0, EPSILON, 0)))
  const bYAverage = bYPos.sub(bYNeg).div(EPSILON.mul(2))

  // Z
  const bZPos = simplexNoise3d(inputB.add(vec3(0, 0, EPSILON)))
  const bZNeg = simplexNoise3d(inputB.sub(vec3(0, 0, EPSILON)))
  const bZAverage = bZPos.sub(bZNeg).div(EPSILON.mul(2))

  const bGrabNoise = vec3(bXAverage, bYAverage, bZAverage).normalize()

  return cross(aGrabNoise, bGrabNoise).normalize()
}

// ============================================
// Ridged FBM
// ============================================

/**
 * Ridged FBM variant that creates sharp ridges
 * Good for mountain-like terrain or veins
 */
export function ridgedFbm2d(p: TSLNode, options: FBMOptions = {}): TSLNode {
  const { octaves = 5, lacunarity = 2.0, gain = 0.5, amplitude = 0.5, frequency = 1.0 } = options

  let value = float(0)
  let amp = float(amplitude)
  let freq = float(frequency)
  let maxValue = float(0)

  for (let i = 0; i < octaves; i++) {
    // Sample noise and create ridges by taking absolute value and inverting
    const noiseValue = simplexNoise2D(p.mul(freq))
    const ridgedValue = float(1.0).sub(abs(noiseValue))

    // Square the ridged value to make ridges sharper
    const sharpRidges = ridgedValue.mul(ridgedValue)

    value = value.add(sharpRidges.mul(amp))
    maxValue = maxValue.add(amp)

    amp = amp.mul(gain)
    freq = freq.mul(lacunarity)
  }

  return value.div(maxValue)
}

/**
 * Ridged FBM using 3D simplex noise
 */
export function ridgedFbm3d(p: TSLNode, options: FBMOptions = {}): TSLNode {
  const { octaves = 5, lacunarity = 2.0, gain = 0.5, amplitude = 0.5, frequency = 1.0 } = options

  let value = float(0)
  let amp = float(amplitude)
  let freq = float(frequency)
  let maxValue = float(0)

  for (let i = 0; i < octaves; i++) {
    const noiseValue = simplexNoise3d(p.mul(freq))
    const ridgedValue = float(1.0).sub(abs(noiseValue))
    const sharpRidges = ridgedValue.mul(ridgedValue)

    value = value.add(sharpRidges.mul(amp))
    maxValue = maxValue.add(amp)

    amp = amp.mul(gain)
    freq = freq.mul(lacunarity)
  }

  return value.div(maxValue)
}

// ============================================
// Warped FBM Coordinates
// ============================================

export interface WarpedFbmOptions {
  frequency?: number
  offset1?: number
  offset2?: number
  oscillation1?: number
  oscillation2?: number
  contribution1?: number
  contribution2?: number
}

/**
 * Warped FBM coordinates that uses FBM to warp the input coordinates
 * Creates organic flowing patterns
 */
export function warpedFbmCoords(
  uv0: TSLNode,
  time: TSLNode,
  options: WarpedFbmOptions = {}
): TSLNode {
  const {
    frequency = 25,
    offset1 = 25,
    offset2 = 75,
    oscillation1 = 10,
    oscillation2 = 3,
    contribution1 = 0.2,
    contribution2 = 0.1,
  } = options

  const _uv = uv0.toVar()

  // First layer of warping
  const warp1X = fbm3D(vec3(_uv.mul(oscillation1), time))
  const warp1Y = fbm3D(vec3(_uv.mul(oscillation1).add(offset1), time))
  const warp1 = vec2(warp1X, warp1Y).sub(0.5).mul(contribution1)
  const warpedUV1 = _uv.add(warp1)

  // Second layer of warping on the already warped coordinates
  const warp2X = fbm3D(vec3(warpedUV1.mul(oscillation2), time.mul(0.5)))
  const warp2Y = fbm3D(vec3(warpedUV1.mul(oscillation2).add(offset2), time.mul(0.5)))
  const warp2 = vec2(warp2X, warp2Y).sub(0.5).mul(contribution2)
  const finalUV = warpedUV1.add(warp2)

  // Sample final pattern with warped coordinates
  const n = simplexNoise3d(vec3(finalUV.mul(frequency), time))
  return n
}

// ============================================
// Turbulence Rotational (XorDev style)
// ============================================

export interface TurbulenceRotationalOptions {
  octaves?: number
  amplitude?: number
  speed?: number
  frequency?: number
  exponent?: number
}

/**
 * Rotational turbulence noise (XorDev style)
 * Creates flowing, rotational patterns different from standard turbulence
 */
export function turbulenceRotational(
  p: TSLNode,
  time: TSLNode,
  options: TurbulenceRotationalOptions = {}
): TSLNode {
  const { octaves = 10, amplitude = 0.7, speed = 0.3, frequency = 2.0, exponent = 1.4 } = options

  const pos = p.toVar()
  const freq = float(frequency).toVar()
  const spd = float(speed).toVar()
  const amp = float(amplitude).toVar()

  // Turbulence rotation matrix
  const rot = mat2(0.6, -0.8, 0.8, 0.6).toVar()

  // Loop through turbulence octaves
  Loop({ start: 0.0, end: octaves, type: 'float' }, ({ i }) => {
    // Scroll along the rotated y coordinate
    const phase = freq.mul(pos.mul(rot).y).add(spd.mul(time)).add(i)

    // Add a perpendicular sine wave offset
    pos.addAssign(amp.mul(rot[0]).mul(sin(phase)).div(freq))

    // Rotate for the next octave
    rot.mulAssign(mat2(0.6, -0.8, 0.8, 0.6))

    // Scale down for the next octave
    freq.mulAssign(exponent)
  })

  return pos
}

// ============================================
// FBM using 3D Simplex (normalized)
// ============================================

/**
 * FBM using 3D simplex noise with normalization
 * Returns values in [-1, 1] range
 */
export function fbm3dSimplex(p: TSLNode, options: FBMOptions = {}): TSLNode {
  const { octaves = 4, lacunarity = 2.0, gain = 0.5, amplitude = 1.0, frequency = 1.0 } = options

  let value = float(0)
  let amp = float(amplitude)
  let freq = float(frequency)
  let maxValue = float(0)

  for (let i = 0; i < octaves; i++) {
    value = value.add(simplexNoise3d(p.mul(freq)).mul(amp))
    maxValue = maxValue.add(amp)
    freq = freq.mul(lacunarity)
    amp = amp.mul(gain)
  }

  return value.div(maxValue)
}
