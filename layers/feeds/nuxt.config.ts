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

  compatibilityDate: '2025-07-15',
})
