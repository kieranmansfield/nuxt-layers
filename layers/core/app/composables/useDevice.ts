// composables/useDevice.ts
// Device detection composable for Nuxt layers
// Wraps @nuxtjs/device (if available) and provides SSR/client fallback

/**
 * Device detection composable
 *
 * Returns booleans for isMobile, isTablet, isDesktop
 * Uses @nuxtjs/device if available, otherwise falls back to user agent sniffing (client only)
 */
export function useDevice() {
  const nuxtApp = useNuxtApp()
  // @nuxtjs/device injects $device into Nuxt app context
  const device = nuxtApp.$device

  // If @nuxtjs/device is present, use it
  if (device) {
    return {
      isMobile: computed(() => device.isMobile),
      isTablet: computed(() => device.isTablet),
      isDesktop: computed(() => device.isDesktop),
    }
  }

  // Fallback: basic user agent detection (client only)
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTablet = /Tablet|iPad/i.test(ua)
  const isDesktop = !isMobile && !isTablet

  return {
    isMobile: computed(() => isMobile),
    isTablet: computed(() => isTablet),
    isDesktop: computed(() => isDesktop),
  }
}
