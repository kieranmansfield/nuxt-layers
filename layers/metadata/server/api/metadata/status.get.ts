export default defineEventHandler(async () => {
  const providers = getProviders()

  const results = await Promise.allSettled(
    providers.map(async (p) => {
      await p.search({ query: 'test', limit: 1 })
      return { id: p.id, label: p.label, ok: true, error: null }
    }),
  )

  return results.map((outcome, i) => {
    const p = providers[i]!
    if (outcome.status === 'fulfilled') {
      return { id: p.id, label: p.label, ok: true, error: null }
    }
    const err = outcome.reason
    return {
      id: p.id,
      label: p.label,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }
  })
})
