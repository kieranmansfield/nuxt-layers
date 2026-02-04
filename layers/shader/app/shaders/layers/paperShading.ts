// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Paper Shading Shader Layer
 * Inspired by Paper Shaders - organic, hand-drawn aesthetic
 */
import { Color } from 'three'
import { abs, float, mix, smoothstep, time as tslTime, uniform, uv, vec3 } from 'three/tsl'
import { grain as grainFn, paperTexture } from '../common/grain'
import { fbm2D, simplexNoise2D } from '../common/noise'
import type { TSLNode } from '../types'

export interface PaperShadingOptions {
  /** Base paper color */
  paperColor?: string
  /** Ink color */
  inkColor?: string
  /** Secondary ink color */
  inkColor2?: string
  /** Animation speed */
  speed?: number
  /** Paper texture intensity */
  textureIntensity?: number
  /** Ink flow intensity */
  flowIntensity?: number
  /** Grain intensity */
  grainIntensity?: number
  /** Bleed amount (ink spreading) */
  bleed?: number
  /** Edge darkness */
  edgeDarkness?: number
}

export interface PaperShadingUniforms {
  paperColor: ReturnType<typeof uniform>
  inkColor: ReturnType<typeof uniform>
  inkColor2: ReturnType<typeof uniform>
  speed: ReturnType<typeof uniform>
  textureIntensity: ReturnType<typeof uniform>
  flowIntensity: ReturnType<typeof uniform>
  grainIntensity: ReturnType<typeof uniform>
  bleed: ReturnType<typeof uniform>
  edgeDarkness: ReturnType<typeof uniform>
}

/**
 * Create paper shading uniforms
 */
export function createPaperShadingUniforms(
  options: PaperShadingOptions = {}
): PaperShadingUniforms {
  const {
    paperColor = '#f5f0e6',
    inkColor = '#1a1a1a',
    inkColor2 = '#3d5a80',
    speed = 0.1,
    textureIntensity = 0.15,
    flowIntensity = 1,
    grainIntensity = 0.08,
    bleed = 0.5,
    edgeDarkness = 0.3,
  } = options

  return {
    paperColor: uniform(new Color(paperColor)),
    inkColor: uniform(new Color(inkColor)),
    inkColor2: uniform(new Color(inkColor2)),
    speed: uniform(speed),
    textureIntensity: uniform(textureIntensity),
    flowIntensity: uniform(flowIntensity),
    grainIntensity: uniform(grainIntensity),
    bleed: uniform(bleed),
    edgeDarkness: uniform(edgeDarkness),
  }
}

/**
 * Create paper shading color node
 */
export function paperShading(uniforms: PaperShadingUniforms, uvNode?: TSLNode): TSLNode {
  const uvCoord = uvNode || uv()
  const time = tslTime.mul(uniforms.speed)

  // Paper texture base
  const paper = vec3(uniforms.paperColor as unknown as TSLNode)
  const ink1 = vec3(uniforms.inkColor as unknown as TSLNode)
  const ink2 = vec3(uniforms.inkColor2 as unknown as TSLNode)

  // Paper fiber texture
  const fiberNoise = paperTexture(uvCoord, 20, uniforms.textureIntensity, time)
  let color = paper.add(fiberNoise)

  // Ink flow simulation
  const flowNoise1 = fbm2D(uvCoord.mul(3).add(time.mul(0.5)), { octaves: 4 })
  const flowNoise2 = fbm2D(uvCoord.mul(4).sub(time.mul(0.3)), { octaves: 3 })

  // Ink bleeding effect
  const bleedNoise = simplexNoise2D(uvCoord.mul(8).add(time.mul(0.2)))
  const bleedAmount = bleedNoise.mul(uniforms.bleed).mul(0.1)

  // Create organic ink shapes
  const inkShape1 = smoothstep(
    float(0.2).sub(bleedAmount),
    float(0.5).add(bleedAmount),
    flowNoise1.mul(uniforms.flowIntensity)
  )
  const inkShape2 = smoothstep(
    float(0.3).sub(bleedAmount),
    float(0.6).add(bleedAmount),
    flowNoise2.mul(uniforms.flowIntensity).mul(0.8)
  )

  // Apply ink colors
  color = mix(color, ink1, inkShape1.mul(0.7))
  color = mix(color, ink2, inkShape2.mul(0.5))

  // Edge darkening (vignette-like)
  const edgeDist = abs(uvCoord.sub(0.5)).mul(2)
  const edgeFactor = smoothstep(0.5, 1.2, edgeDist.x.add(edgeDist.y))
  color = color.mul(float(1).sub(edgeFactor.mul(uniforms.edgeDarkness)))

  // Paper grain
  const grainValue = grainFn(uvCoord, uniforms.grainIntensity, time.mul(10))
  color = color.add(grainValue)

  // Subtle warm tint
  color = color.mul(vec3(1.02, 1.0, 0.98))

  return clamp(color, 0, 1)
}

/**
 * Update paper shading uniforms reactively
 */
export function updatePaperShadingUniforms(
  uniforms: PaperShadingUniforms,
  options: Partial<PaperShadingOptions>
): void {
  if (options.paperColor !== undefined) uniforms.paperColor.value = new Color(options.paperColor)
  if (options.inkColor !== undefined) uniforms.inkColor.value = new Color(options.inkColor)
  if (options.inkColor2 !== undefined) uniforms.inkColor2.value = new Color(options.inkColor2)
  if (options.speed !== undefined) uniforms.speed.value = options.speed
  if (options.textureIntensity !== undefined)
    uniforms.textureIntensity.value = options.textureIntensity
  if (options.flowIntensity !== undefined) uniforms.flowIntensity.value = options.flowIntensity
  if (options.grainIntensity !== undefined) uniforms.grainIntensity.value = options.grainIntensity
  if (options.bleed !== undefined) uniforms.bleed.value = options.bleed
  if (options.edgeDarkness !== undefined) uniforms.edgeDarkness.value = options.edgeDarkness
}
