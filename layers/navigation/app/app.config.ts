import type { SiteConfig } from '#layers/core/app/types/site'

export default defineAppConfig({
  site: {
    title: '',
    subtitle: '',
    description: '',
  } satisfies SiteConfig,
  mastNav: {
    links: [] as Array<{
      id: string
      label: string
      to:
        | string
        | { name: string; params?: Record<string, unknown>; query?: Record<string, unknown> }
    }>,
    scrollBehaviour: 'router' as 'smooth-scroll' | 'router',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    // `site` is already typed by core's own AppConfigInput augmentation — no need to redeclare it.
    mastNav?: {
      links?: Array<{
        id: string
        label: string
        to:
          | string
          | { name: string; params?: Record<string, unknown>; query?: Record<string, unknown> }
      }>
      scrollBehaviour?: 'smooth-scroll' | 'router'
    }
  }
}
