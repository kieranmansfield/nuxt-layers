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
      <div class="space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2">Core Layer Diagnostics</h1>
          <p class="text-gray-500 dark:text-gray-400">Feature detection and system information</p>
        </div>

        <!-- CSS Features -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">CSS Features</h2>
          </template>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div class="flex items-center gap-2">
              <span v-if="grid" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>CSS Grid</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="subgrid" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>Subgrid</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="containerQueries" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>Container Queries</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="has" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>:has() Selector</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="aspectRatio" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>Aspect Ratio</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="backdropFilter" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>Backdrop Filter</span>
            </div>
          </div>
        </UCard>

        <!-- Image Formats -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Image Formats</h2>
          </template>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="flex items-center gap-2">
              <span v-if="webp" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>WebP</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="avif" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>AVIF</span>
            </div>
          </div>
        </UCard>

        <!-- JavaScript APIs -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">JavaScript APIs</h2>
          </template>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div class="flex items-center gap-2">
              <span v-if="intersectionObserver" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>IntersectionObserver</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="resizeObserver" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>ResizeObserver</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="serviceWorker" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>Service Worker</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="webGL" class="text-green-500">✓</span>
              <span v-else class="text-red-500">✗</span>
              <span>WebGL</span>
            </div>
          </div>
        </UCard>

        <!-- Device Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Device Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Type:</span>
              <span v-if="isMobile" class="text-primary">Mobile</span>
              <span v-else-if="isTablet" class="text-primary">Tablet</span>
              <span v-else-if="isDesktop" class="text-primary">Desktop</span>
            </div>
          </div>
        </UCard>

        <!-- Network Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Network Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Status:</span>
              <span v-if="isOnline" class="text-green-500">Online</span>
              <span v-else class="text-red-500">Offline</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Type:</span>
              <span>{{ effectiveType || 'unknown' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Quality:</span>
              <span
                :class="{
                  'text-green-500': connectionQuality === 'excellent',
                  'text-yellow-500': connectionQuality === 'good',
                  'text-red-500': connectionQuality === 'poor',
                  'text-gray-500': connectionQuality === 'offline',
                }"
              >
                {{ connectionQuality }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Speed:</span>
              <span v-if="isFast" class="text-green-500">Fast</span>
              <span v-else-if="isSlow" class="text-red-500">Slow</span>
              <span v-else>Normal</span>
            </div>
            <div v-if="saveData" class="flex items-center gap-2">
              <span class="font-medium w-24">Data Saver:</span>
              <span class="text-yellow-500">Enabled</span>
            </div>
          </div>
        </UCard>

        <!-- Rendering Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Rendering Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Mode:</span>
              <span class="uppercase text-primary">{{ mode }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Environment:</span>
              <span v-if="isClient" class="text-primary">Client</span>
              <span v-else-if="isServer" class="text-primary">Server</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Hydrated:</span>
              <span v-if="isHydrated" class="text-green-500">Yes</span>
              <span v-else class="text-yellow-500">No</span>
            </div>
          </div>
        </UCard>

        <!-- PWA Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">PWA Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Installed:</span>
              <span v-if="isInstalled" class="text-green-500">Yes</span>
              <span v-else class="text-gray-500">No</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Installable:</span>
              <span v-if="canInstall" class="text-green-500">Yes</span>
              <span v-else class="text-gray-500">No</span>
            </div>
            <div v-if="needRefresh" class="flex items-center gap-2">
              <span class="font-medium w-24">Update:</span>
              <span class="text-yellow-500">Available</span>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
