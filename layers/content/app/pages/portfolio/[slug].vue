<script setup lang="ts">
  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.portfolio === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const route = useRoute()
  const slug = route.params.slug as string
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <PortfolioDetail :slug="slug" />
    </LayoutGridItem>
  </LayoutSection>
</template>
