import { computed, ref } from 'vue'
import { describe, expect, it, vi } from 'vite-plus/test'

const system = ref<'reduce' | 'no-preference'>('no-preference')
vi.mock('@vueuse/core', () => ({ usePreferredReducedMotion: () => system }))
const state = ref<'on' | 'off' | 'system'>('system')
vi.stubGlobal('useState', () => state)
vi.stubGlobal('computed', computed)

const { useReducedMotion } = await import('./useReducedMotion')

describe('useReducedMotion', () => {
  it.each([
    ['system', 'no-preference', false],
    ['system', 'reduce', true],
    ['on', 'no-preference', true],
    ['off', 'reduce', false],
  ] as const)('override %s + OS %s → %s', (override, os, expected) => {
    state.value = override
    system.value = os
    expect(useReducedMotion().value).toBe(expected)
  })
})
