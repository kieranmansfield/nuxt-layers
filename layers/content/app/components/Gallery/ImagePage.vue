<script setup lang="ts">
  import type { GalleryCollectionItem } from '@nuxt/content'

  const { slug, index } = defineProps<{
    slug: string
    index: number
  }>()

  useContentSection('gallery')

  const { data } = await useCollectionItem('gallery', slug)
  const meta = computed(() => galleryImageMeta(data.value as GalleryCollectionItem | null, index))
  useSeoMeta({
    title: () => meta.value.title,
    description: () => meta.value.description,
    ogImage: () => meta.value.ogImage,
  })
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryImageDetail :slug :index />
    </LayoutGridItem>
  </LayoutSection>
</template>
