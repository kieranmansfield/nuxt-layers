<script setup lang="ts">
  import type { GithubRepoStats } from '#layers/project-stats/shared/types'

  const {
    repo,
    stats: passed = undefined,
    showTopics = true,
    variant = 'default',
    to = undefined,
  } = defineProps<{
    /** `owner/name` or a github.com URL */
    repo: string
    /** Stats the parent already has. Skips the fetch. */
    stats?: GithubRepoStats
    showTopics?: boolean
    /** `compact` keeps the name, description and figures; drops the topics and footer details */
    variant?: 'default' | 'compact'
    /** Where the title links (e.g. a project page); defaults to the repository */
    to?: string
  }>()

  const { stats, status } = usePassedOrFetchedStats(
    () => passed,
    () => useGithubRepoStats(() => repo)
  )

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
      <ProjectStatsGithubHeader :stats :to />

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

      <ProjectStatsGithubDetails v-if="variant !== 'compact'" :stats />
    </template>

    <ProjectStatsCardSkeleton v-else-if="status === 'pending' || status === 'idle'" :count="4" />

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
