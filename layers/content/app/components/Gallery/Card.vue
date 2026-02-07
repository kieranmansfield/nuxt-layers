<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const {
  title,
  description,
  coverImage,
  imageCount = 0,
  tags = [],
  to,
} = defineProps<{
  title: string
  description?: string
  coverImage?: { src: string; alt: string }
  imageCount?: number
  tags?: string[]
  to?: string
}>()
</script>

<template>
  <UPageCard :title :description :to variant="outline">
    <img
      v-if="coverImage"
      :src="coverImage.src"
      :alt="coverImage.alt"
      class="w-full h-48 object-cover rounded"
    />
    <template #footer>
      <div class="flex flex-wrap items-center gap-2">
        <span v-if="imageCount" class="text-xs text-muted">
          {{ imageCount }} image{{ imageCount === 1 ? '' : 's' }}
        </span>
        <UBadge v-for="tag in tags" :key="tag" color="neutral" variant="subtle" size="xs">
          {{ tag }}
        </UBadge>
      </div>
    </template>
  </UPageCard>
</template>
