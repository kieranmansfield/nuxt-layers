<script setup lang="ts">
  import FeedsIndex from '../../../../layers/feeds/app/components/Feeds/Index.vue'

  const { setPageAccent } = useAccentColor()
  setPageAccent('orange')
  onUnmounted(() => setPageAccent(null))

  definePageMeta({
    layout: false,
  })

  const appConfig = useAppConfig()
  const feedSettings = appConfig.feedsLayer?.feed ?? {}
  const feedCollections = [...new Set(feedSettings.collections ?? [])]
  const feedDefaultCollection = feedSettings.defaultCollection ?? 'blog'
  const feedLimit = feedSettings.limit ?? 30
  const feedCollectionsLabel = feedCollections.length ? feedCollections.join(', ') : 'none'
  const feedCollectionsLiteral = feedCollections
    .map((collection) => JSON.stringify(collection))
    .join(', ')
  const feedDefaultCollectionLiteral = JSON.stringify(feedDefaultCollection)

  const { data: feedIndex, error: feedIndexError } = await useFetch('/feed/discovery')

  interface FeedEndpoint {
    format: string
    url: string
    contentType: string
  }

  const endpoints = computed<FeedEndpoint[]>(
    () => (feedIndex.value as { feeds?: FeedEndpoint[] })?.feeds ?? []
  )

  const formatConfig: Record<
    string,
    { icon: string; iconBg: string; iconColor: string; borderColor: string; bgColor: string }
  > = {
    'RSS 2.0': {
      icon: 'i-lucide-rss',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      borderColor: 'border-orange-500/20',
      bgColor: 'bg-orange-500/5',
    },
    'Atom 1.0': {
      icon: 'i-lucide-radio',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/5',
    },
    'JSON Feed 1.1': {
      icon: 'i-lucide-braces',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
      borderColor: 'border-yellow-500/20',
      bgColor: 'bg-yellow-500/5',
    },
  }

  function fmt(format: string) {
    return formatConfig[format] ?? formatConfig['RSS 2.0']
  }

  const copied = ref<string | null>(null)

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    copied.value = url
    setTimeout(() => {
      copied.value = null
    }, 2000)
  }

  const previewRoutes: Record<string, string> = {
    'RSS 2.0': '/feed/rss',
    'Atom 1.0': '/feed/atom',
    'JSON Feed 1.1': '/feed/json',
  }

  const previewFormat = ref<string | null>(null)
  const previewContent = ref('')
  const previewLoading = ref(false)
  const previewFetchError = ref<string | null>(null)

  async function loadPreview(format: string) {
    if (previewFormat.value === format && previewContent.value) return
    previewFormat.value = format
    previewLoading.value = true
    previewFetchError.value = null
    previewContent.value = ''
    try {
      const raw = await $fetch<string>(previewRoutes[format], { responseType: 'text' })
      const text = raw as string
      if (format === 'JSON Feed 1.1') {
        previewContent.value = JSON.stringify(JSON.parse(text), null, 2)
          .split('\n')
          .slice(0, 40)
          .join('\n')
      } else {
        previewContent.value = text.split('\n').slice(0, 40).join('\n')
      }
    } catch {
      previewFetchError.value =
        'Could not load preview - make sure the feeds layer is loaded with content'
    } finally {
      previewLoading.value = false
    }
  }

  const routePatterns = [
    {
      path: '/feed',
      label: 'Site index',
    },
    {
      path: '/feed/discovery',
      label: 'Discovery manifest',
    },
    {
      path: `/feed/${feedDefaultCollection}/rss`,
      label: 'Default collection RSS',
    },
    {
      path: `/feed/${feedDefaultCollection}/atom`,
      label: 'Default collection Atom',
    },
    {
      path: `/feed/${feedDefaultCollection}/json`,
      label: 'Default collection JSON',
    },
  ]

  const demoNotes = [
    'Reads the live app config and content manifest.',
    'Flags configured collections that do not exist in the manifest.',
    'Expands each exposed collection into RSS, Atom, and JSON routes.',
    'Uses the same route structure that the server discovery endpoint publishes.',
  ]

  const componentSnippet = `<template>
  <LayoutPage title="Feeds" description="Browse the syndicated endpoints for this site.">
    <LayoutMain>
      <LayoutSection>
        <LayoutGridItem preset="centered">
          <FeedsIndex />
        </LayoutGridItem>
      </LayoutSection>
    </LayoutMain>
  </LayoutPage>
</template>`

  const configSnippet = `defineAppConfig({
  feedsLayer: {
    feed: {
      limit: ${feedLimit},
      collections: [${feedCollectionsLiteral}],
      defaultCollection: ${feedDefaultCollectionLiteral},
    },
  },
})`

  const appConfigCode = `// app.config.ts (in your consuming app)
export default defineAppConfig({
  feedsLayer: {
    site: {
      title: 'My Blog',
      description: 'Latest articles and updates',
      url: 'https://yourdomain.com',
      author: {
        name: 'Jane Smith',
        email: 'jane@yourdomain.com',
        link: 'https://yourdomain.com/about',
      },
      image: 'https://yourdomain.com/og.png',
      favicon: '/favicon.ico',
      copyright: 'Copyright 2025 Jane Smith',
    },
    feed: {
      limit: 20,
    },
  },
})`

  const routeUsageCode = `# Global feeds (all collections)
GET /feed/rss         → application/rss+xml
GET /feed/atom        → application/atom+xml
GET /feed/json        → application/feed+json
GET /feed             → 302 redirect to /feed/rss
GET /feed/discovery   → JSON index of all available feeds

# Unlimited feeds (no item limit)
GET /feed/rss/all
GET /feed/atom/all

# Per-collection feeds
GET /feed/blog/rss
GET /feed/portfolio/atom
GET /feed/gallery/json`

  const cacheHeadersCode = `ETag: "d41d8cd98f00b204e9800998ecf8427e"
Cache-Control: public, max-age=300, s-maxage=3600`
</script>

