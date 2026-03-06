// @ts-nocheck - TSL types are complex
import { DoubleSide } from 'three'
import {
  abs,
  add,
  exp,
  float,
  Fn,
  length,
  mix,
  mul,
  pow,
  sign,
  sin,
  smoothstep,
  sub,
  time,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import {
  simplexNoise2D,
  simplexNoise3d,
  fbm2D,
  fbm3dSimplex,
  ridgedFbm2d,
  voronoi2D,
} from '../shaders/common/noise'
import { cosinePalette } from '../shaders/common/palette'

// ============================================
// Types
// ============================================

export interface AmbientMaterialOptions {
  speed?: number
  intensity?: number
  colors?: string[]
  mouseInteraction?: boolean
}

export interface AmbientUniforms {
  speed: any
  intensity: any
  mouseX: any
  mouseY: any
  mouseStrength: any
}

export interface AmbientMaterialResult {
  material: MeshBasicNodeMaterial
  uniforms: AmbientUniforms
}

export interface AmbientNodeResult {
  colorNode: any
  uniforms: AmbientUniforms
}

// ============================================
// Uniform Creators
// ============================================

export function createAmbientUniforms(options: AmbientMaterialOptions = {}): AmbientUniforms {
  const { speed = 1.0, intensity = 1.0, mouseInteraction = true } = options
  return {
    speed: uniform(speed),
    intensity: uniform(intensity),
    mouseX: uniform(0.5),
    mouseY: uniform(0.5),
    mouseStrength: uniform(mouseInteraction ? 0.5 : 0),
  }
}

// ============================================
// Color Node Creators (TSL node, no material)
// ============================================

export function createAuroraColorNode(uniforms: AmbientUniforms): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.2)
    const uvCoord = uv()

    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength),
      mul(sub(uMouseY, 0.5), uMouseStrength)
    )

    const curtainCoord = add(
      vec2(mul(uvCoord.x, 3.0), mul(uvCoord.y, 0.5)),
      vec2(t, mul(t, 0.3)),
      mouseOffset
    )

    const curtain1 = simplexNoise2D(curtainCoord).mul(0.5).add(0.5)
    const curtain2 = simplexNoise2D(add(mul(curtainCoord, 1.5), vec2(mul(t, -0.2), 5.0))).mul(0.5).add(0.5)
    const curtain3 = simplexNoise2D(add(mul(curtainCoord, 0.7), vec2(mul(t, 0.4), 12.0))).mul(0.5).add(0.5)
    const detail = fbm2D(curtainCoord, { octaves: 4, frequency: 2.0 }).mul(0.5).add(0.5)
    const curtain = mul(add(mul(curtain1, 0.4), mul(curtain2, 0.25), mul(curtain3, 0.2), mul(detail, 0.15)), 1.0)

    const fade = mul(pow(sub(1.0, uvCoord.y), 1.2), smoothstep(0.0, 0.3, uvCoord.y))
    const aurora = mul(smoothstep(0.2, 0.8, mul(curtain, fade)), uIntensity)

    const shimmer = simplexNoise2D(add(mul(curtainCoord, 8.0), mul(t, 3.0))).mul(0.5).add(0.5)
    const shimmerMask = mul(shimmer, aurora, 0.15)

    const colorDriver = add(mul(curtain2, 0.6), mul(curtain3, 0.4))
    const auroraColor = cosinePalette(
      colorDriver,
      [0.15, 0.6, 0.45],
      [0.25, 0.4, 0.35],
      [1.0, 1.0, 0.8],
      [0.0, 0.33, 0.5]
    )

    const skyColor = vec3(0.02, 0.02, 0.06)
    return add(mix(skyColor, auroraColor, aurora), shimmerMask)
  })()
}

