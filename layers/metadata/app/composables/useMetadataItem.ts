import type { MetadataProviderId, MetadataRecord } from '#layers/metadata/shared/types'

// Widened to `string` so $fetch's typed-route inference (which recurses over
// every known Nitro route) doesn't run against this literal — avoids a
// TS "excessive stack depth" error once the route count grows.
const LOOKUP_URL: string = '/api/metadata/lookup'

export function useMetadataItem(
  provider: MetadataProviderId,
  providerId: string,
  resourceType?: string
) {
  return useAsyncData(`metadata-item:${provider}:${providerId}`, () =>
    $fetch<MetadataRecord>(LOOKUP_URL, {
      query: { provider, providerId, resourceType },
    })
  )
}
