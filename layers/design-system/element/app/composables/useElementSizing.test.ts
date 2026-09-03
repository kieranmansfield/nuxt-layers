import { describe, expect, it } from 'vitest'

import { useElementSizing } from './useElementSizing'

describe('useElementSizing', () => {
  it('returns all-undefined style when no props are set', () => {
    expect(useElementSizing({})).toEqual({
      width: undefined,
      height: undefined,
      minWidth: undefined,
      maxWidth: undefined,
      minHeight: undefined,
      maxHeight: undefined,
      aspectRatio: undefined,
    })
  })

  it('maps every prop to its CSS property 1:1', () => {
    expect(
      useElementSizing({
        w: '80px',
        h: '40px',
        minW: '10rem',
        maxW: '20rem',
        minH: '5rem',
        maxH: '15rem',
        aspect: '16 / 9',
      })
    ).toEqual({
      width: '80px',
      height: '40px',
      minWidth: '10rem',
      maxWidth: '20rem',
      minHeight: '5rem',
      maxHeight: '15rem',
      aspectRatio: '16 / 9',
    })
  })
})
