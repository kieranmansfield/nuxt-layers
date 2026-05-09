interface RoutePage {
  file?: string
  meta?: Record<string, unknown>
  children?: RoutePage[]
}

export default defineNuxtConfig({
  $meta: { name: 'routing' },

  alias: {
    '#layers/routing': import.meta.dirname,
  },

  compatibilityDate: '2026-01-30',

  hooks: {
    'pages:extend'(pages: unknown[]) {
      const cwd = process.cwd()
      const tag = (list: RoutePage[]) => {
        for (const page of list) {
          if (page.file && !page.file.startsWith(cwd)) {
            page.meta ??= {}
            page.meta.__fromLayer = true
          }
          if (page.children) tag(page.children)
        }
      }
      tag(pages as unknown as RoutePage[])
    },
  },
})
