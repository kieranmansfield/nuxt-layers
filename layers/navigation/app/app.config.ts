export default defineAppConfig({
  site: {
    title: '',
    subtitle: '',
    description: '',
  },
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
    site?: {
      title?: string
      subtitle?: string
      description?: string
    }
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
