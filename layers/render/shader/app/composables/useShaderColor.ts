import { Color } from 'three'
import { uniform } from 'three/tsl'

import { oklchToColor } from '../utils/tsl/oklch'
import { createTweenSlot, runTween, type TweenHandle } from '../utils/tsl/tween'

/**
 * Reactive color uniform with hex/OKLCH input and smooth tweening.
 * The THREE.Color and uniform node are created once -- never recreated.
 */
export function useShaderColor(initialHex: string) {
  const color = new Color(initialHex)
  const node = uniform(color)
  const tween = createTweenSlot()

  const hex = ref(initialHex)

  function set(newHex: string) {
    tween.cancel()
    hex.value = newHex
    color.set(newHex)
    node.value = color
  }

  function setOKLCH(l: number, c: number, h: number) {
    tween.cancel()
    const result = oklchToColor(l, c, h)
    color.copy(result)
    node.value = color
    hex.value = `#${color.getHexString()}`
  }

  function tweenTo(
    targetHex: string,
    duration: number,
    easing?: (t: number) => number
  ): TweenHandle {
    tween.cancel()

    const startR = color.r
    const startG = color.g
    const startB = color.b
    const targetColor = new Color(targetHex)
    const targetR = targetColor.r
    const targetG = targetColor.g
    const targetB = targetColor.b

    return tween.start(
      runTween(
        duration,
        easing,
        (t) => {
          color.r = startR + (targetR - startR) * t
          color.g = startG + (targetG - startG) * t
          color.b = startB + (targetB - startB) * t
          node.value = color
        },
        () => {
          hex.value = targetHex
        }
      )
    )
  }

  onUnmounted(tween.cancel)

  return {
    node,
    hex: readonly(hex),
    set,
    setOKLCH,
    tweenTo,
  }
}
