// composables/useFeatures.ts
import {
  usePreferredContrast,
  usePreferredDark,
  usePreferredReducedMotion,
  useSessionStorage,
} from '@vueuse/core'
import type { FeatureDetection } from '#layers/core/app/types/detection'
import { computed, watch } from 'vue'

/**
 * Check if CSS feature is supported
 */
function checkCSSSupport(property: string, value?: string): boolean {
  if (!import.meta.client || !window.CSS?.supports) return false
  if (value === undefined) {
    // Single-argument form (e.g., "display: flex")
    return window.CSS.supports(property)
  }
  return window.CSS.supports(property, value)
}

/**
 * Check if :has() selector is supported
 * CSS.supports() doesn't reliably detect selector support, so we test directly
 */
function checkHasSupport(): boolean {
  if (!import.meta.client) return false
  try {
    document.querySelector(':has(*)')
    return true
  } catch {
    return false
  }
}

/**
 * Check if JS API is available
 */
function checkAPI(api: string): boolean {
  if (!import.meta.client) return false
  return api in window
}

/**
 * Get default/empty feature detection object
 */
function getDefaultFeatures(): FeatureDetection {
  return {
    // CSS Features
    grid: false,
    subgrid: false,
    containerQueries: false,
    has: false,
    aspectRatio: false,
    logicalProperties: false,
    backdropFilter: false,

    // JS APIs
    intersectionObserver: false,
    resizeObserver: false,
    serviceWorker: false,
    webGL: false,

    // User Preferences
    darkMode: false,
    reducedMotion: false,
    highContrast: false,

    // Image Formats
    webp: false,
    avif: false,
  }
}

/**
 * Detect all features (client-side only)
 */
function detectFeatures(): FeatureDetection {
  // Return defaults if not on client
  if (!import.meta.client) {
    return getDefaultFeatures()
  }

  // Detect features
  const features: FeatureDetection = {
    // CSS Features
    grid: checkCSSSupport('display', 'grid'),
    subgrid: checkCSSSupport('grid-template-columns', 'subgrid'),
    containerQueries: checkCSSSupport('container-type', 'inline-size'),
    has: checkHasSupport(),
    aspectRatio: checkCSSSupport('aspect-ratio', '1/1'),
    logicalProperties: checkCSSSupport('margin-inline-start', '1px'),
    backdropFilter: checkCSSSupport('backdrop-filter', 'blur(1px)'),

    // JS APIs
    intersectionObserver: checkAPI('IntersectionObserver'),
    resizeObserver: checkAPI('ResizeObserver'),
    serviceWorker: 'serviceWorker' in navigator,
    webGL: !!(
      document.createElement('canvas').getContext('webgl') ||
      document.createElement('canvas').getContext('experimental-webgl')
    ),

    // User Preferences (will be set reactively)
    darkMode: false,
    reducedMotion: false,
    highContrast: false,

    // Image Formats (will be checked async)
    webp: false,
    avif: false,
  }

  return features
}

/**
 * Check if image format is supported
 */
async function checkImageFormat(format: 'webp' | 'avif'): Promise<boolean> {
  if (!import.meta.client) return false

  const testImages = {
    webp: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
    avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=',
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img.width > 0 && img.height > 0)
    img.onerror = () => resolve(false)
    img.src = testImages[format]
  })
}

/**
 * Add feature classes to <html> element
 */
