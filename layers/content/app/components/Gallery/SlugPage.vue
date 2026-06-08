<script setup lang="ts">
  const { slug } = defineProps<{
    slug: string
  }>()
  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.gallery === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryDetail :slug />
    </LayoutGridItem>
  </LayoutSection>
</template>
