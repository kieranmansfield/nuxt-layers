import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vite-plus/test'

import Gradient from '../../layers/design-system/visual/app/components/Gradient/index.vue'
import TintOverlay from '../../layers/design-system/visual/app/components/Tint/Overlay.vue'

describe('TintOverlay', () => {
  it('renders the overlay span with the resolved tint styles', async () => {
    const wrapper = await mountSuspended(TintOverlay, {
      props: {
        color: 'primary',
        level: 'medium',
        as: 'section',
      },
      slots: {
        default: 'Overlayed',
      },
    })

    const overlay = wrapper.get('span[aria-hidden="true"]')

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.text()).toContain('Overlayed')
    expect(overlay.attributes('style')).toContain('background-color: var(--ui-color-primary-500)')
    expect(overlay.attributes('style')).toContain('opacity: 0.2')
  })

  it('handles special white and black tint colors', async () => {
    const wrapper = await mountSuspended(TintOverlay, {
      props: {
        color: 'white',
        level: 'heavy',
        as: 'article',
      },
      slots: {
        default: 'Special',
      },
    })

    const overlay = wrapper.get('span[aria-hidden="true"]')

    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(overlay.attributes('style')).toContain('background-color: #ffffff')
    expect(overlay.attributes('style')).toContain('opacity: 0.5')
  })
})

describe('Gradient', () => {
  it('uses the brand preset from app config by default', async () => {
    const wrapper = await mountSuspended(Gradient, {
      props: { target: 'text' },
      slots: {
        default: 'Gradient copy',
      },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('gradient-text')
    expect(wrapper.attributes('style')).toContain(
      'background-image: linear-gradient(to bottom right, var(--ui-color-primary-500), var(--ui-color-secondary-600))'
    )
  })

  it('accepts an inline gradient config and custom element', async () => {
    const wrapper = await mountSuspended(Gradient, {
      props: {
        target: 'text',
        config: {
          shape: 'radial',
          from: {
            color: 'white',
            opacity: 50,
          },
          to: {
            color: 'transparent',
          },
        },
        as: 'strong',
      },
      slots: {
        default: 'Custom',
      },
    })

    expect(wrapper.element.tagName).toBe('STRONG')
    expect(wrapper.attributes('style')).toContain(
      'background-image: radial-gradient(circle, rgb(255 255 255 / 0.5), transparent)'
    )
  })

  it('fills the box as a div by default, and clips to the text as a span', async () => {
    const background = await mountSuspended(Gradient, { props: { preset: 'brand' } })
    const text = await mountSuspended(Gradient, { props: { preset: 'brand', target: 'text' } })

    expect(background.element.tagName).toBe('DIV')
    expect(background.classes()).not.toContain('gradient-text')
    expect(text.element.tagName).toBe('SPAN')
    expect(text.classes()).toContain('gradient-text')
  })
})
