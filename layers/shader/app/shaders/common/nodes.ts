import { float, vec2, vec3 } from 'three/tsl'

import type { TSLNode } from '../types'

export function toScalarNode(value: TSLNode | number): TSLNode {
  return typeof value === 'number' ? float(value) : value
}

export function toVec2Node(value: TSLNode | number | [number, number]): TSLNode {
  if (typeof value === 'number') return vec2(value, value)
  if (Array.isArray(value)) return vec2(value[0], value[1])
  return value
}

export function toVec3Node(value: TSLNode | [number, number, number]): TSLNode {
  return Array.isArray(value) ? vec3(value[0], value[1], value[2]) : value
}
