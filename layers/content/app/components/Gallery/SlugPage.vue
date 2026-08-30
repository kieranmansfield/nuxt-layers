<script setup lang="ts">
  import type { ContentLayerConfig } from '#layers/content/app/types/content'

  const { slug } = defineProps<{
    slug: string
  }>()

  const appConfig = useAppConfig()
  const contentLayer = appConfig.contentLayer as ContentLayerConfig | undefined
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
