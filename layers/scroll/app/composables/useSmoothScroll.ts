import type { Ref } from 'vue'
import type LocomotiveScroll from 'locomotive-scroll'

type ScrollToOptions = {
  offset?: number
  duration?: number
  immediate?: boolean
  lock?: boolean
  onComplete?: () => void
}

/**
 * Unified scroll composable using Locomotive Scroll v5 smooth scrolling
 *
 * @example
 * const { scrollTo, velocity, progress } = useSmoothScroll()
 *
 * // Scroll to element
 * scrollTo('#section', { offset: -100, duration: 2 })
 */
export function useSmoothScroll() {
  const nuxtApp = useNuxtApp()
  const appConfig = useAppConfig()

  const locomotiveScroll = computed<LocomotiveScroll | undefined>(
    () => (nuxtApp.$locomotiveScroll as Ref<LocomotiveScroll | null>)?.value ?? undefined
  )

  const isEnabled = computed(() => (appConfig.scroll?.smoothScroll ?? true) !== false)
  const isReady = computed(() => locomotiveScroll.value !== null)

  const scrollState = computed(
    () =>
      nuxtApp.$scrollState as
        | {
            scroll: number
            limit: number
            velocity: number
            direction: number
            progress: number
          }
        | undefined
  )

  const scrollY = computed(() => scrollState.value?.scroll ?? 0)
  const velocity = computed(() => scrollState.value?.velocity ?? 0)
  const direction = computed(() => scrollState.value?.direction ?? 0)
  const progress = computed(() => scrollState.value?.progress ?? 0)

  function lockScrolling() {
    if (import.meta.client && locomotiveScroll.value) {
      document.documentElement.style.overflow = 'hidden'
      locomotiveScroll.value.stop()
    }
  }

  function unlockScrolling() {
    if (!import.meta.client) return
    document.documentElement.style.overflow = ''
    locomotiveScroll.value?.start()
  }

  function scrollTo(target: string | number | HTMLElement, options?: ScrollToOptions) {
    if (!import.meta.client) return

    if (locomotiveScroll.value) {
      locomotiveScroll.value.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
        lock: options?.lock ?? false,
        ...(options?.onComplete !== undefined && { onComplete: options.onComplete }),
      })
      return
    }
    nativeScrollTo(target, options)
  }

  function scrollToTop(options?: { duration?: number; immediate?: boolean }) {
    scrollTo(0, {
      duration: options?.duration ?? 2,
      immediate: options?.immediate ?? false,
    })
  }

  function snapToTop() {
    scrollTo(0, { immediate: true })
  }

  return {
    locomotiveScroll,
    isEnabled,
    isReady,
    scrollY,
    velocity,
    direction,
    progress,
    scrollTo,
    scrollToTop,
    snapToTop,
    lockScrolling,
    unlockScrolling,
  }
}

function resolveScrollTarget(target: string | number | HTMLElement): number | null {
  if (typeof target === 'number') return target
  if (typeof target === 'string') {
    const el = document.querySelector(target)
    if (!el) return null
    return el.getBoundingClientRect().top + window.scrollY
  }
  return target.getBoundingClientRect().top + window.scrollY
}

function nativeScrollTo(target: string | number | HTMLElement, options?: ScrollToOptions) {
  const base = resolveScrollTarget(target)
  if (base === null) return

  const targetPosition = base + (options?.offset ?? 0)

  if (options?.immediate) {
    window.scrollTo(0, targetPosition)
    options?.onComplete?.()
    return
  }
  window.scrollTo({ top: targetPosition, behavior: 'smooth' })
  if (options?.onComplete) {
    setTimeout(options.onComplete, options?.duration ?? 500)
  }
}
