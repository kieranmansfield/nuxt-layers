export default defineNuxtConfig({
  $meta: { name: 'transitions' },
  extends: ['../../core'],
  alias: {
    '#layers/transitions': import.meta.dirname,
    '#layers/transitions/types': `${import.meta.dirname}/app/types`,
  },
  css: ['#layers/transitions/app/assets/css/transitions.css'],
  // Motion presets hide their "from" state only under this flag (transitions.css), so content
  // stays visible when JavaScript doesn't run. Inline and in <head>, so it's set before paint.
  app: {
    head: {
      script: [{ key: 'motion-js', innerHTML: "document.documentElement.dataset.motionJs = ''" }],
    },
  },
  compatibilityDate: '2026-06-06',
  typescript: {
    typeCheck: false,
    strict: true,
  },
})
