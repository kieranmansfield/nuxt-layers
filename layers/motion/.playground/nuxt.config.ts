import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: '..',

  $meta: {
    name: 'motion-playground',
  },

  devtools: {
    enabled: true
  },

  compatibilityDate: '2026-01-30',

  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})