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
