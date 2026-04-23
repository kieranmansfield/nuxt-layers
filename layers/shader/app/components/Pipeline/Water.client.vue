<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, sin, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Deep water colour */
  colorDeep?: string
  /** Shallow/crest colour */
  colorShallow?: string
  /** Wave frequency */
  frequency?: number
  /** Wave height */
  amplitude?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { colorDeep: '#003366', colorShallow: '#66ccff', frequency: 8, amplitude: 0.5, speed: 1, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorDeepNode = toVec3Node(props.colorDeep)
const colorShallowNode = toVec3Node(props.colorShallow)
const freqNode = uniform(props.frequency)
const ampNode = uniform(props.amplitude)
const speedNode = uniform(props.speed)
watch(() => props.colorDeep, v => { const c = new Color(v); colorDeepNode.value.set(c.r, c.g, c.b) })
watch(() => props.colorShallow, v => { const c = new Color(v); colorShallowNode.value.set(c.r, c.g, c.b) })
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.amplitude, v => { ampNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)
    // Layered sine waves at different frequencies and phases
    const w1 = sin(uv.x.mul(freqNode).add(t))
    const w2 = sin(uv.x.mul(freqNode.mul(0.7)).add(uv.y.mul(freqNode.mul(0.5))).add(t.mul(0.8)))
    const w3 = sin(uv.y.mul(freqNode.mul(1.3)).add(t.mul(1.1)))
    const wave = w1.add(w2).add(w3).div(3).mul(ampNode).mul(0.5).add(0.5)
    return vec4(mix(colorDeepNode, colorShallowNode, wave), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
