// @ts-nocheck - TSL types are complex
import { DoubleSide } from 'three'
import {
  add,
  cos,
  dot,
  exp,
  float,
  floor,
  fract,
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

export interface AmbientMaterialOptions {
  speed?: number
  intensity?: number
  colors?: string[]
  mouseInteraction?: boolean
}

export interface AmbientMaterialResult {
  material: MeshBasicNodeMaterial
  uniforms: {
    speed: any
    intensity: any
    mouseX: any
    mouseY: any
    mouseStrength: any
  }
}

// Simple hash function for noise
function hash21(p: any) {
  const pDot = dot(p, vec2(127.1, 311.7))
  return fract(sin(pDot).mul(43758.5453123))
}

function hash22(p: any) {
  const pDot1 = dot(p, vec2(127.1, 311.7))
  const pDot2 = dot(p, vec2(269.5, 183.3))
  return fract(sin(vec2(pDot1, pDot2)).mul(43758.5453))
}

// Simple value noise
function valueNoise(p: any) {
  const i = floor(p)
  const f = fract(p)
  const u = mul(f, f).mul(sub(3.0, mul(2.0, f)))

  const a = hash21(i)
  const b = hash21(add(i, vec2(1.0, 0.0)))
  const c = hash21(add(i, vec2(0.0, 1.0)))
  const d = hash21(add(i, vec2(1.0, 1.0)))

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y)
}

// Simple FBM
function fbm(p: any, octaves: number = 4) {
  let value = float(0.0)
  let amplitude = float(0.5)
  let frequency = float(1.0)
  const coord = p

  for (let i = 0; i < octaves; i++) {
    value = add(value, mul(valueNoise(mul(coord, frequency)), amplitude))
    amplitude = mul(amplitude, 0.5)
    frequency = mul(frequency, 2.0)
  }

  return value
}

/**
 * Creates an Aurora Borealis ambient background material
 */
export function createAuroraMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const { speed = 1.0, intensity = 1.0, mouseInteraction = true } = options

  // Create uniforms
  const uSpeed = uniform(speed)
  const uIntensity = uniform(intensity)
  const uMouseX = uniform(0.5)
  const uMouseY = uniform(0.5)
  const uMouseStrength = uniform(mouseInteraction ? 0.5 : 0)

  const mat = new MeshBasicNodeMaterial()

  // Time animation
  const t = mul(time, uSpeed, 0.2)

  // UV coordinates
  const uvCoord = uv()

  // Mouse offset
  const mouseOffset = vec2(
    mul(sub(uMouseX, 0.5), uMouseStrength),
    mul(sub(uMouseY, 0.5), uMouseStrength)
  )

  // Create aurora curtain effect
  const curtainCoord = add(
    vec2(mul(uvCoord.x, 3.0), mul(uvCoord.y, 0.5)),
    vec2(t, mul(t, 0.3)),
    mouseOffset
  )

  // Noise-based curtain
  const noise1 = valueNoise(curtainCoord)
  const noise2 = valueNoise(add(mul(curtainCoord, 1.5), 5.0))
  const curtain = mul(add(noise1, mul(noise2, 0.5)), 0.67)

  // Vertical fade (aurora appears higher in sky)
  const fade = mul(pow(sub(1.0, uvCoord.y), 1.2), smoothstep(0.0, 0.3, uvCoord.y))

  // Combined aurora
  const aurora = mul(smoothstep(0.2, 0.8, mul(curtain, fade)), uIntensity)

  // Colors
  const skyColor = vec3(0.02, 0.02, 0.06)
  const auroraGreen = vec3(0.0, 1.0, 0.53)
  const auroraCyan = vec3(0.38, 0.94, 1.0)

  // Color mixing based on position and noise
  const auroraColor = mix(auroraGreen, auroraCyan, mul(noise2, 0.5))

  // Final color
  const colorNode = mix(skyColor, auroraColor, aurora)

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return {
    material: mat,
    uniforms: {
      speed: uSpeed,
      intensity: uIntensity,
      mouseX: uMouseX,
      mouseY: uMouseY,
      mouseStrength: uMouseStrength,
    },
  }
}

/**
 * Creates a Cosmic Nebula ambient background material
 */