<template>
  <LayoutPage
    title="Feeds Layer Demo"
    description="Demonstrating the feed catalog component and the syndicated routes it renders"
  >
    <div
      class="relative isolate min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_44%,#111827_100%)] text-slate-100"
      style="overflow-x: clip"
    >
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div class="absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent"
        />
      </div>

      <DemoPageHero
        name="FEEDS"
        description="Syndication routes for the playground: a live feed index, a discovery manifest, and per-collection RSS, Atom, and JSON endpoints."
      />

      <LayoutMain>
        <LayoutSection>
          <LayoutGridItem preset="centered">
            <div class="space-y-10 py-8">
              <section class="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)]">
                <div class="space-y-4">
                  <div class="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p
                        class="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-orange-200/80"
                      >
                        Live demo
                      </p>
                      <h2
                        class="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
                      >
                        FeedsIndex component
                      </h2>
                      <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                        The component below reads the current app config, inspects the content
                        manifest, and renders the feed catalog exactly as the layer exposes it.
                      </p>
                    </div>
                    <UBadge color="warning" variant="soft" size="md" class="shrink-0">
                      Live config
                    </UBadge>
                  </div>

                  <FeedsIndex />
                </div>

                <div class="space-y-4">
                  <UCard>
                    <template #header>
                      <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-sliders-horizontal" class="text-primary" />
                        <h3 class="text-xl font-semibold">At a glance</h3>
                      </div>
                      <p class="mt-1 text-sm text-muted">
                        These values come from the playground app config and mirror the live demo.
                      </p>
                    </template>

                    <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      <div
                        class="rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
                      >
                        <p
                          class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
                        >
                          Collections
                        </p>
                        <p class="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-100">
                          {{ feedCollectionsLabel }}
                        </p>
                      </div>
                      <div
                        class="rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/45"
                      >
                        <p
                          class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
                        >
                          Default feed
                        </p>
                        <p class="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-100">
                          {{ feedDefaultCollection }}
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
                        <p class="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-100">
                          {{ feedLimit }} items
                        </p>
                      </div>
                    </div>
                  </UCard>

                  <UCard>
                    <template #header>
                      <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-route" class="text-primary" />
                        <h3 class="text-xl font-semibold">Route map</h3>
                      </div>
                      <p class="mt-1 text-sm text-muted">
                        The demo mirrors the exact routes produced by the feed catalog.
                      </p>
                    </template>

                    <div class="space-y-2">
                      <div
                        v-for="route in routePatterns"
                        :key="route.path"
                        class="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/45"
                      >
                        <div class="min-w-0">
                          <p class="font-medium text-slate-950 dark:text-slate-100">
                            {{ route.label }}
                          </p>
                          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            Helper route surfaced by the shared feed catalog.
                          </p>
                        </div>
                        <code
                          class="shrink-0 rounded-full bg-slate-100 px-2 py-1 font-mono text-[0.72rem] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {{ route.path }}
                        </code>
                      </div>
                    </div>
                  </UCard>

                  <UCard>
                    <template #header>
                      <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-check-check" class="text-primary" />
                        <h3 class="text-xl font-semibold">What it proves</h3>
                      </div>
                      <p class="mt-1 text-sm text-muted">
                        This page is a live integration demo, not a mockup.
                      </p>
                    </template>

                    <ul class="space-y-3 text-sm">
                      <li
                        v-for="note in demoNotes"
                        :key="note"
                        class="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                      >
                        <span
                          class="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-[0.65rem] font-semibold text-orange-300"
                        >
                          ✓
                        </span>
                        <span>{{ note }}</span>
                      </li>
                    </ul>
                  </UCard>
                </div>
              </section>

              <section class="grid gap-6 lg:grid-cols-2">
                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-code-2" class="text-primary" />
                      <h3 class="text-xl font-semibold">Embed the component</h3>
                    </div>
                    <p class="mt-1 text-sm text-muted">
                      The playground route is just a thin shell around the shared component.
                    </p>
                  </template>

                  <pre
                    class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-xs leading-6 text-slate-200"
                  ><code>{{ componentSnippet }}</code></pre>
                </UCard>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-wrench" class="text-primary" />
                      <h3 class="text-xl font-semibold">Configure feeds</h3>
                    </div>
                    <p class="mt-1 text-sm text-muted">
                      The component reflects the same feed config used by the server routes.
                    </p>
                  </template>

                  <pre
                    class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-xs leading-6 text-slate-200"
                  ><code>{{ configSnippet }}</code></pre>
                </UCard>
              </section>

              <section class="space-y-6 pt-4">
                <div class="max-w-3xl space-y-2">
                  <p
                    class="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-orange-200/80"
                  >
                    Reference
                  </p>
                  <h2 class="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                    The original guide, restored
                  </h2>
                  <p class="max-w-2xl text-sm leading-6 text-slate-300">
                    The sections below bring back the explanatory content that was removed, so the
                    page now works as both a live demo and a full feed reference.
                  </p>
                </div>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Overview
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    The feeds layer exposes your Nuxt Content collections as standard syndication
                    feeds. Every format derives from a single canonical <code>FeedItem[]</code>
                    model, so the content queries stay format-agnostic.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <div class="space-y-5">
                    <p class="text-sm leading-6 text-slate-300">
                      The layer keeps the machine-readable routes and the human-facing page in sync
                      through shared config. That lets the feed catalog stay consistent without
                      duplicating route lists in every app.
                    </p>

                    <div class="grid gap-4 md:grid-cols-3">
                      <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div class="mb-2 flex items-center gap-2">
                          <UIcon name="i-lucide-layers" class="text-orange-300" />
                          <h3 class="font-semibold text-slate-50">Format-agnostic</h3>
                        </div>
                        <p class="text-sm leading-6 text-slate-300">
                          One canonical model drives RSS, Atom, and JSON Feed adapters.
                        </p>
                      </div>

                      <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div class="mb-2 flex items-center gap-2">
                          <UIcon name="i-lucide-zap" class="text-orange-300" />
                          <h3 class="font-semibold text-slate-50">Cache-friendly</h3>
                        </div>
                        <p class="text-sm leading-6 text-slate-300">
                          The feed responses ship with ETag and Cache-Control headers.
                        </p>
                      </div>

                      <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div class="mb-2 flex items-center gap-2">
                          <UIcon name="i-lucide-folder-open" class="text-orange-300" />
                          <h3 class="font-semibold text-slate-50">Collection-aware</h3>
                        </div>
                        <p class="text-sm leading-6 text-slate-300">
                          Global feeds and per-collection endpoints sit side by side.
                        </p>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Live Feed Endpoints
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    These routes are served by Nitro. Open them in a browser or RSS reader to see
                    the rendered output.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-signal" class="text-primary" />
                      <h3 class="text-xl font-semibold">Available Feeds</h3>
                    </div>
                    <p class="mt-1 text-sm text-muted">
                      Served at <code>/feed/*</code> with no <code>/api/</code> prefix.
                    </p>
                  </template>

                  <div
                    v-if="feedIndexError"
                    class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-alert-circle" class="text-red-300" />
                      <span class="text-sm text-red-100">
                        Could not reach <code>/feed/discovery</code> - run with
                        <code>PLAYGROUND_LAYERS=core,content,feeds</code>
                      </span>
                    </div>
                  </div>

                  <div v-else class="divide-y divide-slate-200/10">
                    <div
                      v-for="endpoint in endpoints"
                      :key="endpoint.url"
                      class="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-10 w-10 items-center justify-center rounded-xl"
                          :class="fmt(endpoint.format).iconBg"
                        >
                          <UIcon
                            :name="fmt(endpoint.format).icon"
                            :class="fmt(endpoint.format).iconColor"
                          />
                        </div>
                        <div>
                          <p class="font-medium text-slate-50">{{ endpoint.format }}</p>
                          <p class="text-xs text-slate-400 font-mono">{{ endpoint.contentType }}</p>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <code
                          class="hidden shrink-0 rounded-full bg-slate-900/80 px-2 py-1 font-mono text-[0.72rem] text-slate-300 sm:block"
                        >
                          {{ endpoint.url }}
                        </code>
                        <UButton
                          size="xs"
                          variant="ghost"
                          :icon="copied === endpoint.url ? 'i-lucide-check' : 'i-lucide-copy'"
                          :color="copied === endpoint.url ? 'success' : 'neutral'"
                          @click="() => copyUrl(endpoint.url)"
                        />
                        <UButton
                          size="xs"
                          variant="outline"
                          icon="i-lucide-external-link"
                          :to="endpoint.url"
                          target="_blank"
                        >
                          Open
                        </UButton>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Browser View
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    RSS and Atom include an <code>&lt;?xml-stylesheet?&gt;</code> processing
                    instruction. Open them directly in the browser for a styled reading experience.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-monitor" class="text-primary" />
                        <h3 class="text-xl font-semibold">Feed Preview</h3>
                      </div>
                      <div class="flex gap-2">
                        <UButton
                          size="xs"
                          variant="outline"
                          icon="i-lucide-rss"
                          to="/feed/rss"
                          target="_blank"
                        >
                          Open RSS
                        </UButton>
                        <UButton
                          size="xs"
                          variant="outline"
                          icon="i-lucide-radio"
                          to="/feed/atom"
                          target="_blank"
                        >
                          Open Atom
                        </UButton>
                      </div>
                    </div>
                    <p class="mt-1 text-sm text-muted">
                      Server-rendered preview using the same <code>/feed/style.css</code> as the
                      XSLT-rendered feeds.
                    </p>
                  </template>

                  <div class="space-y-3">
                    <div class="overflow-hidden rounded-2xl border border-slate-800">
                      <iframe
                        src="/feed/demo"
                        class="h-[520px] w-full border-0 bg-white dark:bg-slate-950"
                        title="Feed browser view"
                      />
                    </div>

                    <p class="flex items-start gap-1.5 text-xs text-slate-400">
                      <UIcon name="i-lucide-info" class="mt-0.5 shrink-0" />
                      <span>
                        Open RSS or Atom in a new tab to see the live XSLT transformation in your
                        browser. Both formats use <code class="text-xs">/feed/style.css</code> for
                        styling. The subscribe button in the feed header uses the
                        <code class="text-xs">feed://</code> protocol to open in your reader app.
                      </span>
                    </p>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Live Preview
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    Fetch a feed format directly from the server and inspect the first chunk of the
                    response.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-terminal" class="text-primary" />
                      <h3 class="text-xl font-semibold">Feed Output</h3>
                    </div>
                    <p class="mt-1 text-sm text-muted">First 40 lines of the live response.</p>
                  </template>

                  <div class="space-y-4">
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="(config, format) in formatConfig"
                        :key="format"
                        class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
                        :class="
                          previewFormat === format
                            ? [config.iconBg, config.iconColor, config.borderColor]
                            : 'border-transparent bg-transparent text-slate-400 hover:text-slate-200'
                        "
                        @click="() => loadPreview(format)"
                      >
                        <UIcon :name="config.icon" class="text-xs" />
                        {{ format }}
                      </button>
                    </div>

                    <div class="relative">
                      <div v-if="!previewFormat" class="py-10 text-center text-slate-400">
                        <UIcon name="i-lucide-mouse-pointer-click" class="mb-2 text-2xl" />
                        <p class="text-sm">Click a format above to preview the live feed output.</p>
                      </div>

                      <div
                        v-else-if="previewLoading"
                        class="flex items-center justify-center gap-2 py-10 text-slate-400"
                      >
                        <UIcon name="i-lucide-loader-circle" class="animate-spin" />
                        <span class="text-sm">Fetching {{ previewFormat }} feed&hellip;</span>
                      </div>

                      <div
                        v-else-if="previewFetchError"
                        class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4"
                      >
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-alert-circle" class="text-red-300" />
                          <span class="text-sm text-red-100">{{ previewFetchError }}</span>
                        </div>
                      </div>

                      <div v-else-if="previewContent">
                        <div
                          class="overflow-hidden rounded-2xl border"
                          :class="
                            previewFormat ? fmt(previewFormat).borderColor : 'border-slate-800'
                          "
                        >
                          <div
                            class="flex items-center justify-between border-b px-3 py-2 text-xs font-mono"
                            :class="
                              previewFormat
                                ? [fmt(previewFormat).bgColor, fmt(previewFormat).borderColor]
                                : ''
                            "
                          >
                            <span
                              :class="
                                previewFormat ? fmt(previewFormat).iconColor : 'text-slate-400'
                              "
                            >
                              <UIcon :name="fmt(previewFormat ?? 'RSS 2.0').icon" class="mr-1" />
                              {{ previewFormat }} — {{ previewRoutes[previewFormat ?? 'RSS 2.0'] }}
                            </span>
                            <UButton
                              size="xs"
                              variant="ghost"
                              :icon="copied === previewContent ? 'i-lucide-check' : 'i-lucide-copy'"
                              :color="copied === previewContent ? 'success' : 'neutral'"
                              @click="() => copyUrl(previewContent)"
                            />
                          </div>
                          <div
                            class="max-h-96 overflow-x-auto overflow-y-auto bg-slate-950 p-4 font-mono text-xs text-slate-100"
                          >
                            <pre>{{ previewContent }}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Route Reference
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    All routes are Nitro server routes, so there is no API prefix to remember.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-route" class="text-primary" />
                      <h3 class="text-xl font-semibold">Endpoints</h3>
                    </div>
                  </template>

                  <div
                    class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-sm text-slate-100"
                  >
                    <pre>{{ routeUsageCode }}</pre>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Configuration
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    Feed metadata lives in <code>feedsLayer</code> inside your app's
                    <code>app.config.ts</code>.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-settings" class="text-primary" />
                      <h3 class="text-xl font-semibold">feedsLayer app config</h3>
                    </div>
                    <p class="mt-1 text-sm text-muted">
                      Override defaults in your consuming app's <code>app.config.ts</code>.
                    </p>
                  </template>

                  <div class="space-y-6">
                    <div
                      class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-slate-100"
                    >
                      <pre>{{ appConfigCode }}</pre>
                    </div>

                    <div>
                      <h4 class="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">
                        Config Options
                      </h4>
                      <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                          <thead>
                            <tr class="border-b border-slate-800">
                              <th class="px-3 py-2 text-left">Key</th>
                              <th class="px-3 py-2 text-left">Type</th>
                              <th class="px-3 py-2 text-left">Default</th>
                              <th class="px-3 py-2 text-left">Description</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-800">
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">site.title</td>
                              <td class="px-3 py-2 font-mono text-xs">string</td>
                              <td class="px-3 py-2 font-mono text-xs">'My Site'</td>
                              <td class="px-3 py-2">Feed channel title</td>
                            </tr>
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">site.description</td>
                              <td class="px-3 py-2 font-mono text-xs">string</td>
                              <td class="px-3 py-2 font-mono text-xs">'Latest content'</td>
                              <td class="px-3 py-2">Feed channel description</td>
                            </tr>
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">site.url</td>
                              <td class="px-3 py-2 font-mono text-xs">string</td>
                              <td class="px-3 py-2 font-mono text-xs">request origin</td>
                              <td class="px-3 py-2">
                                Canonical site URL - prepended to item links; defaults to request
                                origin in dev.
                              </td>
                            </tr>
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">site.author</td>
                              <td class="px-3 py-2 font-mono text-xs">object</td>
                              <td class="px-3 py-2 font-mono text-xs">—</td>
                              <td class="px-3 py-2">Default author (name, email, link)</td>
                            </tr>
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">site.image</td>
                              <td class="px-3 py-2 font-mono text-xs">string</td>
                              <td class="px-3 py-2 font-mono text-xs">—</td>
                              <td class="px-3 py-2">Channel image URL (RSS / JSON Feed)</td>
                            </tr>
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">site.copyright</td>
                              <td class="px-3 py-2 font-mono text-xs">string</td>
                              <td class="px-3 py-2 font-mono text-xs">—</td>
                              <td class="px-3 py-2">Copyright string</td>
                            </tr>
                            <tr>
                              <td class="px-3 py-2 font-mono text-xs">feed.limit</td>
                              <td class="px-3 py-2 font-mono text-xs">number</td>
                              <td class="px-3 py-2 font-mono text-xs">30</td>
                              <td class="px-3 py-2">Max items per feed</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Caching
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    Every feed response is deterministic and safe to cache.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-zap" class="text-primary" />
                      <h3 class="text-xl font-semibold">Response Headers</h3>
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div
                      class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-sm text-slate-100"
                    >
                      <pre>{{ cacheHeadersCode }}</pre>
                    </div>

                    <div class="grid gap-4 md:grid-cols-2">
                      <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div class="mb-2 flex items-center gap-2">
                          <UIcon name="i-lucide-fingerprint" class="text-orange-300" />
                          <h4 class="font-semibold text-slate-50">ETag</h4>
                        </div>
                        <p class="text-sm leading-6 text-slate-300">
                          A content hash lets clients skip re-downloading unchanged feeds.
                        </p>
                      </div>

                      <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div class="mb-2 flex items-center gap-2">
                          <UIcon name="i-lucide-timer" class="text-orange-300" />
                          <h4 class="font-semibold text-slate-50">Cache-Control</h4>
                        </div>
                        <p class="text-sm leading-6 text-slate-300">
                          The browser cache is short-lived and the CDN cache can stretch longer.
                        </p>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <section class="space-y-6">
                <div class="max-w-3xl space-y-2">
                  <h2 class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    Architecture
                  </h2>
                  <p class="text-sm leading-6 text-slate-300">
                    The data flow stays clean: content in, adapter in the middle, formats out.
                  </p>
                </div>

                <UCard class="bg-slate-950/60 text-slate-100">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-git-branch" class="text-primary" />
                      <h3 class="text-xl font-semibold">Data Flow</h3>
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div class="grid items-center gap-3 md:grid-cols-4">
                      <div
                        class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center"
                      >
                        <UIcon name="i-lucide-database" class="mb-2 text-xl text-orange-300" />
                        <p class="text-sm font-semibold text-slate-50">Nuxt Content</p>
                        <p class="mt-1 text-xs text-slate-400">Content collections</p>
                      </div>

                      <div class="flex items-center justify-center">
                        <UIcon
                          name="i-lucide-arrow-right"
                          class="hidden text-xl text-slate-500 md:block"
                        />
                        <UIcon
                          name="i-lucide-arrow-down"
                          class="text-xl text-slate-500 md:hidden"
                        />
                      </div>

                      <div
                        class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center"
                      >
                        <UIcon name="i-lucide-filter" class="mb-2 text-xl text-orange-300" />
                        <p class="text-sm font-semibold text-slate-50">content-adapter</p>
                        <p class="mt-1 text-xs text-slate-400">Maps to FeedItem[]</p>
                      </div>

                      <div class="flex items-center justify-center">
                        <UIcon
                          name="i-lucide-arrow-right"
                          class="hidden text-xl text-slate-500 md:block"
                        />
                        <UIcon
                          name="i-lucide-arrow-down"
                          class="text-xl text-slate-500 md:hidden"
                        />
                      </div>
                    </div>

                    <div class="grid gap-3 md:grid-cols-3">
                      <div
                        v-for="(config, format) in formatConfig"
                        :key="format"
                        class="rounded-2xl border p-4 text-center"
                        :class="[config.bgColor, config.borderColor]"
                      >
                        <UIcon
                          :name="config.icon"
                          class="mb-2 text-xl"
                          :class="[config.iconColor]"
                        />
                        <p class="text-sm font-semibold text-slate-50">{{ format }}</p>
                        <p class="mt-1 text-xs text-slate-400">
                          {{
                            format === 'RSS 2.0'
                              ? 'via feed package'
                              : format === 'Atom 1.0'
                                ? 'manual XML builder'
                                : 'JSON Feed 1.1 spec'
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <section class="flex flex-wrap justify-center gap-4 pt-4">
                <UButton to="/content" variant="outline" icon="i-lucide-arrow-left">
                  Content Layer
                </UButton>
                <UButton to="/" icon="i-lucide-home">Back to Home</UButton>
              </section>

              <DemoPageFooter
                name="Feeds Layer"
                description="Syndication feeds for your content"
                :links="[
                  { label: 'Content', to: '/content', icon: 'i-lucide-file-text' },
                  { label: 'Routing', to: '/routing', icon: 'i-lucide-route' },
                ]"
              />
            </div>
          </LayoutGridItem>
        </LayoutSection>
      </LayoutMain>
    </div>
  </LayoutPage>
</template>
