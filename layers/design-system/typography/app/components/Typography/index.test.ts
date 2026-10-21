import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import ElementTw from '#layers/core/app/components/ElementTw.vue'

import Typography from './index.vue'

const classesOf = (props: Record<string, unknown> = {}) =>
  mount(Typography, {
    props,
    slots: { default: 'Body copy' },
    global: { components: { ElementTw } },
  }).classes()

describe('Typography size', () => {
  it('inherits the surrounding size by default instead of pinning text-base', () => {
    expect(classesOf()).not.toContain('text-base')
  })

  it('still applies an explicit size', () => {
    expect(classesOf({ size: 'lg' })).toContain('text-lg')
  })

  it('applies an explicit step', () => {
    expect(classesOf({ step: 1 })).toContain('text-step-1')
  })
})
