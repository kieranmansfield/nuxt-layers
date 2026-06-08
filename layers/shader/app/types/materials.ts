import type { Blending, DepthModes, Side } from 'three'

import type { TSLNode } from './tsl'

export type NodeMaterialConfig = {
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

export type GradientMaterialConfig = {
  colors: string[]
  angle?: number
  type?: 'linear' | 'radial'
  animated?: boolean
  speed?: number
}

export type NoiseMaterialConfig = {
  scale?: number
  speed?: number
  octaves?: number
  baseColor?: string
  peakColor?: string
  type?: 'simplex' | 'perlin' | 'voronoi' | 'fbm'
}

export type FresnelMaterialConfig = {
  baseColor?: string
  fresnelColor?: string
  power?: number
  intensity?: number
}
