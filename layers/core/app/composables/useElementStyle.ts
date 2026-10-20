import { computed, type ComputedRef, type CSSProperties } from 'vue'

import { resolveElementStyle, type ElementStyleInput } from '../utils/resolveElementStyle'

/**
 * Reactive wrapper over resolveElementStyle. Takes a getter so callers can pass their
 * `defineProps` result directly (`useElementStyle(() => props)`) and keep reactivity.
 */
export function useElementStyle(getProps: () => ElementStyleInput): ComputedRef<CSSProperties> {
  return computed(() => resolveElementStyle(getProps()))
}
