// composables/useLoading.ts
import type { Ref } from 'vue'

interface LoadingState {
  isLoading: Ref<boolean>
  progress: Ref<number>
}

// Shared state across all calls (singleton pattern)
const state: LoadingState = {
  isLoading: ref(true), // Start as true for initial app load
  progress: ref(0),
}

let progressInterval: ReturnType<typeof setInterval> | null = null
let progressTimeout: ReturnType<typeof setTimeout> | null = null

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
  /**
   * Start loading with simulated progress
   * Progress will automatically increment from 0 to ~90
   */
  function startLoading(): void {
    state.isLoading.value = true
    state.progress.value = 0

    // Clear any existing intervals
    if (progressInterval) clearInterval(progressInterval)
    if (progressTimeout) clearTimeout(progressTimeout)

    // Simulate progress: increment randomly to 90%, then wait
    progressInterval = setInterval(() => {
      if (state.progress.value < 90) {
        // Random increment between 3-8%
        const increment = Math.random() * 5 + 3
        state.progress.value = Math.min(state.progress.value + increment, 90)
      } else {
        // Stop at 90, wait for manual completion
        if (progressInterval) {
          clearInterval(progressInterval)
          progressInterval = null
        }
      }
    }, 150) // Update every 150ms
  }

  /**
   * Stop loading and jump to 100%
   */
  function stopLoading(): void {
    // Clear any running intervals
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    // Jump to 100%
    state.progress.value = 100

    // Mark as not loading after a brief delay (allows 100% to be visible)
    progressTimeout = setTimeout(() => {
      state.isLoading.value = false
    }, 100)
  }

  /**
   * Manually update progress (0-100)
   * @param value - Progress percentage (0-100)
   */
  function updateProgress(value: number): void {
    state.progress.value = Math.min(Math.max(value, 0), 100)
  }

  /**
   * Execute async function with loading state
   * @param fn - Async function to execute
   */
  async function withLoading(fn: () => Promise<void>): Promise<void> {
    startLoading()
    try {
      await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    // State (reactive refs)
    isLoading: readonly(state.isLoading),
    progress: readonly(state.progress),

    // Actions
    startLoading,
    stopLoading,
    updateProgress,
    withLoading,
  }
}
