import { mount } from '@vue/test-utils'
import { computed, useId } from 'vue'
import { describe, expect, it, vi } from 'vite-plus/test'

import Circular from './Circular.vue'

// Nuxt auto-imports these; the plain Vue test environment doesn't.
vi.stubGlobal('computed', computed)
vi.stubGlobal('useId', useId)

describe('ProgressCircular', () => {
  it('exposes the value as a progressbar', () => {
    const root = mount(Circular, { props: { progress: 0.42, label: 'Upload' } }).element

    expect(root.getAttribute('role')).toBe('progressbar')
    expect(root.getAttribute('aria-valuenow')).toBe('42')
    expect(root.getAttribute('aria-valuemin')).toBe('0')
    expect(root.getAttribute('aria-valuemax')).toBe('100')
    expect(root.getAttribute('aria-label')).toBe('Upload')
  })

  it('hides the drawing and the visible percentage from assistive tech', () => {
    const wrapper = mount(Circular, { props: { progress: 0.5 } })

    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('span').attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Progress')
  })
})
