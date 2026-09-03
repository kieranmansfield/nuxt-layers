import { reactive, ref, watch } from 'vue'
import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from 'three'
import { uniform } from 'three/tsl'

import type { TSLNode, UniformValue, UniformValues } from '../types'

/**
 * `uniform()` is typed with per-type overloads, so a `UniformValue` union
 * needs narrowing before the call resolves.
 */
function createUniformNode(value: UniformValue): TSLNode {
  if (typeof value === 'number') return uniform(value)
  if (typeof value === 'boolean') return uniform(value)
  if (value instanceof Vector2) return uniform(value)
  if (value instanceof Vector3) return uniform(value)
  if (value instanceof Vector4) return uniform(value)
  if (value instanceof Matrix3) return uniform(value)
  if (value instanceof Matrix4) return uniform(value)
  if (value instanceof Color) return uniform(value)
  // Strings (node type names) and textures are handled by uniform() at runtime
  // but aren't covered by its typed overloads
  const loose = uniform as unknown as (v: UniformValue) => TSLNode
  return loose(value)
}

/**
 * Creates reactive uniforms that bridge Vue state to TSL shaders
 */
export function useUniforms<T extends UniformValues>(initialValues: T) {
  const values = reactive({ ...initialValues }) as T
  const nodes: Record<string, TSLNode> = {}

  // Create uniform nodes for each value
  for (const [key, value] of Object.entries(initialValues)) {
    nodes[key] = createUniformNode(value)
  }

  // Watch for changes and update uniform nodes
  for (const key of Object.keys(initialValues)) {
    watch(
      () => (values as Record<string, UniformValue>)[key],
      (newValue) => {
        if (nodes[key]) {
          nodes[key].value = newValue
        }
      }
    )
  }

  /**
   * Set a uniform value
   */
  function set<K extends keyof T>(key: K, value: T[K]) {
    ;(values as Record<string, UniformValue>)[key as string] = value
  }

  /**
   * Get a uniform node for use in TSL
   */
  function node<K extends keyof T>(key: K) {
    return nodes[key as string]
  }

  /**
   * Bind a ref to a uniform (two-way sync)
   */
  function bind<K extends keyof T>(key: K) {
    return {
      get: () => (values as Record<string, UniformValue>)[key as string] as T[K],
      set: (v: T[K]) => set(key, v),
    }
  }

  /**
   * Create a v-model compatible ref for a uniform
   */
  function model<K extends keyof T>(key: K) {
    return computed({
      get: () => (values as Record<string, UniformValue>)[key as string] as T[K],
      set: (v: T[K]) => set(key, v),
    })
  }

  /**
   * Reset all uniforms to initial values
   */
  function reset() {
    for (const [key, value] of Object.entries(initialValues)) {
      ;(values as Record<string, UniformValue>)[key] = value
    }
  }

  /**
   * Get all uniform nodes as an object
   */
  function getNodes() {
    return nodes as Record<keyof T, TSLNode>
  }

  return {
    values,
    nodes: getNodes(),
    set,
    node,
    bind,
    model,
    reset,
  }
}

/**
 * Create a single uniform with reactive value
 */
export function useUniform<T extends UniformValue>(initialValue: T) {
  const value = ref(initialValue) as Ref<T>
  const node = createUniformNode(initialValue)

  watch(value, (newValue) => {
    node.value = newValue
  })

  return {
    value,
    node,
    set: (v: T) => {
      value.value = v
    },
  }
}

/**
 * Create a color uniform with hex string support
 */
export function useColorUniform(initialHex: string) {
  const hex = ref(initialHex)
  const color = new Color(initialHex)
  const node = uniform(color)

  watch(hex, (newHex) => {
    color.set(newHex)
    node.value = color
  })

  return {
    hex,
    color,
    node,
    set: (v: string) => {
      hex.value = v
    },
  }
}

/**
 * Create a vector2 uniform
 */
export function useVector2Uniform(x = 0, y = 0) {
  const vec = reactive({ x, y })
  const vector = new Vector2(x, y)
  const node = uniform(vector)

  watch(
    () => [vec.x, vec.y] as const,
    ([newX, newY]) => {
      vector.set(newX ?? 0, newY ?? 0)
      node.value = vector
    }
  )

  return {
    vec,
    vector,
    node,
    set: (newX: number, newY: number) => {
      vec.x = newX
      vec.y = newY
    },
  }
}

/**
 * Create a vector3 uniform
 */
export function useVector3Uniform(x = 0, y = 0, z = 0) {
  const vec = reactive({ x, y, z })
  const vector = new Vector3(x, y, z)
  const node = uniform(vector)

  watch(
    () => [vec.x, vec.y, vec.z] as const,
    ([newX, newY, newZ]) => {
      vector.set(newX ?? 0, newY ?? 0, newZ ?? 0)
      node.value = vector
    }
  )

  return {
    vec,
    vector,
    node,
    set: (newX: number, newY: number, newZ: number) => {
      vec.x = newX
      vec.y = newY
      vec.z = newZ
    },
  }
}
