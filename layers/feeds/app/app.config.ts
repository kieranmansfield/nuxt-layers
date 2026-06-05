export default defineAppConfig({
  feedsLayer: {
    site: {
      title: 'My Site',
      description: 'Latest content',
      url: 'https://example.com',
      author: {
        name: '',
        email: '',
        link: '',
      },
      image: '',
      favicon: '/favicon.ico',
      copyright: '',
    },
    feed: {
      limit: 30,
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    feedsLayer?: {
      site?: {
        title?: string
        description?: string
        url?: string
        author?: {
          name?: string
          email?: string
          link?: string
        }
        image?: string
        favicon?: string
        copyright?: string
      }
      feed?: {
        limit?: number
      }
    }
  }
}
