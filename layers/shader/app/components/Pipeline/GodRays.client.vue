<script setup lang="ts">
// @ts-nocheck
import { Color, Vector2, Vector3 } from 'three'
import { uniform, vec2, vec3, vec4, smoothstep, sin, cos, float } from 'three/tsl'

/**
 * Radial god rays — procedural volumetric light shafts emanating from a source point.
 * Uses angular spokes in UV space to approximate crepuscular rays.
 */
const props = withDefaults(defineProps<{
  /** Light source UV position */
  position?: [number, number]
  /** Ray colour */
  color?: string
  /** Ray brightness */
  intensity?: number
  /** Number of ray spokes */
  rayCount?: number
  /** Radial decay rate */
  decay?: number
  order?: number
}>(), { position: () => [0.5, 0.9], color: '#fff9e0', intensity: 0.35, rayCount: 12, decay: 2.0, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const posNode = uniform(new Vector2(...props.position))
const colorNode = toVec3Node(props.color)
const intensityNode = uniform(props.intensity)
const rayCountNode = uniform(props.rayCount)
const decayNode = uniform(props.decay)
watch(() => props.position, ([x, y]) => { posNode.value.set(x, y) })
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.rayCount, v => { rayCountNode.value = v })
watch(() => props.decay, v => { decayNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const src = vec2(posNode.x, posNode.y)
    const dir = uv.sub(src)
    const dist = dir.length()

    // Angular spokes: cos(angle * rayCount) drives streak pattern
    const angle = dir.y.atan(dir.x)
    const spoke = cos(angle.mul(rayCountNode)).mul(0.5).add(0.5)
    spoke.pow(3)

    // Radial falloff from source
    const radialFade = smoothstep(decayNode, float(0), dist)

    const rays = spoke.pow(3).mul(radialFade).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(rays)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
