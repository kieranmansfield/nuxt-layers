<script setup lang="ts">
useSeoMeta({
  title: 'Layout Layer Demo',
  description: 'Demonstrating the Layout layer grid system, sections, and page components',
})

const { setPageAccent } = useThemePreferences()
setPageAccent('amber')
onUnmounted(() => setPageAccent(null))

// Sample gallery items
const galleryItems = [
  { id: 1, title: 'Item 1', color: 'bg-blue-500' },
  { id: 2, title: 'Item 2', color: 'bg-green-500' },
  { id: 3, title: 'Item 3', color: 'bg-purple-500' },
  { id: 4, title: 'Item 4', color: 'bg-orange-500' },
  { id: 5, title: 'Item 5', color: 'bg-pink-500' },
  { id: 6, title: 'Item 6', color: 'bg-cyan-500' },
]

// Grid debug ref
const gridDebug = ref<{ toggle: () => void } | null>(null)
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <!-- Grid Debug Overlay -->
    <LayoutGridDebug ref="gridDebug" />

    <UContainer class="py-8">
      <div class="space-y-12">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Layout Layer</h1>
            <p class="text-muted">Grid system, sections, and page components</p>
          </div>
          <div class="ml-auto">
            <UButton variant="outline" icon="i-lucide-grid-3x3" @click="gridDebug?.toggle()">
              Toggle Grid (Cmd+G)
            </UButton>
          </div>
        </div>

        <!-- Grid System Section -->
        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Swiss Grid System</h2>
            <p class="text-gray-500">18-column responsive grid with subgrid support</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-grid-3x3" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutGridItem</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Position content on the 18-column grid with responsive values
              </p>
            </template>

            <div class="space-y-6">
              <!-- Responsive Columns -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Responsive Column Spans
                </h4>
                <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div class="grid grid-cols-18 gap-1">
                    <div class="col-span-6 bg-blue-500/20 p-2 text-center text-xs rounded">
                      6 cols (mobile)
                    </div>
                    <div
                      class="col-span-6 bg-blue-500/10 p-2 text-center text-xs rounded opacity-50"
                    >
                      ...
                    </div>
                    <div
                      class="col-span-6 bg-blue-500/10 p-2 text-center text-xs rounded opacity-50"
                    >
                      ...
                    </div>
                  </div>
                  <div class="grid grid-cols-18 gap-1">
                    <div class="col-span-9 bg-green-500/20 p-2 text-center text-xs rounded">
                      9 cols (tablet)
                    </div>
                    <div
                      class="col-span-9 bg-green-500/10 p-2 text-center text-xs rounded opacity-50"
                    >
                      ...
                    </div>
                  </div>
                  <div class="grid grid-cols-18 gap-1">
                    <div class="col-span-12 bg-purple-500/20 p-2 text-center text-xs rounded">
                      12 cols (desktop)
                    </div>
                    <div
                      class="col-span-6 bg-purple-500/10 p-2 text-center text-xs rounded opacity-50"
                    >
                      ...
                    </div>
                  </div>
                </div>
              </div>

              <!-- Props Table -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Available Props
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-2 px-3">Prop</th>
                        <th class="text-left py-2 px-3">Type</th>
                        <th class="text-left py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">colStart</td>
                        <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="py-2 px-3">Starting column (1-18)</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">colSpan</td>
                        <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="py-2 px-3">Number of columns to span</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">rowStart</td>
                        <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="py-2 px-3">Starting row (1-12)</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">rowSpan</td>
                        <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="py-2 px-3">Number of rows to span</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">align</td>
                        <td class="py-2 px-3 font-mono text-xs">
                          'start' | 'center' | 'end' | 'stretch'
                        </td>
                        <td class="py-2 px-3">Vertical alignment</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">justify</td>
                        <td class="py-2 px-3 font-mono text-xs">
                          'start' | 'center' | 'end' | 'stretch'
                        </td>
                        <td class="py-2 px-3">Horizontal alignment</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">layer</td>
                        <td class="py-2 px-3 font-mono text-xs">
                          'back' | 'mid' | 'front' | 'top'
                        </td>
                        <td class="py-2 px-3">Z-index layer (0, 10, 20, 30)</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">bleed</td>
                        <td class="py-2 px-3 font-mono text-xs">'left' | 'right' | 'both'</td>
                        <td class="py-2 px-3">Edge-to-edge bleed</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">aspect</td>
                        <td class="py-2 px-3 font-mono text-xs">'1/1' | '4/3' | '16/9' | ...</td>
                        <td class="py-2 px-3">Aspect ratio constraint</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Code Example -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Usage Example
                </h4>
                <pre
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                ><code>&lt;LayoutGridItem
  :col-start="{ default: 1, md: 2, lg: 4 }"
  :col-span="{ default: 6, md: 10, lg: 12 }"
  align="center"
  justify="start"
  layer="front"
&gt;
  &lt;h1&gt;Responsive Content&lt;/h1&gt;
