import { mockComponent, mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import FeedsIndex from '../../layers/feeds/app/components/Feeds/Index.vue'

mockComponent('UCard', {
  template: '<div><slot /></div>',
})

mockComponent('UBadge', {
  template: '<span><slot /></span>',
})

mockComponent('UAlert', {
  props: ['title', 'description'],
  template: '<aside><h2>{{ title }}</h2><p>{{ description }}</p><slot /></aside>',
})

mockComponent('UIcon', {
  template: '<span />',
})

vi.mock('#content/manifest', () => ({
  default: {
    blog: { type: 'page' },
    portfolio: { type: 'page' },
    gallery: { type: 'page' },
  },
}))

describe('FeedsIndex smoke', () => {
  it('renders the catalog summary with the default app config', async () => {
    const wrapper = await mountSuspended(FeedsIndex)

    expect(wrapper.text()).toContain('Feed catalog for Nuxt Layers Playground')
    expect(wrapper.text()).toContain('Default')
    expect(wrapper.text()).toContain('blog')
    expect(wrapper.text()).toContain('2 collections')
    expect(wrapper.text()).toContain('Portfolio')
    expect(wrapper.text()).toContain('Gallery')
  })
})
