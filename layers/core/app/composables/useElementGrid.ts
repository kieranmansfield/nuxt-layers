import type { CSSProperties } from 'vue'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type ElementGridProps = {
  grid?: boolean | undefined
  cols?: number | string | undefined
  rows?: number | string | undefined
}

function track(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `repeat(${value}, 1fr)` : value
}

// Container axis only ("I am a grid"). Item placement (colStart/colSpan/rowStart/
// rowSpan) is deliberately out of scope here — that engine (buildGridPlacementStyle,
// layers/structure/layout) lives in the layout layer, and Element itself lives in
// core (used across every layer) so it can't depend on layout. Use LayoutGridItem
// directly for item placement inside a grid built with Element.
export function useElementGrid(props: ElementGridProps): Partial<CSSProperties> {
  return {
    // `display` is intentionally NOT set here — useElementLayout already maps
    // grid: true -> display: 'grid' and owns the hidden > grid > flex > block priority.
    ...(props.grid && {
      gridTemplateColumns: track(props.cols),
      gridTemplateRows: track(props.rows),
    }),
  }
}
