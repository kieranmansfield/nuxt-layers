// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'feeds',
  },

  extends: process.env.FEEDS_STANDALONE ? ['../core', '../content'] : [],

  alias: {
    '#layers/feeds': import.meta.dirname,
  },

  css: ['#layers/feeds/app/assets/css/feeds.css'],

  nitro: {
    prerender: {
      // Shorthand routes (/feed/rss etc.) always map to the defaultCollection.
      // These are owned by the feeds layer so we prerender them here.
      // Collection-specific routes (/feed/blog/rss etc.) must be added to
      // nitro.prerender.routes in the consuming app's nuxt.config.ts.
      routes: [
        '/feed/discovery',
        '/feed/demo',
        '/feed/rss',
        '/feed/atom',
        '/feed/json',
        '/feed/rss/all',
        '/feed/atom/all',
        '/feed/json/all',
        '/feed/style.xsl',
      ],
    },
  },

  compatibilityDate: '2025-07-15',
})
