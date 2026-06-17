<script setup lang="ts">
  import { type FeedRoute } from '../../utils/feed-catalog'

  const { route, compact = false } = defineProps<{
    route: FeedRoute
    compact?: boolean
  }>()

  const routeThemes: Record<
    'index' | 'discovery' | 'rss' | 'atom' | 'json',
    {
      strip: string
      dot: string
    }
  > = {
    index: {
      strip: 'bg-slate-400',
      dot: 'bg-slate-500',
    },
    discovery: {
      strip: 'bg-sky-400',
      dot: 'bg-sky-500',
    },
    rss: {
      strip: 'bg-orange-400',
      dot: 'bg-orange-500',
    },
    atom: {
      strip: 'bg-violet-400',
      dot: 'bg-violet-500',
    },
    json: {
      strip: 'bg-amber-400',
      dot: 'bg-amber-500',
    },
  }

  const routeTone = computed(
    () => routeThemes[route.kind === 'format' ? (route.format ?? 'index') : route.kind]
  )

  function getRouteDescription() {
    if (route.kind === 'index') {
      return 'Human landing page for the feed catalog.'
    }

    if (route.kind === 'discovery') {
      return 'JSON manifest of every exposed collection feed.'
    }

    return route.contentType ?? 'Reader-friendly syndicated feed.'
  }
</script>

<template>
  <UCard
    :to="route.path"
    :ui="{ body: 'p-0' }"
    class="group relative overflow-hidden border-slate-200/80 bg-white/90 shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/55 dark:hover:border-slate-700"
  >
    <div class="absolute inset-y-0 left-0 w-1" :class="routeTone.strip" />
    <div :class="compact ? 'flex items-center gap-3 p-3' : 'flex items-center gap-3 p-4'">
      <span class="h-2.5 w-2.5 rounded-full" :class="routeTone.dot" />
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <p class="font-medium text-slate-950 dark:text-slate-100">
            {{ route.label }}
          </p>
          <code
            class="shrink-0 rounded-full bg-slate-100 px-2 py-1 font-mono text-[0.72rem] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {{ route.path }}
          </code>
        </div>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {{ getRouteDescription() }}
        </p>
      </div>
    </div>
  </UCard>
</template>
