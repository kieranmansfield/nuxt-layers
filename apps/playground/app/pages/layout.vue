<script setup lang="ts">
const { setPageAccent } = useThemePreferences()
setPageAccent('amber')
onUnmounted(() => setPageAccent(null))

const galleryItems = [
  { id: 1, title: 'Item 1', color: 'bg-blue-500' },
  { id: 2, title: 'Item 2', color: 'bg-green-500' },
  { id: 3, title: 'Item 3', color: 'bg-purple-500' },
  { id: 4, title: 'Item 4', color: 'bg-orange-500' },
  { id: 5, title: 'Item 5', color: 'bg-pink-500' },
  { id: 6, title: 'Item 6', color: 'bg-cyan-500' },
]
</script>

<template>
  <LayoutPage
    title="Layout Layer"
    description="Demonstrating the Layout layer Swiss Grid system, sections, and page components"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 py-8">
          <!-- Header -->
          <div class="flex items-center gap-4">
            <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
            <div>
              <h1 class="text-3xl font-bold text-highlighted">Layout Layer</h1>
              <p class="text-muted">Swiss Grid system, sections, and page components</p>
            </div>
            <div class="ml-auto">
              <UBadge color="primary" variant="soft">Cmd+G to toggle grid</UBadge>
            </div>
          </div>

          <!-- Page Component Section (LayoutPage) -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Page Components</h2>
              <p class="text-muted">Canonical page wrappers with SEO and layout integration</p>
            </div>

            <!-- LayoutPage -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file" class="text-primary" />
                  <h3 class="text-xl font-semibold">LayoutPage</h3>
                  <UBadge color="primary" size="sm">Canonical</UBadge>
                </div>
                <p class="text-sm text-muted mt-1">
                  The standard page wrapper. Handles SEO, grid context, and debug overlay.
                </p>
              </template>

              <div class="space-y-6">
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="p-4 bg-elevated rounded-lg">
                    <h4 class="font-medium mb-2">Automatic SEO</h4>
                    <p class="text-sm text-muted">
                      Sets page title, meta description, and Open Graph tags via useHead()
                    </p>
                  </div>
                  <div class="p-4 bg-elevated rounded-lg">
                    <h4 class="font-medium mb-2">Grid Context</h4>
                    <p class="text-sm text-muted">
                      Wraps page in &lt;main class="mastmain"&gt; — the root of the Swiss Grid
                    </p>
                  </div>
                  <div class="p-4 bg-elevated rounded-lg">
                    <h4 class="font-medium mb-2">Feature Flag Aware</h4>
                    <p class="text-sm text-muted">
                      Reads layoutLayer.ui.grid.enabled — falls back to UMain+UPage when false
                    </p>
                  </div>
                  <div class="p-4 bg-elevated rounded-lg">
                    <h4 class="font-medium mb-2">Debug Included</h4>
                    <p class="text-sm text-muted">
                      LayoutGridDebug is built in — toggle with Cmd/Ctrl+G
                    </p>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                    Props
                  </h4>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b border-default">
                          <th class="text-left py-2 px-3">Prop</th>
                          <th class="text-left py-2 px-3">Type</th>
                          <th class="text-left py-2 px-3">Default</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-default">
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">title</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 text-muted">required</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">description</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3 text-muted">—</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">showHeader</td>
                          <td class="py-2 px-3 font-mono text-xs">boolean</td>
                          <td class="py-2 px-3 font-mono text-xs">false</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <pre
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                ><code>&lt;!-- pages/about.vue --&gt;
&lt;template&gt;
  &lt;LayoutPage title="About" description="Learn about us" :show-header="true"&gt;
    &lt;LayoutSectionHero&gt;
      &lt;h1&gt;Hello World&lt;/h1&gt;
    &lt;/LayoutSectionHero&gt;

    &lt;LayoutSection&gt;
      &lt;LayoutGridItem preset="centered"&gt;
        &lt;p&gt;Page content&lt;/p&gt;
      &lt;/LayoutGridItem&gt;
    &lt;/LayoutSection&gt;
  &lt;/LayoutPage&gt;
