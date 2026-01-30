<script setup lang="ts">
const { config, layers } = useGridConfig()

// Detect platform for keyboard shortcut display
const keyboardShortcut = computed(() => {
  if (import.meta.client) {
    return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'
  }
  return 'Ctrl'
})
</script>

<template>
  <div class="mastmain">
    <!-- Header -->
    <LayoutSection>
      <LayoutGridItem preset="hero" class="py-16 md:py-24">
        <div class="pb-8">
          <h1 class="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Swiss Grid System
          </h1>
          <p class="mb-8 text-lg md:text-xl">
            A responsive, precision layout system built on CSS Grid with 6/12/18 column breakpoints
          </p>
          <div class="flex flex-wrap gap-4">
            <UButton size="lg">
              <kbd class="mr-2 rounded px-2 py-1 text-xs opacity-70">
                {{ keyboardShortcut }}
              </kbd>
              + G to toggle grid
            </UButton>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Config Overview -->
    <LayoutSection>
      <LayoutGridItem preset="centered" class="py-16">
        <div>
          <h2 class="mb-6 text-3xl font-bold">Grid Configuration</h2>
          <div class="grid gap-6 md:grid-cols-2">
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Responsive Columns</h3>
              </template>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span>Mobile (default)</span>
                  <span class="font-mono text-sm font-medium">
                    {{ config?.columns.default }} columns
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Tablet (md)</span>
                  <span class="font-mono text-sm font-medium">
                    {{ config?.columns.md }} columns
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Desktop (lg)</span>
                  <span class="font-mono text-sm font-medium">
                    {{ config?.columns.lg }} columns
                  </span>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Grid Settings</h3>
              </template>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span>Rows per section</span>
                  <span class="font-mono text-sm font-medium">
                    {{ config?.rowsPerSection }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Vertical rhythm</span>
                  <span class="font-mono text-sm font-medium">{{ config?.rhythm }}</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Preset Examples -->
    <LayoutSection>
      <LayoutGridItem preset="centered" class="mb-12 pt-16">
        <h2 class="text-3xl font-bold">Layout Presets</h2>
        <p class="mt-2">Pre-configured layouts for common design patterns</p>
      </LayoutGridItem>

      <!-- Hero Preset -->
      <LayoutGridItem preset="hero" class="mb-8">
        <UCard>
          <div class="space-y-2">
            <h3 class="text-xl font-bold">Hero Preset</h3>
            <p>
              Wide, centered content for hero sections and important announcements
            </p>
            <code class="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              preset="hero" → cols: 1-6 (mobile) | 2-11 (tablet) | 4-15 (desktop)
            </code>
          </div>
        </UCard>
      </LayoutGridItem>

      <!-- Centered Preset -->
      <LayoutGridItem preset="centered" class="mb-8">
        <UCard>
          <div class="space-y-2">
            <h3 class="text-xl font-bold">Centered Preset</h3>
            <p>Narrower reading width for body content and forms</p>
            <code class="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              preset="centered" → cols: 1-6 (mobile) | 2-11 (tablet) | 5-14 (desktop)
            </code>
          </div>
        </UCard>
      </LayoutGridItem>

      <!-- Full Width Example -->
      <LayoutGridItem preset="fullWidth" class="mb-8">
        <UCard>
          <div class="space-y-2">
            <h3 class="text-xl font-bold">Full Width Preset</h3>
            <p>Edge-to-edge content spanning all columns</p>
            <code class="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              preset="fullWidth" → cols: 1-6 (mobile) | 1-12 (tablet) | 1-18 (desktop)
            </code>
          </div>
        </UCard>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Sidebar + Content Layout -->
    <LayoutSection>
      <LayoutGridItem preset="centered" class="mb-12 pt-16">
        <h2 class="text-3xl font-bold">Sidebar Layout</h2>
        <p class="mt-2">Sidebar and content presets for two-column layouts</p>
      </LayoutGridItem>

      <LayoutGridItem preset="sidebar" class="mb-4 md:mb-0">
        <UCard>
          <div class="space-y-2">
            <h3 class="text-lg font-bold">Sidebar</h3>
            <p class="text-sm">Navigation, filters, or metadata</p>
            <code class="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              preset="sidebar"
            </code>
          </div>
        </UCard>
      </LayoutGridItem>

      <LayoutGridItem preset="content" class="mb-12">
        <UCard>
          <div class="space-y-2">
            <h3 class="text-lg font-bold">Content</h3>
            <p class="text-sm">Main content area beside sidebar</p>
            <code class="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              preset="content"
            </code>
          </div>
        </UCard>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Advanced Features -->
    <LayoutSection>
      <LayoutGridItem preset="centered" class="mb-12 pt-16">
        <h2 class="text-3xl font-bold">Advanced Features</h2>
        <p class="mt-2">Layering, alignment, and more</p>
      </LayoutGridItem>

      <!-- Z-Index Layers -->
      <LayoutGridItem preset="centered" class="mb-12">
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">Z-Index Layers</h3>
          </template>
          <div class="space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between rounded border p-3">
                <span class="font-medium">layer="back"</span>
                <span class="font-mono text-sm">z-index: {{ layers?.back }}</span>
              </div>
              <div class="flex items-center justify-between rounded border p-3">
                <span class="font-medium">layer="mid"</span>
                <span class="font-mono text-sm">z-index: {{ layers?.mid }}</span>
              </div>
              <div class="flex items-center justify-between rounded border p-3">
                <span class="font-medium">layer="front"</span>
                <span class="font-mono text-sm">z-index: {{ layers?.front }}</span>
              </div>
              <div class="flex items-center justify-between rounded border p-3">
                <span class="font-medium">layer="top"</span>
                <span class="font-mono text-sm">z-index: {{ layers?.top }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </LayoutGridItem>

      <!-- Alignment -->
      <LayoutGridItem preset="centered" class="mb-12">
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">Content Alignment</h3>
          </template>
          <p class="mb-4">
            Use <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">align</code> and
            <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">justify</code> props to position content
            within grid cells
          </p>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="flex h-32 items-start justify-start rounded border-2 border-dashed p-2">
              <div class="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">Start / Start</div>
            </div>
            <div class="flex h-32 items-center justify-center rounded border-2 border-dashed p-2">
              <div class="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
                Center / Center
              </div>
            </div>
            <div class="flex h-32 items-end justify-end rounded border-2 border-dashed p-2">
              <div class="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">End / End</div>
            </div>
          </div>
        </UCard>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Code Example -->
    <LayoutSection>
      <LayoutGridItem preset="centered" class="py-16">
        <UCard>
          <template #header>
            <h2 class="text-2xl font-bold">Usage Example</h2>
          </template>
          <div class="overflow-x-auto rounded-lg bg-gray-100 p-6 dark:bg-gray-900">
            <pre class="text-sm"><code>&lt;div class="mastmain"&gt;
  &lt;LayoutSection&gt;
    &lt;!-- Using preset --&gt;
    &lt;LayoutGridItem preset="hero"&gt;
      &lt;h1&gt;Hero Content&lt;/h1&gt;
    &lt;/LayoutGridItem&gt;

    &lt;!-- Custom positioning --&gt;
    &lt;LayoutGridItem
      :col-start="{ default: 1, md: 2, lg: 4 }"
      :col-span="{ default: 6, md: 10, lg: 12 }"
      :row-span="2"
      align="center"
      layer="front"
    &gt;
      &lt;p&gt;Custom grid item&lt;/p&gt;
    &lt;/LayoutGridItem&gt;
  &lt;/LayoutSection&gt;
&lt;/div&gt;</code></pre>
          </div>
        </UCard>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Footer -->
    <LayoutSection>
      <LayoutGridItem preset="centered" class="border-t py-8">
        <div class="text-center text-sm">
          <p>Swiss Grid System - Layout Layer</p>
          <p class="mt-2">
            Press
            <kbd class="rounded border px-2 py-1 font-mono text-xs">
              {{ keyboardShortcut }}
            </kbd>
            +
            <kbd class="rounded border px-2 py-1 font-mono text-xs">G</kbd>
            to toggle grid overlay
          </p>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Grid Debug - Always include at end -->
    <LayoutGridDebug />
  </div>
</template>
