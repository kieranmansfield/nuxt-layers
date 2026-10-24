import { searchMetadata } from '../../utils/metadata/search'
import { createError, defineEventHandler, getQuery } from 'h3'
import type { MetadataMediaType } from '#layers/metadata/shared/types'

const MEDIA_TYPES = new Set<MetadataMediaType>([
  'book',
  'comic',
  'comic-series',
  'manga',
  'graphic-novel',
  'collected-edition',
  'movie',
  'tv-show',
])
const MAX_LIMIT = 50

// fallow-ignore-next-line complexity
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const q = String(query.q ?? '').trim()
  if (!q) throw createError({ status: 400, message: 'q is required' })

  const mediaType = query.mediaType ? (String(query.mediaType) as MetadataMediaType) : undefined
  if (mediaType && !MEDIA_TYPES.has(mediaType)) {
    throw createError({ status: 400, message: `Unknown mediaType '${mediaType}'` })
  }

  // Unknown provider ids are dropped by searchMetadata's registry filter
  const providers = query.providers ? String(query.providers).split(',').filter(Boolean) : undefined

  const rawLimit = query.limit ? Number(query.limit) : 10
  if (!Number.isInteger(rawLimit) || rawLimit < 1) {
    throw createError({ status: 400, message: 'limit must be a positive integer' })
  }
  const limit = Math.min(rawLimit, MAX_LIMIT)

  return searchMetadata({
    query: q,
    ...(mediaType && { mediaType }),
    ...(providers && { providers }),
    limit,
  })
})
