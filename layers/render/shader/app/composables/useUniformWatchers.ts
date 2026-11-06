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
