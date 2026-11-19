import { describe, expect, it } from 'vite-plus/test'

import { useTint } from './tint'

describe('useTint', () => {
  it('resolves a slot to its ui color token with the level opacity', () => {
    expect(useTint({ color: 'primary', level: 'light' }).style.value).toEqual({
      backgroundColor: 'var(--ui-color-primary-500)',
      opacity: 0.1,
    })
  })

  it('honours shade and the white/black literals', () => {
    expect(
      useTint({ color: 'error', shade: 200, level: 'subtle' }).style.value.backgroundColor
    ).toBe('var(--ui-color-error-200)')
    expect(useTint({ color: 'white', level: 'heavy' }).style.value).toEqual({
      backgroundColor: '#ffffff',
      opacity: 0.5,
    })
  })
})
