<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, float } from 'three/tsl'
import { turbulence2D } from '../../shaders/common/noise'

/** Billow/turbulence noise — folded abs() of FBM, producing cloud-like forms. */
const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  scale?: number
  speed?: number
  order?: number
}>(), { colorA: '#1a3a8a', colorB: '#ffffff', scale: 2, speed: 0.1, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const scaleNode = uniform(props.scale)
const speedNode = uniform(props.speed)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const n = turbulence2D(uv.mul(scaleNode).add(time.mul(speedNode)))
    return vec4(mix(colorANode, colorBNode, n), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
