import { describe, expect, it } from 'vitest'

import { resolveUiColorToken } from './colorTokens'

describe('resolveUiColorToken', () => {
  it('defaults to primary-500 when no options are given', () => {
    expect(resolveUiColorToken({})).toBe('var(--ui-color-primary-500)')
  })

  it('uses the provided color and shade', () => {
    expect(resolveUiColorToken({ color: 'secondary', shade: 200 })).toBe(
      'var(--ui-color-secondary-200)'
    )
  })

  it('applies opacity via color-mix', () => {
    expect(resolveUiColorToken({ color: 'primary', shade: 500, opacity: 50 })).toBe(
      'color-mix(in srgb, var(--ui-color-primary-500) 50%, transparent)'
    )
  })

  it('resolves custom color to customColor value', () => {
    expect(resolveUiColorToken({ color: 'custom', customColor: '#123456' })).toBe('#123456')
  })

  it('resolves custom color to transparent when customColor is missing', () => {
    expect(resolveUiColorToken({ color: 'custom' })).toBe('transparent')
  })

  it('resolves transparent color regardless of other options', () => {
    expect(resolveUiColorToken({ color: 'transparent', shade: 900, opacity: 10 })).toBe(
      'transparent'
    )
  })

  it('resolves white without opacity to a hex value', () => {
    expect(resolveUiColorToken({ color: 'white' })).toBe('#ffffff')
  })

  it('resolves white with opacity to an rgb() value', () => {
    expect(resolveUiColorToken({ color: 'white', opacity: 40 })).toBe('rgb(255 255 255 / 0.4)')
  })

  it('resolves black without opacity to a hex value', () => {
    expect(resolveUiColorToken({ color: 'black' })).toBe('#000000')
  })

  it('resolves black with opacity to an rgb() value', () => {
    expect(resolveUiColorToken({ color: 'black', opacity: 25 })).toBe('rgb(0 0 0 / 0.25)')
  })
})
