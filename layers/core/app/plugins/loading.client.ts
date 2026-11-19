// plugins/loading.client.ts

import { resolveLoadingConfig } from '../utils/loading'

/**
 * Loading screen bridge plugin
 *
 * Client-side only. The count itself runs before Vue does: `LoadingScreen` inlines the boot
 * runtime (`bootLoading`), which tracks the page's real loading and writes the counter straight
 * to the DOM. Once the app has mounted (hydration done) this plugin follows that runtime into
 * `useLoading()` state - `progress` every frame, then `isLoading: false` once the count has
 * reached 100, which starts the screen's exit.
 *
 * Following only after mount keeps state at its SSR'd values through hydration (no mismatch).
 *
 * Configuration via app.config.ts:
 * - Set `coreLayer.loading.enabled: false` to disable
 */
export default defineNuxtPlugin({
  name: 'core:loading',
  setup(nuxtApp) {
    const { enabled } = resolveLoadingConfig(useAppConfig().coreLayer)
    if (!enabled) return

    // Shared with useLoading(), which exposes them readonly - call it first so they're initialised
    // even if an app.vue override never renders LoadingScreen
    useLoading()
    const isLoading = useState<boolean>('core:loading')
    const progress = useState<number>('core:loading:progress')
    const skipped = useState<boolean>('core:loading:skipped')

    nuxtApp.hook('app:mounted', () => {
      // Already ended by another layer, e.g. the theme's Reduce Motion switch
      if (!isLoading.value) return
      const boot = window.__coreLoading
      // No runtime (inline scripts blocked by a CSP, or a client-only render): just reveal
      if (!boot) {
        progress.value = 100
        isLoading.value = false
        return
      }
      boot.mounted()
      boot.listen((value, done) => {
        progress.value = value
        if (!done) return
        skipped.value = boot.skipped
        isLoading.value = false
      })
    })
  },
})
