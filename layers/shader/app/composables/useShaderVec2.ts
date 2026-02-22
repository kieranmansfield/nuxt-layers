// @ts-nocheck - TSL types are complex
import { Vector2 } from 'three'
import { uniform } from 'three/tsl'
import type { TweenHandle } from '../utils/tsl/tween'

/**
 * Reactive Vector2 uniform with tweening.
 * The Vector2 and uniform node are created once -- never recreated.
 */
export function useShaderVec2(initialX = 0, initialY = 0) {
  const vector = new Vector2(initialX, initialY)
  const node = uniform(vector)
  let activeTween: TweenHandle | null = null

  const x = ref(initialX)
  const y = ref(initialY)

  watch([x, y], ([newX, newY]) => {
    vector.set(newX, newY)
    node.value = vector
  })

  function set(newX: number, newY: number) {
    activeTween?.cancel()
    activeTween = null
    x.value = newX
    y.value = newY
  }

  function tweenTo(
    targetX: number,
    targetY: number,
    duration: number,
    easing?: (t: number) => number
  ): TweenHandle {
    activeTween?.cancel()

    const startX = vector.x
    const startY = vector.y

    let startTime: number | null = null
    let cancelled = false
    let resolvePromise: () => void

    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })

    const easeFn = easing || ((t: number) => t * t * (3 - 2 * t))

    function tick(now: number) {
      if (cancelled) return
      if (startTime === null) startTime = now

      const elapsed = (now - startTime) / 1000
      const rawT = Math.min(elapsed / duration, 1)
      const t = easeFn(rawT)

      vector.x = startX + (targetX - startX) * t
      vector.y = startY + (targetY - startY) * t
      node.value = vector

      if (rawT < 1) {
        requestAnimationFrame(tick)
      } else {
        x.value = targetX
        y.value = targetY
        resolvePromise()
      }
    }

    requestAnimationFrame(tick)

    const handle: TweenHandle = {
      cancel() {
        cancelled = true
        resolvePromise()
      },
      promise,
    }
    activeTween = handle
    handle.promise.then(() => {
      if (activeTween === handle) activeTween = null
    })
    return handle
  }

  onUnmounted(() => {
    activeTween?.cancel()
  })

  return {
    node,
    x: readonly(x),
    y: readonly(y),
    set,
    tweenTo,
  }
}
