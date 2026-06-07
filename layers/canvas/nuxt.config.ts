import type { Plugin } from 'vite'

/**
 * Intercepts three.webgpu.js in SSR via the transform hook.
 *
 * Unlike resolveId (which isn't reliably called in vite-node dev mode after
 * the module graph is built), transform IS called for every module evaluation.
 * We know this because Vite's `define` substitution — which works via transform —
 * successfully polyfilled `self` in earlier debugging.
 *
 * Both `three/webgpu` and `three/tsl` package.json exports resolve to the same
 * file: three/build/three.webgpu.js. That file accesses `self` and `navigator`
 * at module scope, crashing SSR startup. We return a lightweight stub instead.
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
    // Constructors
    'float', 'vec2', 'vec3', 'vec4', 'color', 'mat2', 'mat3', 'mat4',
    // Uniforms / attributes
    'uniform', 'attribute', 'varying',
    // Function definition
    'Fn',
    // Arithmetic
    'add', 'sub', 'mul', 'div', 'mod', 'abs', 'sign',
    'floor', 'ceil', 'fract', 'round',
    'min', 'max', 'clamp', 'mix', 'smoothstep',
    'pow', 'sqrt', 'exp', 'log',
    // Trigonometry
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
    // Vector operations
    'dot', 'cross', 'normalize', 'length', 'distance', 'reflect', 'refract',
    // Matrix operations
    'transpose', 'inverse',
    // Texture
    'texture', 'sampler',
    // Comparison / selection
    'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual',
    'step', 'select', 'cond',
    // Built-in inputs
    'uv', 'time', 'EPSILON', 'Loop',
    'positionLocal', 'positionWorld', 'positionView',
    'normalLocal', 'normalWorld', 'normalView',
    'positionViewDirection', 'cameraPosition',
    // Timers
    'timerGlobal', 'timerLocal', 'timerDelta',
  ]

  const stub =
    tslNoop +
    tslNames.map((name) => `export const ${name} = n`).join('\n') +
    `
// WebGPU class stubs (used by three/webgpu imports)
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
    transform(_code, id, options) {
      if (!options?.ssr) return null
      if (!id.includes('three.webgpu.js') && !id.includes('three.tsl.js')) return null
      return { code: stub, map: null }
    },
  }
}

export default defineNuxtConfig({
  $meta: {
    name: 'canvas',
  },

  compatibilityDate: '2026-06-06',

  extends: ['../core'],

  typescript: {
    typeCheck: true,
    strict: true,
  },

  modules: ['@tresjs/nuxt'],

  tres: {
    devtools: true,
  },

  alias: {
    // More specific alias must be registered first — Vite/Rollup alias
    // resolution is order-dependent (first prefix match wins), so
    // '#layers/canvas' would otherwise shadow '#layers/canvas/types'
    // and resolve it to '<root>/types/...' instead of '<root>/app/types/...'.
    '#layers/canvas/types': `${import.meta.dirname}/app/types`,
    '#layers/canvas': import.meta.dirname,
  },

  imports: {
    dirs: [`${import.meta.dirname}/app/composables`],
  },

  vite: {
    plugins: [threeWebGPUSSRStub()],
    optimizeDeps: {
      include: ['three', 'three/webgpu', 'three/tsl'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    build: {
      target: 'esnext',
    },
    ssr: {
      noExternal: ['three'],
    },
  },
})
