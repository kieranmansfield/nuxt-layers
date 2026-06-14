/**
 * Core Layer Initialization Plugin
 *
 * Handles:
 * - App lifecycle logging (development only)
 * - Environment validation
 * - Module verification
 * - Initial app state setup
 *
 * This runs before other plugins and ensures the app is ready.
 */
export default defineNuxtPlugin({
  name: 'core:init',
  setup(nuxtApp) {
  const config = useAppConfig()
  // const isDev = import.meta.dev
  const isDev = process.env.NODE_ENV === 'development'

  // ============================================================
  // 1. Log initialization (dev only)
  // ============================================================
  if (isDev) {
    console.log('🚀 [Core Layer] Initializing...')

    console.log('[Core Layer] Config:', config.coreLayer)
  }

  // ============================================================
  // 2. Verify modules and composables are loaded
  // ============================================================
  try {
    // Test @nuxtjs/device module (SSR-safe: returns undefined before device plugin runs)
    const device = useDevice()

    if (isDev && device) {
      console.log('[Core Layer] Device detection:', {
        mobile: device.isMobile,
        desktop: device.isDesktop,
        tablet: device.isTablet,
      })
    }

    // Test @vueuse/nuxt module
    const isOnline = useOnline()

    if (isDev) {
      console.log('[Core Layer] VueUse loaded, online status:', isOnline.value)
    }

    // Client-only detection (requires browser APIs)
    if (import.meta.client) {
      // Test browser detection composable
      const { name, version, engine, os } = useBrowser()

      if (isDev) {
        console.log('[Core Layer] Browser detection:', {
          name: name.value,
          version: version.value,
          engine: engine.value,
          os: os.value,
        })
      }

      // Test screen/breakpoint composable
      const { breakpoint, isRetina, orientation } = useScreen()

      if (isDev) {
        console.log('[Core Layer] Screen detection:', {
          breakpoint: breakpoint.value,
          retina: isRetina.value,
          orientation: orientation.value,
        })
      }

      // Test network info composable
      const { connectionQuality, effectiveType, saveData } = useNetworkInfo()

      if (isDev) {
        console.log('[Core Layer] Network detection:', {
          quality: connectionQuality.value,
          type: effectiveType.value,
          dataSaver: saveData.value,
        })
      }

      // Test feature detection composable
      const { grid, subgrid, containerQueries, webGL, darkMode } = useFeatures()

      if (isDev) {
        console.log('[Core Layer] Feature detection:', {
          grid: grid.value,
          subgrid: subgrid.value,
          containerQueries: containerQueries.value,
          webGL: webGL.value,
          darkMode: darkMode.value,
        })
      }

      // Test cache management composable
      const { offlineReady, isOnline: cacheOnline } = useCache()

      if (isDev) {
        console.log('[Core Layer] Cache status:', {
          online: cacheOnline.value,
          offlineReady: offlineReady.value,
        })
      }

      // PWA composable is only available in production
      // Use usePWAInfo() from core layer for PWA status
    }

    // Test rendering mode detection (works on both server and client)
    const { mode, isServer, isClient, isHydrated } = useRendering()

    if (isDev) {
      console.log('[Core Layer] Rendering mode:', {
        mode: mode.value,
        server: isServer.value,
        client: isClient.value,
        hydrated: isHydrated.value,
      })
    }

    // Test environment access (works on both server and client)
    const env = useEnv() as unknown as Record<string, unknown>

    if (isDev) {
      const publicConfig = env.public as Record<string, unknown> | undefined

      console.log('[Core Layer] Environment config loaded:', {
        hasPublicConfig: Boolean(publicConfig),
        publicKeys: Object.keys(publicConfig ?? {}),
      })
    }
  } catch (error) {
    console.error('[Core Layer] Module verification failed:', error)
  }

  // ============================================================
  // 3. App lifecycle hooks (dev logging)
  // ============================================================
  if (isDev) {
    nuxtApp.hook('app:created', () => {
      console.log('✅ [Core Layer] App created')
    })

    nuxtApp.hook('app:beforeMount', () => {
      console.log('⏳ [Core Layer] App mounting...')
    })

    nuxtApp.hook('app:mounted', () => {
      console.log('✅ [Core Layer] App mounted')
    })

    nuxtApp.hook('page:start', () => {
      console.log('📄 [Core Layer] Page navigation started')
    })

    nuxtApp.hook('page:finish', () => {
      console.log('✅ [Core Layer] Page navigation finished')
    })
  }

  // ============================================================
  // 4. Provide global helpers (optional)
  // ============================================================
  // Make core utilities available throughout the app
  return {
    provide: {
      coreLayer: {
        version: '1.0.0',
        initialized: true,
      },
    },
  }
  },
})
