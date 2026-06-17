import type { PageCollections } from '@nuxt/content'

export default defineAppConfig({
  feedsLayer: {
    feed: {
      limit: 30,
      collections: ['blog'],
      defaultCollection: 'blog',
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    feedsLayer?: {
      feed?: {
        limit?: number
        /** Collection names to expose as feeds. Default: ['blog'] */
        collections?: Array<keyof PageCollections>
        /** Collection used by the shorthand /feed/rss routes. Default: 'blog' */
        defaultCollection?: keyof PageCollections
      }
    }
  }
}
