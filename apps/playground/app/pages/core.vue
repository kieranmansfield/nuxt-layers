<script setup lang="ts">
useSeoMeta({
  title: 'Core Layer Demo',
  description: 'Demonstrating the core layer utilities and composables',
})

const { setPageAccent } = useThemePreferences()
setPageAccent('blue')
onUnmounted(() => setPageAccent(null))

// Browser detection
const {
  name: browserName,
  version: browserVersion,
  engine,
  os,
  isChrome,
  isSafari,
  isFirefox,
  isEdge,
  isWebKit,
  isBlink,
  isGecko,
  isWindows,
  isMacOS,
  isLinux,
  isAndroid,
  isIOS,
  majorVersion,
} = useBrowser()

// Screen info
const {
  breakpoint,
  isMobile,
  isTablet,
  isDesktop,
  isLargeDesktop,
  orientation,
  isPortrait,
  isLandscape,
  pixelRatio,
  isRetina,
  width: screenWidth,
  height: screenHeight,
} = useScreen()

// Network info
const { isOnline, effectiveType, saveData, connectionQuality, isSlow, isFast, isCellular, isWiFi } =
  useNetworkInfo()

// Feature detection
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
  darkMode,
  reducedMotion,
  highContrast,
} = useFeatures()

// Rendering info
const { mode, isHydrated, isClient } = useRendering()

// PWA info
const { canInstall, isInstalled, needRefresh, install, updateServiceWorker } = usePWAInfo()

// Loading demo
const { isLoading: demoLoading, progress: demoProgress, startLoading, stopLoading } = useLoading()

const showLoadingDemo = ref(false)

async function runLoadingDemo() {
  showLoadingDemo.value = true
  startLoading()
  await new Promise((resolve) => setTimeout(resolve, 3000))
  stopLoading()
  await new Promise((resolve) => setTimeout(resolve, 500))
  showLoadingDemo.value = false
}

// Device detection from @nuxtjs/device
const {
  isMobile: deviceIsMobile,
  isTablet: deviceIsTablet,
  isDesktop: deviceIsDesktop,
} = useDevice()

// Feature lists for v-for (typed to avoid key inference issues)
const cssFeatures = computed(() => [
  { name: 'CSS Grid', supported: grid.value },
  { name: 'Subgrid', supported: subgrid.value },
  { name: 'Container Queries', supported: containerQueries.value },
  { name: ':has() Selector', supported: has.value },
  { name: 'Aspect Ratio', supported: aspectRatio.value },
  { name: 'Backdrop Filter', supported: backdropFilter.value },
])

const jsApis = computed(() => [
  { name: 'IntersectionObserver', supported: intersectionObserver.value },
  { name: 'ResizeObserver', supported: resizeObserver.value },
  { name: 'Service Worker', supported: serviceWorker.value },
  { name: 'WebGL', supported: webGL.value },
])

const userPreferences = computed(() => [
  { name: 'Dark Mode', active: darkMode.value },
  { name: 'Reduced Motion', active: reducedMotion.value },
  { name: 'High Contrast', active: highContrast.value },
  { name: 'WebP Support', active: webp.value },
  { name: 'AVIF Support', active: avif.value },
])

// Wrapper for PWA install to satisfy click handler type
async function handleInstall() {
  await install()
}

async function handleUpdate() {
  await updateServiceWorker()
}
</script>

