<script setup lang="ts">
  import type { Collections } from '@nuxt/content'

  import type { PortfolioQueryOptions } from '../../types/content'

  const {
    items: passed = undefined,
    options = {},
    collection = 'portfolio',
  } = defineProps<{
    items?: Collections[keyof Collections][]
    options?: PortfolioQueryOptions
    collection?: keyof Collections
  }>()

  const { featured, tags, limit } = options
  // Fetch only when the parent didn't pass items (e.g. a related-items list it already has).
  // ponytail: decided once at setup — toggling `items` after mount won't start or stop the fetch
  const fetched = passed
    ? undefined
    : await useCollectionItems(collection, {
        tags,
        limit,
        sortKey: 'year',
        sortDirection: 'desc',
        filter: featured !== undefined ? (item) => fieldFeatured(item) === featured : undefined,
      })
  const items = computed(() => passed ?? fetched?.data.value)
  const status = computed(() => (passed ? 'success' : (fetched?.status.value ?? 'idle')))

  function fieldFeatured(item: unknown): boolean {
    return typeof item === 'object' && item !== null && 'featured' in item
      ? Boolean((item as { featured?: boolean }).featured)
      : false
  }

  // Items may come from any collection — normalize the portfolio-style
  // metadata so the template works on a single shape
  const cards = computed(() =>
    (items.value ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      path: item.path,
      image: 'image' in item ? item.image : undefined,
      client: 'client' in item ? item.client : undefined,
      year: 'year' in item ? item.year : undefined,
      tags: 'tags' in item ? (item.tags ?? []) : [],
    }))
  )
</script>

<template>
  <NuxtContentList :status :has-items="!!cards.length" empty-message="No items found">
    <UPageGrid>
      <UPageCard
        v-for="item in cards"
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
          class="h-48 w-full rounded object-contain"
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
