// composables/useLoading.ts

import type { LoadingScreenState } from '../types/loading'
import { approachProgress, resolveLoadingConfig } from '../utils/loading'

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
 * - Real progress: callers raise the target at real milestones (`updateProgress`) and a per-frame
 *   loop eases the displayed value toward it, then counts up to 100 once work is done
 * - Optional `minDuration` hold before 100 (default 0: finish as soon as the work does)
 * - `finishNow()` ends the boot screen at once, e.g. for reduced motion
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
  // Set by finishNow: the boot screen leaves at once, without its beat or exit animation
  const skipped = useState('core:loading:skipped', () => false)

  function tick(now: number): void {
    // Cap at one 30fps frame so a main-thread hitch (hydration, a backgrounded tab) is followed
    // by a quick count, not a leap
    const dt = Math.min((now - _loop.lastTime) / 1000, 1 / 30)
    _loop.lastTime = now

    if (_loop.done && now - _loop.startedAt >= minDuration) _loop.target = 100

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

  function finishNow(): void {
    skipped.value = true
    if (import.meta.client) {
      cancelAnimationFrame(_loop.frame)
      window.__coreLoading?.finish()
    }
    _loop.frame = 0
    _loop.done = true
    progress.value = 100
    isLoading.value = false
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
    skipped: readonly(skipped),
    startLoading,
    stopLoading,
    updateProgress,
    finishNow,
    withLoading,
  }
}
