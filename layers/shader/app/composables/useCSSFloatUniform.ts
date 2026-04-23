import { uniform } from 'three/tsl'

/**
 * Creates a TSL float uniform that tracks a numeric CSS custom property.
 * Syncs on mount and whenever :root's class or style changes (theme switches).
 *
 * @example
 * const spacingNode = useCSSFloatUniform('--spacing-scale')
 */
export function useCSSFloatUniform(varName: string) {
  // @ts-ignore — TSL uniform types
  const node = uniform(0)

  function sync() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    const val = parseFloat(raw)
    // @ts-ignore
    if (!isNaN(val)) node.value = val
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
