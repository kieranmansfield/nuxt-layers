// composables/useScrollGuard.ts

import { debounce } from '#layers/core/app/utils/helpers'
import type { ScrollGuardConfig } from '#layers/core/app/types/scroll-guard'

/**
 * Original inline styles stored per element so we can restore them on disable
 */
interface SavedStyles {
  transition: string
  maxWidth: string
  boxSizing: string
  overflowX: string
}

// ---------------------------------------------------------------------------
// Singleton state (shared across all calls)
// ---------------------------------------------------------------------------

const isEnabled = ref(false)
const clampedCount = ref(0)

const clampedElements = new WeakMap<HTMLElement, SavedStyles>()
/** Live set so we can iterate and restore on disable */
const clampedSet = new Set<HTMLElement>()

let observer: MutationObserver | null = null
let debouncedGuard: (() => void) | null = null
let resizeHandler: (() => void) | null = null
let savedHtmlOverflowX = ''
let savedBodyOverflowX = ''
let savedBodyMaxWidth = ''
let savedBodyTransition = ''

// Current resolved options (set by enable())
let opts: ScrollGuardConfig | null = null

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function shouldExclude(el: HTMLElement): boolean {
  if (!opts) return true
  return opts.excludeSelectors.some((sel) => {
    try {
      return el.matches(sel)
    } catch {
      return false
    }
  })
}

function clampElement(el: HTMLElement) {
  if (!opts || clampedElements.has(el) || shouldExclude(el)) return
  if (el.scrollWidth <= window.innerWidth) return

  // Save original styles
  clampedElements.set(el, {
    transition: el.style.transition,
    maxWidth: el.style.maxWidth,
    boxSizing: el.style.boxSizing,
    overflowX: el.style.overflowX,
  })
  clampedSet.add(el)

  el.style.transition = `max-width ${opts.transitionDuration}ms ease`
  el.style.maxWidth = '100%'
  el.style.boxSizing = 'border-box'

  if (opts.debug) {
    el.style.outline = '2px dashed red'
    setTimeout(() => {
      el.style.outline = ''
    }, 1000)
  }

  clampedCount.value++
}

function restoreElement(el: HTMLElement) {
  const saved = clampedElements.get(el)
  if (!saved) return

  el.style.transition = saved.transition
  el.style.maxWidth = saved.maxWidth
  el.style.boxSizing = saved.boxSizing
  el.style.overflowX = saved.overflowX

  clampedElements.delete(el)
  clampedSet.delete(el)
}

function guard() {
  if (!isEnabled.value || !opts) return

  const html = document.documentElement
  const body = document.body

  html.style.overflowX = 'clip'
  body.style.overflowX = 'clip'
  body.style.maxWidth = '100vw'

  if (!opts.strict) return

  const elements = document.body.querySelectorAll<HTMLElement>('*')
  for (const el of elements) {
    if (el.offsetParent !== null) {
      clampElement(el)
    }
  }
}

function startObservers() {
  if (!opts) return

  // MutationObserver for dynamically added content
  observer = new MutationObserver((mutations) => {
    if (!isEnabled.value || !opts?.strict) return
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
  observer.observe(document.body, { childList: true, subtree: true })

  // Debounced resize handler
  debouncedGuard = debounce(guard, opts.resizeDebounce)
  resizeHandler = debouncedGuard
  window.addEventListener('resize', resizeHandler)
}

function stopObservers() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
    debouncedGuard = null
  }
}

function restoreAll() {
  // Restore all clamped elements
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

  // Restore html/body styles
  const html = document.documentElement
  const body = document.body
  html.style.overflowX = savedHtmlOverflowX
  body.style.overflowX = savedBodyOverflowX
  body.style.maxWidth = savedBodyMaxWidth
  body.style.transition = savedBodyTransition
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
  function enable(config?: Partial<ScrollGuardConfig>) {
    if (!import.meta.client) return
    if (isEnabled.value) return

    // Resolve config: explicit arg → app.config → defaults
    const appConfig = useAppConfig()
    const configFromApp = (appConfig.coreLayer as { scrollGuard?: Partial<ScrollGuardConfig> } | undefined)?.scrollGuard

    opts = {
      enabled: true,
      excludeSelectors: ['.carousel', '.overflow-intent'],
      strict: true,
      transitionDuration: 200,
      resizeDebounce: 150,
      debug: false,
      ...configFromApp,
      ...config,
    }

    // Save original html/body styles before we touch them
    const html = document.documentElement
    const body = document.body
    savedHtmlOverflowX = html.style.overflowX
    savedBodyOverflowX = body.style.overflowX
    savedBodyMaxWidth = body.style.maxWidth
    savedBodyTransition = body.style.transition

    isEnabled.value = true

    // Initial scan
    guard()
    startObservers()
  }

  function disable() {
    if (!import.meta.client) return
    if (!isEnabled.value) return

    isEnabled.value = false
    stopObservers()
    restoreAll()
    opts = null
  }

  function toggle() {
    if (isEnabled.value) {
      disable()
    } else {
      enable()
    }
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
