<script setup lang="ts">
const { slug } = defineProps<{
  slug: string
}>()
</script>

<template>
  <NuxtContentDetail collection="blog" :slug not-found-message="Blog post not found">
    <template #headline="{ item }">
      <div class="flex items-center gap-3 text-sm text-muted">
        <time v-if="item.date">{{ new Date(item.date).toLocaleDateString() }}</time>
        <UBadge v-if="item.badge" color="primary" variant="subtle">
          {{ item.badge }}
        </UBadge>
      </div>
    </template>

    <template #after-content="{ item }">
      <template v-if="item.tags?.length">
        <USeparator class="my-8" />
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="subtle">
            {{ tag }}
          </UBadge>
        </div>
      </template>
    </template>
  </NuxtContentDetail>
</template>
