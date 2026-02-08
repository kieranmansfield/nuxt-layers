// Conditionally load nuxt-studio if installed (optional peer dependency)
const studioModule: string[] = []
try {
  await import('nuxt-studio')
  studioModule.push('nuxt-studio')
} catch {}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'content',
  },

  // Only extend core when running standalone dev (via dev:content script)
  extends: process.env.CONTENT_STANDALONE ? ['../core'] : [],

  alias: {
    '#layers/content': import.meta.dirname,
  },

  modules: ['@nuxt/ui', '@nuxt/content', ...studioModule],

  css: ['#layers/content/app/assets/css/main.css'],

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
