/**
 * TSL Type Definitions
 * Simplified types for Three.js TSL nodes
 */

// TSL nodes are complex internally, so we use a simple type alias
// This provides flexibility while maintaining code readability

export type TSLNode = any

// Re-export common Three types
export type { Color, Texture, Vector2, Vector3, Vector4 } from 'three'