export function createNebulaColorNode(uniforms: AmbientUniforms): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.15)
    const uvCoord = sub(uv(), 0.5)

    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength),
      mul(sub(uMouseY, 0.5), uMouseStrength)
    )
    const adjustedUV = add(uvCoord, mouseOffset)

    const cloud1 = fbm3dSimplex(vec3(mul(adjustedUV, 2.0), t), { octaves: 5 }).mul(0.5).add(0.5)
    const cloud2 = fbm3dSimplex(vec3(mul(adjustedUV, 3.0), add(mul(t, -0.3), 10.0)), { octaves: 4 }).mul(0.5).add(0.5)
    const filaments = ridgedFbm2d(add(adjustedUV, vec2(mul(t, 0.1), mul(t, -0.05))), { octaves: 5, frequency: 3.0 })
    const { distance: starDist } = voronoi2D(adjustedUV, 20.0)
    const stars = pow(smoothstep(0.15, 0.0, starDist), 3.0)
    const dust = simplexNoise2D(add(mul(adjustedUV, 12.0), mul(t, 0.5))).mul(0.5).add(0.5)

    const colorDriver = add(mul(cloud1, 0.5), mul(filaments, 0.3), mul(cloud2, 0.2))
    const nebulaColor = cosinePalette(
      colorDriver,
      [0.5, 0.3, 0.45],
      [0.5, 0.35, 0.4],
      [1.0, 0.8, 1.0],
      [0.0, 0.6, 0.35]
    )

    const deepSpace = vec3(0.08, 0.03, 0.14)

    let colorNode = mix(deepSpace, nebulaColor, mul(cloud1, 0.7))
    colorNode = add(colorNode, mul(nebulaColor, mul(filaments, 0.3)))
    colorNode = mix(colorNode, mul(nebulaColor, 1.2), mul(cloud2, 0.3))
    colorNode = add(colorNode, mul(vec3(0.15, 0.1, 0.2), mul(dust, 0.15)))
    colorNode = add(colorNode, mul(vec3(1.0, 0.98, 0.92), stars))

    const dist = length(uvCoord)
    const glow = mul(exp(mul(dist, -3.0)), 0.5)
    const glowColor = cosinePalette(
      float(0.3),
      [0.6, 0.3, 0.5],
      [0.3, 0.2, 0.3],
      [1.0, 1.0, 1.0],
      [0.0, 0.5, 0.3]
    )
    colorNode = add(colorNode, mul(glowColor, glow))
    colorNode = mul(colorNode, sub(1.0, mul(dist, 0.5)), uIntensity)

    return colorNode
  })()
}

export function createFlowColorNode(uniforms: AmbientUniforms): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.15)
    const uvCoord = uv()

    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength, 0.3),
      mul(sub(uMouseY, 0.5), uMouseStrength, 0.3)
    )

    const warpCoarse1 = simplexNoise2D(add(mul(uvCoord, 1.5), t))
    const warpCoarse2 = simplexNoise2D(add(mul(uvCoord, 1.5), mul(t, -0.5), 7.0))
    const warpedUV1 = add(uvCoord, mul(vec2(warpCoarse1, warpCoarse2), 0.25), mouseOffset)

    const warpMed1 = simplexNoise2D(add(mul(warpedUV1, 3.0), mul(t, 0.7)))
    const warpMed2 = simplexNoise2D(add(mul(warpedUV1, 3.0), mul(t, -0.3), 15.0))
    const warpedUV2 = add(warpedUV1, mul(vec2(warpMed1, warpMed2), 0.12))

    const warpFine1 = simplexNoise2D(add(mul(warpedUV2, 5.0), mul(t, 1.2)))
    const warpFine2 = simplexNoise2D(add(mul(warpedUV2, 5.0), mul(t, -0.8), 25.0))
    const warpedUV = add(warpedUV2, mul(vec2(warpFine1, warpFine2), 0.05))

    const n1 = fbm2D(warpedUV, { octaves: 5, frequency: 2.0 }).mul(0.5).add(0.5)
    const n2 = ridgedFbm2d(warpedUV, { octaves: 4, frequency: 1.5 })

    const color1 = vec3(0.075, 0.306, 0.369)
    const color2 = vec3(0.443, 0.698, 0.502)
    const color3 = vec3(0.91, 0.835, 0.718)
    const color4 = vec3(0.988, 0.361, 0.49)

    let colorNode = mix(color1, color2, n1)
    colorNode = mix(colorNode, color3, mul(n2, 0.5))

    const iridescence = cosinePalette(
      add(mul(n1, 0.6), mul(n2, 0.4)),
      [0.5, 0.5, 0.5],
      [0.3, 0.3, 0.3],
      [1.0, 1.0, 1.0],
      [0.0, 0.1, 0.2]
    )
    colorNode = mix(colorNode, iridescence, 0.3)
    colorNode = mix(colorNode, color4, mul(smoothstep(0.6, 0.9, n2), 0.25))

    const brightness = add(0.85, mul(0.15, sin(add(mul(n1, 6.28), t))))
    colorNode = mul(colorNode, brightness, uIntensity)

    const dist = length(sub(uvCoord, 0.5))
    colorNode = mul(colorNode, sub(1.0, mul(dist, 0.3)))

    return colorNode
  })()
}

