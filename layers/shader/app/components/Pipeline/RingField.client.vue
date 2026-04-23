<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, float, abs } from 'three/tsl'

/**
 * Accumulates ring-shaped SDF fields into a single float mask.
 * Each ring: abs(length(uv + offset) - radius) * scale, then summed.
 * Outputs a grayscale vec4 for consumption by CosinePalette (scalarSource: 'prev')
 * or SDFColourMask.
 *
 * The flare8/flare9 pattern. Includes an optional radial vignette term.
 *
 * @example
 * <RingField :order="0" :ring-radius="0.3" :ring-count="3" />
 * <CosinePalette :order="1" scalar-source="prev" />
 */
const props = withDefaults(defineProps<{
  /** Radius of the primary ring */
  ringRadius?: number
  /** Number of rings (stacked with equidistant offsets) */
  ringCount?: number
  /** Spacing between stacked rings */
  ringSpread?: number
  /** Sharpness multiplier applied per ring */
  ringScale?: number
  /** Vignette: oneMinus(length(uv * vignetteScale)) — 0 = disabled */
  vignetteScale?: number
  order?: number
}>(), { ringRadius: 0.3, ringCount: 1, ringSpread: 0.15, ringScale: 4, vignetteScale: 0.8, order: 0 })

const ringRadiusNode = uniform(props.ringRadius)
const ringSpreadNode = uniform(props.ringSpread)
const ringScaleNode = uniform(props.ringScale)
const vignetteScaleNode = uniform(props.vignetteScale)
watch(() => props.ringRadius, v => { ringRadiusNode.value = v })
watch(() => props.ringSpread, v => { ringSpreadNode.value = v })
watch(() => props.ringScale, v => { ringScaleNode.value = v })
watch(() => props.vignetteScale, v => { vignetteScaleNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uvCurrent = pipeline.uvNode.value
    const centered = uvCurrent.sub(0.5)

    // Accumulate rings at evenly-spaced radii
    let acc = float(0)
    for (let i = 0; i < props.ringCount; i++) {
      const offset = ringSpreadNode.mul(float(i - (props.ringCount - 1) / 2))
      const r = ringRadiusNode.add(offset)
      const d = abs(centered.length().sub(r)).mul(ringScaleNode).oneMinus().max(float(0))
      acc = acc.add(d)
    }

    // Optional vignette term
    if (props.vignetteScale > 0) {
      const vignette = float(1).sub(centered.mul(vignetteScaleNode).length()).max(float(0))
      acc = acc.add(vignette)
    }

    const t = acc.div(float(props.ringCount)).min(float(1))
    return vec4(t, t, t, float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
