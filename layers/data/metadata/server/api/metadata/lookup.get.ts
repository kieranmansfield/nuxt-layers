import { resolveRecord } from '../../utils/metadata/resolve-record'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const { record } = await resolveRecord({
    provider: String(query.provider ?? '').trim(),
    providerId: String(query.providerId ?? '').trim(),
    ...(query.resourceType && { resourceType: String(query.resourceType) }),
  })
  return record
})
