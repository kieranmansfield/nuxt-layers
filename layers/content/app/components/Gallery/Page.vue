<script setup lang="ts">
  const { title = 'Gallery', description = 'Photo collections and visual work' } = defineProps<{
    title?: string
    description?: string
  }>()

  useContentSection('gallery')
  useSeoMeta({ title: () => title, description: () => description })
</script>

<template>
  <NuxtContentIndexTemplate :title :description>
    <GalleryGrid />
  </NuxtContentIndexTemplate>
</template>
