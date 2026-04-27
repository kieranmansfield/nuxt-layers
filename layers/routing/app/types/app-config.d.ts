declare module '@nuxt/schema' {
  interface AppConfigInput {
    routingLayer?: Partial<import('./routing').RoutingLayerConfig>
  }
}
