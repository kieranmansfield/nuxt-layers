<script setup lang="ts">
  import type { ContentLayerConfig } from '#layers/content/app/types/content'

  const { slug, index } = defineProps<{
    slug: string
    index: number
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
      <GalleryImageDetail :slug :index />
    </LayoutGridItem>
  </LayoutSection>
</template>
