import { describe, expect, it } from 'vitest'

import { useElementSurface } from './useElementSurface'

describe('useElementSurface', () => {
  it('returns all-undefined style when no props are set', () => {
    expect(useElementSurface({})).toEqual({
      background: undefined,
      color: undefined,
      border: undefined,
      borderRadius: undefined,
      boxShadow: undefined,
    })
  })

  it('maps every prop to its CSS property 1:1', () => {
    expect(
      useElementSurface({
        bg: 'var(--ui-bg-elevated)',
        color: 'var(--ui-text)',
        border: '1px solid var(--ui-border)',
        radius: '0.5rem',
        shadow: '0 4px 12px rgb(0 0 0 / 0.15)',
      })
    ).toEqual({
      background: 'var(--ui-bg-elevated)',
      color: 'var(--ui-text)',
      border: '1px solid var(--ui-border)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)',
    })
  })
})
