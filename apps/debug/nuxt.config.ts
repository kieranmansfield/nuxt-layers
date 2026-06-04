// Debug app — add layers here one at a time to isolate CSS layout shift issues.
// Each layer path is relative to this file.
//
// Available layers (add in this order — each depends on the ones above it):
//   '../../layers/core'
//   '../../layers/ui'
//   '../../layers/layout'
//   '../../layers/theme'
//   '../../layers/motion'
//   '../../layers/content'
//   '../../layers/forms'
//   '../../layers/shader'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-24',

  extends: [
    '../../layers/core',
    '../../layers/ui',
    // '../../layers/layout',
    // '../../layers/theme',
    // '../../layers/motion',
    // '../../layers/content',
    // '../../layers/forms',
    // '../../layers/shader',
  ],

  future: {
    compatibilityVersion: 4,
  },
})
