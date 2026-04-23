<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, smoothstep, float } from 'three/tsl'
import { polygon } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Number of sides */
  sides?: number
  radius?: number
  softness?: number
  /** Rotation offset in degrees */
  rotation?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', sides: 6, radius: 0.35, softness: 0.01, rotation: 0, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const radiusNode = uniform(props.radius)
const softnessNode = uniform(props.softness)
const rotationNode = uniform(props.rotation * Math.PI / 180)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.radius, v => { radiusNode.value = v })
watch(() => props.softness, v => { softnessNode.value = v })
watch(() => props.rotation, v => { rotationNode.value = v * Math.PI / 180 })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = polygon(uv, [0.5, 0.5], radiusNode, props.sides, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
