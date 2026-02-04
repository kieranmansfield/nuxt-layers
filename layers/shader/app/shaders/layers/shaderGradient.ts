// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * ShaderGradient-inspired Shader Layer
 * 3D morphing gradient effect similar to shadergradient.co
 */
import { Color } from 'three'
import { cos, mix, pow, smoothstep, time as tslTime, uniform, uv, vec2, vec3 } from 'three/tsl'
import { fbm2D, simplexNoise2D } from '../common/noise'
import type { TSLNode } from '../types'

export interface ShaderGradientOptions {
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

export interface ShaderGradientUniforms {
  color1: ReturnType<typeof uniform>
  color2: ReturnType<typeof uniform>
  color3: ReturnType<typeof uniform>
  speed: ReturnType<typeof uniform>
  morphIntensity: ReturnType<typeof uniform>
  grain: ReturnType<typeof uniform>
  lightX: ReturnType<typeof uniform>
  lightY: ReturnType<typeof uniform>
  brightness: ReturnType<typeof uniform>
  zoom: ReturnType<typeof uniform>
}

/**
 * Create shader gradient uniforms
 */
export function createShaderGradientUniforms(
  options: ShaderGradientOptions = {}
): ShaderGradientUniforms {
  const {
    color1 = '#ff5722',
    color2 = '#673ab7',
    color3 = '#2196f3',
    speed = 0.4,
    morphIntensity = 1,
    grain = 0.03,
    lightX = 0.5,
    lightY = 0.5,
    brightness = 1,
    zoom = 1,
  } = options

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
  const col1 = vec3(uniforms.color1 as unknown as TSLNode)
  const col2 = vec3(uniforms.color2 as unknown as TSLNode)
  const col3 = vec3(uniforms.color3 as unknown as TSLNode)

  // Complex color mixing
  let color = mix(col1, col2, noise1)
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
  if (options.color1 !== undefined) uniforms.color1.value = new Color(options.color1)
  if (options.color2 !== undefined) uniforms.color2.value = new Color(options.color2)
  if (options.color3 !== undefined) uniforms.color3.value = new Color(options.color3)
  if (options.speed !== undefined) uniforms.speed.value = options.speed
  if (options.morphIntensity !== undefined) uniforms.morphIntensity.value = options.morphIntensity
  if (options.grain !== undefined) uniforms.grain.value = options.grain
  if (options.lightX !== undefined) uniforms.lightX.value = options.lightX
  if (options.lightY !== undefined) uniforms.lightY.value = options.lightY
  if (options.brightness !== undefined) uniforms.brightness.value = options.brightness
  if (options.zoom !== undefined) uniforms.zoom.value = options.zoom
}
