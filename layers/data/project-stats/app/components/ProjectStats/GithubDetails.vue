<script setup lang="ts">
  import type { GithubRepoStats } from '#layers/project-stats/shared/types'

  const { stats } = defineProps<{ stats: GithubRepoStats }>()
</script>

<template>
  <div class="text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
    <span v-if="stats.language" class="flex items-center gap-1">
      <UIcon name="i-lucide-code" class="size-3.5" />{{ stats.language }}
    </span>
    <span v-if="stats.license" class="flex items-center gap-1">
      <UIcon name="i-lucide-scale" class="size-3.5" />{{ stats.license }}
    </span>
    <ULink
      v-if="stats.latestRelease"
      :to="stats.latestRelease.url"
      target="_blank"
      class="flex items-center gap-1 hover:underline"
    >
      <UIcon name="i-lucide-tag" class="size-3.5" />{{ stats.latestRelease.tag }}
    </ULink>
    <span v-if="stats.pushedAt" class="flex items-center gap-1">
      <UIcon name="i-lucide-clock" class="size-3.5" />
      Updated
      <NuxtTime :datetime="stats.pushedAt" month="short" day="numeric" year="numeric" />
    </span>
  </div>
</template>
