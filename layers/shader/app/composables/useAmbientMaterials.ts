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
