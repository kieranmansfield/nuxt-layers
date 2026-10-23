<script setup lang="ts">
  import { computed } from 'vue'

  import { type FeedRoute } from '../../utils/feed-catalog'

  const { route, compact = false } = defineProps<{
    route: FeedRoute
    compact?: boolean
  }>()

  const routeThemes: Record<
    'index' | 'rss' | 'atom' | 'json',
    {
      strip: string
      dot: string
    }
  > = {
    index: {
      strip: 'bg-accented',
      dot: 'bg-inverted/40',
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

    return route.contentType ?? 'Reader-friendly syndicated feed.'
  }
</script>

<template>
  <UCard
    :to="route.path"
    :ui="{ body: 'p-0' }"
    class="group border-default bg-default/90 hover:border-accented @container relative overflow-hidden shadow-none transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="absolute inset-y-0 left-0 w-1" :class="routeTone.strip" />
    <div :class="compact ? 'flex items-center gap-3 p-3' : 'flex items-center gap-3 p-4'">
      <span class="h-2.5 w-2.5 rounded-full" :class="routeTone.dot" />
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <p class="text-highlighted font-medium">
            {{ route.label }}
          </p>
          <code class="bg-elevated text-muted shrink-0 rounded-full px-2 py-1 font-mono text-xs">
            {{ route.path }}
          </code>
        </div>
        <p class="text-muted mt-1 text-xs">
          {{ getRouteDescription() }}
        </p>
      </div>
    </div>
  </UCard>
</template>
