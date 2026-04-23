<script setup lang="ts">
// @ts-nocheck
import { Color, Vector2, Vector3 } from 'three'
import { uniform, vec2, vec3, vec4, smoothstep, float } from 'three/tsl'

/**
 * Procedural lens flare — starburst + ghost circle artefacts along the flare axis.
 */
const props = withDefaults(defineProps<{
  /** Light source position in UV space */
  position?: [number, number]
  /** Flare colour */
  color?: string
  /** Overall brightness */
  intensity?: number
  /** How many ghost circles along the axis */
  ghostCount?: number
  order?: number
}>(), { position: () => [0.7, 0.8], color: '#fffde0', intensity: 0.6, ghostCount: 4, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const posNode = uniform(new Vector2(...props.position))
const colorNode = toVec3Node(props.color)
const intensityNode = uniform(props.intensity)
const ghostCountNode = uniform(props.ghostCount)
watch(() => props.position, ([x, y]) => { posNode.value.set(x, y) })
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.ghostCount, v => { ghostCountNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const src = vec2(posNode.x, posNode.y)

    // Starburst: bright disc at source
    const distToSrc = uv.sub(src).length()
    const burst = smoothstep(float(0.08), float(0), distToSrc).mul(intensityNode)

    // Ghost circles: evenly spaced along the axis toward screen centre
    const axis = vec2(0.5, 0.5).sub(src)
    const ghost1 = uv.sub(src.add(axis.mul(0.4))).length()
    const ghost2 = uv.sub(src.add(axis.mul(0.7))).length()
    const ghost3 = uv.sub(src.add(axis.mul(1.1))).length()
    const ghost4 = uv.sub(src.add(axis.mul(1.5))).length()

    const g1 = smoothstep(float(0.05), float(0), ghost1).mul(0.4)
    const g2 = smoothstep(float(0.03), float(0), ghost2).mul(0.3)
    const g3 = smoothstep(float(0.04), float(0), ghost3).mul(0.2)
    const g4 = smoothstep(float(0.06), float(0), ghost4).mul(0.15)

    const ghosts = g1.add(g2).add(g3).add(g4).mul(intensityNode)
    const flare = colorNode.mul(burst.add(ghosts))

    return vec4(prev.xyz.add(flare), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
