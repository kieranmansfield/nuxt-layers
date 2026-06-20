<script setup lang="ts">
useSeoMeta({
  title: 'Design System — kmcom-nuxt-layers',
  description:
    'Comprehensive design system reference: typography, colors, layout grid, section components, motion components, and UI components.',
})

// Grid debug ref
const gridDebug = ref<{ toggle: () => void } | null>(null)

// Color tokens for demo
const semanticColors = ['dimmed', 'muted', 'toned', 'default', 'highlighted', 'inverted'] as const
const statusColors = ['info', 'success', 'warning', 'error'] as const
const brandColors = ['primary', 'secondary', 'neutral'] as const

// Typography weight demos
const fontWeights = [
  'font-thin',
  'font-light',
  'font-normal',
  'font-medium',
  'font-semibold',
  'font-bold',
  'font-black',
] as const

// Sample code for CodeBlock demo
const sampleCode = `function useScreen() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('md')
  const isDesktop = breakpoints.greaterOrEqual('lg')
  return { isMobile, isDesktop }
}`

// Code samples — kept as script variables to avoid the Vue HTML lexer treating
// <!-- sequences inside {{ `` }} template literals as HTML comment nodes.
const scrollProgressCodeSample = [
  '<!-- Fixed top bar -->',
  '<div class="fixed top-0 left-0 right-0 z-50">',
  '  <MotionScrollProgress type="linear" :height="3" />',
  '</div>',
  '',
  '<!-- Floating circular indicator -->',
  '<div class="fixed bottom-6 right-6">',
  '  <MotionScrollProgress type="circular" :size="56" :stroke-width="4" :show-percentage="false" />',
  '</div>',
].join('\n')

const scrollStatsCodeSample = [
  '<!-- Add during development only -->',
  "<MotionScrollStats :show=\"['velocity', 'progress', 'scrollY']\" position=\"bottom-right\" />",
].join('\n')

const layoutPageCodeSample = [
  '// Standard page with grid layout + header and footer',
  'definePageMeta({',
  "  layout: { name: 'grid', props: { showHeader: true, showFooter: true } },",
  '})',
  '',
  '// No chrome — content-only',
  "definePageMeta({ layout: 'grid' })",
  '',
  '// Full-bleed / animation page — opt out entirely',
  'definePageMeta({ layout: false })',
  '',
  '// In the template:',
  '// <LayoutPage title="About" description="Learn more." :show-header="true">',
  '//   <LayoutSection>...</LayoutSection>',
  '// </LayoutPage>',
].join('\n')

// Table of contents
const tocItems = [
  {
    id: 'typography-headlines',
    label: 'Typography — Headlines',
    icon: 'i-lucide-heading',
  },
  {
    id: 'typography-controls',
    label: 'Typography — Controls',
    icon: 'i-lucide-type',
  },
  {
    id: 'typography-decorative',
    label: 'Typography — Decorative',
    icon: 'i-lucide-pen-tool',
  },
  {
    id: 'typography-blocks',
    label: 'Typography — Blocks',
    icon: 'i-lucide-code',
  },
  { id: 'color-system', label: 'Color System', icon: 'i-lucide-palette' },
  { id: 'layout-grid', label: 'Layout Grid', icon: 'i-lucide-grid-3x3' },
  { id: 'layout-page', label: 'LayoutPage', icon: 'i-lucide-file' },
  {
    id: 'section-components',
    label: 'Section Components',
    icon: 'i-lucide-image',
  },
  {
    id: 'motion-components',
    label: 'Motion Components',
    icon: 'i-lucide-sparkles',
  },
  {
    id: 'links-group',
    label: 'LinksGroup',
    icon: 'i-lucide-mouse-pointer-click',
  },
  {
    id: 'ui-components',
    label: 'UI Components',
    icon: 'i-lucide-mouse-pointer',
  },
]

