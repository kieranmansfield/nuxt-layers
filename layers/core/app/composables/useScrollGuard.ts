// composables/useScrollGuard.ts

import type { ScrollGuardConfig } from '#layers/core/app/types/scroll-guard'
import { debounce } from '#layers/core/app/utils/helpers'

/**
 * Original inline styles stored per element so we can restore them on disable
 */
type SavedStyles = {
  transition: string
  maxWidth: string
  boxSizing: string
  overflowX: string
}

// ---------------------------------------------------------------------------
// Singleton DOM tracking state (non-reactive, intentionally module-scope)
// ---------------------------------------------------------------------------

const clampedElements = new WeakMap<HTMLElement, SavedStyles>()
/** Live set so we can iterate and restore on disable */
const clampedSet = new Set<HTMLElement>()

// Singleton DOM tracking (non-reactive, client-only)
const _s = {
  observer: null as MutationObserver | null,
  debouncedGuard: null as (() => void) | null,
  resizeHandler: null as (() => void) | null,
  savedHtmlOverflowX: '',
  savedBodyOverflowX: '',
  savedBodyMaxWidth: '',
  savedBodyTransition: '',
  opts: null as ScrollGuardConfig | null,
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

/**
 * Horizontal scroll guard composable
 *
 * Prevents unintended horizontal overflow by clamping overflowing elements
 * and hiding horizontal scroll on html/body. Fully togglable at runtime.
 *
 * @example
 * ```ts
 * const { isEnabled, clampedCount, enable, disable, toggle, scan } = useScrollGuard()
 *
 * // Disable temporarily for a modal with intentional overflow
 * disable()
 * // Re-enable when done
 * enable()
 * ```
 */
export function useScrollGuard() {
  const isEnabled = useState('core:scroll-guard:enabled', () => false)
  const clampedCount = useState('core:scroll-guard:clamped', () => 0)

  function shouldExclude(el: HTMLElement): boolean {
    if (!_s.opts) return true
    return _s.opts.excludeSelectors.some((sel) => {
      try {
        return el.matches(sel)
      } catch {
        return false
      }
    })
  }

  function clampElement(el: HTMLElement) {
    if (!_s.opts || clampedElements.has(el) || shouldExclude(el)) return
    if (el.scrollWidth <= window.innerWidth) return

    clampedElements.set(el, {
      transition: el.style.transition,
      maxWidth: el.style.maxWidth,
      boxSizing: el.style.boxSizing,
      overflowX: el.style.overflowX,
    })
    clampedSet.add(el)

    el.style.transition = `max-width ${_s.opts.transitionDuration}ms ease`
    el.style.maxWidth = '100%'
    el.style.boxSizing = 'border-box'

    if (_s.opts.debug) {
      el.style.outline = '2px dashed red'
      setTimeout(() => {
        el.style.outline = ''
      }, 1000)
    }

    clampedCount.value++
  }

  function guard() {
    if (!isEnabled.value || !_s.opts) return

    const html = document.documentElement
    const body = document.body

    html.style.overflowX = 'clip'
    body.style.overflowX = 'clip'
    body.style.maxWidth = '100vw'

    if (!_s.opts.strict) return

    const elements = document.body.querySelectorAll<HTMLElement>('*')
    for (const el of elements) {
      if (el.offsetParent !== null) {
        clampElement(el)
      }
    }
  }

  function startObservers() {
    if (!_s.opts) return

    _s.observer = new MutationObserver((mutations) => {
      if (!isEnabled.value || !_s.opts?.strict) return
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement) {
            clampElement(node)
            for (const child of node.querySelectorAll<HTMLElement>('*')) {
              clampElement(child)
            }
          }
        }
      }
    })
    _s.observer.observe(document.body, { childList: true, subtree: true })

    _s.debouncedGuard = debounce(guard, _s.opts.resizeDebounce)
    _s.resizeHandler = _s.debouncedGuard
    window.addEventListener('resize', _s.resizeHandler)
  }

  function stopObservers() {
    if (_s.observer) {
      _s.observer.disconnect()
      _s.observer = null
    }
    if (_s.resizeHandler) {
      window.removeEventListener('resize', _s.resizeHandler)
      _s.resizeHandler = null
      _s.debouncedGuard = null
    }
  }

  function restoreAll() {
    for (const el of clampedSet) {
      const saved = clampedElements.get(el)
      if (saved) {
        el.style.transition = saved.transition
        el.style.maxWidth = saved.maxWidth
        el.style.boxSizing = saved.boxSizing
        el.style.overflowX = saved.overflowX
        clampedElements.delete(el)
      }
    }
    clampedSet.clear()
    clampedCount.value = 0

    const html = document.documentElement
    const body = document.body
    html.style.overflowX = _s.savedHtmlOverflowX
    body.style.overflowX = _s.savedBodyOverflowX
    body.style.maxWidth = _s.savedBodyMaxWidth
    body.style.transition = _s.savedBodyTransition
  }

  function enable(config?: Partial<ScrollGuardConfig>) {
    if (!import.meta.client) return
    if (isEnabled.value) return

    const appConfig = useAppConfig()
    const configFromApp = (
      appConfig.coreLayer as { scrollGuard?: Partial<ScrollGuardConfig> } | undefined
    )?.scrollGuard

    _s.opts = {
      enabled: true,
      excludeSelectors: ['.carousel', '.overflow-intent'],
      strict: true,
      transitionDuration: 200,
      resizeDebounce: 150,
      debug: false,
      ...configFromApp,
      ...config,
    }

    const html = document.documentElement
    const body = document.body
    _s.savedHtmlOverflowX = html.style.overflowX
    _s.savedBodyOverflowX = body.style.overflowX
    _s.savedBodyMaxWidth = body.style.maxWidth
    _s.savedBodyTransition = body.style.transition

    isEnabled.value = true
    guard()
    startObservers()
  }

  function disable() {
    if (!import.meta.client) return
    if (!isEnabled.value) return

    isEnabled.value = false
    stopObservers()
    restoreAll()
    _s.opts = null
  }

  function toggle() {
    if (isEnabled.value) {
      disable()
      return
    }
    enable()
  }

  function scan() {
    if (!import.meta.client || !isEnabled.value) return
    guard()
  }

  return {
    /** Whether the guard is currently active */
    isEnabled: readonly(isEnabled),
    /** Number of elements currently being clamped */
    clampedCount: readonly(clampedCount),
    /** Activate the guard and start observing */
    enable,
    /** Deactivate the guard and restore all styles */
    disable,
    /** Toggle the guard on/off */
    toggle,
    /** Manually re-scan the DOM for overflowing elements */
    scan,
  }
}
