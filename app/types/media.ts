/**
 * Media Types
 *
 * Type definitions for Picture component and usePicture composable.
 * Provides type-safe image optimization, responsive sizing, and format handling.
 */

/**
 * Supported image formats for optimization
 */
export type ImageFormat = 'avif' | 'webp' | 'jpg' | 'jpeg' | 'png' | 'gif' | 'svg'

/**
 * Image loading strategy
 */
export type ImageLoading = 'lazy' | 'eager'

/**
 * Image fit/object-fit behavior
 */
export type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

/**
 * Re-export breakpoint types for convenience
 */
export type {
  ResponsiveBreakpoint,
  DeviceBreakpoint,
  PhoneBreakpoint,
  TabletBreakpoint,
  DeviceOrientation,
} from '#layers/ui/app/types/breakpoints'

/**
 * Responsive sizes configuration
 * Allows defining different image sizes per breakpoint
 * Supports Tailwind, device, phone, tablet, and orientation breakpoints
 *
 * @example
 * ```ts
 * // Using Tailwind breakpoints
 * const sizes: ResponsiveSizes = {
 *   default: '100vw',
 *   md: '50vw',
 *   lg: '33vw'
 * }
 *
 * // Using device breakpoints
 * const deviceSizes: ResponsiveSizes = {
 *   default: '100vw',
 *   tablet: '768px',
 *   desktop: '1024px'
 * }
 *
 * // Using granular phone breakpoints
 * const phoneSizes: ResponsiveSizes = {
 *   default: '100vw',
 *   'phone-sm': '320px',
 *   'phone-md': '375px',
 *   'phone-lg': '428px'
 * }
 *
 * // Using orientation breakpoints
 * const orientationSizes: ResponsiveSizes = {
 *   default: '100vw',
 *   portrait: '100vw',
 *   landscape: '50vw'
 * }
 * ```
 */
export interface ResponsiveSizes {
  default: string
  // Tailwind breakpoints
  sm?: string
  md?: string
  lg?: string
  xl?: string
  '2xl'?: string
  // Device breakpoints
  mobile?: string
  tablet?: string
  desktop?: string
  wide?: string
  // Phone breakpoints
  'phone-sm'?: string
  'phone-md'?: string
  'phone-lg'?: string
  // Tablet breakpoints
  'tablet-sm'?: string
  'tablet-md'?: string
  'tablet-lg'?: string
  // Orientation breakpoints
  portrait?: string
  landscape?: string
}

/**
 * Props for Picture component
 * Wraps NuxtPicture with sensible defaults and responsive sizing
 */
export interface PictureProps {
  // Required props
  /** Image source URL or path */
  src: string
  /** Alt text for accessibility (required) */
  alt: string

  // Dimensions
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number

  // Responsive sizing
  /**
   * Responsive sizes - can be a string or ResponsiveSizes object
   * @example '(min-width: 1024px) 1024px, 100vw'
   * @example { default: '100vw', md: '50vw', lg: '33vw' }
   */
  sizes?: string | ResponsiveSizes

  // Formats & optimization
  /**
   * Image formats to generate (comma-separated)
   * @example 'avif,webp,jpg'
   * @default 'webp'
   */
  format?: string
  /**
   * Image quality (0-100)
   * @default 80
   */
  quality?: number
  /**
   * Image fit behavior
   * @default 'cover'
   */
  fit?: ImageFit

  // Loading strategy
  /**
   * Loading strategy
   * @default 'lazy'
   */
  loading?: ImageLoading
  /**
   * Fetch priority hint
   * @default 'auto'
   */
  fetchpriority?: 'high' | 'low' | 'auto'

  // Nuxt Image specific
  /** Image provider - defaults to 'ipx' (Nuxt's built-in image optimizer) */
  provider?: 'ipx'
  /** Nuxt Image preset name */
  preset?: string
  /**
   * Pixel density descriptors
   * @example 'x1 x2'
   */
  densities?: string

  // Styling
  /** Class for picture wrapper element */
  class?: string
  /** Class for img element */
  imgClass?: string

  // Performance
  /**
   * Image decoding strategy
   * @default 'async'
   */
  decoding?: 'sync' | 'async' | 'auto'
}

/**
 * Return type for usePicture composable
 */
export interface UsePictureReturn {
  /** Computed sizes attribute string */
  sizesString: import('vue').ComputedRef<string>
  /** Computed format string */
  computedFormat: import('vue').ComputedRef<string>
}
