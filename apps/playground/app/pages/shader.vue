<script setup lang="ts">
useSeoMeta({
  title: 'Shader Layer Demo',
  description: 'TSL shader utilities - noise, SDF, lighting, tonemapping, patterns & effects',
})

// Demo state
type DemoCategory =
  | 'overview'
  | 'noise'
  | 'sdf'
  | 'lighting'
  | 'tonemapping'
  | 'patterns'
  | 'effects'
  | 'math'
  | 'uv'
const activeCategory = ref<DemoCategory>('overview')

const categories = [
  { id: 'overview', label: 'Overview', icon: 'i-lucide-layers' },
  { id: 'noise', label: 'Noise', icon: 'i-lucide-waves' },
  { id: 'sdf', label: 'SDF Shapes', icon: 'i-lucide-shapes' },
  { id: 'lighting', label: 'Lighting', icon: 'i-lucide-sun' },
  { id: 'tonemapping', label: 'Tonemapping', icon: 'i-lucide-palette' },
  { id: 'patterns', label: 'Patterns', icon: 'i-lucide-grid-3x3' },
  { id: 'effects', label: 'Effects', icon: 'i-lucide-sparkles' },
  { id: 'math', label: 'Math', icon: 'i-lucide-calculator' },
  { id: 'uv', label: 'UV & Grain', icon: 'i-lucide-move' },
] as const

// Mouse interaction state
const mouseX = ref(0.5)
const mouseY = ref(0.5)

function handleMouseMove(e: MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  mouseX.value = (e.clientX - rect.left) / rect.width
  mouseY.value = 1 - (e.clientY - rect.top) / rect.height
}

// Shader control settings
const noiseControls = reactive({
  scale: 4,
  speed: 1.0,
  mouseStrength: 1.0,
  mouseInteraction: true,
  enableZoom: false,
})

const sdfControls = reactive({
  smoothness: 0.25,
  speed: 1.0,
  mouseStrength: 0.5,
  mouseInteraction: true,
  enableZoom: false,
})

const effectControls = reactive({
  distortion: 0.03,
  rgbShift: 3,
  mouseRipple: true,
  vignette: true,
  grayscale: 0,
  enableZoom: false,
})

const uvControls = reactive({
  distortion: 0.05,
  rgbShift: 4,
  mouseRipple: true,
  vignette: true,
  enableZoom: false,
})

const lightingControls = reactive({
  fresnelPower: 3.0,
  speed: 1.0,
  mouseInteraction: true,
  enableZoom: true,
})

const patternControls = reactive({
  scale: 1.0,
  speed: 1.0,
  mouseStrength: 0.3,
  mouseInteraction: true,
  enableZoom: false,
})

const tonemappingControls = reactive({
  speed: 1.0,
  mouseStrength: 0.5,
  mouseInteraction: true,
  enableZoom: false,
})

const mathControls = reactive({
  speed: 1.0,
  mouseStrength: 0.5,
  mouseInteraction: true,
  enableZoom: false,
})

// Active demo for each category
type DemoType = 'noise' | 'gradient' | 'fresnel' | 'mesh' | 'stripe' | 'aurora' | 'radial' | 'image'
const activeNoiseDemo = ref<DemoType>('noise')
const activeSdfDemo = ref<DemoType>('mesh')
const activeLightingDemo = ref<DemoType>('fresnel')
const activeTonemappingDemo = ref<DemoType>('aurora')
const activePatternDemo = ref<DemoType>('stripe')
const activeEffectDemo = ref<DemoType>('radial')
const activeMathDemo = ref<DemoType>('radial')
const activeUvDemo = ref<DemoType>('image')

// Noise demo options
const noiseDemoOptions = [
  { id: 'noise', name: 'FBM Noise', description: 'Fractal Brownian Motion - layered noise' },
  { id: 'gradient', name: 'Gradient', description: 'Animated linear gradient' },
  { id: 'stripe', name: 'Flow Noise', description: 'Flowing stripe patterns' },
]

// SDF demo options
const sdfDemoOptions = [
  { id: 'mesh', name: 'Metaballs', description: 'Smooth blended organic shapes' },
  { id: 'radial', name: 'Radial SDF', description: 'Pulsing radial gradient' },
  { id: 'aurora', name: 'Aurora', description: 'Curtain-like SDF patterns' },
]

// Lighting demo options
const lightingDemoOptions = [
  { id: 'fresnel', name: 'Fresnel', description: 'Rim lighting on 3D sphere' },
  { id: 'gradient', name: 'Hemisphere', description: 'Sky/ground ambient light' },
  { id: 'aurora', name: 'Diffuse', description: 'Soft directional lighting' },
]

// Tonemapping demo options
const tonemappingDemoOptions = [
  { id: 'aurora', name: 'Aurora HDR', description: 'High dynamic range colors' },
  { id: 'stripe', name: 'Stripe HDR', description: 'Bright flowing gradients' },
  { id: 'mesh', name: 'Mesh HDR', description: 'Vibrant blob colors' },
]

// Pattern demo options
const patternDemoOptions = [
  { id: 'stripe', name: 'Flowing Stripes', description: 'Animated stripe pattern' },
  { id: 'noise', name: 'Noise Pattern', description: 'Procedural noise texture' },
  { id: 'mesh', name: 'Blob Pattern', description: 'Organic blob shapes' },
]

// Effect demo options
const effectDemoOptions = [
  { id: 'radial', name: 'Radial Pulse', description: 'Pulsing radial effect' },
  { id: 'mesh', name: 'Blob Blend', description: 'Smooth color blending' },
  { id: 'image', name: 'Image FX', description: 'Distortion & chromatic' },
]

