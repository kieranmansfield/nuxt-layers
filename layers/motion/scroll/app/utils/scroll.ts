import type LocomotiveScroll from 'locomotive-scroll'

import { resolveDurationMs } from '#layers/core/app/utils/motion'

import type { ScrollToOptions } from '../types/scroll'

export type ScrollTarget = string | number | HTMLElement

function resolveScrollOffset(options?: ScrollToOptions) {
  return options?.offset ?? 0
}

// Milliseconds in, as every motion duration is. v6 passed the same number to Locomotive as
// seconds and to the native fallback's onComplete timer as milliseconds.
function resolveScrollDurationMs(options?: ScrollToOptions) {
  return resolveDurationMs(options?.duration ?? 1200)
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
    duration: resolveScrollDurationMs(options),
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
    duration: resolveScrollDurationMs(options) / 1000,
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

  runSmoothScroll(
    targetPosition,
    resolveScrollDurationMs(options),
    resolveScrollOnComplete(options)
  )
}

export function runLocomotiveScroll(
  scroll: LocomotiveScroll,
  target: ScrollTarget,
  options?: ScrollToOptions
) {
  scroll.scrollTo(target, buildLocomotiveScrollOptions(options))
}
