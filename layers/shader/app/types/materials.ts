import type { Blending, DepthModes, Side } from 'three'
import type { TSLNode } from './tsl'

export interface NodeMaterialConfig {
  colorNode?: TSLNode
  opacityNode?: TSLNode
  normalNode?: TSLNode
  emissiveNode?: TSLNode
  metalnessNode?: TSLNode
  roughnessNode?: TSLNode
  positionNode?: TSLNode

  transparent?: boolean
  side?: Side
  blending?: Blending
  depthTest?: boolean
  depthWrite?: boolean
  depthFunc?: DepthModes
  wireframe?: boolean
  flatShading?: boolean
}

export interface GradientMaterialConfig {
  colors: string[]
  angle?: number
  type?: 'linear' | 'radial'
  animated?: boolean
  speed?: number
}

export interface NoiseMaterialConfig {
  scale?: number
  speed?: number
  octaves?: number
  baseColor?: string
  peakColor?: string
  type?: 'simplex' | 'perlin' | 'voronoi' | 'fbm'
}

export interface FresnelMaterialConfig {
  baseColor?: string
  fresnelColor?: string
  power?: number
  intensity?: number
}