// UV demo options
const uvDemoOptions = [
  { id: 'image', name: 'UV Distortion', description: 'Ripple & warp effects' },
  { id: 'radial', name: 'Polar UV', description: 'Polar coordinate mapping' },
  { id: 'stripe', name: 'Wave UV', description: 'Wave distortion' },
]

// Noise functions list
const noiseFunctions = [
  { name: 'simplexNoise2D', description: '2D simplex gradient noise', category: 'Basic' },
  {
    name: 'simplexNoise3d',
    description: '3D simplex noise for volumetric effects',
    category: 'Basic',
    isNew: true,
  },
  {
    name: 'simplexNoise4d',
    description: '4D simplex for animated 3D noise',
    category: 'Basic',
    isNew: true,
  },
  { name: 'perlinNoise3d', description: 'Classic 3D Perlin noise', category: 'Basic', isNew: true },
  { name: 'gradientNoise3D', description: '3D gradient noise', category: 'Basic' },
  { name: 'valueNoise2D', description: 'Simple 2D value noise', category: 'Basic' },
  { name: 'fbm2D / fbm3D', description: 'Fractal Brownian Motion', category: 'FBM' },
  {
    name: 'fbm3dSimplex',
    description: 'FBM using 3D simplex with normalization',
    category: 'FBM',
    isNew: true,
  },
  {
    name: 'ridgedFbm2d / ridgedFbm3d',
    description: 'Sharp ridges for mountains/veins',
    category: 'FBM',
    isNew: true,
  },
  {
    name: 'warpedFbmCoords',
    description: 'Organic flowing warped patterns',
    category: 'FBM',
    isNew: true,
  },
  {
    name: 'curlNoise3d',
    description: 'Divergence-free flow fields',
    category: 'Advanced',
    isNew: true,
  },
  { name: 'turbulence2D', description: 'Absolute value of FBM', category: 'Advanced' },
  {
    name: 'turbulenceRotational',
    description: 'XorDev-style rotational turbulence',
    category: 'Advanced',
    isNew: true,
  },
  { name: 'voronoi2D', description: 'Cellular/Voronoi noise', category: 'Advanced' },
  { name: 'domainWarp2D', description: 'Domain warping for organic effects', category: 'Advanced' },
]

const noiseHelpers = [
  { name: 'mod289Vec3 / mod289Vec4', description: 'Mod289 for precision in noise' },
  { name: 'fade', description: 'Quintic fade for smooth interpolation' },
  { name: 'permuteVec4 / permuteFloat', description: 'Permutation for pseudo-random values' },
  { name: 'taylorInvSqrtVec4', description: 'Fast inverse sqrt for normalization' },
  { name: 'grad4', description: '4D gradient for simplex noise' },
  { name: 'hash21 / hash22 / hash33', description: 'Hash functions for randomness' },
]

// SDF functions list
const sdfShapes = [
  { name: 'sdSphere', description: 'Circle/Sphere SDF', params: 'uv, radius' },
  { name: 'sdBox2d', description: '2D Box SDF', params: 'uv, size' },
  { name: 'sdBox3d', description: '3D Box SDF', params: 'p, size' },
  { name: 'sdDiamond', description: 'Diamond (rotated square)', params: 'uv, radius' },
  { name: 'sdHexagon', description: 'Hexagon SDF', params: 'p, radius' },
  { name: 'sdEquilateralTriangle', description: 'Equilateral triangle', params: 'p, radius' },
  { name: 'sdTriangle', description: 'Simple triangle', params: 'p, size' },
  { name: 'sdLine', description: 'Line SDF', params: 'p' },
  { name: 'sdRing', description: 'Ring/annulus SDF', params: 'uv, radius' },
  { name: 'sdParallelogram', description: 'Parallelogram with skew', params: 'p, options' },
  { name: 'sdRhombus', description: 'Rhombus SDF', params: 'p, size' },
]

const sdfOperations = [
  { name: 'smin', description: 'Smooth minimum for blending', params: 'a, b, factor' },
  { name: 'smax', description: 'Smooth maximum', params: 'a, b, factor' },
]

// Lighting functions
const lightingFunctions = [
  {
    name: 'fresnel',
    description: 'Rim lighting effect at grazing angles',
    params: 'viewDir, normal, exponent',
  },
  {
    name: 'hemi',
    description: 'Hemispheric ambient lighting',
    params: 'normal, groundColor, skyColor',
  },
  {
    name: 'diffuse',
    description: 'Lambertian diffuse lighting',
    params: 'lightDir, normal, lightColor',
  },
  {
    name: 'phongSpecular',
    description: 'Phong specular highlights',
    params: 'viewDir, normal, lightDir, shininess',
  },
  {
    name: 'blinnPhongSpecular',
    description: 'Blinn-Phong (more accurate)',
    params: 'viewDir, normal, lightDir, shininess',
  },
  {
    name: 'phongLighting',
    description: 'Combined ambient+diffuse+specular',
    params: 'viewDir, normal, lightDir, lightColor, options',
  },
]

