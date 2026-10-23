<script setup lang="ts">
  const { slug } = defineProps<{
    slug: string
  }>()

  useContentSection('gallery')
  await useContentItemSeo('gallery', slug)
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryDetail :slug />
    </LayoutGridItem>
  </LayoutSection>
</template>
