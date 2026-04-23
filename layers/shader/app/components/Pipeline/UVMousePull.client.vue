<script setup lang="ts">
// @ts-nocheck
import { Vector2 } from 'three'
import { uniform, vec2 } from 'three/tsl'

/**
 * Warps UV toward the mouse cursor — different from UVParallax, which shifts
 * the whole field. This pulls individual UV coords toward the pointer position.
 * q += (pointer - uv) * influence * 0.2
 */
const props = withDefaults(defineProps<{
  /** Pull strength toward the cursor */
  influence?: number
  order?: number
}>(), { influence: 0.5, order: 0 })

const mouse = uniform(new Vector2(0.5, 0.5))
const influenceNode = uniform(props.influence)
watch(() => props.influence, v => { influenceNode.value = v })

onMounted(() => {
  const onMove = (e: MouseEvent) => {
    mouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
  }
  window.addEventListener('mousemove', onMove)
  onUnmounted(() => window.removeEventListener('mousemove', onMove))
})

useShaderStage(
  (uvIn) => {
    const pointer = vec2(mouse.x, mouse.y)
    return uvIn.add(pointer.sub(uvIn).mul(influenceNode).mul(0.2))
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>
