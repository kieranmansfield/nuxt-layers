<script setup lang="ts">
// @ts-nocheck
import { Vector3 } from 'three'
import { time, uniform, vec4 } from 'three/tsl'
import { cosinePalette } from '../../shaders/common/palette'
import { luminance } from '../../shaders/common/blend'

/**
 * IQ's cosine palette — the backbone of phobon/aurora-style shaders.
 * Formula: a + b * cos(2π * (c*t + d))
 * Scalar input t comes from uvNode via scalarSource.
 */
const props = withDefaults(defineProps<{
  /** Colour offset (brightness centre) */
  a?: [number, number, number]
  /** Colour amplitude (contrast) */
  b?: [number, number, number]
  /** Frequency per channel */
  c?: [number, number, number]
  /** Phase offset per channel (colour shift) */
  d?: [number, number, number]
  /** How fast the palette cycles over time */
  timeScale?: number
  /**
   * What value to feed as the scalar input `t`.
   * `'prev'` reads luminance of the previous pipeline stage — use after RingField,
   * ChebyshevNoiseField, or any block that outputs a grayscale scalar as its colour.
   */
  scalarSource?: 'uv.y' | 'uv.x' | 'length' | 'time' | 'prev'
  order?: number
}>(), {
  a: () => [0.5, 0.5, 0.5],
  b: () => [0.5, 0.5, 0.5],
  c: () => [1.0, 1.0, 1.0],
  d: () => [0.0, 0.33, 0.67],
  timeScale: 0.1,
  scalarSource: 'uv.y',
  order: 0,
})

const aNode = uniform(new Vector3(...props.a))
const bNode = uniform(new Vector3(...props.b))
const cNode = uniform(new Vector3(...props.c))
const dNode = uniform(new Vector3(...props.d))
const timeScaleNode = uniform(props.timeScale)

watch(() => props.a, v => { aNode.value.set(...v) })
watch(() => props.b, v => { bNode.value.set(...v) })
watch(() => props.c, v => { cNode.value.set(...v) })
watch(() => props.d, v => { dNode.value.set(...v) })
watch(() => props.timeScale, v => { timeScaleNode.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    let scalar
    if (props.scalarSource === 'uv.x') scalar = uvNode.value.x
    else if (props.scalarSource === 'length') scalar = uvNode.value.sub(0.5).length()
    else if (props.scalarSource === 'time') scalar = time
    else if (props.scalarSource === 'prev') scalar = luminance(prev.xyz)
    else scalar = uvNode.value.y

    const t = scalar.add(time.mul(timeScaleNode))
    return vec4(cosinePalette(t, aNode, bNode, cNode, dNode), 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>
