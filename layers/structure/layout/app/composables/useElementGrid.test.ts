import { describe, expect, it } from 'vitest'

import { useElementGrid } from './useElementGrid'

describe('useElementGrid container axis', () => {
  it('returns no grid-template properties when grid is not set', () => {
    const result = useElementGrid({ cols: 12 })
    expect(result.style.gridTemplateColumns).toBeUndefined()
    expect(result.style.gridTemplateRows).toBeUndefined()
  })

  it('converts a numeric cols to a repeat() track when grid is set', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.style.gridTemplateColumns).toBe('repeat(12, 1fr)')
  })

  it('converts a numeric rows to a repeat() track when grid is set', () => {
    const result = useElementGrid({ grid: true, rows: 4 })
    expect(result.style.gridTemplateRows).toBe('repeat(4, 1fr)')
  })

  it('passes a string cols track through unchanged', () => {
    const result = useElementGrid({ grid: true, cols: '1fr 2fr 1fr' })
    expect(result.style.gridTemplateColumns).toBe('1fr 2fr 1fr')
  })

  // display is intentionally NOT set by useElementGrid — useElementLayout owns
  // the hidden > grid > flex > block display priority (finding 3 of the final review).
  it('never sets display, even when grid is true', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.style.display).toBeUndefined()
  })
})

describe('useElementGrid item axis (delegates to buildGridPlacementStyle)', () => {
  it('produces no item-axis style or class when no item-axis prop is set', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.style.gridColumn).toBeUndefined()
    expect(result.style.gridRow).toBeUndefined()
    expect(result.class).toBeUndefined()
  })

  it('sets gridColumn span from a full colSpan and applies the gi-placed class', () => {
    // colSpan: 'full' is the only case buildGridPlacementStyle resolves to a
    // direct gridColumn value; a numeric colSpan resolves to --_cs/--_ce vars
    // instead (see gridPlacementStyle.test.ts "returns early for a full colSpan").
    const result = useElementGrid({ colSpan: 'full' })
    expect(result.style.gridColumn).toBe('1 / -1')
    expect(result.class).toContain('gi-placed')
  })

  it('sets --_ce custom property and the gi-placed class when colSpan is not full', () => {
    const result = useElementGrid({ colStart: 3, colSpan: 6 })
    expect(result.style['--_cs']).toBe('3')
    expect(result.style['--_ce']).toBe('6')
    expect(result.class).toContain('gi-placed')
  })

  it('produces identical style output to buildGridPlacementStyle for the same input', async () => {
    const { buildGridPlacementStyle } = await import('../utils/gridPlacementStyle')
    const direct = buildGridPlacementStyle({ colStart: 2, colSpan: 4, rowSpan: 2 })
    const viaElement = useElementGrid({ colStart: 2, colSpan: 4, rowSpan: 2 })
    expect(viaElement.style).toMatchObject(direct)
  })
})
