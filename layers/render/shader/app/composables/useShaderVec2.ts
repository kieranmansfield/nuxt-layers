import { Vector2 } from 'three'
import { uniform } from 'three/tsl'

import { createTweenSlot, runTween, type TweenHandle } from '../utils/tsl/tween'

/**
 * Reactive Vector2 uniform with tweening.
 * The Vector2 and uniform node are created once -- never recreated.
 */
export function useShaderVec2(initialX = 0, initialY = 0) {
  const vector = new Vector2(initialX, initialY)
  const node = uniform(vector)
  const tween = createTweenSlot()

  const x = ref(initialX)
  const y = ref(initialY)

  watch([x, y], ([newX, newY]) => {
    vector.set(newX, newY)
    node.value = vector
  })

  function set(newX: number, newY: number) {
    tween.cancel()
    x.value = newX
    y.value = newY
  }

  function tweenTo(
    ...args: [targetX: number, targetY: number, duration: number, easing?: (t: number) => number]
  ): TweenHandle {
    const [targetX, targetY, duration, easing] = args
    tween.cancel()

    const startX = vector.x
    const startY = vector.y

    return tween.start(
      runTween(
        duration,
        easing,
        (t) => {
          vector.x = startX + (targetX - startX) * t
          vector.y = startY + (targetY - startY) * t
          node.value = vector
        },
        () => {
          x.value = targetX
          y.value = targetY
        }
      )
    )
  }

  onUnmounted(tween.cancel)

  return {
    node,
    x: readonly(x),
    y: readonly(y),
    set,
    tweenTo,
  }
}
