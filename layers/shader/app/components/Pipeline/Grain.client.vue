<script setup lang="ts">
// @ts-nocheck
import { clamp, time, uniform, vec4 } from 'three/tsl'
import { animatedGrain, grain } from '../../shaders/common/grain'
import { blendOverlay, blendScreen, blendSoftLight } from '../../shaders/common/blend'

type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'

const props = withDefaults(defineProps<{
  intensity?: number
  animated?: boolean
  fps?: number
  blendMode?: GrainBlendMode
  order?: number
}>(), {
  intensity: 0.05,
  animated: true,
  fps: 24,
  blendMode: 'add',
  order: 0,
})

const intensityNode = uniform(props.intensity)
const fpsNode = uniform(props.fps)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const g = props.animated
      ? animatedGrain(uvNode.value, time, intensityNode, fpsNode)
      : grain(uvNode.value, intensityNode)
    let blended
    switch (props.blendMode) {
      case 'sub': blended = prev.xyz.sub(g.abs()); break
      case 'screen': blended = blendScreen(prev.xyz, g.add(0.5)); break
      case 'overlay': blended = blendOverlay(prev.xyz, g.add(0.5)); break
      case 'soft-light': blended = blendSoftLight(prev.xyz, g.add(0.5)); break
      default: blended = prev.xyz.add(g)
    }
    return clamp(vec4(blended, prev.w), 0, 1)
  },
  props.order,
)
</script>

<template><!-- --></template>
