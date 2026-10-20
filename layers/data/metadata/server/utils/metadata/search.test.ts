import type {
  MetadataProvider,
  MetadataSearchInput,
  MetadataSearchResult,
} from '#layers/metadata/shared/types'
import type * as CacheModule from './cache'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

// search.ts imports its sibling helpers directly. Keep the pure cache helpers real, and
// control provider/cache lookups via mocks.
const { providerState, getProvidersMock, getSearchCacheMock, setSearchCacheMock } = vi.hoisted(
  () => {
    const providerState: { mockProviders: MetadataProvider[] } = { mockProviders: [] }
    return {
      providerState,
      getProvidersMock: vi.fn(() => providerState.mockProviders),
      getSearchCacheMock: vi.fn(async () => null as MetadataSearchResult[] | null),
      setSearchCacheMock: vi.fn(async () => undefined),
    }
  }
)

vi.mock('./provider-registry', () => ({ getProviders: getProvidersMock }))
vi.mock('./cache', async (importOriginal) => ({
  ...(await importOriginal<typeof CacheModule>()),
  getSearchCache: getSearchCacheMock,
  setSearchCache: setSearchCacheMock,
}))

const { searchMetadata } = await import('./search')

function makeResult(overrides: Partial<MetadataSearchResult> = {}): MetadataSearchResult {
  return {
    id: 'comicvine:issue:1',
    provider: 'comicvine',
    providerId: '1',
    mediaType: 'comic',
    title: 'Watchmen',
    ...overrides,
  }
}

function makeProvider(overrides: Partial<MetadataProvider> = {}): MetadataProvider {
  return {
    id: 'comicvine',
    label: 'Comic Vine',
    mediaTypes: ['comic'],
    search: async () => [],
    lookup: async () => null,
    ...overrides,
  }
}

beforeEach(() => {
  providerState.mockProviders = []
  getProvidersMock.mockClear()
  getSearchCacheMock.mockClear()
  getSearchCacheMock.mockResolvedValue(null)
  setSearchCacheMock.mockClear()
})

function baseInput(overrides: Partial<MetadataSearchInput> = {}): MetadataSearchInput {
  return { query: 'watchmen', ...overrides }
}

describe('searchMetadata', () => {
  it('targets only providers named in input.providers', async () => {
    const a = vi.fn(async () => [makeResult({ id: 'a-1' })])
    const b = vi.fn(async () => [makeResult({ id: 'b-1' })])
    providerState.mockProviders = [
      makeProvider({ id: 'comicvine', search: a }),
      makeProvider({ id: 'openlibrary', mediaTypes: ['book'], search: b }),
    ]

    await searchMetadata(baseInput({ providers: ['comicvine'] }))

    expect(a).toHaveBeenCalledTimes(1)
    expect(b).not.toHaveBeenCalled()
  })

  it('targets providers by mediaType when providers[] is not given', async () => {
    const comic = vi.fn(async () => [makeResult()])
    const book = vi.fn(async () => [makeResult({ mediaType: 'book' })])
    providerState.mockProviders = [
      makeProvider({ id: 'comicvine', mediaTypes: ['comic'], search: comic }),
      makeProvider({ id: 'openlibrary', mediaTypes: ['book'], search: book }),
    ]

    await searchMetadata(baseInput({ mediaType: 'comic' }))

    expect(comic).toHaveBeenCalledTimes(1)
    expect(book).not.toHaveBeenCalled()
  })

  it('targets all providers when neither providers[] nor mediaType is given', async () => {
    const comic = vi.fn(async () => [makeResult()])
    const book = vi.fn(async () => [makeResult({ mediaType: 'book' })])
    providerState.mockProviders = [
      makeProvider({ id: 'comicvine', mediaTypes: ['comic'], search: comic }),
      makeProvider({ id: 'openlibrary', mediaTypes: ['book'], search: book }),
    ]

    await searchMetadata(baseInput())

    expect(comic).toHaveBeenCalledTimes(1)
    expect(book).toHaveBeenCalledTimes(1)
  })

  it('returns [] when no providers match the given targets', async () => {
    providerState.mockProviders = [makeProvider({ id: 'comicvine', mediaTypes: ['comic'] })]

    const result = await searchMetadata(baseInput({ mediaType: 'movie' }))

    expect(result).toEqual([])
    expect(getSearchCacheMock).not.toHaveBeenCalled()
  })

  it('returns [] when providers[] names an id with no registered provider', async () => {
    providerState.mockProviders = [makeProvider({ id: 'comicvine' })]

    const result = await searchMetadata(baseInput({ providers: ['tmdb'] }))

    expect(result).toEqual([])
  })

  it('keeps results from other providers when one provider rejects', async () => {
    const ok = vi.fn(async () => [makeResult({ id: 'ok-1', title: 'Watchmen' })])
    const failing = vi.fn(async () => {
      throw new Error('boom')
    })
    providerState.mockProviders = [
      makeProvider({ id: 'comicvine', search: ok }),
      makeProvider({ id: 'openlibrary', mediaTypes: ['book'], search: failing }),
    ]

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const result = await searchMetadata(baseInput())

    expect(result).toHaveLength(1)
    expect(result.at(0)?.id).toBe('ok-1')
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('deduplicates results by mediaType:title(lowercase):year', async () => {
    const a = vi.fn(async () => [
      makeResult({ id: 'a-1', title: 'Watchmen', mediaType: 'comic', publishedAt: '1986-09-01' }),
    ])
    const b = vi.fn(async () => [
      makeResult({ id: 'b-1', title: 'WATCHMEN', mediaType: 'comic', publishedAt: '1986-12-25' }),
    ])
    providerState.mockProviders = [
      makeProvider({ id: 'comicvine', search: a }),
      makeProvider({ id: 'openlibrary', mediaTypes: ['comic'], search: b }),
    ]

    const result = await searchMetadata(baseInput())

    expect(result).toHaveLength(1)
    expect(result.at(0)?.id).toBe('a-1')
  })

  it('does not dedupe results with different years', async () => {
    const a = vi.fn(async () => [
      makeResult({ id: 'a-1', title: 'Watchmen', publishedAt: '1986-09-01' }),
    ])
    const b = vi.fn(async () => [
      makeResult({ id: 'b-1', title: 'Watchmen', publishedAt: '2019-10-20' }),
    ])
    providerState.mockProviders = [
      makeProvider({ id: 'comicvine', search: a }),
      makeProvider({ id: 'openlibrary', mediaTypes: ['comic'], search: b }),
    ]

    const result = await searchMetadata(baseInput())

    expect(result).toHaveLength(2)
  })

  it('short-circuits on a cache hit without calling provider search functions', async () => {
    const cached = [makeResult({ id: 'cached-1' })]
    getSearchCacheMock.mockResolvedValue(cached)
    const search = vi.fn(async () => [makeResult({ id: 'live-1' })])
    providerState.mockProviders = [makeProvider({ id: 'comicvine', search })]

    const result = await searchMetadata(baseInput())

    expect(result).toBe(cached)
    expect(search).not.toHaveBeenCalled()
    expect(setSearchCacheMock).not.toHaveBeenCalled()
  })

  it('writes deduped results to the cache after a live search', async () => {
    const search = vi.fn(async () => [makeResult({ id: 'live-1' })])
    providerState.mockProviders = [makeProvider({ id: 'comicvine', search })]

    const result = await searchMetadata(baseInput())

    expect(setSearchCacheMock).toHaveBeenCalledTimes(1)
    expect(setSearchCacheMock).toHaveBeenCalledWith(expect.any(String), result)
  })
})
