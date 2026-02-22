<script setup lang="ts">
// @ts-nocheck - TSL types
import { add, mul, time, uniform, uv } from 'three/tsl'
import { cosinePalette } from '#layers/shader/app/shaders/common/palette'

const props = withDefaults(
  defineProps<{
    id?: string
    /** Cosine palette type or 'linear' for UV-based gradient */
    type?: 'rainbow' | 'sunset' | 'ocean' | 'fire' | 'ice' | 'neon' | 'pastel' | 'custom'
    speed?: number
    /** Custom brightness for cosine palette [r,g,b] */
    brightness?: [number, number, number]
    /** Custom contrast for cosine palette [r,g,b] */
    contrast?: [number, number, number]
    /** Custom frequency for cosine palette [r,g,b] */
    frequency?: [number, number, number]
    /** Custom phase for cosine palette [r,g,b] */
    phase?: [number, number, number]
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>(),
  {
    id: 'gradient',
    type: 'rainbow',
    speed: 0.1,
    brightness: () => [0.5, 0.5, 0.5],
    contrast: () => [0.5, 0.5, 0.5],
    frequency: () => [1.0, 1.0, 1.0],
    phase: () => [0.0, 0.33, 0.67],
    order: 0,
    blend: 'normal',
    opacity: 1.0,
  }
)

const graph = useShaderGraphContext()

const uSpeed = uniform(props.speed)

// Palette presets
const palettePresets: Record<string, [[number, number, number], [number, number, number], [number, number, number], [number, number, number]]> = {
  rainbow: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.0, 0.33, 0.67]],
  sunset: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 0.7, 0.4], [0.0, 0.15, 0.2]],
  ocean: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.3, 0.2, 0.2]],
  fire: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 0.5, 0.0], [0.0, 0.1, 0.2]],
  ice: [[0.5, 0.5, 0.5], [0.4, 0.4, 0.5], [0.0, 0.1, 0.2], [0.0, 0.0, 0.0]],
  neon: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [2.0, 1.0, 0.0], [0.5, 0.2, 0.25]],
  pastel: [[0.8, 0.8, 0.8], [0.2, 0.2, 0.2], [1.0, 1.0, 1.0], [0.0, 0.33, 0.67]],
}

function buildNode() {
  const uvCoord = uv()
  const t = add(uvCoord.x, mul(time, uSpeed))

  const preset = palettePresets[props.type]
  if (preset) {
    return cosinePalette(t, preset[0], preset[1], preset[2], preset[3])
  }

  // Custom
  return cosinePalette(t, props.brightness, props.contrast, props.frequency, props.phase)
}

let node = buildNode()
graph.register(props.id, node, props.order, props.blend, props.opacity)

watch(() => props.speed, (v) => { uSpeed.value = v })

// Rebuild on type or custom param changes
watch(
  () => [props.type, props.brightness, props.contrast, props.frequency, props.phase] as const,
  () => {
    node = buildNode()
    graph.update(props.id, node)
  }
)

onUnmounted(() => {
  graph.unregister(props.id)
})
</script>

<template>
  <slot />
</template>
