<script setup lang="ts">
definePageMeta({ name: 'content-blog-slug' })

const route = useRoute()
const slug = route.params.slug as string
</script>

<template>
  <UContainer>
    <BlogArticle :slug="slug" />
  </UContainer>
</template>
