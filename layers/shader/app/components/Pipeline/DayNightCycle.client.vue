<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, mix, pow, abs, sign, float, vec4 } from 'three/tsl'

/**
 * Sinusoidal interpolation between a light and dark colour over time.
 * The phobon easing: t = (sign(cycle) * pow(abs(cycle), 0.6) + 1) / 2
 * where cycle = sin(time * speed).
 */
const props = withDefaults(defineProps<{
  /** Colour during the light phase */
  colorLight?: string
  /** Colour during the dark phase */
  colorDark?: string
  /** Cycle speed in radians per second */
  speed?: number
  /** Mix opacity over prev colour */
  opacity?: number
  order?: number
}>(), { colorLight: '#ffffff', colorDark: '#000033', speed: 0.3, opacity: 1, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const lightNode = toVec3Node(props.colorLight)
const darkNode = toVec3Node(props.colorDark)
const speedNode = uniform(props.speed)
const opacityNode = uniform(props.opacity)
watch(() => props.colorLight, v => { const c = new Color(v); lightNode.value.set(c.r, c.g, c.b) })
watch(() => props.colorDark, v => { const c = new Color(v); darkNode.value.set(c.r, c.g, c.b) })
watch(() => props.speed, v => { speedNode.value = v })
watch(() => props.opacity, v => { opacityNode.value = v })

useShaderStage(
  (prev) => {
    const cycle = time.mul(speedNode).sin()
    const t = sign(cycle).mul(pow(abs(cycle), float(0.6))).add(1).div(2)
    const colour = mix(darkNode, lightNode, t)
    return vec4(mix(prev.xyz, colour, opacityNode), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
