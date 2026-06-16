import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import { TINT_LEVEL_OPACITY, type TintConfig } from '../types/tint'

export function useTint(config: MaybeRefOrGetter<TintConfig>): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const { color, shade = 500, level } = toValue(config)
    let backgroundColor = `var(--ui-color-${color}-${shade})`
    if (color === 'white') backgroundColor = '#ffffff'
    if (color === 'black') backgroundColor = '#000000'

    const opacity = TINT_LEVEL_OPACITY[level] / 100
    return { backgroundColor, opacity }
  })

  return { style }
}
