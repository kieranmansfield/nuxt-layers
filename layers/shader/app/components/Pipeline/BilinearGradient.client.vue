<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Bottom-left corner colour */
  bottomLeft?: string
  /** Bottom-right corner colour */
  bottomRight?: string
  /** Top-left corner colour */
  topLeft?: string
  /** Top-right corner colour */
  topRight?: string
  order?: number
}>(), { bottomLeft: '#000000', bottomRight: '#ff0000', topLeft: '#0000ff', topRight: '#ffffff', order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const blNode = toVec3Node(props.bottomLeft)
const brNode = toVec3Node(props.bottomRight)
const tlNode = toVec3Node(props.topLeft)
const trNode = toVec3Node(props.topRight)
watch(() => props.bottomLeft, v => { const c = new Color(v); blNode.value.set(c.r, c.g, c.b) })
watch(() => props.bottomRight, v => { const c = new Color(v); brNode.value.set(c.r, c.g, c.b) })
watch(() => props.topLeft, v => { const c = new Color(v); tlNode.value.set(c.r, c.g, c.b) })
watch(() => props.topRight, v => { const c = new Color(v); trNode.value.set(c.r, c.g, c.b) })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uvCurrent = pipeline.uvNode.value
    const bottom = mix(blNode, brNode, uvCurrent.x)
    const top = mix(tlNode, trNode, uvCurrent.x)
    const colour = mix(bottom, top, uvCurrent.y)
    return vec4(colour, 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>