export function createGradientMeshColorNode(uniforms: AmbientUniforms): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.2)
    const uvCoord = uv()

    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength, 0.1),
      mul(sub(uMouseY, 0.5), uMouseStrength, 0.1)
    )
    const adjustedUV = add(uvCoord, mouseOffset)

    const p1 = vec2(add(0.2, mul(sin(mul(t, 0.5)), 0.15)), add(0.3, mul(sin(add(mul(t, 0.4), 1.57)), 0.15)))
    const p2 = vec2(add(0.8, mul(sin(add(mul(t, 0.6), 1.57)), 0.1)), add(0.2, mul(sin(mul(t, 0.5)), 0.1)))
    const p3 = vec2(add(0.3, mul(sin(mul(t, 0.7)), 0.15)), add(0.8, mul(sin(add(mul(t, 0.3), 1.57)), 0.1)))
    const p4 = vec2(add(0.7, mul(sin(add(mul(t, 0.4), 1.57)), 0.15)), add(0.7, mul(sin(mul(t, 0.6)), 0.15)))

    const noiseModulate1 = simplexNoise2D(add(mul(adjustedUV, 3.0), mul(t, 0.3))).mul(0.5).add(0.5)
    const noiseModulate2 = simplexNoise2D(add(mul(adjustedUV, 4.5), mul(t, -0.2), 8.0)).mul(0.5).add(0.5)
    const fbmModulate = fbm2D(add(adjustedUV, mul(t, 0.1)), { octaves: 3, frequency: 2.0 }).mul(0.5).add(0.5)
    const detailNoise = simplexNoise2D(add(mul(adjustedUV, 7.0), mul(t, 0.5))).mul(0.5).add(0.5)

    const d1 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p1)))), add(0.7, mul(noiseModulate1, 0.3)))
    const d2 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p2)))), add(0.7, mul(noiseModulate2, 0.3)))
    const d3 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p3)))), add(0.7, mul(fbmModulate, 0.3)))
    const d4 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p4)))), add(0.7, mul(detailNoise, 0.3)))

    const color1 = vec3(0.4, 0.494, 0.918)
    const color2 = vec3(0.463, 0.294, 0.635)
    const color3 = vec3(0.941, 0.576, 0.984)
    const color4 = vec3(0.961, 0.341, 0.424)

    let colorNode = mul(color1, d1)
    colorNode = add(colorNode, mul(color2, d2))
    colorNode = add(colorNode, mul(color3, d3))
    colorNode = add(colorNode, mul(color4, d4))

    const totalWeight = add(d1, d2, d3, d4, 0.01)
    colorNode = mul(colorNode, uIntensity).div(totalWeight)

    const dist = length(sub(uvCoord, 0.5))
    colorNode = mul(colorNode, sub(1.0, mul(dist, 0.25)))

    return colorNode
  })()
}

export interface ThemeColorUniforms {
  color1: any   // TSL uniform node wrapping a THREE.Color
  color2: any
  color3: any
  color4: any
}

