export default defineNuxtConfig({
  $meta: {
    name: 'metadata-google-books',
  },

  extends: ['../../'],

  alias: {
    '#layers/metadata-google-books': import.meta.dirname,
  },

  compatibilityDate: '2026-06-30',

  runtimeConfig: {
    metadataGoogleBooks: {
      apiKey: '', // env: NUXT_METADATA_GOOGLE_BOOKS_API_KEY (optional — anonymous quota is limited)
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})

declare module '@nuxt/schema' {
  type RuntimeConfig = {
    metadataGoogleBooks: {
      apiKey: string
    }
  }
}
