import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import Headline from './Headline.vue'

const classesOf = (props: Record<string, unknown>) =>
  mount(Headline, { props, slots: { default: 'Title' } }).classes()

describe('Headline step', () => {
  it('defaults each level to its step', () => {
    expect(classesOf({ level: 1 })).toContain('text-step-display')
    expect(classesOf({ level: 2 })).toContain('text-step-3')
    expect(classesOf({ level: 3 })).toContain('text-step-2')
    expect(classesOf({ level: 4 })).toContain('text-step-1')
    expect(classesOf({ level: 5 })).toContain('text-step-0')
    expect(classesOf({ level: 6 })).toContain('text-step-0')
  })

  it('drops the default step when an explicit size is given', () => {
    const classes = classesOf({ level: 2, size: 'sm' })
    expect(classes).toContain('text-sm')
    expect(classes.filter((c) => c.startsWith('text-step-'))).toEqual([])
  })

  it('lets an explicit step win over size', () => {
    const classes = classesOf({ level: 2, size: 'sm', step: 5 })
    expect(classes).toContain('text-step-5')
    expect(classes).not.toContain('text-sm')
  })
})
