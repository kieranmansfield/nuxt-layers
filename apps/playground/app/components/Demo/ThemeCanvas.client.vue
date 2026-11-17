<script setup lang="ts">
  import { DoubleSide } from 'three'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  import { useThemeNodeUniforms, type ThemeNodeProps } from '~/composables/useThemeNodeUniforms'

  const props = defineProps<ThemeNodeProps>()

  const { createColorNode } = useThemeNodeUniforms(props)

  function buildMaterial() {
    const colorNode = createColorNode(props.themeId)
    const mat = new MeshBasicNodeMaterial()
    mat.side = DoubleSide
    mat.colorNode = colorNode
    return mat
  }

  const material = shallowRef(buildMaterial())

  watch(
    () => props.themeId,
    () => {
      const old = material.value
      material.value = buildMaterial()
      nextTick(() => old?.dispose())
    }
  )

  onUnmounted(() => material.value?.dispose())
</script>

<template>
  <ShaderCanvas webgpu clear-color="#0a0a0a" :window-size="false" tone-mapping="aces">
    <TresOrthographicCamera :args="[-1, 1, 1, -1, 0.1, 100]" :position="[0, 0, 1]" />
    <TresMesh>
      <TresPlaneGeometry :args="[2, 2]" />
      <primitive :object="material" attach="material" />
    </TresMesh>
  </ShaderCanvas>
</template>
