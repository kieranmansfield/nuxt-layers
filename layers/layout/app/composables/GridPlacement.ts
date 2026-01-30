/**
 * Grid Placement Composable
 *
 * Generates grid-column and grid-row styles for positioning elements
 * on the Swiss Grid System.
 *
 * Note: Currently not used - BaseGridItem inlines this logic for better
 * reactivity. Kept for reference or future use.
 *
 * @example
 * const { style } = useGridPlacement({ colStart: 2, colSpan: 10 })
 */
import type { MaybeRefOrGetter } from 'vue'

interface GridPlacement {
  colStart?: number
  colSpan?: number
  rowStart?: number
  rowSpan?: number
}

export function useGridPlacement(props: MaybeRefOrGetter<GridPlacement>) {
  const style = computed(() => {
    const p = toValue(props)
    return {
      gridColumn: `${p.colStart ?? 'auto'} / span ${p.colSpan ?? 1}`,
      gridRow: `${p.rowStart ?? 'auto'} / span ${p.rowSpan ?? 1}`,
    }
  })

  return { style }
}
