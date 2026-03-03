import type { CSSProperties, ComputedRef } from 'vue'
import { TINT_LEVEL_OPACITY } from '../types/tint'
import type { TintConfig } from '../types/tint'

export function useTint(config: TintConfig): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const { color, shade = 500 } = config
    let backgroundColor: string
    if (color === 'white') backgroundColor = '#ffffff'
    else if (color === 'black') backgroundColor = '#000000'
    else backgroundColor = `var(--ui-color-${color}-${shade})`

    const opacity = TINT_LEVEL_OPACITY[config.level] / 100
    return { backgroundColor, opacity }
  })

  return { style }
}
