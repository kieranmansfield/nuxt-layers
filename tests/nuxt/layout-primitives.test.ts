import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppContainer from '../../layers/core/app/components/AppContainer.vue'
import HStack from '../../layers/structure/layout/app/components/HStack.vue'
import Spacer from '../../layers/structure/layout/app/components/Spacer.vue'
import VStack from '../../layers/structure/layout/app/components/VStack.vue'
import ZStack from '../../layers/structure/layout/app/components/ZStack.vue'

describe('HStack', () => {
  it('renders a horizontal flex row with resolved gap', async () => {
    const wrapper = await mountSuspended(HStack, {
      props: { gap: 'md', align: 'center', justify: 'between' },
      slots: { default: '<span>a</span><span>b</span>' },
    })

    expect(wrapper.classes()).toContain('h-stack')
    expect(wrapper.attributes('style')).toContain('gap: var(--fluid-space-md)')
    expect(wrapper.attributes('style')).toContain('align-items: center')
    expect(wrapper.attributes('style')).toContain('justify-content: space-between')
  })

  it('adds the wrap class only when wrap is set', async () => {
    const wrapped = await mountSuspended(HStack, { props: { wrap: true } })
    const unwrapped = await mountSuspended(HStack)

    expect(wrapped.classes()).toContain('h-stack-wrap')
    expect(unwrapped.classes()).not.toContain('h-stack-wrap')
  })
})

describe('VStack', () => {
  it('renders a vertical flex column with resolved gap', async () => {
    const wrapper = await mountSuspended(VStack, { props: { gap: 'lg' } })
    expect(wrapper.classes()).toContain('v-stack')
    expect(wrapper.attributes('style')).toContain('gap: var(--fluid-space-lg)')
  })

  it('nests inside an HStack without losing its own layout attrs', async () => {
    const wrapper = await mountSuspended(HStack, {
      props: { gap: 'sm' },
      slots: {
        default: () => [],
      },
    })
    const nested = await mountSuspended(VStack, { props: { gap: 'xs' } })

    expect(wrapper.attributes('style')).toContain('gap: var(--fluid-space-sm)')
    expect(nested.attributes('style')).toContain('gap: var(--fluid-space-xs)')
  })
})

describe('Spacer', () => {
  it('defaults to flexible remaining space', async () => {
    const wrapper = await mountSuspended(Spacer)
    expect(wrapper.classes()).toContain('spacer')
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('takes a fixed size instead of flexing when provided', async () => {
    const wrapper = await mountSuspended(Spacer, { props: { size: '2rem' } })
    expect(wrapper.attributes('style')).toContain('flex-basis: 2rem')
  })

  it('renders inside an HStack as a direct child', async () => {
    const wrapper = await mountSuspended(HStack, {
      slots: { default: () => [] },
    })
    expect(wrapper.classes()).toContain('h-stack')
  })
})

describe('ZStack', () => {
  it('stacks slotted children on a single shared grid area', async () => {
    const wrapper = await mountSuspended(ZStack, {
      slots: { default: '<div class="a">a</div><div class="b">b</div>' },
    })

    expect(wrapper.classes()).toContain('z-stack')
    expect(wrapper.findAll('div.a, div.b')).toHaveLength(2)
  })
})

describe('AppContainer', () => {
  it.each([
    ['content', 'container-content'],
    ['wide', 'container-wide'],
    ['fluid', 'container-fluid'],
    ['full', 'container-full'],
  ] as const)('maps size=%s to the %s width token class', async (size, expectedClass) => {
    const wrapper = await mountSuspended(AppContainer, { props: { size } })
    expect(wrapper.classes()).toContain(expectedClass)
  })

  it('defaults to the wide size when no size prop is passed', async () => {
    const wrapper = await mountSuspended(AppContainer)
    expect(wrapper.classes()).toContain('container-wide')
  })

  it('renders as the given tag', async () => {
    const wrapper = await mountSuspended(AppContainer, { props: { tag: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
