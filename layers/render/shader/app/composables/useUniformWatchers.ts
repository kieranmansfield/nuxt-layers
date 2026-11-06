import { Color, Vector2, Vector3 } from 'three'
import { uniform } from 'three/tsl'
import { watch } from 'vue'

type WritableUniform<T> = {
  value: T
}

export function watchUniformProp<T, U = T>(
  source: () => T,
  target: WritableUniform<U>,
  transform?: (value: T) => U
) {
  watch(source, (value) => {
    target.value = transform ? transform(value) : (value as unknown as U)
  })
}

/** A uniform seeded from a prop (or any getter) that follows it, without a shader recompile. */
export function useUniformProp(source: () => number) {
  const node = uniform(source())
  watch(source, (value) => {
    node.value = value
  })
  return node
}

/** A vec3 uniform seeded from a CSS colour prop (or any getter) that follows it. */
export function useColorProp(source: () => string) {
  const toVector = (hex: string) => {
    const { r, g, b } = new Color(hex)
    return new Vector3(r, g, b)
  }
  const node = uniform(toVector(source()))
  watch(source, (hex) => {
    node.value.copy(toVector(hex))
  })
  return node
}

/** A vec2 uniform seeded from a `[x, y]` prop (or any getter) that follows it. */
export function useVector2Prop(source: () => readonly [number, number]) {
  const node = uniform(new Vector2(...source()))
  watch(source, ([x, y]) => {
    node.value.set(x, y)
  })
  return node
}
