<script setup lang="ts">
  import type { MetadataMediaType } from '#layers/metadata/shared/types'

  definePageMeta({ layout: false })

  const { data: providers } = await useFetch('/api/metadata/providers')

  const { data: providerStatus } = await useFetch('/api/metadata/status')

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
  const query = computed(() => rawQuery.value.trim())

  const mediaType = computed(() => mediaTypeTabs[activeTab.value]?.value)

  const { data: results, status, error } = useMetadataSearch(rawQuery, { mediaType, limit: 20 })

  const isLoading = computed(() => status.value === 'pending')
  const hasSearched = computed(() => status.value === 'success' || status.value === 'error')

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
    openlibrary: 'bg-amber-500/10 text-amber-500',
    'google-books': 'bg-sky-500/10 text-sky-500',
    comicvine: 'bg-yellow-500/10 text-yellow-500',
    tmdb: 'bg-teal-500/10 text-teal-500',
  }

  const providerLabels: Record<string, string> = {
    openlibrary: 'Open Library',
    'google-books': 'Google Books',
    comicvine: 'Comic Vine',
    tmdb: 'TMDB',
  }

  function yearOf(dateStr?: string) {
    return dateStr ? new Date(dateStr).getFullYear() : null
  }
</script>

<template>
  <LayoutPage
    title="Metadata"
    description="Search books, comics, movies, and TV shows across multiple providers"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-10 pb-8">
          <LayoutPageHeader
            title="Metadata Layer"
            description="Unified search and lookup across Open Library, Google Books, Comic Vine, and TMDB"
          />

          <!-- Provider registry -->
          <div>
            <h2 class="text-muted mb-4 text-xs font-semibold tracking-widest uppercase">
              Registered Providers
            </h2>
            <div v-if="providers?.length" class="flex flex-wrap gap-3">
              <div
                v-for="p in providers"
                :key="p.id"
                class="border-default bg-elevated flex min-w-48 flex-col gap-2 rounded-xl border px-4 py-3"
              >
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-database"
                    class="shrink-0 text-lg"
                    :class="providerColors[p.id]?.split(' ')[1] ?? 'text-primary'"
                  />
                  <div class="text-highlighted text-sm font-semibold">{{ p.label }}</div>
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
                      <div v-else class="text-xs break-words text-red-400">
                        <UBadge color="error" variant="subtle" size="xs" class="mb-1">Error</UBadge>
                        <div class="mt-1 font-mono leading-tight">{{ s.error }}</div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
            <div v-else class="text-muted text-sm">
              No providers registered. Load provider layers (e.g. <code>metadata-tmdb</code>,
              <code>metadata-openlibrary</code>) alongside the <code>metadata</code> layer.
            </div>
          </div>

          <!-- Search -->
          <div class="space-y-4">
            <h2 class="text-muted text-xs font-semibold tracking-widest uppercase">Search</h2>

            <div class="flex flex-col gap-3 sm:flex-row">
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
            <div
              v-if="error"
              class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
            >
              {{ error.message }}
            </div>

            <div
              v-else-if="isLoading"
              class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <div
                v-for="i in 8"
                :key="i"
                class="border-default bg-elevated h-48 animate-pulse rounded-xl border"
              />
            </div>

            <div
              v-else-if="hasSearched && !results?.length"
              class="text-muted py-8 text-center text-sm"
            >
              No results for "{{ query }}"<span v-if="mediaType"> in {{ mediaType }}</span>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <a
                v-for="item in results"
                :key="item.id"
                :href="item.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group border-default bg-elevated hover:border-primary/50 flex flex-col overflow-hidden rounded-xl border transition-colors"
              >
                <!-- Cover -->
                <div class="bg-muted relative aspect-[2/3] overflow-hidden">
                  <img
                    v-if="item.coverUrl"
                    :src="item.coverUrl"
                    :alt="item.title"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <UIcon
                      :name="mediaTypeIcons[item.mediaType] ?? 'i-lucide-file'"
                      class="text-muted text-4xl"
                    />
                  </div>
                  <!-- Media type badge -->
                  <div class="absolute top-2 left-2">
                    <UBadge
                      variant="solid"
                      color="neutral"
                      size="xs"
                      class="border-0 bg-black/60 text-white backdrop-blur-sm"
                    >
                      {{ item.mediaType }}
                    </UBadge>
                  </div>
                </div>

                <!-- Info -->
                <div class="flex flex-1 flex-col gap-1.5 p-3">
                  <div class="text-highlighted line-clamp-2 text-sm leading-snug font-semibold">
                    {{ item.title }}
                  </div>

                  <div v-if="item.subtitle" class="text-muted text-xs leading-snug">
                    {{ item.subtitle }}
                  </div>

                  <div v-if="item.creators?.length" class="text-muted truncate text-xs">
                    {{ item.creators.map((c) => c.name).join(', ') }}
                  </div>

                  <div v-if="item.publisher" class="text-muted truncate text-xs">
                    {{ item.publisher }}
                  </div>

                  <div v-if="item.publishedAt" class="text-muted text-xs">
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
          <div
            v-else
            class="border-default text-muted rounded-xl border border-dashed p-12 text-center text-sm"
          >
            <UIcon name="i-lucide-search" class="mx-auto mb-3 block text-3xl opacity-40" />
            Type a query above to search across all registered providers
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
