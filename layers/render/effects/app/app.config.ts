export default defineAppConfig({
  effects: {
    // The `shaders` package samples 5% of sessions and posts domain, browser family, device type
    // and frame-time stats to shaders.com. Off by default; opt in per project if you accept that.
    telemetry: false,
    colorSpace: 'p3-linear',
    toneMapping: 'linear',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    effects?: {
      telemetry?: boolean
      colorSpace?: 'srgb' | 'p3-linear'
      toneMapping?: 'linear' | 'reinhard' | 'cineon' | 'aces' | 'agx' | 'neutral' | 'hable' | 'unreal'
    }
  }
}
