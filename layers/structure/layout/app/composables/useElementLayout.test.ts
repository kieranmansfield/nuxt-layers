import { describe, expect, it } from 'vitest'

import { useElementLayout } from './useElementLayout'

describe('useElementLayout', () => {
  it('returns no display when no mode prop is set', () => {
    expect(useElementLayout({})).toEqual({ display: undefined })
  })

  it('resolves block to display: block', () => {
    expect(useElementLayout({ block: true })).toEqual({ display: 'block' })
  })

  it('resolves flex to display: flex', () => {
    expect(useElementLayout({ flex: true })).toEqual({ display: 'flex' })
  })

  it('resolves grid to display: grid', () => {
    expect(useElementLayout({ grid: true })).toEqual({ display: 'grid' })
  })

  it('resolves hidden to display: none', () => {
    expect(useElementLayout({ hidden: true })).toEqual({ display: 'none' })
  })

  it('prioritizes hidden over grid, flex, and block when multiple are set', () => {
    expect(useElementLayout({ hidden: true, grid: true, flex: true, block: true })).toEqual({
      display: 'none',
    })
  })

  it('prioritizes grid over flex and block', () => {
    expect(useElementLayout({ grid: true, flex: true, block: true })).toEqual({
      display: 'grid',
    })
  })

  it('prioritizes flex over block', () => {
    expect(useElementLayout({ flex: true, block: true })).toEqual({ display: 'flex' })
  })
})
