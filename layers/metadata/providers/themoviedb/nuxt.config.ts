export default defineNuxtConfig({
  $meta: {
    name: 'metadata-tmdb',
  },

  extends: ['../../'],

  alias: {
    '#layers/metadata-tmdb': import.meta.dirname,
  },

  compatibilityDate: '2026-06-30',

  runtimeConfig: {
    metadataTmdb: {
      apiKey: '', // env: NUXT_METADATA_TMDB_API_KEY
      baseUrl: 'https://api.themoviedb.org/3',
      imageBaseUrl: 'https://image.tmdb.org/t/p',
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})

declare module '@nuxt/schema' {
  type RuntimeConfig = {
    metadataTmdb: {
      apiKey: string
      baseUrl: string
      imageBaseUrl: string
    }
  }
}