&lt;/template&gt;</code></pre>
              </div>
            </UCard>

            <!-- Feature Flag -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-toggle-left" class="text-primary" />
                  <h3 class="text-xl font-semibold">Feature Flag</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Disable the Swiss Grid system and fall back to standard Nuxt UI layout
                </p>
              </template>

              <pre
                class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>// app.config.ts — disable swiss grid
export default defineAppConfig({
  layoutLayer: {
    ui: {
      grid: {
        enabled: false, // LayoutPage renders UMain > UPage > UPageBody
      },
    },
  },
})</code></pre>
            </UCard>

            <!-- PageContainer (legacy) -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-x" class="text-muted" />
                  <h3 class="text-xl font-semibold text-muted">LayoutPageContainer</h3>
                  <UBadge color="neutral" variant="subtle" size="sm">Legacy</UBadge>
                </div>
                <p class="text-sm text-muted mt-1">
                  Kept for backwards compatibility. Use LayoutPage for new pages.
                </p>
              </template>
              <p class="text-sm text-muted">
                LayoutPageContainer remains functional but LayoutPage is now the canonical API.
                It offers the same SEO + grid debug, with the feature flag built in.
              </p>
            </UCard>
          </section>

          <!-- Grid System Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Swiss Grid System</h2>
              <p class="text-muted">18-column responsive grid with CSS subgrid</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-grid-3x3" class="text-primary" />
                  <h3 class="text-xl font-semibold">LayoutGridItem</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Position content on the 18-column grid with responsive values
                </p>
              </template>

              <div class="space-y-6">
                <!-- Responsive Columns -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                    Responsive Column Spans
                  </h4>
                  <div class="bg-elevated rounded-lg p-4 space-y-2">
                    <div class="grid grid-cols-18 gap-1">
                      <div class="col-span-6 bg-blue-500/20 p-2 text-center text-xs rounded">
                        6 cols (mobile)
                      </div>
                      <div class="col-span-6 bg-blue-500/10 p-2 text-center text-xs rounded opacity-50">
                        ...
                      </div>
                      <div class="col-span-6 bg-blue-500/10 p-2 text-center text-xs rounded opacity-50">
                        ...
                      </div>
                    </div>
                    <div class="grid grid-cols-18 gap-1">
                      <div class="col-span-9 bg-green-500/20 p-2 text-center text-xs rounded">
                        9 cols (tablet)
                      </div>
                      <div class="col-span-9 bg-green-500/10 p-2 text-center text-xs rounded opacity-50">
                        ...
                      </div>
                    </div>
                    <div class="grid grid-cols-18 gap-1">
                      <div class="col-span-12 bg-purple-500/20 p-2 text-center text-xs rounded">
                        12 cols (desktop)
                      </div>
                      <div class="col-span-6 bg-purple-500/10 p-2 text-center text-xs rounded opacity-50">
                        ...
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Props Table -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                    Available Props
                  </h4>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b border-default">
                          <th class="text-left py-2 px-3">Prop</th>
                          <th class="text-left py-2 px-3">Type</th>
                          <th class="text-left py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-default">
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">preset</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3">Named preset from app.config.ts</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">colStart</td>
                          <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                          <td class="py-2 px-3">Starting column (1–18)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">colSpan</td>
                          <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                          <td class="py-2 px-3">Number of columns to span</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">rowStart</td>
                          <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                          <td class="py-2 px-3">Starting row (1–12)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">rowSpan</td>
                          <td class="py-2 px-3 font-mono text-xs">number | ResponsiveValue</td>
                          <td class="py-2 px-3">Rows to span</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">align</td>
                          <td class="py-2 px-3 font-mono text-xs">'start' | 'center' | 'end' | 'stretch'</td>
                          <td class="py-2 px-3">Vertical alignment</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">justify</td>
                          <td class="py-2 px-3 font-mono text-xs">'start' | 'center' | 'end' | 'stretch'</td>
                          <td class="py-2 px-3">Horizontal alignment</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">layer</td>
                          <td class="py-2 px-3 font-mono text-xs">'back' | 'mid' | 'front' | 'top'</td>
                          <td class="py-2 px-3">Z-index layer (0, 10, 20, 30)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">bleed</td>
                          <td class="py-2 px-3 font-mono text-xs">'left' | 'right' | 'both'</td>
                          <td class="py-2 px-3">Edge-to-edge bleed past gutters</td>
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

                <pre
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                ><code>&lt;LayoutGridItem
  :col-start="{ default: 1, md: 2, lg: 4 }"
  :col-span="{ default: 6, md: 10, lg: 12 }"
  align="center"
  layer="front"