export function createThemeGradientColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity,
          mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.2)
    const uvCoord = uv()

    // Gentle UV shift for p2-p4 area
    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength, 0.05),
      mul(sub(uMouseY, 0.5), uMouseStrength, 0.05),
    )
    const adjustedUV = add(uvCoord, mouseOffset)

    // p1 attracted toward mouse cursor
    const p1Base = vec2(add(0.2, mul(sin(mul(t, 0.5)), 0.15)), add(0.3, mul(sin(add(mul(t, 0.4), 1.57)), 0.15)))
    const mousePos = vec2(uMouseX, uMouseY)
    const p1 = mix(p1Base, mousePos, mul(uMouseStrength, 0.5))

    const p2 = vec2(add(0.8, mul(sin(add(mul(t, 0.6), 1.57)), 0.1)), add(0.2, mul(sin(mul(t, 0.5)), 0.1)))
    const p3 = vec2(add(0.3, mul(sin(mul(t, 0.7)), 0.15)),           add(0.8, mul(sin(add(mul(t, 0.3), 1.57)), 0.1)))
    const p4 = vec2(add(0.7, mul(sin(add(mul(t, 0.4), 1.57)), 0.15)), add(0.7, mul(sin(mul(t, 0.6)), 0.15)))

    const nm1 = simplexNoise2D(add(mul(adjustedUV, 3.0), mul(t, 0.3))).mul(0.5).add(0.5)
    const nm2 = simplexNoise2D(add(mul(adjustedUV, 4.5), mul(t, -0.2), 8.0)).mul(0.5).add(0.5)
    const nm3 = fbm2D(add(adjustedUV, mul(t, 0.1)), { octaves: 3, frequency: 2.0 }).mul(0.5).add(0.5)
    const nm4 = simplexNoise2D(add(mul(adjustedUV, 7.0), mul(t, 0.5))).mul(0.5).add(0.5)

    const d1 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p1)))), add(0.7, mul(nm1, 0.3)))
    const d2 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p2)))), add(0.7, mul(nm2, 0.3)))
    const d3 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p3)))), add(0.7, mul(nm3, 0.3)))
    const d4 = mul(sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p4)))), add(0.7, mul(nm4, 0.3)))

    let colorNode = mul(colors.color1, d1)
    colorNode = add(colorNode, mul(colors.color2, d2))
    colorNode = add(colorNode, mul(colors.color3, d3))
    colorNode = add(colorNode, mul(colors.color4, d4))

    // Normalise first, then vignette, then intensity
    const totalWeight = add(d1, d2, d3, d4, 0.01)
    colorNode = colorNode.div(totalWeight)

    const dist = length(sub(uvCoord, 0.5))
    colorNode = mul(colorNode, sub(1.0, mul(dist, 0.25)))
    colorNode = mul(colorNode, uIntensity)

    return colorNode
  })()
}

export function createThemeFlowColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.15)
    const uvCoord = uv()

    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength, 0.3),
      mul(sub(uMouseY, 0.5), uMouseStrength, 0.3),
    )

    const warpCoarse1 = simplexNoise2D(add(mul(uvCoord, 1.5), t))
    const warpCoarse2 = simplexNoise2D(add(mul(uvCoord, 1.5), mul(t, -0.5), 7.0))
    const warpedUV1 = add(uvCoord, mul(vec2(warpCoarse1, warpCoarse2), 0.25), mouseOffset)

    const warpMed1 = simplexNoise2D(add(mul(warpedUV1, 3.0), mul(t, 0.7)))
    const warpMed2 = simplexNoise2D(add(mul(warpedUV1, 3.0), mul(t, -0.3), 15.0))
    const warpedUV2 = add(warpedUV1, mul(vec2(warpMed1, warpMed2), 0.12))

    const warpFine1 = simplexNoise2D(add(mul(warpedUV2, 5.0), mul(t, 1.2)))
    const warpFine2 = simplexNoise2D(add(mul(warpedUV2, 5.0), mul(t, -0.8), 25.0))
    const warpedUV = add(warpedUV2, mul(vec2(warpFine1, warpFine2), 0.05))

    const n1 = fbm2D(warpedUV, { octaves: 5, frequency: 2.0 }).mul(0.5).add(0.5)
    const n2 = ridgedFbm2d(warpedUV, { octaves: 4, frequency: 1.5 })

    let colorNode = mix(colors.color1, colors.color2, n1)
    colorNode = mix(colorNode, colors.color3, mul(n2, 0.5))

    const iridescence = mix(colors.color3, colors.color4, add(mul(n1, 0.6), mul(n2, 0.4)))
    colorNode = mix(colorNode, iridescence, 0.3)
    colorNode = mix(colorNode, colors.color4, mul(smoothstep(0.6, 0.9, n2), 0.25))

    const brightness = add(0.85, mul(0.15, sin(add(mul(n1, 6.28), t))))
    colorNode = mul(colorNode, brightness, uIntensity)

    const dist = length(sub(uvCoord, 0.5))
    colorNode = mul(colorNode, sub(1.0, mul(dist, 0.3)))

    return colorNode
  })()
}

