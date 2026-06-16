<script setup lang="ts">
  import type { ContentSurroundLink } from '@nuxt/ui'

  const { surround = undefined } = defineProps<{
    surround?: ContentSurroundLink[]
  }>()
</script>

<template>
  <UContentSurround
    v-if="surround"
    :surround
    prev-icon="i-lucide-arrow-left"
    next-icon="i-lucide-arrow-right"
  />
</template>