&gt;
  &lt;h1&gt;Responsive Content&lt;/h1&gt;
&lt;/LayoutGridItem&gt;</code></pre>
              </div>
            </UCard>

            <!-- Available Presets -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layout-template" class="text-primary" />
                  <h3 class="text-xl font-semibold">Grid Presets</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Named layouts from app.config.ts — use via the preset prop
                </p>
              </template>

              <div class="grid gap-3 sm:grid-cols-2">
                <div
                  v-for="preset in ['hero', 'centered', 'fullWidth', 'sidebar', 'content', 'splitLeft', 'splitRight', 'quarterLeft', 'threeQuarterRight']"
                  :key="preset"
                  class="flex items-center justify-between p-3 bg-elevated rounded-lg"
                >
                  <span class="font-mono text-sm">{{ preset }}</span>
                  <UBadge color="neutral" variant="subtle" size="xs">preset</UBadge>
                </div>
              </div>

              <pre
                class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>&lt;LayoutGridItem preset="centered"&gt;
  &lt;!-- col 5–14 on desktop, 2–11 on tablet, full on mobile --&gt;
&lt;/LayoutGridItem&gt;</code></pre>
            </UCard>
          </section>

          <!-- Section Components -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Section Components</h2>
              <p class="text-muted">Pre-configured layouts for common page patterns</p>
            </div>

            <!-- Hero Section -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-image" class="text-primary" />
                  <h3 class="text-xl font-semibold">LayoutSectionHero</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Full-viewport hero section with background, content, and footer slots
                </p>
              </template>

              <div class="space-y-6">
                <div class="relative bg-elevated rounded-lg overflow-hidden aspect-video">
                  <div class="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20" />
                  <div class="absolute inset-0 flex flex-col">
                    <div class="flex-1 flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-2xl font-bold mb-2">Hero Content</div>
                        <div class="text-sm text-muted">default slot — centered</div>
                      </div>
                    </div>
                    <div class="p-4 text-center">
                      <div class="inline-block px-4 py-2 bg-primary/20 rounded text-sm">
                        #footer slot — bottom aligned
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid gap-3 md:grid-cols-3">
                  <div class="p-3 bg-elevated rounded-lg">
                    <div class="font-mono text-sm text-primary">#background</div>
                    <p class="text-sm text-muted mt-1">Full-bleed background (z: back)</p>
                  </div>
                  <div class="p-3 bg-elevated rounded-lg">
                    <div class="font-mono text-sm text-primary">#default</div>
                    <p class="text-sm text-muted mt-1">Main centered content (z: mid)</p>
                  </div>
                  <div class="p-3 bg-elevated rounded-lg">
                    <div class="font-mono text-sm text-primary">#footer</div>
                    <p class="text-sm text-muted mt-1">Bottom-aligned content (z: mid)</p>
                  </div>
                </div>

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
                <p class="text-sm text-muted mt-1">
                  Two-column layout (9+9 on desktop) with optional mobile reversal
                </p>
              </template>

              <div class="space-y-6">
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="bg-blue-500/20 rounded-lg p-8 flex items-center justify-center">
                    <div class="text-center">
                      <div class="font-mono text-sm">#left</div>
                      <div class="text-sm text-muted">cols 1–9</div>
                    </div>
                  </div>
                  <div class="bg-purple-500/20 rounded-lg p-8 flex items-center justify-center">
                    <div class="text-center">
                      <div class="font-mono text-sm">#right</div>
                      <div class="text-sm text-muted">cols 10–18</div>
                    </div>
                  </div>
                </div>

                <pre
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                ><code>&lt;LayoutSectionSplit reverse&gt;
  &lt;template #left&gt;
    &lt;NuxtImg src="/image.jpg" class="size-full object-cover" /&gt;
  &lt;/template&gt;
  &lt;template #right&gt;
    &lt;h2&gt;Content Title&lt;/h2&gt;
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
                <p class="text-sm text-muted mt-1">
                  Auto-placing grid for collections with responsive columns
                </p>
              </template>

              <div class="space-y-6">
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

                <pre
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                ><code>&lt;LayoutSectionGallery :items="images" :columns="3"&gt;
  &lt;template #item="{ item }"&gt;
    &lt;NuxtImg :src="item.src" class="size-full object-cover" /&gt;
  &lt;/template&gt;
