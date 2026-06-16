/**
 * Theme layer type definitions
 *
 * Types for accent colors, user preference overrides,
 * and the theme preferences interface.
 */

import type { AccentColor } from '#types'

export type { AccentColor }

export type PreferenceOverride = 'system' | 'on' | 'off'

export type ThemeContrast = 'high' | 'standard'
export type ThemeMotion = 'reduced' | 'full'
export type ThemeTransparency = 'reduced' | 'full'

export type ThemePreferences = {
  accent: AccentColor
  contrast: PreferenceOverride
  motion: PreferenceOverride
  transparency: PreferenceOverride
}
