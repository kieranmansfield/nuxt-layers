import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Element from './Element.vue'

describe('Element', () => {
  it('renders as a div by default', () => {
    const wrapper = mount(Element)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as the tag passed via the as prop', () => {
    const wrapper = mount(Element, { props: { as: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('renders slot content', () => {
    const wrapper = mount(Element, { slots: { default: 'hello' } })
    expect(wrapper.text()).toBe('hello')
  })

  it('merges layout, sizing, and surface styles into one style attribute', () => {
    const wrapper = mount(Element, {
      props: {
        flex: true,
        w: '80px',
        bg: 'var(--ui-bg-elevated)',
      },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('display: flex')
    expect(style).toContain('width: 80px')
    expect(style).toContain('background: var(--ui-bg-elevated)')
  })

  it('applies container-axis grid styles', () => {
    const wrapper = mount(Element, {
      props: { grid: true, cols: 12 },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('display: grid')
    expect(style).toContain('grid-template-columns: repeat(12, 1fr)')
    expect(style).not.toContain('grid-column')
    expect(style).not.toContain('grid-row')
  })

  it('gives hidden priority over grid so display: none is not overwritten', () => {
    const wrapper = mount(Element, {
      props: { grid: true, hidden: true },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('display: none')
    expect(style).not.toContain('display: grid')
  })

  it('reaches margin and padding through useLayoutAttrs', () => {
    const wrapper = mount(Element, {
      props: { m: 'md', p: 'lg' },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('margin: var(--fluid-space-md)')
    expect(style).toContain('padding: var(--fluid-space-lg)')
  })
})
