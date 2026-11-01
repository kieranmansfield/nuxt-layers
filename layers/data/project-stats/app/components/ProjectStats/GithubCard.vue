<script setup lang="ts">
  const {
    repo,
    showTopics = true,
    variant = 'default',
    to = undefined,
  } = defineProps<{
    /** `owner/name` or a github.com URL */
    repo: string
    showTopics?: boolean
    /** `compact` keeps the name, description and figures; drops the topics and footer details */
    variant?: 'default' | 'compact'
    /** Where the title links (e.g. a project page); defaults to the repository */
    to?: string
  }>()

  const { data: stats, status } = useGithubRepoStats(() => repo)

  const figures = computed(() => {
    const s = stats.value
    if (!s) return []
    return [
      { label: 'Stars', value: s.stars, icon: 'i-lucide-star' },
      { label: 'Forks', value: s.forks, icon: 'i-lucide-git-fork' },
      // Most repos have no release assets — show watchers instead of a row of zeros
      s.downloads > 0
        ? { label: 'Downloads', value: s.downloads, icon: 'i-lucide-download' }
        : { label: 'Watchers', value: s.watchers, icon: 'i-lucide-eye' },
      { label: 'Open issues', value: s.openIssues, icon: 'i-lucide-circle-dot' },
    ]
  })

  // Link the fallback card to whatever the caller passed, even when the API call failed
  const fallbackUrl = computed(() =>
    repo.startsWith('http') ? repo : `https://github.com/${repo.trim()}`
  )
</script>

<template>
  <UCard variant="outline" :ui="{ body: 'space-y-4' }">
    <template v-if="stats">
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

      <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ProjectStatsStat v-for="stat in figures" :key="stat.label" v-bind="stat" />
      </dl>

      <div
        v-if="showTopics && variant !== 'compact' && stats.topics.length"
        class="flex flex-wrap gap-1.5"
      >
        <UBadge
          v-for="topic in stats.topics"
          :key="topic"
          color="neutral"
          variant="subtle"
          size="xs"
        >
          {{ topic }}
        </UBadge>
      </div>

      <div
        v-if="variant !== 'compact'"
        class="text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
      >
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

    <div v-else-if="status === 'pending' || status === 'idle'" class="space-y-4">
      <USkeleton class="h-5 w-48" />
      <USkeleton class="h-4 w-full" />
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <USkeleton v-for="n in 4" :key="n" class="h-12" />
      </div>
    </div>

    <ULink
      v-else
      :to="fallbackUrl"
      target="_blank"
      class="text-muted flex items-center gap-2 text-sm hover:underline"
    >
      <UIcon name="i-lucide-github" class="size-5" />
      View {{ repo }} on GitHub
    </ULink>
  </UCard>
</template>
