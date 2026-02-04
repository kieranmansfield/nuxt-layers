/**
 * PWA composable for managing Progressive Web App functionality
 *
 * Features:
 * - Install prompt handling
 * - Installation state detection
 *
 * Note: Full PWA features (service worker) are only available in production.
 * In development, this composable provides install prompt handling only.
 *
 * @example
 * ```typescript
 * const {
 *   isInstalled,        // Is PWA installed?
 *   canInstall,         // Can show install prompt?
 *   install,            // Trigger install prompt
 * } = usePWAInfo()
 * ```
 */
export function usePWAInfo() {
  // Install prompt event
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

  // Track if PWA is installed
  const isInstalled = ref(false)

  // Service worker state - only meaningful in production with PWA module
  const needRefresh = ref(false)

  // Can show install prompt
  const canInstall = computed(() => {
    return !isInstalled.value && deferredPrompt.value !== null
  })

  // Update service worker - no-op, handled by PWA module in production
  const updateServiceWorker = async () => {
    // Service worker updates are handled automatically by @vite-pwa/nuxt in production
    // This is a no-op placeholder for API consistency
  }

  // Initialize PWA detection (client-side only)
  onMounted(() => {
    if (!import.meta.client) return

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      deferredPrompt.value = null
    })

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }

    // Check for iOS standalone mode
    if ((window.navigator as Navigator & { standalone?: boolean }).standalone) {
      isInstalled.value = true
    }
  })

  /**
   * Trigger the install prompt
   */
  const install = async () => {
    if (!deferredPrompt.value) {
      return false
    }

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null

    return outcome === 'accepted'
  }

  return {
    // Installation state
    isInstalled: readonly(isInstalled),
    canInstall: readonly(canInstall),
    install,

    // Service worker updates (production only via PWA module)
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
