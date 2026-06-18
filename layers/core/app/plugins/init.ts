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

function logCoreDeviceState(isDev: boolean) {
  const device = useDevice()
  if (isDev && device) {
    console.log('[Core Layer] Device detection:', {
      mobile: device.isMobile,
      desktop: device.isDesktop,
      tablet: device.isTablet,
    })
  }
}

function logCoreOnlineState(isDev: boolean) {
  const isOnline = useOnline()
  if (isDev) {
    console.log('[Core Layer] VueUse loaded, online status:', isOnline.value)
  }
}

function logCoreBrowserState(isDev: boolean) {
  const { name, version, engine, os } = useBrowser()

  if (isDev) {
    console.log('[Core Layer] Browser detection:', {
      name: name.value,
      version: version.value,
      engine: engine.value,
      os: os.value,
    })
  }
}

function logCoreScreenState(isDev: boolean) {
  const { breakpoint, isRetina, orientation } = useScreen()

  if (isDev) {
    console.log('[Core Layer] Screen detection:', {
      breakpoint: breakpoint.value,
      retina: isRetina.value,
      orientation: orientation.value,
    })
  }
}

function logCoreNetworkState(isDev: boolean) {
  const { connectionQuality, effectiveType, saveData } = useNetworkInfo()

  if (isDev) {
    console.log('[Core Layer] Network detection:', {
      quality: connectionQuality.value,
      type: effectiveType.value,
      dataSaver: saveData.value,
    })
  }
}

function logCoreFeatureState(isDev: boolean) {
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
}

function logCoreCacheState(isDev: boolean) {
  const { offlineReady, isOnline: cacheOnline } = useCache()

  if (isDev) {
    console.log('[Core Layer] Cache status:', {
      online: cacheOnline.value,
      offlineReady: offlineReady.value,
    })
  }
}

function logCoreClientDiagnostics(isDev: boolean) {
  if (!import.meta.client) return

  logCoreBrowserState(isDev)
  logCoreScreenState(isDev)
  logCoreNetworkState(isDev)
  logCoreFeatureState(isDev)
  logCoreCacheState(isDev)
}

function logCoreRenderingState(isDev: boolean) {
  const { mode, isServer, isClient, isHydrated } = useRendering()

  if (isDev) {
    console.log('[Core Layer] Rendering mode:', {
      mode: mode.value,
      server: isServer.value,
      client: isClient.value,
      hydrated: isHydrated.value,
    })
  }
}

function logCoreEnvironmentState(isDev: boolean) {
  const env = useEnv() as unknown as Record<string, unknown>

  if (isDev) {
    const publicConfig = env.public as Record<string, unknown> | undefined

    console.log('[Core Layer] Environment config loaded:', {
      hasPublicConfig: Boolean(publicConfig),
      publicKeys: Object.keys(publicConfig ?? {}),
    })
  }
}

function verifyCoreLayerModules(isDev: boolean) {
  try {
    logCoreDeviceState(isDev)
    logCoreOnlineState(isDev)
    logCoreClientDiagnostics(isDev)
    logCoreRenderingState(isDev)
    logCoreEnvironmentState(isDev)
  } catch (error) {
    console.error('[Core Layer] Module verification failed:', error)
  }
}

type HookableNuxtApp = Pick<ReturnType<typeof useNuxtApp>, 'hook'>

function registerCoreLayerHooks(nuxtApp: HookableNuxtApp, isDev: boolean) {
  if (!isDev) return

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

export default defineNuxtPlugin({
  name: 'core:init',
  setup(nuxtApp) {
    const config = useAppConfig()
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
      console.log('🚀 [Core Layer] Initializing...')

      console.log('[Core Layer] Config:', config.coreLayer)
    }

    verifyCoreLayerModules(isDev)

    registerCoreLayerHooks(nuxtApp, isDev)

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
