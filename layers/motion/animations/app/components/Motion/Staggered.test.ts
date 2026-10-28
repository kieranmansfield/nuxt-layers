import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import Staggered from './Staggered.vue'

// Auto-imported from the scroll layer in Nuxt; stubbed here (no Nuxt context in the 'vue' project)
const reduced = ref(false)
vi.stubGlobal('useReducedMotion', () => reduced)

describe('MotionStaggered', () => {
  beforeEach(() => {
    reduced.value = false
  })

  it('animates each child once, offset by the stagger, and marks itself ready', () => {
    const wrapper = mount(Staggered, {
      props: { preset: 'rise', stagger: 50, delay: 20 },
      slots: { default: '<p>a</p><p>b</p><p>c</p>' },
    })
    const items = wrapper.findAll('p')
    expect(items).toHaveLength(3)
    expect(items.every((p) => p.classes('motion-enter'))).toBe(true)
    expect(items.map((p) => (p.element as HTMLElement).style.animationDelay)).toEqual([
      '20ms',
      '70ms',
      '120ms',
    ])
    expect(wrapper.attributes('data-motion-preset')).toBe('rise')
    expect(wrapper.attributes('data-ready')).toBe('')
  })

  it('resolves a duration token to milliseconds', () => {
    const wrapper = mount(Staggered, { props: { duration: 'fast' } })
    expect(wrapper.attributes('style')).toContain('--motion-duration: 150ms')
  })

  it('shows every child without animating under reduced motion', () => {
    reduced.value = true
    const wrapper = mount(Staggered, { slots: { default: '<p>a</p><p>b</p>' } })
    const items = wrapper.findAll('p')
    expect(items.some((p) => p.classes('motion-enter'))).toBe(false)
    expect(wrapper.attributes('data-ready')).toBe('')
  })
})
