import { readServerAppConfig } from '#layers/core/server/utils/app-config'
import { defineEventHandler } from 'h3'
import type { FeatureValue } from '../../app/types/routing'

export default defineEventHandler(() => {
  const config = readServerAppConfig() as {
    routingLayer?: { features?: Record<string, FeatureValue> }
  }
  return config.routingLayer?.features ?? {}
})
