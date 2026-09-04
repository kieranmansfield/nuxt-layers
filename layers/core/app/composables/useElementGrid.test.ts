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

  // display is intentionally NOT set by useElementGrid — useElementLayout owns
  // the hidden > grid > flex > block display priority.
  it('never sets display, even when grid is true', () => {
    const result = useElementGrid({ grid: true, cols: 12 })
    expect(result.display).toBeUndefined()
  })
})
