import { computed, toValue, type ComputedRef, type CSSProperties, type MaybeRefOrGetter } from 'vue'

import { TINT_LEVEL_OPACITY, type TintConfig } from '../types/tint'
import { resolveUiColorToken } from '../utils/colorTokens'

export function useTint(config: MaybeRefOrGetter<TintConfig>): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const { color, shade = 500, level } = toValue(config)
    return {
      backgroundColor: resolveUiColorToken({ color, shade }),
      opacity: TINT_LEVEL_OPACITY[level] / 100,
    }
  })

  return { style }
}
