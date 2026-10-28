// Layer configuration
const AVAILABLE_LAYERS = [
  'core',
  'seo',
  'scripts',
  'typography',
  'navigation',
  'visual',
  'layout',
  'grid',
  'scroll',
  'animations',
  'transitions',
  'page-transitions',
  'motion',
  'canvas',
  'shader',
  'mailer',
  'forms',
  'theming',
  'content',
  'routing',
  'feeds',
  'capture',
  'database',
  'auth',
  'metadata',
  'metadata-comicvine',
  'metadata-openlibrary',
  'metadata-google-books',
  'metadata-tmdb',
  'project-stats',
] as const
type LayerName = (typeof AVAILABLE_LAYERS)[number]

const LAYER_PATHS: Record<LayerName, string> = {
  core: '../../layers/core',
  seo: '../../layers/delivery/seo',
  scripts: '../../layers/delivery/scripts',
  typography: '../../layers/design-system/typography',
  navigation: '../../layers/structure/navigation',
  visual: '../../layers/design-system/visual',
  layout: '../../layers/structure/layout',
  grid: '../../layers/structure/grid',
  scroll: '../../layers/motion/scroll',
  animations: '../../layers/motion/animations',
  transitions: '../../layers/motion/transitions',
  'page-transitions': '../../layers/motion/page-transitions',
  motion: '../../layers/motion/motion',
  canvas: '../../layers/render/canvas',
  shader: '../../layers/render/shader',
  mailer: '../../layers/data/mailer',
  forms: '../../layers/data/forms',
  theming: '../../layers/design-system/theming',
  content: '../../layers/content',
  routing: '../../layers/structure/routing',
  feeds: '../../layers/delivery/feeds',
  capture: '../../layers/delivery/capture',
  database: '../../layers/data/database',
  auth: '../../layers/data/auth',
  metadata: '../../layers/data/metadata',
  'metadata-comicvine': '../../layers/data/metadata/providers/comicvine',
  'metadata-openlibrary': '../../layers/data/metadata/providers/openlibrary',
  'metadata-google-books': '../../layers/data/metadata/providers/google-books',
  'metadata-tmdb': '../../layers/data/metadata/providers/themoviedb',
  'project-stats': '../../layers/data/project-stats',
}

// Nuxt resolves each layer's own `extends` transitively, so dependencies are NOT listed here.

/**
 * Resolves which layers to extend based on environment configuration.
 *
 * PLAYGROUND_LAYERS: Comma-separated list (e.g., "core,typography")
 * If not set, all layers are enabled
 */
