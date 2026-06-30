// Layer configuration
const AVAILABLE_LAYERS = [
  'core',
  'seo',
  'scripts',
  'typography',
  'navigation',
  'visual',
  'ui',
  'layout',
  'scroll',
  'animations',
  'transitions',
  'page-transitions',
  'motion',
  'canvas',
  'shader',
  'mailer',
  'forms',
  'theme',
  'content',
  'routing',
  'feeds',
  'baseline',
  'database',
  'auth',
  'metadata',
  'metadata-comicvine',
  'metadata-openlibrary',
  'metadata-google-books',
] as const
type LayerName = (typeof AVAILABLE_LAYERS)[number]

const LAYER_PATHS: Record<LayerName, string> = {
  core: '../../layers/core',
  seo: '../../layers/seo',
  scripts: '../../layers/scripts',
  typography: '../../layers/typography',
  navigation: '../../layers/navigation',
  visual: '../../layers/visual',
  ui: '../../layers/ui',
  layout: '../../layers/layout',
  scroll: '../../layers/scroll',
  animations: '../../layers/animations',
  transitions: '../../layers/transitions',
  'page-transitions': '../../layers/page-transitions',
  motion: '../../layers/motion',
  canvas: '../../layers/canvas',
  shader: '../../layers/shader',
  mailer: '../../layers/mailer',
  forms: '../../layers/forms',
  theme: '../../layers/theme',
  content: '../../layers/content',
  routing: '../../layers/routing',
  feeds: '../../layers/feeds',
  baseline: '../../layers/baseline',
  database: '../../layers/database',
  auth: '../../layers/auth',
  metadata: '../../layers/metadata',
  'metadata-comicvine': '../../layers/metadata/providers/comicvine',
  'metadata-openlibrary': '../../layers/metadata/providers/openlibrary',
  'metadata-google-books': '../../layers/metadata/providers/google-books',
}

// Layer dependencies - if a layer is enabled, its dependencies are auto-included
const LAYER_DEPENDENCIES: Record<LayerName, LayerName[]> = {
  core: [],
  seo: ['core'],
  scripts: ['core'],
  typography: ['core'],
  navigation: ['core', 'scroll', 'layout', 'typography'],
  visual: ['core'],
  ui: ['typography', 'navigation', 'visual'],
  layout: ['core'],
  scroll: ['core'],
  animations: ['scroll'],
  transitions: ['core'],
  'page-transitions': ['core'],
  motion: ['scroll', 'animations', 'transitions', 'page-transitions'],
  canvas: ['core'],
  shader: ['canvas'],
  mailer: ['core'],
  forms: ['mailer'],
  theme: ['core'],
  content: ['core'],
  routing: ['core'],
  feeds: ['core', 'content'],
  baseline: ['core'],
  database: ['core'],
  auth: ['core'],
  metadata: ['core'],
  'metadata-comicvine': ['metadata'],
  'metadata-openlibrary': ['metadata'],
  'metadata-google-books': ['metadata'],
}

/**
 * Resolves which layers to extend based on environment configuration
 * Automatically includes layer dependencies.
 *
 * PLAYGROUND_LAYERS: Comma-separated list (e.g., "core,ui")
 * If not set, all layers are enabled
 */
function resolveExtendedLayers(): string[] {
  const layersEnv = process.env.PLAYGROUND_LAYERS?.trim()

  if (!layersEnv) {
    // Default: all layers enabled
    return AVAILABLE_LAYERS.map((name) => LAYER_PATHS[name])
  }

  // Parse comma-separated layer names
  const requestedLayers = layersEnv
    .split(',')
    .map((s) => s.trim().toLowerCase() as LayerName)
    .filter((name) => AVAILABLE_LAYERS.includes(name))

  // Resolve dependencies
  const resolvedLayers = new Set<LayerName>()

  function addWithDependencies(layer: LayerName) {
    if (resolvedLayers.has(layer)) return
    LAYER_DEPENDENCIES[layer].forEach(addWithDependencies)
    resolvedLayers.add(layer)
  }

  requestedLayers.forEach(addWithDependencies)

  // Return paths in correct order (dependencies first)
  return AVAILABLE_LAYERS.filter((name) => resolvedLayers.has(name)).map(
    (name) => LAYER_PATHS[name]
  )
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: resolveExtendedLayers(),
  devtools: { enabled: true },
  css: ['./app/assets/css/playground.css'],

  routeRules: {
    '/_studio/**': { redirect: '/' },
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
        '@vue/devtools-kit',
        'locomotive-scroll',
        'slugify',
        'three',
        'three/tsl',
        'three/webgpu',
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
          '@vue/devtools-kit',
          'locomotive-scroll',
          'slugify',
          'three',
          'three/tsl',
          'three/webgpu',
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
      routes: [
        '/feed/discovery',
        '/feed/blog/rss',
        '/feed/blog/atom',
        '/feed/blog/json',
        '/feed/blog/rss/all',
        '/feed/blog/atom/all',
        '/feed/blog/json/all',
      ],
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
