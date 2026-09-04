/**
 * Breakpoint Types
 *
 * Centralized breakpoint definitions matching Tailwind defaults.
 * Used for responsive sizing, layouts, and media queries across the design system.
 */

import { BREAKPOINT_PX } from '#layers/core/types/tokens'

/**
 * Breakpoint values in pixels
 * Matches Tailwind's default breakpoint system
 *
 * sm/md/lg/xl repoint at layers/core's canonical BREAKPOINT_PX (same values,
 * one source) — see nuxt-declarative-layout-system-spec.md §14/Phase 3.
 * '2xl' has no core equivalent yet, so it stays hand-written here.
 *
 * @see https://tailwindcss.com/docs/responsive-design
 */
export const BREAKPOINT_VALUES = {
  ...BREAKPOINT_PX,
  '2xl': 1536,
} as const

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
