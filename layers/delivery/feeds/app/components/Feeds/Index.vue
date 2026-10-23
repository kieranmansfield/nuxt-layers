<script setup lang="ts">
  import contentManifest from '#content/manifest'

  import { createFeedCatalog, type FeedCatalogInput } from '../../utils/feed-catalog'

  type AppFeedAppConfig = FeedCatalogInput & {
    feedsLayer?: { feed?: FeedCatalogInput['feed'] }
  }

  const appConfig = useAppConfig() as unknown as AppFeedAppConfig

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
    class="feeds-shell border-default bg-muted @container relative overflow-hidden rounded-4xl border shadow-xl"
  >
    <div class="pointer-events-none absolute inset-0">
      <div class="bg-primary/20 absolute top-0 -right-20 h-72 w-72 rounded-full blur-3xl" />
      <div class="bg-secondary/10 absolute bottom-0 -left-20 h-80 w-80 rounded-full blur-3xl" />
      <div
        class="via-primary/35 absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent to-transparent"
      />
    </div>

    <div class="relative space-y-8">
      <div class="feeds-split grid gap-6">
        <div class="space-y-6">
          <div
            class="border-default bg-default/80 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.35em] uppercase shadow-sm backdrop-blur"
          >
            <UIcon name="i-lucide-rss" class="text-sm" />
            Feeds layer
          </div>

          <div class="space-y-3">
            <h1 class="feeds-h1 text-highlighted max-w-3xl font-semibold tracking-tight">
              Feed catalog for {{ catalog.site.title }}
            </h1>
            <p class="feeds-body text-toned max-w-2xl leading-7">
              Configured in <code class="font-mono text-[0.9em]">app.config.ts</code>, validated
              against <code class="font-mono text-[0.9em]">content.config.ts</code>, and rendered as
              a human-readable index for readers and site owners.
            </p>
          </div>

          <div class="feeds-cards-grid gap-3">
            <div
              class="border-default bg-default/75 rounded-2xl border p-4 shadow-sm backdrop-blur"
            >
              <p class="text-muted text-xs font-semibold tracking-[0.3em] uppercase">Default</p>
              <p class="text-highlighted mt-2 text-lg font-semibold">
                {{ catalog.feed.defaultCollection }}
              </p>
              <p class="text-muted mt-1 text-xs">Shorthand routes point here.</p>
            </div>

            <div
              class="border-default bg-default/75 rounded-2xl border p-4 shadow-sm backdrop-blur"
            >
              <p class="text-muted text-xs font-semibold tracking-[0.3em] uppercase">Exposed</p>
              <p class="text-highlighted mt-2 text-lg font-semibold">
                {{ catalog.collectionGroups.length }} collections
              </p>
              <p class="text-muted mt-1 text-xs">Published in the feed catalog.</p>
            </div>

            <div
              class="border-default bg-default/75 rounded-2xl border p-4 shadow-sm backdrop-blur"
            >
              <p class="text-muted text-xs font-semibold tracking-[0.3em] uppercase">Limit</p>
              <p class="text-highlighted mt-2 text-lg font-semibold">
                {{ catalog.feed.limit }} items
              </p>
              <p class="text-muted mt-1 text-xs">Applied to each feed response.</p>
            </div>
          </div>

          <div
            v-if="catalog.site.url || catalog.site.description"
            class="border-default bg-default/70 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm backdrop-blur"
          >
            <span class="text-muted text-xs font-semibold tracking-[0.3em] uppercase"> Site </span>
            <span v-if="catalog.site.description" class="text-toned">
              {{ catalog.site.description }}
            </span>
            <code
              v-if="catalog.site.url"
              class="bg-elevated text-muted rounded-full px-2 py-1 font-mono text-xs"
            >
              {{ catalog.site.url }}
            </code>
          </div>
        </div>

        <aside class="border-default bg-default/75 rounded-3xl border p-4 shadow-sm backdrop-blur">
          <div class="flex items-center justify-between gap-3">
            <p class="text-muted text-xs font-semibold tracking-[0.35em] uppercase">
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
            <p class="text-muted text-xs font-semibold tracking-[0.35em] uppercase">
              Collection routes
            </p>
            <h2 class="text-highlighted mt-2 text-2xl font-semibold tracking-tight">
              Each exposed collection gets RSS, Atom, and JSON.
            </h2>
          </div>
          <p class="text-muted max-w-lg text-sm">
            Add or remove collections in <code class="font-mono text-[0.9em]">app.config.ts</code>
            and the catalog updates automatically.
          </p>
        </div>

        <div v-if="catalog.collectionGroups.length" class="space-y-4">
          <UCard
            v-for="group in catalog.collectionGroups"
            :key="group.collection"
            :ui="{ body: 'p-0' }"
            class="border-default bg-default/80 overflow-hidden shadow-sm backdrop-blur"
          >
            <div
              class="border-default flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4"
            >
              <div>
                <p class="text-muted text-xs font-semibold tracking-[0.35em] uppercase">
                  Collection
                </p>
                <h3 class="text-highlighted mt-2 text-xl font-semibold">
                  {{ group.label }}
                </h3>
                <p class="text-muted mt-1 font-mono text-sm">
                  {{ group.collection }}
                </p>
              </div>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ group.routes.length }} formats
              </UBadge>
            </div>

            <div class="feeds-cards-grid gap-3 p-5">
              <FeedsRouteCard v-for="route in group.routes" :key="route.path" :route compact />
            </div>
          </UCard>
        </div>

        <UCard
          v-else
          :ui="{ body: 'p-0' }"
          class="border-accented bg-default/70 border-dashed shadow-none"
        >
          <div class="space-y-2 p-5">
            <p class="text-highlighted text-sm font-medium">
              No collection feeds are currently exposed.
            </p>
            <p class="text-muted text-sm">
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

<style scoped>
  .feeds-shell {
    padding: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  }

  .feeds-h1 {
    font-size: clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem);
  }

  .feeds-body {
    font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  }

  .feeds-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  }

  .feeds-split {
    grid-template-columns: 1fr;
  }

  @container (width >= 48rem) {
    .feeds-split {
      grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
    }
  }
</style>
