import { defineCollection, defineContentConfig } from '@nuxt/content'

// Only used when this layer runs standalone. A collection's `source` is rooted at the layer
// that defines it, so consumer apps must declare their own collections — see CLAUDE.md.
export default defineContentConfig({
  collections: {
    content: defineCollection({ type: 'page', source: 'pages/**/*.md' }),
    blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
    portfolio: defineCollection({ type: 'page', source: 'portfolio/**/*.md' }),
    gallery: defineCollection({ type: 'page', source: 'gallery/**/*.md' }),
  },
})
