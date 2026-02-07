<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const { surround } = defineProps<{
  surround?: unknown[]
}>()
</script>

<template>
  <UContentSurround
    v-if="surround"
    :surround="surround as any"
    prev-icon="i-lucide-arrow-left"
    next-icon="i-lucide-arrow-right"
  />
</template>
