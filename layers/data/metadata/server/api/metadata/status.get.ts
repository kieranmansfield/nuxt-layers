import { getProviders } from '../../utils/metadata/provider-registry'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
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