&lt;/LayoutGridItem&gt;</code></pre>
              </div>
            </div>
          </UCard>
        </section>

        <!-- Section Components -->
        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Section Components</h2>
            <p class="text-gray-500">Pre-configured layouts for common page patterns</p>
          </div>

          <!-- Hero Section -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-image" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutSectionHero</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Full-viewport hero section with background, content, and footer slots
              </p>
            </template>

            <div class="space-y-6">
              <!-- Visual Demo -->
              <div
                class="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-video"
              >
                <div class="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20" />
                <div class="absolute inset-0 flex flex-col">
                  <div class="flex-1 flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-2xl font-bold mb-2">Hero Content</div>
                      <div class="text-sm text-gray-500">Centered with optional background</div>
                    </div>
                  </div>
                  <div class="p-4 text-center">
                    <div class="inline-block px-4 py-2 bg-primary/20 rounded text-sm">
                      Footer Slot
                    </div>
                  </div>
                </div>
              </div>

              <!-- Slots -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Available Slots
                </h4>
                <div class="grid gap-3 md:grid-cols-3">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="font-mono text-sm text-primary">#background</div>
                    <p class="text-sm text-gray-500 mt-1">
                      Full-bleed background layer (z-index: 0)
                    </p>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="font-mono text-sm text-primary">#default</div>
                    <p class="text-sm text-gray-500 mt-1">Main centered content (z-index: 10)</p>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="font-mono text-sm text-primary">#footer</div>
                    <p class="text-sm text-gray-500 mt-1">Bottom-aligned content (z-index: 10)</p>
                  </div>
                </div>
              </div>

              <!-- Code Example -->
              <pre
                class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>&lt;LayoutSectionHero&gt;
  &lt;template #background&gt;
    &lt;NuxtImg src="/hero.jpg" class="size-full object-cover" /&gt;
  &lt;/template&gt;

  &lt;h1&gt;Welcome&lt;/h1&gt;
  &lt;p&gt;Subtitle text&lt;/p&gt;

  &lt;template #footer&gt;
    &lt;UButton&gt;Call to Action&lt;/UButton&gt;
  &lt;/template&gt;
&lt;/LayoutSectionHero&gt;</code></pre>
            </div>
          </UCard>

          <!-- Split Section -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-columns-2" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutSectionSplit</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Two-column layout with optional mobile reversal
              </p>
            </template>

            <div class="space-y-6">
              <!-- Visual Demo -->
              <div class="grid gap-4 md:grid-cols-2">
                <div class="bg-blue-500/20 rounded-lg p-8 flex items-center justify-center">
                  <div class="text-center">
                    <div class="font-mono text-sm">#left</div>
                    <div class="text-sm text-gray-500">Left column</div>
                  </div>
                </div>
                <div class="bg-purple-500/20 rounded-lg p-8 flex items-center justify-center">
                  <div class="text-center">
                    <div class="font-mono text-sm">#right</div>
                    <div class="text-sm text-gray-500">Right column</div>
                  </div>
                </div>
              </div>

              <!-- Props -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Props
                </h4>
                <div class="flex flex-wrap gap-3">
                  <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="font-mono text-sm">fullHeight</span>
                    <span class="text-gray-500 ml-2">Force 100svh</span>
                  </div>
                  <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="font-mono text-sm">reverse</span>
                    <span class="text-gray-500 ml-2">Swap order on mobile</span>
                  </div>
                </div>
              </div>

              <!-- Code Example -->
              <pre
                class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>&lt;LayoutSectionSplit reverse&gt;
  &lt;template #left&gt;
    &lt;NuxtImg src="/image.jpg" class="size-full object-cover" /&gt;
  &lt;/template&gt;
  &lt;template #right&gt;
    &lt;h2&gt;Content Title&lt;/h2&gt;
    &lt;p&gt;Description text...&lt;/p&gt;
  &lt;/template&gt;
&lt;/LayoutSectionSplit&gt;</code></pre>
            </div>
          </UCard>

          <!-- Gallery Section -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-layout-grid" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutSectionGallery</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Auto-placing grid for collections with responsive columns
              </p>
            </template>

            <div class="space-y-6">
              <!-- Visual Demo -->
              <div class="grid gap-3 grid-cols-2 md:grid-cols-3">
                <div
                  v-for="item in galleryItems"
                  :key="item.id"
                  :class="item.color"
                  class="rounded-lg p-6 flex items-center justify-center text-white font-medium"
                >
                  {{ item.title }}
                </div>
              </div>

              <!-- Props -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Props
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-2 px-3">Prop</th>
                        <th class="text-left py-2 px-3">Type</th>
                        <th class="text-left py-2 px-3">Default</th>
                        <th class="text-left py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">items</td>
                        <td class="py-2 px-3 font-mono text-xs">T[]</td>
                        <td class="py-2 px-3 font-mono text-xs">required</td>
                        <td class="py-2 px-3">Array of items to render</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">columns</td>
                        <td class="py-2 px-3 font-mono text-xs">2 | 3 | 4 | 6</td>
                        <td class="py-2 px-3 font-mono text-xs">3</td>
                        <td class="py-2 px-3">Number of columns on desktop</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">itemRowSpan</td>
                        <td class="py-2 px-3 font-mono text-xs">number</td>
                        <td class="py-2 px-3 font-mono text-xs">4</td>
                        <td class="py-2 px-3">Grid rows per item</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Code Example -->
              <pre
                class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>&lt;LayoutSectionGallery :items="images" :columns="3"&gt;
  &lt;template #item="{ item, index }"&gt;
    &lt;NuxtImg :src="item.src" class="size-full object-cover" /&gt;
  &lt;/template&gt;
