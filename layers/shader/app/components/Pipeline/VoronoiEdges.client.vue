<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, smoothstep, float } from 'three/tsl'
import { voronoi2D } from '../../shaders/common/noise'

/** Voronoi cell edge lines only — the cell boundaries as thin lines. */
const props = withDefaults(defineProps<{
  /** Cell background colour */
  colorA?: string
  /** Edge line colour */
  colorB?: string
  scale?: number
  /** Edge line thickness */
  edgeWidth?: number
  speed?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', scale: 8, edgeWidth: 0.05, speed: 0.1, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const scaleNode = uniform(props.scale)
const edgeNode = uniform(props.edgeWidth)
const speedNode = uniform(props.speed)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.edgeWidth, v => { edgeNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const { distance } = voronoi2D(uv.add(time.mul(speedNode)), scaleNode)
    // Edge = near-zero distance → smooth threshold
    const edge = smoothstep(edgeNode, edgeNode.mul(0.1), distance)
    return vec4(mix(colorANode, colorBNode, edge), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
