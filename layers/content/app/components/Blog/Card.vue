<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const {
  title,
  description,
  date,
  image,
  badge,
  authors = [],
  to,
} = defineProps<{
  title: string
  description?: string
  date?: string
  image?: string
  badge?: string
  authors?: { name: string; avatar?: string; url?: string }[]
  to?: string
}>()
</script>

<template>
  <UBlogPost
    :title
    :description
    :date
    :image
    :badge
    :authors="
      authors.map((a) => ({
        name: a.name,
        avatar: a.avatar ? { src: a.avatar } : undefined,
        to: a.url,
        target: a.url ? '_blank' : undefined,
      }))
    "
    :to
    variant="outline"
  />
</template>
