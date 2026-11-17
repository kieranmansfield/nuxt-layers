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
