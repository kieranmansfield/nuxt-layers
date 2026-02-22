/**
 * GPU-friendly uniform tweening via requestAnimationFrame.
 * Updates uniform .value each frame -- no shader recompilation.
 */

export interface TweenHandle {
  cancel: () => void
  promise: Promise<void>
}

/**
 * Tween a uniform node's value from `from` to `to` over `duration` seconds.
 * Returns a handle with cancel() and a promise that resolves on completion.
 */
export function tweenUniform(
  uniformNode: { value: number },
  from: number,
  to: number,
  duration: number,
  easing?: (t: number) => number
): TweenHandle {
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
    const t = easeFn(rawT)

    uniformNode.value = from + (to - from) * t

    if (rawT < 1) {
      requestAnimationFrame(tick)
    } else {
      resolvePromise()
    }
  }

  requestAnimationFrame(tick)

  return {
    cancel() {
      cancelled = true
      resolvePromise!()
    },
    promise,
  }
}
