<script setup lang="ts">
  const { title = 'Portfolio', description = 'Featured projects and work' } = defineProps<{
    title?: string
    description?: string
  }>()

  useContentSection('portfolio')
  useSeoMeta({ title: () => title, description: () => description })
</script>

<template>
  <NuxtContentIndexTemplate :title :description>
    <PortfolioList />
  </NuxtContentIndexTemplate>
</template>
