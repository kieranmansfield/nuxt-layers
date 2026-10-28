import { describe, expect, it } from 'vite-plus/test'

import { useLayoutAttrs } from '../../layers/core/app/composables/useLayoutAttrs'

describe('useLayoutAttrs', () => {
  it('resolves a static token value', () => {
    const { style } = useLayoutAttrs(() => ({ gap: 'md' }))
    expect(style.value.gap).toBe('var(--space-md)')
  })

  it('rejects breakpoint objects on continuous props (fluid by design, spec §15)', () => {
    // @ts-expect-error v6 accepted { default, lg } here and silently used only `default`
    const { style } = useLayoutAttrs(() => ({ gap: { default: 'sm', lg: 'md' } }))
    expect(style.value.gap).toBeDefined()
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
    expect(style.value.padding).toBe('var(--space-lg)')
    expect(style.value.paddingInline).toBe('var(--space-sm)')
    expect(style.value.paddingBlock).toBe('var(--space-xl)')
  })
})
