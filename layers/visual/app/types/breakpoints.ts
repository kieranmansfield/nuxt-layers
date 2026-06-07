/**
 * Breakpoint Types
 *
 * Centralized breakpoint definitions matching Tailwind defaults.
 * Used for responsive sizing, layouts, and media queries across the design system.
 */

/**
 * Responsive breakpoint names matching Tailwind defaults
 */
export type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Breakpoint values in pixels
 * Matches Tailwind's default breakpoint system
 *
 * @see https://tailwindcss.com/docs/responsive-design
 */
export const BREAKPOINT_VALUES = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/**
 * Type for breakpoint values object
 */
export type BreakpointValues = typeof BREAKPOINT_VALUES

/**
 * Type for individual breakpoint keys
 */
export type BreakpointKey = keyof typeof BREAKPOINT_VALUES

/**
 * Type for breakpoint pixel values
 */
export type BreakpointValue = (typeof BREAKPOINT_VALUES)[BreakpointKey]

/**
 * Device-based breakpoint names
 * Semantic breakpoints based on common device categories
 */
export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

/**
 * Device breakpoint values in pixels
 * Semantic breakpoints for mobile-first responsive design
 *
 * - mobile: 0-639px (default, no min-width)
 * - tablet: 640px+ (tablets and small laptops)
 * - desktop: 1024px+ (laptops and desktops)
 * - wide: 1920px+ (large monitors and 4K displays)
 */
export const DEVICE_BREAKPOINT_VALUES = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  wide: 1920,
} as const

/**
 * Type for device breakpoint values object
 */
export type DeviceBreakpointValues = typeof DEVICE_BREAKPOINT_VALUES

/**
 * Type for individual device breakpoint keys
 */
export type DeviceBreakpointKey = keyof typeof DEVICE_BREAKPOINT_VALUES

/**
 * Type for device breakpoint pixel values
 */
export type DeviceBreakpointValue = (typeof DEVICE_BREAKPOINT_VALUES)[DeviceBreakpointKey]

/**
 * Phone-specific breakpoint names
 * Granular breakpoints for different phone sizes
 */
export type PhoneBreakpoint = 'phone-sm' | 'phone-md' | 'phone-lg'

/**
 * Phone breakpoint values in pixels
 * Covers the range of common smartphone screen sizes
 *
 * - phone-sm: 320px+ (iPhone SE, small Android phones)
 * - phone-md: 375px+ (iPhone 12/13/14, standard phones)
 * - phone-lg: 428px+ (iPhone Pro Max, large Android phones)
 */
export const PHONE_BREAKPOINT_VALUES = {
  'phone-sm': 320,
  'phone-md': 375,
  'phone-lg': 428,
} as const

/**
 * Type for phone breakpoint values object
 */
export type PhoneBreakpointValues = typeof PHONE_BREAKPOINT_VALUES

/**
 * Type for individual phone breakpoint keys
 */
export type PhoneBreakpointKey = keyof typeof PHONE_BREAKPOINT_VALUES

/**
 * Type for phone breakpoint pixel values
 */
export type PhoneBreakpointValue = (typeof PHONE_BREAKPOINT_VALUES)[PhoneBreakpointKey]

/**
 * Tablet-specific breakpoint names
 * Granular breakpoints for different tablet sizes
 */
export type TabletBreakpoint = 'tablet-sm' | 'tablet-md' | 'tablet-lg'

/**
 * Tablet breakpoint values in pixels
 * Covers the range of common tablet screen sizes
 *
 * - tablet-sm: 768px+ (iPad mini, small tablets)
 * - tablet-md: 834px+ (iPad, standard tablets)
 * - tablet-lg: 1024px+ (iPad Pro 11", large tablets)
 */
export const TABLET_BREAKPOINT_VALUES = {
  'tablet-sm': 768,
  'tablet-md': 834,
  'tablet-lg': 1024,
} as const

/**
 * Type for tablet breakpoint values object
 */
export type TabletBreakpointValues = typeof TABLET_BREAKPOINT_VALUES

/**
 * Type for individual tablet breakpoint keys
 */
export type TabletBreakpointKey = keyof typeof TABLET_BREAKPOINT_VALUES

/**
 * Type for tablet breakpoint pixel values
 */
export type TabletBreakpointValue = (typeof TABLET_BREAKPOINT_VALUES)[TabletBreakpointKey]

/**
 * Device orientation types
 * Used for orientation-specific responsive design
 */
export type DeviceOrientation = 'portrait' | 'landscape'

/**
 * Orientation breakpoint configuration
 * Maps orientation to media query conditions
 *
 * Note: These are not pixel-based breakpoints, but media query features
 */
export const ORIENTATION_BREAKPOINTS = {
  portrait: 'portrait',
  landscape: 'landscape',
} as const

/**
 * Type for orientation breakpoints object
 */
export type OrientationBreakpoints = typeof ORIENTATION_BREAKPOINTS

/**
 * Combined breakpoint type (all systems)
 */
export type AllBreakpoints =
  | ResponsiveBreakpoint
  | DeviceBreakpoint
  | PhoneBreakpoint
  | TabletBreakpoint
  | DeviceOrientation
