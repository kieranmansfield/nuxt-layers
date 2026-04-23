<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec3, vec4, floor, clamp, float } from 'three/tsl'
import { grain } from '../../shaders/common/grain'

/**
 * Risograph grain — coarse, coloured per-channel grain that mimics the halftone
 * dot spread of Risograph printing. Each channel gets independent noise at a
 * low frame-rate to simulate the mechanical inconsistency of a drum printer.
 */
const props = withDefaults(defineProps<{
  /** Grain coarseness (UV scale multiplier — lower = bigger dots) */
  scale?: number
  /** Grain strength per channel */
  strength?: number
  /** Channel misregistration amount */
  misregistration?: number
  /** Grain fps (lower = chunkier animation) */
  fps?: number
  order?: number
}>(), { scale: 0.6, strength: 0.12, misregistration: 0.003, fps: 8, order: 0 })

const scaleNode = uniform(props.scale)
const strengthNode = uniform(props.strength)
const misregNode = uniform(props.misregistration)
const fpsNode = uniform(props.fps)
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.strength, v => { strengthNode.value = v })
watch(() => props.misregistration, v => { misregNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const seed = floor(time.mul(fpsNode))

    // Each channel samples grain at a slightly offset UV — simulates plate misreg
    const uvR = uv.mul(scaleNode).add(misregNode)
    const uvG = uv.mul(scaleNode)
    const uvB = uv.mul(scaleNode).sub(misregNode)

    const rNoise = grain(uvR, strengthNode, seed)
    const gNoise = grain(uvG, strengthNode, seed.add(17.0))
    const bNoise = grain(uvB, strengthNode, seed.add(31.0))

    const result = clamp(prev.xyz.add(vec3(rNoise, gNoise, bNoise)), 0, 1)
    return vec4(result, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
