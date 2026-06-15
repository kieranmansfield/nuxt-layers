export type LoadStrategy = 'onNuxtReady' | 'idle' | 'manual'

export interface ScriptLoaderOptions {
  src: string
  key?: string
  strategy?: LoadStrategy
  crossorigin?: 'anonymous' | 'use-credentials'
  integrity?: string
}

export interface AnalyticsProxy {
  track: (event: string, params?: Record<string, unknown>) => void
  load: () => void
}
