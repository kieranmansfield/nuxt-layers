<script setup lang="ts">
  import type { ContentLayerConfig } from '#layers/content/app/types/content'

  const appConfig = useAppConfig()
  const contentLayer = appConfig.contentLayer as ContentLayerConfig | undefined
  if (contentLayer?.sections?.blog === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  useSeoMeta({
    title: 'Blog',
    description: 'Articles and posts',
  })
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <UPageHeader title="Blog" description="Articles and posts" />
      <UPageBody>
        <BlogList />
      </UPageBody>
    </LayoutGridItem>
  </LayoutSection>
</template>
