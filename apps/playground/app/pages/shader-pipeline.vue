<script setup lang="ts">
definePageMeta({ ssr: false, layout: false })

type Category =
  | 'generators' | 'noise' | 'uv' | 'colour' | 'film' | 'overlays' | 'composition'
  | 'noise_fx' | 'sdf' | 'lighting' | 'tonemapping' | 'patterns' | 'effects' | 'math' | 'uv_grain'
const activeCategory = ref<Category>('generators')

const categories = [
  { id: 'generators' as const, label: 'Generators', icon: 'i-lucide-circle-dot' },
  { id: 'noise' as const, label: 'Noise', icon: 'i-lucide-waves' },
  { id: 'uv' as const, label: 'UV Transforms', icon: 'i-lucide-move' },
  { id: 'colour' as const, label: 'Colour Ops', icon: 'i-lucide-palette' },
  { id: 'film' as const, label: 'Film / Analogue', icon: 'i-lucide-film' },
  { id: 'overlays' as const, label: 'Overlays', icon: 'i-lucide-layers' },
  { id: 'composition' as const, label: 'Compositions', icon: 'i-lucide-blend' },
  { id: 'noise_fx' as const, label: 'Noise', icon: 'i-lucide-cloud' },
  { id: 'sdf' as const, label: 'SDF Shapes', icon: 'i-lucide-shapes' },
  { id: 'lighting' as const, label: 'Lighting', icon: 'i-lucide-sun' },
  { id: 'tonemapping' as const, label: 'Tonemapping', icon: 'i-lucide-sliders-horizontal' },
  { id: 'patterns' as const, label: 'Patterns', icon: 'i-lucide-grid-3x3' },
  { id: 'effects' as const, label: 'Effects', icon: 'i-lucide-sparkles' },
  { id: 'math' as const, label: 'Math', icon: 'i-lucide-calculator' },
  { id: 'uv_grain' as const, label: 'UV & Grain', icon: 'i-lucide-scan-line' },
]

// ── Generators demo controls ──────────────────────────────────────
const gen = reactive({
  ringRadius: 0.3,
  ringCount: 3,
  ringScale: 4,
  ringSpread: 0.15,
  timeScale: 0.1,
  vignetteIntensity: 0.5,
})

// ── Noise demo controls ───────────────────────────────────────────
const noise = reactive({
  scale: 3,
  speed: 0.15,
  octaves: 5,
  hue: 0.5,
  brightness: 0.05,
  contrast: 1.2,
  vignetteIntensity: 0.5,
})

// ── UV Transform controls ─────────────────────────────────────────
const uvt = reactive({
  warpFrequency: 5,
  warpAmplitude: 30,
  warpSpeed: 2,
  twirlStrength: 3,
  twirlRadius: 0.5,
  noiseScale: 4,
  noiseSpeed: 0.1,
})

// ── Colour Ops controls ───────────────────────────────────────────
const colour = reactive({
  noiseScale: 3,
  noiseSpeed: 0.15,
  shadowColor: '#1a0033',
  highlightColor: '#ffcc00',
  brightness: 0.05,
  contrast: 1.1,
})

// ── Film / Analogue controls ──────────────────────────────────────
const film = reactive({
  gradColorA: '#1a1a2e',
  gradColorB: '#e94560',
  agedIntensity: 1.0,
  agedGrain: 0.04,
  agedVignette: 0.5,
  agedWarmth: 0.15,
  vhsBleed: 0.015,
  vhsTracking: 0.3,
  vhsSpeed: 1.0,
})

// ── Overlays controls ─────────────────────────────────────────────
const overlays = reactive({
  auroraColorA: '#00ff88',
  auroraColorB: '#8844ff',
  auroraBandY: 0.7,
  auroraBandHeight: 0.3,
  auroraIntensity: 0.7,
  auroraSpeed: 0.3,
  starDensity: 80,
  starBrightness: 1.0,
  starTwinkle: 1.0,
  hazeReach: 0.3,
  hazeIntensity: 0.2,
})

// ── Composition controls ──────────────────────────────────────────
const comp = reactive({
  ringFrequency: 12,
  noiseStrength: 0.4,
  woodSpeed: 0,
  halationThreshold: 0.65,
  halationIntensity: 0.5,
  halationColor: '#ff2200',
  vignetteIntensity: 0.6,
})

// ── Noise FX sub-selector + controls ──────────────────────────
const noiseFxSub = ref<'fbm' | 'simplex' | 'value' | 'billow' | 'ridged' | 'curl' | 'voronoi' | 'domain'>('fbm')
const noiseFx = reactive({
  scale: 3,
  speed: 0.15,
  octaves: 5,
  vignetteIntensity: 0.5,
})

// ── SDF Shapes sub-selector + controls ────────────────────────
const sdfSub = ref<'circle' | 'ring' | 'rectangle' | 'star' | 'hexagon' | 'cross' | 'triangle'>('circle')
const sdf = reactive({
  colorA: '#000000',
  colorB: '#ffffff',
  radius: 0.35,
  softness: 0.02,
  innerRadius: 0.25,
  outerRadius: 0.4,
  width: 0.6,
  height: 0.4,
  cornerRadius: 0.05,
  points: 5,
  innerRatio: 0.45,
  size: 0.4,
  thickness: 0.1,
  vignetteIntensity: 0.3,
})

// ── Lighting sub-selector + controls ──────────────────────────
const lightingSub = ref<'god_rays' | 'lens_flare'>('god_rays')
const lighting = reactive({
  noiseScale: 3,
  noiseSpeed: 0.1,
  color: '#fff9e0',
  intensity: 0.35,
  rayCount: 12,
  decay: 2.0,
  ghostCount: 4,
  vignetteIntensity: 0.4,
})

// ── Tonemapping sub-selector + controls ───────────────────────
const tonemappingSub = ref<'aces' | 'reinhard' | 'tanh' | 'exposure' | 'gamma'>('aces')
const tonemapping = reactive({
  noiseScale: 3,
  noiseSpeed: 0.1,
  exposure: 1.0,
  stops: 0,
  gamma: 2.2,
})

// ── Patterns sub-selector + controls ──────────────────────────
const patternsSub = ref<
  'checkerboard' | 'grid' | 'dots' | 'stripes' | 'halftone' | 'scanlines' | 'paper'