export function createNebulaMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const { speed = 1.0, intensity = 1.0, mouseInteraction = true } = options

  const uSpeed = uniform(speed)
  const uIntensity = uniform(intensity)
  const uMouseX = uniform(0.5)
  const uMouseY = uniform(0.5)
  const uMouseStrength = uniform(mouseInteraction ? 0.3 : 0)

  const mat = new MeshBasicNodeMaterial()

  const t = mul(time, uSpeed, 0.15)
  const uvCoord = sub(uv(), 0.5)

  const mouseOffset = vec2(
    mul(sub(uMouseX, 0.5), uMouseStrength),
    mul(sub(uMouseY, 0.5), uMouseStrength)
  )
  const adjustedUV = add(uvCoord, mouseOffset)

  // Multiple noise layers
  const n1 = valueNoise(add(mul(adjustedUV, 2.0), vec2(t, mul(t, 0.5))))
  const n2 = valueNoise(add(mul(adjustedUV, 3.0), vec2(mul(t, -0.3), t), 10.0))
  const n3 = valueNoise(add(mul(adjustedUV, 4.0), vec2(mul(t, 0.2), mul(t, -0.4)), 20.0))

  // Stars (sharp noise)
  const starNoise = valueNoise(mul(adjustedUV, 15.0))
  const stars = smoothstep(0.95, 1.0, starNoise)

  // Colors
  const deepSpace = vec3(0.1, 0.04, 0.18)
  const nebulaPink = vec3(1.0, 0.42, 0.42)
  const nebulaTeal = vec3(0.31, 0.8, 0.77)
  const nebulaGold = vec3(1.0, 0.9, 0.43)

  // Layer colors
  let colorNode = mix(deepSpace, nebulaPink, mul(n1, 0.6))
  colorNode = mix(colorNode, nebulaTeal, mul(n2, 0.4))
  colorNode = mix(colorNode, nebulaGold, mul(n3, 0.3))

  // Add stars
  colorNode = add(colorNode, mul(vec3(1.0, 0.98, 0.95), stars))

  // Center glow
  const dist = length(uvCoord)
  const glow = mul(exp(mul(dist, -2.0)), 0.3)
  colorNode = add(colorNode, mul(nebulaPink, glow))

  // Vignette
  colorNode = mul(colorNode, sub(1.0, mul(dist, 0.6)), uIntensity)

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return {
    material: mat,
    uniforms: {
      speed: uSpeed,
      intensity: uIntensity,
      mouseX: uMouseX,
      mouseY: uMouseY,
      mouseStrength: uMouseStrength,
    },
  }
}

/**
 * Creates an Organic Flow ambient background material
 */
export function createFlowMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const { speed = 1.0, intensity = 1.0, mouseInteraction = true } = options

  const uSpeed = uniform(speed)
  const uIntensity = uniform(intensity)
  const uMouseX = uniform(0.5)
  const uMouseY = uniform(0.5)
  const uMouseStrength = uniform(mouseInteraction ? 0.5 : 0)

  const mat = new MeshBasicNodeMaterial()

  const t = mul(time, uSpeed, 0.15)
  const uvCoord = uv()

  const mouseOffset = vec2(
    mul(sub(uMouseX, 0.5), uMouseStrength, 0.3),
    mul(sub(uMouseY, 0.5), uMouseStrength, 0.3)
  )

  // Domain warping - warp UVs with noise
  const warp1 = valueNoise(add(mul(uvCoord, 2.0), t))
  const warp2 = valueNoise(add(mul(uvCoord, 2.5), mul(t, -0.7), 5.0))
  const warpedUV = add(uvCoord, mul(vec2(warp1, warp2), 0.3), mouseOffset)

  // Noise layers with warped coordinates
  const n1 = valueNoise(mul(warpedUV, 2.0))
  const n2 = valueNoise(add(mul(warpedUV, 3.0), 10.0))
  const n3 = valueNoise(add(mul(warpedUV, 1.5), 20.0))

  // Colors
  const color1 = vec3(0.075, 0.306, 0.369) // Teal
  const color2 = vec3(0.443, 0.698, 0.502) // Green
  const color3 = vec3(0.91, 0.835, 0.718) // Cream
  const color4 = vec3(0.988, 0.361, 0.49) // Pink

  // Mix colors
  let colorNode = mix(color1, color2, n1)
  colorNode = mix(colorNode, color3, mul(n2, 0.6))
  colorNode = mix(colorNode, color4, mul(n3, 0.3))

  // Brightness variation
  const brightness = add(0.85, mul(0.15, sin(add(mul(n1, 6.28), t))))
  colorNode = mul(colorNode, brightness, uIntensity)

  // Subtle vignette
  const dist = length(sub(uvCoord, 0.5))
  colorNode = mul(colorNode, sub(1.0, mul(dist, 0.3)))

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return {
    material: mat,
    uniforms: {
      speed: uSpeed,
      intensity: uIntensity,
      mouseX: uMouseX,
      mouseY: uMouseY,
      mouseStrength: uMouseStrength,
    },
  }
}

/**
 * Creates a Gradient Mesh ambient background material
 */
