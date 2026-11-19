import type { MetadataProvider, MetadataProviderId } from '#layers/metadata/shared/types'

const _registry = new Map<MetadataProviderId, MetadataProvider>()

export function registerProvider(provider: MetadataProvider) {
  _registry.set(provider.id, provider)
}

export function getProvider(id: MetadataProviderId): MetadataProvider | null {
  return _registry.get(id) ?? null
}

export function getProviders(): MetadataProvider[] {
  return [..._registry.values()]
}
