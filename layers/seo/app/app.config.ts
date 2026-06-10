/* eslint-disable @typescript-eslint/consistent-type-assertions */
export default defineAppConfig({
  seoLayer: {
    ogImage: {
      component: 'OgImageBasic',
      props: {} as Record<string, unknown>,
    },
    twitterCard: 'summary_large_image' as 'summary_large_image' | 'summary' | 'player' | 'app',
    schemaOrg: {
      enabled: true,
      identity: null as string | null,
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    seoLayer?: {
      ogImage?: {
        component?: string
        props?: Record<string, unknown>
      }
      twitterCard?: 'summary_large_image' | 'summary' | 'player' | 'app'
      schemaOrg?: {
        enabled?: boolean
        identity?: string | null
      }
    }
  }
}
