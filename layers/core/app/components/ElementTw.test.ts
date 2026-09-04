import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import ElementTw from './ElementTw.vue'

const ColorPropStub = defineComponent({
  props: { color: { type: String, default: undefined } },
  setup(props) {
    return () => h('div', { 'data-received-color': props.color }, 'stub')
  },
})

describe('ElementTw', () => {
  it('renders as a div by default', () => {
    const wrapper = mount(ElementTw)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as the tag passed via the as prop', () => {
    const wrapper = mount(ElementTw, { props: { as: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('renders slot content', () => {
    const wrapper = mount(ElementTw, { slots: { default: 'hello' } })
    expect(wrapper.text()).toBe('hello')
  })

  it('emits merged layout, sizing, and surface styles as tailwind arbitrary-property classes', () => {
    const wrapper = mount(ElementTw, {
      props: {
        flex: true,
        w: '80px',
        bg: 'var(--ui-bg-elevated)',
      },
    })
    const classes = wrapper.classes()
    expect(classes).toContain('[display:flex]')
    expect(classes).toContain('[width:80px]')
    expect(classes).toContain('[background:var(--ui-bg-elevated)]')
  })

  it('gives hidden priority over grid so display:none is not overwritten', () => {
    const wrapper = mount(ElementTw, {
      props: { grid: true, hidden: true },
    })
    const classes = wrapper.classes()
    expect(classes).toContain('[display:none]')
    expect(classes).not.toContain('[display:grid]')
  })

  it('passes componentProps to the resolved component, past a colliding prop name', () => {
    const wrapper = mount(ElementTw, {
      props: {
        as: ColorPropStub,
        color: 'crimson',
        componentProps: { color: 'error' },
      },
    })
    expect(wrapper.classes()).toContain('[color:crimson]')
    expect(wrapper.attributes('data-received-color')).toBe('error')
  })
})
