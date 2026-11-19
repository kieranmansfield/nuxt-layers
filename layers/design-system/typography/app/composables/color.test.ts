import { ref } from 'vue'
import { describe, expect, it } from 'vite-plus/test'

import { useColor } from './color'

describe('useColor', () => {
  it('builds a class from a plain value', () => {
    expect(useColor('primary', 'text').value).toBe('text-primary')
  })

  it('falls back to default when color is undefined', () => {
    expect(useColor(undefined, 'bg').value).toBe('bg-default')
  })

  it('tracks a ref', () => {
    const color = ref<'primary' | 'error'>('primary')
    const cls = useColor(color)
    color.value = 'error'
    expect(cls.value).toBe('text-error')
  })

  it('tracks a getter', () => {
    let color: 'primary' | 'error' = 'primary'
    const state = ref(0)
    const cls = useColor(() => (state.value, color))
    color = 'error'
    state.value++
    expect(cls.value).toBe('text-error')
  })
})
