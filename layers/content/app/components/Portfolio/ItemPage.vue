<script setup lang="ts">
  const { slug, collection = 'portfolio' } = defineProps<{
    slug: string
    collection?: string
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
