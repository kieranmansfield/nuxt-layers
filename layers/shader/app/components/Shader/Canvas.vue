<script setup lang="ts">
// @ts-nocheck - Three.js WebGPU types + TresJS renderer factory
import { TresCanvas } from '@tresjs/core'
import type { ToneMapping } from 'three'
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  Color,
  LinearToneMapping,
  ReinhardToneMapping,
  SRGBColorSpace,
} from 'three'
import { WebGPURenderer } from 'three/webgpu'

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    clearColor: '#000000',
    toneMapping: 'aces',
    outputColorSpace: 'srgb',
    shadows: false,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
    windowSize: true,
    webgpu: false,
  }
)

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
  const key = props.toneMapping || shaderConfig.toneMapping || 'aces'
  return toneMappingMap[key] ?? ACESFilmicToneMapping
})

const resolvedColorSpace = computed(() => {
  return props.outputColorSpace === 'srgb' ? SRGBColorSpace : 'srgb-linear'
})

const maxDpr = computed(() => {
  const configDpr = shaderConfig.maxPixelRatio ?? 2
  return Math.min(window.devicePixelRatio, configDpr)
})

// WebGPU renderer factory — TresJS v5 calls renderer.init() automatically
// when the returned object has isRenderer === true (three/webgpu Renderer base class)
const webgpuRendererFactory = props.webgpu
  ? ({ canvas }: { canvas: any }) => {
      const r = new WebGPURenderer({
        canvas: unref(canvas),
        antialias: props.antialias,
        powerPreference: props.powerPreference,
      })
      r.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr.value))
      r.setClearColor(new Color(props.clearColor))
      r.toneMapping = resolvedToneMapping.value
      r.outputColorSpace = resolvedColorSpace.value
      return r
    }
  : undefined

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
    :renderer="webgpuRendererFactory"
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
