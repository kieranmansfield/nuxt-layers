<script setup lang="ts">
// @ts-nocheck
import { Color } from 'three'
import { float, mix, time, uniform, vec2, vec4 } from 'three/tsl'
import { simplexNoise2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  scale?: number
  animated?: boolean
  speed?: number
  order?: number
}>(), {
  colorA: '#000000',
  colorB: '#ffffff',
  scale: 3,
  animated: true,
  speed: 0.3,
  order: 0,
})

const colorAVal = new Color(props.colorA)
const colorBVal = new Color(props.colorB)
const colorANode = uniform(colorAVal)
const colorBNode = uniform(colorBVal)
const scaleNode = uniform(props.scale)
const speedNode = uniform(props.speed)

watch(() => props.colorA, v => { colorANode.value.set(v) })
watch(() => props.colorB, v => { colorBNode.value.set(v) })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (_prev) => {
    // Scroll UV over time to animate noise (cheaper than 3D noise)
    const offset = props.animated ? time.mul(speedNode) : float(0)
    const input = uvNode.value.mul(scaleNode).add(vec2(offset, 0))
    const n = simplexNoise2D(input).mul(0.5).add(0.5)
    return vec4(mix(colorANode, colorBNode, n), 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>
