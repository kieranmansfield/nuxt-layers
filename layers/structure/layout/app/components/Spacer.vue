<script setup lang="ts">
  /**
   * Spacer — flexible remaining space inside HStack/VStack.
   * See nuxt-declarative-layout-system-spec.md §9.
   */

  const { size = undefined } = defineProps<{
    /** Fixed size instead of flexible — rare; only when a concrete need arises. */
    size?: string
  }>()
</script>

<template>
  <div class="spacer" :style="size ? { flex: `0 0 ${size}` } : undefined" />
</template>

<style scoped>
  .spacer {
    flex: 1 1 auto;
  }
</style>
