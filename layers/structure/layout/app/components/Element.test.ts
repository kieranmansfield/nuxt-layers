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

  it('merges spacing (via useLayoutAttrs) and grid item-placement styles together', () => {
    const wrapper = mount(Element, {
      props: {
        p: 'md',
        colSpan: 6,
      },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('padding: var(--fluid-space-md)')
    expect(style).toContain('--_ce: 6')
  })
})
