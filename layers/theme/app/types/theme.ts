/**
 * Theme layer type definitions
 *
 * Types for accent colors, user preference overrides,
 * and the theme preferences interface.
 */

export type AccentColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'

export type PreferenceOverride = 'system' | 'on' | 'off'

export interface ThemePreferences {
  accent: AccentColor
  contrast: PreferenceOverride
  motion: PreferenceOverride
  transparency: PreferenceOverride
}
