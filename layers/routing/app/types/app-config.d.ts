import type { RoutingLayerConfig } from './routing'

declare module '@nuxt/schema' {
  interface AppConfigInput {
    routingLayer?: Partial<RoutingLayerConfig>
  }
}
