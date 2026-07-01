import type { MetadataProviderId } from '#layers/metadata/shared/types'

// fallow-ignore-next-line complexity
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const providerId = String(query.providerId ?? '').trim()
  const providerName = String(query.provider ?? '').trim() as MetadataProviderId
  const resourceType = query.resourceType ? String(query.resourceType) : undefined

  if (!providerName || !providerId) {
    throw createError({ statusCode: 400, message: 'provider and providerId are required' })
  }

  const provider = getProvider(providerName)
  if (!provider)
    throw createError({ statusCode: 404, message: `Provider '${providerName}' not registered` })

  const cacheKey = makeCacheKey('metadata', providerName, resourceType ?? 'item', providerId)
  const cached = await getCacheRecord(cacheKey)
  if (cached) return cached.normalised

  const result = await provider.lookup({ provider: providerName, providerId, resourceType })
  if (!result) throw createError({ statusCode: 404, message: 'Not found' })

  const now = new Date().toISOString()
  await setCacheRecord(cacheKey, {
    id: result.id,
    provider: providerName,
    providerId,
    resourceType: resourceType ?? 'item',
    mediaType: result.mediaType,
    normalised: result,
    raw: result.raw ?? null,
    createdAt: now,
    updatedAt: now,
    lastSyncedAt: now,
  })

  return result
})
