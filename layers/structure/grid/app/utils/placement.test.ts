import { describe, expect, it } from 'vitest'

import { placementFromIndex, placementFromLines } from './placement'

describe('placementFromLines', () => {
  it('joins two named lines with a slash', () => {
    expect(placementFromLines('feature-start', 'aside-end')).toBe('feature-start / aside-end')
  })
})

describe('placementFromIndex', () => {
  it('builds a numeric span from colStart and colSpan', () => {
    expect(placementFromIndex(2, 3)).toBe('2 / span 3')
  })

  it('spans to the last line when colSpan is "full"', () => {
    expect(placementFromIndex(4, 'full')).toBe('4 / -1')
  })
})
