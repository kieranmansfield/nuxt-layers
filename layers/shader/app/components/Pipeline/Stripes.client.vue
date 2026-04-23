<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'
import { stripes } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  frequency?: number
  /** Fraction of each stripe that is colorB (0–1) */
  thickness?: number
  /** Angle in degrees */
  angle?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', frequency: 10, thickness: 0.5, angle: 0, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const freqNode = uniform(props.frequency)
const thickNode = uniform(props.thickness)
const angleNode = uniform(props.angle * Math.PI / 180)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.thickness, v => { thickNode.value = v })
watch(() => props.angle, v => { angleNode.value = v * Math.PI / 180 })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = stripes(uv, freqNode, thickNode, angleNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
