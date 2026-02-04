import type LocomotiveScroll from 'locomotive-scroll'

interface ScrollToOptions {
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
 *
 * // React to scroll velocity
 * watch(velocity, (v) => console.log('Velocity:', v))
 */
export function useSmoothScroll() {
  const nuxtApp = useNuxtApp()

  // Get the Locomotive Scroll instance and reactive state from the plugin
  const locomotiveScroll = computed<LocomotiveScroll | undefined>(
    () => nuxtApp.$locomotiveScroll as LocomotiveScroll | undefined
  )

  // Reactive scroll state from the plugin
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

  // Derived reactive values
  const scrollY = computed(() => scrollState.value?.scroll ?? 0)
  const velocity = computed(() => scrollState.value?.velocity ?? 0)
  const direction = computed(() => scrollState.value?.direction ?? 0)
  const progress = computed(() => scrollState.value?.progress ?? 0)

  /**
   * Lock scrolling (disable scroll)
   */
  function lockScrolling() {
    if (import.meta.client && locomotiveScroll.value) {
      document.documentElement.style.overflow = 'hidden'
      locomotiveScroll.value.stop()
    }
  }

  /**
   * Unlock scrolling (enable scroll)
   */
  function unlockScrolling() {
    if (import.meta.client && locomotiveScroll.value) {
      document.documentElement.style.overflow = ''
      locomotiveScroll.value.start()
    }
  }

  /**
   * Scroll to a target (element, selector, or position)
   */
  function scrollTo(target: string | number | HTMLElement, options?: ScrollToOptions) {
    if (!import.meta.client) return

    if (locomotiveScroll.value) {
      locomotiveScroll.value.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
        lock: options?.lock ?? false,
        onComplete: options?.onComplete,
      })
    } else {
      // Native fallback
      nativeScrollTo(target, options)
    }
  }

  /**
   * Scroll to top of page
   */
  function scrollToTop(options?: { duration?: number; immediate?: boolean }) {
    scrollTo(0, {
      duration: options?.duration ?? 2,
      immediate: options?.immediate ?? false,
    })
  }

  /**
   * Snap to top immediately (no animation)
   */
  function snapToTop() {
    scrollTo(0, { immediate: true })
  }

  return {
    // Locomotive Scroll instance
    locomotiveScroll,

    // Reactive scroll state
    scrollY,
    velocity,
    direction,
    progress,

    // Methods
    scrollTo,
    scrollToTop,
    snapToTop,
    lockScrolling,
    unlockScrolling,
  }
}

/**
 * Native browser scroll fallback
 */
function nativeScrollTo(target: string | number | HTMLElement, options?: ScrollToOptions) {
  let targetPosition: number

  if (typeof target === 'number') {
    targetPosition = target
  } else if (typeof target === 'string') {
    const element = document.querySelector(target)
    if (!element) return
    targetPosition = element.getBoundingClientRect().top + window.scrollY
  } else {
    targetPosition = target.getBoundingClientRect().top + window.scrollY
  }

  targetPosition += options?.offset ?? 0

  if (options?.immediate) {
    window.scrollTo(0, targetPosition)
    options?.onComplete?.()
  } else {
    window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    if (options?.onComplete) {
      setTimeout(options.onComplete, options?.duration ?? 500)
    }
  }
}
