<script setup lang="ts">
  import type { MetadataMediaType, MetadataSearchResult } from '#layers/metadata/shared/types'

  definePageMeta({ layout: false })

  const { data: providers } = await useFetch('/api/metadata/providers')

  const { data: providerStatus, refresh: refreshStatus } = await useFetch('/api/metadata/status')

  const mediaTypeTabs = [
    { label: 'All', value: undefined as MetadataMediaType | undefined },
    { label: 'Books', value: 'book' as MetadataMediaType },
    { label: 'Issues', value: 'comic' as MetadataMediaType },
    { label: 'Comic Series', value: 'comic-series' as MetadataMediaType },
    { label: 'Graphic Novels', value: 'graphic-novel' as MetadataMediaType },
    { label: 'Manga', value: 'manga' as MetadataMediaType },
    { label: 'Movies', value: 'movie' as MetadataMediaType },
    { label: 'TV Shows', value: 'tv-show' as MetadataMediaType },
  ]

  const activeTab = ref(0)
  const rawQuery = ref('')
  const query = refDebounced(rawQuery, 350)

  const mediaType = computed(() => mediaTypeTabs[activeTab.value]?.value)

  const results = ref<MetadataSearchResult[]>([])
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function runSearch() {
    if (!query.value) return
    isLoading.value = true
    error.value = null
    try {
      results.value = await $fetch<MetadataSearchResult[]>('/api/metadata/search', {
        query: {
          q: query.value,
          ...(mediaType.value && { mediaType: mediaType.value }),
          limit: 20,
        },
      })
      hasSearched.value = true
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  }

  watch(query, runSearch)
  watch(mediaType, () => { if (query.value) runSearch() })

  const mediaTypeIcons: Record<string, string> = {
    book: 'i-lucide-book-open',
    comic: 'i-lucide-book-image',
    'comic-series': 'i-lucide-library',
    manga: 'i-lucide-book-marked',
    'graphic-novel': 'i-lucide-book-text',
    'collected-edition': 'i-lucide-book-copy',
    movie: 'i-lucide-film',
    'tv-show': 'i-lucide-tv',
  }

  const providerColors: Record<string, string> = {
    'openlibrary': 'bg-amber-500/10 text-amber-500',
    'google-books': 'bg-sky-500/10 text-sky-500',
    'comicvine': 'bg-yellow-500/10 text-yellow-500',
    'tmdb': 'bg-teal-500/10 text-teal-500',
  }

  const providerLabels: Record<string, string> = {
    'openlibrary': 'Open Library',
    'google-books': 'Google Books',
    'comicvine': 'Comic Vine',
    'tmdb': 'TMDB',
  }

  function yearOf(dateStr?: string) {
    return dateStr ? new Date(dateStr).getFullYear() : null
  }
</script>

<template>
  <LayoutPage title="Metadata" description="Search books, comics, movies, and TV shows across multiple providers">
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-10 pb-8">
          <LayoutPageHeader
            title="Metadata Layer"
            description="Unified search and lookup across Open Library, Google Books, Comic Vine, and TMDB"
          />

          <!-- Provider registry -->
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Registered Providers
            </h2>
            <div v-if="providers?.length" class="flex flex-wrap gap-3">
              <div
                v-for="p in providers"
                :key="p.id"
                class="flex flex-col gap-2 rounded-xl border border-default bg-elevated px-4 py-3 min-w-48"
              >
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-database" class="text-lg shrink-0" :class="providerColors[p.id]?.split(' ')[1] ?? 'text-primary'" />
                  <div class="font-semibold text-sm text-highlighted">{{ p.label }}</div>
                </div>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="mt in p.mediaTypes"
                    :key="mt"
                    variant="subtle"
                    color="neutral"
                    size="xs"
                  >
                    {{ mt }}
                  </UBadge>
                </div>
                <div v-if="providerStatus">
                  <template v-for="s in providerStatus" :key="s.id">
                    <template v-if="s.id === p.id">
                      <UBadge v-if="s.ok" color="success" variant="subtle" size="xs">
                        <UIcon name="i-lucide-check" class="mr-1" />OK
                      </UBadge>
                      <div v-else class="text-xs text-red-400 break-words">
                        <UBadge color="error" variant="subtle" size="xs" class="mb-1">Error</UBadge>
                        <div class="font-mono mt-1 leading-tight">{{ s.error }}</div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-muted">
              No providers registered. Load provider layers (e.g. <code>metadata-tmdb</code>, <code>metadata-openlibrary</code>) alongside the <code>metadata</code> layer.
            </div>
          </div>

          <!-- Search -->
          <div class="space-y-4">
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted">Search</h2>

            <div class="flex flex-col sm:flex-row gap-3">
              <UInput
                v-model="rawQuery"
                placeholder="Search books, movies, TV shows, comics…"
                icon="i-lucide-search"
                size="lg"
                class="flex-1"
                :loading="isLoading"
              />
            </div>

            <!-- Media type tabs -->
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="(tab, i) in mediaTypeTabs"
                :key="tab.label"
                size="sm"
                :variant="activeTab === i ? 'solid' : 'outline'"
                :color="activeTab === i ? 'primary' : 'neutral'"
                @click="activeTab = i"
              >
                {{ tab.label }}
              </UButton>
            </div>
          </div>

          <!-- Results -->
          <div v-if="query">
            <div v-if="error" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {{ error.message }}
            </div>

            <div v-else-if="isLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="i in 8"
                :key="i"
                class="rounded-xl border border-default bg-elevated animate-pulse h-48"
              />
            </div>

            <div v-else-if="hasSearched && !results.length" class="text-sm text-muted py-8 text-center">
              No results for "{{ query }}"<span v-if="mediaType"> in {{ mediaType }}</span>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                v-for="item in results"
                :key="item.id"
                :href="item.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col rounded-xl border border-default bg-elevated overflow-hidden hover:border-primary/50 transition-colors"
              >
                <!-- Cover -->
                <div class="relative aspect-[2/3] bg-muted overflow-hidden">
                  <img
                    v-if="item.coverUrl"
                    :src="item.coverUrl"
                    :alt="item.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <UIcon
                      :name="mediaTypeIcons[item.mediaType] ?? 'i-lucide-file'"
                      class="text-4xl text-muted"
                    />
                  </div>
                  <!-- Media type badge -->
                  <div class="absolute top-2 left-2">
                    <UBadge variant="solid" color="neutral" size="xs" class="backdrop-blur-sm bg-black/60 text-white border-0">
                      {{ item.mediaType }}
                    </UBadge>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-3 flex flex-col gap-1.5 flex-1">
                  <div class="font-semibold text-sm text-highlighted leading-snug line-clamp-2">
                    {{ item.title }}
                  </div>

                  <div v-if="item.subtitle" class="text-xs text-muted leading-snug">
                    {{ item.subtitle }}
                  </div>

                  <div v-if="item.creators?.length" class="text-xs text-muted truncate">
                    {{ item.creators.map(c => c.name).join(', ') }}
                  </div>

                  <div v-if="item.publisher" class="text-xs text-muted truncate">
                    {{ item.publisher }}
                  </div>

                  <div v-if="item.publishedAt" class="text-xs text-muted">
                    {{ yearOf(item.publishedAt) }}
                  </div>

                  <div class="mt-auto pt-1.5">
                    <UBadge
                      variant="subtle"
                      size="xs"
                      :class="providerColors[item.provider] ?? 'bg-primary/10 text-primary'"
                    >
                      {{ providerLabels[item.provider] ?? item.provider }}
                    </UBadge>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- Empty state hint -->
          <div v-else class="rounded-xl border border-dashed border-default p-12 text-center text-muted text-sm">
            <UIcon name="i-lucide-search" class="text-3xl mb-3 block mx-auto opacity-40" />
            Type a query above to search across all registered providers
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
