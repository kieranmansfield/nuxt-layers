import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import Staggered from './Staggered.vue'

describe('MotionStaggered', () => {
  beforeEach(() => vi.useFakeTimers())
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
})