// Tonemapping functions
const tonemappingFunctions = [
  { name: 'reinhardTonemap', description: 'Simple, fast, general use', style: 'Standard' },
  { name: 'reinhardExtendedTonemap', description: 'With white point control', style: 'Standard' },
  { name: 'uncharted2Tonemap', description: 'Cinematic filmic look', style: 'Standard' },
  { name: 'acesTonemap', description: 'Industry standard for film/TV', style: 'Standard' },
  { name: 'unrealTonemap', description: 'Unreal Engine style', style: 'Standard' },
  { name: 'tanhTonemap', description: 'Smooth S-curve with tanh', style: 'Standard' },
  { name: 'crossProcessTonemap', description: 'Exaggerated color shifts', style: 'Stylized' },
  { name: 'bleachBypassTonemap', description: 'High contrast, desaturated', style: 'Stylized' },
  { name: 'technicolorTonemap', description: 'Retro film look', style: 'Stylized' },
  { name: 'cinematicTonemap', description: 'S-curve with color shift', style: 'Stylized' },
]

// Pattern functions
const patternFunctions = [
  { name: 'canvasWeavePattern', description: 'Organic woven fabric texture', isNew: true },
  { name: 'ledPattern', description: 'LED screen dot grid', isNew: true },
  { name: 'speckledNoisePattern', description: 'Scattered organic speckles', isNew: true },
  { name: 'dotGridPattern', description: 'Regular dot grid', isNew: true },
  { name: 'checkerPattern', description: 'Checkerboard pattern', isNew: true },
  { name: 'stripePattern', description: 'Configurable stripes', isNew: true },
]

// Effects functions
const effectFunctions = [
  {
    name: 'ledEffect',
    description: 'LED screen post-processing',
    params: 'input, inputUV, options',
  },
  {
    name: 'pixellationEffect',
    description: 'Mosaic/pixel art effect',
    params: 'input, inputUV, options',
  },
  {
    name: 'chromaticAberrationEffect',
    description: 'RGB channel separation',
    params: 'input, inputUV, options',
  },
  { name: 'bulgeEffect', description: 'Bulge/pinch distortion', params: 'input, inputUV, options' },
  {
    name: 'waveDistortionEffect',
    description: 'Animated wave distortion',
    params: 'input, inputUV, options',
  },
  {
    name: 'swirlDistortionEffect',
    description: 'Swirl/vortex distortion',
    params: 'input, inputUV, options',
  },
]

// Math functions
const mathFunctions = [
  { name: 'tanh', description: 'Hyperbolic tangent', category: 'Hyperbolic' },
  { name: 'sinh', description: 'Hyperbolic sine', category: 'Hyperbolic' },
  { name: 'cosh', description: 'Hyperbolic cosine', category: 'Hyperbolic' },
  { name: 'complexMul', description: 'Complex multiplication', category: 'Complex' },
  { name: 'complexDiv', description: 'Complex division', category: 'Complex' },
  { name: 'complexLog', description: 'Complex logarithm', category: 'Complex' },
  { name: 'complexPow', description: 'Complex power', category: 'Complex' },
  {
    name: 'complexSin / complexCos / complexTan',
    description: 'Complex trig functions',
    category: 'Complex',
  },
  { name: 'asPolar', description: 'Convert to polar form', category: 'Complex' },
  { name: 'grad', description: 'Bilinear 4-color gradient', category: 'Coordinates' },
  { name: 'cartesianToPolar', description: 'Cartesian to polar coords', category: 'Coordinates' },
  { name: 'polarToCartesian', description: 'Polar to Cartesian coords', category: 'Coordinates' },
]

// UV functions
const uvFunctions = [
  { name: 'scaleUV', description: 'Scale UV from center' },
  { name: 'rotateUV', description: 'Rotate UV around center' },
  { name: 'translateUV', description: 'Translate UV offset' },
  { name: 'tileUV', description: 'Tile/repeat UV' },
  { name: 'mirrorUV', description: 'Mirror UV at edges' },
  { name: 'toPolar / fromPolar', description: 'Polar coordinate conversion' },
  { name: 'waveUV', description: 'Wave distortion' },
  { name: 'rippleUV', description: 'Radial ripple distortion' },
  { name: 'swirlUV', description: 'Swirl/vortex distortion' },
  { name: 'barrelUV', description: 'Barrel/fisheye distortion' },
  { name: 'pincushionUV', description: 'Pincushion distortion' },
  { name: 'kaleidoscopeUV', description: 'Kaleidoscope effect' },
  { name: 'zoomUV', description: 'Zoom from center' },
  { name: 'bulgeUV', description: 'Bulge/pinch distortion', isNew: true },
  { name: 'aspectCorrect', description: 'Correct for aspect ratio' },
  { name: 'coverUV / containUV', description: 'CSS-like background sizing' },
  { name: 'scrollUV', description: 'Infinite scroll animation' },
  { name: 'parallaxUV', description: 'Parallax offset' },
]

// Grain functions
const grainFunctions = [
  { name: 'grain', description: 'Simple film grain' },
  { name: 'animatedGrain', description: 'Time-based animated grain' },
  { name: 'coloredGrain', description: 'RGB colored grain' },
  { name: 'bayer2x2 / bayer4x4', description: 'Bayer dithering matrices' },
  { name: 'bayer8x8', description: '8x8 Bayer for high-quality dithering', isNew: true },
  { name: 'dither8x8Color', description: 'Apply 8x8 dithering to color', isNew: true },
  { name: 'ditherColor', description: 'Apply dithering to color' },
  { name: 'scanlines', description: 'CRT scanlines' },
  { name: 'interlace', description: 'Interlaced scanlines' },
  { name: 'vignette', description: 'Circular vignette' },
  { name: 'rectVignette', description: 'Rectangular vignette' },
  { name: 'paperTexture', description: 'Paper texture noise' },
  { name: 'halftone', description: 'Halftone dot pattern' },
  { name: 'crtEffect', description: 'Full CRT effect combo' },
]

