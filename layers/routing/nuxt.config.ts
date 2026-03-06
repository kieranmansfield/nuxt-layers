import type { NuxtPage } from '@nuxt/schema'

export default defineNuxtConfig({
  $meta: { name: 'routing' },

  alias: {
    '#layers/routing': import.meta.dirname,
  },

  compatibilityDate: '2026-01-30',

  hooks: {
    'pages:extend'(pages) {
      const cwd = process.cwd()
      const tag = (list: NuxtPage[]) => {
        for (const page of list) {
          if (page.file && !page.file.startsWith(cwd)) {
            page.meta ??= {}
            page.meta.__fromLayer = true
          }
          if (page.children) tag(page.children)
        }
      }
      tag(pages)
    },
  },
})
