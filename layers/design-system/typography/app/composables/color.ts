import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import type { ColorUsage, UiColors } from '../types/colors'

/** Pure class builder behind useColor, for callers that resolve many colours at once. */
export function colorClass(color: UiColors | undefined, type: ColorUsage = 'text'): string {
  return `${type}-${color ?? 'default'}`
}

// Takes a getter (`() => color`) when `color` is a destructured prop — passing the bare
// value reads it once at setup and the class never updates.
export function useColor(
  color?: MaybeRefOrGetter<UiColors | undefined>,
  type: ColorUsage = 'text'
) {
  return computed(() => colorClass(toValue(color), type))
}
