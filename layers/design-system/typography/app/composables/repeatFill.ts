import type { MaybeRef, ShallowRef } from 'vue'

// Static counterpart to animations layer's useMarqueeCopies — computes how many
// copies of a row's text are needed to fill its container edge-to-edge, no motion.
export function useRepeatFill(options: {
  containerRefs: Readonly<ShallowRef<HTMLElement[] | null>>
  itemRefs: Ref<HTMLElement[]>
  rowCount: MaybeRef<number>
  axis: MaybeRef<'width' | 'height'>
}) {
  const { containerRefs, itemRefs, rowCount, axis } = options
  const calculatedCopies = ref<number[]>([])

  function calculate() {
    const n = unref(rowCount)
    const dimension = unref(axis) === 'height' ? 'offsetHeight' : 'offsetWidth'
    for (let i = 0; i < n; i++) {
      const item = itemRefs.value[i]
      const container = containerRefs.value?.[i]
      if (!item || !container) continue
      const singleSize = item[dimension]
      if (singleSize === 0) continue
      calculatedCopies.value[i] = Math.max(1, Math.ceil(container[dimension] / singleSize))
    }
  }

  useMeasureOnResize(calculate)

  return { calculatedCopies }
}
