/**
 * Shared open state for the site nav. Plain `useState`, not an overlay: layouts and triggers read
 * `isOpen`, and `<MastNavModal />` (rendered once by the layout) binds to it. Any number of
 * `<MastNav>` triggers share the one modal.
 *
 * Scroll lock: UModal (Reka) locks body scroll and pads for the scrollbar, so this only stops
 * Lenis — and only after Reka has measured. Hiding overflow first (lockScrolling) left Reka
 * measuring a 0px scrollbar, and the page widened by the scrollbar on open.
 */
export function useMastNav() {
  const isOpen = useState('mast-nav:open', () => false)

  function smoothScroll() {
    try {
      return useSmoothScroll().locomotiveScroll
    } catch {
      return undefined
    }
  }

  function open() {
    const scroll = smoothScroll()
    isOpen.value = true
    if (import.meta.client) nextTick(() => scroll?.value?.stop())
  }

  function close() {
    const scroll = smoothScroll()
    isOpen.value = false
    if (!import.meta.client) return
    scroll?.value?.start()
    // Lenis/Locomotive measure the page while stopped; resize after restart so they resync
    scroll?.value?.lenisInstance?.resize()
    requestAnimationFrame(() => scroll?.value?.resize())
  }

  const toggle = () => (isOpen.value ? close() : open())

  return { isOpen: readonly(isOpen), open, close, toggle }
}
