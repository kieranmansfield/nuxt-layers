<script setup lang="ts">
// @ts-nocheck
import { uniform, vec3, vec4, float } from 'three/tsl'

/**
 * Arbitrary RGB channel mixing matrix.
 * Each output channel is a weighted sum of all three input channels.
 * Identity: rr=1 gg=1 bb=1, all cross-terms = 0.
 */
const props = withDefaults(defineProps<{
  /** R channel: [R contribution, G contribution, B contribution] */
  rRow?: [number, number, number]
  /** G channel: [R contribution, G contribution, B contribution] */
  gRow?: [number, number, number]
  /** B channel: [R contribution, G contribution, B contribution] */
  bRow?: [number, number, number]
  order?: number
}>(), {
  rRow: () => [1, 0, 0],
  gRow: () => [0, 1, 0],
  bRow: () => [0, 0, 1],
  order: 0,
})

const rrNode = uniform(props.rRow[0]); const rgNode = uniform(props.rRow[1]); const rbNode = uniform(props.rRow[2])
const grNode = uniform(props.gRow[0]); const ggNode = uniform(props.gRow[1]); const gbNode = uniform(props.gRow[2])
const brNode = uniform(props.bRow[0]); const bgNode = uniform(props.bRow[1]); const bbNode = uniform(props.bRow[2])

watch(() => props.rRow, ([r, g, b]) => { rrNode.value = r; rgNode.value = g; rbNode.value = b })
watch(() => props.gRow, ([r, g, b]) => { grNode.value = r; ggNode.value = g; gbNode.value = b })
watch(() => props.bRow, ([r, g, b]) => { brNode.value = r; bgNode.value = g; bbNode.value = b })

useShaderStage(
  (prev) => {
    const r = prev.r.mul(rrNode).add(prev.g.mul(rgNode)).add(prev.b.mul(rbNode))
    const g = prev.r.mul(grNode).add(prev.g.mul(ggNode)).add(prev.b.mul(gbNode))
    const b = prev.r.mul(brNode).add(prev.g.mul(bgNode)).add(prev.b.mul(bbNode))
    return vec4(vec3(r, g, b), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>
