import type { CSSProperties } from 'vue'

import type { ResponsiveValue } from '../types/layouts'
import { buildGridPlacementStyle } from '../utils/gridPlacementStyle'

export interface ElementGridProps {
  grid?: boolean
  cols?: number | string
  rows?: number | string
  colStart?: number | ResponsiveValue<number>
  colSpan?: number | 'full' | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number | ResponsiveValue<number>
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
