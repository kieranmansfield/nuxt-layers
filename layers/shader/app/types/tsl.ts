import type { Node } from 'three/webgpu'

export type TSLNode = Node
export type TSLVec3 = Node<'vec3'>
export type TSLVec4 = Node<'vec4'>
export type TSLColor = Node<'color'>
export type TSLMat3 = Node<'mat3'>
export type TSLMat4 = Node<'mat4'>

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
