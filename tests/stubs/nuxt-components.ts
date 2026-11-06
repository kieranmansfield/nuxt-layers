import { h, type FunctionalComponent } from 'vue'

export const ULink: FunctionalComponent<{ to: unknown }> = (props, { slots }) =>
  h('a', { 'data-to': JSON.stringify(props.to) }, slots.default?.())
