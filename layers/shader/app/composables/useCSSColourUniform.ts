import { Color, Vector3 } from 'three'
import { uniform } from 'three/tsl'

/**
 * Creates a TSL vec3 uniform that tracks a CSS custom property (colour).
 * Syncs on mount and whenever :root's class or style changes (theme switches).
 *
 * @example
 * const primaryNode = useCSSColourUniform('--ui-color-primary-500')
 * // Use primaryNode directly inside useShaderStage closures.
 */
export function useCSSColourUniform(varName: string) {
  // @ts-ignore — TSL uniform types
  const node = uniform(new Vector3(0, 0, 0))
  const c = new Color()

  function sync() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    if (!raw) return
    try {
      c.set(raw)
      // @ts-ignore
      node.value.set(c.r, c.g, c.b)
    }
    catch { /* unsupported format — leave previous value */ }
  }

  onMounted(() => {
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    onUnmounted(() => observer.disconnect())
  })

  return node
}
