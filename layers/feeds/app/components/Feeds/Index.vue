<script setup lang="ts">
  import contentManifest from '#content/manifest'

  import { createFeedCatalog } from '../../utils/feed-catalog'

  const appConfig = useAppConfig()

  const catalog = computed(() =>
    createFeedCatalog({
      site: appConfig.site,
      feed: appConfig.feedsLayer?.feed,
      manifest: contentManifest,
    })
  )
</script>

<template>
  <div
    class="relative overflow-hidden rounded-4xl border border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,251,244,0.96),rgba(243,236,223,0.95))] px-5 py-5 shadow-[0_30px_100px_rgba(15,23,42,0.12)] dark:border-slate-800/80 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(3,7,18,0.98))] sm:px-6 sm:py-6"
  >
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -right-20 top-0 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-500/15"
      />
      <div
        class="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-sky-400/12 blur-3xl dark:bg-sky-500/10"
      />
      <div
        class="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-orange-400/35 to-transparent"
      />
    </div>

    <div class="relative space-y-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div class="space-y-6">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-amber-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-amber-200"
          >
            <UIcon name="i-lucide-rss" class="text-sm" />
            Feeds layer
          </div>

          <div class="space-y-3">
            <h1
              class="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl dark:text-slate-50"
            >
              Feed catalog for {{ catalog.site.title }}
            </h1>
            <p class="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg dark:text-slate-300">
              Configured in <code class="font-mono text-[0.9em]">app.config.ts</code>, validated
              against <code class="font-mono text-[0.9em]">content.config.ts</code>, and rendered as
              a human-readable index for readers and site owners.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div
              class="rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
            >
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
              >
                Default
              </p>
              <p class="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                {{ catalog.feed.defaultCollection }}
              </p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Shorthand routes point here.
              </p>
            </div>

            <div
              class="rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
            >
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
              >
                Exposed
              </p>
              <p class="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                {{ catalog.collectionGroups.length }} collections
              </p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Published in the feed catalog.
              </p>
            </div>

            <div
              class="rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
            >
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
              >
                Limit
              </p>
              <p class="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                {{ catalog.feed.limit }} items
              </p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Applied to each feed response.
              </p>
            </div>
          </div>

          <div
            v-if="catalog.site.url || catalog.site.description"
            class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
          >
            <span
              class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
            >
              Site
            </span>
            <span v-if="catalog.site.description" class="text-slate-700 dark:text-slate-300">
              {{ catalog.site.description }}
            </span>
            <code
              v-if="catalog.site.url"
              class="rounded-full bg-slate-100 px-2 py-1 font-mono text-[0.72rem] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {{ catalog.site.url }}
            </code>
          </div>
        </div>

        <aside
          class="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
        >
          <div class="flex items-center justify-between gap-3">
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400"
            >
              Global routes
            </p>
            <UBadge color="neutral" variant="subtle" size="xs">
              {{ catalog.siteRoutes.length }} links
            </UBadge>
          </div>

          <div class="mt-4 space-y-3">
            <FeedsRouteCard v-for="route in catalog.siteRoutes" :key="route.path" :route />
          </div>
        </aside>
      </div>

      <UAlert
        v-if="catalog.feed.missingCollections.length"
        color="warning"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Feed config references collections that content.config.ts does not define"
        :description="`Missing collections: ${catalog.feed.missingCollections.join(', ')}. Add them to content.config.ts or remove them from feedsLayer.feed.collections.`"
      />

      <div class="space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400"
            >
              Collection routes
            </p>
            <h2
              class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100"
            >
              Each exposed collection gets RSS, Atom, and JSON.
            </h2>
          </div>
          <p class="max-w-lg text-sm text-slate-600 dark:text-slate-400">
            Add or remove collections in <code class="font-mono text-[0.9em]">app.config.ts</code>
            and the catalog updates automatically.
          </p>
        </div>

        <div v-if="catalog.collectionGroups.length" class="space-y-4">
          <UCard
            v-for="group in catalog.collectionGroups"
            :key="group.collection"
            :ui="{ body: 'p-0' }"
            class="overflow-hidden border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/45"
          >
            <div
              class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400"
                >
                  Collection
                </p>
                <h3 class="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-100">
                  {{ group.label }}
                </h3>
                <p class="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
                  {{ group.collection }}
                </p>
              </div>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ group.routes.length }} formats
              </UBadge>
            </div>

            <div class="grid gap-3 p-5 sm:grid-cols-3">
              <FeedsRouteCard v-for="route in group.routes" :key="route.path" :route compact />
            </div>
          </UCard>
        </div>

        <UCard
          v-else
          :ui="{ body: 'p-0' }"
          class="border-dashed border-slate-300 bg-white/70 shadow-none dark:border-slate-700 dark:bg-slate-950/40"
        >
          <div class="space-y-2 p-5">
            <p class="text-sm font-medium text-slate-950 dark:text-slate-100">
              No collection feeds are currently exposed.
            </p>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Add page collections to
              <code class="font-mono text-[0.9em]">feedsLayer.feed.collections</code>
              in <code class="font-mono text-[0.9em]">app.config.ts</code>.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
