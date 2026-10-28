<script setup lang="ts">
  /**
   * Spacer — flexible remaining space inside HStack/VStack. Flex-only (`flex: 1`): it does
   * nothing inside a grid, so it has no effect in ZStack or a snapped HStack.
   * See nuxt-declarative-layout-system-spec.md §9.
   */

  const { size = undefined } = defineProps<{
    /** Fixed size instead of flexible — rare; only when a concrete need arises. */
    size?: string
  }>()
</script>

<template>
  <div class="spacer" aria-hidden="true" :style="size ? { flex: `0 0 ${size}` } : undefined" />
</template>

<style scoped>
  .spacer {
    flex: 1 1 auto;
  }
</style>