>('checkerboard')
const patterns = reactive({
  colorA: '#ffffff',
  colorB: '#000000',
  scale: 10,
  cellSize: 0.1,
  lineWidth: 0.005,
  dotRadius: 0.025,
  frequency: 10,
  angle: 0,
  thickness: 0.5,
  halftoneScale: 50,
  scanDensity: 300,
  scanIntensity: 0.3,
  paperScale: 12,
  paperIntensity: 0.08,
  vignetteIntensity: 0.4,
})

// ── Effects sub-selector + controls ───────────────────────────
const effectsSub = ref<'chromatic' | 'film_grain' | 'grain' | 'risograph' | 'halation' | 'vhs'>('chromatic')
const effects = reactive({
  noiseScale: 3,
  noiseSpeed: 0.1,
  caStrength: 0.008,
  caEdge: 1.5,
  grainIntensity: 0.08,
  risoScale: 0.6,
  risoStrength: 0.12,
  halationColor: '#ff2200',
  halationThreshold: 0.65,
  halationIntensity: 0.5,
  vhsBleed: 0.015,
  vhsTracking: 0.3,
})

// ── Math demo controls ─────────────────────────────────────────
const math = reactive({
  poleAngle: Math.PI / 3,
  poleDistance: 0.4,
  imaginaryWeight: 0.6,
  radialWeight: 0.4,
  speed: 0.05,
})

