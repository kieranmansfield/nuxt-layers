/**
 * TSL Node types
 * Using generic types for flexibility across Three.js versions
 */

export type TSLNode = any

export type TSLFloat = any

export type TSLVec2 = any

export type TSLVec3 = any

export type TSLVec4 = any

export type TSLColor = any

export type TSLMat3 = any

export type TSLMat4 = any

export interface GradientStop {
  position: number
  color: TSLColor | TSLVec3
}

export interface FBMOptions {
  octaves?: number
  lacunarity?: number
  gain?: number
  amplitude?: number
  frequency?: number
}

export interface VoronoiResult {
  distance: TSLFloat
  cellCenter: TSLVec2
  edgeDistance: TSLFloat
}
