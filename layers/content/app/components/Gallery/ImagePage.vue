<script setup lang="ts">
const { contentLayer } = useAppConfig()
if (contentLayer?.sections?.gallery === false) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const { slug, index } = defineProps<{
  slug: string
  index: number
}>()
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryImageDetail :slug :index />
    </LayoutGridItem>
  </LayoutSection>
</template>
