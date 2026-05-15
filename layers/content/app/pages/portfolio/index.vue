<script setup lang="ts">
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
