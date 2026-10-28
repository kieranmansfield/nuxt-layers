import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vite-plus/test'

import HoverDimGroup from './HoverDimGroup.vue'

// Same template shape as MastNavModal: <template v-for> around a <slot> with fallback content,
// which compiles to fragments nested two deep
const Parent = defineComponent({
  components: { HoverDimGroup },
  data: () => ({ ids: ['a', 'b', 'c'] }),
  template: `
    <HoverDimGroup as="nav">
      <template v-for="id in ids" :key="id">
        <slot name="link" :id="id"><button>{{ id }}</button></slot>
      </template>
    </HoverDimGroup>`,
})

describe('HoverDimGroup', () => {
  it('renders and dims children nested in v-for and slot fragments', async () => {
    const wrapper = mount(Parent)
    const items = wrapper.findAll('nav > button')
    expect(items.map((b) => b.text())).toEqual(['a', 'b', 'c'])

    await items[0]?.trigger('mouseenter')
    expect(items.map((b) => b.attributes('style'))).toEqual([
      expect.stringContaining('opacity: 1'),
      expect.stringContaining('opacity: 0.3'),
      expect.stringContaining('opacity: 0.3'),
    ])
  })

  it('uses slot content when the parent passes it', () => {
    const wrapper = mount(Parent, { slots: { link: '<a href="#">x</a>' } })
    expect(wrapper.findAll('nav > a')).toHaveLength(3)
  })
})
