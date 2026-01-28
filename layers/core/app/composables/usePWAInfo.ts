import { computed, onMounted, readonly, ref, watch } from 'vue'

/**
 * PWA composable for managing Progressive Web App functionality
 *
 * Features:
 * - Install prompt handling
 * - Service worker updates
 * - Installation state detection
 * - Auto-update flow
 *
 * Note: This composable is SSR-safe. PWA features are only available on the client.
 *
 * @example
 * ```typescript
 * const {
 *   isInstalled,        // Is PWA installed?
 *   canInstall,         // Can show install prompt?
 *   install,            // Trigger install prompt
 *   needRefresh,        // Update available?
 *   updateServiceWorker // Install update
 * } = usePWA()
 * ```
 */
export function usePWAInfo() {
  // Install prompt event
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

  // Track if PWA is installed
  const isInstalled = ref(false)

  // Service worker state (client-only)
  const needRefresh = ref(false)

  // Can show install prompt
  const canInstall = computed(() => {
    return !isInstalled.value && deferredPrompt.value !== null
  })

  // Update service worker function
  const updateServiceWorker = async () => {
    if (!import.meta.client) return

    try {
      const { useRegisterSW } = await import('virtual:pwa-register/vue')
      const sw = useRegisterSW()
      await sw.updateServiceWorker()
    } catch (error) {
      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.error('[PWA] Failed to update service worker:', error)
      }
    }
  }

  // Initialize PWA detection (client-side only)
  onMounted(async () => {
    if (!import.meta.client) return

    // Initialize service worker registration
    try {
      const { useRegisterSW } = await import('virtual:pwa-register/vue')
      const sw = useRegisterSW({
        onRegistered(r) {
          if (import.meta.dev) {
            // eslint-disable-next-line no-console
            console.log('[PWA] Service Worker registered:', r)
          }
        },
        onRegisterError(error) {
          if (import.meta.dev) {
            // eslint-disable-next-line no-console
            console.error('[PWA] Service Worker registration error:', error)
          }
        },
      })

      // Update needRefresh when service worker has an update
      needRefresh.value = sw.needRefresh.value
      watch(sw.needRefresh, (value) => {
        needRefresh.value = value
      })
    } catch (error) {
      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.warn('[PWA] PWA module not available:', error)
      }
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault()
      // Save the event for later use
      deferredPrompt.value = e as BeforeInstallPromptEvent

      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.log('[PWA] Install prompt available')
      }
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      deferredPrompt.value = null

      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.log('[PWA] App installed successfully')
      }
    })

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }

    // Check for iOS standalone mode
    if ((window.navigator as any).standalone) {
      isInstalled.value = true
    }
  })

  /**
   * Trigger the install prompt
   */
  const install = async () => {
    if (!deferredPrompt.value) {
      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.warn('[PWA] Install prompt not available')
      }
      return false
    }

    // Show the install prompt
    deferredPrompt.value.prompt()

    // Wait for user choice
    const { outcome } = await deferredPrompt.value.userChoice

    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.log(`[PWA] User choice: ${outcome}`)
    }

    // Clear the prompt
    deferredPrompt.value = null

    return outcome === 'accepted'
  }

  return {
    // Installation state
    isInstalled: readonly(isInstalled),
    canInstall: readonly(canInstall),
    install,

    // Service worker updates
    needRefresh: readonly(needRefresh),
    updateServiceWorker,
  }
}

/**
 * Type definition for beforeinstallprompt event
 */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}
