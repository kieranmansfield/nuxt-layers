<script setup lang="ts">
const { contentLayer } = useAppConfig()
if (contentLayer?.sections?.portfolio === false) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const { slug, collection = 'portfolio' } = defineProps<{
  slug: string
  collection?: string
}>()
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <PortfolioDetail :slug :collection />
    </LayoutGridItem>
  </LayoutSection>
</template>
