import { resolveRecord } from '../../utils/metadata/resolve-record'
import { defineEventHandler, readBody } from 'h3'

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)

export default defineEventHandler(async (event) => {
  // Pick known fields only; resolveRecord rejects missing provider/providerId with a 400
  const body = (await readBody<Record<string, unknown>>(event)) ?? {}
  const provider = str(body.provider)
  const providerId = str(body.providerId)
  const resourceType = str(body.resourceType)
  return resolveRecord({
    ...(provider && { provider }),
    ...(providerId && { providerId }),
    ...(resourceType && { resourceType }),
    force: body.force === true,
  })
})
