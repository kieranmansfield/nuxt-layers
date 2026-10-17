// https://nuxt.com/docs/api/configuration/nuxt-config
// Wraps the `shaders` package (WGSL/WebGPU, own renderer via typegpu). Independent of
// TresJS/three — extends core only, not canvas. Effects here render in their own canvas.
export default defineNuxtConfig({
  $meta: {
    name: 'effects',
  },

  compatibilityDate: '2025-07-15',

  extends: ['../../core'],

  typescript: {
    typeCheck: false,
    strict: true,
  },

  alias: {
    '#layers/effects/types': `${import.meta.dirname}/app/types`,
    '#layers/effects': import.meta.dirname,
  },

  build: {
    transpile: ['shaders'],
  },

  vite: {
    build: {
      target: 'esnext',
    },
  },
})
