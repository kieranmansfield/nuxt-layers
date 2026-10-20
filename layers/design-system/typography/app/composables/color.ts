import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import type { ColorUsage, UiColors } from '../types/colors'

// Takes a getter (`() => color`) when `color` is a destructured prop — passing the bare
// value reads it once at setup and the class never updates.
export function useColor(
  color?: MaybeRefOrGetter<UiColors | undefined>,
  type: ColorUsage = 'text'
) {
  return computed(() => `${type}-${toValue(color) ?? 'default'}`)
}
