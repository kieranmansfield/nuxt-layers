import { uniform } from 'three/tsl'

import { useRootStyleObserver } from './useRootStyleObserver'

/**
 * Creates a TSL float uniform that tracks a numeric CSS custom property.
 * Syncs on mount and whenever :root's class or style changes (theme switches).
 *
 * @example
 * const spacingNode = useCSSFloatUniform('--spacing-scale')
 */
export function useCSSFloatUniform(varName: string) {
  const node = uniform(0)

  function sync() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    // oxlint-disable-next-line prefer-number-coercion -- parseFloat tolerates unit suffixes; Number('') is 0, not NaN
    const val = parseFloat(raw)
    if (!isNaN(val)) node.value = val
  }

  useRootStyleObserver(sync)

  return node
}