export function createThemeAuroraColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.2)
    const uvCoord = uv()

    const mouseOffset = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength),
      mul(sub(uMouseY, 0.5), uMouseStrength),
    )

    const curtainCoord = add(
      vec2(mul(uvCoord.x, 3.0), mul(uvCoord.y, 0.5)),
      vec2(t, mul(t, 0.3)),
      mouseOffset,
    )

    const curtain1 = simplexNoise2D(curtainCoord).mul(0.5).add(0.5)
    const curtain2 = simplexNoise2D(add(mul(curtainCoord, 1.5), vec2(mul(t, -0.2), 5.0))).mul(0.5).add(0.5)
    const curtain3 = simplexNoise2D(add(mul(curtainCoord, 0.7), vec2(mul(t, 0.4), 12.0))).mul(0.5).add(0.5)
    const detail = fbm2D(curtainCoord, { octaves: 4, frequency: 2.0 }).mul(0.5).add(0.5)
    const curtain = mul(add(mul(curtain1, 0.4), mul(curtain2, 0.25), mul(curtain3, 0.2), mul(detail, 0.15)), 1.0)

    const fade = mul(pow(sub(1.0, uvCoord.y), 1.2), smoothstep(0.0, 0.3, uvCoord.y))
    const aurora = mul(smoothstep(0.2, 0.8, mul(curtain, fade)), uIntensity)

    const shimmer = simplexNoise2D(add(mul(curtainCoord, 8.0), mul(t, 3.0))).mul(0.5).add(0.5)

    const colorDriver = add(mul(curtain2, 0.6), mul(curtain3, 0.4))
    const auroraColor = mix(colors.color1, colors.color2, colorDriver)

    const skyColor = mul(colors.color1, 0.04)
    const shimmerColor = mul(colors.color3, mul(shimmer, mul(aurora, 0.15)))

    return add(mix(skyColor, auroraColor, aurora), shimmerColor)
  })()
}

export function createThemeWaveColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.1)
    const mouseOff = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength),
      mul(sub(uMouseY, 0.5), uMouseStrength),
    )
    const uvCoord = add(sub(uv(), 0.5), mouseOff)

    // Noise-driven rotation
    const degree = simplexNoise2D(vec2(t, uvCoord.x.mul(uvCoord.y))).mul(0.5).add(0.5)
    const angle = degree.sub(0.5).mul(720.0 * Math.PI / 180.0).add(Math.PI)
    const cosA = angle.cos()
    const sinA = angle.sin()
    const rx = uvCoord.x.mul(cosA).sub(uvCoord.y.mul(sinA))
    const ry = uvCoord.x.mul(sinA).add(uvCoord.y.mul(cosA))

    // Wave warp (order matters: warped x feeds into y)
    const waveSpeed = mul(time, uSpeed, 2.0)
    const wx = rx.add(sin(ry.mul(5.0).add(waveSpeed)).div(30.0))
    const wy = ry.add(sin(wx.mul(7.5).add(waveSpeed)).div(15.0))

    // -5° rotation for layer blend
    const COS5 = Math.cos(-5 * Math.PI / 180)
    const SIN5 = Math.sin(-5 * Math.PI / 180)
    const rotated5x = wx.mul(COS5).sub(wy.mul(SIN5))

    const layer1 = mix(colors.color1, colors.color2, smoothstep(-0.3, 0.2, rotated5x))
    const layer2 = mix(colors.color3, colors.color4, smoothstep(-0.3, 0.2, rotated5x))

    return mix(layer1, layer2, smoothstep(0.5, -0.3, wy)).mul(uIntensity)
  })()
}

