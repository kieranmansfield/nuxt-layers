import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import { TINT_LEVEL_OPACITY, type TintConfig } from '../types/tint'

export function useTint(config: MaybeRefOrGetter<TintConfig>): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const { color, shade = 500, level } = toValue(config)
    let backgroundColor: string
    if (color === 'white') backgroundColor = '#ffffff'
    else if (color === 'black') backgroundColor = '#000000'
    else backgroundColor = `var(--ui-color-${color}-${shade})`

    const opacity = TINT_LEVEL_OPACITY[level] / 100
    return { backgroundColor, opacity }
  })

  return { style }
}
