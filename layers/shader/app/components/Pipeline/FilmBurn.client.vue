<script setup lang="ts">
// @ts-nocheck
import { Color, Vector2, Vector3 } from 'three'
import { uniform, vec4, vec2, mix, smoothstep, float } from 'three/tsl'

/**
 * Orange/warm light leak emanating from a screen corner.
 * Additive over-exposure effect — common in analogue film.
 */
const props = withDefaults(defineProps<{
  /** Light leak colour */
  color?: string
  /** Corner origin [0,1] — default top-left */
  origin?: [number, number]
  /** Reach of the leak */
  radius?: number
  /** Peak brightness */
  intensity?: number
  order?: number
}>(), { color: '#ff8822', origin: () => [0, 1], radius: 0.7, intensity: 0.5, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const originNode = uniform(new Vector2(...props.origin))
const radiusNode = uniform(props.radius)
const intensityNode = uniform(props.intensity)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.origin, ([x, y]) => { originNode.value.set(x, y) })
watch(() => props.radius, v => { radiusNode.value = v })
watch(() => props.intensity, v => { intensityNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const dist = uv.sub(vec2(originNode.x, originNode.y)).length()
    const leak = smoothstep(radiusNode, float(0), dist).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(leak)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
