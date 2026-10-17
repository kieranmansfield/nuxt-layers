<script setup lang="ts">
// Thin client-only host for the `shaders` library. Import effect children directly from
// 'shaders/vue' (tree-shakeable) and pass them in the default slot:
//   <FxShader><LinearGradient colorA="#0f172a" colorB="#7c3aed" /></FxShader>
import { Shader } from 'shaders/vue'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Shader v-bind="$attrs">
    <slot />
  </Shader>
</template>
