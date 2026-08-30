import type {
  MetadataMediaType,
  MetadataProviderId,
  MetadataSearchResult,
} from '#layers/metadata/shared/types'

type UseMetadataSearchOptions = {
  mediaType?: MaybeRef<MetadataMediaType | undefined>
  providers?: MaybeRef<MetadataProviderId[] | undefined>
  limit?: MaybeRef<number | undefined>
  /** Debounce the query before firing a request. Set 0 to disable. Default 300ms. */
  debounceMs?: number
}

export function useMetadataSearch(query: MaybeRef<string>, options: UseMetadataSearchOptions = {}) {
  const { mediaType, providers, limit, debounceMs = 300 } = options

  const raw = computed(() => toValue(query).trim())
  const q = debounceMs > 0 ? refDebounced(raw, debounceMs) : raw
  const mt = computed(() => toValue(mediaType))

  return useAsyncData(
    () => `metadata-search:${q.value}:${mt.value ?? ''}`,
    () => {
      if (!q.value) return Promise.resolve([])
      return $fetch('/api/metadata/search', {
        query: {
          q: q.value,
          mediaType: mt.value,
          providers: toValue(providers)?.join(','),
          limit: toValue(limit),
        },
      }) as Promise<MetadataSearchResult[]>
    },
    { watch: [q, mt], immediate: false }
  )
}
