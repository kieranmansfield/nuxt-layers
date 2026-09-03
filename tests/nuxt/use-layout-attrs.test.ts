import { describe, expect, it } from 'vitest'

import { useLayoutAttrs } from '../../layers/core/app/composables/useLayoutAttrs'

describe('useLayoutAttrs', () => {
  it('resolves a static token value', () => {
    const { style } = useLayoutAttrs(() => ({ gap: 'md' }))
    expect(style.value.gap).toBe('var(--fluid-space-md)')
  })

  it('resolves a responsive object to its default value', () => {
    const { style } = useLayoutAttrs(() => ({ gap: { default: 'sm', lg: 'md' } }))
    expect(style.value.gap).toBe('var(--fluid-space-sm)')
  })

  it('omits a property when its value is missing', () => {
    const { style } = useLayoutAttrs(() => ({}))
    expect(style.value.gap).toBeUndefined()
    expect(style.value.alignItems).toBeUndefined()
    expect(style.value.justifyContent).toBeUndefined()
  })

  it('resolves none to a literal 0px, not a css var', () => {
    const { style } = useLayoutAttrs(() => ({ gap: 'none' }))
    expect(style.value.gap).toBe('0px')
  })

  it('resolves align and justify tokens to their css keyword equivalents', () => {
    const { style } = useLayoutAttrs(() => ({ align: 'end', justify: 'between' }))
    expect(style.value.alignItems).toBe('flex-end')
    expect(style.value.justifyContent).toBe('space-between')
  })

  it('resolves p/px/py to distinct css properties', () => {
    const { style } = useLayoutAttrs(() => ({ p: 'lg', px: 'sm', py: 'xl' }))
    expect(style.value.padding).toBe('var(--fluid-space-lg)')
    expect(style.value.paddingInline).toBe('var(--fluid-space-sm)')
    expect(style.value.paddingBlock).toBe('var(--fluid-space-xl)')
  })

  it('prefers the responsive object default over treating it as a bare token', () => {
    const { style } = useLayoutAttrs(() => ({ align: { default: 'center' } }))
    expect(style.value.alignItems).toBe('center')
  })
})
