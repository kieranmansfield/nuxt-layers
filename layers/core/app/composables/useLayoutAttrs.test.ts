import { describe, expect, it } from 'vitest'

import { useLayoutAttrs } from './useLayoutAttrs'

describe('useLayoutAttrs margin support', () => {
  it('sets margin from a static token', () => {
    const { style } = useLayoutAttrs(() => ({ m: 'md' }))
    expect(style.value.margin).toBe('var(--fluid-space-md)')
  })

  it('sets marginInline from px-equivalent mx', () => {
    const { style } = useLayoutAttrs(() => ({ mx: 'lg' }))
    expect(style.value.marginInline).toBe('var(--fluid-space-lg)')
  })

  it('sets marginBlock from my', () => {
    const { style } = useLayoutAttrs(() => ({ my: 'sm' }))
    expect(style.value.marginBlock).toBe('var(--fluid-space-sm)')
  })

  it('resolves none to 0px for margin', () => {
    const { style } = useLayoutAttrs(() => ({ m: 'none' }))
    expect(style.value.margin).toBe('0px')
  })

  it('omits margin keys entirely when not passed', () => {
    const { style } = useLayoutAttrs(() => ({ gap: 'md' }))
    expect(style.value.margin).toBeUndefined()
    expect(style.value.marginInline).toBeUndefined()
    expect(style.value.marginBlock).toBeUndefined()
  })

  it('does not regress existing gap/align/justify/padding behavior', () => {
    const { style } = useLayoutAttrs(() => ({
      gap: 'md',
      align: 'center',
      justify: 'between',
      p: 'lg',
    }))
    expect(style.value).toEqual({
      gap: 'var(--fluid-space-md)',
      padding: 'var(--fluid-space-lg)',
      alignItems: 'center',
      justifyContent: 'space-between',
    })
  })
})
