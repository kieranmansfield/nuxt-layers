import type { ColorUsage, UiColors } from '../types/colors'

const colorMap: Record<UiColors, string> = {
  // Semantic
  dimmed: 'dimmed',
  muted: 'muted',
  toned: 'toned',
  highlighted: 'highlighted',
  inverted: 'inverted',
  default: 'default',

  // Status
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',

  // Nuxt UI core
  primary: 'primary',
  neutral: 'neutral',

  // Custom
  secondary: 'secondary',
  accent: 'accent',

  // Base
  black: 'black',
  white: 'white',
}

export function useColor(color?: UiColors, type: ColorUsage = 'text') {
  return computed(() => {
    const colorName = color ? colorMap[color] : 'default'
    return `${type}-${colorName}`
  })
}
