<script setup lang="ts">
const { contentLayer } = useAppConfig()
if (contentLayer?.sections?.gallery === false) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const { slug } = defineProps<{
  slug: string
}>()
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <GalleryDetail :slug />
    </LayoutGridItem>
  </LayoutSection>
</template>
