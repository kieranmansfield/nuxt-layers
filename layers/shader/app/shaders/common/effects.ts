/**
 * Modular TSL Post-Processing Effects
 * Provides effects that sample and process textures
 */
import {
  float,
  floor,
  fract,
  length,
  normalize,
  pow,
  screenSize,
  smoothstep,
  uv,
  vec2,
  vec4,
} from 'three/tsl'

import type { TSLNode } from '../types'
import { toScalarNode, toVec2Node } from './nodes'

// ============================================
// LED Effect
// ============================================

export type LEDEffectOptions = {
  scalar?: TSLNode | number
  zoom?: TSLNode | number
  exponent?: TSLNode | number
  edge?: TSLNode | number
}

const DEFAULT_LED_EFFECT_OPTIONS = {
  scalar: 100,
  zoom: 2,
  exponent: 1.2,
  edge: 0.1,
} as const

/**
 * LED screen effect for post-processing
 * Creates a grid of circular LED dots over the input texture
 * @param input - Input texture
 * @param inputUV - UV function (defaults to screen UV)
 * @param options - Effect options
 */
export function ledEffect(
  input: TSLNode,
  inputUV: () => TSLNode = uv,
  options: LEDEffectOptions = {}
): TSLNode {
  const { scalar, zoom, exponent, edge } = {
    ...DEFAULT_LED_EFFECT_OPTIONS,
    ...options,
  }

  const _scalar = toScalarNode(scalar)
  const _zoom = toScalarNode(zoom)
  const _exponent = toScalarNode(exponent)
  const _edge = toScalarNode(edge)

  const _uv = inputUV().toVar()

  const gridUV = fract(_uv.mul(_scalar)).sub(0.5).toVar()

  // Circle pattern
  const pattern = length(gridUV.mul(_zoom)).oneMinus().toVar()
  pattern.assign(smoothstep(_edge, 1, pattern))
  pattern.assign(pow(pattern, _exponent))

  const originalColor = input.sample(_uv)
  return originalColor.mul(pattern)
}

// ============================================
// Pixellation Effect
// ============================================

export type PixellationEffectOptions = {
  size?: TSLNode | number
}

/**
 * Pixellation effect for post-processing
 * Creates a mosaic/pixel art look
 * @param input - Input texture
 * @param inputUV - UV function (defaults to screen UV)
 * @param options - Effect options
 */
export function pixellationEffect(
  input: TSLNode,
  inputUV: () => TSLNode = uv,
  options: PixellationEffectOptions = {}
): TSLNode {
  const { size = 20.0 } = options

  const _size = typeof size === 'number' ? float(size) : size
  const _uv = inputUV().toVar()

  // Aspect correct UV coordinates
  const aspect = screenSize.x.div(screenSize.y).toVar()
  const aspectCorrectedUV = vec2(_uv.x.mul(aspect), _uv.y).toVar()

  // Create pixelated UV coordinates
  const pixelSize = _size.div(1000.0)
  const pixelatedUV = floor(aspectCorrectedUV.div(pixelSize)).mul(pixelSize).toVar()

  // Reverse aspect correction for sampling
  const samplingUV = vec2(pixelatedUV.x.div(aspect), pixelatedUV.y).toVar()

  return input.sample(samplingUV)
}

// ============================================
// Chromatic Aberration Effect
// ============================================

export type ChromaticAberrationOptions = {
  strength?: TSLNode | number
  radial?: TSLNode | number
  direction?: TSLNode | [number, number]
}

/**
 * Chromatic aberration effect
 * Separates RGB channels to create color fringing
 * @param input - Input texture
 * @param inputUV - UV function (defaults to screen UV)
 * @param options - Effect options
 */
export function chromaticAberrationEffect(
  input: TSLNode,
  inputUV: () => TSLNode = uv,
  options: ChromaticAberrationOptions = {}
): TSLNode {
  const { strength = 0.01, radial = 0.5, direction = [0, 0] } = options

  const _strength = typeof strength === 'number' ? float(strength) : strength
  const _radial = typeof radial === 'number' ? float(radial) : radial
  const _direction = Array.isArray(direction) ? vec2(direction[0], direction[1]) : direction

  const _uv = inputUV().toVar()

  // Calculate offset direction
  const center = vec2(0.5, 0.5).toVar()
  const toCenter = _uv.sub(center).toVar()
  const dist = length(toCenter).toVar()

  // Mix between directional and radial
  const radialDir = normalize(toCenter).toVar()
  const offsetDir = normalize(
    _direction.mul(float(1).sub(_radial)).add(radialDir.mul(_radial))
  ).toVar()

  // Create different offsets for each channel
  const offset = offsetDir.mul(_strength).mul(dist.add(0.5)).toVar()

  const rOffset = _uv.add(offset.mul(1.0)).toVar()
  const gOffset = _uv.toVar()
  const bOffset = _uv.sub(offset.mul(1.0)).toVar()

  // Sample input texture at different offsets for each channel
  const rSample = input.sample(rOffset)
  const gSample = input.sample(gOffset)
  const bSample = input.sample(bOffset)

  // Combine RGB channels with original alpha
  return vec4(rSample.r, gSample.g, bSample.b, input.sample(_uv).a)
}

