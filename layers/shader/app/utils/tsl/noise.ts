import { abs, dot, float, floor, Fn, fract, max, mix, mod, vec2, vec3, vec4 } from 'three/tsl'
import type { FBMOptions, TSLNode } from '../../types'

/**
 * Hash function for noise generation
 */
const hash21 = Fn(([p]: [TSLNode]) => {
  const p3 = fract(p.mul(vec2(443.8975, 397.2973)))
  const shifted = p3.add(dot(p3, p3.add(19.19)))
  return fract(shifted.x.mul(shifted.y))
})

const hash22 = Fn(([p]: [TSLNode]) => {
  const p3 = fract(p.mul(vec2(443.8975, 397.2973)))
  const shifted = p3.add(dot(p3, p3.yx.add(19.19)))
  return fract(vec2(shifted.x.mul(shifted.y), shifted.y.mul(shifted.x)))
})

const hash31 = Fn(([p]: [TSLNode]) => {
  const p3 = fract(p.mul(vec3(443.8975, 397.2973, 491.1871)))
  const shifted = p3.add(dot(p3, p3.yzx.add(19.19)))
  return fract(shifted.x.mul(shifted.y).mul(shifted.z))
})

/**
 * 2D Simplex noise
 */
export const simplexNoise2D = Fn(([uv]: [TSLNode]) => {
  const C = vec4(
    0.211324865405187, // (3.0-sqrt(3.0))/6.0
    0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439 // 1.0 / 41.0
  )

  // First corner
  const i = floor(uv.add(dot(uv, C.yy)))
  const x0 = uv.sub(i).add(dot(i, C.xx))

  // Other corners
  const i1 = x0.x.greaterThan(x0.y).select(vec2(1.0, 0.0), vec2(0.0, 1.0))
  const x1 = x0.sub(i1).add(C.xx)
  const x2 = x0.add(C.zz)

  // Permutations
  const iMod = mod(i, 289.0)
  const p = mod(
    mod(iMod.y.add(vec3(0.0, i1.y, 1.0)), 289.0)
      .mul(34.0)
      .add(1.0)
      .mul(mod(iMod.y.add(vec3(0.0, i1.y, 1.0)), 289.0))
      .add(iMod.x)
      .add(vec3(0.0, i1.x, 1.0)),
    289.0
  )
    .mul(34.0)
    .add(1.0)
    .mul(
      mod(
        mod(iMod.y.add(vec3(0.0, i1.y, 1.0)), 289.0)
          .mul(34.0)
          .add(1.0)
          .mul(mod(iMod.y.add(vec3(0.0, i1.y, 1.0)), 289.0))
          .add(iMod.x)
          .add(vec3(0.0, i1.x, 1.0)),
        289.0
      )
    )

  // Gradients
  const m = max(float(0.5).sub(vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2))), 0.0)
  const m2 = m.mul(m)
  const m4 = m2.mul(m2)

  const x = fract(p.mul(C.w)).mul(2.0).sub(1.0)
  const h = abs(x).sub(0.5)
  const ox = floor(x.add(0.5))
  const a0 = x.sub(ox)

  // Normalize gradients
  const norm = float(1.79284291400159).sub(float(0.85373472095314).mul(a0.mul(a0).add(h.mul(h))))

  const g0 = vec2(a0.x, h.x).mul(norm.x)
  const g1 = vec2(a0.y, h.y).mul(norm.y)
  const g2 = vec2(a0.z, h.z).mul(norm.z)

  const px = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2))

  return float(130.0).mul(dot(m4, px))
})

/**
 * 3D Perlin noise
 */
export const perlinNoise3D = Fn(([position]: [TSLNode]) => {
  const Pi = floor(position)
  const Pf = fract(position)

  // Quintic interpolation
  const u = Pf.mul(Pf)
    .mul(Pf)
    .mul(Pf.mul(Pf.mul(6.0).sub(15.0)).add(10.0))

  // Hash corners
  const n000 = hash31(Pi)
  const n001 = hash31(Pi.add(vec3(0, 0, 1)))
  const n010 = hash31(Pi.add(vec3(0, 1, 0)))
  const n011 = hash31(Pi.add(vec3(0, 1, 1)))
  const n100 = hash31(Pi.add(vec3(1, 0, 0)))
  const n101 = hash31(Pi.add(vec3(1, 0, 1)))
  const n110 = hash31(Pi.add(vec3(1, 1, 0)))
  const n111 = hash31(Pi.add(vec3(1, 1, 1)))

  // Trilinear interpolation
  const x0 = mix(n000, n100, u.x)
  const x1 = mix(n010, n110, u.x)
  const x2 = mix(n001, n101, u.x)
  const x3 = mix(n011, n111, u.x)

  const y0 = mix(x0, x1, u.y)
  const y1 = mix(x2, x3, u.y)

  return mix(y0, y1, u.z).mul(2.0).sub(1.0)
})

/**
 * Voronoi cellular noise
 */
export const voronoiNoise = Fn(([uv, scale]: [TSLNode, TSLNode]) => {
  const scaledUV = uv.mul(scale)
  const i = floor(scaledUV)
  const f = fract(scaledUV)

  let minDist: TSLNode = float(8.0)
  let cellCenter: TSLNode = vec2(0.0)

  // Check 3x3 neighborhood
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      const neighbor = vec2(x, y)
      const point = hash22(i.add(neighbor))
      const diff = neighbor.add(point).sub(f)
      const dist = dot(diff, diff)

      const isCloser = dist.lessThan(minDist)
      minDist = isCloser.select(dist, minDist)
      cellCenter = isCloser.select(i.add(neighbor).add(point).div(scale), cellCenter)
    }
  }

  return vec4(minDist.sqrt(), cellCenter.x, cellCenter.y, float(0.0))
})

/**
 * Fractal Brownian Motion
 */
export const fbm = Fn(([position, options]: [TSLNode, FBMOptions]) => {
  const { octaves = 6, lacunarity = 2.0, gain = 0.5, amplitude = 0.5, frequency = 1.0 } = options

  let value: TSLNode = float(0.0)
  let amp: TSLNode = float(amplitude)
  let freq: TSLNode = float(frequency)

  for (let i = 0; i < octaves; i++) {
    const pos3 = position.toVec3().mul(freq)
    value = value.add(perlinNoise3D(pos3).mul(amp))
    freq = freq.mul(lacunarity)
    amp = amp.mul(gain)
  }

  return value
})

/**
 * 3D Curl noise for fluid motion
 */
export const curlNoise3D = Fn(([position]: [TSLNode]) => {
  const eps = 0.0001

  const dx = vec3(eps, 0, 0)
  const dy = vec3(0, eps, 0)
  const dz = vec3(0, 0, eps)

  // Compute derivatives
  const px = perlinNoise3D(position.add(dx)).sub(perlinNoise3D(position.sub(dx)))
  const py = perlinNoise3D(position.add(dy)).sub(perlinNoise3D(position.sub(dy)))
  const pz = perlinNoise3D(position.add(dz)).sub(perlinNoise3D(position.sub(dz)))

  // Curl = nabla x F
  const curlX = py.sub(pz)
  const curlY = pz.sub(px)
  const curlZ = px.sub(py)

  return vec3(curlX, curlY, curlZ).div(eps * 2.0)
})
