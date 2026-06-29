import type { MetadataProviderId, MetadataRecord } from '#layers/metadata/shared/types'

export function useMetadataItem(provider: MetadataProviderId, providerId: string, resourceType?: string) {
  return useAsyncData(
    `metadata-item:${provider}:${providerId}`,
    () =>
      $fetch('/api/metadata/lookup', {
        query: { provider, providerId, resourceType },
      }) as Promise<MetadataRecord>,
  )
}
