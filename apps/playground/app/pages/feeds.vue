<script setup lang="ts">
const { setPageAccent } = useAccentColor()
setPageAccent('orange')
onUnmounted(() => setPageAccent(null))

const { data: feedIndex, error: feedIndexError } = await useFetch('/feed')

interface FeedEndpoint {
  format: string
  url: string
  contentType: string
}

const endpoints = computed<FeedEndpoint[]>(() =>
  (feedIndex.value as { feeds?: FeedEndpoint[] })?.feeds ?? [],
)

const formatConfig: Record<string, { icon: string; iconBg: string; iconColor: string; borderColor: string; bgColor: string }> = {
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
  setTimeout(() => { copied.value = null }, 2000)
}

// Live preview
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
      previewContent.value = JSON.stringify(JSON.parse(text), null, 2).split('\n').slice(0, 40).join('\n')
    } else {
      previewContent.value = text.split('\n').slice(0, 40).join('\n')
    }
  } catch {
    previewFetchError.value = 'Could not load preview — make sure the feeds layer is loaded with content'
  } finally {
    previewLoading.value = false
  }
}

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
GET /feed/rss    → application/rss+xml
GET /feed/atom   → application/atom+xml
GET /feed/json   → application/feed+json
GET /feed        → JSON index of available feeds

