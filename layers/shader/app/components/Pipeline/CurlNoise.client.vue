<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec3, vec4, mix } from 'three/tsl'
import { curlNoise3d } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  /** Colour to mix in at curl peak */
  color?: string
  /** Blend opacity */
  opacity?: number
  /** Input scale for the curl noise */
  scale?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { color: '#ffffff', opacity: 1, scale: 1.5, speed: 0.2, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const opacityNode = uniform(props.opacity)
const scaleNode = uniform(props.scale)
const speedNode = uniform(props.speed)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.opacity, v => { opacityNode.value = v })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(speedNode)
    const p = vec3(uvCurrent.mul(scaleNode), t)
    const curl = curlNoise3d(p).x.mul(0.5).add(0.5)
    const blended = mix(prev.xyz, colorNode, curl.mul(opacityNode))
    return vec4(blended, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
