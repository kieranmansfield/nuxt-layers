// plugins/loading.client.ts

type LoadingConfig = {
  enabled?: boolean
  minDuration?: number
  maxDuration?: number
  background?: string
  textColor?: string
  zIndex?: number
}

type CoreLayerConfig = {
  loading?: LoadingConfig
}

/**
 * Loading screen initialization plugin
 *
 * Runs on app mount (client-side only) to:
 * 1. Start simulated progress on page load
 * 2. Stop loading when app is fully mounted and hydrated
 *
 * Configuration via app.config.ts:
 * - Set `coreLayer.loading.enabled: false` to disable
 */
export default defineNuxtPlugin({
  name: 'core:loading',
  setup(nuxtApp) {
    const config = useAppConfig()
    const coreLayer = config.coreLayer as CoreLayerConfig | undefined

    // Check if loading is enabled
    if (coreLayer?.loading?.enabled === false) {
      return // Disabled, skip initialization
    }

    const { startLoading, stopLoading } = useLoading()

    // Start loading immediately on plugin load
    startLoading()

    // Stop loading when app is fully mounted
    nuxtApp.hook('app:mounted', () => {
      // Add a small delay to ensure LoadingScreen component has mounted
      // and is visible before we stop loading
      setTimeout(() => {
        stopLoading()
      }, 500) // 500ms delay to ensure component is visible
    })
  },
})
