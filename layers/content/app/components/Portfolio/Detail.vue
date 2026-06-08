<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import type { PortfolioCollectionItem } from '@nuxt/content'

  const { slug, collection = 'portfolio' } = defineProps<{
    slug: string
    collection?: string
  }>()

  const asPortfolio = (item: unknown) => item as PortfolioCollectionItem
</script>

<template>
  <NuxtContentDetail :collection :slug not-found-message="Item not found" hide-toc>
    <template #headline="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge v-if="asPortfolio(item).client" color="primary" variant="subtle">
          {{ asPortfolio(item).client }}
        </UBadge>
        <UBadge v-if="asPortfolio(item).year" color="neutral" variant="subtle">
          {{ asPortfolio(item).year }}
        </UBadge>
        <UBadge
          v-for="tag in asPortfolio(item).tags"
          :key="tag"
          color="neutral"
          variant="subtle"
          size="xs"
        >
          {{ tag }}
        </UBadge>
      </div>
    </template>

    <template #links="{ item }">
      <UButton
        v-if="asPortfolio(item).url"
        :to="asPortfolio(item).url"
        target="_blank"
        icon="i-lucide-external-link"
        variant="outline"
      >
        Visit Project
      </UButton>
    </template>

    <template #before-content="{ item }">
      <img
        v-if="asPortfolio(item).image"
        :src="asPortfolio(item).image"
        :alt="item.title"
        class="w-full rounded-lg mb-8"
      />
    </template>

    <template #after-content="{ item }">
      <template v-if="asPortfolio(item).colors?.length || asPortfolio(item).typography?.length">
        <USeparator class="my-8" />
        <div class="space-y-8">
          <PortfolioColorPalette
            v-if="asPortfolio(item).colors?.length"
            :colors="asPortfolio(item).colors!"
          />
          <PortfolioTypography
            v-if="asPortfolio(item).typography?.length"
            :typography="asPortfolio(item).typography!"
          />
        </div>
      </template>
    </template>
  </NuxtContentDetail>
</template>
