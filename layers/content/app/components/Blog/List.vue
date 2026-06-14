<script setup lang="ts">
  import type { BlogQueryOptions } from '../../types/content'

  const { options = {} } = defineProps<{
    options?: BlogQueryOptions
  }>()

  const { data: posts, status } = await useBlogPosts(options)
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
