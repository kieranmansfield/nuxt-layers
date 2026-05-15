<script setup lang="ts">
  definePageMeta({ name: 'content-blog-slug' })

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
