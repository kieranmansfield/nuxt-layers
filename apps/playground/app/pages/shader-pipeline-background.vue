<script setup lang="ts">
definePageMeta({ ssr: false, layout: false })

type BgCategory = 'gradients' | 'mesh' | 'animated' | 'noise_bg' | 'atmospheric' | 'abstract'
const activeCategory = ref<BgCategory>('gradients')

const bgCategories = [
  { id: 'gradients' as const, label: 'Gradients' },
  { id: 'mesh' as const, label: 'Mesh Gradients' },
  { id: 'animated' as const, label: 'Animated' },
  { id: 'noise_bg' as const, label: 'Noise' },
  { id: 'atmospheric' as const, label: 'Atmospheric' },
  { id: 'abstract' as const, label: 'Abstract' },
]

// ── Gradient presets ──────────────────────────────────────────
const gradientPresets = [
  { id: 'linear-h', label: 'Linear H' },
  { id: 'linear-v', label: 'Linear V' },
  { id: 'diagonal-45', label: 'Diagonal 45°' },
  { id: 'diagonal-135', label: 'Diagonal 135°' },
  { id: 'radial', label: 'Radial' },
  { id: 'focal', label: 'Focal' },
  { id: 'conic', label: 'Conic' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'sunrise', label: 'Sunrise' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'pastel', label: 'Pastel Radial' },
  { id: 'sunset', label: 'Warm Sunset' },
]
const activeGrad = ref('linear-h')

const grad = reactive({
  colorA: '#1a0050',
  colorB: '#ff6644',
  colorCenter: '#ffffff',
  colorEdge: '#000033',
  rotation: 0,
  radius: 0.7,
  focalX: 0.3,
  focalY: 0.35,
  vignetteIntensity: 0.4,
})

// ── Mesh gradient presets ─────────────────────────────────────
const meshPresets = [
  { id: 'classic', label: '4-Color Classic' },
  { id: 'warm', label: 'Warm Mesh' },
  { id: 'cool', label: 'Cool Mesh' },
  { id: 'pastel', label: 'Pastel Mesh' },
  { id: 'organic', label: 'Organic Mesh' },
  { id: 'grainient', label: 'Grainient' },
  { id: 'noisy', label: 'Noisy Gradient' },
  { id: 'full-grainient', label: 'Full Grainient' },
  { id: 'multi-focal', label: 'Multi-Focal' },
  { id: 'warped', label: 'Warped Multi' },
]
const activeMesh = ref('classic')

const mesh = reactive({
  bl: '#ff6644',
  br: '#ffcc00',
  tl: '#6644ff',
  tr: '#00ccff',
  warpStrength: 0.3,
  warpScale: 2,
  warpSpeed: 0.2,
  noiseScale: 2,
  noiseStrength: 0.3,
  speed: 0.15,
})

// ── Animated presets ──────────────────────────────────────────
const animatedPresets = [
  { id: 'flowing', label: 'Flowing Gradient' },
  { id: 'wave-colour', label: 'Wave Colour' },
  { id: 'sine-warp', label: 'Sine Warp' },
  { id: 'noisy-linear', label: 'Noisy Linear' },
  { id: 'turbulent', label: 'Turbulent Mesh' },
  { id: 'shifting', label: 'Color Shifting' },
  { id: 'fbm-flow', label: 'FBM Flow' },
  { id: 'aurora-grad', label: 'Aurora Gradient' },
]
const activeAnim = ref('flowing')

const anim = reactive({
  colorA: '#1a0050',
  colorB: '#ff4488',
  warpFreq: 5,
  warpAmp: 30,
  warpSpeed: 2,
  fbmScale: 3,
  fbmSpeed: 0.15,
  fbmOctaves: 5,
  waveColor: '#4488ff',
  waveOpacity: 0.8,
  waveFreq: 3,
  waveSpeed: 0.5,
  auroraColorA: '#00ff88',
  auroraColorB: '#8844ff',
  auroraBandY: 0.7,
  auroraIntensity: 0.7,
})

// ── Noise background presets ──────────────────────────────────
const noiseBgPresets = [
  { id: 'fbm-classic', label: 'FBM Classic' },
  { id: 'curl-noise', label: 'Curl Noise' },
  { id: 'domain-warp', label: 'Domain Warp' },
  { id: 'voronoi', label: 'Voronoi' },
  { id: 'billow', label: 'Billow' },
  { id: 'ridged', label: 'Ridged' },
  { id: 'cellular', label: 'Cellular' },
  { id: 'simplex', label: 'Simplex Pastel' },
]
const activeNoiseBg = ref('fbm-classic')

const noiseBg = reactive({
  scale: 3,
  speed: 0.15,
  octaves: 5,
  colorA: '#000000',
  colorB: '#ffffff',
  hue: 0.5,
  brightness: 0.05,
  contrast: 1.2,
  vignetteIntensity: 0.5,
})

// ── Atmospheric presets ───────────────────────────────────────
const atmosphericPresets = [
  { id: 'night-sky', label: 'Night Sky' },
  { id: 'day-sky', label: 'Day Sky' },
  { id: 'day-night', label: 'Day/Night Cycle' },
  { id: 'nebula', label: 'Nebula' },
  { id: 'aurora-only', label: 'Aurora Only' },
  { id: 'deep-space', label: 'Deep Space' },
]
const activeAtmo = ref('night-sky')

const atmo = reactive({
  auroraColorA: '#00ff88',
  auroraColorB: '#8844ff',
  auroraBandY: 0.7,
  auroraBandHeight: 0.3,
  auroraIntensity: 0.7,
  auroraSpeed: 0.3,
  starDensity: 80,
  starBrightness: 1.0,
  hazeColor: '#1a3a5c',
  hazeReach: 0.3,
  hazeIntensity: 0.2,
  sunDirectionY: 0.8,
  dayNightSpeed: 0.3,
  gradColorA: '#030818',
  gradColorB: '#1a0828',
})

// ── Abstract presets ──────────────────────────────────────────
const abstractPresets = [
  { id: 'tunnel', label: 'Tunnel' },
  { id: 'complex', label: 'Complex Plane' },
  { id: 'marble', label: 'Marble' },
  { id: 'wood', label: 'Wood Rings' },
  { id: 'flame', label: 'Flame' },
  { id: 'water', label: 'Water' },
]
const activeAbstract = ref('tunnel')

const abstract = reactive({
  tunnelRadius: 0.8,
  tunnelSpeed: 1,
  tunnelColorA: '#1a0a3a',
  tunnelColorB: '#ff4488',
  complexPoleAngle: Math.PI / 3,
  complexPoleDistance: 0.4,
  complexSpeed: 0.05,
  marbleColorA: '#f5f0e8',
  marbleColorB: '#6a5a4a',
  marbleFrequency: 5,
  woodRingFrequency: 12,
  woodNoiseStrength: 0.4,
  flameColorBase: '#ffcc00',
  flameColorTip: '#ff2200',
  waterDeep: '#003366',
  waterShallow: '#66ccff',
  waterFrequency: 8,
  waterSpeed: 1,
  vignetteIntensity: 0.5,
})

// ── Grain overlay ─────────────────────────────────────────────
const grainEnabled = ref(false)
const grainState = reactive({
  type: 'fine' as 'fine' | 'film' | 'riso',
  intensity: 0.06,
  blendMode: 'add' as 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light',
  animated: true,
  fps: 24,
  scale: 0.6,
  strength: 0.12,
})
const grainKey = computed(() => `${grainState.type}-${grainState.blendMode}`)

// ── Copy code ─────────────────────────────────────────────────
const copied = ref(false)

