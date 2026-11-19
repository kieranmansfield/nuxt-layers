<script setup lang="ts">
  const { showHeader, showNav, showFooter, showGridDebug } = defineProps<{
    showHeader?: boolean
    showNav?: boolean
    showFooter?: boolean
    showGridDebug?: boolean
  }>()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <LazyMastHeader v-if="showHeader" />
    <LazyMastNav v-if="showNav" class="fixed top-0 right-0 z-(--z-header)" />
    <LazyMastNavModal v-if="showNav" />
    <LayoutMain class="grow">
      <slot />
    </LayoutMain>
    <LazyMastFooter v-if="showFooter" />
    <LazyLayoutGridDebug v-if="showGridDebug" />
  </div>
</template>
