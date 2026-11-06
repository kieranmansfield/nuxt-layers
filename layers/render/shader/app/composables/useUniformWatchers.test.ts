import { describe, expect, it } from 'vite-plus/test'
import { nextTick, ref } from 'vue'

import { useColorProp, useUniformProp } from './useUniformWatchers'

describe('useUniformProp', () => {
  it('seeds the uniform from the source and follows changes', async () => {
    const speed = ref(1)
    const node = useUniformProp(() => speed.value)
    expect(node.value).toBe(1)
    speed.value = 2
    await nextTick()
    expect(node.value).toBe(2)
  })

  it('keeps the same uniform node across changes', async () => {
    const speed = ref(1)
    const node = useUniformProp(() => speed.value)
    const uuid = node.uuid
    speed.value = 3
    await nextTick()
    expect(node.uuid).toBe(uuid)
  })
})

describe('useColorProp', () => {
  it('seeds the uniform from the source and follows changes on the same node', async () => {
    const color = ref('#ff0000')
    const node = useColorProp(() => color.value)
    const uuid = node.uuid
    expect([node.value.x, node.value.y, node.value.z]).toEqual([1, 0, 0])
    color.value = '#0000ff'
    await nextTick()
    expect([node.value.x, node.value.y, node.value.z]).toEqual([0, 0, 1])
    expect(node.uuid).toBe(uuid)
  })
})
