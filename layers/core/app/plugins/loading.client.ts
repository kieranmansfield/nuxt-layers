// plugins/loading.client.ts

interface LoadingConfig {
  enabled?: boolean
  minDuration?: number
  maxDuration?: number
  background?: string
  textColor?: string
  zIndex?: number
}

interface CoreLayerConfig {
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
export default defineNuxtPlugin((nuxtApp) => {
  const config = useAppConfig()
  const coreLayer = config.coreLayer as CoreLayerConfig | undefined

  console.log('[Loading Plugin] Config:', coreLayer?.loading)

  // Check if loading is enabled
  if (coreLayer?.loading?.enabled === false) {
    console.log('[Loading Plugin] Disabled')
    return // Disabled, skip initialization
  }

  const { startLoading, stopLoading } = useLoading()

  console.log('[Loading Plugin] Starting loading...')
  // Start loading immediately on plugin load
  startLoading()

  // Stop loading when app is fully mounted
  nuxtApp.hook('app:mounted', () => {
    console.log('[Loading Plugin] App mounted, will stop in 500ms')
    // Add a small delay to ensure LoadingScreen component has mounted
    // and is visible before we stop loading
    setTimeout(() => {
      console.log('[Loading Plugin] Stopping loading now')
      stopLoading()
    }, 500) // 500ms delay to ensure component is visible
  })
})
