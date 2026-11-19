import { resolveRecord } from '../../utils/metadata/resolve-record'
import { isSyncAuthorized } from '../../utils/metadata/sync-auth'
import { createError, defineEventHandler, getRequestHeader, readBody } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)

// Pick known fields only; resolveRecord rejects missing provider/providerId with a 400
function pickSyncInput(body: Record<string, unknown>) {
  const input: Parameters<typeof resolveRecord>[0] = { force: body.force === true }
  for (const key of ['provider', 'providerId', 'resourceType'] as const) {
    const value = str(body[key])
    if (value) input[key] = value
  }
  return input
}

export default defineEventHandler(async (event) => {
  // Each sync can spend provider quota. Apps that want signed-in users instead can wrap
  // resolveRecord in their own authenticated route.
  const { syncSecret } = useRuntimeConfig(event).metadataLayer
  if (!isSyncAuthorized(getRequestHeader(event, 'authorization'), syncSecret, import.meta.dev)) {
    throw createError({ status: 401, statusText: 'Unauthorized' })
  }

  return resolveRecord(pickSyncInput((await readBody<Record<string, unknown>>(event)) ?? {}))
})
