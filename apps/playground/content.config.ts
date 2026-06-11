import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
    }),
    portfolio: defineCollection({
      type: 'page',
      source: 'portfolio/**/*.md',
    }),
    gallery: defineCollection({
      type: 'page',
      source: 'gallery/**/*.md',
    }),
  },
})