# Per-collection feeds
GET /feed/blog/rss
GET /feed/portfolio/atom
GET /feed/gallery/json`

const cacheHeadersCode = `ETag: "d41d8cd98f00b204e9800998ecf8427e"
Cache-Control: public, max-age=300, s-maxage=3600`

definePageMeta({ layout: { name: 'grid', props: { showHeader: true, showFooter: true } } })
</script>

<template>
  <LayoutPage
    title="Feeds Layer Demo"
    description="RSS 2.0, Atom 1.0, and JSON Feed syndication endpoints"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 py-8">
          <LayoutPageHeader
            title="Feeds Layer"
            description="Format-agnostic syndication for Nuxt Content — RSS, Atom, and JSON Feed out of the box"
            back="/"
          />

          <!-- Overview -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="text-primary" />
                <h2 class="text-xl font-semibold">Overview</h2>
              </div>
            </template>

            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p>
                The Feeds layer exposes your Nuxt Content collections as industry-standard
                syndication feeds. All formats derive from a single canonical
                <code>FeedItem[]</code> model — no format-specific logic lives in the content
                queries.
              </p>
              <div class="grid gap-4 md:grid-cols-3 not-prose mt-4">
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-layers" class="text-primary" />
                    <h3 class="font-semibold">Format-agnostic</h3>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    One canonical model drives RSS, Atom, and JSON Feed adapters
                  </p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-zap" class="text-primary" />
                    <h3 class="font-semibold">Cache-friendly</h3>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    ETag and Cache-Control headers on every response
                  </p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-folder-open" class="text-primary" />
                    <h3 class="font-semibold">Collection-aware</h3>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Global feeds and per-collection endpoints side by side
                  </p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Live Endpoints -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">Live Feed Endpoints</h2>
              <p class="text-gray-500">
                These routes are served by Nitro — open one in your RSS reader or browser
              </p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-signal" class="text-primary" />
                  <h3 class="text-xl font-semibold">Available Feeds</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Served at <code>/feed/*</code> — no <code>/api/</code> prefix
                </p>
              </template>

              <div v-if="feedIndexError" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-alert-circle" class="text-red-500" />
                  <span class="text-sm text-red-700 dark:text-red-300">
                    Could not reach <code>/feed</code> — run with
                    <code>PLAYGROUND_LAYERS=core,content,feeds</code>
                  </span>
                </div>
              </div>

              <div v-else class="divide-y">
                <div
                  v-for="endpoint in endpoints"
                  :key="endpoint.url"
                  class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-lg flex items-center justify-center"
                      :class="fmt(endpoint.format).iconBg"
                    >
                      <UIcon
                        :name="fmt(endpoint.format).icon"
                        :class="fmt(endpoint.format).iconColor"
                      />
                    </div>
                    <div>
                      <p class="font-medium">{{ endpoint.format }}</p>
                      <p class="text-xs text-gray-500 font-mono">{{ endpoint.contentType }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <code class="text-xs text-gray-500 hidden sm:block">{{ endpoint.url }}</code>
                    <UButton
                      size="xs"
                      variant="ghost"
                      :icon="copied === endpoint.url ? 'i-lucide-check' : 'i-lucide-copy'"
                      :color="copied === endpoint.url ? 'success' : 'neutral'"
                      @click="copyUrl(endpoint.url)"
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

          <!-- Live Preview -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">Live Preview</h2>
              <p class="text-gray-500">Fetch a feed format directly from this server and inspect the output</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-terminal" class="text-primary" />
                  <h3 class="text-xl font-semibold">Feed Output</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">First 40 lines of the live response</p>
              </template>

              <div class="space-y-4">
                <!-- Format picker -->
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="(config, format) in formatConfig"
                    :key="format"
                    class="feed-preview-tab flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border"
                    :class="previewFormat === format
                      ? [config.iconBg, config.iconColor, config.borderColor]
                      : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
                    @click="loadPreview(format)"
                  >
                    <UIcon :name="config.icon" class="text-xs" />
                    {{ format }}
                  </button>
                </div>

                <!-- Preview content -->
                <div class="relative">
                  <div v-if="!previewFormat" class="text-center py-10 text-gray-400">
                    <UIcon name="i-lucide-mouse-pointer-click" class="text-2xl mb-2" />
                    <p class="text-sm">Click a format above to preview the live feed output</p>
                  </div>

                  <div v-else-if="previewLoading" class="flex items-center justify-center py-10 gap-2 text-gray-400">
                    <UIcon name="i-lucide-loader-circle" class="animate-spin" />
                    <span class="text-sm">Fetching {{ previewFormat }} feed&hellip;</span>
                  </div>

                  <div v-else-if="previewFetchError" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-alert-circle" class="text-red-500" />
                      <span class="text-sm text-red-700 dark:text-red-300">{{ previewFetchError }}</span>
                    </div>
                  </div>

                  <div v-else-if="previewContent">
                    <div
                      class="rounded-lg border overflow-hidden"
                      :class="previewFormat ? fmt(previewFormat).borderColor : 'border-gray-200 dark:border-gray-700'"
                    >
                      <div
                        class="flex items-center justify-between px-3 py-2 text-xs font-mono border-b"
                        :class="previewFormat ? [fmt(previewFormat).bgColor, fmt(previewFormat).borderColor] : ''"
                      >
                        <span :class="previewFormat ? fmt(previewFormat).iconColor : 'text-gray-500'">
                          <UIcon :name="fmt(previewFormat ?? 'RSS 2.0').icon" class="mr-1" />
                          {{ previewFormat }} — {{ previewRoutes[previewFormat ?? 'RSS 2.0'] }}
                        </span>
                        <UButton
                          size="xs"
                          variant="ghost"
                          :icon="copied === previewContent ? 'i-lucide-check' : 'i-lucide-copy'"
                          :color="copied === previewContent ? 'success' : 'neutral'"
                          @click="copyUrl(previewContent)"
                        />
                      </div>
                      <div class="bg-gray-950 text-gray-100 p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                        <pre>{{ previewContent }}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Route Reference -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">Route Reference</h2>
              <p class="text-gray-500">All routes are Nitro server routes — no API prefix</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-route" class="text-primary" />
                  <h3 class="text-xl font-semibold">Endpoints</h3>
                </div>
              </template>

              <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{{ routeUsageCode }}</pre>
              </div>
            </UCard>
          </section>

          <!-- Configuration -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">Configuration</h2>
              <p class="text-gray-500">
                All site metadata lives in <code>feedsLayer</code> inside your app's
                <code>app.config.ts</code>
              </p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-settings" class="text-primary" />
                  <h3 class="text-xl font-semibold">feedsLayer app config</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Override defaults in your consuming app's <code>app.config.ts</code>
                </p>
              </template>

              <div class="space-y-6">
                <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{{ appConfigCode }}</pre>
                </div>

                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Config Options
                  </h4>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b">
                          <th class="text-left py-2 px-3">Key</th>
                          <th class="text-left py-2 px-3">Type</th>
                          <th class="text-left py-2 px-3">Default</th>
                          <th class="text-left py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y">
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">site.title</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 font-mono text-xs">'My Site'</td>
                          <td class="py-2 px-3">Feed channel title</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">site.description</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 font-mono text-xs">'Latest content'</td>
                          <td class="py-2 px-3">Feed channel description</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">site.url</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 font-mono text-xs">request origin</td>
                          <td class="py-2 px-3">Canonical site URL — prepended to item links; defaults to request origin in dev</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">site.author</td>
                          <td class="py-2 px-3 font-mono text-xs">object</td>
                          <td class="py-2 px-3 font-mono text-xs">—</td>
                          <td class="py-2 px-3">Default author (name, email, link)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">site.image</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 font-mono text-xs">—</td>
                          <td class="py-2 px-3">Channel image URL (RSS / JSON Feed)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">site.copyright</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 font-mono text-xs">—</td>
                          <td class="py-2 px-3">Copyright string</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">feed.limit</td>
                          <td class="py-2 px-3 font-mono text-xs">number</td>
                          <td class="py-2 px-3 font-mono text-xs">30</td>
                          <td class="py-2 px-3">Max items per feed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Caching -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">Caching</h2>
              <p class="text-gray-500">Every feed response is deterministic and safe to cache</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-zap" class="text-primary" />
                  <h3 class="text-xl font-semibold">Response Headers</h3>
                </div>
              </template>

              <div class="space-y-4">
                <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{{ cacheHeadersCode }}</pre>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                      <UIcon name="i-lucide-fingerprint" class="text-primary" />
                      <h4 class="font-semibold">ETag</h4>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      MD5 hash of the response body — clients can use
                      <code>If-None-Match</code> to skip re-downloading unchanged feeds
                    </p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                      <UIcon name="i-lucide-timer" class="text-primary" />
                      <h4 class="font-semibold">Cache-Control</h4>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      5-minute browser cache, 1-hour CDN cache — safe for Netlify Edge,
                      Cloudflare, and Vercel
                    </p>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Architecture -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">Architecture</h2>
              <p class="text-gray-500">Clean separation between data, adapters, and routes</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-git-branch" class="text-primary" />
                  <h3 class="text-xl font-semibold">Data Flow</h3>
                </div>
              </template>

              <div class="space-y-4">
                <div class="grid gap-3 md:grid-cols-4 items-center">
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <UIcon name="i-lucide-database" class="text-primary text-xl mb-2" />
                    <p class="font-semibold text-sm">Nuxt Content</p>
                    <p class="text-xs text-gray-500 mt-1">Content collections</p>
                  </div>
                  <div class="flex items-center justify-center">
                    <UIcon name="i-lucide-arrow-right" class="text-gray-400 text-xl hidden md:block" />
                    <UIcon name="i-lucide-arrow-down" class="text-gray-400 text-xl md:hidden" />
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <UIcon name="i-lucide-filter" class="text-primary text-xl mb-2" />
                    <p class="font-semibold text-sm">content-adapter</p>
                    <p class="text-xs text-gray-500 mt-1">Maps to FeedItem[]</p>
                  </div>
                  <div class="flex items-center justify-center">
                    <UIcon name="i-lucide-arrow-right" class="text-gray-400 text-xl hidden md:block" />
                    <UIcon name="i-lucide-arrow-down" class="text-gray-400 text-xl md:hidden" />
                  </div>
                </div>
                <div class="grid gap-3 md:grid-cols-3">
                  <div
                    v-for="(config, format) in formatConfig"
                    :key="format"
                    class="p-4 rounded-lg border text-center"
                    :class="[config.bgColor, config.borderColor]"
                  >
                    <UIcon :name="config.icon" :class="[config.iconColor, 'text-xl mb-2']" />
                    <p class="font-semibold text-sm">{{ format }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ format === 'RSS 2.0' ? 'via feed package' : format === 'Atom 1.0' ? 'manual XML builder' : 'JSON Feed 1.1 spec' }}
                    </p>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Navigation -->
          <div class="flex gap-4 justify-center pt-4">
            <UButton to="/content" variant="outline" icon="i-lucide-arrow-left">
              Content Layer
            </UButton>
            <UButton to="/" icon="i-lucide-home">Back to Home</UButton>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
