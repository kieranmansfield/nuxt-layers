<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, smoothstep, float } from 'three/tsl'
import { simplexNoise2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  /** Band fill colour */
  color?: string
  /** Opacity of the band layer */
  opacity?: number
  /** Noise input scale */
  scale?: number
  /** Smoothstep lower edge for band threshold */
  edge0?: number
  /** Smoothstep upper edge for band threshold */
  edge1?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { color: '#ffffff', opacity: 1, scale: 2, edge0: 0.3, edge1: 0.7, speed: 0.3, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const opacityNode = uniform(props.opacity)
const scaleNode = uniform(props.scale)
const edge0Node = uniform(props.edge0)
const edge1Node = uniform(props.edge1)
const speedNode = uniform(props.speed)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.opacity, v => { opacityNode.value = v })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.edge0, v => { edge0Node.value = v })
watch(() => props.edge1, v => { edge1Node.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(speedNode)
    const n = simplexNoise2D(uvCurrent.mul(scaleNode).add(t)).mul(0.5).add(0.5)
    const band = smoothstep(edge0Node, edge1Node, n).mul(opacityNode)
    return vec4(mix(prev.xyz, colorNode, band), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