export function createThemeLavaLampColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.2)
    const mouseOff = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength),
      mul(sub(uMouseY, 0.5), uMouseStrength),
    )
    const uvCoord = add(sub(uv(), 0.5), mouseOff)

    // 4 blobs anchored to quadrants, oscillation wide enough to cross center and intersect
    const b1 = vec2(sin(mul(t, 0.9)).mul(0.22).sub(0.20), sin(mul(t, 0.7)).mul(0.22).sub(0.18))
    const b2 = vec2(sin(mul(t, 0.8).add(2.1)).mul(0.22).add(0.20), sin(mul(t, 1.0).add(1.5)).mul(0.22).sub(0.18))
    const b3 = vec2(sin(mul(t, 0.6).add(4.2)).mul(0.22).sub(0.20), sin(mul(t, 0.9).add(3.1)).mul(0.22).add(0.18))
    const b4 = vec2(sin(mul(t, 1.1).add(1.0)).mul(0.22).add(0.20), sin(mul(t, 0.5).add(2.8)).mul(0.22).add(0.18))

    // Per-blob breathing k: oscillates between -3.5 (large) and -6.5 (tight)
    const k1 = sin(mul(t, 0.4)).mul(1.5).sub(5.0)
    const k2 = sin(add(mul(t, 0.35), 2.1)).mul(1.5).sub(5.0)
    const k3 = sin(add(mul(t, 0.45), 4.2)).mul(1.5).sub(5.0)
    const k4 = sin(add(mul(t, 0.3), 1.0)).mul(1.5).sub(5.0)

    const w1 = exp(length(sub(uvCoord, b1)).mul(k1))
    const w2 = exp(length(sub(uvCoord, b2)).mul(k2))
    const w3 = exp(length(sub(uvCoord, b3)).mul(k3))
    const w4 = exp(length(sub(uvCoord, b4)).mul(k4))
    const wTotal = add(w1, w2, w3, w4)

    // Weighted colour blend
    const colorNode = add(
      mul(colors.color1, w1),
      mul(colors.color2, w2),
      mul(colors.color3, w3),
      mul(colors.color4, w4),
    ).div(wTotal.add(0.001))

    // Darken space between blobs
    const blobStrength = smoothstep(0.05, 0.9, wTotal)
    const bg = mul(mix(colors.color1, colors.color2, 0.3), 0.15)
    return mix(bg, colorNode, blobStrength).mul(uIntensity)
  })()
}

export function createThemeBubbleColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.06)
    const mouseOff = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength),
      mul(sub(uMouseY, 0.5), uMouseStrength),
    )
    const uvCoord = add(uv(), mouseOff)

    const n1 = simplexNoise3d(vec3(uvCoord.x.mul(1.5), uvCoord.y.mul(1.5), t)).mul(0.5).add(0.5)
    const n2 = simplexNoise3d(vec3(
      uvCoord.x.mul(2.5).add(1.3), uvCoord.y.mul(2.5).add(0.7), t.mul(0.8),
    )).mul(0.5).add(0.5)

    const blend1 = mix(colors.color1, colors.color2, smoothstep(0.3, 0.7, n1))
    const blend2 = mix(colors.color3, colors.color4, smoothstep(0.3, 0.7, n2))
    return mix(blend1, blend2, smoothstep(0.35, 0.65, n2)).mul(uIntensity)
  })()
}

export function createThemePlasmaColorNode(
  uniforms: AmbientUniforms,
  colors: ThemeColorUniforms,
): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.03)
    const mouseOff = vec2(
      mul(sub(uMouseX, 0.5), uMouseStrength, 0.2),
      mul(sub(uMouseY, 0.5), uMouseStrength, 0.2),
    )
    const uvMut = add(sub(uv(), 0.5).mul(1.2), mouseOff).toVar()

    const h = simplexNoise3d(vec3(uvMut.x.mul(2.0), uvMut.y.mul(2.0), t)).toVar()

    // Unrolled distortion loop (n = 1..4)
    for (let n = 1; n < 5; n++) {
      const i = float(n)
      uvMut.subAssign(vec2(
        float(0.7).div(i).mul(sin(i.mul(uvMut.y).add(i).add(t.mul(1.5)).add(h.mul(i)))),
        float(0.4).div(i).mul(sin(uvMut.x.add(4.0).sub(i).add(h).add(t.mul(1.5)).add(i.mul(0.3)))),
      ))
    }

    // Final UV shift
    uvMut.subAssign(vec2(
      float(1.2).mul(sin(uvMut.x.add(t).add(h))),
      float(0.4).mul(sin(uvMut.y.add(t).add(h.mul(0.3)))),
    ))

    const cx = sin(uvMut.x.mul(2.0)).mul(0.5).add(0.5)
    const cxy = sin(uvMut.x.add(uvMut.y).mul(1.5)).mul(0.5).add(0.5)
    const cy = sin(uvMut.y.mul(2.0)).mul(0.5).add(0.5)

    const t12 = mix(colors.color1, colors.color2, cx)
    const t34 = mix(colors.color3, colors.color4, cy)
    const vivid = mix(t12, t34, cxy)
    // Mix against near-black base so black/gray reads through between colour bands
    return mix(vec3(0.03, 0.03, 0.03), vivid, float(0.65)).mul(uIntensity)
  })()
}

