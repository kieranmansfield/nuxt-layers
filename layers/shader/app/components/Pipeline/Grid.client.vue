<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'
import { grid } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  /** Background colour */
  colorA?: string
  /** Grid line colour */
  colorB?: string
  cellSize?: number
  lineWidth?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', cellSize: 0.1, lineWidth: 0.005, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const cellNode = uniform(props.cellSize)
const lineNode = uniform(props.lineWidth)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.cellSize, v => { cellNode.value = v })
watch(() => props.lineWidth, v => { lineNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = grid(uv, cellNode, lineNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
