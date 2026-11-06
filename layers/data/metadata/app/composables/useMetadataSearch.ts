import type { MaybeRefOrGetter } from 'vue'

import type {
  MetadataMediaType,
  MetadataProviderId,
  MetadataSearchResult,
} from '#layers/metadata/shared/types'

type UseMetadataSearchOptions = {
  mediaType?: MaybeRefOrGetter<MetadataMediaType | undefined>
  providers?: MaybeRefOrGetter<MetadataProviderId[] | undefined>
  limit?: MaybeRefOrGetter<number | undefined>
  /** Debounce the query before firing a request. Set 0 to disable. Default 300ms. */
  debounceMs?: number
}

export function useMetadataSearch(
  query: MaybeRefOrGetter<string>,
  options: UseMetadataSearchOptions = {}
) {
  const { mediaType, providers, limit, debounceMs = 300 } = options

  const raw = computed(() => toValue(query).trim())
  const q = debounceMs > 0 ? refDebounced(raw, debounceMs) : raw
  const mt = computed(() => toValue(mediaType))
  // Order is kept, not sorted: the API tries providers in the order given.
  const providerList = computed(() => toValue(providers)?.join(','))
  const limitValue = computed(() => toValue(limit))

  return useAsyncData(
    () =>
      `metadata-search:${q.value}:${mt.value ?? ''}:${providerList.value ?? ''}:${limitValue.value ?? ''}`,
    () => {
      if (!q.value) return Promise.resolve([])
      return $fetch('/api/metadata/search', {
        method: 'GET',
        body: undefined,
        query: {
          q: q.value,
          ...(mt.value ? { mediaType: mt.value } : {}),
          ...(providerList.value ? { providers: providerList.value } : {}),
          ...(limitValue.value !== undefined ? { limit: limitValue.value } : {}),
        },
      }) as Promise<MetadataSearchResult[]>
    },
    { watch: [q, mt, providerList, limitValue], immediate: false }
  )
}
