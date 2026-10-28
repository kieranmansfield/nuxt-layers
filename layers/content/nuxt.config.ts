import { createRequire } from 'node:module'

// Load nuxt-studio whenever the app has it installed (optional peer dependency). In dev it edits
// local files; in production the app supplies `studio.repository` + OAuth env vars, or opts out
// with `$production: { studio: false }` (Nuxt skips a module whose config key is `false`).
// Resolve rather than import: nuxt-studio 1.8's entry can't be imported outside Nuxt's loader.
const studioModule: string[] = []
try {
  createRequire(import.meta.url).resolve('nuxt-studio')
  studioModule.push('nuxt-studio')
} catch {}

const contentComponentsDir = `${import.meta.dirname}/app/components/content`

// Studio's slash menu offers only these `::` components (names are nuxt-component-meta
// PascalCase). Everything else stays renderable and editable, just not insertable from the menu.
// These names are public API for content: renaming one breaks every file that uses it.
const studioComponentGroups = [
  {
    label: 'Callouts',
    include: ['ProseCallout', 'ProseNote', 'ProseTip', 'ProseWarning', 'ProseCaution'],
  },
  {
    label: 'Layout',
    include: ['ProseCard', 'ProseCardGroup', 'ProseSteps', 'ProseTabs', 'ProseTabsItem'],
  },
  { label: 'Code', include: ['ProseCodeGroup'] },
  { label: 'Media', include: ['Figure'] },
]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'content',
  },

  extends: [
    '../core',
    '../structure/layout',
    '../design-system/visual',
    '../data/project-stats',
    '../motion/animations',
  ],

  alias: {
    '#layers/content': import.meta.dirname,
    '#layers/content/types': `${import.meta.dirname}/app/types`,
  },

  modules: ['@nuxt/ui', '@nuxt/content', ...studioModule],

  // Configure @nuxt/content for production/Netlify builds
  content: {
    // Disable local database for production builds to avoid better-sqlite3 native module issues
    // database: process.env.NETLIFY || process.env.NODE_ENV === 'production' ? false : {},
    experimental: {
      nativeSqlite: true,
    },
  },

  ...(studioModule.length && {
    studio: {
      editor: {
        components: { groups: studioComponentGroups, ungrouped: 'omit' as const },
      },
    },
  }),

  css: ['#layers/content/app/assets/css/content.css'],

  // Nuxt only references layer .d.ts files that live in generated .nuxt types, so register
  // the @nuxt/content frontmatter augmentation explicitly for consumers.
  hooks: {
    'prepare:types': ({ references }) => {
      references.push({ path: `${import.meta.dirname}/app/types/collections.d.ts` })
    },
    // @nuxt/content scans components/content without `global`, and Studio only lists global
    // components, so Figure & co. would be renderable in markdown but missing from Studio.
    'components:extend': (components) => {
      for (const component of components) {
        if (component.filePath.startsWith(contentComponentsDir)) component.global = true
      }
    },
  },

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
