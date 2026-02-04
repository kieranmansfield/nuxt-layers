import {
  BREAKPOINT_VALUES,
  DEVICE_BREAKPOINT_VALUES,
  PHONE_BREAKPOINT_VALUES,
  TABLET_BREAKPOINT_VALUES,
} from '#layers/ui/app/types/breakpoints'
import type { PictureProps, ResponsiveSizes, UsePictureReturn } from '#layers/ui/app/types/media'

/**
 * Convert ResponsiveSizes object to CSS sizes attribute string
 * Supports Tailwind, device, phone, tablet, and orientation breakpoints
 *
 * @example
 * ```ts
 * // Tailwind breakpoints
 * { default: '100vw', md: '50vw', lg: '33vw' }
 * // Returns: '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
 *
 * // Device breakpoints
 * { default: '100vw', tablet: '768px', desktop: '1024px' }
 * // Returns: '(min-width: 1024px) 1024px, (min-width: 640px) 768px, 100vw'
 *
 * // Phone breakpoints
 * { default: '100vw', 'phone-md': '375px', 'phone-lg': '428px' }
 * // Returns: '(min-width: 428px) 428px, (min-width: 375px) 375px, 100vw'
 *
 * // Orientation breakpoints
 * { default: '100vw', portrait: '100vw', landscape: '50vw' }
 * // Returns: '(orientation: landscape) 50vw, (orientation: portrait) 100vw, 100vw'
 * ```
 */
function responsiveSizesToString(sizes: ResponsiveSizes): string {
  // Combine all min-width breakpoints with their values
  const breakpointEntries: Array<{ key: keyof ResponsiveSizes; value: number }> = []

  // Add Tailwind breakpoints
  const tailwindBreakpoints: Array<keyof typeof BREAKPOINT_VALUES> = ['2xl', 'xl', 'lg', 'md', 'sm']
  for (const bp of tailwindBreakpoints) {
    if (sizes[bp]) {
      breakpointEntries.push({ key: bp, value: BREAKPOINT_VALUES[bp] })
    }
  }

  // Add device breakpoints (skip mobile as it's 0px - handled by default)
  const deviceBreakpoints: Array<keyof typeof DEVICE_BREAKPOINT_VALUES> = [
    'wide',
    'desktop',
    'tablet',
  ]
  for (const bp of deviceBreakpoints) {
    if (sizes[bp]) {
      breakpointEntries.push({ key: bp, value: DEVICE_BREAKPOINT_VALUES[bp] })
    }
  }

  // Add phone breakpoints
  const phoneBreakpoints: Array<keyof typeof PHONE_BREAKPOINT_VALUES> = [
    'phone-lg',
    'phone-md',
    'phone-sm',
  ]
  for (const bp of phoneBreakpoints) {
    if (sizes[bp]) {
      breakpointEntries.push({ key: bp, value: PHONE_BREAKPOINT_VALUES[bp] })
    }
  }

  // Add tablet breakpoints
  const tabletBreakpoints: Array<keyof typeof TABLET_BREAKPOINT_VALUES> = [
    'tablet-lg',
    'tablet-md',
    'tablet-sm',
  ]
  for (const bp of tabletBreakpoints) {
    if (sizes[bp]) {
      breakpointEntries.push({ key: bp, value: TABLET_BREAKPOINT_VALUES[bp] })
    }
  }

  // Sort by value descending (largest to smallest)
  breakpointEntries.sort((a, b) => b.value - a.value)

  // Build media queries
  const mediaQueries: string[] = []

  // Add orientation breakpoints first (these are feature queries, not min-width)
  if (sizes.landscape) {
    mediaQueries.push(`(orientation: landscape) ${sizes.landscape}`)
  }
  if (sizes.portrait) {
    mediaQueries.push(`(orientation: portrait) ${sizes.portrait}`)
  }

  // Add min-width breakpoints
  for (const entry of breakpointEntries) {
    const size = sizes[entry.key]
    if (size) {
      mediaQueries.push(`(min-width: ${entry.value}px) ${size}`)
    }
  }

  // Add default size at the end (no media query)
  mediaQueries.push(sizes.default)

  return mediaQueries.join(', ')
}

/**
 * Composable for Picture component
 * Computes responsive sizes, formats, and attributes for NuxtPicture
 *
 * @example
 * ```ts
 * const { sizesString, computedFormat, imgAttrs } = usePicture(props)
 * ```
 */
export function usePicture(props: Partial<PictureProps>): UsePictureReturn {
  /**
   * Compute sizes attribute string
   * Handles both string and ResponsiveSizes object formats
   */
  const sizesString = computed(() => {
    if (!props.sizes) {
      return '100vw' // Default to full viewport width
    }

    if (typeof props.sizes === 'string') {
      return props.sizes
    }

    return responsiveSizesToString(props.sizes)
  })

  /**
   * Compute format string with fallback
   */
  const computedFormat = computed(() => {
    return props.format ?? 'webp'
  })

  return {
    sizesString,
    computedFormat,
  }
}
