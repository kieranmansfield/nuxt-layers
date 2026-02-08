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
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="item.path"
        class="group rounded-lg border border-default overflow-hidden block"
      >
        <div class="relative overflow-hidden">
          <img
            v-if="item.images?.[0]"
            :src="item.images[0].src"
            :alt="item.images[0].alt"
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span class="text-white font-semibold text-center px-3">
              {{ item.title }}
            </span>
          </div>
        </div>
        <div class="p-3 space-y-1.5">
          <p class="font-medium text-highlighted">{{ item.title }}</p>
          <p v-if="item.description" class="text-sm text-muted line-clamp-2">{{ item.description }}</p>
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="item.images?.length" class="text-xs text-muted">
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
