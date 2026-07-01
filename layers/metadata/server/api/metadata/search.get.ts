import type { MetadataMediaType, MetadataProviderId } from '#layers/metadata/shared/types'

// fallow-ignore-next-line complexity
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const q = String(query.q ?? '').trim()
  if (!q) throw createError({ statusCode: 400, message: 'q is required' })

  const mediaType = query.mediaType as MetadataMediaType | undefined
  const providers = query.providers
    ? (String(query.providers).split(',').filter(Boolean) as MetadataProviderId[])
    : undefined
  const limit = query.limit ? Number(query.limit) : 10

  return searchMetadata({ query: q, mediaType, providers, limit })
})