export function createGradientMeshMaterial(
  options: AmbientMaterialOptions = {}
): AmbientMaterialResult {
  const { speed = 1.0, intensity = 1.0, mouseInteraction = true } = options

  const uSpeed = uniform(speed)
  const uIntensity = uniform(intensity)
  const uMouseX = uniform(0.5)
  const uMouseY = uniform(0.5)
  const uMouseStrength = uniform(mouseInteraction ? 0.3 : 0)

  const mat = new MeshBasicNodeMaterial()

  const t = mul(time, uSpeed, 0.2)
  const uvCoord = uv()

  const mouseOffset = vec2(
    mul(sub(uMouseX, 0.5), uMouseStrength, 0.1),
    mul(sub(uMouseY, 0.5), uMouseStrength, 0.1)
  )
  const adjustedUV = add(uvCoord, mouseOffset)

  // Animated control points
  const p1 = vec2(add(0.2, mul(sin(mul(t, 0.5)), 0.15)), add(0.3, mul(cos(mul(t, 0.4)), 0.15)))
  const p2 = vec2(add(0.8, mul(cos(mul(t, 0.6)), 0.1)), add(0.2, mul(sin(mul(t, 0.5)), 0.1)))
  const p3 = vec2(add(0.3, mul(sin(mul(t, 0.7)), 0.15)), add(0.8, mul(cos(mul(t, 0.3)), 0.1)))
  const p4 = vec2(add(0.7, mul(cos(mul(t, 0.4)), 0.15)), add(0.7, mul(sin(mul(t, 0.6)), 0.15)))

  // Distance-based blending
  const d1 = sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p1))))
  const d2 = sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p2))))
  const d3 = sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p3))))
  const d4 = sub(1.0, smoothstep(0.0, 0.7, length(sub(adjustedUV, p4))))

  // Colors
  const color1 = vec3(0.4, 0.494, 0.918) // Blue
  const color2 = vec3(0.463, 0.294, 0.635) // Purple
  const color3 = vec3(0.941, 0.576, 0.984) // Pink
  const color4 = vec3(0.961, 0.341, 0.424) // Red

  // Mix colors
  let colorNode = mul(color1, d1)
  colorNode = add(colorNode, mul(color2, d2))
  colorNode = add(colorNode, mul(color3, d3))
  colorNode = add(colorNode, mul(color4, d4))

  // Normalize and apply intensity
  const totalWeight = add(d1, d2, d3, d4, 0.01)
  colorNode = mul(colorNode, uIntensity).div(totalWeight)

  // Subtle vignette
  const dist = length(sub(uvCoord, 0.5))
  colorNode = mul(colorNode, sub(1.0, mul(dist, 0.25)))

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return {
    material: mat,
    uniforms: {
      speed: uSpeed,
      intensity: uIntensity,
      mouseX: uMouseX,
      mouseY: uMouseY,
      mouseStrength: uMouseStrength,
    },
  }
}

/**
 * Creates an Ocean ambient background material
 */
export function createOceanMaterial(options: AmbientMaterialOptions = {}): AmbientMaterialResult {
  const { speed = 1.0, intensity = 1.0, mouseInteraction = true } = options

  const uSpeed = uniform(speed)
  const uIntensity = uniform(intensity)
  const uMouseX = uniform(0.5)
  const uMouseY = uniform(0.5)
  const uMouseStrength = uniform(mouseInteraction ? 0.5 : 0)

  const mat = new MeshBasicNodeMaterial()

  const t = mul(time, uSpeed, 0.3)
  const uvCoord = uv()

  const mousePos = vec2(uMouseX, uMouseY)
  const mouseDist = length(sub(uvCoord, mousePos))

  // Ripple effect from mouse
  const ripple = mul(
    sin(sub(mul(mouseDist, 25.0), mul(t, 4.0))),
    exp(mul(mouseDist, -4.0)),
    uMouseStrength
  )

  // Waves
  const wave1 = mul(sin(add(mul(uvCoord.x, 8.0), t, mul(ripple, 2.0))), 0.5).add(0.5)
  const wave2 = mul(sin(add(sub(mul(uvCoord.x, 12.0), mul(t, 0.7)), mul(uvCoord.y, 3.0))), 0.5).add(
    0.5
  )

  // Caustics (simplified)
  const caustic1 = valueNoise(add(mul(uvCoord, 8.0), mul(t, 0.4)))
  const caustic2 = valueNoise(add(mul(uvCoord, 12.0), mul(t, -0.3), 5.0))
  const caustics = pow(mul(caustic1, caustic2), 2.0)

  // Depth gradient
  const depth = add(mul(uvCoord.y, 0.5), 0.3)

  // Colors
  const deepBlue = vec3(0.039, 0.086, 0.157)
  const midBlue = vec3(0.118, 0.227, 0.373)
  const lightBlue = vec3(0.494, 0.784, 0.89)

  // Mix colors
  let colorNode = mix(deepBlue, midBlue, depth)
  colorNode = mix(colorNode, lightBlue, mul(caustics, 0.4, uIntensity))

  // Foam on wave peaks
  const foam = smoothstep(0.7, 0.9, mul(wave1, wave2))
  colorNode = add(colorNode, mul(vec3(1.0), foam, 0.2))

  // Shimmer
  const shimmer = mul(valueNoise(add(mul(uvCoord, 25.0), mul(t, 1.5))), 0.05, uIntensity)
  colorNode = add(colorNode, shimmer)

  // Vignette
  const dist = length(sub(uvCoord, 0.5))
  colorNode = mul(colorNode, sub(1.0, mul(dist, 0.4)))

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return {
    material: mat,
    uniforms: {
      speed: uSpeed,
      intensity: uIntensity,
      mouseX: uMouseX,
      mouseY: uMouseY,
      mouseStrength: uMouseStrength,
    },
  }
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
