import type { CSSProperties } from 'vue'

import type { ResponsiveValue } from '../types/layouts'
import { buildGridPlacementClasses, buildGridPlacementStyle } from '../utils/gridPlacementStyle'

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

export interface ElementGridResult {
  style: Partial<CSSProperties>
  class?: string | undefined
}

function track(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `repeat(${value}, 1fr)` : value
}

function hasItemPlacement(props: ElementGridProps): boolean {
  return (
    props.colStart !== undefined ||
    props.colSpan !== undefined ||
    props.rowStart !== undefined ||
    props.rowSpan !== undefined
  )
}

export function useElementGrid(props: ElementGridProps): ElementGridResult {
  // Only compute item-axis placement when an item-axis prop was actually set —
  // buildGridPlacementStyle defaults an absent colSpan to 'full' (correct for
  // LayoutGridItem, which is always a grid item; wrong for Element, which usually isn't one).
  const placement = hasItemPlacement(props)
    ? buildGridPlacementStyle({
        colStart: props.colStart,
        colSpan: props.colSpan,
        rowStart: props.rowStart,
        rowSpan: props.rowSpan,
      })
    : {}

  return {
    style: {
      ...placement,
      // `display` is intentionally NOT set here — useElementLayout already maps
      // grid: true -> display: 'grid' and owns the hidden > grid > flex > block priority.
      ...(props.grid && {
        gridTemplateColumns: track(props.cols),
        gridTemplateRows: track(props.rows),
      }),
    },
    // The item-axis placement above only sets --_cs/--_ce/--_rs/--_re custom properties;
    // they're inert without the .gi-placed class (see Element.vue's duplicated CSS rule).
    class: hasItemPlacement(props) ? buildGridPlacementClasses({}) : undefined,
  }
}
