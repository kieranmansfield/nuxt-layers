// Shared state, presets and copy-code builder for the two shader background demo pages
// (`shader-background`, `shader-pipeline-background`). Each page supplies its own default
// overrides and extra abstract presets (+ their blocks); everything else is common.

export type PipelineBgCategory =
  | 'gradients'
  | 'mesh'
  | 'animated'
  | 'noise_bg'
  | 'atmospheric'
  | 'abstract'

type PresetOption = { id: string; label: string }

function fmtN(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export function useShaderBackgroundDemo<
  G extends { colorB: string; vignetteIntensity: number },
  M extends { warpSpeed: number; speed: number },
  A extends object,
>(opts: { grad: G; mesh: M; abstract: A; abstractPresets: PresetOption[] }) {
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
    colorCenter: '#ffffff',
    colorEdge: '#000033',
    rotation: 0,
    radius: 0.7,
    focalX: 0.3,
    focalY: 0.35,
    ...opts.grad,
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
    noiseScale: 2,
    noiseStrength: 0.3,
    ...opts.mesh,
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

  // ── Abstract (page supplies its own presets beyond tunnel + complex) ──
  const abstractPresets = [
    { id: 'tunnel', label: 'Tunnel' },
    { id: 'complex', label: 'Complex Plane' },
    ...opts.abstractPresets,
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
    ...opts.abstract,
  })

  const activeIds = computed<Record<PipelineBgCategory, string>>(() => ({
    gradients: activeGrad.value,
    mesh: activeMesh.value,
    animated: activeAnim.value,
    noise_bg: activeNoiseBg.value,
    atmospheric: activeAtmo.value,
    abstract: activeAbstract.value,
  }))

  const presetsByCategory: Record<PipelineBgCategory, PresetOption[]> = {
    gradients: gradientPresets,
    mesh: meshPresets,
    animated: animatedPresets,
    noise_bg: noiseBgPresets,
    atmospheric: atmosphericPresets,
    abstract: abstractPresets,
  }

  function presetLabel(cat: PipelineBgCategory): string {
    return presetsByCategory[cat].find((p) => p.id === activeIds.value[cat])?.label ?? ''
  }

  /** Copy-code blocks for the presets both pages share, by category then preset id. */
  const sharedBlockBuilders: Record<PipelineBgCategory, Record<string, () => string[]>> = {
    gradients: {
      'linear-h': () => [
        `<PipelineLinearGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" axis="x" />`,
      ],
      'linear-v': () => [
        `<PipelineLinearGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" axis="y" />`,
      ],
      'diagonal-45': () => [
        `<PipelineDiagonalGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :angle="45" />`,
      ],
      'diagonal-135': () => [
        `<PipelineDiagonalGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :angle="135" />`,
      ],
      radial: () => [
        `<PipelineRadialGradient :order="0" color-center="${grad.colorCenter}" color-edge="${grad.colorA}" :radius="${fmtN(grad.radius)}" />`,
      ],
      focal: () => [
        `<PipelineFocalGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :focal="[${fmtN(grad.focalX)}, ${fmtN(grad.focalY)}]" :radius="${fmtN(grad.radius)}" />`,
      ],
      conic: () => [
        `<PipelineConicGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" :rotation="${grad.rotation}" />`,
      ],
      diamond: () => [
        `<PipelineDiamondGradient :order="0" color-a="${grad.colorA}" color-b="${grad.colorB}" />`,
      ],
      sunrise: () => [
        '<PipelineLinearGradient :order="0" color-a="#ff6600" color-b="#ffcc44" axis="y" />',
      ],
      ocean: () => [
        '<PipelineLinearGradient :order="0" color-a="#003366" color-b="#66aacc" axis="y" />',
        `<PipelineVignette :order="1" :intensity="${fmtN(grad.vignetteIntensity)}" />`,
      ],
      pastel: () => [
        '<PipelineRadialGradient :order="0" color-center="#ffd6e0" color-edge="#b8d4f8" :radius="0.9" />',
      ],
      sunset: () => [
        '<PipelineDiagonalGradient :order="0" color-a="#ff4400" color-b="#ff9900" :angle="135" />',
        `<PipelineVignette :order="1" :intensity="${fmtN(grad.vignetteIntensity)}" />`,
      ],
    },
    mesh: {
      classic: () => [
        `<PipelineBilinearGradient :order="0" bottom-left="${mesh.bl}" bottom-right="${mesh.br}" top-left="${mesh.tl}" top-right="${mesh.tr}" />`,
      ],
      warm: () => [
        '<PipelineBilinearGradient :order="0" bottom-left="#ff6600" bottom-right="#ffcc00" top-left="#cc2200" top-right="#ff9944" />',
      ],
      cool: () => [
        '<PipelineBilinearGradient :order="0" bottom-left="#001166" bottom-right="#0044cc" top-left="#220066" top-right="#4400aa" />',
      ],
      pastel: () => [
        '<PipelineBilinearGradient :order="0" bottom-left="#ffd6e0" bottom-right="#d6f0ff" top-left="#e8d6ff" top-right="#d6ffe8" />',
      ],
      organic: () => [
        `<PipelineUVNoiseWarp :order="0" :strength="${fmtN(mesh.warpStrength)}" :scale="${fmtN(mesh.warpScale)}" :speed="${fmtN(mesh.warpSpeed)}" />`,
        `<PipelineBilinearGradient :order="0" bottom-left="${mesh.bl}" bottom-right="${mesh.br}" top-left="${mesh.tl}" top-right="${mesh.tr}" />`,
      ],
      grainient: () => [
        `<PipelineUVNoiseRotate :order="0" :scale="${fmtN(mesh.warpScale)}" :speed="${fmtN(mesh.warpSpeed)}" />`,
        `<PipelineRotatedGradientBlend :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :noise-scale="${fmtN(mesh.noiseScale)}" :speed="${fmtN(mesh.speed)}" />`,
      ],
      noisy: () => [
        `<PipelineNoisyGradient :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :noise-scale="${fmtN(mesh.noiseScale)}" :noise-strength="${fmtN(mesh.noiseStrength)}" :speed="${fmtN(mesh.speed)}" />`,
      ],
      'full-grainient': () => [
        `<PipelineNoisyGradientBlend :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :speed="${fmtN(mesh.speed)}" />`,
      ],
      'multi-focal': () => [
        `<PipelineFocalGradient :order="0" color-a="${mesh.bl}" color-b="${mesh.br}" :focal="[0.25, 0.35]" />`,
        `<PipelineFocalGradient :order="0" color-a="${mesh.tl}" color-b="${mesh.tr}" :focal="[0.75, 0.65]" />`,
      ],
      warped: () => [
        `<PipelineUVNoiseWarp :order="0" :strength="${fmtN(mesh.warpStrength)}" :scale="${fmtN(mesh.warpScale)}" :speed="${fmtN(mesh.warpSpeed)}" />`,
        `<PipelineNoisyGradient :order="0" color-a="${mesh.bl}" color-b="${mesh.tr}" :noise-scale="${fmtN(mesh.noiseScale)}" :noise-strength="${fmtN(mesh.noiseStrength)}" :speed="${fmtN(mesh.speed)}" />`,
      ],
    },
    animated: {
      flowing: () => [
        `<PipelineNoisyGradientBlend :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" :speed="0.2" />`,
      ],
      'wave-colour': () => [
        `<PipelineLinearGradient :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" axis="y" />`,
        `<PipelineWaveBendLayer :order="1" color="${anim.waveColor}" :opacity="${fmtN(anim.waveOpacity)}" :frequency="${fmtN(anim.waveFreq)}" :speed="${fmtN(anim.waveSpeed)}" />`,
        `<PipelineWaveBendLayer :order="2" color="${anim.colorA}" :opacity="0.5" :frequency="${fmtN(anim.waveFreq * 1.5)}" :speed="${fmtN(anim.waveSpeed * 0.7)}" />`,
      ],
      'sine-warp': () => [
        `<PipelineUVSineWarpXY :order="0" :frequency="${fmtN(anim.warpFreq)}" :amplitude="${fmtN(anim.warpAmp)}" :speed="${fmtN(anim.warpSpeed)}" />`,
        `<PipelineRotatedGradientBlend :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" />`,
      ],
      'noisy-linear': () => [
        `<PipelineNoisyGradient :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" :noise-scale="${fmtN(anim.fbmScale)}" :speed="${fmtN(anim.fbmSpeed)}" />`,
      ],
      turbulent: () => [
        '<PipelineUVNoiseWarp :order="0" :strength="0.4" :scale="2" :speed="0.3" />',
        `<PipelineBilinearGradient :order="0" bottom-left="${anim.colorA}" bottom-right="${anim.colorB}" top-left="#440088" top-right="#ff8844" />`,
      ],
      shifting: () => [
        `<PipelineNoisyGradientBlend :order="0" color-a="${anim.colorA}" color-b="${anim.colorB}" :speed="0.5" />`,
      ],
      'fbm-flow': () => [
        `<PipelineFBMNoise :order="0" :scale="${fmtN(anim.fbmScale)}" :speed="${fmtN(anim.fbmSpeed)}" :octaves="${anim.fbmOctaves}" color-a="#000000" color-b="#ffffff" />`,
        '<PipelineCosinePalette :order="1" scalar-source="prev" :time-scale="0.1" />',
      ],
      'aurora-grad': () => [
        '<PipelineLinearGradient :order="0" color-a="#030818" color-b="#0d1a30" axis="y" />',
        `<PipelineAurora :order="1" color-a="${anim.auroraColorA}" color-b="${anim.auroraColorB}" :band-y="${fmtN(anim.auroraBandY)}" :intensity="${fmtN(anim.auroraIntensity)}" />`,
        '<PipelineVignette :order="2" :intensity="0.4" />',
      ],
    },
    noise_bg: {
      'fbm-classic': () => [
        `<PipelineFBMNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" :octaves="${noiseBg.octaves}" color-a="#000000" color-b="#ffffff" />`,
        '<PipelineCosinePalette :order="1" scalar-source="prev" />',
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      'curl-noise': () => [
        `<PipelineCurlNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        `<PipelineHue :order="1" :shift="${fmtN(noiseBg.hue)}" />`,
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      'domain-warp': () => [
        `<PipelineDomainWarpedNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        '<PipelineDuoTone :order="1" shadow-color="#1a0033" highlight-color="#ffcc00" />',
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      voronoi: () => [
        `<PipelineVoronoiEdges :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        '<PipelineDuoTone :order="1" shadow-color="#0a0a1a" highlight-color="#6688ff" />',
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      billow: () => [
        `<PipelineBillowNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        `<PipelineHue :order="1" :shift="${fmtN(noiseBg.hue)}" />`,
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      ridged: () => [
        `<PipelineRidgedNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        '<PipelineSplitTone :order="1" shadow-color="#001166" highlight-color="#ffaa44" />',
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      cellular: () => [
        `<PipelineCellularNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        '<PipelineMonochromeTint :order="1" />',
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
      simplex: () => [
        `<PipelineSimplexNoise :order="0" :scale="${fmtN(noiseBg.scale)}" :speed="${fmtN(noiseBg.speed)}" />`,
        `<PipelineBrightnessContrast :order="1" :brightness="${fmtN(noiseBg.brightness)}" :contrast="${fmtN(noiseBg.contrast)}" />`,
        `<PipelineVignette :order="2" :intensity="${fmtN(noiseBg.vignetteIntensity)}" />`,
      ],
    },
    atmospheric: {
      'night-sky': () => [
        '<PipelineSolidColour :order="0" color="#020408" />',
        `<PipelineAurora :order="1" color-a="${atmo.auroraColorA}" color-b="${atmo.auroraColorB}" :band-y="${fmtN(atmo.auroraBandY)}" :band-height="${fmtN(atmo.auroraBandHeight)}" :intensity="${fmtN(atmo.auroraIntensity)}" :speed="${fmtN(atmo.auroraSpeed)}" />`,
        `<PipelineStarfield :order="2" :density="${atmo.starDensity}" :brightness="${fmtN(atmo.starBrightness)}" />`,
        `<PipelineHaze :order="3" color="${atmo.hazeColor}" :reach="${fmtN(atmo.hazeReach)}" :intensity="${fmtN(atmo.hazeIntensity)}" />`,
      ],
      'day-sky': () => [
        `<PipelineSkyAtmosphere :order="0" :sun-direction="[0.3, ${fmtN(atmo.sunDirectionY)}, 0.5]" />`,
      ],
      'day-night': () => [
        `<PipelineDayNightCycle :order="0" :speed="${fmtN(atmo.dayNightSpeed)}" />`,
      ],
      nebula: () => [
        '<PipelineSolidColour :order="0" color="#04010a" />',
        '<PipelineFBMNoise :order="1" :scale="3" :speed="0.05" :octaves="6" color-a="#04010a" color-b="#6600aa" />',
        '<PipelineGodRays :order="2" color="#aa44ff" :intensity="0.3" :ray-count="16" />',
        '<PipelineStarfield :order="3" :density="120" :brightness="1.2" />',
      ],
      'aurora-only': () => [
        `<PipelineLinearGradient :order="0" color-a="${atmo.gradColorA}" color-b="${atmo.gradColorB}" axis="y" />`,
        `<PipelineAurora :order="1" color-a="${atmo.auroraColorA}" color-b="${atmo.auroraColorB}" :band-y="${fmtN(atmo.auroraBandY)}" :band-height="${fmtN(atmo.auroraBandHeight)}" :intensity="${fmtN(atmo.auroraIntensity)}" :speed="${fmtN(atmo.auroraSpeed)}" />`,
        '<PipelineVignette :order="2" :intensity="0.5" />',
      ],
      'deep-space': () => [
        '<PipelineSolidColour :order="0" color="#000000" />',
        `<PipelineStarfield :order="1" :density="${atmo.starDensity * 2}" :brightness="${fmtN(atmo.starBrightness)}" :twinkle-speed="0.5" />`,
        '<PipelineFBMNoise :order="2" :scale="2" :speed="0.03" :octaves="4" color-a="#000000" color-b="#110033" />',
      ],
    },
    abstract: {
      tunnel: () => [
        `<PipelineRaymarchTunnel :order="0" :radius="${fmtN(abstract.tunnelRadius)}" :speed="${fmtN(abstract.tunnelSpeed)}" color-a="${abstract.tunnelColorA}" color-b="${abstract.tunnelColorB}" />`,
      ],
      complex: () => [
        `<PipelineComplexPlaneField :order="0" :pole-angle="${fmtN(abstract.complexPoleAngle)}" :pole-distance="${fmtN(abstract.complexPoleDistance)}" :speed="${fmtN(abstract.complexSpeed)}" />`,
        '<PipelineCosinePalette :order="1" scalar-source="prev" />',
        '<PipelineACESTonemap :order="2" />',
      ],
    },
  }

  /** Copy-code blocks for the presets both pages share; [] for page-specific ones. */
  function sharedBlocks(cat: PipelineBgCategory): string[] {
    return sharedBlockBuilders[cat][activeIds.value[cat]]?.() ?? []
  }

  function pipelineSnippet(blocks: string[]): string {
    return [
      '<ShaderPipelineContext>',
      '  <div class="hidden" aria-hidden="true">',
      ...blocks.map((b) => `    ${b}`),
      '  </div>',
      '  <ShaderCanvas :webgpu="true" />',
      '</ShaderPipelineContext>',
    ].join('\n')
  }

  const { copied, copy } = useClipboard({ copiedDuring: 2000 })

  return {
    // fallow-ignore-next-line code-duplication
    bgCategories,
    gradientPresets,
    activeGrad,
    grad,
    meshPresets,
    activeMesh,
    mesh,
    animatedPresets,
    activeAnim,
    anim,
    noiseBgPresets,
    activeNoiseBg,
    noiseBg,
    atmosphericPresets,
    activeAtmo,
    atmo,
    abstractPresets,
    activeAbstract,
    abstract,
    fmtN,
    presetLabel,
    sharedBlocks,
    pipelineSnippet,
    copied,
    copy,
  }
}
