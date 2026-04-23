<script setup lang="ts">
// @ts-nocheck
import { uniform, vec2 } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Number of columns to divide into */
  columns?: number
  /** Vertical offset multiplied by column index */
  factor?: number
  order?: number
}>(), { columns: 6, factor: 0.15, order: 0 })

const columnsNode = uniform(props.columns)
const factorNode = uniform(props.factor)
watch(() => props.columns, v => { columnsNode.value = v })
watch(() => props.factor, v => { factorNode.value = v })

useShaderStage(
  (uvIn) => {
    const col = uvIn.x.mul(columnsNode).floor()
    return vec2(uvIn.x, uvIn.y.add(col.mul(factorNode)))
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>
