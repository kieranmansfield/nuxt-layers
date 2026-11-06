<script setup lang="ts">
  import type { PageCollections } from '@nuxt/content'

  const { slug, collection = 'portfolio' } = defineProps<{
    slug: string
    collection?: keyof PageCollections
  }>()

  useContentSection('portfolio')
  await useContentItemSeo(collection, slug)
</script>

<template>
  <NuxtContentDetailTemplate>
    <PortfolioDetail :slug :collection />
  </NuxtContentDetailTemplate>
</template>
