<script setup lang="ts">
// @ts-nocheck - TSL types
import { Color } from 'three'
import { uniform, vec3 } from 'three/tsl'

const props = withDefaults(
  defineProps<{
    id?: string
    color?: string
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>(),
  {
    id: 'color',
    color: '#ffffff',
    order: 0,
    blend: 'normal',
    opacity: 1.0,
  }
)

const graph = useShaderGraphContext()

// Create uniform once
const colorValue = new Color(props.color)
const colorNode = uniform(colorValue)

// Build TSL node once (references uniform by pointer)
const node = vec3(colorNode)

// Register in graph
graph.register(props.id, node, props.order, props.blend, props.opacity)

// Watch props to update uniform value (no recompilation)
watch(
  () => props.color,
  (hex) => {
    colorValue.set(hex)
    colorNode.value = colorValue
  }
)

onUnmounted(() => {
  graph.unregister(props.id)
})
</script>

<template>
  <slot />
</template>
