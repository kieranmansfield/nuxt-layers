// composables/useLoading.ts

import type { LoadingScreenState } from '../types/loading'
import { approachProgress, resolveLoadingConfig, trickleProgress } from '../utils/loading'

// Frame-loop state is non-reactive and intentionally module-scope (singleton)
const _loop = {
  frame: 0,
  lastTime: 0,
  startedAt: 0,
  target: 0,
  done: false,
}

/**
 * Loading state composable for app initialization and async operations
 *
 * Features:
 * - Smooth progress: a per-frame loop eases the displayed value toward a simulated target that
 *   slows as it nears 90%, then counts up to 100 once work is done
 * - Holds below 100 until `minDuration` has passed, so fast loads don't flash
 * - Shared state across all component instances
 * - Can be disabled via app.config
 * - Works without UI component (headless)
 *
 * @returns Loading state and control methods
 */
export function useLoading() {
  const { enabled, minDuration } = resolveLoadingConfig(useAppConfig().coreLayer)
  const isLoading = useState('core:loading', () => enabled)
  const progress = useState('core:loading:progress', () => 0)
  const screen = useState<LoadingScreenState>('core:loading:screen', () => 'hidden')

  // Trickle pace follows minDuration: a typical load sits around 60% when it may finish
  const trickleTau = Math.max(minDuration, 500) * 0.8

  function tick(now: number): void {
    // Cap at one 30fps frame so a main-thread hitch (hydration, a backgrounded tab) is followed
    // by a quick count, not a leap
    const dt = Math.min((now - _loop.lastTime) / 1000, 1 / 30)
    _loop.lastTime = now

    const elapsed = now - _loop.startedAt
    _loop.target = Math.max(_loop.target, trickleProgress(elapsed, trickleTau))
    if (_loop.done && elapsed >= minDuration) _loop.target = 100

    progress.value = approachProgress(progress.value, _loop.target, dt)

    if (progress.value >= 100) {
      _loop.frame = 0
      isLoading.value = false
      return
    }
    _loop.frame = requestAnimationFrame(tick)
  }

  function run(): void {
    if (!import.meta.client || _loop.frame) return
    _loop.lastTime = performance.now()
    _loop.frame = requestAnimationFrame(tick)
  }

  function startLoading(since?: number): void {
    isLoading.value = true
    progress.value = 0

    if (!import.meta.client) return
    cancelAnimationFrame(_loop.frame)
    _loop.frame = 0
    _loop.startedAt = since ?? performance.now()
    _loop.target = 0
    _loop.done = false
    run()
  }

  function stopLoading(): void {
    _loop.done = true
    if (isLoading.value) run()
  }

  function updateProgress(value: number): void {
    _loop.target = Math.max(_loop.target, Math.min(Math.max(value, 0), 99))
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
    screen: readonly(screen),
    startLoading,
    stopLoading,
    updateProgress,
    withLoading,
  }
}
