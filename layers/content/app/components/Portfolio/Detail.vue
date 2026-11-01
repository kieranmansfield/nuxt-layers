<script setup lang="ts">
  import type { PageCollections, PortfolioCollectionItem } from '@nuxt/content'

  const { slug, collection = 'portfolio' } = defineProps<{
    slug: string
    collection?: keyof PageCollections
  }>()

  const asPortfolio = (item: unknown) => item as PortfolioCollectionItem

  // Collections are declared without a schema (see layer CLAUDE.md), so Nuxt Content keeps
  // custom frontmatter under `meta` — read both so the stats cards show either way
  function statsField(item: unknown, key: 'github' | 'obsidian'): string | undefined {
    const record = item as Record<string, unknown> & { meta?: Record<string, unknown> }
    const value = record[key] ?? record.meta?.[key]
    return typeof value === 'string' && value.trim() ? value : undefined
  }
  // Without a collection schema, Nuxt Content files extra frontmatter under `meta`
  const stackOf = (item: unknown) =>
    asPortfolio(item).stack ??
    (asPortfolio(item).meta as Pick<PortfolioCollectionItem, 'stack'> | undefined)?.stack ??
    []
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
        class="mb-8 w-full rounded-lg"
      />
    </template>

    <template #after-content="{ item }">
      <template v-if="statsField(item, 'github') || statsField(item, 'obsidian')">
        <USeparator class="my-8" />
        <div class="grid items-start gap-4 md:grid-cols-2">
          <ProjectStatsGithubCard
            v-if="statsField(item, 'github')"
            :repo="statsField(item, 'github')!"
          />
          <ProjectStatsObsidianCard
            v-if="statsField(item, 'obsidian')"
            :plugin="statsField(item, 'obsidian')!"
          />
        </div>
      </template>
      <template
        v-if="
          stackOf(item).length ||
          asPortfolio(item).colors?.length ||
          asPortfolio(item).typography?.length
        "
      >
        <USeparator class="my-8" />
        <div class="space-y-8">
          <PortfolioStackGrid v-if="stackOf(item).length" :items="stackOf(item)" />
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
