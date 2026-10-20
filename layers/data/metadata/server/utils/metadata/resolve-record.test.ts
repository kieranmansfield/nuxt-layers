import type { MetadataProvider, MetadataRecord } from '#layers/metadata/shared/types'
import type * as CacheModule from './cache'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

const { providerState, getCacheRecordMock, setCacheRecordMock } = vi.hoisted(() => ({
  providerState: { provider: null as MetadataProvider | null },
  getCacheRecordMock: vi.fn(async () => null as { normalised: MetadataRecord } | null),
  setCacheRecordMock: vi.fn(async () => undefined),
}))

vi.mock('./provider-registry', () => ({ getProvider: () => providerState.provider }))
vi.mock('./cache', async (importOriginal) => ({
  ...(await importOriginal<typeof CacheModule>()),
  getCacheRecord: getCacheRecordMock,
  setCacheRecord: setCacheRecordMock,
}))

import { resolveRecord } from './resolve-record'

const record = {
  id: 'r1',
  provider: 'comicvine',
  providerId: '42',
  mediaType: 'comic',
  title: 'Watchmen',
} as MetadataRecord

const lookup = vi.fn(async () => record as MetadataRecord | null)

beforeEach(() => {
  vi.clearAllMocks()
  getCacheRecordMock.mockResolvedValue(null)
  lookup.mockResolvedValue(record)
  providerState.provider = {
    id: 'comicvine',
    label: 'Comic Vine',
    mediaTypes: ['comic'],
    search: async () => [],
    lookup,
  }
})

describe('resolveRecord', () => {
  it('400s without provider or providerId', async () => {
    await expect(resolveRecord({ provider: 'comicvine' })).rejects.toMatchObject({
      statusCode: 400,
    })
  })

  it('404s for an unregistered provider', async () => {
    providerState.provider = null
    await expect(resolveRecord({ provider: 'nope', providerId: '1' })).rejects.toMatchObject({
      statusCode: 404,
    })
  })

  it('fetches, caches and reports synced on a miss', async () => {
    const out = await resolveRecord({ provider: 'comicvine', providerId: '42' })
    expect(out).toEqual({ record, synced: true })
    expect(setCacheRecordMock).toHaveBeenCalledWith(
      'metadata:comicvine:item:42',
      expect.objectContaining({ id: 'r1', providerId: '42', resourceType: 'item' })
    )
  })

  it('returns the cached record without calling the provider', async () => {
    getCacheRecordMock.mockResolvedValue({ normalised: record })
    const out = await resolveRecord({ provider: 'comicvine', providerId: '42' })
    expect(out).toEqual({ record, synced: false })
    expect(lookup).not.toHaveBeenCalled()
  })

  it('force skips the cache read', async () => {
    getCacheRecordMock.mockResolvedValue({ normalised: record })
    const out = await resolveRecord({ provider: 'comicvine', providerId: '42', force: true })
    expect(out.synced).toBe(true)
    expect(lookup).toHaveBeenCalledOnce()
  })

  it('404s when the provider finds nothing and does not cache', async () => {
    lookup.mockResolvedValue(null)
    await expect(resolveRecord({ provider: 'comicvine', providerId: '42' })).rejects.toMatchObject({
      statusCode: 404,
    })
    expect(setCacheRecordMock).not.toHaveBeenCalled()
  })
})
