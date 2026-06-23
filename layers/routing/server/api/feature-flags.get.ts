import type { FeatureValue } from '../../app/types/routing'

export default defineEventHandler(() => {
  const config = useAppConfig() as { routingLayer?: { features?: Record<string, FeatureValue> } }
  return config.routingLayer?.features ?? {}
})
