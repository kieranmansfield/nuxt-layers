declare module '@nuxt/schema' {
  interface AppConfigInput {
    mastNav?: {
      links?: Array<{
        id: string
        label: string
        to: string | { name: string; params?: Record<string, unknown>; query?: Record<string, unknown> }
      }>
      scrollBehaviour?: 'smooth-scroll' | 'router'
    }
    uiLayer?: {
      name?: string
      gradients?: Record<string, import('./gradient').GradientConfig>
      accentScenes?: Record<string, import('./accent').AccentSceneConfig>
    }
  }
}
