import type { ColorUsage, UiColors } from '../types/colors'

export function useColor(color?: UiColors, type: ColorUsage = 'text') {
  return computed(() => `${type}-${color ?? 'default'}`)
}
