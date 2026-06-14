// composables/useLoading.ts

// Timer IDs are non-reactive and intentionally module-scope (singleton)
const _timers = {
  progressInterval: null as ReturnType<typeof setInterval> | null,
  progressTimeout: null as ReturnType<typeof setTimeout> | null,
}

/**
 * Loading state composable for app initialization and async operations
 *
 * Features:
 * - Simulated progress (0-90% auto, then waits)
 * - Shared state across all component instances
 * - Can be disabled via app.config
 * - Works without UI component (headless)
 *
 * @param id - Optional scoped loading ID (for future multi-loading support)
 * @returns Loading state and control methods
 */
export function useLoading() {
  const appConfig = useAppConfig()
  const isLoading = useState('core:loading', () => appConfig.coreLayer?.loading?.enabled !== false)
  const progress = useState('core:loading:progress', () => 0)

  function startLoading(): void {
    isLoading.value = true
    progress.value = 0

    if (_timers.progressInterval) clearInterval(_timers.progressInterval)
    if (_timers.progressTimeout) clearTimeout(_timers.progressTimeout)

    _timers.progressInterval = setInterval(() => {
      if (progress.value < 90) {
        const increment = Math.random() * 5 + 3
        progress.value = Math.min(progress.value + increment, 90)
        return
      }
      if (_timers.progressInterval) {
        clearInterval(_timers.progressInterval)
        _timers.progressInterval = null
      }
    }, 150)
  }

  function stopLoading(): void {
    if (_timers.progressInterval) {
      clearInterval(_timers.progressInterval)
      _timers.progressInterval = null
    }

    progress.value = 100

    _timers.progressTimeout = setTimeout(() => {
      isLoading.value = false
    }, 100)
  }

  function updateProgress(value: number): void {
    progress.value = Math.min(Math.max(value, 0), 100)
  }

  async function withLoading(fn: () => Promise<void>): Promise<void> {
    startLoading()
    try {
      await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading: readonly(isLoading),
    progress: readonly(progress),
    startLoading,
    stopLoading,
    updateProgress,
    withLoading,
  }
}
