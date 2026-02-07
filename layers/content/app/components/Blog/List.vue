<script setup lang="ts">
import type { BlogQueryOptions } from '../../types/content'

const { options = {} } = defineProps<{
  options?: BlogQueryOptions
}>()

const { data: posts, status } = await useBlogPosts(options)
</script>

<template>
  <NuxtContentList :status="status" :has-items="!!posts?.length" empty-message="No blog posts found">
    <UBlogPosts orientation="vertical">
      <UBlogPost
        v-for="post in posts"
        :key="post.id"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :image="post.image"
        :badge="post.badge"
        :authors="
          post.authors?.map((a) => ({
            name: a.name,
            avatar: a.avatar ? { src: a.avatar } : undefined,
            to: a.url,
            target: a.url ? '_blank' : undefined,
          }))
        "
        :to="post.path"
        variant="outline"
      />
    </UBlogPosts>
  </NuxtContentList>
</template>
