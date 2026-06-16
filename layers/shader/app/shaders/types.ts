/**
 * TSL Type Definitions
 * Simplified types for Three.js TSL nodes
 */

// TSL nodes are complex internally, so we use a simple type alias
// This provides flexibility while maintaining code readability

import type { UniformNode } from 'three/webgpu'
import type { Color, Vector3 } from 'three'

export type { TSLNode } from '../types/tsl'

/** Float uniform: `uniform(someNumber)` */
export type FloatUniform = UniformNode<'float', number>

/** Vec3 uniform: `uniform(new Vector3(...))` */
export type Vec3Uniform = UniformNode<'vec3', Vector3>

/** Color uniform: `uniform(new Color(...))` */
export type ColorUniform = UniformNode<'color', Color>

// Re-export common Three types
export type { Color, Texture, Vector2, Vector3, Vector4 } from 'three'
