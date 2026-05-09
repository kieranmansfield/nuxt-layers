<script setup lang="ts">
import type { BlogQueryOptions } from '../../types/content'

const { options = {} } = defineProps<{
  options?: BlogQueryOptions
}>()

const { data: posts, status } = await useBlogPosts(options)
</script>

<template>
  <NuxtContentList
    :status="status"
    :has-items="!!posts?.length"
    empty-message="No blog posts found"
  >
    <UBlogPosts orientation="vertical">
      <UBlogPost
        v-for="post in posts"
        :key="post.id"
        :title="post.title"
        :date="post.date"
        :to="post.path"
        variant="outline"
        v-bind="{
          ...(post.description !== undefined && { description: post.description }),
          ...(post.image !== undefined && { image: post.image }),
          ...(post.badge !== undefined && { badge: post.badge }),
          ...(post.authors && {
            authors: post.authors.map((a) => ({
              name: a.name,
              ...(a.avatar && { avatar: { src: a.avatar } }),
              ...(a.url && { to: a.url, target: '_blank' as const }),
            })),
          }),
        }"
      />
    </UBlogPosts>
  </NuxtContentList>
</template>
