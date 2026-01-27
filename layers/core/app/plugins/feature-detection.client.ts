// plugins/feature-detection.client.ts

/**
 * Feature Detection Plugin (Client-only)
 *
 * Runs on app startup to:
 * - Detect CSS features, JS APIs, user preferences, image formats
 * - Apply feature classes to <html> element
 * - Store results in sessionStorage
 *
 * This ensures feature detection happens automatically on every page load,
 * making feature flags available immediately to all components.
 */
export default defineNuxtPlugin(() => {
  // Initialize feature detection
  const features = useFeatures()

  if (import.meta.dev) {
    // eslint-disable-next-line no-console
    console.log('[Feature Detection] Initialized:', {
      grid: features.grid.value,
      subgrid: features.subgrid.value,
      containerQueries: features.containerQueries.value,
      has: features.has.value,
      webGL: features.webGL.value,
      darkMode: features.darkMode.value,
      reducedMotion: features.reducedMotion.value,
      webp: features.webp.value,
      avif: features.avif.value,
    })
  }
})
