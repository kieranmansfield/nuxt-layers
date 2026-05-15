<script setup lang="ts">
  definePageMeta({ name: 'content-blog-slug' })

  const { contentLayer } = useAppConfig()
  if (contentLayer?.sections?.blog === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const route = useRoute()
  const slug = route.params.slug as string
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <BlogArticle :slug="slug" />
    </LayoutGridItem>
  </LayoutSection>
</template>
