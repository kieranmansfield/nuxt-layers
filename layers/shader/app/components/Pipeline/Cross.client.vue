<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, smoothstep, float } from 'three/tsl'
import { sdBox2d } from '../../shaders/common/sdf'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Length of each arm */
  size?: number
  /** Width of each arm */
  thickness?: number
  softness?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', size: 0.4, thickness: 0.1, softness: 0.01, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const sizeNode = uniform(props.size)
const thickNode = uniform(props.thickness)
const softnessNode = uniform(props.softness)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.size, v => { sizeNode.value = v })
watch(() => props.thickness, v => { thickNode.value = v })
watch(() => props.softness, v => { softnessNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const p = uv.sub(0.5)
    // Horizontal arm and vertical arm — union = min
    const dH = sdBox2d(p, thickNode.div(2))  // approx — sdBox2d expects a scalar half-size
    const dV = sdBox2d(p.yx, thickNode.div(2))
    const d = dH.min(dV)
    const mask = smoothstep(softnessNode, softnessNode.negate(), d)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
