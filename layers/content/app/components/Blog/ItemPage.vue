<script setup lang="ts">
  const { slug } = defineProps<{
    slug: string
  }>()

  useContentSection('blog')
  await useContentItemSeo('blog', slug)
</script>

<template>
  <NuxtContentDetailTemplate>
    <BlogArticle :slug />
  </NuxtContentDetailTemplate>
</template>
