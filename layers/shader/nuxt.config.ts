export default defineNuxtConfig({
  modules: ['@tresjs/nuxt'],

  tres: {
    devtools: true,
  },

  css: ['#layers/shader/app/assets/css/main.css'],

  alias: {
    '#layers/shader': import.meta.dirname,
  },

  components: [
    {
      path: './app/components',
      pathPrefix: false,
      global: true,
    },
  ],

  imports: {
    dirs: [
      './app/composables',
      './app/utils/tsl',
      './app/shaders',
      './app/shaders/common',
      './app/shaders/layers',
    ],
  },

  // Vite config for WebGPU/TSL support
  vite: {
    optimizeDeps: {
      include: ['three', 'three/webgpu', 'three/tsl'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    build: {
      target: 'esnext',
    },
    // SSR config - exclude WebGPU from SSR
    ssr: {
      noExternal: ['three'],
    },
  },
})
