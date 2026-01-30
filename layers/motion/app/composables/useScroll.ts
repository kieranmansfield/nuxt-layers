import { useLenis } from 'lenis/vue'

interface ScrollToOptions {
  offset?: number
  duration?: number
  immediate?: boolean
  lock?: boolean
  onComplete?: () => void
}

/**
 * Unified scroll composable using Lenis smooth scrolling
 *
 * @example
 * const { scrollTo, lockScrolling, unlockScrolling } = useScroll()
 *
 * // Scroll to element
 * scrollTo('#section', { offset: -100, duration: 2 })
 *
 * // Lock scrolling (for modals, etc.)
 * lockScrolling()
 */
export function useScroll() {
  const lenisRef = useLenis()

  /**
   * Lock scrolling (disable scroll)
   */
  function lockScrolling() {
    if (import.meta.client) {
      document.documentElement.style.overflow = 'hidden'
      if (lenisRef.value) lenisRef.value.stop()
    }
  }

  /**
   * Unlock scrolling (enable scroll)
   */
  function unlockScrolling() {
    if (import.meta.client) {
      document.documentElement.style.overflow = ''
      if (lenisRef.value) lenisRef.value.start()
    }
  }

  /**
   * Scroll to a target (element, selector, or position)
   */
  function scrollTo(
    target: string | number | HTMLElement,
    options?: ScrollToOptions
  ) {
    if (!import.meta.client) return

    if (lenisRef.value) {
      lenisRef.value.scrollTo(target, {
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

  /**
   * Get current scroll position
   */
  const scroll = computed(() => {
    if (!import.meta.client) return { x: 0, y: 0 }
    return {
      x: window.scrollX,
      y: lenisRef.value?.scroll ?? window.scrollY,
    }
  })

  return {
    lenis: lenisRef,
    scroll,
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
function nativeScrollTo(
  target: string | number | HTMLElement,
  options?: ScrollToOptions
) {
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
