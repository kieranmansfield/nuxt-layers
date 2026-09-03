import { describe, expect, it } from 'vitest'

import { useElementGrid } from './useElementGrid'

describe('useElementGrid container axis', () => {
  it('returns no grid-template properties when grid is not set', () => {
    const result = useElementGrid({ cols: 12 })
    expect(result.gridTemplateColumns).toBeUndefined()
    expect(result.gridTemplateRows).toBeUndefined()
  })

  it('converts a numeric cols to a repeat() track when grid is set', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.gridTemplateColumns).toBe('repeat(12, 1fr)')
  })

  it('converts a numeric rows to a repeat() track when grid is set', () => {
    const result = useElementGrid({ grid: true, rows: 4 })
    expect(result.gridTemplateRows).toBe('repeat(4, 1fr)')
  })

  it('passes a string cols track through unchanged', () => {
    const result = useElementGrid({ grid: true, cols: '1fr 2fr 1fr' })
    expect(result.gridTemplateColumns).toBe('1fr 2fr 1fr')
  })

  it('sets display: grid when grid is true', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.display).toBe('grid')
  })
})

describe('useElementGrid item axis (delegates to buildGridPlacementStyle)', () => {
  it('sets gridColumn span from a full colSpan', () => {
    // colSpan: 'full' is the only case buildGridPlacementStyle resolves to a
    // direct gridColumn value; a numeric colSpan resolves to --_cs/--_ce vars
    // instead (see gridPlacementStyle.test.ts "returns early for a full colSpan").
    const result = useElementGrid({ colSpan: 'full' })
    expect(result.gridColumn).toBe('1 / -1')
  })

  it('sets --_ce custom property when colSpan is not full', () => {
    const result = useElementGrid({ colStart: 3, colSpan: 6 })
    expect(result['--_cs']).toBe('3')
    expect(result['--_ce']).toBe('6')
  })

  it('produces identical output to buildGridPlacementStyle for the same input', async () => {
    const { buildGridPlacementStyle } = await import('../utils/gridPlacementStyle')
    const direct = buildGridPlacementStyle({ colStart: 2, colSpan: 4, rowSpan: 2 })
    const viaElement = useElementGrid({ colStart: 2, colSpan: 4, rowSpan: 2 })
    expect(viaElement).toMatchObject(direct)
  })
})
