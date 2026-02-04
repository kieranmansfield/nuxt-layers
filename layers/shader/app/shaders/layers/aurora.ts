// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Aurora Shader Layer
 * Northern lights / aurora borealis effect
 */
import { Color } from 'three'
import { float, mix, pow, smoothstep, time as tslTime, uniform, uv, vec2, vec3 } from 'three/tsl'
import { simplexNoise2D } from '../common/noise'
import type { TSLNode } from '../types'

export interface AuroraOptions {
  /** Array of colors (3 recommended) */
  colors?: string[]
  /** Animation speed */
  speed?: number
  /** Curtain density */
  density?: number
  /** Vertical fade power */
  fadePower?: number
  /** Glow intensity */
  glowIntensity?: number
  /** Sky color */
  skyColor?: string
  /** Mouse X position (0-1) */
  mouseX?: number
  /** Mouse interaction strength */
  mouseStrength?: number
}

export interface AuroraUniforms {
  speed: ReturnType<typeof uniform>
  density: ReturnType<typeof uniform>
  fadePower: ReturnType<typeof uniform>
  glowIntensity: ReturnType<typeof uniform>
  mouseX: ReturnType<typeof uniform>
  mouseStrength: ReturnType<typeof uniform>
  skyColor: ReturnType<typeof uniform>
  colors: ReturnType<typeof uniform>[]
}

/**
 * Create aurora uniforms
 */
export function createAuroraUniforms(options: AuroraOptions = {}): AuroraUniforms {
  const {
    colors = ['#00ff87', '#60efff', '#ff00ea'],
    speed = 0.2,
    density = 3,
    fadePower = 1.5,
    glowIntensity = 1,
    skyColor = '#020205',
    mouseX = 0.5,
    mouseStrength = 0.5,
  } = options

  return {
    speed: uniform(speed),
    density: uniform(density),
    fadePower: uniform(fadePower),
    glowIntensity: uniform(glowIntensity),
    mouseX: uniform(mouseX),
    mouseStrength: uniform(mouseStrength),
    skyColor: uniform(new Color(skyColor)),
    colors: colors.map((c) => uniform(new Color(c))),
  }
}

/**
 * Create aurora color node
 */
export function aurora(uniforms: AuroraUniforms, uvNode?: TSLNode): TSLNode {
  const uvCoord = uvNode || uv()
  const time = tslTime.mul(uniforms.speed)

  // Mouse influence on aurora movement
  const mouseInfluence = uniforms.mouseX.sub(0.5).mul(uniforms.mouseStrength)

  // Vertical curtain effect with multiple layers
  const curtain1 = simplexNoise2D(
    vec2(
      uvCoord.x.mul(uniforms.density).add(time).add(mouseInfluence),
      uvCoord.y.mul(0.5).add(time.mul(0.3))
    )
  )

  const curtain2 = simplexNoise2D(
    vec2(
      uvCoord.x.mul(uniforms.density.mul(1.3)).sub(time.mul(0.7)).sub(mouseInfluence),
      uvCoord.y.mul(0.3).add(time.mul(0.2))
    )
  )

  const curtain3 = simplexNoise2D(
    vec2(
      uvCoord.x.mul(uniforms.density.mul(0.8)).add(time.mul(0.5)).add(mouseInfluence.mul(0.5)),
      uvCoord.y.mul(0.4).sub(time.mul(0.1))
    )
  )

  // Combine curtains with vertical fade
  const fade = pow(float(1).sub(uvCoord.y), uniforms.fadePower)
  const auroraValue = curtain1.mul(0.5).add(curtain2.mul(0.3)).add(curtain3.mul(0.2)).mul(fade)
  const auroraSmooth = smoothstep(-0.2, 0.8, auroraValue)

  // Get colors
  const col1 = vec3(uniforms.colors[0] as unknown as TSLNode)
  const col2 = vec3(uniforms.colors[1] as unknown as TSLNode)
  const col3 = vec3(uniforms.colors[2] as unknown as TSLNode)
  const sky = vec3(uniforms.skyColor as unknown as TSLNode)

  // Color mixing
  let color = mix(col1, col2, auroraSmooth)
  color = mix(color, col3, curtain2.mul(fade).mul(0.5))

  // Add glow
  const glow = vec3(0.05, 0.1, 0.05).mul(auroraSmooth).mul(uniforms.glowIntensity)
  color = color.add(glow)

  // Mix with dark sky background
  color = mix(sky, color, auroraSmooth.add(0.1))

  return color
}

/**
 * Update aurora uniforms reactively
 */
export function updateAuroraUniforms(
  uniforms: AuroraUniforms,
  options: Partial<AuroraOptions>
): void {
  if (options.speed !== undefined) uniforms.speed.value = options.speed
  if (options.density !== undefined) uniforms.density.value = options.density
  if (options.fadePower !== undefined) uniforms.fadePower.value = options.fadePower
  if (options.glowIntensity !== undefined) uniforms.glowIntensity.value = options.glowIntensity
  if (options.mouseX !== undefined) uniforms.mouseX.value = options.mouseX
  if (options.mouseStrength !== undefined) uniforms.mouseStrength.value = options.mouseStrength
  if (options.skyColor !== undefined) uniforms.skyColor.value = new Color(options.skyColor)
  if (options.colors) {
    options.colors.forEach((c, i) => {
      if (uniforms.colors[i]) {
        uniforms.colors[i].value = new Color(c)
      }
    })
  }
}
