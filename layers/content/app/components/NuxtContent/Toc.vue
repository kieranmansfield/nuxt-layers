<script setup lang="ts">
  import type { TocLink } from '@nuxt/content'

  const { links, title = 'Table of Contents' } = defineProps<{
    links?: TocLink[]
    title?: string
  }>()
</script>

<template>
  <UContentToc
    v-if="links?.length"
    :links
    :title
    highlight
    color="primary"
    highlight-color="primary"
  />
</template>