function fmtN(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

function getGrainBlock(): string {
  const s = grainState
  if (s.type === 'fine')
    return `<PipelineGrain :order="99" :intensity="${fmtN(s.intensity)}" :animated="${s.animated}" :fps="${s.fps}" blend-mode="${s.blendMode}" />`
  if (s.type === 'film')
    return `<PipelineFilmGrain :order="99" :intensity="${fmtN(s.intensity)}" :fps="${s.fps}" blend-mode="${s.blendMode}" />`
  return `<PipelineRisographGrain :order="99" :scale="${fmtN(s.scale)}" :strength="${fmtN(s.strength)}" :fps="${s.fps}" blend-mode="${s.blendMode}" />`
}

function getActiveBlocks(): string[] {
  switch (activeCategory.value) {
    case 'gradients': {
      const v = activeGrad.value
      if (v === 'linear-h')
        return [
          `<PipelineLinearGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" axis="x" />`,
        ]
      if (v === 'linear-v')
        return [
          `<PipelineLinearGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" axis="y" />`,
        ]
      if (v === 'diagonal-45')
        return [
          `<PipelineDiagonalGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :angle="45" />`,
        ]
      if (v === 'diagonal-135')
        return [
          `<PipelineDiagonalGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :angle="135" />`,
        ]
      if (v === 'radial')
        return [
          `<PipelineRadialGradient :order="0" color-center="${grad.colorCenter}" color-edge="${grad.colorA}" :radius="${fmtN(grad.radius)}" />`,
        ]
      if (v === 'focal')
        return [
          `<PipelineFocalGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :focal="[${fmtN(grad.focalX)}, ${fmtN(grad.focalY)}]" :radius="${fmtN(grad.radius)}" />`,
        ]
      if (v === 'conic')
        return [
          `<PipelineConicGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :rotation="${grad.rotation}" />`,
        ]
      if (v === 'diamond')
        return [
          `<PipelineDiamondGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" />`,
        ]
      if (v === 'sunrise')
        return [
          `<PipelineLinearGradient :order="0" color-a="#ff6600" color-b="#ffcc44" axis="y" />`,
        ]
      if (v === 'ocean')
        return [
          `<PipelineLinearGradient :order="0" color-a="#003366" color-b="#66aacc" axis="y" />`,
          `<PipelineVignette :order="1" :intensity="${fmtN(grad.vignetteIntensity)}" />`,
        ]
      if (v === 'pastel')
        return [
          `<PipelineRadialGradient :order="0" color-center="#ffd6e0" color-edge="#b8d4f8" :radius="0.9" />`,
        ]
      if (v === 'sunset')
        return [
          `<PipelineDiagonalGradient :order="0" color-a="#ff4400" color-b="#ff9900" :angle="135" />`,
          `<PipelineVignette :order="1" :intensity="${fmtN(grad.vignetteIntensity)}" />`,
        ]
      return []
    }
    case 'mesh': {
      const v = activeMesh.value
      if (v === 'classic')
        return [
          `<PipelineBilinearGradient :order="0" bottom-left="${mesh.bl}" bottom-right="${mesh.br}" top-left="${mesh.tl}" top-right="${mesh.tr}" />`,
        ]
      if (v === 'warm')
        return [
          `<PipelineBilinearGradient :order="0" bottom-left="#ff6600" bottom-right="#ffcc00" top-left="#cc2200" top-right="#ff9944" />`,
        ]
      if (v === 'cool')
        return [
          `<PipelineBilinearGradient :order="0" bottom-left="#001166" bottom-right="#0044cc" top-left="#220066" top-right="#4400aa" />`,
        ]
      if (v === 'pastel')
        return [
          `<PipelineBilinearGradient :order="0" bottom-left="#ffd6e0" bottom-right="#d6f0ff" top-left="#e8d6ff" top-right="#d6ffe8" />`,
        ]
      if (v === 'organic')
        return [
          `<PipelineUVNoiseWarp :order="0" :strength="${fmtN(mesh.warpStrength)}" :scale="${fmtN(mesh.warpScale)}" :speed="${fmtN(mesh.warpSpeed)}" />`,
          `<PipelineBilinearGradient :order="0" bottom-left="${mesh.bl}" bottom-right="${mesh.br}" top-left="${mesh.tl}" top-right="${mesh.tr}" />`,
        ]
      if (v === 'grainient')
        return [
          `<PipelineUVNoiseRotate :order="0" :scale="${fmtN(mesh.warpScale)}" :speed="${fmtN(mesh.warpSpeed)}" />`,
          `<PipelineRotatedGradientBlend :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :noise-scale="${fmtN(mesh.noiseScale)}" :speed="${fmtN(mesh.speed)}" />`,
        ]
      if (v === 'noisy')
        return [
          `<PipelineNoisyGradient :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :noise-scale="${fmtN(mesh.noiseScale)}" :noise-strength="${fmtN(mesh.noiseStrength)}" :speed="${fmtN(mesh.speed)}" />`,
        ]
      if (v === 'full-grainient')
        return [
          `<PipelineNoisyGradientBlend :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :speed="${fmtN(mesh.speed)}" />`,
        ]
      if (v === 'multi-focal')
        return [
          `<PipelineFocalGradient :order="0" color-a="${mesh.bl}" color-b="${mesh.br}" :focal="[0.25, 0.35]" />`,
          `<PipelineFocalGradient :order="0" color-a="${mesh.tl}" color-b="${mesh.tr}" :focal="[0.75, 0.65]" />`,
        ]
      if (v === 'warped')
        return [
          `<PipelineUVNoiseWarp :order="0" :strength="${fmtN(mesh.warpStrength)}" :scale="${fmtN(mesh.warpScale)}" :speed="${fmtN(mesh.warpSpeed)}" />`,
          `<PipelineNoisyGradient :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :noise-scale="${fmtN(mesh.noiseScale)}" :noise-strength="${fmtN(mesh.noiseStrength)}" :speed="${fmtN(mesh.speed)}" />`,
        ]
      return []
    }
    case 'animated': {
      const v = activeAnim.value
      if (v === 'flowing')
        return [
          `<PipelineNoisyGradientBlend :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" :speed="0.2" />`,
        ]
      if (v === 'wave-colour')
        return [
          `<PipelineLinearGradient :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" axis="y" />`,
          `<PipelineWaveBendLayer :order="1" color="${anim.waveColor}" :opacity="${fmtN(anim.waveOpacity)}" :frequency="${fmtN(anim.waveFreq)}" :speed="${fmtN(anim.waveSpeed)}" />`,
          `<PipelineWaveBendLayer :order="2" color="${anim.colorA}" :opacity="0.5" :frequency="${fmtN(anim.waveFreq * 1.5)}" :speed="${fmtN(anim.waveSpeed * 0.7)}" />`,
        ]
      if (v === 'sine-warp')
        return [
          `<PipelineUVSineWarpXY :order="0" :frequency="${fmtN(anim.warpFreq)}" :amplitude="${fmtN(anim.warpAmp)}" :speed="${fmtN(anim.warpSpeed)}" />`,
          `<PipelineRotatedGradientBlend :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" />`,
        ]
      if (v === 'noisy-linear')
        return [
          `<PipelineNoisyGradient :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" :noise-scale="${fmtN(anim.fbmScale)}" :speed="${fmtN(anim.fbmSpeed)}" />`,
        ]
      if (v === 'turbulent')
        return [
          `<PipelineUVNoiseWarp :order="0" :strength="0.4" :scale="2" :speed="0.3" />`,
          `<PipelineBilinearGradient :order="0" bottom-left="${anim.colorA}" bottom-right="${anim.colorB}" top-left="#440088" top-right="#ff8844" />`,
        ]
      if (v === 'shifting')
        return [
          `<PipelineNoisyGradientBlend :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" :speed="0.5" />`,
        ]
      if (v === 'fbm-flow')
        return [
          `<PipelineFBMNoise :order="0" :scale="${fmtN(anim.fbmScale)}" :speed="${fmtN(anim.fbmSpeed)}" :octaves="${anim.fbmOctaves}" color-a="#000000" color-b="#ffffff" />`,
          `<PipelineCosinePalette :order="1" scalar-source="prev" :time-scale="0.1" />`,
        ]
      if (v === 'aurora-grad')
        return [
          `<PipelineLinearGradient :order="0" color-a="#030818" color-b="#0d1a30" axis="y" />`,
          `<PipelineAurora :order="1" color-a="${anim.auroraColorA}" color-b="${anim.auroraColorB}" :band-y="${fmtN(anim.auroraBandY)}" :intensity="${fmtN(anim.auroraIntensity)}" />`,
          `<PipelineVignette :order="2" :intensity="0.4" />`,
        ]
      return []
    }
    case 'noise_bg': {
      const v = activeNoiseBg.value
      if (v === 'fbm-classic')
        return [
          `<PipelineFBMNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" :octaves="${noiseBg.octaves}" color-a="#000000" color-b="#ffffff" />`,
          `<PipelineCosinePalette :order="1" scalar-source="prev" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'curl-noise')
        return [
          `<PipelineCurlNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineHue :order="1" :shift="${fmtN(noiseBg.hue)}" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'domain-warp')
        return [
          `<PipelineDomainWarpedNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineDuoTone :order="1" shadow-color="#1a0033" highlight-color="#ffcc00" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'voronoi')
        return [
          `<PipelineVoronoiEdges :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineDuoTone :order="1" shadow-color="#0a0a1a" highlight-color="#6688ff" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'billow')
        return [
          `<PipelineBillowNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineHue :order="1" :shift="${fmtN(noiseBg.hue)}" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'ridged')
        return [
          `<PipelineRidgedNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineSplitTone :order="1" shadow-color="#001166" highlight-color="#ffaa44" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'cellular')
        return [
          `<PipelineCellularNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineMonochromeTint :order="1" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      if (v === 'simplex')
        return [
          `<PipelineSimplexNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
          `<PipelineBrightnessContrast :order="1" :brightness="${fmtN(noiseBg.brightness)}" :contrast="${fmtN(noiseBg.contrast)}" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
        ]
      return []
    }
    case 'atmospheric': {
      const v = activeAtmo.value
      if (v === 'night-sky')
        return [
          `<PipelineSolidColour :order="0" color="#020408" />`,
          `<PipelineAurora :order="1" color-a="${atmo.auroraColorA}" color-b="${atmo.auroraColorB}" :band-y="${fmtN(atmo.auroraBandY)}" :band-height="${fmtN(atmo.auroraBandHeight)}" :intensity="${fmtN(atmo.auroraIntensity)}" :speed="${fmtN(atmo.auroraSpeed)}" />`,
          `<PipelineStarfield :order="2" :density="${atmo.starDensity}" :brightness="${fmtN(atmo.starBrightness)}" />`,
          `<PipelineHaze :order="3" color="${atmo.hazeColor}" :reach="${fmtN(atmo.hazeReach)}" :intensity="${fmtN(atmo.hazeIntensity)}" />`,
        ]
      if (v === 'day-sky')
        return [
          `<PipelineSkyAtmosphere :order="0" :sun-direction="[0.3, ${fmtN(atmo.sunDirectionY)}, 0.5]" />`,
        ]
      if (v === 'day-night')
        return [`<PipelineDayNightCycle :order="0" :speed="${fmtN(atmo.dayNightSpeed)}" />`]
      if (v === 'nebula')
        return [
          `<PipelineSolidColour :order="0" color="#04010a" />`,
          `<PipelineFBMNoise :order="1" :scale="3" :speed="0.05" :octaves="6" color-a="#04010a" color-b="#6600aa" />`,
          `<PipelineGodRays :order="2" color="#aa44ff" :intensity="0.3" :ray-count="16" />`,
          `<PipelineStarfield :order="3" :density="120" :brightness="1.2" />`,
        ]
      if (v === 'aurora-only')
        return [
          `<PipelineLinearGradient :order="0" color-a="${atmo.gradColorA}" color-b="${atmo.gradColorB}" axis="y" />`,
          `<PipelineAurora :order="1" color-a="${atmo.auroraColorA}" color-b="${atmo.auroraColorB}" :band-y="${fmtN(atmo.auroraBandY)}" :band-height="${fmtN(atmo.auroraBandHeight)}" :intensity="${fmtN(atmo.auroraIntensity)}" :speed="${fmtN(atmo.auroraSpeed)}" />`,
          `<PipelineVignette :order="2" :intensity="0.5" />`,
        ]
      if (v === 'deep-space')
        return [
          `<PipelineSolidColour :order="0" color="#000000" />`,
          `<PipelineStarfield :order="1" :density="${atmo.starDensity * 2}" :brightness="${fmtN(atmo.starBrightness)}" :twinkle-speed="0.5" />`,
          `<PipelineFBMNoise :order="2" :scale="2" :speed="0.03" :octaves="4" color-a="#000000" color-b="#110033" />`,
        ]
      return []
    }
    case 'abstract': {
      const v = activeAbstract.value
      if (v === 'tunnel')
        return [
          `<PipelineRaymarchTunnel :order="0" :radius="${fmtN(abstract.tunnelRadius)}" :speed="${fmtN(abstract.tunnelSpeed)}" color-a="${abstract.tunnelColorA}" color-b="${abstract.tunnelColorB}" />`,
        ]
      if (v === 'complex')
        return [
          `<PipelineComplexPlaneField :order="0" :pole-angle="${fmtN(abstract.complexPoleAngle)}" :pole-distance="${fmtN(abstract.complexPoleDistance)}" :speed="${fmtN(abstract.complexSpeed)}" />`,
          `<PipelineCosinePalette :order="1" scalar-source="prev" />`,
          `<PipelineACESTonemap :order="2" />`,
        ]
      if (v === 'marble')
        return [
          `<PipelineMarble :order="0" color-a="${abstract.marbleColorA}" color-b="${abstract.marbleColorB}" :frequency="${fmtN(abstract.marbleFrequency)}" />`,
          `<PipelineVignette :order="1" :intensity="${fmtN(abstract.vignetteIntensity)}" />`,
        ]
      if (v === 'wood')
        return [
          `<PipelineWood :order="0" :ring-frequency="${fmtN(abstract.woodRingFrequency)}" :noise-strength="${fmtN(abstract.woodNoiseStrength)}" />`,
          `<PipelineHalation :order="1" color="#ff6600" :threshold="0.7" :intensity="0.4" />`,
          `<PipelineVignette :order="2" :intensity="${fmtN(abstract.vignetteIntensity)}" />`,
        ]
      if (v === 'flame')
        return [
          `<PipelineFlame :order="0" color-base="${abstract.flameColorBase}" color-tip="${abstract.flameColorTip}" />`,
          `<PipelineVignette :order="1" :intensity="${fmtN(abstract.vignetteIntensity)}" />`,
        ]
      if (v === 'water')
        return [
          `<PipelineWater :order="0" color-deep="${abstract.waterDeep}" color-shallow="${abstract.waterShallow}" :frequency="${fmtN(abstract.waterFrequency)}" :speed="${fmtN(abstract.waterSpeed)}" />`,
          `<PipelineVignette :order="1" :intensity="${fmtN(abstract.vignetteIntensity)}" />`,
        ]
      return []
    }
    default:
      return []
  }
}

function generateCode(): string {
  const blocks = getActiveBlocks()
  const grainBlock = grainEnabled.value ? [getGrainBlock()] : []
  const all = [...blocks, ...grainBlock]
  return [
    '<ShaderPipelineContext>',
    '  <div class="hidden" aria-hidden="true">',
    ...all.map((b) => `    ${b}`),
    '  </div>',
    '  <ShaderCanvas :webgpu="true" />',
    '</ShaderPipelineContext>',
  ].join('\n')
}

function copyCode() {
  navigator.clipboard.writeText(generateCode()).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

// Computed active preset label for display
const activePresetLabel = computed(() => {
  const map: Record<BgCategory, { id: string; label: string }[]> = {
    gradients: gradientPresets,
    mesh: meshPresets,
    animated: animatedPresets,
    noise_bg: noiseBgPresets,
    atmospheric: atmosphericPresets,
    abstract: abstractPresets,
  }
  const active: Record<BgCategory, string> = {
    gradients: activeGrad.value,
    mesh: activeMesh.value,
    animated: activeAnim.value,
    noise_bg: activeNoiseBg.value,
    atmospheric: activeAtmo.value,
    abstract: activeAbstract.value,
  }
  return map[activeCategory.value].find((p) => p.id === active[activeCategory.value])?.label ?? ''
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white flex flex-col">
    <!-- Header -->
    <div class="flex items-center gap-4 px-6 py-4 border-b border-white/8">
      <UButton
        to="/shader-pipeline"
        variant="ghost"
        icon="i-lucide-arrow-left"
        size="xs"
        color="neutral"
      />
      <div>
        <h1 class="font-semibold text-sm text-white">Shader Pipeline Backgrounds</h1>
        <p class="text-xs text-white/40">
          50+ background presets · Gradients, Mesh, Noise, Atmospheric, Abstract
        </p>
      </div>
      <UButton
        class="ml-auto"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        :label="copied ? 'Copied!' : 'Copy Code'"
        size="xs"
        variant="soft"
        color="neutral"
        @click="copyCode"
      />
    </div>

    <!-- Main layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Canvas column -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div
          class="relative w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
        >
          <ClientOnly>
            <ShaderPipelineContext>
              <!-- Hidden block registry -->
              <div class="hidden pointer-events-none" aria-hidden="true">
                <!-- ══ GRADIENTS ══════════════════════════════════════ -->
                <template v-if="activeCategory === 'gradients'">
                  <template v-if="activeGrad === 'linear-h'">
                    <PipelineLinearGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                      axis="x"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'linear-v'">
                    <PipelineLinearGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                      axis="y"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'diagonal-45'">
                    <PipelineDiagonalGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                      :angle="45"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'diagonal-135'">
                    <PipelineDiagonalGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                      :angle="135"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'radial'">
                    <PipelineRadialGradient
                      :order="0"
                      :color-center="grad.colorCenter"
                      :color-edge="grad.colorA"
                      :radius="grad.radius"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'focal'">
                    <PipelineFocalGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                      :focal="[grad.focalX, grad.focalY]"
                      :radius="grad.radius"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'conic'">
                    <PipelineConicGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                      :rotation="grad.rotation"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'diamond'">
                    <PipelineDiamondGradient
                      :order="0"
                      :color-a="grad.colorA"
                      :color-b="grad.colorB"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'sunrise'">
                    <PipelineLinearGradient
                      :order="0"
                      color-a="#ff6600"
                      color-b="#ffcc44"
                      axis="y"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'ocean'">
                    <PipelineLinearGradient
                      :order="0"
                      color-a="#003366"
                      color-b="#66aacc"
                      axis="y"
                    />
                    <PipelineVignette :order="1" :intensity="grad.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeGrad === 'pastel'">
                    <PipelineRadialGradient
                      :order="0"
                      color-center="#ffd6e0"
                      color-edge="#b8d4f8"
                      :radius="0.9"
                    />
                  </template>
                  <template v-else-if="activeGrad === 'sunset'">
                    <PipelineDiagonalGradient
                      :order="0"
                      color-a="#ff4400"
                      color-b="#ff9900"
                      :angle="135"
                    />
                    <PipelineVignette :order="1" :intensity="grad.vignetteIntensity" />
                  </template>
                </template>

                <!-- ══ MESH GRADIENTS ════════════════════════════════ -->
                <template v-else-if="activeCategory === 'mesh'" :key="activeMesh">
                  <template v-if="activeMesh === 'classic'">
                    <PipelineBilinearGradient
                      :order="0"
                      :bottom-left="mesh.bl"
                      :bottom-right="mesh.br"
                      :top-left="mesh.tl"
                      :top-right="mesh.tr"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'warm'">
                    <PipelineBilinearGradient
                      :order="0"
                      bottom-left="#ff6600"
                      bottom-right="#ffcc00"
                      top-left="#cc2200"
                      top-right="#ff9944"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'cool'">
                    <PipelineBilinearGradient
                      :order="0"
                      bottom-left="#001166"
                      bottom-right="#0044cc"
                      top-left="#220066"
                      top-right="#4400aa"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'pastel'">
                    <PipelineBilinearGradient
                      :order="0"
                      bottom-left="#ffd6e0"
                      bottom-right="#d6f0ff"
                      top-left="#e8d6ff"
                      top-right="#d6ffe8"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'organic'">
                    <PipelineUVNoiseWarp
                      :order="0"
                      :strength="mesh.warpStrength"
                      :scale="mesh.warpScale"
                      :speed="mesh.warpSpeed"
                    />
                    <PipelineBilinearGradient
                      :order="0"
                      :bottom-left="mesh.bl"
                      :bottom-right="mesh.br"
                      :top-left="mesh.tl"
                      :top-right="mesh.tr"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'grainient'">
                    <PipelineUVNoiseRotate
                      :order="0"
                      :scale="mesh.warpScale"
                      :speed="mesh.warpSpeed"
                    />
                    <PipelineRotatedGradientBlend
                      :order="0"
                      :color-a="mesh.bl"
                      :color-b="mesh.tr"
                      :noise-scale="mesh.noiseScale"
                      :speed="mesh.speed"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'noisy'">
                    <PipelineNoisyGradient
                      :order="0"
                      :color-a="mesh.bl"
                      :color-b="mesh.tr"
                      :noise-scale="mesh.noiseScale"
                      :noise-strength="mesh.noiseStrength"
                      :speed="mesh.speed"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'full-grainient'">
                    <PipelineNoisyGradientBlend
                      :order="0"
                      :color-a="mesh.bl"
                      :color-b="mesh.tr"
                      :speed="mesh.speed"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'multi-focal'">
                    <PipelineFocalGradient
                      :order="0"
                      :color-a="mesh.bl"
                      :color-b="mesh.br"
                      :focal="[0.25, 0.35]"
                    />
                    <PipelineFocalGradient
                      :order="0"
                      :color-a="mesh.tl"
                      :color-b="mesh.tr"
                      :focal="[0.75, 0.65]"
                    />
                  </template>
                  <template v-else-if="activeMesh === 'warped'">
                    <PipelineUVNoiseWarp
                      :order="0"
                      :strength="mesh.warpStrength"
                      :scale="mesh.warpScale"
                      :speed="mesh.warpSpeed"
                    />
                    <PipelineNoisyGradient
                      :order="0"
                      :color-a="mesh.bl"
                      :color-b="mesh.tr"
                      :noise-scale="mesh.noiseScale"
                      :noise-strength="mesh.noiseStrength"
                      :speed="mesh.speed"
                    />
                  </template>
                </template>

                <!-- ══ ANIMATED ══════════════════════════════════════ -->
                <template v-else-if="activeCategory === 'animated'" :key="activeAnim">
                  <template v-if="activeAnim === 'flowing'">
                    <PipelineNoisyGradientBlend
                      :order="0"
                      :color-a="anim.colorA"
                      :color-b="anim.colorB"
                      :speed="0.2"
                    />
                  </template>
                  <template v-else-if="activeAnim === 'wave-colour'">
                    <PipelineLinearGradient
                      :order="0"
                      :color-a="anim.colorA"
                      :color-b="anim.colorB"
                      axis="y"
                    />
                    <PipelineWaveBendLayer
                      :order="1"
                      :color="anim.waveColor"
                      :opacity="anim.waveOpacity"
                      :frequency="anim.waveFreq"
                      :speed="anim.waveSpeed"
                    />
                    <PipelineWaveBendLayer
                      :order="2"
                      :color="anim.colorA"
                      :opacity="0.5"
                      :frequency="anim.waveFreq * 1.5"
                      :speed="anim.waveSpeed * 0.7"
                    />
                  </template>
                  <template v-else-if="activeAnim === 'sine-warp'">
                    <PipelineUVSineWarpXY
                      :order="0"
                      :frequency="anim.warpFreq"
                      :amplitude="anim.warpAmp"
                      :speed="anim.warpSpeed"
                    />
                    <PipelineRotatedGradientBlend
                      :order="0"
                      :color-a="anim.colorA"
                      :color-b="anim.colorB"
                    />
                  </template>
                  <template v-else-if="activeAnim === 'noisy-linear'">
                    <PipelineNoisyGradient
                      :order="0"
                      :color-a="anim.colorA"
                      :color-b="anim.colorB"
                      :noise-scale="anim.fbmScale"
                      :speed="anim.fbmSpeed"
                    />
                  </template>
                  <template v-else-if="activeAnim === 'turbulent'">
                    <PipelineUVNoiseWarp :order="0" :strength="0.4" :scale="2" :speed="0.3" />
                    <PipelineBilinearGradient
                      :order="0"
                      :bottom-left="anim.colorA"
                      :bottom-right="anim.colorB"
                      top-left="#440088"
                      top-right="#ff8844"
                    />
                  </template>
                  <template v-else-if="activeAnim === 'shifting'">
                    <PipelineNoisyGradientBlend
                      :order="0"
                      :color-a="anim.colorA"
                      :color-b="anim.colorB"
                      :speed="0.5"
                    />
                  </template>
                  <template v-else-if="activeAnim === 'fbm-flow'" :key="anim.fbmOctaves">
                    <PipelineFBMNoise
                      :order="0"
                      :scale="anim.fbmScale"
                      :speed="anim.fbmSpeed"
                      :octaves="anim.fbmOctaves"
                      color-a="#000000"
                      color-b="#ffffff"
                    />
                    <PipelineCosinePalette :order="1" scalar-source="prev" :time-scale="0.1" />
                  </template>
                  <template v-else-if="activeAnim === 'aurora-grad'">
                    <PipelineLinearGradient
                      :order="0"
                      color-a="#030818"
                      color-b="#0d1a30"
                      axis="y"
                    />
                    <PipelineAurora
                      :order="1"
                      :color-a="anim.auroraColorA"
                      :color-b="anim.auroraColorB"
                      :band-y="anim.auroraBandY"
                      :intensity="anim.auroraIntensity"
                    />
                    <PipelineVignette :order="2" :intensity="0.4" />
                  </template>
                </template>

                <!-- ══ NOISE BACKGROUNDS ═════════════════════════════ -->
                <template
                  v-else-if="activeCategory === 'noise_bg'"
                  :key="activeNoiseBg + noiseBg.octaves"
                >
                  <template v-if="activeNoiseBg === 'fbm-classic'" :key="noiseBg.octaves">
                    <PipelineFBMNoise
                      :order="0"
                      :scale="noiseBg.scale"
                      :speed="noiseBg.speed"
                      :octaves="noiseBg.octaves"
                      color-a="#000000"
                      color-b="#ffffff"
                    />
                    <PipelineCosinePalette :order="1" scalar-source="prev" />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'curl-noise'">
                    <PipelineCurlNoise :order="0" :scale="noiseBg.scale" :speed="noiseBg.speed" />
                    <PipelineHue :order="1" :shift="noiseBg.hue" />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'domain-warp'">
                    <PipelineDomainWarpedNoise
                      :order="0"
                      :scale="noiseBg.scale"
                      :speed="noiseBg.speed"
                    />
                    <PipelineDuoTone :order="1" shadow-color="#1a0033" highlight-color="#ffcc00" />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'voronoi'">
                    <PipelineVoronoiEdges
                      :order="0"
                      :scale="noiseBg.scale"
                      :speed="noiseBg.speed"
                    />
                    <PipelineDuoTone :order="1" shadow-color="#0a0a1a" highlight-color="#6688ff" />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'billow'">
                    <PipelineBillowNoise :order="0" :scale="noiseBg.scale" :speed="noiseBg.speed" />
                    <PipelineHue :order="1" :shift="noiseBg.hue" />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'ridged'">
                    <PipelineRidgedNoise :order="0" :scale="noiseBg.scale" :speed="noiseBg.speed" />
                    <PipelineSplitTone
                      :order="1"
                      shadow-color="#001166"
                      highlight-color="#ffaa44"
                    />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'cellular'">
                    <PipelineCellularNoise
                      :order="0"
                      :scale="noiseBg.scale"
                      :speed="noiseBg.speed"
                    />
                    <PipelineMonochromeTint :order="1" />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeNoiseBg === 'simplex'">
                    <PipelineSimplexNoise
                      :order="0"
                      :scale="noiseBg.scale"
                      :speed="noiseBg.speed"
                    />
                    <PipelineBrightnessContrast
                      :order="1"
                      :brightness="noiseBg.brightness"
                      :contrast="noiseBg.contrast"
                    />
                    <PipelineVignette :order="2" :intensity="noiseBg.vignetteIntensity" />
                  </template>
                </template>

                <!-- ══ ATMOSPHERIC ═══════════════════════════════════ -->
                <template v-else-if="activeCategory === 'atmospheric'" :key="activeAtmo">
                  <template v-if="activeAtmo === 'night-sky'">
                    <PipelineSolidColour :order="0" color="#020408" />
                    <PipelineAurora
                      :order="1"
                      :color-a="atmo.auroraColorA"
                      :color-b="atmo.auroraColorB"
                      :band-y="atmo.auroraBandY"
                      :band-height="atmo.auroraBandHeight"
                      :intensity="atmo.auroraIntensity"
                      :speed="atmo.auroraSpeed"
                    />
                    <PipelineStarfield
                      :order="2"
                      :density="atmo.starDensity"
                      :brightness="atmo.starBrightness"
                    />
                    <PipelineHaze
                      :order="3"
                      :color="atmo.hazeColor"
                      :reach="atmo.hazeReach"
                      :intensity="atmo.hazeIntensity"
                    />
                  </template>
                  <template v-else-if="activeAtmo === 'day-sky'">
                    <PipelineSkyAtmosphere
                      :order="0"
                      :sun-direction="[0.3, atmo.sunDirectionY, 0.5]"
                    />
                  </template>
                  <template v-else-if="activeAtmo === 'day-night'">
                    <PipelineDayNightCycle :order="0" :speed="atmo.dayNightSpeed" />
                  </template>
                  <template v-else-if="activeAtmo === 'nebula'">
                    <PipelineSolidColour :order="0" color="#04010a" />
                    <PipelineFBMNoise
                      :order="1"
                      :scale="3"
                      :speed="0.05"
                      :octaves="6"
                      color-a="#04010a"
                      color-b="#6600aa"
                    />
                    <PipelineGodRays :order="2" color="#aa44ff" :intensity="0.3" :ray-count="16" />
                    <PipelineStarfield :order="3" :density="120" :brightness="1.2" />
                  </template>
                  <template v-else-if="activeAtmo === 'aurora-only'">
                    <PipelineLinearGradient
                      :order="0"
                      :color-a="atmo.gradColorA"
                      :color-b="atmo.gradColorB"
                      axis="y"
                    />
                    <PipelineAurora
                      :order="1"
                      :color-a="atmo.auroraColorA"
                      :color-b="atmo.auroraColorB"
                      :band-y="atmo.auroraBandY"
                      :band-height="atmo.auroraBandHeight"
                      :intensity="atmo.auroraIntensity"
                      :speed="atmo.auroraSpeed"
                    />
                    <PipelineVignette :order="2" :intensity="0.5" />
                  </template>
                  <template v-else-if="activeAtmo === 'deep-space'">
                    <PipelineSolidColour :order="0" color="#000000" />
                    <PipelineStarfield
                      :order="1"
                      :density="atmo.starDensity * 2"
                      :brightness="atmo.starBrightness"
                      :twinkle-speed="0.5"
                    />
                    <PipelineFBMNoise
                      :order="2"
                      :scale="2"
                      :speed="0.03"
                      :octaves="4"
                      color-a="#000000"
                      color-b="#110033"
                    />
                  </template>
                </template>

                <!-- ══ ABSTRACT ══════════════════════════════════════ -->
                <template v-else-if="activeCategory === 'abstract'" :key="activeAbstract">
                  <template v-if="activeAbstract === 'tunnel'">
                    <PipelineRaymarchTunnel
                      :order="0"
                      :radius="abstract.tunnelRadius"
                      :speed="abstract.tunnelSpeed"
                      :color-a="abstract.tunnelColorA"
                      :color-b="abstract.tunnelColorB"
                    />
                  </template>
                  <template v-else-if="activeAbstract === 'complex'">
                    <PipelineComplexPlaneField
                      :order="0"
                      :pole-angle="abstract.complexPoleAngle"
                      :pole-distance="abstract.complexPoleDistance"
                      :speed="abstract.complexSpeed"
                    />
                    <PipelineCosinePalette :order="1" scalar-source="prev" />
                    <PipelineACESTonemap :order="2" />
                  </template>
                  <template v-else-if="activeAbstract === 'marble'">
                    <PipelineMarble
                      :order="0"
                      :color-a="abstract.marbleColorA"
                      :color-b="abstract.marbleColorB"
                      :frequency="abstract.marbleFrequency"
                    />
                    <PipelineVignette :order="1" :intensity="abstract.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeAbstract === 'wood'">
                    <PipelineWood
                      :order="0"
                      :ring-frequency="abstract.woodRingFrequency"
                      :noise-strength="abstract.woodNoiseStrength"
                    />
                    <PipelineHalation
                      :order="1"
                      color="#ff6600"
                      :threshold="0.7"
                      :intensity="0.4"
                    />
                    <PipelineVignette :order="2" :intensity="abstract.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeAbstract === 'flame'">
                    <PipelineFlame
                      :order="0"
                      :color-base="abstract.flameColorBase"
                      :color-tip="abstract.flameColorTip"
                    />
                    <PipelineVignette :order="1" :intensity="abstract.vignetteIntensity" />
                  </template>
                  <template v-else-if="activeAbstract === 'water'">
                    <PipelineWater
                      :order="0"
                      :color-deep="abstract.waterDeep"
                      :color-shallow="abstract.waterShallow"
                      :frequency="abstract.waterFrequency"
                      :speed="abstract.waterSpeed"
                    />
                    <PipelineVignette :order="1" :intensity="abstract.vignetteIntensity" />
                  </template>
                </template>

                <!-- ══ GLOBAL GRAIN OVERLAY (order 99 — always last) ═══════ -->
                <template v-if="grainEnabled" :key="grainKey">
                  <PipelineGrain
                    v-if="grainState.type === 'fine'"
                    :order="99"
                    :intensity="grainState.intensity"
                    :animated="grainState.animated"
                    :fps="grainState.fps"
                    :blend-mode="grainState.blendMode"
                  />
                  <PipelineFilmGrain
                    v-else-if="grainState.type === 'film'"
                    :order="99"
                    :intensity="grainState.intensity"
                    :fps="grainState.fps"
                    :blend-mode="grainState.blendMode"
                  />
                  <PipelineRisographGrain
                    v-else-if="grainState.type === 'riso'"
                    :order="99"
                    :scale="grainState.scale"
                    :strength="grainState.strength"
                    :fps="grainState.fps"
                    :blend-mode="grainState.blendMode"
                  />
                </template>
              </div>

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

      <!-- Right panel -->
      <div class="w-80 shrink-0 border-l border-white/8 flex flex-col overflow-hidden">
        <!-- Category tabs -->
        <div class="flex gap-1 px-4 pt-4 pb-3 border-b border-white/5 flex-wrap">
          <button
            v-for="cat in bgCategories"
            :key="cat.id"
            class="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap"
            :class="
              activeCategory === cat.id
                ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            "
            @click="activeCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Scrollable content: presets + controls -->
        <div class="flex-1 overflow-y-auto p-4 space-y-5">
          <!-- Preset grid -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-white/30 mb-2">Presets</p>

            <!-- Gradients -->
            <div v-if="activeCategory === 'gradients'" class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in gradientPresets"
                :key="p.id"
                class="px-2 py-2 rounded-lg text-xs text-center transition-all leading-tight"
                :class="
                  activeGrad === p.id
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40'
                    : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8'
                "
                @click="activeGrad = p.id"
              >
                {{ p.label }}
              </button>
            </div>

            <!-- Mesh -->
            <div v-else-if="activeCategory === 'mesh'" class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in meshPresets"
                :key="p.id"
                class="px-2 py-2 rounded-lg text-xs text-center transition-all leading-tight"
                :class="
                  activeMesh === p.id
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40'
                    : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8'
                "
                @click="activeMesh = p.id"
              >
                {{ p.label }}
              </button>
            </div>

            <!-- Animated -->
            <div v-else-if="activeCategory === 'animated'" class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in animatedPresets"
                :key="p.id"
                class="px-2 py-2 rounded-lg text-xs text-center transition-all leading-tight"
                :class="
                  activeAnim === p.id
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40'
                    : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8'
                "
                @click="activeAnim = p.id"
              >
                {{ p.label }}
              </button>
            </div>

            <!-- Noise BG -->
            <div v-else-if="activeCategory === 'noise_bg'" class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in noiseBgPresets"
                :key="p.id"
                class="px-2 py-2 rounded-lg text-xs text-center transition-all leading-tight"
                :class="
                  activeNoiseBg === p.id
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40'
                    : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8'
                "
                @click="activeNoiseBg = p.id"
              >
                {{ p.label }}
              </button>
            </div>

            <!-- Atmospheric -->
            <div v-else-if="activeCategory === 'atmospheric'" class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in atmosphericPresets"
                :key="p.id"
                class="px-2 py-2 rounded-lg text-xs text-center transition-all leading-tight"
                :class="
                  activeAtmo === p.id
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40'
                    : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8'
                "
                @click="activeAtmo = p.id"
              >
                {{ p.label }}
              </button>
            </div>

            <!-- Abstract -->
            <div v-else-if="activeCategory === 'abstract'" class="grid grid-cols-3 gap-1.5">
              <button
                v-for="p in abstractPresets"
                :key="p.id"
                class="px-2 py-2 rounded-lg text-xs text-center transition-all leading-tight"
                :class="
                  activeAbstract === p.id
                    ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40'
                    : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8'
                "
                @click="activeAbstract = p.id"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <div class="h-px bg-white/5" />

          <!-- Controls for selected preset -->
          <div class="space-y-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-violet-400">
              {{ activePresetLabel }}
            </p>

            <!-- ── Gradient controls ── -->
            <template v-if="activeCategory === 'gradients'">
              <template v-if="activeGrad === 'radial'">
                <DemoColorRow label="Center" v-model="grad.colorCenter" />
                <DemoColorRow label="Edge" v-model="grad.colorA" />
                <DemoSliderRow
                  label="Radius"
                  :min="0.3"
                  :max="2"
                  :step="0.05"
                  v-model="grad.radius"
                />
              </template>
              <template v-else-if="activeGrad === 'focal'">
                <DemoColorRow label="Color A" v-model="grad.colorA" />
                <DemoColorRow label="Color B" v-model="grad.colorB" />
                <DemoSliderRow
                  label="Focal X"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="grad.focalX"
                />
                <DemoSliderRow
                  label="Focal Y"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="grad.focalY"
                />
                <DemoSliderRow
                  label="Radius"
                  :min="0.3"
                  :max="2"
                  :step="0.05"
                  v-model="grad.radius"
                />
              </template>
              <template v-else-if="activeGrad === 'conic'">
                <DemoColorRow label="Color A" v-model="grad.colorA" />
                <DemoColorRow label="Color B" v-model="grad.colorB" />
                <DemoSliderRow
                  label="Rotation"
                  :min="0"
                  :max="360"
                  :step="5"
                  v-model="grad.rotation"
                />
              </template>
              <template
                v-else-if="
                  activeGrad !== 'sunrise' &&
                  activeGrad !== 'pastel' &&
                  activeGrad !== 'sunset' &&
                  activeGrad !== 'ocean'
                "
              >
                <DemoColorRow label="Color A" v-model="grad.colorA" />
                <DemoColorRow label="Color B" v-model="grad.colorB" />
              </template>
              <template v-if="activeGrad === 'ocean' || activeGrad === 'sunset'">
                <DemoSliderRow
                  label="Vignette"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="grad.vignetteIntensity"
                />
              </template>
            </template>

            <!-- ── Mesh gradient controls ── -->
            <template v-else-if="activeCategory === 'mesh'">
              <template
                v-if="
                  activeMesh === 'classic' || activeMesh === 'organic' || activeMesh === 'warped'
                "
              >
                <DemoColorRow label="Bottom Left" v-model="mesh.bl" />
                <DemoColorRow label="Bottom Right" v-model="mesh.br" />
                <DemoColorRow label="Top Left" v-model="mesh.tl" />
                <DemoColorRow label="Top Right" v-model="mesh.tr" />
              </template>
              <template
                v-else-if="
                  activeMesh === 'grainient' ||
                  activeMesh === 'noisy' ||
                  activeMesh === 'full-grainient' ||
                  activeMesh === 'multi-focal'
                "
              >
                <DemoColorRow label="Color A" v-model="mesh.bl" />
                <DemoColorRow label="Color B" v-model="mesh.tr" />
              </template>
              <template v-if="activeMesh === 'organic' || activeMesh === 'warped'">
                <div class="h-px bg-white/5" />
                <DemoSliderRow
                  label="Warp Strength"
                  :min="0"
                  :max="0.8"
                  :step="0.05"
                  v-model="mesh.warpStrength"
                />
                <DemoSliderRow
                  label="Warp Scale"
                  :min="0.5"
                  :max="5"
                  :step="0.25"
                  v-model="mesh.warpScale"
                />
                <DemoSliderRow
                  label="Warp Speed"
                  :min="0"
                  :max="0.5"
                  :step="0.01"
                  v-model="mesh.warpSpeed"
                />
              </template>
              <template
                v-if="
                  activeMesh === 'noisy' || activeMesh === 'warped' || activeMesh === 'grainient'
                "
              >
                <div class="h-px bg-white/5" />
                <DemoSliderRow
                  label="Noise Scale"
                  :min="0.5"
                  :max="5"
                  :step="0.25"
                  v-model="mesh.noiseScale"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="0.5"
                  :step="0.01"
                  v-model="mesh.speed"
                />
              </template>
              <template v-if="activeMesh === 'full-grainient'">
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="0.5"
                  :step="0.01"
                  v-model="mesh.speed"
                />
              </template>
            </template>

            <!-- ── Animated controls ── -->
            <template v-else-if="activeCategory === 'animated'">
              <template v-if="activeAnim === 'flowing' || activeAnim === 'shifting'">
                <DemoColorRow label="Color A" v-model="anim.colorA" />
                <DemoColorRow label="Color B" v-model="anim.colorB" />
              </template>
              <template v-else-if="activeAnim === 'wave-colour'">
                <DemoColorRow label="Base A" v-model="anim.colorA" />
                <DemoColorRow label="Base B" v-model="anim.colorB" />
                <DemoColorRow label="Wave Color" v-model="anim.waveColor" />
                <DemoSliderRow
                  label="Wave Opacity"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  v-model="anim.waveOpacity"
                />
                <DemoSliderRow
                  label="Frequency"
                  :min="1"
                  :max="8"
                  :step="0.5"
                  v-model="anim.waveFreq"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="2"
                  :step="0.1"
                  v-model="anim.waveSpeed"
                />
              </template>
              <template v-else-if="activeAnim === 'sine-warp'">
                <DemoColorRow label="Color A" v-model="anim.colorA" />
                <DemoColorRow label="Color B" v-model="anim.colorB" />
                <DemoSliderRow
                  label="Frequency"
                  :min="1"
                  :max="15"
                  :step="0.5"
                  v-model="anim.warpFreq"
                />
                <DemoSliderRow
                  label="Amplitude"
                  :min="5"
                  :max="80"
                  :step="1"
                  v-model="anim.warpAmp"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  v-model="anim.warpSpeed"
                />
              </template>
              <template v-else-if="activeAnim === 'fbm-flow'">
                <DemoSliderRow
                  label="Scale"
                  :min="1"
                  :max="10"
                  :step="0.5"
                  v-model="anim.fbmScale"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="0.5"
                  :step="0.01"
                  v-model="anim.fbmSpeed"
                />
                <DemoSliderRow
                  label="Octaves"
                  :min="1"
                  :max="8"
                  :step="1"
                  v-model="anim.fbmOctaves"
                />
              </template>
              <template v-else-if="activeAnim === 'aurora-grad'">
                <DemoColorRow label="Aurora A" v-model="anim.auroraColorA" />
                <DemoColorRow label="Aurora B" v-model="anim.auroraColorB" />
                <DemoSliderRow
                  label="Band Y"
                  :min="0.2"
                  :max="0.9"
                  :step="0.01"
                  v-model="anim.auroraBandY"
                />
                <DemoSliderRow
                  label="Intensity"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  v-model="anim.auroraIntensity"
                />
              </template>
              <template v-else-if="activeAnim === 'noisy-linear' || activeAnim === 'turbulent'">
                <DemoColorRow label="Color A" v-model="anim.colorA" />
                <DemoColorRow label="Color B" v-model="anim.colorB" />
                <DemoSliderRow
                  label="Scale"
                  :min="1"
                  :max="10"
                  :step="0.5"
                  v-model="anim.fbmScale"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="0.5"
                  :step="0.01"
                  v-model="anim.fbmSpeed"
                />
              </template>
            </template>

            <!-- ── Noise BG controls ── -->
            <template v-else-if="activeCategory === 'noise_bg'">
              <DemoSliderRow label="Scale" :min="1" :max="10" :step="0.5" v-model="noiseBg.scale" />
              <DemoSliderRow
                label="Speed"
                :min="0"
                :max="0.5"
                :step="0.01"
                v-model="noiseBg.speed"
              />
              <DemoSliderRow
                v-if="activeNoiseBg === 'fbm-classic'"
                label="Octaves"
                :min="1"
                :max="8"
                :step="1"
                v-model="noiseBg.octaves"
              />
              <template v-if="activeNoiseBg === 'curl-noise' || activeNoiseBg === 'billow'">
                <DemoSliderRow
                  label="Hue Shift"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="noiseBg.hue"
                />
              </template>
              <template v-if="activeNoiseBg === 'simplex'">
                <DemoSliderRow
                  label="Brightness"
                  :min="-0.5"
                  :max="0.5"
                  :step="0.01"
                  v-model="noiseBg.brightness"
                />
                <DemoSliderRow
                  label="Contrast"
                  :min="0.5"
                  :max="2.5"
                  :step="0.05"
                  v-model="noiseBg.contrast"
                />
              </template>
              <DemoSliderRow
                label="Vignette"
                :min="0"
                :max="1"
                :step="0.01"
                v-model="noiseBg.vignetteIntensity"
              />
            </template>

            <!-- ── Atmospheric controls ── -->
            <template v-else-if="activeCategory === 'atmospheric'">
              <template v-if="activeAtmo === 'night-sky' || activeAtmo === 'aurora-only'">
                <DemoColorRow label="Aurora A" v-model="atmo.auroraColorA" />
                <DemoColorRow label="Aurora B" v-model="atmo.auroraColorB" />
                <DemoSliderRow
                  label="Band Y"
                  :min="0.2"
                  :max="0.9"
                  :step="0.01"
                  v-model="atmo.auroraBandY"
                />
                <DemoSliderRow
                  label="Band Height"
                  :min="0.05"
                  :max="0.6"
                  :step="0.01"
                  v-model="atmo.auroraBandHeight"
                />
                <DemoSliderRow
                  label="Intensity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="atmo.auroraIntensity"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  v-model="atmo.auroraSpeed"
                />
              </template>
              <template v-if="activeAtmo === 'night-sky'">
                <div class="h-px bg-white/5" />
                <DemoSliderRow
                  label="Star Density"
                  :min="20"
                  :max="200"
                  :step="5"
                  v-model="atmo.starDensity"
                />
                <DemoSliderRow
                  label="Star Brightness"
                  :min="0.1"
                  :max="2"
                  :step="0.05"
                  v-model="atmo.starBrightness"
                />
                <DemoSliderRow
                  label="Haze Reach"
                  :min="0"
                  :max="0.7"
                  :step="0.01"
                  v-model="atmo.hazeReach"
                />
                <DemoSliderRow
                  label="Haze Intensity"
                  :min="0"
                  :max="0.6"
                  :step="0.01"
                  v-model="atmo.hazeIntensity"
                />
              </template>
              <template v-else-if="activeAtmo === 'day-sky'">
                <DemoSliderRow
                  label="Sun Height"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="atmo.sunDirectionY"
                />
              </template>
              <template v-else-if="activeAtmo === 'day-night'">
                <DemoSliderRow
                  label="Cycle Speed"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="atmo.dayNightSpeed"
                />
              </template>
              <template v-else-if="activeAtmo === 'deep-space'">
                <DemoSliderRow
                  label="Star Density"
                  :min="50"
                  :max="300"
                  :step="10"
                  v-model="atmo.starDensity"
                />
                <DemoSliderRow
                  label="Star Brightness"
                  :min="0.5"
                  :max="3"
                  :step="0.1"
                  v-model="atmo.starBrightness"
                />
              </template>
            </template>

            <!-- ── Abstract controls ── -->
            <template v-else-if="activeCategory === 'abstract'">
              <template v-if="activeAbstract === 'tunnel'">
                <DemoColorRow label="Color A" v-model="abstract.tunnelColorA" />
                <DemoColorRow label="Color B" v-model="abstract.tunnelColorB" />
                <DemoSliderRow
                  label="Radius"
                  :min="0.3"
                  :max="1.5"
                  :step="0.05"
                  v-model="abstract.tunnelRadius"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="3"
                  :step="0.1"
                  v-model="abstract.tunnelSpeed"
                />
              </template>
              <template v-else-if="activeAbstract === 'complex'">
                <DemoSliderRow
                  label="Pole Angle"
                  :min="0"
                  :max="6.28"
                  :step="0.05"
                  v-model="abstract.complexPoleAngle"
                />
                <DemoSliderRow
                  label="Pole Distance"
                  :min="0.1"
                  :max="1"
                  :step="0.01"
                  v-model="abstract.complexPoleDistance"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="0.3"
                  :step="0.005"
                  v-model="abstract.complexSpeed"
                />
              </template>
              <template v-else-if="activeAbstract === 'marble'">
                <DemoColorRow label="Base" v-model="abstract.marbleColorA" />
                <DemoColorRow label="Veins" v-model="abstract.marbleColorB" />
                <DemoSliderRow
                  label="Frequency"
                  :min="1"
                  :max="15"
                  :step="0.5"
                  v-model="abstract.marbleFrequency"
                />
              </template>
              <template v-else-if="activeAbstract === 'wood'">
                <DemoSliderRow
                  label="Ring Frequency"
                  :min="4"
                  :max="30"
                  :step="1"
                  v-model="abstract.woodRingFrequency"
                />
                <DemoSliderRow
                  label="Noise Strength"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  v-model="abstract.woodNoiseStrength"
                />
              </template>
              <template v-else-if="activeAbstract === 'flame'">
                <DemoColorRow label="Base" v-model="abstract.flameColorBase" />
                <DemoColorRow label="Tip" v-model="abstract.flameColorTip" />
              </template>
              <template v-else-if="activeAbstract === 'water'">
                <DemoColorRow label="Deep" v-model="abstract.waterDeep" />
                <DemoColorRow label="Shallow" v-model="abstract.waterShallow" />
                <DemoSliderRow
                  label="Frequency"
                  :min="2"
                  :max="20"
                  :step="0.5"
                  v-model="abstract.waterFrequency"
                />
                <DemoSliderRow
                  label="Speed"
                  :min="0"
                  :max="3"
                  :step="0.1"
                  v-model="abstract.waterSpeed"
                />
              </template>
              <template v-if="activeAbstract !== 'tunnel' && activeAbstract !== 'complex'">
                <DemoSliderRow
                  label="Vignette"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  v-model="abstract.vignetteIntensity"
                />
              </template>
            </template>

            <!-- ── Grain overlay ── -->
            <div class="h-px bg-white/5" />
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wider text-white/30">
                  Grain Overlay
                </p>
                <button
                  class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
                  :class="
                    grainEnabled
                      ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40'
                      : 'bg-white/5 text-white/40 hover:text-white/70'
                  "
                  @click="grainEnabled = !grainEnabled"
                >
                  {{ grainEnabled ? 'On' : 'Off' }}
                </button>
              </div>
              <template v-if="grainEnabled">
                <!-- Type -->
                <div>
                  <p class="text-xs text-white/30 font-medium mb-1.5">Type</p>
                  <div class="flex gap-1">
                    <button
                      v-for="t in [
                        { id: 'fine', label: 'Fine' },
                        { id: 'film', label: 'Film' },
                        { id: 'riso', label: 'Riso' },
                      ]"
                      :key="t.id"
                      class="flex-1 py-1 rounded-lg text-xs font-medium transition-all"
                      :class="
                        grainState.type === t.id
                          ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40'
                          : 'bg-white/5 text-white/40 hover:text-white/70'
                      "
                      @click="grainState.type = t.id as typeof grainState.type"
                    >
                      {{ t.label }}
                    </button>
                  </div>
                </div>
                <!-- Blend mode -->
                <div>
                  <p class="text-xs text-white/30 font-medium mb-1.5">Blend Mode</p>
                  <div class="flex gap-1 flex-wrap">
                    <button
                      v-for="m in [
                        { id: 'add', label: 'Add' },
                        { id: 'sub', label: 'Sub' },
                        { id: 'screen', label: 'Screen' },
                        { id: 'overlay', label: 'Overlay' },
                        { id: 'soft-light', label: 'Soft' },
                      ]"
                      :key="m.id"
                      class="px-2 py-1 rounded-lg text-xs font-medium transition-all"
                      :class="
                        grainState.blendMode === m.id
                          ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40'
                          : 'bg-white/5 text-white/40 hover:text-white/70'
                      "
                      @click="grainState.blendMode = m.id as typeof grainState.blendMode"
                    >
                      {{ m.label }}
                    </button>
                  </div>
                </div>
                <DemoSliderRow
                  label="Intensity"
                  :min="0.01"
                  :max="0.3"
                  :step="0.005"
                  v-model="grainState.intensity"
                />
                <DemoSliderRow label="FPS" :min="6" :max="60" :step="1" v-model="grainState.fps" />
                <template v-if="grainState.type === 'riso'">
                  <DemoSliderRow
                    label="Scale"
                    :min="0.1"
                    :max="2"
                    :step="0.05"
                    v-model="grainState.scale"
                  />
                  <DemoSliderRow
                    label="Strength"
                    :min="0.01"
                    :max="0.5"
                    :step="0.01"
                    v-model="grainState.strength"
                  />
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
