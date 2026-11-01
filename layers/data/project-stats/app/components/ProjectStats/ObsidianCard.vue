<script setup lang="ts">
  const { plugin, showInstall = true } = defineProps<{
    /** Community plugin id, as in the obsidian.md/plugins?id= listing URL */
    plugin: string
    showInstall?: boolean
  }>()

  const { data: stats, status } = useObsidianPluginStats(() => plugin)

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
          :to="stats.listingUrl"
          target="_blank"
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
        <UButton
          v-if="showInstall"
          :to="stats.installUrl"
          external
          icon="i-lucide-download"
          size="sm"
        >
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

    <div v-else-if="status === 'pending' || status === 'idle'" class="space-y-4">
      <USkeleton class="h-5 w-40" />
      <USkeleton class="h-4 w-full" />
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <USkeleton v-for="n in 3" :key="n" class="h-12" />
      </div>
    </div>

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
