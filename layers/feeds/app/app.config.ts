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
  type AppConfigInput = {
    feedsLayer?: {
      feed?: {
        limit?: number
        /** Collection names to expose as feeds. Default: ['blog'] */
        collections?: string[]
        /** Collection used by the shorthand /feed/rss routes. Default: 'blog' */
        defaultCollection?: string
      }
    }
  }
}
