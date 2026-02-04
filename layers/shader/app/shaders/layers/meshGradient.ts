// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Mesh Gradient Shader Layer
 * Organic blob-based gradient effect
 */
import { Color } from 'three'
import { cos, float, mix, sin, time as tslTime, uniform, uv, vec2, vec3 } from 'three/tsl'
import { blob } from '../common/shapes'
import type { TSLNode } from '../types'

export interface MeshGradientOptions {
  /** Array of colors (4 recommended) */
  colors?: string[]
  /** Animation speed */
  speed?: number
  /** Blob size multiplier */
  blobScale?: number
  /** Blob softness */
  softness?: number
  /** Mouse X position (0-1) */
  mouseX?: number
  /** Mouse Y position (0-1) */
  mouseY?: number
  /** Mouse interaction strength */
  mouseStrength?: number
}

export interface MeshGradientUniforms {
  speed: ReturnType<typeof uniform>
  blobScale: ReturnType<typeof uniform>
  softness: ReturnType<typeof uniform>
  mouseX: ReturnType<typeof uniform>
  mouseY: ReturnType<typeof uniform>
  mouseStrength: ReturnType<typeof uniform>
  colors: ReturnType<typeof uniform>[]
}

/**
 * Create mesh gradient uniforms
 */
export function createMeshGradientUniforms(
  options: MeshGradientOptions = {}
): MeshGradientUniforms {
  const {
    colors = ['#1a1a2e', '#e94560', '#0f3460', '#16213e'],
    speed = 0.3,
    blobScale = 1,
    softness = 0.25,
    mouseX = 0.5,
    mouseY = 0.5,
    mouseStrength = 0.5,
  } = options

  return {
    speed: uniform(speed),
    blobScale: uniform(blobScale),
    softness: uniform(softness),
    mouseX: uniform(mouseX),
    mouseY: uniform(mouseY),
    mouseStrength: uniform(mouseStrength),
    colors: colors.map((c) => uniform(new Color(c))),
  }
}

/**
 * Create mesh gradient color node
 */
export function meshGradient(uniforms: MeshGradientUniforms, uvNode?: TSLNode): TSLNode {
  const uvCoord = uvNode || uv()
  const time = tslTime.mul(uniforms.speed)

  // Mouse influence
  const mouseInfluence = vec2(
    uniforms.mouseX.sub(0.5).mul(uniforms.mouseStrength),
    uniforms.mouseY.sub(0.5).mul(uniforms.mouseStrength)
  )

  // Animated blob centers with mouse influence
  const c1 = vec2(
    float(0.3).add(sin(time).mul(0.15)).add(mouseInfluence.x.mul(0.3)),
    float(0.3)
      .add(cos(time.mul(0.8)).mul(0.15))
      .add(mouseInfluence.y.mul(0.3))
  )
  const c2 = vec2(
    float(0.7)
      .add(cos(time.mul(0.7)).mul(0.15))
      .sub(mouseInfluence.x.mul(0.2)),
    float(0.4)
      .add(sin(time.mul(0.9)).mul(0.15))
      .sub(mouseInfluence.y.mul(0.2))
  )
  const c3 = vec2(
    float(0.5)
      .add(sin(time.mul(0.6)).mul(0.15))
      .add(mouseInfluence.x.mul(0.4)),
    float(0.7)
      .add(cos(time.mul(1.1)).mul(0.15))
      .add(mouseInfluence.y.mul(0.4))
  )
  const c4 = vec2(
    float(0.2)
      .add(cos(time.mul(0.5)).mul(0.1))
      .sub(mouseInfluence.x.mul(0.25)),
    float(0.6)
      .add(sin(time.mul(0.7)).mul(0.1))
      .sub(mouseInfluence.y.mul(0.25))
  )

  // Create blobs with different sizes
  const b1 = blob(uvCoord, c1, uniforms.blobScale.mul(0.35), uniforms.softness)
  const b2 = blob(uvCoord, c2, uniforms.blobScale.mul(0.3), uniforms.softness.mul(0.8))
  const b3 = blob(uvCoord, c3, uniforms.blobScale.mul(0.28), uniforms.softness.mul(0.88))
  const b4 = blob(uvCoord, c4, uniforms.blobScale.mul(0.25), uniforms.softness.mul(0.72))

  // Get colors from uniforms
  const col1 = vec3(uniforms.colors[0] as unknown as TSLNode)
  const col2 = vec3(uniforms.colors[1] as unknown as TSLNode)
  const col3 = vec3(uniforms.colors[2] as unknown as TSLNode)
  const col4 = vec3(uniforms.colors[3] as unknown as TSLNode)

  // Mix colors based on blob influence
  let color = col1
  color = mix(color, col2, b1)
  color = mix(color, col3, b2.mul(0.8))
  color = mix(color, col4, b3.mul(0.7))
  color = mix(color, col2, b4.mul(0.5))

  return color
}

/**
 * Update mesh gradient uniforms reactively
 */
export function updateMeshGradientUniforms(
  uniforms: MeshGradientUniforms,
  options: Partial<MeshGradientOptions>
): void {
  if (options.speed !== undefined) uniforms.speed.value = options.speed
  if (options.blobScale !== undefined) uniforms.blobScale.value = options.blobScale
  if (options.softness !== undefined) uniforms.softness.value = options.softness
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
