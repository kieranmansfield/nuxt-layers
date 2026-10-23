<script setup lang="ts">
  import type { BlogCollectionItem } from '@nuxt/content'

  import type { BlogQueryOptions } from '../../types/content'

  const { items = undefined, options = {} } = defineProps<{
    items?: BlogCollectionItem[]
    options?: BlogQueryOptions
  }>()

  // Fetch only when the parent didn't pass items (e.g. a related-items list it already has).
  // ponytail: decided once at setup — toggling `items` after mount won't start or stop the fetch
  const fetched = items ? undefined : await useBlogPosts(options)
  const posts = computed(() => items ?? fetched?.data.value)
  const status = computed(() => (items ? 'success' : (fetched?.status.value ?? 'idle')))
</script>

<template>
  <NuxtContentList :status :has-items="!!posts?.length" empty-message="No blog posts found">
    <UBlogPosts orientation="vertical">
      <UBlogPost
        v-for="post in posts"
        :key="post.id"
        :title="post.title"
        :to="post.path"
        variant="outline"
        v-bind="{
          ...(post.date !== undefined && { date: post.date }),
          ...(post.description !== undefined && { description: post.description }),
          ...(post.image !== undefined && { image: post.image }),
          ...(post.badge !== undefined && { badge: post.badge }),
          ...(post.authors && {
            authors: post.authors.map((a) => ({
              name: a.name,
              ...(a.avatar && { avatar: { src: a.avatar } }),
              ...(a.link && { to: a.link, target: '_blank' as const }),
            })),
          }),
        }"
      />
    </UBlogPosts>
  </NuxtContentList>
</template>
