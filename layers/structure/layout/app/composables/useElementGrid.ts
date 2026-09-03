import type { CSSProperties } from 'vue'

import type { ResponsiveValue } from '../types/layouts'
import { buildGridPlacementStyle } from '../utils/gridPlacementStyle'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export interface ElementGridProps {
  grid?: boolean | undefined
  cols?: number | string | undefined
  rows?: number | string | undefined
  colStart?: number | ResponsiveValue<number> | undefined
  colSpan?: number | 'full' | ResponsiveValue<number> | undefined
  rowStart?: number | ResponsiveValue<number> | undefined
  rowSpan?: number | ResponsiveValue<number> | undefined
}

function track(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `repeat(${value}, 1fr)` : value
}

export function useElementGrid(props: ElementGridProps): Partial<CSSProperties> {
  const placement = buildGridPlacementStyle({
    colStart: props.colStart,
    colSpan: props.colSpan,
    rowStart: props.rowStart,
    rowSpan: props.rowSpan,
  })

  return {
    ...placement,
    ...(props.grid && {
      display: 'grid',
      gridTemplateColumns: track(props.cols),
      gridTemplateRows: track(props.rows),
    }),
  }
}