// Gallery items for section demo
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
  <div class="bg-default text-default min-h-screen">
    <!-- Grid Debug Overlay -->
    <LayoutGridDebug ref="gridDebug" />

    <UContainer class="py-8">
      <div class="space-y-12">
        <!-- 1. Page Header -->
        <div class="flex flex-wrap items-start gap-4">
          <div class="min-w-0 flex-1">
            <h1 class="text-highlighted text-3xl font-bold">Design System</h1>
            <p class="text-muted mt-1">
              Comprehensive reference for typography, colors, layout, and components provided by
              <code class="bg-elevated rounded px-1.5 py-0.5 font-mono text-sm">
                kmcom-nuxt-layers </code
              >.
            </p>
          </div>
          <UButton
            variant="outline"
            icon="i-lucide-grid-3x3"
            class="shrink-0"
            @click="gridDebug?.toggle()"
          >
            Grid Debug
            <UKbd class="ml-2">⌘G</UKbd>
          </UButton>
        </div>

        <!-- 2. Table of Contents -->
        <nav class="not-prose">
          <div class="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            <a
              v-for="item in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="bg-elevated hover:bg-muted/10 group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
            >
              <UIcon :name="item.icon" class="text-primary shrink-0" />
              <span
                class="text-highlighted group-hover:text-primary text-sm font-medium transition-colors"
                >{{ item.label }}</span
              >
            </a>
          </div>
        </nav>

        <!-- 3. Typography — Headlines -->
        <section id="typography-headlines" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Typography — Headlines</h2>
            <p class="text-muted">Semantic h1–h6 headings with responsive sizing</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-heading" class="text-primary" />
                <h3 class="text-xl font-semibold">TypographyHeadline</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Use <code class="font-mono">:level</code> prop (1–6) to render semantic heading
                elements
              </p>
            </template>

            <div class="space-y-4">
              <TypographyHeadline :level="1">Headline Level 1</TypographyHeadline>
              <TypographyHeadline :level="2">Headline Level 2</TypographyHeadline>
              <TypographyHeadline :level="3">Headline Level 3</TypographyHeadline>
              <TypographyHeadline :level="4">Headline Level 4</TypographyHeadline>
              <TypographyHeadline :level="5">Headline Level 5</TypographyHeadline>
              <TypographyHeadline :level="6">Headline Level 6</TypographyHeadline>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">
                {{ '<TypographyHeadline :level="2">Headline Level 2</TypographyHeadline>' }}
              </TypographyCodeBlock>
            </template>
          </UCard>
        </section>

        <!-- 4. Typography — Controls -->
        <section id="typography-controls" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Typography — Controls</h2>
            <p class="text-muted">Font weight, slant, leading, and transform axes</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-type" class="text-primary" />
                <h3 class="text-xl font-semibold">Typography</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Base typography component with font axis controls
              </p>
            </template>

            <div class="space-y-6">
              <!-- Weight -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Font Weight
                </h4>
                <div class="space-y-2">
                  <Typography v-for="weight in fontWeights" :key="weight" :weight class="text-lg">
                    {{ weight.replace('font-', '') }} — The quick brown fox jumps over the lazy dog
                  </Typography>
                </div>
              </div>

              <!-- Slant -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Font Slant
                </h4>
                <div class="space-y-2">
                  <Typography slant="normal" class="text-lg"
                    >Normal — The quick brown fox</Typography
                  >
                  <Typography slant="italic" class="text-lg"
                    >Italic — The quick brown fox</Typography
                  >
                </div>
              </div>

              <!-- Leading -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Line Height (Leading)
                </h4>
                <div class="grid gap-4 md:grid-cols-3">
                  <div class="bg-elevated rounded-lg p-3">
                    <Typography leading="leading-tight" class="text-sm">
                      <strong>Tight</strong> — Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                  <div class="bg-elevated rounded-lg p-3">
                    <Typography leading="leading-normal" class="text-sm">
                      <strong>Normal</strong> — Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                  <div class="bg-elevated rounded-lg p-3">
                    <Typography leading="leading-loose" class="text-sm">
                      <strong>Loose</strong> — Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                </div>
              </div>

              <!-- Transform -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Text Transform
                </h4>
                <div class="flex flex-wrap gap-4">
                  <Typography transform="none">Normal Text</Typography>
                  <Typography transform="uppercase">Uppercase</Typography>
                  <Typography transform="lowercase">LOWERCASE</Typography>
                  <Typography transform="capitalize">capitalize each word</Typography>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- 5. Typography — Decorative -->
        <section id="typography-decorative" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Typography — Decorative</h2>
            <p class="text-muted">SVG-based text stroke for crisp outlines at any size</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-pen-tool" class="text-primary" />
                <h3 class="text-xl font-semibold">TypographyTextStroke</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Inherits font size and weight from parent — works at any scale
              </p>
            </template>

            <div class="space-y-8">
              <!-- Outline only -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Outline Only
                </h4>
                <div class="text-7xl font-bold">
                  <TypographyTextStroke text="Outline" :stroke-width="2" />
                </div>
              </div>

              <!-- Fill + Stroke -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Fill + Stroke
                </h4>
                <div class="text-primary text-7xl font-bold">
                  <TypographyTextStroke
                    text="Filled"
                    :stroke-width="3"
                    stroke-color="var(--ui-text)"
                    fill="currentColor"
                  />
                </div>
              </div>

              <!-- Stroke widths -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Stroke Widths
                </h4>
                <div class="space-y-2">
                  <div class="text-5xl font-bold">
                    <TypographyTextStroke text="1px stroke" :stroke-width="1" />
                  </div>
                  <div class="text-5xl font-bold">
                    <TypographyTextStroke text="2px stroke" :stroke-width="2" />
                  </div>
                  <div class="text-5xl font-bold">
                    <TypographyTextStroke text="4px stroke" :stroke-width="4" />
                  </div>
                </div>
              </div>

              <!-- Colors -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Colors</h4>
                <div class="flex flex-wrap gap-6">
                  <div class="text-5xl font-bold">
                    <TypographyTextStroke text="Red" :stroke-width="2" stroke-color="red" />
                  </div>
                  <div class="text-5xl font-bold">
                    <TypographyTextStroke text="Blue" :stroke-width="2" stroke-color="blue" />
                  </div>
                  <div class="text-5xl font-bold">
                    <TypographyTextStroke
                      text="Multi"
                      :stroke-width="2"
                      stroke-color="purple"
                      fill="gold"
                    />
                  </div>
                </div>
              </div>

              <!-- Inside Headline -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Inside Headline
                </h4>
                <TypographyHeadline :level="1">
                  <TypographyTextStroke text="Headline Stroke" tag="span" :stroke-width="2" />
                </TypographyHeadline>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">
                {{ `
                <h1 class="text-8xl font-bold">
                  <TypographyTextStroke text="Hello" :stroke-width="2" stroke-color="red" />
                </h1>
                ` }}
              </TypographyCodeBlock>
            </template>
          </UCard>
        </section>

        <!-- 6. Typography — Blocks -->
        <section id="typography-blocks" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Typography — Blocks</h2>
            <p class="text-muted">Semantic wrappers for code and quoted content</p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-code" class="text-primary" />
                  <h3 class="text-xl font-semibold">CodeBlock</h3>
                </div>
                <p class="text-muted mt-1 text-sm">Semantic pre/code wrapper for code snippets</p>
              </template>
              <TypographyCodeBlock
                language="typescript"
                class="rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
              >
                {{ sampleCode }}
              </TypographyCodeBlock>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-quote" class="text-primary" />
                  <h3 class="text-xl font-semibold">QuoteBlock</h3>
                </div>
                <p class="text-muted mt-1 text-sm">Semantic blockquote wrapper</p>
              </template>
              <TypographyQuoteBlock class="border-primary border-l-4 pl-4 italic">
                "The best way to predict the future is to create it."
                <Typography tag="span" class="text-muted mt-2 block text-sm not-italic">
                  — Peter Drucker
                </Typography>
              </TypographyQuoteBlock>
            </UCard>
          </div>
        </section>

        <!-- 7. Color System -->
        <section id="color-system" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Color System</h2>
            <p class="text-muted">Semantic, status, brand, and accent color tokens</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-palette" class="text-primary" />
                <h3 class="text-xl font-semibold">Color Tokens</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Text, background, and border usage types across the design system
              </p>
            </template>

            <div class="space-y-6">
              <!-- Semantic Colors -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Semantic (dimmed → inverted)
                </h4>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="color in semanticColors"
                    :key="color"
                    class="border-default rounded-lg border px-4 py-2"
                  >
                    <Typography :color weight="font-medium">{{ color }}</Typography>
                  </div>
                </div>
              </div>

              <!-- Status Colors -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Status</h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge v-for="color in statusColors" :key="color" :color size="lg">
                    {{ color }}
                  </UBadge>
                </div>
              </div>

              <!-- Brand Colors -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Brand</h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge v-for="color in brandColors" :key="color" :color size="lg">
                    {{ color }}
                  </UBadge>
                  <div class="rounded-full px-3 py-1.5 text-sm font-medium">
                    <Typography color="accent" weight="font-medium">accent</Typography>
                  </div>
                </div>
              </div>

              <!-- Base Colors -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Base</h4>
                <div class="flex flex-wrap gap-3">
                  <div class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
                    black
                  </div>
                  <div
                    class="border-default rounded-lg border bg-white px-4 py-2 text-sm font-medium text-black"
                  >
                    white
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- 8. Layout Grid -->
        <section id="layout-grid" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Layout Grid</h2>
            <p class="text-muted">
              18-column Swiss grid with subgrid support and responsive values
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-grid-3x3" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutGridItem</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Position content on the 18-column grid with responsive values
              </p>
            </template>

            <div class="space-y-6">
              <!-- Visual demo -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Responsive Column Spans
                </h4>
                <div class="bg-elevated space-y-2 rounded-lg p-4">
                  <div class="grid-cols-18 grid gap-1">
                    <div class="col-span-6 rounded bg-blue-500/20 p-2 text-center text-xs">
                      6 cols (mobile)
                    </div>
                    <div
                      class="col-span-6 rounded bg-blue-500/10 p-2 text-center text-xs opacity-50"
                    >
                      ...
                    </div>
                    <div
                      class="col-span-6 rounded bg-blue-500/10 p-2 text-center text-xs opacity-50"
                    >
                      ...
                    </div>
                  </div>
                  <div class="grid-cols-18 grid gap-1">
                    <div class="col-span-9 rounded bg-green-500/20 p-2 text-center text-xs">
                      9 cols (tablet)
                    </div>
                    <div
                      class="col-span-9 rounded bg-green-500/10 p-2 text-center text-xs opacity-50"
                    >
                      ...
                    </div>
                  </div>
                  <div class="grid-cols-18 grid gap-1">
                    <div class="col-span-12 rounded bg-purple-500/20 p-2 text-center text-xs">
                      12 cols (desktop)
                    </div>
                    <div
                      class="col-span-6 rounded bg-purple-500/10 p-2 text-center text-xs opacity-50"
                    >
                      ...
                    </div>
                  </div>
                </div>
              </div>

              <!-- Props Table -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Available Props
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">colStart</td>
                        <td class="px-3 py-2 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="text-muted px-3 py-2">Starting column (1–18)</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">colSpan</td>
                        <td class="px-3 py-2 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="text-muted px-3 py-2">Number of columns to span</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">rowStart</td>
                        <td class="px-3 py-2 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="text-muted px-3 py-2">Starting row (1–12)</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">rowSpan</td>
                        <td class="px-3 py-2 font-mono text-xs">number | ResponsiveValue</td>
                        <td class="text-muted px-3 py-2">Number of rows to span</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">align</td>
                        <td class="px-3 py-2 font-mono text-xs">
                          'start' | 'center' | 'end' | 'stretch'
                        </td>
                        <td class="text-muted px-3 py-2">Vertical alignment</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">justify</td>
                        <td class="px-3 py-2 font-mono text-xs">
                          'start' | 'center' | 'end' | 'stretch'
                        </td>
                        <td class="text-muted px-3 py-2">Horizontal alignment</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">layer</td>
                        <td class="px-3 py-2 font-mono text-xs">
                          'back' | 'mid' | 'front' | 'top'
                        </td>
                        <td class="text-muted px-3 py-2">Z-index layer (0, 10, 20, 30)</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">bleed</td>
                        <td class="px-3 py-2 font-mono text-xs">'left' | 'right' | 'both'</td>
                        <td class="text-muted px-3 py-2">Edge-to-edge bleed</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">aspect</td>
                        <td class="px-3 py-2 font-mono text-xs">'1/1' | '4/3' | '16/9' | ...</td>
                        <td class="text-muted px-3 py-2">Aspect ratio constraint</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Usage Example -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Usage Example
                </h4>
                <pre
                  class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
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

              <!-- Grid debug -->
              <div class="bg-elevated flex items-center gap-3 rounded-lg p-4">
                <UKbd>⌘</UKbd>
                <span>+</span>
                <UKbd>G</UKbd>
                <span class="text-muted">Toggle grid overlay — or use the button above</span>
                <UButton
                  variant="soft"
                  icon="i-lucide-grid-3x3"
                  size="sm"
                  class="ml-auto"
                  @click="gridDebug?.toggle()"
                >
                  Toggle Grid
                </UButton>
              </div>
            </div>
          </UCard>
        </section>

        <!-- 9. LayoutPage -->
        <section id="layout-page" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">LayoutPage</h2>
            <p class="text-muted">
              Canonical page wrapper for the Swiss Grid System — handles SEO, page title, and
              optional visible header
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutPage</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Fragment component — no wrapper element. Sets
                <code class="font-mono">&lt;title&gt;</code>, provides
                <code class="font-mono">pageTitle</code> to children, and optionally renders a
                header block.
              </p>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Default</th>
                        <th class="px-3 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">title</td>
                        <td class="px-3 py-2 font-mono text-xs">string</td>
                        <td class="px-3 py-2 font-mono text-xs">required</td>
                        <td class="text-muted px-3 py-2">
                          Sets
                          <code class="font-mono text-xs">&lt;title&gt;</code>
                          and visible heading when showHeader is true
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">description</td>
                        <td class="px-3 py-2 font-mono text-xs">string?</td>
                        <td class="px-3 py-2 font-mono text-xs">—</td>
                        <td class="text-muted px-3 py-2">
                          Sets meta description and og:description
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">showHeader</td>
                        <td class="px-3 py-2 font-mono text-xs">boolean</td>
                        <td class="px-3 py-2 font-mono text-xs">false</td>
                        <td class="text-muted px-3 py-2">
                          Render a visible LayoutPageHeader block
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  grid.vue layout props (v1.6.0+)
                </h4>
                <p class="text-muted mb-3 text-sm">
                  Header, nav, and footer are opt-in. Pass props via
                  <code class="font-mono text-xs">definePageMeta</code>:
                </p>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Default</th>
                        <th class="px-3 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">showHeader</td>
                        <td class="px-3 py-2 font-mono text-xs">false</td>
                        <td class="text-muted px-3 py-2">
                          Renders
                          <code class="font-mono text-xs">&lt;MastHeader&gt;</code>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">showNav</td>
                        <td class="px-3 py-2 font-mono text-xs">false</td>
                        <td class="text-muted px-3 py-2">
                          Renders
                          <code class="font-mono text-xs">&lt;MastNav&gt;</code>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">showFooter</td>
                        <td class="px-3 py-2 font-mono text-xs">false</td>
                        <td class="text-muted px-3 py-2">
                          Renders
                          <code class="font-mono text-xs">&lt;MastFooter&gt;</code>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">showGridDebug</td>
                        <td class="px-3 py-2 font-mono text-xs">false</td>
                        <td class="text-muted px-3 py-2">
                          Renders
                          <code class="font-mono text-xs">&lt;LayoutGridDebug&gt;</code>
                          overlay
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="typescript" class="text-sm">{{
                layoutPageCodeSample
              }}</TypographyCodeBlock>
            </template>
          </UCard>
        </section>

        <!-- 10. Section Components -->
        <section id="section-components" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Section Components</h2>
            <p class="text-muted">Pre-configured layouts for common page patterns</p>
          </div>

          <!-- Hero Section -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-image" class="text-primary" />
                <h3 class="text-xl font-semibold">LayoutSectionHero</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Full-viewport hero section with background, content, and footer slots
              </p>
            </template>

            <div class="space-y-6">
              <div class="bg-elevated relative aspect-video overflow-hidden rounded-lg">
                <div class="bg-linear-to-br absolute inset-0 from-blue-500/20 to-purple-500/20" />
                <div class="absolute inset-0 flex flex-col">
                  <div class="flex flex-1 items-center justify-center">
                    <div class="text-center">
                      <div class="mb-2 text-2xl font-bold">Hero Content</div>
                      <div class="text-muted text-sm">Centered with optional background</div>
                    </div>
                  </div>
                  <div class="p-4 text-center">
                    <div class="bg-primary/20 inline-block rounded px-4 py-2 text-sm">
                      Footer Slot
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Available Slots
                </h4>
                <div class="grid gap-3 md:grid-cols-3">
                  <div class="bg-elevated rounded-lg p-3">
                    <div class="text-primary font-mono text-sm">#background</div>
                    <p class="text-muted mt-1 text-sm">Full-bleed background layer (z-index: 0)</p>
                  </div>
                  <div class="bg-elevated rounded-lg p-3">
                    <div class="text-primary font-mono text-sm">#default</div>
                    <p class="text-muted mt-1 text-sm">Main centered content (z-index: 10)</p>
                  </div>
                  <div class="bg-elevated rounded-lg p-3">
                    <div class="text-primary font-mono text-sm">#footer</div>
                    <p class="text-muted mt-1 text-sm">Bottom-aligned content (z-index: 10)</p>
                  </div>
                </div>
              </div>

              <pre
                class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
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
              <p class="text-muted mt-1 text-sm">Two-column layout with optional mobile reversal</p>
            </template>

            <div class="space-y-6">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="flex items-center justify-center rounded-lg bg-blue-500/20 p-8">
                  <div class="text-center">
                    <div class="font-mono text-sm">#left</div>
                    <div class="text-muted text-sm">Left column</div>
                  </div>
                </div>
                <div class="flex items-center justify-center rounded-lg bg-purple-500/20 p-8">
                  <div class="text-center">
                    <div class="font-mono text-sm">#right</div>
                    <div class="text-muted text-sm">Right column</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="flex flex-wrap gap-3">
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">fullHeight</span>
                    <span class="text-muted ml-2">Force 100svh</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">reverse</span>
                    <span class="text-muted ml-2">Swap order on mobile</span>
                  </div>
                </div>
              </div>

              <pre
                class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
              ><code>&lt;LayoutSectionSplit
          reverse&gt;
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
              <p class="text-muted mt-1 text-sm">
                Auto-placing grid for collections with responsive columns
              </p>
            </template>

            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div
                  v-for="item in galleryItems"
                  :key="item.id"
                  :class="item.color"
                  class="flex items-center justify-center rounded-lg p-6 font-medium text-white"
                >
                  {{ item.title }}
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Default</th>
                        <th class="px-3 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">items</td>
                        <td class="px-3 py-2 font-mono text-xs">T[]</td>
                        <td class="px-3 py-2 font-mono text-xs">required</td>
                        <td class="text-muted px-3 py-2">Array of items to render</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">columns</td>
                        <td class="px-3 py-2 font-mono text-xs">2 | 3 | 4 | 6</td>
                        <td class="px-3 py-2 font-mono text-xs">3</td>
                        <td class="text-muted px-3 py-2">Desktop column count</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">itemRowSpan</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">4</td>
                        <td class="text-muted px-3 py-2">Grid rows per item</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <pre
                class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
              ><code>&lt;LayoutSectionGallery
          :items="images" :columns="3"&gt;
          &lt;template #item="{ item, index }"&gt;
          &lt;NuxtImg :src="item.src" class="size-full object-cover" /&gt;
          &lt;/template&gt;
          &lt;/LayoutSectionGallery&gt;</code></pre>
            </div>
          </UCard>
        </section>

        <!-- 11. Motion Components -->
        <section id="motion-components" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">Motion Components</h2>
            <p class="text-muted">
              Animation, scroll, and velocity components from the motion layer
            </p>
          </div>

          <!-- useSmoothScroll composable -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-activity" class="text-primary" />
                <h3 class="text-xl font-semibold">useSmoothScroll</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Per-page composable for Locomotive Scroll state — progress, velocity, direction, and
                scroll controls
              </p>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Returns</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Name</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">progress</td>
                        <td class="px-3 py-2 font-mono text-xs">Ref&lt;number&gt;</td>
                        <td class="text-muted px-3 py-2">Scroll progress 0–1</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">velocity</td>
                        <td class="px-3 py-2 font-mono text-xs">Ref&lt;number&gt;</td>
                        <td class="text-muted px-3 py-2">Signed scroll velocity</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">direction</td>
                        <td class="px-3 py-2 font-mono text-xs">Ref&lt;number&gt;</td>
                        <td class="text-muted px-3 py-2">1 = down, -1 = up, 0 = idle</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">scrollY</td>
                        <td class="px-3 py-2 font-mono text-xs">Ref&lt;number&gt;</td>
                        <td class="text-muted px-3 py-2">Absolute scroll position in px</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">scrollTo(target, opts?)</td>
                        <td class="px-3 py-2 font-mono text-xs">Function</td>
                        <td class="text-muted px-3 py-2">
                          Scroll to selector, element, or Y position
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">scrollToTop(opts?)</td>
                        <td class="px-3 py-2 font-mono text-xs">Function</td>
                        <td class="text-muted px-3 py-2">Animated scroll to page top</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">snapToTop()</td>
                        <td class="px-3 py-2 font-mono text-xs">Function</td>
                        <td class="text-muted px-3 py-2">Instant jump to top (no animation)</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">lockScrolling()</td>
                        <td class="px-3 py-2 font-mono text-xs">Function</td>
                        <td class="text-muted px-3 py-2">Disable scroll (e.g. for modals)</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">unlockScrolling()</td>
                        <td class="px-3 py-2 font-mono text-xs">Function</td>
                        <td class="text-muted px-3 py-2">Re-enable scroll</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <TypographyCodeBlock language="typescript" class="text-sm">{{
                `const { progress, velocity, direction, scrollY, scrollTo, scrollToTop, snapToTop, lockScrolling,
                unlockScrolling } = useSmoothScroll()

                // Scroll to a section
                scrollTo('#hero', { offset: -80, duration: 1.5 })

                // Watch velocity for effects
                watch(velocity, (v) => console.log('velocity:', v))`
              }}</TypographyCodeBlock>
            </div>
          </UCard>

          <!-- MotionTextReveal -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-text-cursor-input" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionTextReveal</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Scroll-triggered character, word, or line reveal powered by v-gsap-nuxt SplitText
              </p>
            </template>

            <div class="space-y-6">
              <div class="space-y-4 py-4">
                <ClientOnly>
                  <MotionTextReveal
                    text="Character reveal — type: chars"
                    type="chars"
                    class="text-highlighted text-2xl font-bold"
                  />
                  <MotionTextReveal
                    text="Word by word reveal — type: words"
                    type="words"
                    class="text-highlighted text-2xl font-bold"
                  />
                  <MotionTextReveal
                    text="Line by line reveal — type: lines"
                    type="lines"
                    class="text-highlighted text-2xl font-bold"
                  />
                </ClientOnly>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Default</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">text</td>
                        <td class="px-3 py-2 font-mono text-xs">string</td>
                        <td class="px-3 py-2 font-mono text-xs">required</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">type</td>
                        <td class="px-3 py-2 font-mono text-xs">'chars' | 'words' | 'lines'</td>
                        <td class="px-3 py-2 font-mono text-xs">'chars'</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">stagger</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">0.03</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">duration</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">0.8</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">start</td>
                        <td class="px-3 py-2 font-mono text-xs">string</td>
                        <td class="px-3 py-2 font-mono text-xs">'top 80%'</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm"
                >{{ ` <MotionTextReveal text="Hello World" type="words" :stagger="0.05" />` }}
              </TypographyCodeBlock>
            </template>
          </UCard>

          <!-- MotionScrollProgress -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-loader" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionScrollProgress</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Linear or circular scroll progress indicator tied to
                <code class="font-mono">useSmoothScroll</code>
              </p>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Linear (default)
                </h4>
                <MotionScrollProgress type="linear" :height="6" />
              </div>
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Circular
                </h4>
                <MotionScrollProgress type="circular" :size="80" :stroke-width="6" />
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="flex flex-wrap gap-3">
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">type</span
                    ><span class="text-muted ml-2">'linear' | 'circular'</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">height</span
                    ><span class="text-muted ml-2">px (linear)</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">size</span
                    ><span class="text-muted ml-2">px (circular)</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">strokeWidth</span
                    ><span class="text-muted ml-2">px (circular)</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">showPercentage</span
                    ><span class="text-muted ml-2">boolean</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">colors</span
                    ><span class="text-muted ml-2">[start, mid, end]</span>
                  </div>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">{{
                scrollProgressCodeSample
              }}</TypographyCodeBlock>
            </template>
          </UCard>

          <!-- MotionParallax -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-layers" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionParallax</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                GSAP ScrollTrigger parallax — scroll past to see the depth effect
              </p>
            </template>

            <div class="space-y-6">
              <div class="bg-elevated relative h-48 overflow-hidden rounded-xl">
                <MotionParallax :speed="0.4" class="h-full">
                  <div
                    class="bg-linear-to-br from-primary/30 flex h-full w-full items-center justify-center to-purple-500/30"
                  >
                    <span class="text-highlighted text-lg font-semibold"
                      >Parallax Content (speed: 0.4)</span
                    >
                  </div>
                </MotionParallax>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Default</th>
                        <th class="px-3 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">speed</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">0.5</td>
                        <td class="text-muted px-3 py-2">-1 to 1 (negative = slower)</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">direction</td>
                        <td class="px-3 py-2 font-mono text-xs">'vertical' | 'horizontal'</td>
                        <td class="px-3 py-2 font-mono text-xs">'vertical'</td>
                        <td class="text-muted px-3 py-2">Axis of movement</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">rotate</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">0</td>
                        <td class="text-muted px-3 py-2">Degrees to rotate on scroll</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">scale</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">0</td>
                        <td class="text-muted px-3 py-2">Scale delta added on scroll</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">scrub</td>
                        <td class="px-3 py-2 font-mono text-xs">number</td>
                        <td class="px-3 py-2 font-mono text-xs">0.5</td>
                        <td class="text-muted px-3 py-2">ScrollTrigger scrub lag</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">as</td>
                        <td class="px-3 py-2 font-mono text-xs">string</td>
                        <td class="px-3 py-2 font-mono text-xs">'div'</td>
                        <td class="text-muted px-3 py-2">Wrapper element tag</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm"
                >{{ `<MotionParallax :speed="0.3" :rotate="10">
                  <NuxtImg src="/hero.jpg" class="size-full object-cover" /> </MotionParallax
                >` }}</TypographyCodeBlock
              >
            </template>
          </UCard>

          <!-- MotionVelocityEffect -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-zap" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionVelocityEffect</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Apply scroll-velocity-driven visual distortions — skew, blur, scale, letterSpacing,
                and more
              </p>
            </template>

            <div class="space-y-6">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="bg-elevated rounded-lg p-4 text-center">
                  <p class="text-muted mb-3 text-xs uppercase tracking-wide">effect: skew</p>
                  <MotionVelocityEffect effect="skew" class="text-highlighted text-2xl font-bold">
                    Skew on Scroll
                  </MotionVelocityEffect>
                </div>
                <div class="bg-elevated rounded-lg p-4 text-center">
                  <p class="text-muted mb-3 text-xs uppercase tracking-wide">
                    effect: letterSpacing
                  </p>
                  <MotionVelocityEffect
                    effect="letterSpacing"
                    class="text-highlighted text-2xl font-bold"
                  >
                    Letter Spacing
                  </MotionVelocityEffect>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Available Effects
                </h4>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="effect in [
                      'skew',
                      'scale',
                      'blur',
                      'opacity',
                      'letterSpacing',
                      'rotate',
                      'translateY',
                      'hueRotate',
                    ]"
                    :key="effect"
                    variant="subtle"
                    color="neutral"
                  >
                    {{ effect }}
                  </UBadge>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm"
                >{{ `<MotionVelocityEffect effect="skew" :intensity="5">
                  <h1 class="text-6xl font-black">Fast Scroll</h1> </MotionVelocityEffect
                >` }}</TypographyCodeBlock
              >
            </template>
          </UCard>

          <!-- MotionStaggered -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-list-ordered" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionStaggered</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                CSS-based staggered entry animation on mount — no GSAP required
              </p>
            </template>

            <div class="space-y-6">
              <MotionStaggered class="grid grid-cols-4 gap-3" :stagger-delay="80">
                <div class="bg-elevated rounded-lg p-4 text-center text-sm font-medium">Item 1</div>
                <div class="bg-elevated rounded-lg p-4 text-center text-sm font-medium">Item 2</div>
                <div class="bg-elevated rounded-lg p-4 text-center text-sm font-medium">Item 3</div>
                <div class="bg-elevated rounded-lg p-4 text-center text-sm font-medium">Item 4</div>
              </MotionStaggered>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="flex flex-wrap gap-3">
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">staggerDelay</span
                    ><span class="text-muted ml-2">ms between items (100)</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">initialDelay</span
                    ><span class="text-muted ml-2">ms before first item (0)</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">animation</span
                    ><span class="text-muted ml-2">CSS class name ('fadeIn')</span>
                  </div>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm"
                >{{ `<MotionStaggered
                  class="grid grid-cols-3 gap-4"
                  :stagger-delay="100"
                  :initial-delay="200"
                >
                  <ArticleCard
                    v-for="post in posts"
                    :key="post.id"
                    v-bind="post"
                  /> </MotionStaggered
                >` }}</TypographyCodeBlock
              >
            </template>
          </UCard>

          <!-- MotionScrollStats -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-gauge" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionScrollStats</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Debug overlay showing live scroll state — velocity, progress, direction, and scroll
                Y
              </p>
            </template>

            <div class="space-y-4">
              <p class="text-muted text-sm">
                Add to any page during development to inspect scroll state. Fades when idle, appears
                on scroll.
              </p>
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-default border-b">
                        <th class="px-3 py-2 text-left">Prop</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Default</th>
                      </tr>
                    </thead>
                    <tbody class="divide-default divide-y">
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">show</td>
                        <td class="px-3 py-2 font-mono text-xs">
                          ('velocity' | 'progress' | 'direction' | 'scrollY')[]
                        </td>
                        <td class="px-3 py-2 font-mono text-xs">
                          ['velocity', 'progress', 'direction']
                        </td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">position</td>
                        <td class="px-3 py-2 font-mono text-xs">
                          'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
                        </td>
                        <td class="px-3 py-2 font-mono text-xs">'bottom-right'</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 font-mono text-xs">compact</td>
                        <td class="px-3 py-2 font-mono text-xs">boolean</td>
                        <td class="px-3 py-2 font-mono text-xs">false</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">{{
                scrollStatsCodeSample
              }}</TypographyCodeBlock>
            </template>
          </UCard>

          <!-- MotionMarquee -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-arrow-right-from-line" class="text-primary" />
                <h3 class="text-xl font-semibold">MotionMarquee</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Infinite scroll ticker — velocity-aware, pause-on-hover, configurable direction
              </p>
            </template>

            <div class="space-y-6">
              <div class="border-default overflow-hidden rounded-lg border py-3">
                <MotionMarquee :speed="40" gap="2rem" velocity-based :velocity-sensitivity="0.5">
                  <span
                    v-for="item in [
                      'Core',
                      '◆',
                      'UI',
                      '◆',
                      'Layout',
                      '◆',
                      'Motion',
                      '◆',
                      'Forms',
                      '◆',
                      'Theme',
                      '◆',
                      'Content',
                      '◆',
                    ]"
                    :key="item"
                    class="text-muted whitespace-nowrap text-xs font-semibold uppercase tracking-widest"
                    >{{ item }}</span
                  >
                </MotionMarquee>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Props</h4>
                <div class="flex flex-wrap gap-3">
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">speed</span
                    ><span class="text-muted ml-2">px/s (45)</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">direction</span
                    ><span class="text-muted ml-2">'left' | 'right'</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">gap</span
                    ><span class="text-muted ml-2">CSS spacing</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">pauseOnHover</span
                    ><span class="text-muted ml-2">boolean</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">velocityBased</span
                    ><span class="text-muted ml-2">boolean</span>
                  </div>
                  <div class="bg-elevated rounded-lg px-3 py-2">
                    <span class="font-mono text-sm">velocitySensitivity</span
                    ><span class="text-muted ml-2">number</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- 12. LinksGroup -->
        <section id="links-group" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">LinksGroup</h2>
            <p class="text-muted">
              Hover one item to dim the rest — works with any direct children
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-mouse-pointer-click" class="text-primary" />
                <h3 class="text-xl font-semibold">LinksGroup</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Wraps children in a hover-to-focus group with configurable dim opacity and
                transition duration
              </p>
            </template>

            <div class="space-y-8">
              <!-- Nav Links -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Navigation Links
                </h4>
                <LinksGroup class="flex gap-6">
                  <a href="#" class="text-highlighted text-lg font-medium">Home</a>
                  <a href="#" class="text-highlighted text-lg font-medium">About</a>
                  <a href="#" class="text-highlighted text-lg font-medium">Work</a>
                  <a href="#" class="text-highlighted text-lg font-medium">Blog</a>
                  <a href="#" class="text-highlighted text-lg font-medium">Contact</a>
                </LinksGroup>
              </div>

              <!-- Buttons -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Buttons</h4>
                <LinksGroup class="flex gap-3">
                  <UButton variant="solid">Primary</UButton>
                  <UButton variant="outline">Outline</UButton>
                  <UButton variant="soft">Soft</UButton>
                  <UButton variant="ghost">Ghost</UButton>
                </LinksGroup>
              </div>

              <!-- Cards Grid -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Card Grid
                </h4>
                <LinksGroup class="grid grid-cols-3 gap-4" :duration="300">
                  <div class="border-default bg-elevated rounded-lg border p-6 text-center">
                    <UIcon name="i-lucide-code" class="text-primary mb-2 text-2xl" />
                    <p class="font-medium">Development</p>
                  </div>
                  <div class="border-default bg-elevated rounded-lg border p-6 text-center">
                    <UIcon name="i-lucide-palette" class="text-primary mb-2 text-2xl" />
                    <p class="font-medium">Design</p>
                  </div>
                  <div class="border-default bg-elevated rounded-lg border p-6 text-center">
                    <UIcon name="i-lucide-rocket" class="text-primary mb-2 text-2xl" />
                    <p class="font-medium">Deploy</p>
                  </div>
                </LinksGroup>
              </div>

              <!-- Custom Opacity -->
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Custom Dim (0.1)
                </h4>
                <LinksGroup class="flex gap-4" :dim-opacity="0.1">
                  <span class="text-3xl">🚀</span>
                  <span class="text-3xl">💡</span>
                  <span class="text-3xl">⭐</span>
                  <span class="text-3xl">🔥</span>
                  <span class="text-3xl">🌈</span>
                </LinksGroup>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">
                {{ `<LinksGroup class="flex gap-6">
                  <a href="/home">Home</a>
                  <a href="/about">About</a>
                  <a href="/contact">Contact</a> </LinksGroup
                >` }}
              </TypographyCodeBlock>
            </template>
          </UCard>
        </section>

        <!-- 13. UI Components -->
        <section id="ui-components" class="space-y-8">
          <div>
            <h2 class="mb-1 text-2xl font-bold">UI Components</h2>
            <p class="text-muted">
              Nuxt UI component showcase — buttons, badges, cards, kbd, progress
            </p>
          </div>

          <!-- Buttons -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-mouse-pointer" class="text-primary" />
                <h3 class="text-xl font-semibold">Buttons</h3>
              </div>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Variants
                </h4>
                <div class="flex flex-wrap gap-3">
                  <UButton variant="solid">Solid</UButton>
                  <UButton variant="outline">Outline</UButton>
                  <UButton variant="soft">Soft</UButton>
                  <UButton variant="subtle">Subtle</UButton>
                  <UButton variant="ghost">Ghost</UButton>
                  <UButton variant="link">Link</UButton>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Sizes</h4>
                <div class="flex flex-wrap items-center gap-3">
                  <UButton size="xs">Extra Small</UButton>
                  <UButton size="sm">Small</UButton>
                  <UButton size="md">Medium</UButton>
                  <UButton size="lg">Large</UButton>
                  <UButton size="xl">Extra Large</UButton>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Colors</h4>
                <div class="flex flex-wrap gap-3">
                  <UButton color="primary">Primary</UButton>
                  <UButton color="secondary">Secondary</UButton>
                  <UButton color="neutral">Neutral</UButton>
                  <UButton color="success">Success</UButton>
                  <UButton color="warning">Warning</UButton>
                  <UButton color="error">Error</UButton>
                  <UButton color="info">Info</UButton>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  With Icons
                </h4>
                <div class="flex flex-wrap gap-3">
                  <UButton icon="i-lucide-rocket">Launch</UButton>
                  <UButton trailing-icon="i-lucide-arrow-right">Continue</UButton>
                  <UButton icon="i-lucide-download" variant="outline">Download</UButton>
                  <UButton
                    icon="i-simple-icons-github"
                    color="neutral"
                    variant="ghost"
                    aria-label="GitHub"
                  />
                </div>
              </div>
            </div>
          </UCard>

          <!-- Badges -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-tag" class="text-primary" />
                <h3 class="text-xl font-semibold">Badges</h3>
              </div>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">
                  Variants
                </h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge variant="solid">Solid</UBadge>
                  <UBadge variant="outline">Outline</UBadge>
                  <UBadge variant="soft">Soft</UBadge>
                  <UBadge variant="subtle">Subtle</UBadge>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium uppercase tracking-wide">Colors</h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge color="primary">Primary</UBadge>
                  <UBadge color="secondary">Secondary</UBadge>
                  <UBadge color="neutral">Neutral</UBadge>
                  <UBadge color="success">Success</UBadge>
                  <UBadge color="warning">Warning</UBadge>
                  <UBadge color="error">Error</UBadge>
                  <UBadge color="info">Info</UBadge>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Kbd + Progress -->
          <div class="grid gap-6 md:grid-cols-2">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-keyboard" class="text-primary" />
                  <h3 class="text-xl font-semibold">Kbd</h3>
                </div>
              </template>
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-1">
                  <UKbd>⌘</UKbd><span class="text-muted">+</span>
                  <UKbd>K</UKbd>
                </div>
                <div class="flex items-center gap-1">
                  <UKbd>Ctrl</UKbd><span class="text-muted">+</span>
                  <UKbd>S</UKbd>
                </div>
                <div class="flex items-center gap-1">
                  <UKbd>⌥</UKbd><span class="text-muted">+</span> <UKbd>⇧</UKbd
                  ><span class="text-muted">+</span>
                  <UKbd>F</UKbd>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-bar-chart-2" class="text-primary" />
                  <h3 class="text-xl font-semibold">Progress</h3>
                </div>
              </template>
              <div class="space-y-4">
                <UProgress :value="25" color="primary" />
                <UProgress :value="50" color="success" />
                <UProgress :value="75" color="warning" />
                <UProgress :value="90" color="error" />
              </div>
            </UCard>
          </div>
        </section>

        <!-- Back to top + nav -->
        <div class="border-default space-y-4 border-t pt-8">
          <div class="flex flex-wrap justify-center gap-3">
            <UButton to="/" variant="outline" icon="i-lucide-arrow-left"> Back to Home </UButton>
            <UButton
              href="#typography-headlines"
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-up"
            >
              Back to Top
            </UButton>
            <UButton
              to="https://github.com/kieranmansfield/starter-template"
              target="_blank"
              variant="ghost"
              color="neutral"
              icon="i-simple-icons-github"
            >
              View Source
            </UButton>
          </div>
          <p class="text-muted text-center text-xs">
            kmcom-nuxt-layers v1.6.3 — {{ tocItems.length }} sections
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
