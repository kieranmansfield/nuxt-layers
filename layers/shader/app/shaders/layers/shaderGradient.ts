/**
 * ShaderGradient-inspired Shader Layer
 * 3D morphing gradient effect similar to shadergradient.co
 */
import { Color } from 'three'
import { cos, mix, pow, sin, smoothstep, time as tslTime, uniform, uv, vec2, vec3 } from 'three/tsl'

import { fbm2D, simplexNoise2D } from '../common/noise'
import type { FloatUniform, TSLNode } from '../types'

const DEFAULT_SHADER_GRADIENT_OPTIONS = {
  color1: '#ff5722',
  color2: '#673ab7',
  color3: '#2196f3',
  speed: 0.4,
  morphIntensity: 1,
  grain: 0.03,
  lightX: 0.5,
  lightY: 0.5,
  brightness: 1,
  zoom: 1,
} as const

function setNumberUniform(uniform: FloatUniform, value: number | undefined): void {
  if (value !== undefined) {
    uniform.value = value
  }
}

function setColorUniform(uniform: TSLNode, value: string | undefined): void {
  if (value !== undefined) {
    uniform.value = new Color(value)
  }
}

export type ShaderGradientOptions = {
  /** Primary color */
  color1?: string
  /** Secondary color */
  color2?: string
  /** Tertiary color */
  color3?: string
  /** Animation speed */
  speed?: number
  /** Morph intensity */
  morphIntensity?: number
  /** Grain amount */
  grain?: number
  /** Light position X */
  lightX?: number
  /** Light position Y */
  lightY?: number
  /** Brightness */
  brightness?: number
  /** Zoom level */
  zoom?: number
}

export type ShaderGradientUniforms = {
  color1: TSLNode
  color2: TSLNode
  color3: TSLNode
  speed: FloatUniform
  morphIntensity: FloatUniform
  grain: FloatUniform
  lightX: FloatUniform
  lightY: FloatUniform
  brightness: FloatUniform
  zoom: FloatUniform
}

/**
 * Create shader gradient uniforms
 */
export function createShaderGradientUniforms(
  options: ShaderGradientOptions = {}
): ShaderGradientUniforms {
  const {
    color1,
    color2,
    color3,
    speed,
    morphIntensity,
    grain,
    lightX,
    lightY,
    brightness,
    zoom,
  } = { ...DEFAULT_SHADER_GRADIENT_OPTIONS, ...options }

  return {
    color1: uniform(new Color(color1)),
    color2: uniform(new Color(color2)),
    color3: uniform(new Color(color3)),
    speed: uniform(speed),
    morphIntensity: uniform(morphIntensity),
    grain: uniform(grain),
    lightX: uniform(lightX),
    lightY: uniform(lightY),
    brightness: uniform(brightness),
    zoom: uniform(zoom),
  }
}

/**
 * Create shader gradient color node
 */
export function shaderGradient(uniforms: ShaderGradientUniforms, uvNode?: TSLNode): TSLNode {
  const uvCoord = uvNode || uv()
  const time = tslTime.mul(uniforms.speed)

  // Apply zoom
  const zoomedUV = uvCoord.sub(0.5).div(uniforms.zoom).add(0.5)

  // Create morphing coordinates
  const morphX = zoomedUV.x.add(sin(time.mul(0.7)).mul(uniforms.morphIntensity).mul(0.1))
  const morphY = zoomedUV.y.add(cos(time.mul(0.5)).mul(uniforms.morphIntensity).mul(0.1))
  const morphUV = vec2(morphX, morphY)

  // Multiple noise layers for organic movement
  const noise1 = fbm2D(morphUV.mul(2).add(time.mul(0.3)), { octaves: 3 })
    .mul(0.5)
    .add(0.5)
  const noise2 = fbm2D(morphUV.mul(3).sub(time.mul(0.2)), { octaves: 3 })
    .mul(0.5)
    .add(0.5)
  const noise3 = simplexNoise2D(morphUV.mul(4).add(vec2(time.mul(0.4), time.mul(-0.3))))
    .mul(0.5)
    .add(0.5)

  // Light position influence
  const lightPos = vec2(uniforms.lightX, uniforms.lightY)
  const lightDist = zoomedUV.sub(lightPos).length()
  const lightFalloff = smoothstep(1.5, 0, lightDist)

  // Color blending with noise
  const col1 = vec3(uniforms.color1)
  const col2 = vec3(uniforms.color2)
  const col3 = vec3(uniforms.color3)

  // Complex color mixing
  let color: TSLNode = mix(col1, col2, noise1)
  color = mix(color, col3, noise2.mul(0.7))
  color = mix(color, col1, noise3.mul(0.3).mul(lightFalloff))

  // Add light highlight
  const highlight = pow(lightFalloff, 3).mul(0.3)
  color = color.add(highlight)

  // Apply brightness
  color = color.mul(uniforms.brightness)

  // Add subtle grain
  const grainValue = simplexNoise2D(zoomedUV.mul(100).add(time.mul(10)))
  color = color.add(grainValue.mul(uniforms.grain))

  return color
}

/**
 * Update shader gradient uniforms reactively
 */
export function updateShaderGradientUniforms(
  uniforms: ShaderGradientUniforms,
  options: Partial<ShaderGradientOptions>
): void {
  setColorUniform(uniforms.color1, options.color1)
  setColorUniform(uniforms.color2, options.color2)
  setColorUniform(uniforms.color3, options.color3)
  setNumberUniform(uniforms.speed, options.speed)
  setNumberUniform(uniforms.morphIntensity, options.morphIntensity)
  setNumberUniform(uniforms.grain, options.grain)
  setNumberUniform(uniforms.lightX, options.lightX)
  setNumberUniform(uniforms.lightY, options.lightY)
  setNumberUniform(uniforms.brightness, options.brightness)
  setNumberUniform(uniforms.zoom, options.zoom)
}
