<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec3, vec4, floor, clamp } from 'three/tsl'
import { grain } from '../../shaders/common/grain'
import { blendOverlay, blendScreen, blendSoftLight } from '../../shaders/common/blend'

type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'

const props = withDefaults(defineProps<{
  scale?: number
  strength?: number
  misregistration?: number
  fps?: number
  blendMode?: GrainBlendMode
  order?: number
}>(), { scale: 0.6, strength: 0.12, misregistration: 0.003, fps: 8, blendMode: 'add', order: 0 })

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

    const uvR = uv.mul(scaleNode).add(misregNode)
    const uvG = uv.mul(scaleNode)
    const uvB = uv.mul(scaleNode).sub(misregNode)

    const rNoise = grain(uvR, strengthNode, seed)
    const gNoise = grain(uvG, strengthNode, seed.add(17.0))
    const bNoise = grain(uvB, strengthNode, seed.add(31.0))
    const grainVec = vec3(rNoise, gNoise, bNoise)

    let blended
    switch (props.blendMode) {
      case 'sub': blended = prev.xyz.sub(grainVec.abs()); break
      case 'screen': blended = blendScreen(prev.xyz, grainVec.add(0.5)); break
      case 'overlay': blended = blendOverlay(prev.xyz, grainVec.add(0.5)); break
      case 'soft-light': blended = blendSoftLight(prev.xyz, grainVec.add(0.5)); break
      default: blended = prev.xyz.add(grainVec)
    }
    return vec4(clamp(blended, 0, 1), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
