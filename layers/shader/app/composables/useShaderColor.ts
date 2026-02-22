// @ts-nocheck - TSL types are complex
import { Color } from 'three'
import { uniform } from 'three/tsl'
import type { TweenHandle } from '../utils/tsl/tween'

/**
 * Reactive color uniform with hex/OKLCH input and smooth tweening.
 * The THREE.Color and uniform node are created once -- never recreated.
 */
export function useShaderColor(initialHex: string) {
  const color = new Color(initialHex)
  const node = uniform(color)
  let activeTween: TweenHandle | null = null

  const hex = ref(initialHex)

  function set(newHex: string) {
    activeTween?.cancel()
    activeTween = null
    hex.value = newHex
    color.set(newHex)
    node.value = color
  }

  function setOKLCH(l: number, c: number, h: number) {
    activeTween?.cancel()
    activeTween = null
    const result = oklchToColor(l, c, h)
    color.copy(result)
    node.value = color
    hex.value = `#${color.getHexString()}`
  }

  function tweenTo(targetHex: string, duration: number, easing?: (t: number) => number): TweenHandle {
    activeTween?.cancel()

    const startR = color.r
    const startG = color.g
    const startB = color.b
    const targetColor = new Color(targetHex)
    const targetR = targetColor.r
    const targetG = targetColor.g
    const targetB = targetColor.b

    let startTime: number | null = null
    let cancelled = false
    let resolvePromise: () => void

    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })

    const easeFn = easing || ((t: number) => t * t * (3 - 2 * t)) // smoothstep

    function tick(now: number) {
      if (cancelled) return
      if (startTime === null) startTime = now

      const elapsed = (now - startTime) / 1000
      const rawT = Math.min(elapsed / duration, 1)
      const t = easeFn(rawT)

      color.r = startR + (targetR - startR) * t
      color.g = startG + (targetG - startG) * t
      color.b = startB + (targetB - startB) * t
      node.value = color

      if (rawT < 1) {
        requestAnimationFrame(tick)
      } else {
        hex.value = targetHex
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
    hex: readonly(hex),
    set,
    setOKLCH,
    tweenTo,
  }
}
