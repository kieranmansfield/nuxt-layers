import type { Color, Matrix3, Matrix4, Texture, Vector2, Vector3, Vector4 } from 'three'

export type UniformPrimitive = number | boolean | string
export type UniformVector = Vector2 | Vector3 | Vector4
export type UniformMatrix = Matrix3 | Matrix4
export type UniformValue = UniformPrimitive | UniformVector | UniformMatrix | Color | Texture | null

export interface UniformDefinition<T extends UniformValue = UniformValue> {
  value: T
  min?: number
  max?: number
  step?: number
  label?: string
}

export type UniformValues = Record<string, UniformValue>

export interface UniformsState<T extends UniformValues> {
  values: T
  nodes: Record<keyof T, import('./tsl').TSLNode>
}
