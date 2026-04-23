<script setup lang="ts">
// @ts-nocheck
import { time, uniform, vec2 } from 'three/tsl'

/**
 * Asymmetric sine warp — the core Grainient/Shadertoy UV distortion.
 *   tuv.x += sin(tuv.y * freq + time * speed) / amplitude
 *   tuv.y += sin(tuv.x * freq * 1.5 + time * speed) / (amplitude * 0.5)
 * The 1.5× frequency on Y and halved amplitude on Y are intentional — they give
 * the characteristic flowing, non-repeating Grainient look.
 */
const props = withDefaults(defineProps<{
  frequency?: number
  amplitude?: number
  speed?: number
  order?: number
}>(), {
  frequency: 5,
  amplitude: 30,
  speed: 2,
  order: 0,
})

const freqNode = uniform(props.frequency)
const ampNode = uniform(props.amplitude)
const speedNode = uniform(props.speed)

watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.amplitude, v => { ampNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

// Pure expression — no toVar/addAssign needed, so no Fn() stack required.
// Sequential dependency preserved: warpedY uses warpedX (the already-warped X component).
useShaderStage(
  (uvIn) => {
    const t = time.mul(speedNode)
    const warpedX = uvIn.x.add(uvIn.y.mul(freqNode).add(t).sin().div(ampNode))
    const warpedY = uvIn.y.add(warpedX.mul(freqNode).mul(1.5).add(t).sin().div(ampNode.mul(0.5)))
    return vec2(warpedX, warpedY)
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>
