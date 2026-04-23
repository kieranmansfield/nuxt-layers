<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, float } from 'three/tsl'
import { voronoi2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  scale?: number
  speed?: number
  order?: number
}>(), { colorA: '#000033', colorB: '#ffffff', scale: 8, speed: 0.1, order: 0 })

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
    const { distance } = voronoi2D(uv.add(time.mul(speedNode)), scaleNode)
    return vec4(mix(colorANode, colorBNode, distance.min(float(1))), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
