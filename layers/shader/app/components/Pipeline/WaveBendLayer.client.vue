<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, vec2, mix, sin } from 'three/tsl'

const props = withDefaults(defineProps<{
  color?: string
  opacity?: number
  frequency?: number
  speed?: number
  warpStrength?: number
  order?: number
}>(), {
  color: '#4488ff',
  opacity: 0.8,
  frequency: 3,
  speed: 0.5,
  warpStrength: 0.15,
  order: 0,
})

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const opacityNode = uniform(props.opacity)
const freqNode = uniform(props.frequency)
const speedNode = uniform(props.speed)
const warpNode = uniform(props.warpStrength)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.opacity, v => { opacityNode.value = v })
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })
watch(() => props.warpStrength, v => { warpNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    if (!prev || !uvCurrent) return vec4(0, 0, 0, 1)

    const t = time.mul(speedNode)

    // Domain warp — pure functional (both x and y use original uvCurrent coords)
    const warpX = uvCurrent.x.add(sin(uvCurrent.y.mul(freqNode).add(t)).mul(warpNode))
    const warpY = uvCurrent.y.add(sin(uvCurrent.x.mul(freqNode).add(t)).mul(warpNode))
    const s = vec2(warpX, warpY)

    const band = sin(s.length().mul(freqNode.mul(4.0)).add(t)).mul(0.5).add(0.5)
    const alpha = band.mul(opacityNode)

    return vec4(mix(prev.xyz, colorNode, alpha), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
