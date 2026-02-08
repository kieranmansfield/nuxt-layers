<script setup lang="ts">
const { slug } = defineProps<{
  slug: string
}>()
</script>

<template>
  <NuxtContentDetail collection="portfolio" :slug not-found-message="Portfolio item not found" hide-toc>
    <template #headline="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge v-if="item.client" color="primary" variant="subtle">
          {{ item.client }}
        </UBadge>
        <UBadge v-if="item.year" color="neutral" variant="subtle">
          {{ item.year }}
        </UBadge>
        <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="subtle" size="xs">
          {{ tag }}
        </UBadge>
      </div>
    </template>

    <template #links="{ item }">
      <UButton
        v-if="item.url"
        :to="item.url"
        target="_blank"
        icon="i-lucide-external-link"
        variant="outline"
      >
        Visit Project
      </UButton>
    </template>

    <template #before-content="{ item }">
      <img v-if="item.image" :src="item.image" :alt="item.title" class="w-full rounded-lg mb-8" />
    </template>

    <template #after-content="{ item }">
      <template v-if="item.colors?.length || item.typography?.length">
        <USeparator class="my-8" />
        <div class="space-y-8">
          <PortfolioColorPalette v-if="item.colors?.length" :colors="item.colors" />
          <PortfolioTypography v-if="item.typography?.length" :typography="item.typography" />
        </div>
      </template>
    </template>
  </NuxtContentDetail>
</template>