export function createOceanColorNode(uniforms: AmbientUniforms): any {
  const { speed: uSpeed, intensity: uIntensity, mouseX: uMouseX, mouseY: uMouseY, mouseStrength: uMouseStrength } = uniforms

  return Fn(() => {
    const t = mul(time, uSpeed, 0.3)
    const uvCoord = uv()

    const mousePos = vec2(uMouseX, uMouseY)
    const mouseDist = length(sub(uvCoord, mousePos))

    const ripple = mul(
      sin(sub(mul(mouseDist, 25.0), mul(t, 4.0))),
      exp(mul(mouseDist, -4.0)),
      uMouseStrength
    )

    const wave1 = mul(sin(add(mul(uvCoord.x, 8.0), t, mul(ripple, 2.0))), 0.5).add(0.5)
    const wave2 = mul(sin(add(sub(mul(uvCoord.x, 12.0), mul(t, 0.7)), mul(uvCoord.y, 3.0))), 0.5).add(0.5)
    const waveNoise = simplexNoise2D(add(mul(uvCoord, vec2(4.0, 2.0)), vec2(t, mul(t, 0.3)))).mul(0.5).add(0.5)

    const caustic1 = simplexNoise2D(add(mul(uvCoord, 8.0), mul(t, 0.4))).mul(0.5).add(0.5)
    const caustic2 = simplexNoise2D(add(mul(uvCoord, 12.0), mul(t, -0.3), 5.0)).mul(0.5).add(0.5)
    const caustics = pow(mul(caustic1, caustic2), 2.0)

    const depth = add(mul(uvCoord.y, 0.5), 0.3)

    const deepBlue = vec3(0.039, 0.086, 0.157)
    const midBlue = vec3(0.118, 0.227, 0.373)
    const lightBlue = vec3(0.494, 0.784, 0.89)

    let colorNode = mix(deepBlue, midBlue, depth)
    colorNode = mix(colorNode, lightBlue, mul(caustics, 0.4, uIntensity))
    colorNode = add(colorNode, mul(vec3(0.05, 0.1, 0.15), mul(waveNoise, 0.3)))

    const foam = smoothstep(0.7, 0.9, mul(wave1, wave2))
    colorNode = add(colorNode, mul(vec3(1.0, 1.0, 1.0), foam, 0.2))

    const shimmer = mul(
      simplexNoise2D(add(mul(uvCoord, 25.0), mul(t, 1.5))).mul(0.5).add(0.5),
      0.05,
      uIntensity
    )
    colorNode = add(colorNode, shimmer)

    const dist = length(sub(uvCoord, 0.5))
    colorNode = mul(colorNode, sub(1.0, mul(dist, 0.4)))

    return colorNode
  })()
}

// ============================================
// Material Creators (backward-compat wrappers)
// ============================================

export function createAuroraMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const uniforms = createAmbientUniforms(options)
  const colorNode = createAuroraColorNode(uniforms)
  const mat = new MeshBasicNodeMaterial()
  mat.colorNode = colorNode
  mat.side = DoubleSide
  return { material: mat, uniforms }
}

export function createNebulaMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const uniforms = createAmbientUniforms(options)
  const colorNode = createNebulaColorNode(uniforms)
  const mat = new MeshBasicNodeMaterial()
  mat.colorNode = colorNode
  mat.side = DoubleSide
  return { material: mat, uniforms }
}

export function createFlowMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const uniforms = createAmbientUniforms(options)
  const colorNode = createFlowColorNode(uniforms)
  const mat = new MeshBasicNodeMaterial()
  mat.colorNode = colorNode
  mat.side = DoubleSide
  return { material: mat, uniforms }
}

export function createGradientMeshMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const uniforms = createAmbientUniforms(options)
  const colorNode = createGradientMeshColorNode(uniforms)
  const mat = new MeshBasicNodeMaterial()
  mat.colorNode = colorNode
  mat.side = DoubleSide
  return { material: mat, uniforms }
}

export function createOceanMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const uniforms = createAmbientUniforms(options)
  const colorNode = createOceanColorNode(uniforms)
  const mat = new MeshBasicNodeMaterial()
  mat.colorNode = colorNode
  mat.side = DoubleSide
  return { material: mat, uniforms }
}

/**
 * Composable to use ambient materials
 */
export function useAmbientMaterials() {
  return {
    createAuroraMaterial,
    createNebulaMaterial,
    createFlowMaterial,
    createGradientMeshMaterial,
    createOceanMaterial,
  }
}
