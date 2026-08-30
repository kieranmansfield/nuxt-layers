<script setup lang="ts">
  import type { ContentLayerConfig } from '#layers/content/app/types/content'

  const { slug } = defineProps<{
    slug: string
  }>()

  const appConfig = useAppConfig()
  const contentLayer = appConfig.contentLayer as ContentLayerConfig | undefined
  if (contentLayer?.sections?.blog === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <BlogArticle :slug />
    </LayoutGridItem>
  </LayoutSection>
</template>
