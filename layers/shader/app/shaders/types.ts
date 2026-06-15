/**
 * TSL Type Definitions
 * Simplified types for Three.js TSL nodes
 */

// TSL nodes are complex internally, so we use a simple type alias
// This provides flexibility while maintaining code readability

import type { UniformNode } from 'three/webgpu'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSLNode = any

/**
 * Float uniform with full TSL operator support.
 * `ReturnType<typeof uniform>` collapses to `UniformNode<unknown, unknown>`,
 * which has no operator methods — use this concrete type instead.
 */
export type FloatUniform = UniformNode<'float', number>

// Re-export common Three types
export type { Color, Texture, Vector2, Vector3, Vector4 } from 'three'
