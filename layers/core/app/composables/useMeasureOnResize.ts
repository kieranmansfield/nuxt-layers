/**
 * Runs `measure` after mount (and again 100ms later, once fonts/layout settle), then
 * re-runs it on window resize, debounced by 150ms. Cleans up on unmount.
 */
export function useMeasureOnResize(measure: () => void) {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function debouncedMeasure() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      measure()
      debounceTimer = null
    }, 150)
  }

  onMounted(() => {
    nextTick(() => {
      measure()
      setTimeout(measure, 100)
    })
    window.addEventListener('resize', debouncedMeasure, { passive: true })
  })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    window.removeEventListener('resize', debouncedMeasure)
  })
}