&lt;/LayoutSectionGallery&gt;</code></pre>
              </div>
            </UCard>
          </section>

          <!-- Nuxt UI Integration -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Nuxt UI Integration</h2>
              <p class="text-muted">UHeader and UPage components configured to align with the grid</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-panels-top-left" class="text-primary" />
                  <h3 class="text-xl font-semibold">UHeader</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Configured full-width with grid-matching gutters (clamp-based padding)
                </p>
              </template>

              <pre
                class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
              ><code>// app.config.ts (provided by the layout layer)
ui: {
  header: {
    container: 'max-w-full px-[clamp(1rem,2.5vw,2rem)]',
  },
}</code></pre>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layout" class="text-primary" />
                  <h3 class="text-xl font-semibold">UPage + UPage* Components</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Configured as subgrid participants — left/center/right map to grid columns
                </p>
              </template>

              <div class="space-y-4">
                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="p-3 bg-elevated rounded-lg text-center">
                    <div class="font-mono text-sm text-primary">left</div>
                    <p class="text-xs text-muted mt-1">cols 1–4 (sidebar)</p>
                  </div>
                  <div class="p-3 bg-elevated rounded-lg text-center">
                    <div class="font-mono text-sm text-primary">center</div>
                    <p class="text-xs text-muted mt-1">cols 5–14 (content)</p>
                  </div>
                  <div class="p-3 bg-elevated rounded-lg text-center">
                    <div class="font-mono text-sm text-primary">right</div>
                    <p class="text-xs text-muted mt-1">cols 15–18 (aside)</p>
                  </div>
                </div>

                <pre
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                ><code>&lt;LayoutPage title="Docs"&gt;
  &lt;LayoutSection&gt;
    &lt;UPage&gt;
      &lt;template #left&gt;&lt;UPageAside&gt;&lt;nav /&gt;&lt;/UPageAside&gt;&lt;/template&gt;
      &lt;UPageBody&gt;&lt;slot /&gt;&lt;/UPageBody&gt;
    &lt;/UPage&gt;
  &lt;/LayoutSection&gt;
&lt;/LayoutPage&gt;</code></pre>
              </div>
            </UCard>
          </section>

          <!-- Developer Tools -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Developer Tools</h2>
              <p class="text-muted">Debugging utilities — included automatically by LayoutPage</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-bug" class="text-primary" />
                  <h3 class="text-xl font-semibold">LayoutGridDebug</h3>
                </div>
                <p class="text-sm text-muted mt-1">
                  Visual 18-column overlay. Included by LayoutPage — no manual setup needed.
                </p>
              </template>

              <div class="space-y-4">
                <div class="flex items-center gap-3 p-4 bg-elevated rounded-lg">
                  <UKbd>Cmd</UKbd>
                  <span>+</span>
                  <UKbd>G</UKbd>
                  <span class="text-muted">Toggle grid column overlay</span>
                </div>
                <p class="text-sm text-muted">
                  Adapts to responsive grid density (6 / 12 / 18 columns). Can also be used
                  standalone with custom gap and color props.
                </p>
              </div>
            </UCard>
          </section>

          <!-- Navigation -->
          <div class="flex gap-4 justify-center pt-4">
            <UButton to="/ui" variant="outline" icon="i-lucide-arrow-left">UI Layer Demo</UButton>
            <UButton to="/" icon="i-lucide-home">Back to Home</UButton>
            <UButton to="/core" variant="outline" trailing-icon="i-lucide-arrow-right">
              Core Layer Demo
            </UButton>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
