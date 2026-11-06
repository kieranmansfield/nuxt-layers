import { describe, expect, it } from 'vite-plus/test'
import { nextTick, ref } from 'vue'

import { useUniformProp } from './useUniformWatchers'

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
