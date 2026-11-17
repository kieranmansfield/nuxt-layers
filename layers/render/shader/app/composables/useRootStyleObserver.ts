/**
 * Runs `sync` on mount and whenever :root's class or style changes (theme switches).
 * Disconnects on unmount.
 */
export function useRootStyleObserver(sync: () => void) {
  onMounted(() => {
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    onUnmounted(() => observer.disconnect())
  })
}