// Stats
const totalNewFunctions = computed(() => {
  let count = 0
  noiseFunctions.forEach((f) => f.isNew && count++)
  patternFunctions.forEach((f) => f.isNew && count++)
  uvFunctions.forEach((f) => f.isNew && count++)
  grainFunctions.forEach((f) => f.isNew && count++)
  count += sdfShapes.length + sdfOperations.length
  count += lightingFunctions.length
  count += tonemappingFunctions.length
  count += effectFunctions.length
  count += mathFunctions.length
  count += noiseHelpers.length
  return count
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-br from-violet-900/30 via-transparent to-cyan-900/20"
      />
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
      </div>

      <UContainer class="relative py-20">
        <div class="flex items-center gap-4 mb-8">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" class="text-gray-400" />
          <UBadge color="primary" variant="subtle">Shader Layer</UBadge>
        </div>

        <h1 class="text-5xl md:text-7xl font-black mb-6">
          <span class="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
            TSL Shader
          </span>
          <br />
          <span class="text-white">Utilities</span>
        </h1>

        <p class="text-xl text-gray-400 max-w-2xl mb-8">
          Modular Three.js Shading Language (TSL) utilities for procedural graphics. Noise, SDF
          shapes, lighting, tonemapping, patterns, and post-processing effects.
        </p>

        <div class="flex flex-wrap gap-4 mb-12">
          <div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl px-6 py-4">
            <div class="text-3xl font-bold text-violet-400">{{ totalNewFunctions }}+</div>
            <div class="text-sm text-gray-400">New Functions</div>
          </div>
          <div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl px-6 py-4">
            <div class="text-3xl font-bold text-cyan-400">9</div>
            <div class="text-sm text-gray-400">Categories</div>
          </div>
          <div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl px-6 py-4">
            <div class="text-3xl font-bold text-pink-400">100%</div>
            <div class="text-sm text-gray-400">TypeScript</div>
          </div>
          <NuxtLink
            to="/ambient"
            class="bg-linear-to-r from-violet-600/20 to-cyan-600/20 backdrop-blur border border-violet-500/50 rounded-xl px-6 py-4 hover:border-violet-500 transition-colors group"
          >
            <div class="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
              Ambient Backgrounds
            </div>
            <div class="text-sm text-gray-400">TSL-powered WebGPU demos</div>
          </NuxtLink>
        </div>

        <!-- Category Navigation -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
            :class="[
              activeCategory === cat.id
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white',
            ]"
            @click="activeCategory = cat.id"
          >
            <UIcon :name="cat.icon" />
            {{ cat.label }}
          </button>
        </div>
      </UContainer>
    </section>

    <!-- Content Sections -->
    <section class="py-16">
      <UContainer>
        <!-- Overview (No shader demo) -->
        <div v-if="activeCategory === 'overview'" class="space-y-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Shader Utilities Overview</h2>
            <p class="text-gray-400 max-w-2xl mx-auto">
              A comprehensive collection of TSL functions for creating procedural shaders. Click a
              category to see interactive demos.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="cat in categories.filter((c) => c.id !== 'overview')"
              :key="cat.id"
              class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-violet-500/50 transition-colors cursor-pointer group"
              @click="activeCategory = cat.id"
            >
              <div
                class="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors"
              >
                <UIcon :name="cat.icon" class="text-2xl text-violet-400" />
              </div>
              <h3 class="text-xl font-bold mb-2">{{ cat.label }}</h3>
              <p class="text-gray-400 text-sm">
                <template v-if="cat.id === 'noise'">
                  {{ noiseFunctions.length }} noise functions + {{ noiseHelpers.length }} helpers
                </template>
                <template v-else-if="cat.id === 'sdf'">
                  {{ sdfShapes.length }} shapes + {{ sdfOperations.length }} operations
                </template>
                <template v-else-if="cat.id === 'lighting'">
                  {{ lightingFunctions.length }} lighting models
                </template>
                <template v-else-if="cat.id === 'tonemapping'">
                  {{ tonemappingFunctions.length }} tonemapping operators
                </template>
                <template v-else-if="cat.id === 'patterns'">
                  {{ patternFunctions.length }} procedural patterns
                </template>
                <template v-else-if="cat.id === 'effects'">
                  {{ effectFunctions.length }} post-processing effects
                </template>
                <template v-else-if="cat.id === 'math'">
                  {{ mathFunctions.length }} math utilities
                </template>
                <template v-else-if="cat.id === 'uv'">
                  {{ uvFunctions.length + grainFunctions.length }} UV & grain functions
                </template>
              </p>
              <div
                class="mt-4 text-violet-400 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View demos <UIcon name="i-lucide-arrow-right" />
              </div>
            </div>
          </div>

          <!-- File Structure -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 class="text-xl font-bold mb-6">File Structure</h3>
            <pre
              class="text-sm text-gray-300 font-mono overflow-x-auto"
            ><code>layers/shader/app/shaders/
├── types.ts                    # TSL type definitions
├── createMaterial.ts           # Material factory
└── common/
    ├── noise.ts               # All noise functions
    ├── noiseHelpers.ts        # Noise primitives (NEW)
    ├── sdf.ts                 # SDF shapes + operations (NEW)
    ├── lighting.ts            # Lighting models (NEW)
    ├── tonemapping.ts         # Tonemapping operators (NEW)
    ├── math.ts                # Hyperbolic + complex math (NEW)
    ├── patterns.ts            # Procedural patterns (NEW)
    ├── effects.ts             # Post-processing effects (NEW)
    ├── uv.ts                  # UV manipulation
    ├── grain.ts               # Grain & dithering
    ├── blend.ts               # Blend modes
    ├── palette.ts             # Color palettes
    └── shapes.ts              # Procedural shapes</code></pre>
          </div>
        </div>

        <!-- Noise Section -->
        <div v-if="activeCategory === 'noise'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Noise Functions</h2>
            <p class="text-gray-400">
              Comprehensive noise library including simplex, Perlin, FBM variants, curl noise, and
              more.
            </p>
          </div>

          <!-- Interactive Demo with Cards -->
          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <!-- Shader Canvas (3 cols) -->
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <ShaderDemoCanvas
                :active-demo="activeNoiseDemo"
                :mouse-interaction="noiseControls.mouseInteraction"
                :mouse-x
                :mouse-y
                :mouse-strength="noiseControls.mouseStrength"
                :speed="noiseControls.speed"
                :disable-zoom="!noiseControls.enableZoom"
              />
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                {{
                  noiseControls.mouseInteraction
                    ? 'Move mouse to interact'
                    : 'Mouse interaction disabled'
                }}
              </div>
            </div>

            <!-- Demo Cards + Controls (2 cols) -->
            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in noiseDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activeNoiseDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activeNoiseDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activeNoiseDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel -->
              <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h5 class="text-sm font-semibold text-violet-400">Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{{ noiseControls.speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="noiseControls.speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Mouse Strength</span>
                      <span>{{ noiseControls.mouseStrength.toFixed(1) }}</span>
                    </div>
                    <input
                      v-model.number="noiseControls.mouseStrength"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <!-- Toggles -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Interaction</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[noiseControls.mouseInteraction ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="noiseControls.mouseInteraction = !noiseControls.mouseInteraction"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          noiseControls.mouseInteraction ? 'translate-x-5' : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[noiseControls.enableZoom ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="noiseControls.enableZoom = !noiseControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[noiseControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-gray-800/30 rounded-xl">
                <h5 class="text-xs font-semibold text-gray-500 uppercase mb-2">Active Functions</h5>
                <div class="flex flex-wrap gap-2">
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300">
                    simplexNoise2D
                  </code>
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300">fbm</code>
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300">hash21</code>
                </div>
              </div>
            </div>
          </div>

          <!-- Function List -->
          <div v-for="category in ['Basic', 'FBM', 'Advanced']" :key="category" class="space-y-4">
            <h3 class="text-xl font-semibold text-violet-400">{{ category }} Noise</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                v-for="fn in noiseFunctions.filter((f) => f.category === category)"
                :key="fn.name"
                class="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
              >
                <div class="flex items-center gap-2 mb-1">
                  <code class="text-violet-300 font-mono text-sm">{{ fn.name }}</code>
                  <UBadge v-if="fn.isNew" color="success" size="xs">NEW</UBadge>
                </div>
                <p class="text-gray-400 text-sm">{{ fn.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- SDF Section -->
        <div v-if="activeCategory === 'sdf'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">SDF Shapes & Operations</h2>
            <p class="text-gray-400">
              Signed Distance Field primitives for procedural geometry. Combine shapes with smooth
              blending operations.
            </p>
          </div>

          <!-- Interactive Demo with Cards -->
          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <ShaderDemoCanvas
                :active-demo="activeSdfDemo"
                :mouse-interaction="sdfControls.mouseInteraction"
                :mouse-x
                :mouse-y
                :mouse-strength="sdfControls.mouseStrength"
                :speed="sdfControls.speed"
                :disable-zoom="!sdfControls.enableZoom"
              />
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                {{
                  sdfControls.mouseInteraction
                    ? 'Move mouse to interact'
                    : 'Mouse interaction disabled'
                }}
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in sdfDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activeSdfDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activeSdfDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activeSdfDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel -->
              <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h5 class="text-sm font-semibold text-cyan-400">Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{{ sdfControls.speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="sdfControls.speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Mouse Strength</span>
                      <span>{{ sdfControls.mouseStrength.toFixed(1) }}</span>
                    </div>
                    <input
                      v-model.number="sdfControls.mouseStrength"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <!-- Toggles -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Interaction</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[sdfControls.mouseInteraction ? 'bg-cyan-500' : 'bg-gray-600']"
                      @click="sdfControls.mouseInteraction = !sdfControls.mouseInteraction"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          sdfControls.mouseInteraction ? 'translate-x-5' : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[sdfControls.enableZoom ? 'bg-cyan-500' : 'bg-gray-600']"
                      @click="sdfControls.enableZoom = !sdfControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[sdfControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-gray-800/30 rounded-xl">
                <h5 class="text-xs font-semibold text-gray-500 uppercase mb-2">Active Functions</h5>
                <div class="flex flex-wrap gap-2">
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-300">sdSphere</code>
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-300">smin</code>
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-300">
                    smoothstep
                  </code>
                </div>
              </div>
            </div>
          </div>

          <!-- Shapes Grid -->
          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="shape in sdfShapes"
              :key="shape.name"
              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
            >
              <code class="text-violet-300 font-mono text-sm">{{ shape.name }}</code>
              <code class="text-gray-500 font-mono text-xs ml-2">({{ shape.params }})</code>
              <p class="text-gray-400 text-sm mt-1">{{ shape.description }}</p>
            </div>
          </div>
        </div>

        <!-- Lighting Section -->
        <div v-if="activeCategory === 'lighting'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Lighting Models</h2>
            <p class="text-gray-400">
              Common lighting functions for 3D shading - fresnel, diffuse, specular, and combined
              models.
            </p>
          </div>

          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <ShaderDemoCanvas
                :active-demo="activeLightingDemo"
                :mouse-interaction="lightingControls.mouseInteraction"
                :mouse-x
                :mouse-y
                :speed="lightingControls.speed"
                :disable-zoom="!lightingControls.enableZoom"
              />
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                {{
                  lightingControls.enableZoom
                    ? 'Drag to rotate/zoom'
                    : lightingControls.mouseInteraction
                      ? 'Move mouse'
                      : 'Controls disabled'
                }}
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in lightingDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activeLightingDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activeLightingDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activeLightingDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel -->
              <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h5 class="text-sm font-semibold text-pink-400">Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{{ lightingControls.speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="lightingControls.speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Interaction</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[lightingControls.mouseInteraction ? 'bg-pink-500' : 'bg-gray-600']"
                      @click="
                        lightingControls.mouseInteraction = !lightingControls.mouseInteraction
                      "
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          lightingControls.mouseInteraction ? 'translate-x-5' : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[lightingControls.enableZoom ? 'bg-pink-500' : 'bg-gray-600']"
                      @click="lightingControls.enableZoom = !lightingControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[lightingControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-gray-800/30 rounded-xl">
                <h5 class="text-xs font-semibold text-gray-500 uppercase mb-2">Active Functions</h5>
                <div class="flex flex-wrap gap-2">
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-pink-300">fresnel</code>
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-pink-300">normalize</code>
                  <code class="text-xs bg-gray-800 px-2 py-1 rounded text-pink-300">dot</code>
                </div>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="fn in lightingFunctions"
              :key="fn.name"
              class="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
            >
              <code class="text-violet-300 font-mono">{{ fn.name }}</code>
              <p class="text-gray-400 text-sm mt-2">{{ fn.description }}</p>
              <code class="text-gray-500 font-mono text-xs mt-2 block">{{ fn.params }}</code>
            </div>
          </div>
        </div>

        <!-- Tonemapping Section -->
        <div v-if="activeCategory === 'tonemapping'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Tonemapping Operators</h2>
            <p class="text-gray-400">
              HDR to LDR conversion with various looks - from photorealistic to stylized.
            </p>
          </div>

          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <ShaderDemoCanvas
                :active-demo="activeTonemappingDemo"
                :mouse-interaction="tonemappingControls.mouseInteraction"
                :mouse-x
                :mouse-y
                :mouse-strength="tonemappingControls.mouseStrength"
                :speed="tonemappingControls.speed"
                :disable-zoom="!tonemappingControls.enableZoom"
              />
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                {{ tonemappingControls.mouseInteraction ? 'HDR Color Demo' : 'Mouse disabled' }}
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in tonemappingDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activeTonemappingDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activeTonemappingDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activeTonemappingDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel -->
              <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h5 class="text-sm font-semibold text-amber-400">Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{{ tonemappingControls.speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="tonemappingControls.speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Mouse Strength</span>
                      <span>{{ tonemappingControls.mouseStrength.toFixed(1) }}</span>
                    </div>
                    <input
                      v-model.number="tonemappingControls.mouseStrength"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <!-- Toggles -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Interaction</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[
                        tonemappingControls.mouseInteraction ? 'bg-amber-500' : 'bg-gray-600',
                      ]"
                      @click="
                        tonemappingControls.mouseInteraction = !tonemappingControls.mouseInteraction
                      "
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          tonemappingControls.mouseInteraction
                            ? 'translate-x-5'
                            : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[tonemappingControls.enableZoom ? 'bg-amber-500' : 'bg-gray-600']"
                      @click="tonemappingControls.enableZoom = !tonemappingControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          tonemappingControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-for="style in ['Standard', 'Stylized']" :key="style" class="space-y-4">
            <h3
              class="text-xl font-semibold"
              :class="style === 'Standard' ? 'text-violet-400' : 'text-pink-400'"
            >
              {{ style }} Tonemapping
            </h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="fn in tonemappingFunctions.filter((f) => f.style === style)"
                :key="fn.name"
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <code class="text-gray-200 font-mono text-sm">{{ fn.name }}</code>
                <p class="text-gray-400 text-sm mt-1">{{ fn.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Patterns Section -->
        <div v-if="activeCategory === 'patterns'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Procedural Patterns</h2>
            <p class="text-gray-400">Texture patterns for materials and visual effects.</p>
          </div>

          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <ShaderDemoCanvas
                :active-demo="activePatternDemo"
                :mouse-interaction="patternControls.mouseInteraction"
                :mouse-x
                :mouse-y
                :mouse-strength="patternControls.mouseStrength"
                :speed="patternControls.speed"
                :disable-zoom="!patternControls.enableZoom"
              />
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                {{ patternControls.mouseInteraction ? 'Procedural Pattern' : 'Mouse disabled' }}
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in patternDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activePatternDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activePatternDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activePatternDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel -->
              <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h5 class="text-sm font-semibold text-emerald-400">Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{{ patternControls.speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="patternControls.speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Mouse Strength</span>
                      <span>{{ patternControls.mouseStrength.toFixed(1) }}</span>
                    </div>
                    <input
                      v-model.number="patternControls.mouseStrength"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <!-- Toggles -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Interaction</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[patternControls.mouseInteraction ? 'bg-emerald-500' : 'bg-gray-600']"
                      @click="patternControls.mouseInteraction = !patternControls.mouseInteraction"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          patternControls.mouseInteraction ? 'translate-x-5' : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[patternControls.enableZoom ? 'bg-emerald-500' : 'bg-gray-600']"
                      @click="patternControls.enableZoom = !patternControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[patternControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="fn in patternFunctions"
              :key="fn.name"
              class="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
            >
              <div class="flex items-center gap-2 mb-2">
                <code class="text-violet-300 font-mono">{{ fn.name }}</code>
                <UBadge v-if="fn.isNew" color="success" size="xs">NEW</UBadge>
              </div>
              <p class="text-gray-400 text-sm">{{ fn.description }}</p>
            </div>
          </div>
        </div>

        <!-- Effects Section -->
        <div v-if="activeCategory === 'effects'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Post-Processing Effects</h2>
            <p class="text-gray-400">
              Effects that sample and process textures for post-processing pipelines.
            </p>
          </div>

          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <template v-if="activeEffectDemo === 'image'">
                <ShaderImageDemo
                  :distortion="effectControls.distortion"
                  :mouse-ripple="effectControls.mouseRipple"
                  :mouse-x
                  :mouse-y
                  :rgb-shift="effectControls.rgbShift"
                  :vignette="effectControls.vignette"
                  :grayscale="effectControls.grayscale"
                  :disable-zoom="!effectControls.enableZoom"
                />
              </template>
              <template v-else>
                <ShaderDemoCanvas
                  :active-demo="activeEffectDemo"
                  :mouse-interaction="true"
                  :mouse-x
                  :mouse-y
                  :disable-zoom="!effectControls.enableZoom"
                />
              </template>
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                Move mouse to interact
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in effectDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activeEffectDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activeEffectDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activeEffectDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel (shown for image demo) -->
              <div
                v-if="activeEffectDemo === 'image'"
                class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4"
              >
                <h5 class="text-sm font-semibold text-pink-400">Effect Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Distortion</span>
                      <span>{{ effectControls.distortion.toFixed(2) }}</span>
                    </div>
                    <input
                      v-model.number="effectControls.distortion"
                      type="range"
                      min="0"
                      max="0.1"
                      step="0.01"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>RGB Shift</span>
                      <span>{{ effectControls.rgbShift }}</span>
                    </div>
                    <input
                      v-model.number="effectControls.rgbShift"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Grayscale</span>
                      <span>{{ Math.round(effectControls.grayscale * 100) }}%</span>
                    </div>
                    <input
                      v-model.number="effectControls.grayscale"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <!-- Toggle switches -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Ripple</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[effectControls.mouseRipple ? 'bg-pink-500' : 'bg-gray-600']"
                      @click="effectControls.mouseRipple = !effectControls.mouseRipple"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[effectControls.mouseRipple ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Vignette</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[effectControls.vignette ? 'bg-pink-500' : 'bg-gray-600']"
                      @click="effectControls.vignette = !effectControls.vignette"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[effectControls.vignette ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[effectControls.enableZoom ? 'bg-pink-500' : 'bg-gray-600']"
                      @click="effectControls.enableZoom = !effectControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[effectControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="fn in effectFunctions"
              :key="fn.name"
              class="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
            >
              <code class="text-violet-300 font-mono">{{ fn.name }}</code>
              <p class="text-gray-400 text-sm mt-2">{{ fn.description }}</p>
              <code class="text-gray-500 font-mono text-xs mt-2 block">{{ fn.params }}</code>
            </div>
          </div>
        </div>

        <!-- Math Section -->
        <div v-if="activeCategory === 'math'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Math Utilities</h2>
            <p class="text-gray-400">
              Hyperbolic functions, complex number operations, and coordinate utilities.
            </p>
          </div>

          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <ShaderDemoCanvas
                :active-demo="activeMathDemo"
                :mouse-interaction="mathControls.mouseInteraction"
                :mouse-x
                :mouse-y
                :mouse-strength="mathControls.mouseStrength"
                :speed="mathControls.speed"
                :disable-zoom="!mathControls.enableZoom"
              />
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                {{ mathControls.mouseInteraction ? 'Polar Coordinates' : 'Mouse disabled' }}
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <!-- Controls Panel -->
              <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h5 class="text-sm font-semibold text-violet-400">Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{{ mathControls.speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="mathControls.speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Mouse Strength</span>
                      <span>{{ mathControls.mouseStrength.toFixed(1) }}</span>
                    </div>
                    <input
                      v-model.number="mathControls.mouseStrength"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <!-- Toggles -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Interaction</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[mathControls.mouseInteraction ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="mathControls.mouseInteraction = !mathControls.mouseInteraction"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[
                          mathControls.mouseInteraction ? 'translate-x-5' : 'translate-x-0.5',
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[mathControls.enableZoom ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="mathControls.enableZoom = !mathControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[mathControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-for="category in ['Hyperbolic', 'Complex', 'Coordinates']"
                :key="category"
                class="space-y-2"
              >
                <h5
                  class="text-sm font-semibold"
                  :class="{
                    'text-violet-400': category === 'Hyperbolic',
                    'text-cyan-400': category === 'Complex',
                    'text-pink-400': category === 'Coordinates',
                  }"
                >
                  {{ category }}
                </h5>
                <div class="flex flex-wrap gap-2">
                  <code
                    v-for="fn in mathFunctions.filter((f) => f.category === category)"
                    :key="fn.name"
                    class="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300"
                  >
                    {{ fn.name.split(' / ')[0] }}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div
            v-for="category in ['Hyperbolic', 'Complex', 'Coordinates']"
            :key="category"
            class="space-y-4"
          >
            <h3
              class="text-xl font-semibold"
              :class="{
                'text-violet-400': category === 'Hyperbolic',
                'text-cyan-400': category === 'Complex',
                'text-pink-400': category === 'Coordinates',
              }"
            >
              {{ category }} Functions
            </h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="fn in mathFunctions.filter((f) => f.category === category)"
                :key="fn.name"
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <code class="text-gray-200 font-mono text-sm">{{ fn.name }}</code>
                <p class="text-gray-400 text-sm mt-1">{{ fn.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- UV & Grain Section -->
        <div v-if="activeCategory === 'uv'" class="space-y-8">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">UV Manipulation & Grain Effects</h2>
            <p class="text-gray-400">Transform, distort, and add texture to your shaders.</p>
          </div>

          <div class="grid lg:grid-cols-5 gap-6 mb-12">
            <div
              class="lg:col-span-3 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-900 rounded-2xl overflow-hidden relative"
              @mousemove="(e) => handleMouseMove(e, e.currentTarget as HTMLElement)"
            >
              <template v-if="activeUvDemo === 'image'">
                <ShaderImageDemo
                  :distortion="uvControls.distortion"
                  :mouse-ripple="uvControls.mouseRipple"
                  :mouse-x
                  :mouse-y
                  :grayscale="0"
                  :rgb-shift="uvControls.rgbShift"
                  :vignette="uvControls.vignette"
                  :disable-zoom="!uvControls.enableZoom"
                />
              </template>
              <template v-else>
                <ShaderDemoCanvas
                  :active-demo="activeUvDemo"
                  :mouse-interaction="uvControls.mouseRipple"
                  :mouse-x
                  :mouse-y
                  :disable-zoom="!uvControls.enableZoom"
                />
              </template>
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm"
              >
                Move mouse for ripple effect
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Select Demo
              </h4>
              <div
                v-for="option in uvDemoOptions"
                :key="option.id"
                class="p-4 rounded-xl border cursor-pointer transition-all"
                :class="[
                  activeUvDemo === option.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activeUvDemo = option.id as DemoType"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ option.name }}</span>
                  <div
                    v-if="activeUvDemo === option.id"
                    class="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
                <p class="text-sm text-gray-400">{{ option.description }}</p>
              </div>

              <!-- Controls Panel (shown for image demo) -->
              <div
                v-if="activeUvDemo === 'image'"
                class="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4"
              >
                <h5 class="text-sm font-semibold text-violet-400">UV Controls</h5>

                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Distortion</span>
                      <span>{{ uvControls.distortion.toFixed(2) }}</span>
                    </div>
                    <input
                      v-model.number="uvControls.distortion"
                      type="range"
                      min="0"
                      max="0.15"
                      step="0.01"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>RGB Shift</span>
                      <span>{{ uvControls.rgbShift }}</span>
                    </div>
                    <input
                      v-model.number="uvControls.rgbShift"
                      type="range"
                      min="0"
                      max="15"
                      step="1"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <!-- Toggle switches -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-xs text-gray-400">Mouse Ripple</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[uvControls.mouseRipple ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="uvControls.mouseRipple = !uvControls.mouseRipple"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[uvControls.mouseRipple ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Vignette</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[uvControls.vignette ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="uvControls.vignette = !uvControls.vignette"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[uvControls.vignette ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Enable Zoom/Pan</span>
                    <button
                      class="w-10 h-5 rounded-full transition-colors relative"
                      :class="[uvControls.enableZoom ? 'bg-violet-500' : 'bg-gray-600']"
                      @click="uvControls.enableZoom = !uvControls.enableZoom"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        :class="[uvControls.enableZoom ? 'translate-x-5' : 'translate-x-0.5']"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold text-violet-400 mb-4">UV Functions</h3>
              <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <div
                  v-for="fn in uvFunctions"
                  :key="fn.name"
                  class="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <code class="text-violet-300 font-mono text-sm">{{ fn.name }}</code>
                    <p class="text-gray-500 text-xs mt-0.5">{{ fn.description }}</p>
                  </div>
                  <UBadge v-if="fn.isNew" color="success" size="xs">NEW</UBadge>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-cyan-400 mb-4">Grain & Dithering</h3>
              <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <div
                  v-for="fn in grainFunctions"
                  :key="fn.name"
                  class="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <code class="text-cyan-300 font-mono text-sm">{{ fn.name }}</code>
                    <p class="text-gray-500 text-xs mt-0.5">{{ fn.description }}</p>
                  </div>
                  <UBadge v-if="fn.isNew" color="success" size="xs">NEW</UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Footer Navigation -->
    <section class="py-16 border-t border-gray-800">
      <UContainer>
        <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">Shader Layer</h2>
            <p class="text-gray-400">TSL utilities for procedural graphics</p>
          </div>
          <div class="flex gap-4">
            <UButton to="/motion" variant="outline">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton
              to="/ambient"
              variant="outline"
              class="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
            >
              <UIcon name="i-lucide-sparkles" class="mr-2" />
              Ambient Backgrounds
            </UButton>
            <UButton to="/"> Home </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
pre {
  border-radius: 0.5rem;
  background: rgb(0 0 0 / 0.3);
  padding: 1rem;
}
</style>