function applyFeatureClasses(features: FeatureDetection) {
  if (!import.meta.client || !document.documentElement) return

  // Remove old classes first
  const htmlClasses = document.documentElement.classList
  const classesToRemove = Array.from(htmlClasses).filter(
    (cls) => cls.startsWith('supports-') || cls.startsWith('no-') || cls.startsWith('has-')
  )
  htmlClasses.remove(...classesToRemove)

  const classes: string[] = []

  // CSS features
  classes.push(features.grid ? 'supports-grid' : 'no-grid')
  classes.push(features.subgrid ? 'supports-subgrid' : 'no-subgrid')
  classes.push(features.containerQueries ? 'supports-container-queries' : 'no-container-queries')
  classes.push(features.has ? 'supports-has' : 'no-has')
  classes.push(features.aspectRatio ? 'supports-aspect-ratio' : 'no-aspect-ratio')
  classes.push(features.backdropFilter ? 'supports-backdrop-filter' : 'no-backdrop-filter')

  // JS APIs
  if (features.intersectionObserver) classes.push('has-intersection-observer')
  if (features.resizeObserver) classes.push('has-resize-observer')
  if (features.serviceWorker) classes.push('has-service-worker')
  if (features.webGL) classes.push('has-webgl')

  // Image formats
  if (features.webp) classes.push('supports-webp')
  if (features.avif) classes.push('supports-avif')

  htmlClasses.add(...classes)
}

/**
 * Feature detection composable
 *
 * Detects CSS features, JS APIs, user preferences, and image format support.
 * Results are cached in sessionStorage (reactive via VueUse) and CSS classes are added to <html>.
 *
 * @returns Feature detection state
 *
 * @example
 * ```typescript
 * const { grid, subgrid, webp, darkMode } = useFeatures()
 *
 * if (!subgrid) {
 *   // Use fallback layout
 * }
 * ```
 */
export function useFeatures() {
  // Use VueUse's reactive sessionStorage with lazy initialization
  const features = useSessionStorage<FeatureDetection>(
    'core-layer:features',
    getDefaultFeatures(), // Start with defaults
    {
      mergeDefaults: true,
    }
  )

  // User preferences (reactive via VueUse)
  const prefersDark = usePreferredDark()
  const prefersReducedMotion = usePreferredReducedMotion()
  const prefersContrast = usePreferredContrast()

  // Only run detection on client
  if (import.meta.client) {
    // Detect features immediately on client
    const detected = detectFeatures()
    features.value = detected

    // Apply initial classes
    applyFeatureClasses(features.value)

    // Watch for changes and reapply classes
    watch(
      features,
      (newFeatures) => {
        applyFeatureClasses(newFeatures)
      },
      { deep: true }
    )

    // Detect image formats asynchronously
    Promise.all([checkImageFormat('webp'), checkImageFormat('avif')]).then(([webp, avif]) => {
      features.value.webp = webp
      features.value.avif = avif
    })
  }

  // Update user preference flags reactively
  watch(
    [prefersDark, prefersReducedMotion, prefersContrast],
    () => {
      features.value.darkMode = prefersDark.value
      features.value.reducedMotion = prefersReducedMotion.value === 'reduce'
      features.value.highContrast = prefersContrast.value === 'more'
    },
    { immediate: true }
  )

  // Return individual feature flags as computed refs
  return {
    // CSS Features
    grid: computed(() => features.value.grid),
    subgrid: computed(() => features.value.subgrid),
    containerQueries: computed(() => features.value.containerQueries),
    has: computed(() => features.value.has),
    aspectRatio: computed(() => features.value.aspectRatio),
    logicalProperties: computed(() => features.value.logicalProperties),
    backdropFilter: computed(() => features.value.backdropFilter),

    // JS APIs
    intersectionObserver: computed(() => features.value.intersectionObserver),
    resizeObserver: computed(() => features.value.resizeObserver),
    serviceWorker: computed(() => features.value.serviceWorker),
    webGL: computed(() => features.value.webGL),

    // User Preferences (reactive)
    darkMode: prefersDark,
    reducedMotion: computed(() => prefersReducedMotion.value === 'reduce'),
    highContrast: computed(() => prefersContrast.value === 'more'),

    // Image Formats
    webp: computed(() => features.value.webp),
    avif: computed(() => features.value.avif),

    // Expose the reactive storage for advanced use (e.g., clearing cache)
    _storage: features,
  }
}
