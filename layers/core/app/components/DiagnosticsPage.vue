<script setup lang="ts">
  const {
    grid,
    subgrid,
    containerQueries,
    has,
    aspectRatio,
    backdropFilter,
    webp,
    avif,
    intersectionObserver,
    resizeObserver,
    serviceWorker,
    webGL,
  } = useFeatures()
  const { isMobile, isTablet, isDesktop } = useDevice()
  const { isOnline, effectiveType, saveData, connectionQuality, isSlow, isFast } = useNetworkInfo()
  const { mode, isHydrated, isClient, isServer } = useRendering()
  const { canInstall, isInstalled, needRefresh } = usePWAInfo()

  useSeoMeta({
    title: 'Core Layer Diagnostics',
    description: 'Feature detection and system diagnostics for the core layer',
  })
</script>

<template>
  <div class="min-h-screen p-8">
    <UContainer>
      <ClientOnly>
        <div class="space-y-8">
          <div class="text-center">
            <h1 class="mb-2 text-4xl font-bold">Core Layer Diagnostics</h1>
            <p class="text-muted">Feature detection and system information</p>
          </div>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">CSS Features</h2>
            </template>
            <div class="diag-grid-9 gap-3">
              <div class="flex items-center gap-2">
                <span v-if="grid" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>CSS Grid</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="subgrid" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>Subgrid</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="containerQueries" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>Container Queries</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="has" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>:has() Selector</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="aspectRatio" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>Aspect Ratio</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="backdropFilter" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>Backdrop Filter</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Image Formats</h2>
            </template>
            <div class="diag-grid-8 gap-3">
              <div class="flex items-center gap-2">
                <span v-if="webp" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>WebP</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="avif" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>AVIF</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">JavaScript APIs</h2>
            </template>
            <div class="diag-grid-9 gap-3">
              <div class="flex items-center gap-2">
                <span v-if="intersectionObserver" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>IntersectionObserver</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="resizeObserver" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>ResizeObserver</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="serviceWorker" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>Service Worker</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="webGL" class="text-success">✓</span>
                <span v-else class="text-error">✗</span>
                <span>WebGL</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Device Information</h2>
            </template>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Type:</span>
                <span v-if="isMobile" class="text-primary">Mobile</span>
                <span v-else-if="isTablet" class="text-primary">Tablet</span>
                <span v-else-if="isDesktop" class="text-primary">Desktop</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Network Information</h2>
            </template>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Status:</span>
                <span v-if="isOnline" class="text-success">Online</span>
                <span v-else class="text-error">Offline</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Type:</span>
                <span>{{ effectiveType || 'unknown' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Quality:</span>
                <span
                  :class="{
                    'text-success': connectionQuality === 'excellent',
                    'text-warning': connectionQuality === 'good',
                    'text-error': connectionQuality === 'poor',
                    'text-muted': connectionQuality === 'offline',
                  }"
                >
                  {{ connectionQuality }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Speed:</span>
                <span v-if="isFast" class="text-success">Fast</span>
                <span v-else-if="isSlow" class="text-error">Slow</span>
                <span v-else>Normal</span>
              </div>
              <div v-if="saveData" class="flex items-center gap-2">
                <span class="w-24 font-medium">Data Saver:</span>
                <span class="text-warning">Enabled</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Rendering Information</h2>
            </template>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Mode:</span>
                <span class="text-primary uppercase">{{ mode }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Environment:</span>
                <span v-if="isClient" class="text-primary">Client</span>
                <span v-else-if="isServer" class="text-primary">Server</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Hydrated:</span>
                <span v-if="isHydrated" class="text-success">Yes</span>
                <span v-else class="text-warning">No</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">PWA Information</h2>
            </template>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Installed:</span>
                <span v-if="isInstalled" class="text-success">Yes</span>
                <span v-else class="text-muted">No</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-medium">Installable:</span>
                <span v-if="canInstall" class="text-success">Yes</span>
                <span v-else class="text-muted">No</span>
              </div>
              <div v-if="needRefresh" class="flex items-center gap-2">
                <span class="w-24 font-medium">Update:</span>
                <span class="text-warning">Available</span>
              </div>
            </div>
          </UCard>
        </div>

        <template #fallback>
          <div class="text-muted py-16 text-center">Loading diagnostics…</div>
        </template>
      </ClientOnly>
    </UContainer>
  </div>
</template>

<style scoped>
  .diag-grid-9 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  }

  .diag-grid-8 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  }
</style>
