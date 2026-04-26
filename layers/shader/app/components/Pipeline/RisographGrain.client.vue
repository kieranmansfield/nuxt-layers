<script setup lang="ts">
// @ts-nocheck
import { clamp, floor, mix, time, uniform, vec3, vec4 } from 'three/tsl'
import { grain } from '../../shaders/common/grain'
import { blendOverlay, blendScreen, blendSoftLight } from '../../shaders/common/blend'

type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'

const props = withDefaults(defineProps<{
  scale?: number
  strength?: number
  opacity?: number
  misregistration?: number
  fps?: number
  blendMode?: GrainBlendMode
  order?: number
}>(), { scale: 0.6, strength: 0.12, opacity: 1.0, misregistration: 0.003, fps: 8, blendMode: 'add', order: 0 })

const scaleNode = uniform(props.scale)
const strengthNode = uniform(props.strength)
const opacityNode = uniform(props.opacity)
const misregNode = uniform(props.misregistration)
const fpsNode = uniform(props.fps)
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.strength, v => { strengthNode.value = v })
watch(() => props.opacity, v => { opacityNode.value = v })
watch(() => props.misregistration, v => { misregNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const seed = floor(time.mul(fpsNode))

    const uvR = uv.mul(scaleNode).add(misregNode)
    const uvG = uv.mul(scaleNode)
    const uvB = uv.mul(scaleNode).sub(misregNode)

    // grain() returns (raw - 0.5) * strength → centred around 0
    const rNoise = grain(uvR, strengthNode, seed)
    const gNoise = grain(uvG, strengthNode, seed.add(17.0))
    const bNoise = grain(uvB, strengthNode, seed.add(31.0))
    const grainVec = vec3(rNoise, gNoise, bNoise)

    // Lift centred delta back to [0,1] per-channel texture for blend modes
    const rawVec = grainVec.div(strengthNode).add(0.5)

    const mixFactor = strengthNode.mul(opacityNode)
    let blended
    switch (props.blendMode) {
      case 'sub':
        blended = prev.xyz.sub(grainVec.abs().mul(opacityNode))
        break
      case 'screen':
        blended = mix(prev.xyz, blendScreen(prev.xyz, rawVec), mixFactor)
        break
      case 'overlay':
        blended = mix(prev.xyz, blendOverlay(prev.xyz, rawVec), mixFactor)
        break
      case 'soft-light':
        blended = mix(prev.xyz, blendSoftLight(prev.xyz, rawVec), mixFactor)
        break
      default: // 'add'
        blended = prev.xyz.add(grainVec.mul(opacityNode))
    }
    return vec4(clamp(blended, 0, 1), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
