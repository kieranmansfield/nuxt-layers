<script setup lang="ts">
  import type { ObsidianPluginStats } from '#layers/project-stats/shared/types'

  const {
    plugin,
    stats: passed = undefined,
    showInstall = true,
    variant = 'default',
    to = undefined,
  } = defineProps<{
    /** Community plugin id, as in the obsidian.md/plugins?id= listing URL */
    plugin: string
    /** Stats the parent already has. Skips the fetch. */
    stats?: ObsidianPluginStats
    showInstall?: boolean
    /** `compact` keeps the name, description and figures; drops the footer details and buttons */
    variant?: 'default' | 'compact'
    /** Where the title links (e.g. a project page); defaults to the plugin's Obsidian listing */
    to?: string
  }>()

  const { stats, status } = usePassedOrFetchedStats(
    () => passed,
    () => useObsidianPluginStats(() => plugin)
  )

  const figures = computed(() => {
    const s = stats.value
    if (!s) return []
    return [
      { label: 'Downloads', value: s.downloads, icon: 'i-lucide-download' },
      ...(s.latestVersion
        ? [{ label: 'Version', value: s.latestVersion, icon: 'i-lucide-tag' }]
        : []),
      ...(s.latestVersionDownloads !== undefined
        ? [{ label: 'This version', value: s.latestVersionDownloads, icon: 'i-lucide-package' }]
        : []),
    ]
  })

  const listingUrl = computed(
    () => `https://obsidian.md/plugins?id=${encodeURIComponent(plugin.trim())}`
  )
</script>

<template>
  <UCard variant="outline" :ui="{ body: 'space-y-4' }">
    <template v-if="stats">
      <div class="min-w-0">
        <ULink
          :to="to ?? stats.listingUrl"
          :target="to ? null : '_blank'"
          class="text-highlighted flex items-center gap-2 font-semibold hover:underline"
        >
          <UIcon name="i-simple-icons-obsidian" class="size-5 shrink-0 text-violet-500" />
          <span class="truncate">{{ stats.name }}</span>
        </ULink>
        <p class="text-muted mt-0.5 text-xs">
          by
          <ULink
            v-if="stats.authorUrl"
            :to="stats.authorUrl"
            target="_blank"
            class="hover:underline"
          >
            {{ stats.author }}
          </ULink>
          <template v-else>{{ stats.author }}</template>
        </p>
        <p class="text-muted mt-2 text-sm">{{ stats.description }}</p>
      </div>

      <dl class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ProjectStatsStat v-for="stat in figures" :key="stat.label" v-bind="stat" />
      </dl>

      <ProjectStatsObsidianDetails v-if="variant !== 'compact'" :stats :show-install />
    </template>

    <ProjectStatsCardSkeleton v-else-if="status === 'pending' || status === 'idle'" :count="3" />

    <ULink
      v-else
      :to="listingUrl"
      target="_blank"
      class="text-muted flex items-center gap-2 text-sm hover:underline"
    >
      <UIcon name="i-simple-icons-obsidian" class="size-5" />
      View {{ plugin }} on obsidian.md
    </ULink>
  </UCard>
</template>
