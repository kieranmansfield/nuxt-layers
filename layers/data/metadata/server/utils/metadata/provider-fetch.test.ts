import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { MetadataProviderError } from './errors'
import { providerFetch } from './provider-fetch'

afterEach(() => vi.unstubAllGlobals())

describe('providerFetch', () => {
  it('returns the fetched body', async () => {
    vi.stubGlobal(
      '$fetch',
      vi.fn(async () => ({ ok: true }))
    )
    await expect(providerFetch('tmdb', 'https://x.test')).resolves.toEqual({ ok: true })
  })

  it('wraps failures in a MetadataProviderError for the provider', async () => {
    vi.stubGlobal(
      '$fetch',
      vi.fn(async () => Promise.reject(new Error('boom')))
    )
    const err = await providerFetch('tmdb', 'https://x.test').catch((e) => e)
    expect(err).toBeInstanceOf(MetadataProviderError)
    expect(err.provider).toBe('tmdb')
    expect(err.message).toContain('API error')
  })
})
