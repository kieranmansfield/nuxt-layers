// composables/useScreen.ts
import { useBreakpoints, useScreenOrientation } from '@vueuse/core'
import { breakpointsTailwind } from '@vueuse/core'
import { computed } from 'vue'

/**
 * Screen size and orientation composable
 *
 * Wraps VueUse's useBreakpoints (Tailwind) and useScreenOrientation
 * with additional helper computed values.
 *
 * Tailwind breakpoints:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * @returns Screen state and breakpoint information
 */
export function useScreen() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const { orientation, angle, isSupported } = useScreenOrientation()

  // Breakpoint helpers
  const isMobile = breakpoints.smaller('md') // < 768px
  const isTablet = breakpoints.between('md', 'lg') // 768px - 1023px
  const isDesktop = breakpoints.greaterOrEqual('lg') // >= 1024px
  const isLargeDesktop = breakpoints.greaterOrEqual('xl') // >= 1280px
  const isExtraLargeDesktop = breakpoints.greaterOrEqual('2xl') // >= 1536px

  // Current breakpoint name
  const breakpoint = computed<'mobile' | 'tablet' | 'desktop' | 'xl' | '2xl'>(
    () => {
      if (isExtraLargeDesktop.value) return '2xl'
      if (isLargeDesktop.value) return 'xl'
      if (isDesktop.value) return 'desktop'
      if (isTablet.value) return 'tablet'
      return 'mobile'
    },
  )

  // Orientation helpers
  const isPortrait = computed(() => orientation.value === 'portrait-primary')
  const isLandscape = computed(() => orientation.value === 'landscape-primary')

  // Device pixel ratio (retina detection)
  const pixelRatio = computed(() => {
    if (import.meta.client) {
      return window.devicePixelRatio || 1
    }
    return 1
  })

  const isRetina = computed(() => pixelRatio.value >= 2)

  // Screen dimensions (client-only)
  const width = computed(() => {
    if (import.meta.client) {
      return window.innerWidth
    }
    return 0
  })

  const height = computed(() => {
    if (import.meta.client) {
      return window.innerHeight
    }
    return 0
  })

  return {
    // Breakpoint state
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLargeDesktop,

    // Orientation state
    orientation,
    angle,
    isPortrait,
    isLandscape,
    isOrientationSupported: isSupported,

    // Display quality
    pixelRatio,
    isRetina,

    // Dimensions
    width,
    height,

    // Raw breakpoints instance (for advanced usage)
    breakpoints,
  }
}
