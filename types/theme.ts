/** @consumers ui, layout, motion, shader, theme */
export type ColourMode = 'light' | 'dark' | 'system'

/** @consumers theme, ui */
export type ContrastLevel = 'standard' | 'high'

/** @consumers motion, layout, theme */
export type MotionPreference = 'full' | 'reduced' | 'none'

/** @consumers theme, ui */
export type TransparencyPreference = 'full' | 'reduced' | 'none'

/** @consumers theme, visual, typography */
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

/** @consumers theme, visual */
export interface ThemeState {
  mode: ColourMode
  palette: string
  contrast: ContrastLevel
  motion: MotionPreference
  transparency: TransparencyPreference
}

/** @consumers theme, ui */
export interface ThemeTokens {
  [key: string]: string
}

// UI semantic colour types (shared with typography and visual layers)
/** @consumers typography, visual, ui */
export type ColorUsage = 'text' | 'bg' | 'border'
export type UiSemanticColor = 'dimmed' | 'muted' | 'toned' | 'default' | 'highlighted' | 'inverted'
export type UiStatusColor = 'info' | 'success' | 'warning' | 'error'
export type UiDefaultNuxtUiColors = 'primary' | 'neutral'
export type UiCustomColors = 'secondary' | 'accent'
export type UiBaseColor = 'black' | 'white'
export type UiColors =
  | UiSemanticColor
  | UiStatusColor
  | UiDefaultNuxtUiColors
  | UiCustomColors
  | UiBaseColor
