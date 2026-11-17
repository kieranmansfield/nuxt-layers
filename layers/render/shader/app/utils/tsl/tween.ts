/**
 * GPU-friendly uniform tweening via requestAnimationFrame.
 * Updates uniform .value each frame -- no shader recompilation.
 */

export type TweenHandle = {
  cancel: () => void
  promise: Promise<void>
}

/**
 * Drive a 0→1 eased progress over `duration` seconds, calling `onFrame(t)` every frame and
 * `onComplete()` once the tween finishes (not when cancelled).
 * Returns a handle with cancel() and a promise that resolves on completion or cancel.
 */
export function runTween(
  ...args: [
    duration: number,
    easing: ((t: number) => number) | undefined,
    onFrame: (t: number) => void,
    onComplete?: () => void,
  ]
): TweenHandle {
  const [duration, easing, onFrame, onComplete] = args
  let startTime: number | null = null
  let cancelled = false
  let resolvePromise: () => void

  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve
  })

  const easeFn = easing || ((t: number) => t * t * (3 - 2 * t)) // smoothstep default

  function tick(now: number) {
    if (cancelled) return
    if (startTime === null) startTime = now

    const elapsed = (now - startTime) / 1000
    const rawT = Math.min(elapsed / duration, 1)
    onFrame(easeFn(rawT))

    if (rawT < 1) {
      requestAnimationFrame(tick)
      return
    }
    onComplete?.()
    resolvePromise()
  }

  requestAnimationFrame(tick)

  return {
    cancel() {
      cancelled = true
      resolvePromise?.()
    },
    promise,
  }
}

/**
 * Holds at most one running tween: starting a new one or cancelling clears the slot.
 */
export function createTweenSlot() {
  let active: TweenHandle | null = null

  return {
    cancel() {
      active?.cancel()
      active = null
    },
    start(handle: TweenHandle): TweenHandle {
      active = handle
      handle.promise.then(() => {
        if (active === handle) active = null
      })
      return handle
    },
  }
}

/**
 * Tween a uniform node's value from `from` to `to` over `duration` seconds.
 * Returns a handle with cancel() and a promise that resolves on completion.
 */
export function tweenUniform(
  uniformNode: { value: number },
  ...args: [from: number, to: number, duration: number, easing?: (t: number) => number]
): TweenHandle {
  const [from, to, duration, easing] = args
  return runTween(duration, easing, (t) => {
    uniformNode.value = from + (to - from) * t
  })
}
