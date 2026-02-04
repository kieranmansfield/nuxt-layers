<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import type { ToneMapping } from 'three'
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  SRGBColorSpace,
} from 'three'

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
