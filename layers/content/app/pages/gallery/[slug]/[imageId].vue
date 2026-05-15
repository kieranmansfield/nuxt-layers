<script setup lang="ts">
  const route = useRoute()
  const slug = route.params.slug as string
  const index = Number(route.params.imageId)
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryImageDetail :slug="slug" :index="index" />
    </LayoutGridItem>
  </LayoutSection>
</template>
