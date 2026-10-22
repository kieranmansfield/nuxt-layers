// plugins/loading.client.ts

import { resolveLoadingConfig } from '../utils/loading'

/**
 * Loading screen initialization plugin
 *
 * Client-side only. Once the app has mounted (hydration done) it:
 * 1. Starts the progress count, timed from navigation start - the SSR'd screen has been up
 *    since first paint, so the count catches up smoothly rather than starting late
 * 2. Waits for fonts and the initial page's images, capped at `maxDuration`
 * 3. Marks loading done - the count then finishes to 100 before the screen exits
 *
 * Starting after mount keeps the counter at the SSR'd 0 through hydration (no mismatch).
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

    const { startLoading, stopLoading } = useLoading()

    // Not awaited: app:mounted handlers run serially, so waiting here would hold up other layers
    nuxtApp.hook('app:mounted', () => {
      startLoading(0)
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
