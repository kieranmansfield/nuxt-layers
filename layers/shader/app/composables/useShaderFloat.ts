// @ts-nocheck - TSL types are complex
import { uniform } from 'three/tsl'
import type { TweenHandle } from '../utils/tsl/tween'

export interface ShaderFloatOptions {
  min?: number
  max?: number
}

/**
 * Reactive float uniform with clamping and tweening.
 * The uniform node is created once and mutated via .value -- no shader recompilation.
 */
export function useShaderFloat(initialValue: number, options: ShaderFloatOptions = {}) {
  const { min: minVal, max: maxVal } = options
  const node = uniform(initialValue)
  let activeTween: TweenHandle | null = null

  function clampValue(v: number): number {
    let result = v
    if (minVal !== undefined) result = Math.max(minVal, result)
    if (maxVal !== undefined) result = Math.min(maxVal, result)
    return result
  }

  const value = ref(initialValue)

  watch(value, (v) => {
    const clamped = clampValue(v)
    node.value = clamped
  })

  function set(v: number) {
    activeTween?.cancel()
    activeTween = null
    value.value = clampValue(v)
  }

  function tweenTo(target: number, duration: number, easing?: (t: number) => number): TweenHandle {
    activeTween?.cancel()
    const handle = tweenUniform(node, node.value, clampValue(target), duration, easing)
    activeTween = handle
    handle.promise.then(() => {
      if (activeTween === handle) {
        value.value = clampValue(target)
        activeTween = null
      }
    })
    return handle
  }

  onUnmounted(() => {
    activeTween?.cancel()
  })

  return {
    node,
    value: readonly(value),
    set,
    tweenTo,
  }
}
