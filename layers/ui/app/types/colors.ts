/***************************************************************
  UI Primitives - Semantic Color Types

  `UiSemanticColor` defines neutral or semantic colors for general UI elements.
  `UiStatusColor` defines status-related colors (info, success, warning, error).
  `UiCustomColors` defines custom design colors like accent or secondary.
  `UiBaseColor` defines fundamental colors (black, white).
  `UiColors` is the union of all color types and can be applied to text, backgrounds, borders, or other UI elements.
  `ColorUsage` defines the intended usage of a color in a component.
***************************************************************/

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
