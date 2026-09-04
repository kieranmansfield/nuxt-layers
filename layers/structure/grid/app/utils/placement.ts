/** Grid-column value addressing a named-line range. Primary placement method — named
 * lines survive CSS subgrid boundaries, unlike grid-template-areas. */
export function placementFromLines(startLine: string, endLine: string): string {
  return `${startLine} / ${endLine}`
}

/** Numeric fallback for auto-flowing content with no named slot to target. `'full'`
 * spans to the grid's last line (-1), matching the shape of layout's current
 * GridItem colSpan prop for an additive future migration. */
export function placementFromIndex(colStart: number, colSpan: number | 'full'): string {
  if (colSpan === 'full') {
    return `${colStart} / -1`
  }
  return `${colStart} / span ${colSpan}`
}
