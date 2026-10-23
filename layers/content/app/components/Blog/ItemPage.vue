<script setup lang="ts">
  const { slug } = defineProps<{
    slug: string
  }>()

  useContentSection('blog')
  await useContentItemSeo('blog', slug)
</script>

<template>
  <LayoutSection>
    <LayoutGridItem>
      <BlogArticle :slug />
    </LayoutGridItem>
  </LayoutSection>
</template>
