import { resolveRecord } from '../../utils/metadata/resolve-record'
import { isSyncAuthorized } from '../../utils/metadata/sync-auth'
import { createError, defineEventHandler, getRequestHeader, readBody } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)

export default defineEventHandler(async (event) => {
  // Each sync can spend provider quota. Apps that want signed-in users instead can wrap
  // resolveRecord in their own authenticated route.
  const { syncSecret } = useRuntimeConfig(event).metadataLayer
  if (!isSyncAuthorized(getRequestHeader(event, 'authorization'), syncSecret, import.meta.dev)) {
    throw createError({ status: 401, statusText: 'Unauthorized' })
  }

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
