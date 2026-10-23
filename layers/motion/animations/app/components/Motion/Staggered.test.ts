import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import Staggered from './Staggered.vue'

// Auto-imported from the scroll layer in Nuxt; stubbed here (no Nuxt context in the 'vue' project)
const reduced = ref(false)
vi.stubGlobal('useReducedMotion', () => reduced)

describe('MotionStaggered', () => {
  beforeEach(() => {
    reduced.value = false
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('renders each child once and reveals every one after the stagger', () => {
    const wrapper = mount(Staggered, {
      props: { staggerDelay: 50 },
      slots: { default: '<p>a</p><p>b</p><p>c</p>' },
    })
    const items = wrapper.findAll('p')
    expect(items).toHaveLength(3)
    expect(items.every((p) => !p.classes('animated'))).toBe(true)

    vi.advanceTimersByTime(100)
    expect(items.map((p) => p.classes('animated'))).toEqual([true, true, true])
    expect(items[0]?.classes()).toContain('animate-fade-in')
  })

  it('reveals every child at once, without the animation class, under reduced motion', () => {
    reduced.value = true
    const wrapper = mount(Staggered, { slots: { default: '<p>a</p><p>b</p>' } })
    const items = wrapper.findAll('p')
    expect(items.map((p) => p.classes('animated'))).toEqual([true, true])
    expect(items[0]?.classes()).not.toContain('animate-fade-in')
    expect(wrapper.attributes('data-reduced')).toBe('')
  })
})
