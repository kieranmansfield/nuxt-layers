// Debug app — add layers here one at a time to isolate CSS layout shift issues.
// Each layer path is relative to this file.
//
// Available layers (add in this order — each depends on the ones above it):
//   '../../layers/core'
//   '../../layers/design-system/typography'
//   '../../layers/structure/navigation'
//   '../../layers/design-system/visual'
//   '../../layers/structure/layout'
//   '../../layers/design-system/theming'
//   '../../layers/motion/motion'
//   '../../layers/content'
//   '../../layers/data/forms'
//   '../../layers/render/shader'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-24',

  extends: [
    '../../layers/core',
    '../../layers/design-system/typography',
    '../../layers/structure/navigation',
    '../../layers/design-system/visual',
    // '../../layers/structure/layout',
    // '../../layers/design-system/theming',
    // '../../layers/motion/motion',
    // '../../layers/content',
    // '../../layers/data/forms',
    // '../../layers/render/shader',
  ],

  future: {
    compatibilityVersion: 4,
  },
})
