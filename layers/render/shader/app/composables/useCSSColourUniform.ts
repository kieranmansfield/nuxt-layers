import { Color, Vector3 } from 'three'
import { uniform } from 'three/tsl'

import { useRootStyleObserver } from './useRootStyleObserver'

/**
 * Creates a TSL vec3 uniform that tracks a CSS custom property (colour).
 * Syncs on mount and whenever :root's class or style changes (theme switches).
 *
 * @example
 * const primaryNode = useCSSColourUniform('--ui-color-primary-500')
 * // Use primaryNode directly inside useShaderStage closures.
 */
export function useCSSColourUniform(varName: string) {
  const node = uniform(new Vector3(0, 0, 0))
  const c = new Color()

  function sync() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    if (!raw) return
    try {
      c.set(raw)
      node.value.set(c.r, c.g, c.b)
    } catch {
      /* unsupported format — leave previous value */
    }
  }

  useRootStyleObserver(sync)

  return node
}
