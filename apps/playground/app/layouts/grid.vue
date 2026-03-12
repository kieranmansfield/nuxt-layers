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
    <MastHeader v-if="showHeader" />
    <MastNav v-if="showNav" />
    <LayoutMain class="grow">
      <slot />
    </LayoutMain>
    <MastFooter v-if="showFooter" />
    <LayoutGridDebug v-if="showGridDebug" />
  </div>
</template>
