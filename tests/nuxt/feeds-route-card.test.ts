import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import RouteCard from '../../layers/feeds/app/components/Feeds/RouteCard.vue'
import type { FeedRoute } from '../../layers/feeds/app/utils/feed-catalog'

mockComponent('UCard', {
  template: '<div><slot /></div>',
})

describe('FeedsRouteCard', () => {
  it('mounts inside the Nuxt runtime', async () => {
    const route: FeedRoute = {
      kind: 'format',
      label: 'Atom 1.0',
      path: '/feed/atom',
      format: 'atom',
      contentType: 'application/atom+xml',
    }

    const wrapper = await mountSuspended(RouteCard, {
      props: { route },
    })

    expect(wrapper.text()).toContain('Atom 1.0')
    expect(wrapper.text()).toContain('/feed/atom')
    expect(wrapper.text()).toContain('application/atom+xml')
  })
})
