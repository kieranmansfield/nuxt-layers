<script setup lang="ts">
  import type { GalleryQueryOptions } from '../../types/content'

  const { options = {} } = defineProps<{
    options?: GalleryQueryOptions
  }>()

  const { data: items, status } = await useGalleryItems(options)
</script>

<template>
  <NuxtContentList :status :has-items="!!items?.length" empty-message="No gallery items found">
    <UPageGrid>
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="item.path"
        class="group border-default block overflow-hidden rounded-lg border"
      >
        <div class="relative overflow-hidden">
          <img
            v-if="item.images?.[0]"
            :src="item.images[0].src"
            :alt="item.images[0].alt"
            class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            class="bg-primary/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <span class="px-3 text-center font-semibold text-white">
              {{ item.title }}
            </span>
          </div>
        </div>
        <div class="space-y-1.5 p-3">
          <p class="text-highlighted font-medium">{{ item.title }}</p>
          <p v-if="item.description" class="text-muted line-clamp-2 text-sm">
            {{ item.description }}
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="item.images?.length" class="text-muted text-xs">
              {{ item.images.length }} image{{ item.images.length === 1 ? '' : 's' }}
            </span>
            <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="subtle" size="xs">
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </NuxtLink>
    </UPageGrid>
  </NuxtContentList>
</template>
