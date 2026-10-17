<script setup lang="ts">
// Renders the default slot when WebGPU is available, otherwise the `fallback` slot.
const supported = ref(false)

onMounted(() => {
  supported.value = typeof navigator !== 'undefined' && 'gpu' in navigator
})
</script>

<template>
  <slot v-if="supported" />
  <slot v-else name="fallback" />
</template>
