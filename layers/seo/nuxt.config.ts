// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'seo',
  },

  extends: ['../core'],

  modules: ['@nuxtjs/seo'],

  // Site config — consumed by all @nuxtjs/seo sub-modules (robots, sitemap, og-image, schema-org).
  // Override per-project via NUXT_SITE_URL, NUXT_SITE_NAME, NUXT_SITE_DESCRIPTION env vars.
  site: {
    url: '',
    name: '',
    description: '',
    defaultLocale: 'en',
    // Only index in production; set NUXT_SITE_ENV=production to enable
    indexable: process.env.NUXT_SITE_ENV === 'production',
    trailingSlash: false,
  },

  alias: {
    '#layers/seo': import.meta.dirname,
    '#layers/seo/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
