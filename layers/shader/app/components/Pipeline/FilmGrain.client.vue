<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec2, vec4, clamp } from 'three/tsl'
import { blendOverlay, blendScreen, blendSoftLight } from '../../shaders/common/blend'

type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'

const props = withDefaults(defineProps<{
  intensity?: number
  fps?: number
  blendMode?: GrainBlendMode
  order?: number
}>(), { intensity: 0.05, fps: 24, blendMode: 'sub', order: 0 })

const intensityNode = uniform(props.intensity)
const fpsNode = uniform(props.fps)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(fpsNode).floor().div(fpsNode)

    const k1 = vec2(127.1, 311.7)
    const k2 = vec2(269.5, 183.3)
    const p = uvCurrent.add(t)
    const h1 = p.dot(k1).sin().mul(43758.5453).fract()
    const h2 = p.add(t.mul(0.3)).dot(k2).sin().mul(43758.5453).fract()
    const noise = vec2(h1, h2).length().mul(intensityNode)
    // Centre noise around 0 for non-sub blend modes
    const g = noise.sub(intensityNode.mul(0.5))

    let blended
    switch (props.blendMode) {
      case 'add': blended = prev.xyz.add(g); break
      case 'screen': blended = blendScreen(prev.xyz, g.add(0.5)); break
      case 'overlay': blended = blendOverlay(prev.xyz, g.add(0.5)); break
      case 'soft-light': blended = blendSoftLight(prev.xyz, g.add(0.5)); break
      default: blended = prev.xyz.sub(noise) // 'sub' — original darkening behaviour
    }
    return vec4(clamp(blended, 0, 1), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
