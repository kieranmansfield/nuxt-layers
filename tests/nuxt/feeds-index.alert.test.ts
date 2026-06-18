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
  },
}))

describe('FeedsIndex alerts', () => {
  it('shows a missing collection warning when the manifest is incomplete', async () => {
    const wrapper = await mountSuspended(FeedsIndex)

    expect(wrapper.text()).toContain(
      'Feed config references collections that content.config.ts does not define'
    )
    expect(wrapper.text()).toContain('Missing collections: portfolio, gallery.')
    expect(wrapper.text()).toContain('No collection feeds are currently exposed.')
  })
})