&lt;/LayoutSectionGallery&gt;</code></pre>
            </div>
          </UCard>
        </section>

        <!-- Page Components Section -->
        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Page Components</h2>
            <p class="text-gray-500">Page-level wrappers with SEO and layout integration</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutPageContainer</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Unified page wrapper with SEO metadata and header
              </p>
            </template>

            <div class="space-y-6">
              <!-- Features -->
              <div class="grid gap-4 md:grid-cols-2">
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 class="font-medium mb-2">Automatic SEO</h4>
                  <p class="text-sm text-gray-500">
                    Sets page title, meta description, and Open Graph tags via useHead()
                  </p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 class="font-medium mb-2">Grid Debug</h4>
                  <p class="text-sm text-gray-500">
                    Includes LayoutGridDebug helper - toggle with Cmd/Ctrl + G
                  </p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 class="font-medium mb-2">Layout Modes</h4>
                  <p class="text-sm text-gray-500">
                    Switch between 'grid' (Swiss Grid) and 'upage' (Nuxt UI) layouts
                  </p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 class="font-medium mb-2">Title Redundancy</h4>
                  <p class="text-sm text-gray-500">
                    Provides title to children via Vue provide/inject
                  </p>
                </div>
              </div>

              <!-- Props -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Props
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-2 px-3">Prop</th>
                        <th class="text-left py-2 px-3">Type</th>
                        <th class="text-left py-2 px-3">Default</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">title</td>
                        <td class="py-2 px-3 font-mono text-xs">string</td>
                        <td class="py-2 px-3 text-gray-500">required</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">description</td>
                        <td class="py-2 px-3 font-mono text-xs">string</td>
                        <td class="py-2 px-3 text-gray-500">-</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">showHeader</td>
                        <td class="py-2 px-3 font-mono text-xs">boolean</td>
                        <td class="py-2 px-3 font-mono text-xs">true</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">headerPreset</td>
                        <td class="py-2 px-3 font-mono text-xs">
                          'hero' | 'centered' | 'fullWidth'
                        </td>
                        <td class="py-2 px-3 font-mono text-xs">'centered'</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">layout</td>
                        <td class="py-2 px-3 font-mono text-xs">'grid' | 'upage'</td>
                        <td class="py-2 px-3 font-mono text-xs">'grid'</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Code Example -->
              <pre
                class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>&lt;LayoutPageContainer
  title="About Us"
  description="Learn about our company"
&gt;
  &lt;LayoutSection&gt;
    &lt;LayoutGridItem :col-span="12" align="center"&gt;
      &lt;p&gt;Page content here&lt;/p&gt;
    &lt;/LayoutGridItem&gt;
  &lt;/LayoutSection&gt;
&lt;/LayoutPageContainer&gt;</code></pre>
            </div>
          </UCard>
        </section>

        <!-- Grid Debug Section -->
        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Developer Tools</h2>
            <p class="text-gray-500">Debugging and development utilities</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-bug" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutGridDebug</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">Visual grid overlay for development</p>
            </template>

            <div class="space-y-6">
              <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <UKbd>Cmd</UKbd>
                <span>+</span>
                <UKbd>G</UKbd>
                <span class="text-gray-500">Toggle grid overlay visibility</span>
              </div>

              <!-- Props -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Props
                </h4>
                <div class="flex flex-wrap gap-3">
                  <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="font-mono text-sm">gap</span>
                    <span class="text-gray-500 ml-2">Column gap size</span>
                  </div>
                  <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="font-mono text-sm">color</span>
                    <span class="text-gray-500 ml-2">Overlay color (rgba)</span>
                  </div>
                </div>
              </div>

              <div>
                <UButton variant="soft" icon="i-lucide-grid-3x3" @click="gridDebug?.toggle()">
                  Try it now - Toggle Grid
                </UButton>
              </div>
            </div>
          </UCard>
        </section>

        <!-- Navigation -->
        <div class="flex gap-4 justify-center pt-4">
          <UButton to="/ui" variant="outline" icon="i-lucide-arrow-left"> UI Layer Demo </UButton>
          <UButton to="/" icon="i-lucide-home"> Back to Home </UButton>
          <UButton to="/core" variant="outline" trailing-icon="i-lucide-arrow-right">
            Core Layer Demo
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
