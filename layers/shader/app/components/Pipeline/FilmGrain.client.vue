<script setup lang="ts">
// @ts-nocheck
import { clamp, float, fract, mix, sin, time, uniform, vec2, vec4 } from 'three/tsl'
import { blendOverlay, blendScreen, blendSoftLight } from '../../shaders/common/blend'

type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'

const props = withDefaults(defineProps<{
  /** Grain intensity — amplitude of the noise effect */
  intensity?: number
  /** Blend opacity — how strongly grain mixes into the output */
  opacity?: number
  /** UV scale — higher = finer dots, lower = coarser */
  size?: number
  fps?: number
  blendMode?: GrainBlendMode
  order?: number
}>(), { intensity: 0.06, opacity: 1.0, size: 1.0, fps: 24, blendMode: 'sub', order: 0 })

const intensityNode = uniform(props.intensity)
const opacityNode = uniform(props.opacity)
const sizeNode = uniform(props.size)
const fpsNode = uniform(props.fps)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.opacity, v => { opacityNode.value = v })
watch(() => props.size, v => { sizeNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvScaled = pipeline.uvNode.value.mul(sizeNode)
    const t = time.mul(fpsNode).floor().div(fpsNode)

    // Two-pass hash for coarser, more organic texture
    const k1 = vec2(127.1, 311.7)
    const k2 = vec2(269.5, 183.3)
    const p = uvScaled.add(t)
    const h1 = p.dot(k1).sin().mul(43758.5453).fract()
    const h2 = p.add(t.mul(0.3)).dot(k2).sin().mul(43758.5453).fract()
    // Raw [0,1] noise from vector length, normalised by max possible (√2)
    const raw = vec2(h1, h2).length().mul(float(0.7071))

    const mixFactor = intensityNode.mul(opacityNode)
    let blended
    switch (props.blendMode) {
      case 'add':
        blended = prev.xyz.add(raw.sub(0.5).mul(intensityNode).mul(opacityNode))
        break
      case 'screen':
        blended = mix(prev.xyz, blendScreen(prev.xyz, raw), mixFactor)
        break
      case 'overlay':
        blended = mix(prev.xyz, blendOverlay(prev.xyz, raw), mixFactor)
        break
      case 'soft-light':
        blended = mix(prev.xyz, blendSoftLight(prev.xyz, raw), mixFactor)
        break
      default: // 'sub' — original darkening behaviour
        blended = prev.xyz.sub(raw.mul(intensityNode).mul(opacityNode))
    }
    return vec4(clamp(blended, 0, 1), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
