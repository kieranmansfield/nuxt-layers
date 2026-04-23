<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec3, vec4, smoothstep, float } from 'three/tsl'

/**
 * Edge haze — additive fog/bloom at screen boundaries.
 * Useful for dreamlike or atmospheric borders.
 */
const props = withDefaults(defineProps<{
  /** Haze tint colour */
  color?: string
  /** How far inward the haze reaches (0 = edge only, 1 = full screen) */
  reach?: number
  /** Haze brightness */
  intensity?: number
  order?: number
}>(), { color: '#ffffff', reach: 0.4, intensity: 0.3, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const reachNode = uniform(props.reach)
const intensityNode = uniform(props.intensity)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.reach, v => { reachNode.value = v })
watch(() => props.intensity, v => { intensityNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value

    // Horizontal edge proximity
    const edgeX = smoothstep(reachNode, float(0), uv.x).add(smoothstep(float(1).sub(reachNode), float(1), uv.x))
    // Vertical edge proximity
    const edgeY = smoothstep(reachNode, float(0), uv.y).add(smoothstep(float(1).sub(reachNode), float(1), uv.y))

    const edgeMask = edgeX.add(edgeY).clamp(0, 1).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(edgeMask)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
