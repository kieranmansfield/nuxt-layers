<script setup lang="ts">
  import type { ObsidianPluginStats } from '#layers/project-stats/shared/types'

  const { stats, showInstall = true } = defineProps<{
    stats: ObsidianPluginStats
    showInstall?: boolean
  }>()
</script>

<template>
  <div class="text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
    <span v-if="stats.updatedAt" class="flex items-center gap-1">
      <UIcon name="i-lucide-clock" class="size-3.5" />
      Updated
      <NuxtTime :datetime="stats.updatedAt" month="short" day="numeric" year="numeric" />
    </span>
    <span v-if="stats.minAppVersion" class="flex items-center gap-1">
      <UIcon name="i-lucide-info" class="size-3.5" />Obsidian {{ stats.minAppVersion }}+
    </span>
    <UBadge v-if="stats.isDesktopOnly" color="neutral" variant="subtle" size="xs">
      Desktop only
    </UBadge>
  </div>

  <div class="flex flex-wrap gap-2">
    <UButton v-if="showInstall" :to="stats.installUrl" external icon="i-lucide-download" size="sm">
      Install in Obsidian
    </UButton>
    <UButton
      :to="stats.repoUrl"
      target="_blank"
      icon="i-lucide-github"
      color="neutral"
      variant="outline"
      size="sm"
    >
      Source
    </UButton>
    <UButton
      v-if="stats.fundingUrl"
      :to="stats.fundingUrl"
      target="_blank"
      icon="i-lucide-heart"
      color="neutral"
      variant="ghost"
      size="sm"
    >
      Support
    </UButton>
  </div>
</template>
