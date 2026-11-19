<script setup lang="ts">
  /**
   * Mix node -- combines child nodes registered in a nested shader graph.
   * Children register into this component's own sub-graph, which is then
   * composed and registered as a single node in the parent graph.
   */
  import { vec3 } from 'three/tsl'

  const {
    id = 'mix',
    order = 0,
    blend = 'normal',
    opacity = 1.0,
  } = defineProps<{
    id?: string
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>()

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
        parentGraph.register(id, node, order, blend, opacity)
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    parentGraph.unregister(id)
  })
</script>

<template>
  <slot />
</template>
