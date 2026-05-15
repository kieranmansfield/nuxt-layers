<script setup lang="ts">
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
