<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { useWindowSize } from '@vueuse/core'
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
    /** Background clear color */
    clearColor?: string
    /** Tone mapping algorithm */
    toneMapping?: 'aces' | 'reinhard' | 'cineon' | 'linear'
    /** Output color space */
    outputColorSpace?: 'srgb' | 'linear'
    /** Enable antialiasing */
    antialias?: boolean
    /** Transparent canvas */
    alpha?: boolean
    /** Enable zoom controls (via scroll/pinch) */
    enableZoom?: boolean
    /** Enable pan controls (via drag) */
    enablePan?: boolean
    /** Enable rotation controls */
    enableRotate?: boolean
    /** Enable any camera controls */
    enableControls?: boolean
    /** Fixed position (no parallax/scroll effects) */
    fixed?: boolean
    /** Z-index for the background */
    zIndex?: number
    /** Pointer events on the canvas */
    pointerEvents?: 'none' | 'auto'
  }>(),
  {
    clearColor: '#000000',
    toneMapping: 'aces',
    outputColorSpace: 'srgb',
    antialias: true,
    alpha: false,
    enableZoom: false,
    enablePan: false,
    enableRotate: false,
    enableControls: false,
    fixed: true,
    zIndex: -1,
    pointerEvents: 'none',
  }
)

const emit = defineEmits<{
  ready: [context: unknown]
}>()

const config = useAppConfig()
const shaderConfig = (config.shader || {}) as {
  toneMapping?: string
  maxPixelRatio?: number
}

const { width, height } = useWindowSize()

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
  if (!import.meta.client) return 1
  const configDpr = shaderConfig.maxPixelRatio ?? 2
  return Math.min(window.devicePixelRatio, configDpr)
})

// Calculate plane size to cover viewport
const planeSize = computed(() => {
  // Calculate based on camera FOV and distance
  // With camera at z=1 and FOV of 75 degrees, this fills the viewport
  const fov = 75 * (Math.PI / 180)
  const cameraZ = 1
  const planeHeight = 2 * Math.tan(fov / 2) * cameraZ
  const aspectRatio = width.value / (height.value || 1)
  return {
    width: planeHeight * aspectRatio * 1.1, // Slight overflow to prevent edges
    height: planeHeight * 1.1,
  }
})

const containerStyle = computed<Record<string, string | number>>(() => ({
  position: props.fixed ? 'fixed' : 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: props.zIndex,
  pointerEvents: props.pointerEvents,
  overflow: 'hidden',
}))

function onReady(context: unknown) {
  emit('ready', context)
}

// Expose plane size for child components
provide('shaderBackgroundPlaneSize', planeSize)
</script>

<template>
  <div class="shader-background" :style="containerStyle">
    <TresCanvas
      :clear-color
      :tone-mapping="resolvedToneMapping"
      :output-color-space="resolvedColorSpace"
      :antialias
      :alpha
      :dpr="maxDpr"
      window-size
      @ready="onReady"
    >
      <TresPerspectiveCamera :position="[0, 0, 1]" :fov="75" />

      <OrbitControls v-if="enableControls" :enable-zoom :enable-pan :enable-rotate />

      <TresMesh :position="[0, 0, 0]">
        <TresPlaneGeometry :args="[planeSize.width, planeSize.height, 1, 1]" />
        <slot />
      </TresMesh>
    </TresCanvas>
  </div>
</template>

<style scoped>
/* stylelint-disable selector-pseudo-class-no-unknown */
.shader-background {
  contain: strict;
}

.shader-background :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
