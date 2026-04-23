<script setup lang="ts">
// @ts-nocheck
import { uniform, vec3, vec4, float, floor, fract } from 'three/tsl'

/**
 * ShaderDebugger — dev-only visualization overlay for inspecting pipeline state.
 *
 * Modes:
 *   'uv'     — displays UV coordinates as red/green channels
 *   'normal' — encodes normal-space UV as blue hue sweep
 *   'grid'   — overlays a reference grid on the current output
 *   'pass'   — passes through unchanged (no-op, useful for toggling off)
 *
 * Drop this at any `order` value to inspect that point in the pipeline.
 * Only renders in development — remove from production compositions.
 */
const props = withDefaults(defineProps<{
  /** Visualization mode */
  mode?: 'uv' | 'normal' | 'grid' | 'pass'
  /** Grid line count (grid mode) */
  gridLines?: number
  /** Grid line thickness */
  gridThickness?: number
  /** Blend with original output (0 = full debug, 1 = full original) */
  blend?: number
  order?: number
}>(), { mode: 'uv', gridLines: 10, gridThickness: 0.02, blend: 0, order: 0 })

const gridLinesNode = uniform(props.gridLines)
const gridThickNode = uniform(props.gridThickness)
const blendNode = uniform(props.blend)
watch(() => props.gridLines, v => { gridLinesNode.value = v })
watch(() => props.gridThickness, v => { gridThickNode.value = v })
watch(() => props.blend, v => { blendNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value

    let debugColour

    if (props.mode === 'uv') {
      // Red = U, Green = V, Blue = 0
      debugColour = vec3(uv.x, uv.y, float(0))
    }
    else if (props.mode === 'normal') {
      // Encodes centered UV — negative values become blue tones
      const centered = uv.sub(0.5)
      debugColour = vec3(centered.x.add(0.5), centered.y.add(0.5), float(0.5))
    }
    else if (props.mode === 'grid') {
      // Grid lines via fract — line at every 1/gridLines interval
      const scaled = uv.mul(gridLinesNode)
      const fx = fract(scaled.x)
      const fy = fract(scaled.y)
      const lineX = float(1).sub(fx.smoothstep(gridThickNode, float(0)))
      const lineY = float(1).sub(fy.smoothstep(gridThickNode, float(0)))
      const line = lineX.max(lineY)
      debugColour = prev.xyz.mul(float(1).sub(line)).add(vec3(line, line.mul(0.5), float(0)))
    }
    else {
      // pass — no-op
      debugColour = prev.xyz
    }

    return vec4(prev.xyz.mix(debugColour, float(1).sub(blendNode)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
