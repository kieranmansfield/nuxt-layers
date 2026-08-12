import type { MetadataSearchInput, MetadataSearchResult } from '#layers/metadata/shared/types'

// fallow-ignore-next-line complexity
export async function searchMetadata(input: MetadataSearchInput): Promise<MetadataSearchResult[]> {
  const all = getProviders()
  const requestedProviders = input.providers
  const targets = requestedProviders?.length
    ? all.filter((p) => requestedProviders.includes(p.id))
    : all.filter((p) => !input.mediaType || p.mediaTypes.includes(input.mediaType))

  if (!targets.length) return []

  const cacheKey = makeCacheKey(
    'metadata-search',
    targets.map((p) => p.id).join('+'),
    input.mediaType ?? 'any',
    hashQuery(`${input.query}:${input.limit ?? 10}`)
  )

  const cached = await getSearchCache<MetadataSearchResult[]>(cacheKey)
  if (cached) return cached

  const settled = await Promise.all(
    targets.map(async (p) => {
      try {
        return { provider: p, value: await p.search(input) }
      } catch (reason) {
        return { provider: p, reason }
      }
    })
  )

  const results: MetadataSearchResult[] = []
  for (const outcome of settled) {
    if ('value' in outcome) {
      results.push(...outcome.value)
      continue
    }
    console.error(`[metadata] provider "${outcome.provider.id}" search failed:`, outcome.reason)
  }

  const deduped = deduplicateResults(results)
  await setSearchCache(cacheKey, deduped)
  return deduped
}

function deduplicateResults(results: MetadataSearchResult[]): MetadataSearchResult[] {
  const seen = new Set<string>()
  return results.filter((r) => {
    const key = `${r.mediaType}:${r.title.toLowerCase()}:${r.publishedAt?.slice(0, 4) ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
