<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const index = Number(route.params.imageId)
</script>

<template>
  <UContainer>
    <GalleryImageDetail :slug="slug" :index="index" />
  </UContainer>
</template>
