import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import Headline from './Headline.vue'

const render = (props: Record<string, unknown>) =>
  mount(Headline, { props, slots: { default: 'Title' } })
const classesOf = (props: Record<string, unknown>) => render(props).classes()
const styleOf = (props: Record<string, unknown>) => render(props).attributes('style') ?? ''

describe('Headline step', () => {
  it('steps each level down from the display step by default', () => {
    expect(styleOf({ level: 1 })).toContain('--step: var(--step-display)')
    expect(styleOf({ level: 2 })).toContain('--step: calc(var(--step-display) - 1)')
    expect(styleOf({ level: 6 })).toContain('--step: calc(var(--step-display) - 5)')
    expect(classesOf({ level: 2 }).filter((c) => c.startsWith('text-step-'))).toEqual([])
  })

  it('drops the default step when an explicit size is given', () => {
    const wrapper = render({ level: 2, size: 'sm' })
    expect(wrapper.classes()).toContain('text-sm')
    expect(wrapper.attributes('style') ?? '').not.toContain('--step')
  })

  it('leaves line height to the step unless leading is given', () => {
    expect(classesOf({ level: 2 }).filter((c) => c.startsWith('leading-'))).toEqual([])
    expect(classesOf({ level: 2, leading: 'leading-tight' })).toContain('leading-tight')
  })

  it('lets an explicit step win over size and the default', () => {
    const wrapper = render({ level: 2, size: 'sm', step: 5 })
    expect(wrapper.classes()).toContain('text-step-5')
    expect(wrapper.classes()).not.toContain('text-sm')
    expect(wrapper.attributes('style') ?? '').not.toContain('--step')
  })
})
