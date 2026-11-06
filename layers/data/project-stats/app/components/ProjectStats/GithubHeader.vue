<script setup lang="ts">
  import type { GithubRepoStats } from '#layers/project-stats/shared/types'

  const { stats, to = undefined } = defineProps<{
    stats: GithubRepoStats
    to?: string | undefined
  }>()
</script>

<template>
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <ULink
        :to="to ?? stats.url"
        :target="to ? null : '_blank'"
        class="text-highlighted flex items-center gap-2 font-semibold hover:underline"
      >
        <UIcon name="i-lucide-github" class="size-5 shrink-0" />
        <span class="truncate">{{ stats.fullName }}</span>
      </ULink>
      <p v-if="stats.description" class="text-muted mt-1 text-sm">
        {{ stats.description }}
      </p>
    </div>
    <UBadge v-if="stats.archived" color="warning" variant="subtle" size="sm">Archived</UBadge>
  </div>
</template>
