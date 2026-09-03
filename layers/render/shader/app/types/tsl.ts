/**
 * TSL Node types
 *
 * These are intentionally `any`. The Three.js TSL type system wraps every node in
 * `ShaderNodeObject<T>` (from `three/tsl`) which adds method chaining (.add, .mul, etc.),
 * but that type is only accessible via a deep import path and is not stable across
 * Three.js minor versions. Components also access `.value` directly on uniform nodes
 * (which are `UniformNode<T>`, a subclass of Node), so a simple `Node` alias would break them.
 *
 * TODO: Replace with `ShaderNodeObject<Node>` once three/tsl exports stabilise and
 * uniform nodes are properly typed as `FloatUniform` at their use sites.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLNode = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLFloat = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLVec2 = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLVec3 = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLVec4 = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLColor = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLMat3 = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLMat4 = any

export type GradientStop = {
  position: number
  color: TSLColor | TSLVec3
}

export type FBMOptions = {
  octaves?: number
  lacunarity?: number
  gain?: number
  amplitude?: number
  frequency?: number
}

export type VoronoiResult = {
  distance: TSLFloat
  cellCenter: TSLVec2
  edgeDistance: TSLFloat
}