// ── UV & Grain sub-selector + controls ────────────────────────
const uvGrainSub = ref<'rotate' | 'pixelate' | 'bulge' | 'tile' | 'grain' | 'risograph' | 'scanlines'>('rotate')
const uvGrain = reactive({
  rotateAngle: 45,
  pixelateGrid: 32,
  bulgeStrength: 0.5,
  bulgeRadius: 0.5,
  tileX: 3,
  tileY: 3,
  noiseScale: 4,
  noiseSpeed: 0.1,
  grainIntensity: 0.08,
  risoScale: 0.6,
  risoStrength: 0.12,
  scanDensity: 300,
  scanIntensity: 0.3,
  gradColorA: '#1a1a2e',
  gradColorB: '#e8d5b0',
  vignetteIntensity: 0.4,
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white flex flex-col">

    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-white/8">
      <div class="flex items-center gap-4">
        <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" size="xs" color="neutral" />
        <div>
          <h1 class="font-semibold text-sm text-white">Shader Pipeline</h1>
          <p class="text-xs text-white/40">142 composable TSL blocks · WebGPU</p>
        </div>
      </div>
      <UButton to="/shader-background" label="Background Builder" icon="i-lucide-layers" size="xs" variant="soft" color="neutral" />
      <div class="flex items-center gap-3">
        <div class="flex gap-2 text-xs text-white/30">
          <span class="bg-white/5 rounded px-2 py-0.5">Generators</span>
          <span class="bg-white/5 rounded px-2 py-0.5">UV Transforms</span>
          <span class="bg-white/5 rounded px-2 py-0.5">Colour Ops</span>
          <span class="bg-white/5 rounded px-2 py-0.5">Overlays</span>
          <span class="bg-white/5 rounded px-2 py-0.5">Ray Pipeline</span>
        </div>
        <UColorModeSelect size="xs" />
      </div>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-1 px-6 pt-4 pb-3 border-b border-white/5 overflow-x-auto">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap"
        :class="
          activeCategory === cat.id
            ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
        "
        @click="activeCategory = cat.id"
      >
        <UIcon :name="cat.icon" class="w-3.5 h-3.5" />
        {{ cat.label }}
      </button>
    </div>

    <!-- Main content -->
    <div class="flex flex-1 gap-0 overflow-hidden">

      <!-- Canvas column -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
          <ClientOnly>
            <!--
              ShaderPipelineContext lives in the regular Vue DOM renderer.
              Block components (all <template />) register here — TresJS never sees them.
              ShaderPipeline inside TresMesh only attaches the material; no slot/children.
            -->
            <ShaderPipelineContext>

              <!-- Hidden block registry — one group active at a time -->
              <div class="hidden pointer-events-none" aria-hidden="true">

                <!-- ── 1. Generators ── -->
                <!-- :key on template forces block remount when ringCount changes (structural TSL graph change) -->
                <template v-if="activeCategory === 'generators'" :key="gen.ringCount">
                  <PipelineRingField
                    :order="0"
                    :ring-radius="gen.ringRadius"
                    :ring-count="gen.ringCount"
                    :ring-scale="gen.ringScale"
                    :ring-spread="gen.ringSpread"
                  />
                  <PipelineCosinePalette
                    :order="1"
                    scalar-source="prev"
                    :time-scale="gen.timeScale"
                    :a="[0.5, 0.5, 0.5]"
                    :b="[0.5, 0.5, 0.5]"
                    :c="[1.0, 1.0, 1.0]"
                    :d="[0.0, 0.33, 0.67]"
                  />
                  <PipelineVignette :order="2" :intensity="gen.vignetteIntensity" />
                </template>

                <!-- ── 2. Noise ── -->
                <template v-else-if="activeCategory === 'noise'" :key="noise.octaves">
                  <PipelineFBMNoise
                    :order="0"
                    :scale="noise.scale"
                    :speed="noise.speed"
                    :octaves="noise.octaves"
                    color-a="#000000"
                    color-b="#ffffff"
                  />
                  <PipelineHue :order="1" :shift="noise.hue" />
                  <PipelineBrightnessContrast
                    :order="2"
                    :brightness="noise.brightness"
                    :contrast="noise.contrast"
                  />
                  <PipelineVignette :order="3" :intensity="noise.vignetteIntensity" />
                </template>

                <!-- ── 3. UV Transforms ── -->
                <template v-else-if="activeCategory === 'uv'">
                  <PipelineUVSineWarpXY
                    :order="0"
                    :frequency="uvt.warpFrequency"
                    :amplitude="uvt.warpAmplitude"
                    :speed="uvt.warpSpeed"
                  />
                  <PipelineUVTwirl
                    :order="1"
                    :strength="uvt.twirlStrength"
                    :radius="uvt.twirlRadius"
                  />
                  <PipelineSimplexNoise
                    :order="0"
                    :scale="uvt.noiseScale"
                    :speed="uvt.noiseSpeed"
                  />
                  <PipelineACESTonemap :order="1" />
                </template>

                <!-- ── 4. Colour Ops ── -->
                <template v-else-if="activeCategory === 'colour'">
                  <PipelineCurlNoise
                    :order="0"
                    :scale="colour.noiseScale"
                    :speed="colour.noiseSpeed"
                  />
                  <PipelineDuoTone
                    :order="1"
                    :shadow-color="colour.shadowColor"
                    :highlight-color="colour.highlightColor"
                  />
                  <PipelineBrightnessContrast
                    :order="2"
                    :brightness="colour.brightness"
                    :contrast="colour.contrast"
                  />
                </template>

                <!-- ── 5. Film / Analogue ── -->
                <template v-else-if="activeCategory === 'film'">
                  <PipelineLinearGradient
                    :order="0"
                    :color-a="film.gradColorA"
                    :color-b="film.gradColorB"
                    axis="y"
                  />
                  <PipelineAgedFilm
                    :order="1"
                    :intensity="film.agedIntensity"
                    :grain-strength="film.agedGrain"
                    :vignette-strength="film.agedVignette"
                    :warmth="film.agedWarmth"
                  />
                  <PipelineVHSBleed
                    :order="2"
                    :bleed-strength="film.vhsBleed"
                    :tracking-noise="film.vhsTracking"
                    :speed="film.vhsSpeed"
                  />
                </template>

                <!-- ── 6. Overlays ── -->
                <template v-else-if="activeCategory === 'overlays'">
                  <PipelineSolidColour :order="0" color="#020408" />
                  <PipelineAurora
                    :order="1"
                    :color-a="overlays.auroraColorA"
                    :color-b="overlays.auroraColorB"
                    :band-y="overlays.auroraBandY"
                    :band-height="overlays.auroraBandHeight"
                    :intensity="overlays.auroraIntensity"
                    :speed="overlays.auroraSpeed"
                  />
                  <PipelineStarfield
                    :order="2"
                    :density="overlays.starDensity"
                    :brightness="overlays.starBrightness"
                    :twinkle-speed="overlays.starTwinkle"
                  />
                  <PipelineHaze
                    :order="3"
                    color="#1a3a5c"
                    :reach="overlays.hazeReach"
                    :intensity="overlays.hazeIntensity"
                  />
                </template>

                <!-- ── 7. Compositions ── -->
                <template v-else-if="activeCategory === 'composition'">
                  <PipelineWood
                    :order="0"
                    :ring-frequency="comp.ringFrequency"
                    :noise-strength="comp.noiseStrength"
                    :speed="comp.woodSpeed"
                  />
                  <PipelineHalation
                    :order="1"
                    :color="comp.halationColor"
                    :threshold="comp.halationThreshold"
                    :intensity="comp.halationIntensity"
                  />
                  <PipelineVignette :order="2" :intensity="comp.vignetteIntensity" />
                </template>

                <!-- ── 8. Noise FX ── -->
                <template v-else-if="activeCategory === 'noise_fx'" :key="noiseFxSub">
                  <template v-if="noiseFxSub === 'fbm'" :key="noiseFx.octaves">
                    <PipelineFBMNoise
                      :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed"
                      :octaves="noiseFx.octaves" color-a="#000000" color-b="#ffffff"
                    />
                    <PipelineCosinePalette :order="1" scalar-source="prev" />
                    <PipelineVignette :order="2" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'simplex'">
                    <PipelineSimplexNoise :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'value'">
                    <PipelineValueNoise :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'billow'">
                    <PipelineBillowNoise :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'ridged'">
                    <PipelineRidgedNoise :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'curl'">
                    <PipelineCurlNoise :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'voronoi'">
                    <PipelineVoronoiEdges :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                  <template v-else-if="noiseFxSub === 'domain'">
                    <PipelineDomainWarpedNoise :order="0" :scale="noiseFx.scale" :speed="noiseFx.speed" />
                    <PipelineVignette :order="1" :intensity="noiseFx.vignetteIntensity" />
                  </template>
                </template>

                <!-- ── 9. SDF Shapes ── -->
                <template v-else-if="activeCategory === 'sdf'" :key="sdfSub">
                  <template v-if="sdfSub === 'circle'">
                    <PipelineCircle
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :radius="sdf.radius" :softness="sdf.softness"
                    />
                  </template>
                  <template v-else-if="sdfSub === 'ring'">
                    <PipelineRing
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :inner-radius="sdf.innerRadius" :outer-radius="sdf.outerRadius"
                      :softness="sdf.softness"
                    />
                  </template>
                  <template v-else-if="sdfSub === 'rectangle'">
                    <PipelineRectangle
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :width="sdf.width" :height="sdf.height"
                      :corner-radius="sdf.cornerRadius" :softness="sdf.softness"
                    />
                  </template>
                  <template v-else-if="sdfSub === 'star'">
                    <PipelineStar
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :radius="sdf.radius" :points="sdf.points"
                      :inner-ratio="sdf.innerRatio" :softness="sdf.softness"
                    />
                  </template>
                  <template v-else-if="sdfSub === 'hexagon'">
                    <PipelineHexagon
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :radius="sdf.radius" :softness="sdf.softness"
                    />
                  </template>
                  <template v-else-if="sdfSub === 'cross'">
                    <PipelineCross
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :size="sdf.size" :thickness="sdf.thickness" :softness="sdf.softness"
                    />
                  </template>
                  <template v-else-if="sdfSub === 'triangle'">
                    <PipelineTriangle
                      :order="0" :color-a="sdf.colorA" :color-b="sdf.colorB"
                      :size="sdf.size" :softness="sdf.softness"
                    />
                  </template>
                  <PipelineVignette :order="1" :intensity="sdf.vignetteIntensity" />
                </template>

                <!-- ── 10. Lighting ── -->
                <template v-else-if="activeCategory === 'lighting'" :key="lightingSub">
                  <PipelineFBMNoise
                    :order="0" :scale="lighting.noiseScale" :speed="lighting.noiseSpeed"
                    color-a="#0a0a1a" color-b="#334466"
                  />
                  <template v-if="lightingSub === 'god_rays'">
                    <PipelineGodRays
                      :order="1" :color="lighting.color" :intensity="lighting.intensity"
                      :ray-count="lighting.rayCount" :decay="lighting.decay"
                    />
                  </template>
                  <template v-else-if="lightingSub === 'lens_flare'">
                    <PipelineLensFlare
                      :order="1" :color="lighting.color" :intensity="lighting.intensity"
                      :ghost-count="lighting.ghostCount"
                    />
                  </template>
                  <PipelineVignette :order="2" :intensity="lighting.vignetteIntensity" />
                </template>

                <!-- ── 11. Tonemapping ── -->
                <template v-else-if="activeCategory === 'tonemapping'" :key="tonemappingSub">
                  <PipelineFBMNoise
                    :order="0" :scale="tonemapping.noiseScale" :speed="tonemapping.noiseSpeed"
                    color-a="#0d0020" color-b="#ff6600"
                  />
                  <template v-if="tonemappingSub === 'aces'">
                    <PipelineACESTonemap :order="1" />
                  </template>
                  <template v-else-if="tonemappingSub === 'reinhard'">
                    <PipelineReinhardTonemap :order="1" />
                  </template>
                  <template v-else-if="tonemappingSub === 'tanh'">
                    <PipelineTanhTonemap :order="1" :exposure="tonemapping.exposure" />
                  </template>
                  <template v-else-if="tonemappingSub === 'exposure'">
                    <PipelineExposure :order="1" :stops="tonemapping.stops" />
                  </template>
                  <template v-else-if="tonemappingSub === 'gamma'">
                    <PipelineGamma :order="1" :gamma="tonemapping.gamma" />
                  </template>
                </template>

                <!-- ── 12. Patterns ── -->
                <template v-else-if="activeCategory === 'patterns'" :key="patternsSub">
                  <template v-if="patternsSub === 'checkerboard'">
                    <PipelineCheckerboard
                      :order="0" :color-a="patterns.colorA" :color-b="patterns.colorB"
                      :scale="patterns.scale"
                    />
                  </template>
                  <template v-else-if="patternsSub === 'grid'">
                    <PipelineGrid
                      :order="0" :color-a="patterns.colorA" :color-b="patterns.colorB"
                      :cell-size="patterns.cellSize" :line-width="patterns.lineWidth"
                    />
                  </template>
                  <template v-else-if="patternsSub === 'dots'">
                    <PipelineDots
                      :order="0" :color-a="patterns.colorA" :color-b="patterns.colorB"
                      :cell-size="patterns.cellSize" :dot-radius="patterns.dotRadius"
                    />
                  </template>
                  <template v-else-if="patternsSub === 'stripes'">
                    <PipelineStripes
                      :order="0" :color-a="patterns.colorA" :color-b="patterns.colorB"
                      :frequency="patterns.frequency" :angle="patterns.angle"
                      :thickness="patterns.thickness"
                    />
                  </template>
                  <template v-else-if="patternsSub === 'halftone'">
                    <PipelineHalftone :order="0" :scale="patterns.halftoneScale" :angle="patterns.angle" />
                  </template>
                  <template v-else-if="patternsSub === 'scanlines'">
                    <PipelineSolidColour :order="0" color="#1a1a1a" />
                    <PipelineScanlines :order="1" :density="patterns.scanDensity" :intensity="patterns.scanIntensity" />
                  </template>
                  <template v-else-if="patternsSub === 'paper'">
                    <PipelineSolidColour :order="0" color="#f5f0e8" />
                    <PipelinePaperTexture :order="1" :scale="patterns.paperScale" :intensity="patterns.paperIntensity" />
                  </template>
                  <PipelineVignette :order="2" :intensity="patterns.vignetteIntensity" />
                </template>

                <!-- ── 13. Effects ── -->
                <template v-else-if="activeCategory === 'effects'" :key="effectsSub">
                  <PipelineFBMNoise
                    :order="0" :scale="effects.noiseScale" :speed="effects.noiseSpeed"
                    color-a="#0a0a1a" color-b="#334466"
                  />
                  <template v-if="effectsSub === 'chromatic'">
                    <PipelineChromaticAberration
                      :order="1" :strength="effects.caStrength" :edge-falloff="effects.caEdge"
                    />
                  </template>
                  <template v-else-if="effectsSub === 'film_grain'">
                    <PipelineFilmGrain :order="1" :intensity="effects.grainIntensity" />
                  </template>
                  <template v-else-if="effectsSub === 'grain'">
                    <PipelineGrain :order="1" :intensity="effects.grainIntensity" />
                  </template>
                  <template v-else-if="effectsSub === 'risograph'">
                    <PipelineRisographGrain
                      :order="1" :scale="effects.risoScale" :strength="effects.risoStrength"
                    />
                  </template>
                  <template v-else-if="effectsSub === 'halation'">
                    <PipelineHalation
                      :order="1" :color="effects.halationColor"
                      :threshold="effects.halationThreshold" :intensity="effects.halationIntensity"
                    />
                  </template>
                  <template v-else-if="effectsSub === 'vhs'">
                    <PipelineVHSBleed
                      :order="1" :bleed-strength="effects.vhsBleed" :tracking-noise="effects.vhsTracking"
                    />
                  </template>
                </template>

                <!-- ── 14. Math ── -->
                <template v-else-if="activeCategory === 'math'">
                  <PipelineComplexPlaneField
                    :order="0" :pole-angle="math.poleAngle" :pole-distance="math.poleDistance"
                    :imaginary-weight="math.imaginaryWeight" :radial-weight="math.radialWeight"
                    :speed="math.speed"
                  />
                  <PipelineCosinePalette :order="1" scalar-source="prev" />
                  <PipelineACESTonemap :order="2" />
                </template>

                <!-- ── 15. UV & Grain ── -->
                <template v-else-if="activeCategory === 'uv_grain'" :key="uvGrainSub">
                  <template v-if="uvGrainSub === 'rotate'">
                    <PipelineUVRotate :order="0" :angle="uvGrain.rotateAngle" />
                    <PipelineSimplexNoise :order="0" :scale="uvGrain.noiseScale" :speed="uvGrain.noiseSpeed" />
                    <PipelineVignette :order="1" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                  <template v-else-if="uvGrainSub === 'pixelate'">
                    <PipelineUVPixelate :order="0" :grid-size="uvGrain.pixelateGrid" />
                    <PipelineSimplexNoise :order="0" :scale="uvGrain.noiseScale" :speed="uvGrain.noiseSpeed" />
                    <PipelineVignette :order="1" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                  <template v-else-if="uvGrainSub === 'bulge'">
                    <PipelineUVBulge
                      :order="0" :strength="uvGrain.bulgeStrength" :radius="uvGrain.bulgeRadius"
                    />
                    <PipelineSimplexNoise :order="0" :scale="uvGrain.noiseScale" :speed="uvGrain.noiseSpeed" />
                    <PipelineVignette :order="1" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                  <template v-else-if="uvGrainSub === 'tile'">
                    <PipelineUVTile :order="0" :repeat-x="uvGrain.tileX" :repeat-y="uvGrain.tileY" />
                    <PipelineSimplexNoise :order="0" :scale="uvGrain.noiseScale" :speed="uvGrain.noiseSpeed" />
                    <PipelineVignette :order="1" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                  <template v-else-if="uvGrainSub === 'grain'">
                    <PipelineLinearGradient
                      :order="0" :color-a="uvGrain.gradColorA" :color-b="uvGrain.gradColorB" axis="y"
                    />
                    <PipelineGrain :order="1" :intensity="uvGrain.grainIntensity" />
                    <PipelineVignette :order="2" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                  <template v-else-if="uvGrainSub === 'risograph'">
                    <PipelineLinearGradient
                      :order="0" :color-a="uvGrain.gradColorA" :color-b="uvGrain.gradColorB" axis="y"
                    />
                    <PipelineRisographGrain
                      :order="1" :scale="uvGrain.risoScale" :strength="uvGrain.risoStrength"
                    />
                    <PipelineVignette :order="2" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                  <template v-else-if="uvGrainSub === 'scanlines'">
                    <PipelineLinearGradient
                      :order="0" :color-a="uvGrain.gradColorA" :color-b="uvGrain.gradColorB" axis="y"
                    />
                    <PipelineScanlines
                      :order="1" :density="uvGrain.scanDensity" :intensity="uvGrain.scanIntensity"
                    />
                    <PipelineVignette :order="2" :intensity="uvGrain.vignetteIntensity" />
                  </template>
                </template>

              </div>

              <!-- Canvas — ShaderPipeline is childless; it only attaches the material -->
              <ShaderCanvas clear-color="#0a0a0a" :window-size="false" :webgpu="true">
                <TresOrthographicCamera :args="[-1, 1, 1, -1, 0.1, 100]" :position="[0, 0, 1]" />
                <TresMesh>
                  <TresPlaneGeometry :args="[2, 2]" />
                  <ShaderPipeline />
                </TresMesh>
              </ShaderCanvas>

            </ShaderPipelineContext>
          </ClientOnly>
        </div>
      </div>

      <!-- Controls sidebar -->
      <div class="w-72 shrink-0 border-l border-white/8 overflow-y-auto p-5 space-y-5">

        <!-- ── Generators controls ── -->
        <template v-if="activeCategory === 'generators'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Ring Field + Cosine Palette
          </p>
          <p class="text-xs text-white/40 -mt-3">
            Scalar pipeline: SDF rings → grayscale → IQ palette colourised
          </p>
          <div class="space-y-4">
            <DemoSliderRow label="Ring Radius" :min="0.05" :max="0.7" :step="0.01" v-model="gen.ringRadius" />
            <DemoSliderRow label="Ring Count" :min="1" :max="6" :step="1" v-model="gen.ringCount" />
            <DemoSliderRow label="Ring Scale" :min="1" :max="10" :step="0.5" v-model="gen.ringScale" />
            <DemoSliderRow label="Ring Spread" :min="0.05" :max="0.5" :step="0.01" v-model="gen.ringSpread" />
            <DemoSliderRow label="Palette Speed" :min="0" :max="0.5" :step="0.01" v-model="gen.timeScale" />
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="gen.vignetteIntensity" />
          </div>
        </template>

        <!-- ── Noise controls ── -->
        <template v-else-if="activeCategory === 'noise'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            FBM Noise + Colour Grading
          </p>
          <p class="text-xs text-white/40 -mt-3">
            Fractal noise → hue shift → brightness/contrast → vignette
          </p>
          <div class="space-y-4">
            <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="noise.scale" />
            <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="noise.speed" />
            <DemoSliderRow label="Octaves" :min="1" :max="8" :step="1" v-model="noise.octaves" />
            <DemoSliderRow label="Hue Shift" :min="0" :max="1" :step="0.01" v-model="noise.hue" />
            <DemoSliderRow label="Brightness" :min="-0.5" :max="0.5" :step="0.01" v-model="noise.brightness" />
            <DemoSliderRow label="Contrast" :min="0.5" :max="2.5" :step="0.05" v-model="noise.contrast" />
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="noise.vignetteIntensity" />
          </div>
        </template>

        <!-- ── UV Transform controls ── -->
        <template v-else-if="activeCategory === 'uv'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            UV Sine Warp + Twirl
          </p>
          <p class="text-xs text-white/40 -mt-3">
            UV pipeline: sine warp + twirl → SimplexNoise → ACES tonemap
          </p>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Sine Warp</p>
            <DemoSliderRow label="Frequency" :min="1" :max="15" :step="0.5" v-model="uvt.warpFrequency" />
            <DemoSliderRow label="Amplitude" :min="5" :max="80" :step="1" v-model="uvt.warpAmplitude" />
            <DemoSliderRow label="Speed" :min="0" :max="5" :step="0.1" v-model="uvt.warpSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Twirl</p>
            <DemoSliderRow label="Strength" :min="-8" :max="8" :step="0.1" v-model="uvt.twirlStrength" />
            <DemoSliderRow label="Radius" :min="0.1" :max="1" :step="0.05" v-model="uvt.twirlRadius" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Noise Generator</p>
            <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="uvt.noiseScale" />
            <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="uvt.noiseSpeed" />
          </div>
        </template>

        <!-- ── Colour Ops controls ── -->
        <template v-else-if="activeCategory === 'colour'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Curl Noise + Duotone
          </p>
          <p class="text-xs text-white/40 -mt-3">
            Curl noise field → duotone colour map → brightness/contrast
          </p>
          <div class="space-y-4">
            <DemoSliderRow label="Noise Scale" :min="1" :max="10" :step="0.5" v-model="colour.noiseScale" />
            <DemoSliderRow label="Noise Speed" :min="0" :max="0.5" :step="0.01" v-model="colour.noiseSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Duotone</p>
            <DemoColorRow label="Shadow" v-model="colour.shadowColor" />
            <DemoColorRow label="Highlight" v-model="colour.highlightColor" />
            <div class="h-px bg-white/5" />
            <DemoSliderRow label="Brightness" :min="-0.5" :max="0.5" :step="0.01" v-model="colour.brightness" />
            <DemoSliderRow label="Contrast" :min="0.5" :max="2.5" :step="0.05" v-model="colour.contrast" />
          </div>
        </template>

        <!-- ── Film / Analogue controls ── -->
        <template v-else-if="activeCategory === 'film'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Film / Analogue Stack
          </p>
          <p class="text-xs text-white/40 -mt-3">
            Linear gradient → Aged Film → VHS Bleed
          </p>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Base Gradient</p>
            <DemoColorRow label="Color A" v-model="film.gradColorA" />
            <DemoColorRow label="Color B" v-model="film.gradColorB" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Aged Film</p>
            <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="film.agedIntensity" />
            <DemoSliderRow label="Grain" :min="0" :max="0.15" :step="0.005" v-model="film.agedGrain" />
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="film.agedVignette" />
            <DemoSliderRow label="Warmth" :min="0" :max="0.5" :step="0.01" v-model="film.agedWarmth" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">VHS Bleed</p>
            <DemoSliderRow label="Bleed" :min="0" :max="0.05" :step="0.001" v-model="film.vhsBleed" />
            <DemoSliderRow label="Tracking" :min="0" :max="1" :step="0.01" v-model="film.vhsTracking" />
            <DemoSliderRow label="Speed" :min="0" :max="3" :step="0.1" v-model="film.vhsSpeed" />
          </div>
        </template>

        <!-- ── Overlays controls ── -->
        <template v-else-if="activeCategory === 'overlays'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Night Sky Composition
          </p>
          <p class="text-xs text-white/40 -mt-3">
            Black base → Aurora → Starfield → Edge haze
          </p>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Aurora</p>
            <DemoColorRow label="Color A" v-model="overlays.auroraColorA" />
            <DemoColorRow label="Color B" v-model="overlays.auroraColorB" />
            <DemoSliderRow label="Band Y" :min="0.2" :max="0.9" :step="0.01" v-model="overlays.auroraBandY" />
            <DemoSliderRow label="Band Height" :min="0.05" :max="0.6" :step="0.01" v-model="overlays.auroraBandHeight" />
            <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="overlays.auroraIntensity" />
            <DemoSliderRow label="Speed" :min="0" :max="1" :step="0.05" v-model="overlays.auroraSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Starfield</p>
            <DemoSliderRow label="Density" :min="20" :max="200" :step="5" v-model="overlays.starDensity" />
            <DemoSliderRow label="Brightness" :min="0.1" :max="2" :step="0.05" v-model="overlays.starBrightness" />
            <DemoSliderRow label="Twinkle" :min="0" :max="3" :step="0.1" v-model="overlays.starTwinkle" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Haze</p>
            <DemoSliderRow label="Reach" :min="0" :max="0.7" :step="0.01" v-model="overlays.hazeReach" />
            <DemoSliderRow label="Intensity" :min="0" :max="0.6" :step="0.01" v-model="overlays.hazeIntensity" />
          </div>
        </template>

        <!-- ── Composition controls ── -->
        <template v-else-if="activeCategory === 'composition'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Wood + Halation + Vignette
          </p>
          <p class="text-xs text-white/40 -mt-3">
            Procedural wood rings → analogue film halation → vignette
          </p>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Wood</p>
            <DemoSliderRow label="Ring Frequency" :min="4" :max="30" :step="1" v-model="comp.ringFrequency" />
            <DemoSliderRow label="Noise Strength" :min="0" :max="1" :step="0.05" v-model="comp.noiseStrength" />
            <DemoSliderRow label="Drift Speed" :min="0" :max="0.3" :step="0.01" v-model="comp.woodSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Halation</p>
            <DemoColorRow label="Glow Color" v-model="comp.halationColor" />
            <DemoSliderRow label="Threshold" :min="0.3" :max="0.95" :step="0.01" v-model="comp.halationThreshold" />
            <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="comp.halationIntensity" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Vignette</p>
            <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="comp.vignetteIntensity" />
          </div>
        </template>

        <!-- ── Noise FX controls ── -->
        <template v-else-if="activeCategory === 'noise_fx'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">Noise FX</p>
          <p class="text-xs text-white/40 -mt-3">Various procedural noise algorithms</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in (['fbm','simplex','value','billow','ridged','curl','voronoi','domain'] as const)"
              :key="s"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="noiseFxSub === s
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="noiseFxSub = s"
            >{{ s }}</button>
          </div>
          <div class="space-y-4">
            <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="noiseFx.scale" />
            <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="noiseFx.speed" />
            <DemoSliderRow
              v-if="noiseFxSub === 'fbm'" label="Octaves"
              :min="1" :max="8" :step="1" v-model="noiseFx.octaves"
            />
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="noiseFx.vignetteIntensity" />
          </div>
        </template>

        <!-- ── SDF Shapes controls ── -->
        <template v-else-if="activeCategory === 'sdf'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">SDF Shapes</p>
          <p class="text-xs text-white/40 -mt-3">Signed-distance field primitives</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in (['circle','ring','rectangle','star','hexagon','cross','triangle'] as const)"
              :key="s"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="sdfSub === s
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="sdfSub = s"
            >{{ s }}</button>
          </div>
          <div class="space-y-4">
            <DemoColorRow label="Color A" v-model="sdf.colorA" />
            <DemoColorRow label="Color B" v-model="sdf.colorB" />
            <template v-if="sdfSub === 'circle' || sdfSub === 'hexagon'">
              <DemoSliderRow label="Radius" :min="0.05" :max="0.6" :step="0.01" v-model="sdf.radius" />
            </template>
            <template v-else-if="sdfSub === 'ring'">
              <DemoSliderRow label="Inner Radius" :min="0.05" :max="0.45" :step="0.01" v-model="sdf.innerRadius" />
              <DemoSliderRow label="Outer Radius" :min="0.1" :max="0.6" :step="0.01" v-model="sdf.outerRadius" />
            </template>
            <template v-else-if="sdfSub === 'rectangle'">
              <DemoSliderRow label="Width" :min="0.1" :max="0.9" :step="0.01" v-model="sdf.width" />
              <DemoSliderRow label="Height" :min="0.1" :max="0.9" :step="0.01" v-model="sdf.height" />
              <DemoSliderRow label="Corner Radius" :min="0" :max="0.2" :step="0.005" v-model="sdf.cornerRadius" />
            </template>
            <template v-else-if="sdfSub === 'star'">
              <DemoSliderRow label="Radius" :min="0.05" :max="0.6" :step="0.01" v-model="sdf.radius" />
              <DemoSliderRow label="Points" :min="3" :max="12" :step="1" v-model="sdf.points" />
              <DemoSliderRow label="Inner Ratio" :min="0.2" :max="0.8" :step="0.01" v-model="sdf.innerRatio" />
            </template>
            <template v-else-if="sdfSub === 'cross'">
              <DemoSliderRow label="Size" :min="0.1" :max="0.6" :step="0.01" v-model="sdf.size" />
              <DemoSliderRow label="Thickness" :min="0.02" :max="0.3" :step="0.01" v-model="sdf.thickness" />
            </template>
            <template v-else-if="sdfSub === 'triangle'">
              <DemoSliderRow label="Size" :min="0.1" :max="0.6" :step="0.01" v-model="sdf.size" />
            </template>
            <DemoSliderRow label="Softness" :min="0.001" :max="0.05" :step="0.001" v-model="sdf.softness" />
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="sdf.vignetteIntensity" />
          </div>
        </template>

        <!-- ── Lighting controls ── -->
        <template v-else-if="activeCategory === 'lighting'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">Lighting</p>
          <p class="text-xs text-white/40 -mt-3">FBM noise base with volumetric light effects</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in [{ id: 'god_rays' as const, label: 'God Rays' }, { id: 'lens_flare' as const, label: 'Lens Flare' }]"
              :key="s.id"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="lightingSub === s.id
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="lightingSub = s.id"
            >{{ s.label }}</button>
          </div>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Base Noise</p>
            <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="lighting.noiseScale" />
            <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="lighting.noiseSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Light</p>
            <DemoColorRow label="Color" v-model="lighting.color" />
            <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="lighting.intensity" />
            <template v-if="lightingSub === 'god_rays'">
              <DemoSliderRow label="Ray Count" :min="4" :max="32" :step="1" v-model="lighting.rayCount" />
              <DemoSliderRow label="Decay" :min="0.5" :max="5" :step="0.1" v-model="lighting.decay" />
            </template>
            <template v-else-if="lightingSub === 'lens_flare'">
              <DemoSliderRow label="Ghost Count" :min="1" :max="8" :step="1" v-model="lighting.ghostCount" />
            </template>
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="lighting.vignetteIntensity" />
          </div>
        </template>

        <!-- ── Tonemapping controls ── -->
        <template v-else-if="activeCategory === 'tonemapping'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">Tonemapping</p>
          <p class="text-xs text-white/40 -mt-3">HDR noise base → various tonemap operators</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in (['aces','reinhard','tanh','exposure','gamma'] as const)"
              :key="s"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="tonemappingSub === s
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="tonemappingSub = s"
            >{{ s }}</button>
          </div>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Source Noise</p>
            <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="tonemapping.noiseScale" />
            <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="tonemapping.noiseSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Operator</p>
            <template v-if="tonemappingSub === 'tanh'">
              <DemoSliderRow label="Exposure" :min="0.1" :max="4" :step="0.1" v-model="tonemapping.exposure" />
            </template>
            <template v-else-if="tonemappingSub === 'exposure'">
              <DemoSliderRow label="Stops" :min="-3" :max="3" :step="0.1" v-model="tonemapping.stops" />
            </template>
            <template v-else-if="tonemappingSub === 'gamma'">
              <DemoSliderRow label="Gamma" :min="0.5" :max="4" :step="0.1" v-model="tonemapping.gamma" />
            </template>
            <template v-else>
              <p class="text-xs text-white/20">No parameters — fixed operator</p>
            </template>
          </div>
        </template>

        <!-- ── Patterns controls ── -->
        <template v-else-if="activeCategory === 'patterns'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">Patterns</p>
          <p class="text-xs text-white/40 -mt-3">Geometric tiling and screen patterns</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in (['checkerboard','grid','dots','stripes','halftone','scanlines','paper'] as const)"
              :key="s"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="patternsSub === s
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="patternsSub = s"
            >{{ s }}</button>
          </div>
          <div class="space-y-4">
            <template v-if="patternsSub !== 'halftone' && patternsSub !== 'scanlines' && patternsSub !== 'paper'">
              <DemoColorRow label="Color A" v-model="patterns.colorA" />
              <DemoColorRow label="Color B" v-model="patterns.colorB" />
            </template>
            <template v-if="patternsSub === 'checkerboard'">
              <DemoSliderRow label="Scale" :min="2" :max="40" :step="1" v-model="patterns.scale" />
            </template>
            <template v-else-if="patternsSub === 'grid'">
              <DemoSliderRow label="Cell Size" :min="0.02" :max="0.3" :step="0.005" v-model="patterns.cellSize" />
              <DemoSliderRow label="Line Width" :min="0.001" :max="0.02" :step="0.001" v-model="patterns.lineWidth" />
            </template>
            <template v-else-if="patternsSub === 'dots'">
              <DemoSliderRow label="Cell Size" :min="0.02" :max="0.2" :step="0.005" v-model="patterns.cellSize" />
              <DemoSliderRow label="Dot Radius" :min="0.005" :max="0.08" :step="0.001" v-model="patterns.dotRadius" />
            </template>
            <template v-else-if="patternsSub === 'stripes'">
              <DemoSliderRow label="Frequency" :min="2" :max="40" :step="1" v-model="patterns.frequency" />
              <DemoSliderRow label="Thickness" :min="0.1" :max="0.9" :step="0.05" v-model="patterns.thickness" />
              <DemoSliderRow label="Angle" :min="0" :max="180" :step="5" v-model="patterns.angle" />
            </template>
            <template v-else-if="patternsSub === 'halftone'">
              <DemoSliderRow label="Scale" :min="10" :max="150" :step="5" v-model="patterns.halftoneScale" />
              <DemoSliderRow label="Angle" :min="0" :max="90" :step="5" v-model="patterns.angle" />
            </template>
            <template v-else-if="patternsSub === 'scanlines'">
              <DemoSliderRow label="Density" :min="50" :max="800" :step="10" v-model="patterns.scanDensity" />
              <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="patterns.scanIntensity" />
            </template>
            <template v-else-if="patternsSub === 'paper'">
              <DemoSliderRow label="Scale" :min="4" :max="30" :step="1" v-model="patterns.paperScale" />
              <DemoSliderRow label="Intensity" :min="0" :max="0.3" :step="0.005" v-model="patterns.paperIntensity" />
            </template>
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="patterns.vignetteIntensity" />
          </div>
        </template>

        <!-- ── Effects controls ── -->
        <template v-else-if="activeCategory === 'effects'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">Effects</p>
          <p class="text-xs text-white/40 -mt-3">Post-processing and stylistic effects</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in ([
                { id: 'chromatic' as const, label: 'Chromatic' },
                { id: 'film_grain' as const, label: 'Film Grain' },
                { id: 'grain' as const, label: 'Grain' },
                { id: 'risograph' as const, label: 'Risograph' },
                { id: 'halation' as const, label: 'Halation' },
                { id: 'vhs' as const, label: 'VHS' },
              ])"
              :key="s.id"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="effectsSub === s.id
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="effectsSub = s.id"
            >{{ s.label }}</button>
          </div>
          <div class="space-y-4">
            <p class="text-xs text-white/30 font-medium">Base Noise</p>
            <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="effects.noiseScale" />
            <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="effects.noiseSpeed" />
            <div class="h-px bg-white/5" />
            <p class="text-xs text-white/30 font-medium">Effect</p>
            <template v-if="effectsSub === 'chromatic'">
              <DemoSliderRow label="Strength" :min="0" :max="0.03" :step="0.001" v-model="effects.caStrength" />
              <DemoSliderRow label="Edge Falloff" :min="0.5" :max="4" :step="0.1" v-model="effects.caEdge" />
            </template>
            <template v-else-if="effectsSub === 'film_grain' || effectsSub === 'grain'">
              <DemoSliderRow label="Intensity" :min="0" :max="0.3" :step="0.005" v-model="effects.grainIntensity" />
            </template>
            <template v-else-if="effectsSub === 'risograph'">
              <DemoSliderRow label="Scale" :min="0.2" :max="2" :step="0.05" v-model="effects.risoScale" />
              <DemoSliderRow label="Strength" :min="0" :max="0.4" :step="0.01" v-model="effects.risoStrength" />
            </template>
            <template v-else-if="effectsSub === 'halation'">
              <DemoColorRow label="Glow Color" v-model="effects.halationColor" />
              <DemoSliderRow label="Threshold" :min="0.3" :max="0.95" :step="0.01" v-model="effects.halationThreshold" />
              <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="effects.halationIntensity" />
            </template>
            <template v-else-if="effectsSub === 'vhs'">
              <DemoSliderRow label="Bleed" :min="0" :max="0.05" :step="0.001" v-model="effects.vhsBleed" />
              <DemoSliderRow label="Tracking" :min="0" :max="1" :step="0.01" v-model="effects.vhsTracking" />
            </template>
          </div>
        </template>

        <!-- ── Math controls ── -->
        <template v-else-if="activeCategory === 'math'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">Complex Plane Field</p>
          <p class="text-xs text-white/40 -mt-3">Two-pole complex function → cosine palette → ACES</p>
          <div class="space-y-4">
            <DemoSliderRow label="Pole Angle" :min="0" :max="6.28" :step="0.05" v-model="math.poleAngle" />
            <DemoSliderRow label="Pole Distance" :min="0.1" :max="1" :step="0.01" v-model="math.poleDistance" />
            <DemoSliderRow label="Imaginary Wt" :min="0" :max="2" :step="0.05" v-model="math.imaginaryWeight" />
            <DemoSliderRow label="Radial Wt" :min="0" :max="2" :step="0.05" v-model="math.radialWeight" />
            <DemoSliderRow label="Speed" :min="0" :max="0.3" :step="0.005" v-model="math.speed" />
          </div>
        </template>

        <!-- ── UV & Grain controls ── -->
        <template v-else-if="activeCategory === 'uv_grain'">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">UV & Grain</p>
          <p class="text-xs text-white/40 -mt-3">UV distortion transforms + grain overlays</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="s in (['rotate','pixelate','bulge','tile','grain','risograph','scanlines'] as const)"
              :key="s"
              class="px-2 py-0.5 rounded text-xs transition-all"
              :class="uvGrainSub === s
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-white/5 text-white/40 hover:text-white/70'"
              @click="uvGrainSub = s"
            >{{ s }}</button>
          </div>
          <div class="space-y-4">
            <template v-if="uvGrainSub === 'rotate'">
              <DemoSliderRow label="Angle" :min="0" :max="360" :step="1" v-model="uvGrain.rotateAngle" />
            </template>
            <template v-else-if="uvGrainSub === 'pixelate'">
              <DemoSliderRow label="Grid Size" :min="4" :max="128" :step="2" v-model="uvGrain.pixelateGrid" />
            </template>
            <template v-else-if="uvGrainSub === 'bulge'">
              <DemoSliderRow label="Strength" :min="-1" :max="1" :step="0.05" v-model="uvGrain.bulgeStrength" />
              <DemoSliderRow label="Radius" :min="0.1" :max="1" :step="0.05" v-model="uvGrain.bulgeRadius" />
            </template>
            <template v-else-if="uvGrainSub === 'tile'">
              <DemoSliderRow label="Tile X" :min="1" :max="8" :step="1" v-model="uvGrain.tileX" />
              <DemoSliderRow label="Tile Y" :min="1" :max="8" :step="1" v-model="uvGrain.tileY" />
            </template>
            <template
              v-if="uvGrainSub === 'rotate' || uvGrainSub === 'pixelate'
                || uvGrainSub === 'bulge' || uvGrainSub === 'tile'"
            >
              <div class="h-px bg-white/5" />
              <p class="text-xs text-white/30 font-medium">Noise Generator</p>
              <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="uvGrain.noiseScale" />
              <DemoSliderRow label="Speed" :min="0" :max="0.5" :step="0.01" v-model="uvGrain.noiseSpeed" />
            </template>
            <template v-if="uvGrainSub === 'grain' || uvGrainSub === 'risograph' || uvGrainSub === 'scanlines'">
              <DemoColorRow label="Grad A" v-model="uvGrain.gradColorA" />
              <DemoColorRow label="Grad B" v-model="uvGrain.gradColorB" />
            </template>
            <template v-if="uvGrainSub === 'grain'">
              <DemoSliderRow label="Intensity" :min="0" :max="0.3" :step="0.005" v-model="uvGrain.grainIntensity" />
            </template>
            <template v-else-if="uvGrainSub === 'risograph'">
              <DemoSliderRow label="Scale" :min="0.2" :max="2" :step="0.05" v-model="uvGrain.risoScale" />
              <DemoSliderRow label="Strength" :min="0" :max="0.4" :step="0.01" v-model="uvGrain.risoStrength" />
            </template>
            <template v-else-if="uvGrainSub === 'scanlines'">
              <DemoSliderRow label="Density" :min="50" :max="800" :step="10" v-model="uvGrain.scanDensity" />
              <DemoSliderRow label="Intensity" :min="0" :max="1" :step="0.01" v-model="uvGrain.scanIntensity" />
            </template>
            <DemoSliderRow label="Vignette" :min="0" :max="1" :step="0.01" v-model="uvGrain.vignetteIntensity" />
          </div>
        </template>

      </div>
    </div>
  </div>
</template>
