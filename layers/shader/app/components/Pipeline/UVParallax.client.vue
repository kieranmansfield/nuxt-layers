<script setup lang="ts">
// @ts-nocheck
import { Vector2 } from 'three'
import { uniform, vec2 } from 'three/tsl'

/**
 * Offsets UV by the pointer position scaled by a parallax factor.
 * Creates the illusion of depth as the mouse moves — the ColorBends pattern.
 * p += pointer * parallax * 0.1
 */
const props = withDefaults(defineProps<{
  /** Parallax strength: 0 = no movement, 1 = full NDC range */
  parallax?: number
  order?: number
}>(), { parallax: 0.5, order: 0 })

const mouse = uniform(new Vector2(0, 0))
const parallaxNode = uniform(props.parallax)
watch(() => props.parallax, v => { parallaxNode.value = v })

onMounted(() => {
  const onMove = (e: MouseEvent) => {
    mouse.value.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -((e.clientY / window.innerHeight) * 2 - 1),
    )
  }
  window.addEventListener('mousemove', onMove)
  onUnmounted(() => window.removeEventListener('mousemove', onMove))
})

useShaderStage(
  (uvIn) => uvIn.add(vec2(mouse.x, mouse.y).mul(parallaxNode).mul(0.1)),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>
