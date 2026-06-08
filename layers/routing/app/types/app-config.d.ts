/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module '@nuxt/schema' {
  type AppConfigInput = {
    routingLayer?: Partial<import('./routing').RoutingLayerConfig>
  }
}
