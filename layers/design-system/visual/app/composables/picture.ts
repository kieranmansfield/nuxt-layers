import type { MaybeRefOrGetter } from 'vue'

import type { PictureProps, ResponsiveSizes, UsePictureReturn } from '../types/media'
import { buildResponsiveSizesQueries } from '../utils/responsiveSizes'

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
  return buildResponsiveSizesQueries(sizes).join(', ')
}

/**
 * Composable for Picture component
 * Computes responsive sizes, formats, and attributes for NuxtPicture
 *
 * @example
 * ```ts
 * const { sizesString, computedFormat } = usePicture(() => sizes, () => format)
 * ```
 */
export function usePicture(
  sizes: MaybeRefOrGetter<PictureProps['sizes']>,
  format?: MaybeRefOrGetter<PictureProps['format']>
): UsePictureReturn {
  const sizesString = computed(() => {
    const s = toValue(sizes)
    if (!s) return '100vw'
    if (typeof s === 'string') return s
    return responsiveSizesToString(s)
  })

  const computedFormat = computed(() => toValue(format) ?? 'webp')

  return {
    sizesString,
    computedFormat,
  }
}
