<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

const { slug } = defineProps<{
  slug: string
}>()

const asBlog = (item: unknown) => item as BlogCollectionItem
</script>

<template>
  <NuxtContentDetail collection="blog" :slug not-found-message="Blog post not found">
    <template #headline="{ item }">
      <div class="flex items-center gap-3 text-sm text-muted">
        <time v-if="asBlog(item).date">{{ new Date(asBlog(item).date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
        <UBadge v-if="asBlog(item).badge" color="primary" variant="subtle">
          {{ asBlog(item).badge }}
        </UBadge>
      </div>
    </template>

    <template #after-content="{ item }">
      <template v-if="asBlog(item).tags?.length">
        <USeparator class="my-8" />
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="tag in asBlog(item).tags" :key="tag" color="neutral" variant="subtle">
            {{ tag }}
          </UBadge>
        </div>
      </template>
    </template>
  </NuxtContentDetail>
</template>
