export default defineEventHandler(() => {
  return getProviders().map((p) => ({
    id: p.id,
    label: p.label,
    mediaTypes: p.mediaTypes,
  }))
})
