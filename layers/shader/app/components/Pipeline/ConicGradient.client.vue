<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Rotation offset in degrees */
  rotation?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', rotation: 0, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const rotationNode = uniform(props.rotation * Math.PI / 180)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.rotation, v => { rotationNode.value = v * Math.PI / 180 })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const centered = uv.sub(0.5)
    const angle = centered.y.atan(centered.x).add(rotationNode)
    const t = angle.div(Math.PI * 2).fract()
    return vec4(mix(colorANode, colorBNode, t), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
