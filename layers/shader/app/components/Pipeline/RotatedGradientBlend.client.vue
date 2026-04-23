<script setup lang="ts">
// @ts-nocheck
import { Color } from 'three'
import { mix, smoothstep, uniform, vec4 } from 'three/tsl'

/**
 * Blends two colours along a rotated axis — the core Grainient colour pattern.
 * Projects the current UV onto the rotated axis via (uv * Rot(angle)).x,
 * then uses smoothstep to create the gradient.
 *
 * Stack multiple instances at consecutive orders to layer gradients.
 */
const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Rotation angle in degrees */
  angle?: number
  /** Smoothstep lower edge (0 = sharp at centre-left) */
  edge0?: number
  /** Smoothstep upper edge (1 = sharp at centre-right) */
  edge1?: number
  order?: number
}>(), {
  colorA: '#000000',
  colorB: '#ffffff',
  angle: -5,
  edge0: 0.25,
  edge1: 0.75,
  order: 0,
})

const colorAVal = new Color(props.colorA)
const colorBVal = new Color(props.colorB)
const colorANode = uniform(colorAVal)
const colorBNode = uniform(colorBVal)
const angleNode = uniform(props.angle * (Math.PI / 180))
const edge0Node = uniform(props.edge0)
const edge1Node = uniform(props.edge1)

watch(() => props.colorA, v => { colorANode.value.set(v) })
watch(() => props.colorB, v => { colorBNode.value.set(v) })
watch(() => props.angle, v => { angleNode.value = v * (Math.PI / 180) })
watch(() => props.edge0, v => { edge0Node.value = v })
watch(() => props.edge1, v => { edge1Node.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (_prev) => {
    const cosA = angleNode.cos()
    const sinA = angleNode.sin()
    // Project UV onto rotated axis, shift to 0-1 range
    const rotatedX = uvNode.value.x.mul(cosA).sub(uvNode.value.y.mul(sinA)).add(0.5)
    const t = smoothstep(edge0Node, edge1Node, rotatedX)
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>
