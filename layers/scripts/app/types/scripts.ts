export type LoadStrategy = 'onNuxtReady' | 'idle' | 'manual'

export type ScriptLoaderOptions = {
  src: string
  key?: string
  strategy?: LoadStrategy
  crossorigin?: 'anonymous' | 'use-credentials'
  integrity?: string
}

export type AnalyticsProxy = {
  track: (event: string, params?: Record<string, unknown>) => void
  load: () => void
}
