import { describe, expect, it } from 'vitest'

import { getProvider, getProviders, registerProvider } from './provider-registry'
import type { MetadataProvider } from '#layers/metadata/shared/types'

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

// NOTE: _registry is a module-level Map singleton shared across every test in this file
// (vitest isolates modules per test *file*, not per test). Tests below account for
// accumulation by asserting deltas/membership rather than absolute counts, and by
// checking unregistered ids before registering them.

describe('provider-registry', () => {
  it('returns null for an id that has not been registered yet', () => {
    expect(getProvider('tmdb')).toBeNull()
  })

  it('registers a provider and retrieves it by id', () => {
    const provider = makeProvider({ id: 'comicvine' })
    registerProvider(provider)
    expect(getProvider('comicvine')).toBe(provider)
  })

  it('includes registered providers in getProviders()', () => {
    const before = getProviders().length
    registerProvider(makeProvider({ id: 'openlibrary', label: 'Open Library' }))
    const after = getProviders()
    expect(after.length).toBe(before + 1)
    expect(after.map((p) => p.id)).toContain('openlibrary')
  })

  it('overwrites the existing entry when registering the same id again', () => {
    const countBefore = getProviders().length
    const first = makeProvider({ id: 'google-books', label: 'First' })
    const second = makeProvider({ id: 'google-books', label: 'Second' })

    registerProvider(first)
    expect(getProviders().length).toBe(countBefore + 1)

    registerProvider(second)
    expect(getProviders().length).toBe(countBefore + 1)
    expect(getProvider('google-books')).toBe(second)
    expect(getProvider('google-books')).not.toBe(first)
  })
})