// ============================================
// Bulge/Pinch Effect
// ============================================

export type BulgeEffectOptions = {
  strength?: TSLNode | number
  radius?: TSLNode | number
  power?: TSLNode | number
  center?: TSLNode | [number, number]
}

const DEFAULT_BULGE_EFFECT_OPTIONS = {
  strength: 0.5,
  radius: 0.5,
  power: 1,
  center: [0.5, 0.5] as [number, number],
} as const

/**
 * Bulge/pinch distortion effect for post-processing
 * @param input - Input texture
 * @param inputUV - UV function (defaults to screen UV)
 * @param options - Effect options
 */
export function bulgeEffect(
  input: TSLNode,
  inputUV: () => TSLNode = uv,
  options: BulgeEffectOptions = {}
): TSLNode {
  const { strength, radius, power, center } = { ...DEFAULT_BULGE_EFFECT_OPTIONS, ...options }

  const _strength = toScalarNode(strength)
  const _radius = toScalarNode(radius)
  const _power = toScalarNode(power)
  const _center = toVec2Node(center)

  const _uv = inputUV().toVar()
  const offset = _uv.sub(_center).toVar()
  const dist = length(offset).toVar()

  // Normalized distance within radius
  const normalizedDist = smoothstep(0, 1, dist.div(_radius).min(1)).toVar()

  // Use power curve for stronger center effect
  const falloff = pow(float(1).sub(normalizedDist), _power).mul(_strength)

  // Apply radial displacement
  const direction = normalize(offset)
  const displacedUV = _center.add(direction.mul(dist.mul(falloff.add(float(1.0)))))

  return input.sample(displacedUV)
}

// ============================================
// Wave Distortion Effect
// ============================================

export type WaveDistortionOptions = {
  frequency?: TSLNode | number
  amplitude?: TSLNode | number
  time?: TSLNode | number
  direction?: 'x' | 'y' | 'both'
}

/**
 * Wave distortion effect for post-processing
 * @param input - Input texture
 * @param inputUV - UV function (defaults to screen UV)
 * @param options - Effect options
 */
export function waveDistortionEffect(
  input: TSLNode,
  inputUV: () => TSLNode = uv,
  options: WaveDistortionOptions = {}
): TSLNode {
  const { frequency = 10, amplitude = 0.02, time = 0, direction = 'both' } = options

  const _freq = toScalarNode(frequency)
  const _amp = toScalarNode(amplitude)
  const _time = toScalarNode(time)

  const _uv = inputUV().toVar()

  const _eX = _uv.y.mul(_freq).add(_time).sin().mul(_amp)
  const _eY = _uv.x.mul(_freq).add(_time.mul(1.3)).sin().mul(_amp)
  const distortedUVMap = {
    both: vec2(_uv.x.add(_eX), _uv.y.add(_eY)),
    x: vec2(_uv.x.add(_eX), _uv.y),
    y: vec2(_uv.x, _uv.y.add(_uv.x.mul(_freq).add(_time).sin().mul(_amp))),
  } satisfies Record<WaveDistortionOptions['direction'], TSLNode>

  return input.sample(distortedUVMap[direction])
}

// ============================================
// Swirl Distortion Effect
// ============================================

export type SwirlDistortionOptions = {
  strength?: TSLNode | number
  radius?: TSLNode | number
  center?: TSLNode | [number, number]
}

/**
 * Swirl distortion effect for post-processing
 * @param input - Input texture
 * @param inputUV - UV function (defaults to screen UV)
 * @param options - Effect options
 */
export function swirlDistortionEffect(
  input: TSLNode,
  inputUV: () => TSLNode = uv,
  options: SwirlDistortionOptions = {}
): TSLNode {
  const { strength = 1, radius = 0.5, center = [0.5, 0.5] } = options

  const _strength = typeof strength === 'number' ? float(strength) : strength
  const _radius = typeof radius === 'number' ? float(radius) : radius
  const _center = Array.isArray(center) ? vec2(center[0], center[1]) : center

  const _uv = inputUV().toVar()

  const diff = _uv.sub(_center)
  const dist = length(diff)

  // Falloff based on distance
  const falloff = smoothstep(_radius, 0, dist)
  const angle = falloff.mul(_strength)

  // Rotate UV
  const cosA = angle.cos()
  const sinA = angle.sin()

  const rotated = vec2(
    diff.x.mul(cosA).sub(diff.y.mul(sinA)),
    diff.x.mul(sinA).add(diff.y.mul(cosA))
  )

  return input.sample(rotated.add(_center))
}
