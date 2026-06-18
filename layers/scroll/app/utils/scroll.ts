import type LocomotiveScroll from 'locomotive-scroll'

export type ScrollTarget = string | number | HTMLElement

export type ScrollToOptions = {
  offset?: number | undefined
  duration?: number | undefined
  immediate?: boolean | undefined
  lock?: boolean | undefined
  onComplete?: (() => void) | undefined
}

function resolveScrollOffset(options?: ScrollToOptions) {
  return options?.offset ?? 0
}

function resolveScrollDuration(options?: ScrollToOptions) {
  return options?.duration ?? 1.2
}

function resolveScrollImmediate(options?: ScrollToOptions) {
  return options?.immediate ?? false
}

function resolveScrollLock(options?: ScrollToOptions) {
  return options?.lock ?? false
}

function resolveScrollOnComplete(options?: ScrollToOptions) {
  return options?.onComplete
}

function resolveNativeScrollDelay(options?: ScrollToOptions) {
  return options?.duration ?? 500
}

type LocomotiveScrollOptions = Parameters<LocomotiveScroll['scrollTo']>[1]

export function normalizeScrollTarget(target: ScrollTarget): number | null {
  if (typeof target === 'number') return target
  const element = typeof target === 'string' ? document.querySelector(target) : target
  if (!element) return null
  return element.getBoundingClientRect().top + window.scrollY
}

export function normalizeScrollOptions(options?: ScrollToOptions) {
  return {
    offset: resolveScrollOffset(options),
    duration: resolveScrollDuration(options),
    immediate: resolveScrollImmediate(options),
    lock: resolveScrollLock(options),
    ...(resolveScrollOnComplete(options) ? { onComplete: resolveScrollOnComplete(options) } : {}),
  }
}

function runImmediateScroll(targetPosition: number, onComplete?: () => void) {
  window.scrollTo(0, targetPosition)
  onComplete?.()
}

function runSmoothScroll(targetPosition: number, duration: number, onComplete?: () => void) {
  window.scrollTo({ top: targetPosition, behavior: 'smooth' })
  if (onComplete) {
    setTimeout(onComplete, duration)
  }
}

function buildLocomotiveScrollOptions(options?: ScrollToOptions): LocomotiveScrollOptions {
  const scrollOptions: LocomotiveScrollOptions = {
    offset: resolveScrollOffset(options),
    duration: resolveScrollDuration(options),
    immediate: resolveScrollImmediate(options),
    lock: resolveScrollLock(options),
  }

  const onComplete = resolveScrollOnComplete(options)
  if (onComplete) {
    scrollOptions.onComplete = onComplete
  }

  return scrollOptions
}

export function runNativeScroll(target: ScrollTarget, options?: ScrollToOptions) {
  const base = normalizeScrollTarget(target)
  if (base === null) return

  const targetPosition = base + resolveScrollOffset(options)
  if (resolveScrollImmediate(options)) {
    runImmediateScroll(targetPosition, resolveScrollOnComplete(options))
    return
  }

  runSmoothScroll(targetPosition, resolveNativeScrollDelay(options), resolveScrollOnComplete(options))
}

export function runLocomotiveScroll(
  scroll: LocomotiveScroll,
  target: ScrollTarget,
  options?: ScrollToOptions
) {
  scroll.scrollTo(target, buildLocomotiveScrollOptions(options))
}
