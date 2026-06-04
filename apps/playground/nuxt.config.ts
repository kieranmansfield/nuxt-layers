import type { Plugin } from 'vite'

// Layer configuration
const AVAILABLE_LAYERS = [
  'core',
  'ui',
  'layout',
  'motion',
  'shader',
  'forms',
  'theme',
  'content',
  'routing',
] as const
type LayerName = (typeof AVAILABLE_LAYERS)[number]

const LAYER_PATHS: Record<LayerName, string> = {
  core: '../../layers/core',
  ui: '../../layers/ui',
  layout: '../../layers/layout',
  motion: '../../layers/motion',
  shader: '../../layers/shader',
  forms: '../../layers/forms',
  theme: '../../layers/theme',
  content: '../../layers/content',
  routing: '../../layers/routing',
}

// Layer dependencies - if a layer is enabled, its dependencies are auto-included
const LAYER_DEPENDENCIES: Record<LayerName, LayerName[]> = {
  core: [],
  ui: ['core'], // ui depends on core
  layout: ['core'], // layout depends on core
  motion: ['core'], // motion depends on core
  shader: ['core'], // shader depends on core
  forms: ['core'], // forms depends on core
  theme: ['core'],
  content: ['core'],
  routing: ['core'],
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

/**
 * Stubs three.webgpu.js in SSR via the transform hook.
 *
 * three/webgpu and three/tsl both resolve to three/build/three.webgpu.js.
 * That file accesses `self` and `navigator` at module scope, crashing SSR
 * startup when shader composables are auto-imported. The transform hook is
 * used (not resolveId) because vite-node caches module graph resolutions and
 * calls transform — not resolveId — when fetching each module.
 */
function threeWebGPUSSRStub(): Plugin {
  const tslNoop = `
const n = new Proxy(function noop() { return n }, {
  get(_t, k) {
    if (k === 'then' || k === Symbol.toPrimitive || k === Symbol.iterator || k === Symbol.toStringTag) return undefined
    return n
  },
  apply() { return n },
  construct() { return Object.create(n) },
})
`
  const tslNames = [
    'float',
    'vec2',
    'vec3',
    'vec4',
    'color',
    'mat2',
    'mat3',
    'mat4',
    'uniform',
    'attribute',
    'varying',
    'Fn',
    'add',
    'sub',
    'mul',
    'div',
    'mod',
    'abs',
    'sign',
    'floor',
    'ceil',
    'fract',
    'round',
    'min',
    'max',
    'clamp',
    'mix',
    'smoothstep',
    'pow',
    'sqrt',
    'exp',
    'log',
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'atan2',
    'dot',
    'cross',
    'normalize',
    'length',
    'distance',
    'reflect',
    'refract',
    'transpose',
    'inverse',
    'texture',
    'sampler',
    'lessThan',
    'lessThanEqual',
    'greaterThan',
    'greaterThanEqual',
    'step',
    'select',
    'cond',
    'uv',
    'time',
    'EPSILON',
    'Loop',
    'positionLocal',
    'positionWorld',
    'positionView',
    'normalLocal',
    'normalWorld',
    'normalView',
    'positionViewDirection',
    'cameraPosition',
    'timerGlobal',
    'timerLocal',
    'timerDelta',
  ]

  const stub =
    tslNoop +
    tslNames.map((name) => `export const ${name} = n`).join('\n') +
    `
export class MeshBasicNodeMaterial {
  constructor() { this.colorNode = null; this.side = null }
}
export class MeshStandardNodeMaterial {
  constructor() { this.colorNode = null; this.side = null }
}
export class TextureLoader {
  load() { return null }
}
export class UniformNode {}
export default {}
`

  return {
    name: 'three-webgpu-ssr-stub',
    enforce: 'pre',
    transform(code, id, options) {
      if (!options?.ssr) return null
      // In three r182+, three/webgpu → three.webgpu.js, three/tsl → three.tsl.js
      if (!id.includes('three.webgpu.js') && !id.includes('three.tsl.js')) return null
      return { code: stub, map: null }
    },
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: resolveExtendedLayers(),
  devtools: { enabled: true },

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
    plugins: [threeWebGPUSSRStub()],
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
      ignore: ['/admin'],
    },
  },

  modules: [
    '@netlify/nuxt',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@nuxt/content',
    'v-gsap-nuxt',
  ],
})
