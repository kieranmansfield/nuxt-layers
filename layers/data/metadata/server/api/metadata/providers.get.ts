import { getProviders } from '../../utils/metadata/provider-registry'
import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return getProviders().map((p) => ({
    id: p.id,
    label: p.label,
    mediaTypes: p.mediaTypes,
  }))
})
