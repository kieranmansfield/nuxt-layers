<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec3, vec4, mix, clamp, float } from 'three/tsl'
import { fbm2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  /** Base flame colour (cool, inner) */
  colorBase?: string
  /** Tip flame colour (hot, outer) */
  colorTip?: string
  /** Flame height scale */
  scale?: number
  /** Rise speed */
  speed?: number
  order?: number
}>(), { colorBase: '#ffcc00', colorTip: '#ff2200', scale: 3, speed: 1.5, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorBaseNode = toVec3Node(props.colorBase)
const colorTipNode = toVec3Node(props.colorTip)
const scaleNode = uniform(props.scale)
const speedNode = uniform(props.speed)
watch(() => props.colorBase, v => { const c = new Color(v); colorBaseNode.value.set(c.r, c.g, c.b) })
watch(() => props.colorTip, v => { const c = new Color(v); colorTipNode.value.set(c.r, c.g, c.b) })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    // Animate upward by subtracting time from Y
    const pos = uv.mul(scaleNode).sub(time.mul(speedNode))
    const n = fbm2D(pos).mul(0.5).add(0.5)
    // Heat = noise * (1 - uv.y): flames die out at the top
    const heat = clamp(n.mul(float(1).sub(uv.y).mul(1.5)), float(0), float(1))
    // Black background → tip colour → base colour
    const fireColor = mix(vec3(0, 0, 0), mix(colorTipNode, colorBaseNode, heat), heat)
    return vec4(fireColor, heat)
  },
  props.order,
)
</script>

<template><!-- --></template>
