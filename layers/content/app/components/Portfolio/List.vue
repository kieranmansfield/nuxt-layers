<script setup lang="ts">
// @ts-nocheck
import type { PortfolioQueryOptions } from '../../types/content'

const { options = {}, collection = 'portfolio' } = defineProps<{
  options?: PortfolioQueryOptions
  collection?: string
}>()

const { useItems } = createPortfolioComposables(collection)
const { data: items, status } = await useItems(options)
</script>

<template>
  <NuxtContentList
    :status="status"
    :has-items="!!items?.length"
    empty-message="No items found"
  >
    <UPageGrid>
      <UPageCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        variant="outline"
        v-bind="{
          ...(item.description !== undefined && { description: item.description }),
          to: item.path,
        }"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          class="w-full h-48 object-cover rounded"
        />
        <template #footer>
          <div class="flex flex-wrap gap-1.5">
            <UBadge v-if="item.client" color="primary" variant="subtle" size="xs">
              {{ item.client }}
            </UBadge>
            <UBadge v-if="item.year" color="neutral" variant="subtle" size="xs">
              {{ item.year }}
            </UBadge>
            <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="subtle" size="xs">
              {{ tag }}
            </UBadge>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </NuxtContentList>
</template>
