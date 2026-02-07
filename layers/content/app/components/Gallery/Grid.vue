<script setup lang="ts">
import type { GalleryQueryOptions } from '../../types/content'

const { options = {} } = defineProps<{
  options?: GalleryQueryOptions
}>()

const { data: items, status } = await useGalleryItems(options)
</script>

<template>
  <NuxtContentList :status="status" :has-items="!!items?.length" empty-message="No gallery items found">
    <UPageGrid>
      <UPageCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :to="item.path"
        variant="outline"
      >
        <img
          v-if="item.images?.[0]"
          :src="item.images[0].src"
          :alt="item.images[0].alt"
          class="w-full h-48 object-cover rounded"
        />
        <template #footer>
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="item.images?.length" class="text-xs text-muted">
              {{ item.images.length }} image{{ item.images.length === 1 ? '' : 's' }}
            </span>
            <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="subtle" size="xs">
              {{ tag }}
            </UBadge>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </NuxtContentList>
</template>
