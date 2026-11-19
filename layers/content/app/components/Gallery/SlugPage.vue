<script setup lang="ts">
  const { slug } = defineProps<{
    slug: string
  }>()

  useContentSection('gallery')
  await useContentItemSeo('gallery', slug)
</script>

<template>
  <NuxtContentDetailTemplate>
    <GalleryDetail :slug />
  </NuxtContentDetailTemplate>
</template>
