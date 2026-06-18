import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RouteCard from '../../layers/feeds/app/components/Feeds/RouteCard.vue'

const cardStub = {
  template: '<div><slot /></div>',
}

describe('FeedsRouteCard smoke', () => {
  it('renders the JSON route tone and label', () => {
    const wrapper = mount(RouteCard, {
      props: {
        route: {
          kind: 'format',
          label: 'JSON Feed 1.1',
          path: '/feed/json',
          format: 'json',
          contentType: 'application/feed+json',
        },
        compact: true,
      },
      global: {
        stubs: {
          UCard: cardStub,
        },
      },
    })

    expect(wrapper.text()).toContain('JSON Feed 1.1')
    expect(wrapper.text()).toContain('/feed/json')
    expect(wrapper.find('.bg-amber-500').exists()).toBe(true)
  })
})