function resolveExtendedLayers(): string[] {
  const layersEnv = process.env.PLAYGROUND_LAYERS?.trim()

  if (!layersEnv) {
    // Default: all layers enabled
    return AVAILABLE_LAYERS.map((name) => LAYER_PATHS[name])
  }

  const requested = layersEnv
    .split(',')
    .map((s) => s.trim().toLowerCase() as LayerName)
    .filter((name) => AVAILABLE_LAYERS.includes(name))

  return AVAILABLE_LAYERS.filter((name) => requested.includes(name)).map(
    (name) => LAYER_PATHS[name]
  )
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: resolveExtendedLayers(),
  // App-level choices (previously forced on every consumer by the core layer)
  future: { compatibilityVersion: 5 },
  devtools: { enabled: true, vscode: { enabled: true } },
  css: ['~/assets/css/playground.css'],

  routeRules: {
    '/_studio/**': { redirect: '/' },
  },

  // The content layer loads nuxt-studio whenever it's installed. The playground deploy has no
  // Studio OAuth app, so keep Studio to `pnpm dev` (local file editing) only.
  $production: {
    studio: false,
  },

  // TresJS components (Tres*, primitive) must be excluded from Vue component
  // resolution — they're handled by TresJS's custom renderer. @tresjs/nuxt sets
  // this too, but setting it here ensures it survives any module ordering issues.
  // TresCanvas/TresLeches/TresScene are whitelisted by @tresjs/core: they are
  // real Vue components and must NOT be treated as custom elements.
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => {
        if (tag === 'baseline-status' || tag === 'baseline-icon') return true
        const tresVueComponents = ['TresCanvas', 'TresLeches', 'TresScene']
        return (
          ((/^Tres[A-Z]/.test(tag) || tag.startsWith('tres-')) &&
            !tresVueComponents.includes(tag)) ||
          tag === 'primitive'
        )
      },
    },
  },

  vite: {
    build: {
      // Merge all CSS into one bundle so every Tailwind utility and Nuxt UI style
      // is available from first paint — no deferred CSS chunks causing layout shifts.
      cssCodeSplit: false,
      target: 'es2020',
    },
    resolve: {
      dedupe: [
        'vue',
        '@vue/runtime-core',
        '@vue/runtime-dom',
        '@vue/reactivity',
        '@vue/shared',
        'three',
      ],
    },
    optimizeDeps: {
      // slugify is CJS-only. Pre-bundling it here ensures Vite converts it to
      // ESM before any request hits it. Without this (or if force:true discards
      // the cache before the bundle is ready) the browser gets the raw CJS file
      // and throws "does not provide an export named 'default'".
      // include: ['slugify'],
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'locomotive-scroll',
        'slugify',
        'three',
        'three/tsl',
        'three/webgpu',
        '@unhead/schema-org/vue',
        'baseline-status',
      ],
    },
    ssr: {
      // Also bundle slugify for SSR — @nuxt/content uses it server-side.
      noExternal: ['slugify'],
    },
  },

  $development: {
    vite: {
      server: {
        watch: {
          usePolling: true,
        },
      },
      optimizeDeps: {
        // Keep slugify in include alongside force so the CJS→ESM conversion
        // is always re-run when the cache is cleared.
        // include: ['slugify'],
        include: [
          '@vue/devtools-core',
          '@vue/devtools-kit',
          'locomotive-scroll',
          'slugify',
          'three',
          'three/tsl',
          'three/webgpu',
          '@unhead/schema-org/vue',
          'baseline-status',
        ],
        // Removed force:true — it clears the dep cache on every start which
        // causes slugify to be served as a raw CJS file while Vite is still
        // re-optimising. Run `nuxt dev --force` manually when you need a
        // fresh dep scan.
      },
    },
    nitro: {
      devStorage: {
        cache: {
          driver: 'memory', // Use memory storage instead of filesystem cache
        },
      },
    },
  },

  // Netlify deployment configuration
  // modules: ['@nuxt/eslint'],
  // eslint: {
  //   config: {
  //     // Use the generated ESLint config for lint root project as well
  //     rootDir: fileURLToPath(new URL('..', import.meta.url)),
  //   },
  // },
  nitro: {
    // std-env detects GITHUB_ACTIONS before NETLIFY, so in CI the provider
    // resolves to "github_actions" and Nitro silently falls back to node-server.
    // Pinning the preset ensures the Netlify Function is always generated.
    preset: 'netlify',
    prerender: {
      crawlLinks: true,
      // Collection-specific feed routes aren't reachable via <a href> links so
      // the crawler can't discover them. List them explicitly so they're built as
      // static files alongside the shorthand routes added by the feeds layer.
      //
      // The /all variants are omitted on purpose — /feed/blog/rss (a file) and
      // /feed/blog/rss/all (needs feed/blog/rss/ as a directory) collide on disk.
      // The /all routes are served dynamically by the Nitro function instead.
      routes: ['/feed/blog/rss', '/feed/blog/atom', '/feed/blog/json'],
      ignore: ['/admin'],
    },
  },

  modules: [
    '@netlify/nuxt',
    '@nuxt/ui',
    '@nuxt/test-utils/module',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@nuxt/content',
    'v-gsap-nuxt',
  ],
})
