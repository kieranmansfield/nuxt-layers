<script setup lang="ts">
const { contentLayer } = useAppConfig()
if (contentLayer?.sections?.portfolio === false) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

useSeoMeta({
  title: 'Portfolio',
  description: 'Featured projects and work',
})
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <UPageHeader title="Portfolio" description="Featured projects and work" />
      <UPageBody>
        <PortfolioList />
      </UPageBody>
    </LayoutGridItem>
  </LayoutSection>
</template>
