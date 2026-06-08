/**
 * Navigate back in browser history, falling back to a hub route when there's
 * no previous entry (e.g. the page was opened directly via URL).
 */
export function useBackNavigation(fallback = '/') {
  const router = useRouter()

  function back() {
    if (import.meta.client && window.history.length > 1) {
      router.back()
      return
    }
    router.push(fallback)
  }

  return { back }
}
