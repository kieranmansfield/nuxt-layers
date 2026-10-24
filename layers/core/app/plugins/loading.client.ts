// plugins/loading.client.ts

import { resolveLoadingConfig } from '../utils/loading'

/**
 * Loading screen initialization plugin
 *
 * Client-side only. Once the app has mounted (hydration done) it:
 * 1. Starts the count, timed from navigation start, and moves it at real milestones:
 *    hydrated (50), fonts ready (75)
 * 2. Waits for fonts and the initial page's images, capped at `maxDuration`
 * 3. Marks loading done - the count then finishes to 100 before the screen exits
 *
 * Starting after mount keeps the counter at the SSR'd 0 through hydration (no mismatch).
 * With `prefers-reduced-motion: reduce` it ends at once instead: CSS hides the screen.
 *
 * Configuration via app.config.ts:
 * - Set `coreLayer.loading.enabled: false` to disable
 */
export default defineNuxtPlugin({
  name: 'core:loading',
  setup(nuxtApp) {
    const { enabled, maxDuration } = resolveLoadingConfig(useAppConfig().coreLayer)

    // Check if loading is enabled
    if (!enabled) {
      return // Disabled, skip initialization
    }

    const { isLoading, startLoading, stopLoading, updateProgress, finishNow } = useLoading()

    // Not awaited: app:mounted handlers run serially, so waiting here would hold up other layers
    nuxtApp.hook('app:mounted', () => {
      // CSS hides the screen under reduced motion, so don't hold the page (GSAP, scrolling) for it.
      // After hydration, not in setup: state changes before then would fail to hydrate
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finishNow()
      // Already ended by another layer, e.g. the theme's Reduce Motion switch
      if (!isLoading.value) return
      startLoading(0)
      updateProgress(50)
      void document.fonts?.ready.then(() => updateProgress(75))
      void Promise.race([
        Promise.all([pageLoaded(), document.fonts?.ready]),
        new Promise((resolve) => setTimeout(resolve, maxDuration)),
      ]).then(stopLoading)
    })
  },
})

function pageLoaded(): Promise<unknown> {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
}
