import type { MaybeRef } from 'vue'

export function useMarqueeCopies(
  containerRefs: Ref<HTMLElement[]>,
  copyRefs: Ref<HTMLSpanElement[]>,
  rowCount: MaybeRef<number>
) {
  const copyWidths = ref<number[]>([])
  const calculatedCopies = ref<number[]>([])

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function calculate() {
    const n = unref(rowCount)
    for (let i = 0; i < n; i++) {
      const copy = copyRefs.value[i]
      const container = containerRefs.value[i]
      if (!copy || !container) continue
      const singleWidth = copy.offsetWidth
      if (singleWidth === 0) continue
      const effectiveWidth = Math.max(container.offsetWidth, window.innerWidth)
      const minCopies = Math.ceil((effectiveWidth * 2.5) / singleWidth)
      copyWidths.value[i] = singleWidth
      calculatedCopies.value[i] = Math.max(minCopies, 8)
    }
  }

  function debouncedCalculate() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      calculate()
      debounceTimer = null
    }, 150)
  }

  onMounted(() => {
    nextTick(() => {
      calculate()
      setTimeout(calculate, 100)
    })
    window.addEventListener('resize', debouncedCalculate, { passive: true })
  })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    window.removeEventListener('resize', debouncedCalculate)
  })

  return { copyWidths, calculatedCopies }
}
