import { describe, expect, it } from 'vitest'

import { useElementInteraction } from './useElementInteraction'

describe('useElementInteraction', () => {
  it('returns all-undefined style when no props are set', () => {
    expect(useElementInteraction({})).toEqual({
      cursor: undefined,
      userSelect: undefined,
      pointerEvents: undefined,
    })
  })

  it('maps every prop to its CSS property 1:1', () => {
    expect(
      useElementInteraction({
        cursor: 'pointer',
        select: 'none',
        pointer: 'none',
      })
    ).toEqual({
      cursor: 'pointer',
      userSelect: 'none',
      pointerEvents: 'none',
    })
  })
})
