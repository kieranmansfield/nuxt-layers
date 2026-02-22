<script setup lang="ts">
// @ts-nocheck - TSL types
/**
 * Mix node -- combines child nodes registered in a nested shader graph.
 * Children register into this component's own sub-graph, which is then
 * composed and registered as a single node in the parent graph.
 */
import { vec3 } from 'three/tsl'

const props = withDefaults(
  defineProps<{
    id?: string
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>(),
  {
    id: 'mix',
    order: 0,
    blend: 'normal',
    opacity: 1.0,
  }
)

const parentGraph = useShaderGraphContext()

// Create a sub-graph for children
const subGraph = useShaderGraph()

// Watch sub-graph and register its composite into parent
watch(
  subGraph.version,
  () => {
    const node = subGraph.finalNode.value || vec3(0, 0, 0)
    if (parentGraph) {
      // Re-register with updated composite node
      parentGraph.register(props.id, node, props.order, props.blend, props.opacity)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  parentGraph.unregister(props.id)
})
</script>

<template>
  <slot />
</template>
