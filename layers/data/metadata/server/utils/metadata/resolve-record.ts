import { createError } from 'h3'
import { getCacheRecord, makeCacheKey, setCacheRecord } from './cache'
import { getProvider } from './provider-registry'
import type { MetadataRecord } from '#layers/metadata/shared/types'

export type ResolveRecordInput = {
  provider?: string
  providerId?: string
  resourceType?: string
  /** Skip the cache read and refetch from the provider. */
  force?: boolean
}

/**
 * Cache-through lookup of one record. `synced` is true when the provider was called,
 * false when the cached record was returned. Throws h3 errors (400/404) for bad input.
 */
export async function resolveRecord(
  input: ResolveRecordInput
): Promise<{ record: MetadataRecord; synced: boolean }> {
  const { provider: providerName, providerId, resourceType, force } = input
  if (!providerName || !providerId) {
    throw createError({ statusCode: 400, message: 'provider and providerId are required' })
  }

  const provider = getProvider(providerName)
  if (!provider) {
    throw createError({ statusCode: 404, message: `Provider '${providerName}' not registered` })
  }

  const cacheKey = makeCacheKey('metadata', providerName, resourceType ?? 'item', providerId)

  if (!force) {
    const cached = await getCacheRecord(cacheKey)
    if (cached) return { record: cached.normalised, synced: false }
  }

  const record = await provider.lookup({
    provider: providerName,
    providerId,
    ...(resourceType && { resourceType }),
  })
  if (!record) throw createError({ statusCode: 404, message: 'Not found' })

  const now = new Date().toISOString()
  await setCacheRecord(cacheKey, {
    id: record.id,
    provider: providerName,
    providerId,
    resourceType: resourceType ?? 'item',
    mediaType: record.mediaType,
    normalised: record,
    raw: record.raw ?? null,
    createdAt: now,
    updatedAt: now,
    lastSyncedAt: now,
  })

  return { record, synced: true }
}
