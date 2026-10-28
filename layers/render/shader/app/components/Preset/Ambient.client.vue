<script setup lang="ts">
  import {
    createAmbientUniforms,
    createAuroraColorNode,
    createFlowColorNode,
    createGradientMeshColorNode,
    createNebulaColorNode,
    createOceanColorNode,
    type AmbientUniforms,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'

  /**
   * One ambient look, picked by `variant` (v7 merged the five per-look preset components).
   * `variant` is read once, when the node graph is built: to switch looks at runtime, give
   * the component a `:key` so it rebuilds. speed/intensity/mouse update live via uniforms.
   */
  type AmbientVariant = 'aurora' | 'flow' | 'gradient-mesh' | 'nebula' | 'ocean'

  const {
    variant = 'aurora',
    speed = 1.0,
    intensity = 1.0,
    mouseInteraction = true,
  } = defineProps<{
    variant?: AmbientVariant
    speed?: number
    intensity?: number
    mouseInteraction?: boolean
  }>()

  const emit = defineEmits<{
    node: [colorNode: TSLNode]
  }>()

  const VARIANTS: Record<
    AmbientVariant,
    { colorNode: (uniforms: AmbientUniforms) => TSLNode; mouseStrength: number }
  > = {
    aurora: { colorNode: createAuroraColorNode, mouseStrength: 0.5 },
    flow: { colorNode: createFlowColorNode, mouseStrength: 0.5 },
    'gradient-mesh': { colorNode: createGradientMeshColorNode, mouseStrength: 0.3 },
    nebula: { colorNode: createNebulaColorNode, mouseStrength: 0.3 },
    ocean: { colorNode: createOceanColorNode, mouseStrength: 0.5 },
  }

  const look = VARIANTS[variant]
  const uniforms = createAmbientUniforms({ speed, intensity, mouseInteraction })
  const colorNode = look.colorNode(uniforms)

  try {
    const runtime = useShaderRuntimeContext()
    watch(
      () => [runtime.mouse.mouseX.value, runtime.mouse.mouseY.value],
      ([mx, my]) => {
        uniforms.mouseX.value = mx ?? 0.5
        uniforms.mouseY.value = my ?? 0.5
      },
      { immediate: true }
    )
  } catch {
    // No runtime -- mouse can be set externally
  }

  // Props update uniforms, so changing them never recompiles the shader
  watch(
    () => speed,
    (v) => {
      uniforms.speed.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      uniforms.intensity.value = v
    }
  )
  watch(
    () => mouseInteraction,
    (v) => {
      uniforms.mouseStrength.value = v ? look.mouseStrength : 0
    }
  )

  emit('node', colorNode)

  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>
