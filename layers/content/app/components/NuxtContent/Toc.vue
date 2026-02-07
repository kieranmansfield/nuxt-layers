<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const { links, title = 'Table of Contents' } = defineProps<{
  links?: { id: string; text: string; children?: { id: string; text: string }[] }[]
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
