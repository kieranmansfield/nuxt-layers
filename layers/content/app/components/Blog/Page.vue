<script setup lang="ts">
  const { title = 'Blog', description = 'Articles and posts' } = defineProps<{
    title?: string
    description?: string
  }>()

  useContentSection('blog')
  useSeoMeta({ title: () => title, description: () => description })
</script>

<template>
  <NuxtContentIndexTemplate :title :description>
    <BlogList />
  </NuxtContentIndexTemplate>
</template>
