<script setup lang="ts">
  import { Color } from 'three'
  import { uniform, vec3 } from 'three/tsl'

  import type { TSLNode } from '../../shaders/types'

  const {
    id = 'color',
    color = '#ffffff',
    order = 0,
    blend = 'normal',
    opacity = 1.0,
  } = defineProps<{
    id?: string
    color?: string
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>()

  const graph = useShaderGraphContext()

  // Create uniform once
  const colorValue = new Color(color)
  const colorNode: TSLNode = uniform(colorValue)

  // Build TSL node once (references uniform by pointer)
  const node = vec3(colorNode)

  // Register in graph
  graph.register(id, node, order, blend, opacity)

  // Watch props to update uniform value (no recompilation)
  watch(
    () => color,
    (hex) => {
      colorValue.set(hex)
      colorNode.value = colorValue
    }
  )

  onUnmounted(() => {
    graph.unregister(id)
  })
</script>

<template>
  <slot />
</template>
