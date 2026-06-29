import type { MetadataSearchInput, MetadataSearchResult } from '#layers/metadata/shared/types'

// fallow-ignore-next-line complexity
export async function searchMetadata(input: MetadataSearchInput): Promise<MetadataSearchResult[]> {
  const all = getProviders()
  const targets = input.providers?.length
    ? all.filter((p) => input.providers!.includes(p.id))
    : all.filter((p) => !input.mediaType || p.mediaTypes.includes(input.mediaType))

  if (!targets.length) return []

  const cacheKey = makeCacheKey(
    'metadata-search',
    targets.map((p) => p.id).join('+'),
    input.mediaType ?? 'any',
    hashQuery(`${input.query}:${input.limit ?? 10}`),
  )

  const cached = await getSearchCache<MetadataSearchResult[]>(cacheKey)
  if (cached) return cached

  const settled = await Promise.allSettled(targets.map((p) => p.search(input)))

  const results: MetadataSearchResult[] = []
  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') results.push(...outcome.value)
  }

  const deduped = deduplicateResults(results)
  await setSearchCache(cacheKey, deduped)
  return deduped
}

function deduplicateResults(results: MetadataSearchResult[]): MetadataSearchResult[] {
  const seen = new Set<string>()
  return results.filter((r) => {
    const key = `${r.title.toLowerCase()}:${r.publishedAt?.slice(0, 4) ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
