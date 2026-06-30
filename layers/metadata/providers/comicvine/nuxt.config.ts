export default defineNuxtConfig({
  $meta: {
    name: 'metadata-comicvine',
  },

  extends: ['../../'],

  alias: {
    '#layers/metadata-comicvine': import.meta.dirname,
  },

  compatibilityDate: '2026-06-30',

  runtimeConfig: {
    metadataComicvine: {
      apiKey: '', // env: NUXT_METADATA_COMICVINE_API_KEY
      baseUrl: 'https://comicvine.gamespot.com/api',
      cacheTtl: 60 * 60 * 24 * 30,
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    metadataComicvine: {
      apiKey: string
      baseUrl: string
      cacheTtl: number
    }
  }
}
