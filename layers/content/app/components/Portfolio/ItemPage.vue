<script setup lang="ts">
  import type { PageCollections } from '@nuxt/content'

  const { slug, collection = 'portfolio' } = defineProps<{
    slug: string
    collection?: keyof PageCollections
  }>()
  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.portfolio === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <PortfolioDetail :slug :collection />
    </LayoutGridItem>
  </LayoutSection>
</template>
