<script setup lang="ts">
  const {
    title,
    description = undefined,
    date = undefined,
    image = undefined,
    badge = undefined,
    authors = [],
    to = undefined,
  } = defineProps<{
    title: string
    description?: string
    date?: string
    image?: string
    badge?: string
    authors?: { name: string; avatar?: string; url?: string }[]
    to?: string
  }>()

  const postProps = computed(() => ({
    ...(description !== undefined && { description }),
    ...(date !== undefined && { date }),
    ...(image !== undefined && { image }),
    ...(badge !== undefined && { badge }),
    ...(to !== undefined && { to }),
  }))
</script>

<template>
  <UBlogPost
    :title
    v-bind="postProps"
    :authors="
      authors.map((a) => ({
        name: a.name,
        ...(a.avatar && { avatar: { src: a.avatar } }),
        ...(a.url && { to: a.url, target: '_blank' as const }),
      }))
    "
    variant="outline"
  />
</template>
