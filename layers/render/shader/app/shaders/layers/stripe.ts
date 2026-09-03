/**
 * Stripe Gradient Shader Layer
 * Flowing gradient effect inspired by Stripe.com
 */
import { Color } from 'three'
import { float, mix, smoothstep, time as tslTime, uniform, uv, vec2, vec3 } from 'three/tsl'

import { simplexNoise2D } from '../common/noise'
import type { FloatUniform, TSLNode } from '../types'

export type StripeGradientOptions = {
  /** Array of colors (3-5 recommended) */
  colors?: string[]
  /** Animation speed */
  speed?: number
  /** Noise scale */
  noiseScale?: number
  /** Flow direction angle in radians */
  flowAngle?: number
  /** Mouse X position (0-1) */
  mouseX?: number
  /** Mouse Y position (0-1) */
  mouseY?: number
  /** Mouse interaction strength */
  mouseStrength?: number
}

export type StripeGradientUniforms = {
  speed: FloatUniform
  noiseScale: FloatUniform
  flowAngle: FloatUniform
  mouseX: FloatUniform
  mouseY: FloatUniform
  mouseStrength: FloatUniform
  colors: TSLNode[]
}

/**
 * Create stripe gradient uniforms
 */
export function createStripeGradientUniforms(
  options: StripeGradientOptions = {}
): StripeGradientUniforms {
  const {
    colors = ['#0a2540', '#635bff', '#00d4ff', '#7a73ff', '#80e9ff'],
    speed = 0.15,
    noiseScale = 1.5,
    flowAngle = 0,
    mouseX = 0.5,
    mouseY = 0.5,
    mouseStrength = 0.3,
  } = options

  return {
    speed: uniform(speed),
    noiseScale: uniform(noiseScale),
    flowAngle: uniform(flowAngle),
    mouseX: uniform(mouseX),
    mouseY: uniform(mouseY),
    mouseStrength: uniform(mouseStrength),
    colors: colors.map((c) => uniform(new Color(c))),
  }
}

/**
 * Create stripe gradient color node
 */
export function stripeGradient(uniforms: StripeGradientUniforms, uvNode?: TSLNode): TSLNode {
  const uvCoord = uvNode || uv()
  const time = tslTime.mul(uniforms.speed)

  // Add mouse interaction offset
  const mouseOffset = vec2(
    uniforms.mouseX.sub(0.5).mul(uniforms.mouseStrength),
    uniforms.mouseY.sub(0.5).mul(uniforms.mouseStrength)
  )
  const animatedUV = uvCoord.add(mouseOffset)

  // Create flowing noise patterns
  const n1 = simplexNoise2D(animatedUV.mul(uniforms.noiseScale).add(vec2(time, time.mul(0.5))))
    .mul(0.5)
    .add(0.5)

  const n2 = simplexNoise2D(
    animatedUV.mul(uniforms.noiseScale.mul(1.3)).add(vec2(time.mul(-0.7), time.mul(0.3)))
  )
    .mul(0.5)
    .add(0.5)

  const n3 = simplexNoise2D(
    animatedUV.mul(uniforms.noiseScale.mul(0.8)).add(vec2(time.mul(0.4), time.mul(-0.6)))
  )
    .mul(0.5)
    .add(0.5)

  // Get colors from uniforms
  const c0 = vec3(uniforms.colors[0])
  const c1 = vec3(uniforms.colors[1])
  const c2 = vec3(uniforms.colors[2])
  const c3 = vec3(uniforms.colors[3])
  const c4 = vec3(uniforms.colors[4])

  // Blend multiple colors based on noise
  let color: TSLNode = c0
  color = mix(color, c1, smoothstep(0, 0.5, n1))
  color = mix(color, c2, smoothstep(0.3, 0.7, n2))
  color = mix(color, c3, smoothstep(0.4, 0.8, n3))
  color = mix(color, c4, smoothstep(0.6, 1.0, n1.mul(n2)))

  // Add subtle brightness variation
  const brightness = float(0.9).add(simplexNoise2D(animatedUV.mul(3).add(time)).mul(0.1))
  color = color.mul(brightness)

  return color
}

/**
 * Update stripe gradient uniforms reactively
 */
export function updateStripeGradientUniforms(
  uniforms: StripeGradientUniforms,
  options: Partial<StripeGradientOptions>
): void {
  if (options.speed !== undefined) uniforms.speed.value = options.speed
  if (options.noiseScale !== undefined) uniforms.noiseScale.value = options.noiseScale
  if (options.flowAngle !== undefined) uniforms.flowAngle.value = options.flowAngle
  if (options.mouseX !== undefined) uniforms.mouseX.value = options.mouseX
  if (options.mouseY !== undefined) uniforms.mouseY.value = options.mouseY
  if (options.mouseStrength !== undefined) uniforms.mouseStrength.value = options.mouseStrength
  if (options.colors) {
    options.colors.forEach((c, i) => {
      if (uniforms.colors[i]) {
        uniforms.colors[i].value = new Color(c)
      }
    })
  }
}
