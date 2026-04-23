<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec3, vec4, clamp, sin, floor, fract, float } from 'three/tsl'
import { grain } from '../../shaders/common/grain'
import { vignette } from '../../shaders/common/grain'
import { luminance } from '../../shaders/common/blend'

/**
 * Preset: combines grain + warm tone shift + vignette + slight fade.
 * A convenient one-stop aged film look.
 */
const props = withDefaults(defineProps<{
  /** Overall intensity: 0 = no effect, 1 = full aged look */
  intensity?: number
  /** Grain strength */
  grainStrength?: number
  /** Vignette darkness */
  vignetteStrength?: number
  /** Warm shadow tint amount */
  warmth?: number
  order?: number
}>(), { intensity: 1, grainStrength: 0.04, vignetteStrength: 0.5, warmth: 0.15, order: 0 })

const intensityNode = uniform(props.intensity)
const grainNode = uniform(props.grainStrength)
const vigNode = uniform(props.vignetteStrength)
const warmthNode = uniform(props.warmth)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.grainStrength, v => { grainNode.value = v })
watch(() => props.vignetteStrength, v => { vigNode.value = v })
watch(() => props.warmth, v => { warmthNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const t = time

    // Film grain
    const seed = floor(t.mul(24))
    const g = grain(uv, grainNode, seed)

    // Warm shadows: boost R and reduce B in dark areas
    const lum = luminance(prev.xyz)
    const shadowWarm = float(1).sub(lum).mul(warmthNode)
    const warm = prev.xyz.add(vec3(shadowWarm, shadowWarm.mul(0.3), shadowWarm.negate()))

    // Vignette
    const vig = vignette(uv, vigNode, float(0.4))

    // Slight overall fade (film desaturation/lift)
    const faded = warm.mul(float(0.92)).add(float(0.04))

    const result = clamp(faded.mul(vig).add(g), 0, 1)
    return vec4(result.mix(prev.xyz, float(1).sub(intensityNode)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
