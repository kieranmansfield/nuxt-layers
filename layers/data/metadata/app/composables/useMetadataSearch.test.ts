import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { computed, isRef, nextTick, ref, toValue } from 'vue'

import { useMetadataSearch } from './useMetadataSearch'

function run(options: Parameters<typeof useMetadataSearch>[1]) {
  const useAsyncData = vi.fn()
  vi.stubGlobal('computed', computed)
  vi.stubGlobal('toValue', toValue)
  vi.stubGlobal('useAsyncData', useAsyncData)
  useMetadataSearch('dune', { debounceMs: 0, ...options })
  const [key, , config] = useAsyncData.mock.calls[0] as [
    () => string,
    unknown,
    { watch: unknown[] },
  ]
  return { key, sources: config.watch }
}

describe('useMetadataSearch', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('re-keys and watches when providers or limit change', async () => {
    const providers = ref<Array<'openlibrary'> | undefined>(undefined)
    const limit = ref<number | undefined>(undefined)
    const { key, sources } = run({ providers, limit })
    const before = key()

    providers.value = ['openlibrary']
    await nextTick()
    const withProviders = key()
    limit.value = 5
    await nextTick()

    expect(withProviders).not.toBe(before)
    expect(key()).not.toBe(withProviders)
    expect(sources).toHaveLength(4)
    expect(sources.every((source) => isRef(source))).toBe(true)
    expect(sources.map((source) => toValue(source as never))).toContain(5)
  })

  it('accepts getters', () => {
    const limit = ref(1)
    const { key } = run({ limit: () => limit.value })
    const before = key()
    limit.value = 2
    expect(key()).not.toBe(before)
  })
})
