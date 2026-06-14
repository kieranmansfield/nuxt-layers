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

  const cardProps = computed(() => ({
    ...(description !== undefined && { description }),
    ...(to !== undefined && { to }),
  }))
</script>

<template>
  <UPageCard :title v-bind="cardProps" variant="outline">
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
