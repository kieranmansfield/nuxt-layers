import { getProviders } from '../../utils/metadata/provider-registry'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  // Dev-only: each call runs a live search on every provider, spending real API quota
  if (!import.meta.dev) throw createError({ status: 404 })

  const providers = getProviders()

  return Promise.all(
    providers.map(async (p) => {
      try {
        await p.search({ query: 'test', limit: 1 })
        return { id: p.id, label: p.label, ok: true, error: null }
      } catch (err) {
        return {
          id: p.id,
          label: p.label,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        }
      }
    })
  )
})
