import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RouteCard from '../../layers/feeds/app/components/Feeds/RouteCard.vue'
import type { FeedRoute } from '../../layers/feeds/app/utils/feed-catalog'

const cardStub = {
  template: '<div><slot /></div>',
}

describe('FeedsRouteCard', () => {
  it('renders the index route description', () => {
    const route: FeedRoute = {
      kind: 'index',
      label: 'Feed index',
      path: '/feed',
    }

    const wrapper = mount(RouteCard, {
      props: { route },
      global: {
        stubs: {
          UCard: cardStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Feed index')
    expect(wrapper.text()).toContain('/feed')
    expect(wrapper.text()).toContain('Human landing page for the feed catalog.')
  })

  it('renders the format route content type', () => {
    const route: FeedRoute = {
      kind: 'format',
      label: 'RSS 2.0',
      path: '/feed/rss',
      format: 'rss',
      contentType: 'application/rss+xml',
    }

    const wrapper = mount(RouteCard, {
      props: { route, compact: true },
      global: {
        stubs: {
          UCard: cardStub,
        },
      },
    })

    expect(wrapper.text()).toContain('RSS 2.0')
    expect(wrapper.text()).toContain('/feed/rss')
    expect(wrapper.text()).toContain('application/rss+xml')
  })
})
