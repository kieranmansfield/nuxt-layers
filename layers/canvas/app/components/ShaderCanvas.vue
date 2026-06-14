<script setup lang="ts">
  import { TresCanvas } from '@tresjs/core'
  import {
    ACESFilmicToneMapping,
    CineonToneMapping,
    Color,
    LinearToneMapping,
    ReinhardToneMapping,
    SRGBColorSpace,
    type ToneMapping,
  } from 'three'
  import { WebGPURenderer } from 'three/webgpu'

  const {
    clearColor = '#000000',
    toneMapping = 'aces',
    outputColorSpace = 'srgb',
    shadows = false,
    antialias = true,
    alpha = false,
    preserveDrawingBuffer = false,
    powerPreference = 'high-performance',
    windowSize = true,
    webgpu = false,
  } = defineProps<{
    clearColor?: string
    toneMapping?: 'aces' | 'reinhard' | 'cineon' | 'linear'
    outputColorSpace?: 'srgb' | 'linear'
    shadows?: boolean
    antialias?: boolean
    alpha?: boolean
    preserveDrawingBuffer?: boolean
    powerPreference?: 'default' | 'high-performance' | 'low-power'
    windowSize?: boolean
    /** Use WebGPURenderer (required for node materials / TSL shaders) */
    webgpu?: boolean
  }>()

  const emit = defineEmits<{
    ready: [context: any]
  }>()

  const config = useAppConfig()
  const shaderConfig = (config.shader || {}) as {
    toneMapping?: string
    maxPixelRatio?: number
  }

  const toneMappingMap: Record<string, ToneMapping> = {
    aces: ACESFilmicToneMapping,
    reinhard: ReinhardToneMapping,
    cineon: CineonToneMapping,
    linear: LinearToneMapping,
  }

  const resolvedToneMapping = computed(() => {
    const key = toneMapping || shaderConfig.toneMapping || 'aces'
    return toneMappingMap[key] ?? ACESFilmicToneMapping
  })

  const resolvedColorSpace = computed(() => {
    return outputColorSpace === 'srgb' ? SRGBColorSpace : 'srgb-linear'
  })

  const maxDpr = computed(() => {
    const configDpr = shaderConfig.maxPixelRatio ?? 2
    return Math.min(window.devicePixelRatio, configDpr)
  })

  // WebGPU renderer factory — TresJS v5 calls renderer.init() automatically
  // when the returned object has isRenderer === true (three/webgpu Renderer base class)
  function webgpuRendererFactory({ canvas }: { canvas: any }) {
    const r = new WebGPURenderer({
      canvas: unref(canvas),
      antialias,
      // WebGPU has no 'default' power preference — omit to let the browser decide
      ...(powerPreference === 'default' ? {} : { powerPreference }),
    })
    r.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr.value))
    r.setClearColor(new Color(clearColor))
    r.toneMapping = resolvedToneMapping.value
    r.outputColorSpace = resolvedColorSpace.value
    return r
  }

  const rendererBinding = computed(() => (webgpu ? { renderer: webgpuRendererFactory } : {}))

  function onReady(context: any) {
    emit('ready', context)
  }
</script>

<template>
  <TresCanvas
    :clear-color
    :tone-mapping="resolvedToneMapping"
    :output-color-space="resolvedColorSpace"
    :shadows
    :antialias
    :alpha
    :preserve-drawing-buffer
    :power-preference
    :window-size
    :dpr="maxDpr"
    v-bind="rendererBinding"
    class="shader-canvas"
    @ready="onReady"
  >
    <slot />
  </TresCanvas>
</template>

<style scoped>
  .shader-canvas {
    width: 100%;
    height: 100%;
  }
</style>
