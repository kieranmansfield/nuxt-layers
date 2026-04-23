<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { Fn, uniform, time, vec4, vec2, mix, sin, float } from 'three/tsl'

/**
 * ColorBends-style per-colour wave layer.
 * Uses sin(uv.yx * freq) with optional domain-warp feedback loop.
 * Stack one instance per colour for the characteristic multi-hue bend look.
 */
const props = withDefaults(defineProps<{
  /** Wave fill colour */
  color?: string
  /** Blend opacity */
  opacity?: number
  /** Wave frequency */
  frequency?: number
  /** Animation speed */
  speed?: number
  /** Domain warp strength — feeds back into itself for rounder bends */
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

// Fn defined once at setup — toVar/addAssign require a Fn() stack at shader compile time
const waveBendFn = Fn(([prev, uvCurrent]) => {
  const t = time.mul(speedNode)

  // Domain warp: feed UV through sin(yx) feedback
  const s = uvCurrent.toVar()
  s.addAssign(vec2(sin(s.y.mul(freqNode).add(t)), sin(s.x.mul(freqNode).add(t))).mul(warpNode))

  // Band intensity: sin(length(s) * freq + time), remapped to 0..1
  const band = sin(s.length().mul(freqNode.mul(4.0)).add(t)).mul(0.5).add(0.5)
  const alpha = band.mul(opacityNode)

  return vec4(mix(prev.xyz, colorNode, alpha), prev.w)
})

useShaderStage(
  (prev) => waveBendFn([prev, pipeline.uvNode.value]),
  props.order,
)
</script>

<template><!-- --></template>
