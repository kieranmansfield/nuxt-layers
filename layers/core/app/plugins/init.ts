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
export default defineNuxtPlugin((nuxtApp) => {
  const config = useAppConfig()
  const isDev = import.meta.dev

  // ============================================================
  // 1. Log initialization (dev only)
  // ============================================================
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('🚀 [Core Layer] Initializing...')
    // eslint-disable-next-line no-console
    console.log('[Core Layer] Config:', config.coreLayer)
  }

  // ============================================================
  // 2. Verify modules and composables are loaded
  // ============================================================
  try {
    // Test @nuxtjs/device module
    const { isMobile, isDesktop, isTablet } = useDevice()

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('[Core Layer] Device detection:', {
        mobile: isMobile,
        desktop: isDesktop,
        tablet: isTablet,
      })
    }

    // Test @vueuse/nuxt module
    const isOnline = useOnline()

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('[Core Layer] VueUse loaded, online status:', isOnline.value)
    }

    // Client-only detection (requires browser APIs)
    if (import.meta.client) {
      // Test browser detection composable
      const { name, version, engine, os } = useBrowser()

      if (isDev) {
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.log('[Core Layer] Screen detection:', {
          breakpoint: breakpoint.value,
          retina: isRetina.value,
          orientation: orientation.value,
        })
      }

      // Test network info composable
      const { connectionQuality, effectiveType, saveData } = useNetworkInfo()

      if (isDev) {
        // eslint-disable-next-line no-console
        console.log('[Core Layer] Network detection:', {
          quality: connectionQuality.value,
          type: effectiveType.value,
          dataSaver: saveData.value,
        })
      }

      // Test feature detection composable
      const { grid, subgrid, containerQueries, webGL, darkMode } = useFeatures()

      if (isDev) {
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.log('[Core Layer] Rendering mode:', {
        mode: mode.value,
        server: isServer.value,
        client: isClient.value,
        hydrated: isHydrated.value,
      })
    }

    // Test environment access (works on both server and client)
    const env = useEnv()

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('[Core Layer] Environment config loaded:', {
        hasPublicConfig: !!env.public,
        publicKeys: Object.keys(env.public || {}),
      })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Core Layer] Module verification failed:', error)
  }

  // ============================================================
  // 3. App lifecycle hooks (dev logging)
  // ============================================================
  if (isDev) {
    nuxtApp.hook('app:created', () => {
      // eslint-disable-next-line no-console
      console.log('✅ [Core Layer] App created')
    })

    nuxtApp.hook('app:beforeMount', () => {
      // eslint-disable-next-line no-console
      console.log('⏳ [Core Layer] App mounting...')
    })

    nuxtApp.hook('app:mounted', () => {
      // eslint-disable-next-line no-console
      console.log('✅ [Core Layer] App mounted')
    })

    nuxtApp.hook('page:start', () => {
      // eslint-disable-next-line no-console
      console.log('📄 [Core Layer] Page navigation started')
    })

    nuxtApp.hook('page:finish', () => {
      // eslint-disable-next-line no-console
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
})
