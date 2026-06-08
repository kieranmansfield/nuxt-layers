<script setup lang="ts">
  const { slug, index } = defineProps<{
    slug: string
    index: number
  }>()
  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.gallery === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryImageDetail :slug :index />
    </LayoutGridItem>
  </LayoutSection>
</template>