<template>
  <div class="min-h-screen bg-default text-default p-8">
    <UContainer>
      <div class="space-y-8">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Core Layer</h1>
            <p class="text-muted">Foundation utilities and composables</p>
          </div>
        </div>

        <!-- Browser Detection -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-globe" class="text-primary" />
              <h2 class="text-xl font-semibold">useBrowser()</h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">Detect browser, engine, version, and OS</p>
          </template>

          <div class="grid gap-6 md:grid-cols-2">
            <!-- Browser Info -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                Browser Info
              </h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Name</span>
                  <span class="font-mono capitalize">{{ browserName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Version</span>
                  <span class="font-mono">{{ browserVersion }} (v{{ majorVersion }})</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Engine</span>
                  <span class="font-mono capitalize">{{ engine }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">OS</span>
                  <span class="font-mono capitalize">{{ os }}</span>
                </div>
              </div>
            </div>

            <!-- Flags -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                Detection Flags
              </h3>
              <div class="flex flex-wrap gap-2">
                <UBadge v-if="isChrome" color="success">Chrome</UBadge>
                <UBadge v-if="isSafari" color="success">Safari</UBadge>
                <UBadge v-if="isFirefox" color="success">Firefox</UBadge>
                <UBadge v-if="isEdge" color="success">Edge</UBadge>
                <UBadge v-if="isWebKit" color="info">WebKit</UBadge>
                <UBadge v-if="isBlink" color="info">Blink</UBadge>
                <UBadge v-if="isGecko" color="info">Gecko</UBadge>
                <UBadge v-if="isWindows" color="neutral">Windows</UBadge>
                <UBadge v-if="isMacOS" color="neutral">macOS</UBadge>
                <UBadge v-if="isLinux" color="neutral">Linux</UBadge>
                <UBadge v-if="isAndroid" color="neutral">Android</UBadge>
                <UBadge v-if="isIOS" color="neutral">iOS</UBadge>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Screen Info -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-monitor" class="text-primary" />
              <h2 class="text-xl font-semibold">useScreen()</h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Screen dimensions, breakpoints, and orientation
            </p>
          </template>

          <div class="grid gap-6 md:grid-cols-3">
            <!-- Dimensions -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">Dimensions</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Width</span>
                  <span class="font-mono">{{ screenWidth }}px</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Height</span>
                  <span class="font-mono">{{ screenHeight }}px</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Pixel Ratio</span>
                  <span class="font-mono">{{ pixelRatio }}x</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Retina</span>
                  <UBadge :color="isRetina ? 'success' : 'neutral'" size="xs">
                    {{ isRetina ? 'Yes' : 'No' }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Breakpoints -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">Breakpoints</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Current</span>
                  <UBadge color="primary">{{ breakpoint }}</UBadge>
                </div>
                <div class="flex flex-wrap gap-1.5 pt-2">
                  <UBadge :color="isMobile ? 'success' : 'neutral'" variant="subtle" size="xs"
                    >Mobile</UBadge
                  >
                  <UBadge :color="isTablet ? 'success' : 'neutral'" variant="subtle" size="xs"
                    >Tablet</UBadge
                  >
                  <UBadge :color="isDesktop ? 'success' : 'neutral'" variant="subtle" size="xs"
                    >Desktop</UBadge
                  >
                  <UBadge :color="isLargeDesktop ? 'success' : 'neutral'" variant="subtle" size="xs"
                    >Large</UBadge
                  >
                </div>
              </div>
            </div>

            <!-- Orientation -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">Orientation</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Current</span>
                  <span class="font-mono text-sm">{{ orientation || 'N/A' }}</span>
                </div>
                <div class="flex gap-2 pt-2">
                  <UBadge :color="isPortrait ? 'success' : 'neutral'" variant="subtle" size="xs"
                    >Portrait</UBadge
                  >
                  <UBadge :color="isLandscape ? 'success' : 'neutral'" variant="subtle" size="xs"
                    >Landscape</UBadge
                  >
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Network Info -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-wifi" class="text-primary" />
              <h2 class="text-xl font-semibold">useNetworkInfo()</h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">Network connection status and quality</p>
          </template>

          <div class="grid gap-6 md:grid-cols-2">
            <!-- Status -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                Connection Status
              </h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Online</span>
                  <UBadge :color="isOnline ? 'success' : 'error'">
                    {{ isOnline ? 'Connected' : 'Offline' }}
                  </UBadge>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Type</span>
                  <span class="font-mono">{{ effectiveType || 'unknown' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Quality</span>
                  <UBadge
                    :color="
                      connectionQuality === 'excellent'
                        ? 'success'
                        : connectionQuality === 'good'
                          ? 'warning'
                          : connectionQuality === 'poor'
                            ? 'error'
                            : 'neutral'
                    "
                  >
                    {{ connectionQuality }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Flags -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                Network Flags
              </h3>
              <div class="flex flex-wrap gap-2">
                <UBadge v-if="isFast" color="success">Fast</UBadge>
                <UBadge v-if="isSlow" color="error">Slow</UBadge>
                <UBadge v-if="isCellular" color="warning">Cellular</UBadge>
                <UBadge v-if="isWiFi" color="success">WiFi</UBadge>
                <UBadge v-if="saveData" color="warning">Data Saver</UBadge>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Feature Detection -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-cpu" class="text-primary" />
              <h2 class="text-xl font-semibold">useFeatures()</h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">CSS features, JS APIs, and user preferences</p>
          </template>

          <div class="grid gap-6 md:grid-cols-3">
            <!-- CSS Features -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                CSS Features
              </h3>
              <div class="space-y-1.5">
                <div
                  v-for="feature in cssFeatures"
                  :key="feature.name"
                  class="flex items-center gap-2 text-sm"
                >
                  <UIcon
                    :name="feature.supported ? 'i-lucide-check' : 'i-lucide-x'"
                    :class="feature.supported ? 'text-green-500' : 'text-red-500'"
                  />
                  <span>{{ feature.name }}</span>
                </div>
              </div>
            </div>

            <!-- JS APIs -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                JavaScript APIs
              </h3>
              <div class="space-y-1.5">
                <div v-for="api in jsApis" :key="api.name" class="flex items-center gap-2 text-sm">
                  <UIcon
                    :name="api.supported ? 'i-lucide-check' : 'i-lucide-x'"
                    :class="api.supported ? 'text-green-500' : 'text-red-500'"
                  />
                  <span>{{ api.name }}</span>
                </div>
              </div>
            </div>

            <!-- User Preferences & Formats -->
            <div class="space-y-3">
              <h3 class="font-medium text-sm uppercase tracking-wide text-gray-500">
                Preferences & Formats
              </h3>
              <div class="space-y-1.5">
                <div
                  v-for="pref in userPreferences"
                  :key="pref.name"
                  class="flex items-center gap-2 text-sm"
                >
                  <UIcon
                    :name="pref.active ? 'i-lucide-check' : 'i-lucide-x'"
                    :class="pref.active ? 'text-green-500' : 'text-gray-400'"
                  />
                  <span>{{ pref.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Device Detection -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-smartphone" class="text-primary" />
              <h2 class="text-xl font-semibold">useDevice()</h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Server-side device detection via @nuxtjs/device
            </p>
          </template>

          <div class="flex gap-4">
            <UBadge :color="deviceIsMobile ? 'success' : 'neutral'" size="lg">
              <UIcon name="i-lucide-smartphone" class="mr-1" /> Mobile
            </UBadge>
            <UBadge :color="deviceIsTablet ? 'success' : 'neutral'" size="lg">
              <UIcon name="i-lucide-tablet" class="mr-1" /> Tablet
            </UBadge>
            <UBadge :color="deviceIsDesktop ? 'success' : 'neutral'" size="lg">
              <UIcon name="i-lucide-monitor" class="mr-1" /> Desktop
            </UBadge>
          </div>
        </UCard>

        <!-- Rendering & PWA -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Rendering Mode -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-layers" class="text-primary" />
                <h2 class="text-xl font-semibold">useRendering()</h2>
              </div>
            </template>

            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Mode</span>
                <UBadge color="primary">{{ mode.toUpperCase() }}</UBadge>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Environment</span>
                <span class="font-mono">{{ isClient ? 'Client' : 'Server' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Hydrated</span>
                <UBadge :color="isHydrated ? 'success' : 'warning'" size="xs">
                  {{ isHydrated ? 'Yes' : 'No' }}
                </UBadge>
              </div>
            </div>
          </UCard>

          <!-- PWA -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-download" class="text-primary" />
                <h2 class="text-xl font-semibold">usePWAInfo()</h2>
              </div>
            </template>

            <div class="space-y-3">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Installed</span>
                  <UBadge :color="isInstalled ? 'success' : 'neutral'" size="xs">
                    {{ isInstalled ? 'Yes' : 'No' }}
                  </UBadge>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Can Install</span>
                  <UBadge :color="canInstall ? 'success' : 'neutral'" size="xs">
                    {{ canInstall ? 'Yes' : 'No' }}
                  </UBadge>
                </div>
                <div v-if="needRefresh" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Update Available</span>
                  <UBadge color="warning" size="xs">Yes</UBadge>
                </div>
              </div>

              <div class="flex gap-2 pt-2">
                <UButton v-if="canInstall" size="xs" @click="handleInstall"> Install App </UButton>
                <UButton v-if="needRefresh" size="xs" variant="soft" @click="handleUpdate">
                  Update
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Loading Demo -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-loader-2" class="text-primary" />
              <h2 class="text-xl font-semibold">useLoading()</h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">Global loading state with simulated progress</p>
          </template>

          <div class="space-y-4">
            <div v-if="showLoadingDemo" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>Loading...</span>
                <span class="font-mono">{{ Math.round(demoProgress) }}%</span>
              </div>
              <UProgress :value="demoProgress" />
            </div>

            <UButton :loading="showLoadingDemo" @click="runLoadingDemo">
              {{ showLoadingDemo ? 'Loading...' : 'Run Loading Demo' }}
            </UButton>

            <div class="text-sm text-gray-500">
              <p>The useLoading composable provides:</p>
              <ul class="list-disc list-inside mt-2 space-y-1">
                <li>Simulated progress (0-90% auto, then waits)</li>
                <li>Shared singleton state across components</li>
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">withLoading(fn)</code>
                  wrapper for async functions
                </li>
              </ul>
            </div>
          </div>
        </UCard>

        <!-- Navigation -->
        <div class="flex gap-4 justify-center pt-4">
          <UButton to="/diagnostics" variant="outline" icon="i-lucide-activity">
            Full Diagnostics
          </UButton>
          <UButton to="/ui" icon="i-lucide-arrow-right"> UI Layer Demo </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
