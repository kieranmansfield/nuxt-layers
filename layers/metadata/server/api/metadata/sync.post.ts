import type { MetadataProviderId, MetadataSyncInput } from '#layers/metadata/shared/types'

// fallow-ignore-next-line complexity
export default defineEventHandler(async (event) => {
  const body = await readBody<MetadataSyncInput>(event)

  const { provider: providerName, providerId, resourceType, force } = body ?? {}
  if (!providerName || !providerId) {
    throw createError({ statusCode: 400, message: 'provider and providerId are required' })
  }

  const provider = getProvider(providerName as MetadataProviderId)
  if (!provider)
    throw createError({ statusCode: 404, message: `Provider '${providerName}' not registered` })
  if (!provider.sync)
    throw createError({
      statusCode: 400,
      message: `Provider '${providerName}' does not support sync`,
    })

  const cacheKey = makeCacheKey('metadata', providerName, resourceType ?? 'item', providerId)

  if (!force) {
    const cached = await getCacheRecord(cacheKey)
    if (cached) return { synced: false, record: cached.normalised }
  }

  const result = await provider.sync({
    provider: providerName as MetadataProviderId,
    providerId,
    ...(resourceType && { resourceType }),
    ...(force !== undefined && { force }),
  })
  const now = new Date().toISOString()

  await setCacheRecord(cacheKey, {
    id: result.id,
    provider: providerName as MetadataProviderId,
    providerId,
    resourceType: resourceType ?? 'item',
    mediaType: result.mediaType,
    normalised: result,
    raw: result.raw ?? null,
    createdAt: now,
    updatedAt: now,
    lastSyncedAt: now,
  })

  return { synced: true, record: result }
})
