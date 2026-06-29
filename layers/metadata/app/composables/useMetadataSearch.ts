import type { MetadataMediaType, MetadataProviderId, MetadataSearchResult } from '#layers/metadata/shared/types'

type UseMetadataSearchOptions = {
  mediaType?: MetadataMediaType
  providers?: MetadataProviderId[]
  limit?: number
}

export function useMetadataSearch(query: MaybeRef<string>, options: UseMetadataSearchOptions = {}) {
  const q = computed(() => toValue(query).trim())

  return useAsyncData(
    () => `metadata-search:${q.value}`,
    () =>
      $fetch('/api/metadata/search', {
        query: {
          q: q.value,
          mediaType: options.mediaType,
          providers: options.providers?.join(','),
          limit: options.limit,
        },
      }) as Promise<MetadataSearchResult[]>,
    { watch: [q], immediate: false },
  )
}
