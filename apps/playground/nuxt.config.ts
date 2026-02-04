// Layer configuration
const AVAILABLE_LAYERS = ['core', 'ui', 'layout', 'motion', 'shader', 'forms', 'theme'] as const
type LayerName = (typeof AVAILABLE_LAYERS)[number]

const LAYER_PATHS: Record<LayerName, string> = {
  core: '../../layers/core',
  ui: '../../layers/ui',
  layout: '../../layers/layout',
  motion: '../../layers/motion',
  shader: '../../layers/shader',
  forms: '../../layers/forms',
  theme: '../../layers/theme',
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

  $development: {
    vite: {
      server: {
        watch: {
          usePolling: true,
        },
      },
      optimizeDeps: {
        force: true, // Force re-bundling deps on every start
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

  // modules: ['@nuxt/eslint'],
  // eslint: {
  //   config: {
  //     // Use the generated ESLint config for lint root project as well
  //     rootDir: fileURLToPath(new URL('..', import.meta.url)),
  //   },
  // },
})
