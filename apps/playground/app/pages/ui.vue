<script setup lang="ts">
import type { UiColors } from '#layers/ui/app/types/colors'

const { setPageAccent } = useAccentColor()
setPageAccent('pink')
onUnmounted(() => setPageAccent(null))

// Color tokens for demo
const semanticColors: UiColors[] = [
  'dimmed',
  'muted',
  'toned',
  'default',
  'highlighted',
  'inverted',
]
// Status colors that UBadge supports
const statusColors = ['info', 'success', 'warning', 'error'] as const
// Brand colors that UBadge supports
const brandColors = ['primary', 'secondary', 'neutral'] as const
// Additional custom colors (shown as styled divs)
const customColors: UiColors[] = ['accent']
const baseColors: UiColors[] = ['black', 'white']

// Progress interactive demo
const circularSlider = ref(50)
const circularProgress = computed(() => circularSlider.value / 100)

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

// Code snippets for component demos
const snippetHeadline = `<TypographyHeadline :level="2">Headline Level 2</TypographyHeadline>`

const snippetTextStroke = `<h1 class="text-8xl font-bold">
  <TypographyTextStroke text="Hello" :stroke-width="2" stroke-color="red" />
</h1>`

const snippetLinksGroup = `<LinksGroup class="flex gap-6">
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</LinksGroup>`

const snippetPictureBasic = `<MediaPicture src="/image.jpg" alt="Description" />`

const snippetPictureResponsive = `<MediaPicture
  src="/image.jpg"
  :sizes="{ default: '100vw', sm: '50vw', lg: '33vw' }"
/>`

const snippetProgressCircular = `<ProgressCircular :progress="0.5" />
<ProgressCircular :progress="0.75" :size="180" :stroke-width="12" />
<ProgressCircular :progress="1" :show-percentage="false" />`

const snippetProgressBar = `<ProgressBar :progress="0.6" color="success" />
<ProgressBar :progress="null" animation="carousel" />`

const snippetGradientBackground = `<GradientBackground preset="brand" class="p-8 rounded-xl">
  Slot content
</GradientBackground>`

const snippetGradientText = `<GradientText preset="brand" class="text-5xl font-black">Hello</GradientText>`

const snippetTintOverlay = `<TintOverlay color="primary" level="medium">
  Your content
</TintOverlay>`

const snippetAccentScene = `<AccentScene preset="hero" class="h-screen">
  <YourHeroContent />
</AccentScene>`

definePageMeta({ layout: { name: 'grid', props: { showHeader: true, showFooter: true } } })
</script>

<template>
  <LayoutPage
    title="UI Layer Demo"
    description="Demonstrating the UI layer typography, colors, and media components"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 py-8">
          <LayoutPageHeader
            title="UI Layer"
            description="Typography, colors, and media components"
            back="/"
          />

          <!-- Typography Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Typography Components</h2>
              <p class="text-gray-500">
                Semantic typography with configurable weight, width, slant, and more
              </p>
            </div>

            <!-- Headlines -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-heading" class="text-primary" />
                  <h3 class="text-xl font-semibold">Headline</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Semantic h1-h6 headings with responsive sizing
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
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetHeadline
                }}</TypographyCodeBlock>
              </template>
            </UCard>

            <!-- Typography Base -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-type" class="text-primary" />
                  <h3 class="text-xl font-semibold">Typography</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Base typography component with font axis controls
                </p>
              </template>

              <div class="space-y-6">
                <!-- Weight -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Font Weight
                  </h4>
                  <div class="space-y-2">
                    <Typography
                      v-for="weight in fontWeights"
                      :key="weight"
                      :weight="weight"
                      class="text-lg"
                    >
                      {{ weight.replace('font-', '') }} - The quick brown fox jumps over the lazy
                      dog
                    </Typography>
                  </div>
                </div>

                <!-- Slant -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Font Slant
                  </h4>
                  <div class="space-y-2">
                    <Typography slant="normal" class="text-lg"
                      >Normal - The quick brown fox</Typography
                    >
                    <Typography slant="italic" class="text-lg"
                      >Italic - The quick brown fox</Typography
                    >
                  </div>
                </div>

                <!-- Leading -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Line Height (Leading)
                  </h4>
                  <div class="grid gap-4 md:grid-cols-3">
                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <Typography leading="leading-tight" class="text-sm">
                        <strong>Tight</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed do eiusmod tempor.
                      </Typography>
                    </div>
                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <Typography leading="leading-normal" class="text-sm">
                        <strong>Normal</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed do eiusmod tempor.
                      </Typography>
                    </div>
                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <Typography leading="leading-loose" class="text-sm">
                        <strong>Loose</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed do eiusmod tempor.
                      </Typography>
                    </div>
                  </div>
                </div>

                <!-- Transform -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
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

            <!-- CodeBlock -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-code" class="text-primary" />
                  <h3 class="text-xl font-semibold">CodeBlock</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Semantic pre/code wrapper for code snippets
                </p>
              </template>

              <TypographyCodeBlock
                language="typescript"
                class="bg-gray-900 text-gray-100 p-4 rounded-lg"
              >
                {{ sampleCode }}
              </TypographyCodeBlock>
            </UCard>

            <!-- QuoteBlock -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-quote" class="text-primary" />
                  <h3 class="text-xl font-semibold">QuoteBlock</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">Semantic blockquote wrapper</p>
              </template>

              <TypographyQuoteBlock class="border-l-4 border-primary pl-4 italic">
                "The best way to predict the future is to create it."
                <Typography tag="span" class="block mt-2 text-sm text-gray-500 not-italic">
                  - Peter Drucker
                </Typography>
              </TypographyQuoteBlock>
            </UCard>

            <!-- TextStroke -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-pen-tool" class="text-primary" />
                  <h3 class="text-xl font-semibold">TextStroke</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  SVG-based text stroke for crisp outlines at any size
                </p>
              </template>

              <div class="space-y-8">
                <!-- Outline only -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Outline Only
                  </h4>
                  <div class="text-7xl font-bold">
                    <TypographyTextStroke text="Outline" :stroke-width="2" />
                  </div>
                </div>

                <!-- Fill + Stroke -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Fill + Stroke
                  </h4>
                  <div class="text-7xl font-bold text-primary">
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
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
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
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Colors
                  </h4>
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

                <!-- Sizes -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Sizes (inherited)
                  </h4>
                  <div class="space-y-2">
                    <div class="text-2xl font-semibold">
                      <TypographyTextStroke text="text-2xl" :stroke-width="1" />
                    </div>
                    <div class="text-5xl font-bold">
                      <TypographyTextStroke text="text-5xl" :stroke-width="2" />
                    </div>
                    <div class="text-8xl font-black">
                      <TypographyTextStroke text="text-8xl" :stroke-width="3" />
                    </div>
                  </div>
                </div>

                <!-- Inside Headline -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Inside Headline
                  </h4>
                  <TypographyHeadline :level="1">
                    <TypographyTextStroke text="Headline Stroke" tag="span" :stroke-width="2" />
                  </TypographyHeadline>
                </div>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetTextStroke
                }}</TypographyCodeBlock>
              </template>
            </UCard>
          </section>

          <!-- Color System Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Color System</h2>
              <p class="text-gray-500">Semantic, status, brand, and base color tokens</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-palette" class="text-primary" />
                  <h3 class="text-xl font-semibold">useColor()</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Color tokens with text, bg, and border usage types
                </p>
              </template>

              <div class="space-y-6">
                <!-- Semantic Colors -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Semantic Colors
                  </h4>
                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="color in semanticColors"
                      :key="color"
                      class="px-4 py-2 rounded-lg border"
                    >
                      <Typography :color="color" weight="font-medium">{{ color }}</Typography>
                    </div>
                  </div>
                </div>

                <!-- Status Colors -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Status Colors
                  </h4>
                  <div class="flex flex-wrap gap-3">
                    <UBadge v-for="color in statusColors" :key="color" :color="color" size="lg">
                      {{ color }}
                    </UBadge>
                  </div>
                </div>

                <!-- Brand Colors -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Brand Colors
                  </h4>
                  <div class="flex flex-wrap gap-3">
                    <UBadge v-for="color in brandColors" :key="color" :color="color" size="lg">
                      {{ color }}
                    </UBadge>
                    <div
                      v-for="color in customColors"
                      :key="color"
                      class="px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      <Typography :color="color" weight="font-medium">{{ color }}</Typography>
                    </div>
                  </div>
                </div>

                <!-- Base Colors -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Base Colors
                  </h4>
                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="color in baseColors"
                      :key="color"
                      class="px-4 py-2 rounded-lg border"
                      :class="color === 'black' ? 'bg-black text-white' : 'bg-white text-black'"
                    >
                      {{ color }}
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Link Group Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Link Group</h2>
              <p class="text-gray-500">
                Hover one item to dim the rest — works with any direct children
              </p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-mouse-pointer-click" class="text-primary" />
                  <h3 class="text-xl font-semibold">LinksGroup</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Wraps children in a hover-to-focus group with configurable dim opacity and
                  transition duration
                </p>
              </template>

              <div class="space-y-8">
                <!-- Nav Links -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Navigation Links
                  </h4>
                  <LinksGroup class="flex gap-6">
                    <a href="#" class="text-lg font-medium text-highlighted">Home</a>
                    <a href="#" class="text-lg font-medium text-highlighted">About</a>
                    <a href="#" class="text-lg font-medium text-highlighted">Work</a>
                    <a href="#" class="text-lg font-medium text-highlighted">Blog</a>
                    <a href="#" class="text-lg font-medium text-highlighted">Contact</a>
                  </LinksGroup>
                </div>

                <!-- Buttons -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Buttons
                  </h4>
                  <LinksGroup class="flex gap-3">
                    <UButton variant="solid">Primary</UButton>
                    <UButton variant="outline">Outline</UButton>
                    <UButton variant="soft">Soft</UButton>
                    <UButton variant="ghost">Ghost</UButton>
                  </LinksGroup>
                </div>

                <!-- Cards Grid -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Card Grid
                  </h4>
                  <LinksGroup class="grid grid-cols-3 gap-4" :duration="300">
                    <div class="p-6 rounded-lg border border-default bg-elevated text-center">
                      <UIcon name="i-lucide-code" class="text-2xl text-primary mb-2" />
                      <p class="font-medium">Development</p>
                    </div>
                    <div class="p-6 rounded-lg border border-default bg-elevated text-center">
                      <UIcon name="i-lucide-palette" class="text-2xl text-primary mb-2" />
                      <p class="font-medium">Design</p>
                    </div>
                    <div class="p-6 rounded-lg border border-default bg-elevated text-center">
                      <UIcon name="i-lucide-rocket" class="text-2xl text-primary mb-2" />
                      <p class="font-medium">Deploy</p>
                    </div>
                  </LinksGroup>
                </div>

                <!-- Custom Opacity -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Custom Dim (0.1)
                  </h4>
                  <LinksGroup class="flex gap-4" :dim-opacity="0.1">
                    <span class="text-3xl">&#x1F680;</span>
                    <span class="text-3xl">&#x1F4A1;</span>
                    <span class="text-3xl">&#x2B50;</span>
                    <span class="text-3xl">&#x1F525;</span>
                    <span class="text-3xl">&#x1F308;</span>
                  </LinksGroup>
                </div>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetLinksGroup
                }}</TypographyCodeBlock>
              </template>
            </UCard>
          </section>

          <!-- Media Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Media Components</h2>
              <p class="text-gray-500">
                Responsive images with smart sizing and format optimization
              </p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-image" class="text-primary" />
                  <h3 class="text-xl font-semibold">Picture</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  NuxtPicture wrapper with responsive sizing and format detection
                </p>
              </template>

              <div class="space-y-6">
                <div class="grid gap-6 md:grid-cols-2">
                  <!-- Basic Usage -->
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Basic Usage
                    </h4>
                    <div
                      class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center"
                    >
                      <div class="text-center text-gray-400">
                        <UIcon name="i-lucide-image" class="text-4xl mb-2" />
                        <p class="text-sm">Image placeholder</p>
                      </div>
                    </div>
                    <TypographyCodeBlock language="vue" class="text-xs">{{
                      snippetPictureBasic
                    }}</TypographyCodeBlock>
                  </div>

                  <!-- Responsive Sizes -->
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Responsive Sizes
                    </h4>
                    <div
                      class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center"
                    >
                      <div class="text-center text-gray-400">
                        <UIcon name="i-lucide-monitor-smartphone" class="text-4xl mb-2" />
                        <p class="text-sm">Responsive image</p>
                      </div>
                    </div>
                    <TypographyCodeBlock language="vue" class="text-xs">{{
                      snippetPictureResponsive
                    }}</TypographyCodeBlock>
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
                          <th class="text-left py-2 px-3">Default</th>
                          <th class="text-left py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y">
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">format</td>
                          <td class="py-2 px-3 font-mono text-xs">'webp'</td>
                          <td class="py-2 px-3">Output format (avif, webp, jpg, png)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">quality</td>
                          <td class="py-2 px-3 font-mono text-xs">80</td>
                          <td class="py-2 px-3">Image quality (0-100)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">loading</td>
                          <td class="py-2 px-3 font-mono text-xs">'lazy'</td>
                          <td class="py-2 px-3">Loading strategy (lazy, eager)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">fit</td>
                          <td class="py-2 px-3 font-mono text-xs">'cover'</td>
                          <td class="py-2 px-3">Object fit (cover, contain, fill)</td>
                        </tr>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">sizes</td>
                          <td class="py-2 px-3 font-mono text-xs">'100vw'</td>
                          <td class="py-2 px-3">
                            Responsive sizes (string or ResponsiveSizes object)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Breakpoints Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Breakpoint System</h2>
              <p class="text-gray-500">Multiple breakpoint paradigms for responsive design</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-ruler" class="text-primary" />
                  <h3 class="text-xl font-semibold">Breakpoint Types</h3>
                </div>
              </template>

              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <!-- Tailwind -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Tailwind
                  </h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="font-mono">sm</span><span class="text-gray-500">640px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">md</span><span class="text-gray-500">768px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">lg</span><span class="text-gray-500">1024px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">xl</span><span class="text-gray-500">1280px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">2xl</span><span class="text-gray-500">1536px</span>
                    </div>
                  </div>
                </div>

                <!-- Device -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Device
                  </h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="font-mono">mobile</span><span class="text-gray-500">0px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">tablet</span><span class="text-gray-500">640px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">desktop</span
                      ><span class="text-gray-500">1024px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">wide</span><span class="text-gray-500">1920px</span>
                    </div>
                  </div>
                </div>

                <!-- Phone -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Phone
                  </h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="font-mono">phone-sm</span
                      ><span class="text-gray-500">320px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">phone-md</span
                      ><span class="text-gray-500">375px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">phone-lg</span
                      ><span class="text-gray-500">428px</span>
                    </div>
                  </div>
                </div>

                <!-- Tablet -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Tablet
                  </h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="font-mono">tablet-sm</span
                      ><span class="text-gray-500">768px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">tablet-md</span
                      ><span class="text-gray-500">834px</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">tablet-lg</span
                      ><span class="text-gray-500">1024px</span>
                    </div>
                  </div>
                </div>

                <!-- Orientation -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Orientation
                  </h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="font-mono">portrait</span
                      ><span class="text-gray-500">vertical</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-mono">landscape</span
                      ><span class="text-gray-500">horizontal</span>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Progress Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Progress Components</h2>
              <p class="text-gray-500">Circular ring and linear bar progress indicators</p>
            </div>

            <!-- ProgressCircular -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-loader-circle" class="text-primary" />
                  <h3 class="text-xl font-semibold">ProgressCircular</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  SVG ring with gradient stroke — pass any 0–1 value
                </p>
              </template>

              <div class="space-y-8">
                <!-- Static values -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-4">
                    Static values
                  </h4>
                  <div class="flex flex-wrap gap-8 items-center">
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="0.25" />
                      <span class="text-xs text-gray-500">:progress="0.25"</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="0.5" />
                      <span class="text-xs text-gray-500">:progress="0.5"</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="0.75" />
                      <span class="text-xs text-gray-500">:progress="0.75"</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="1" />
                      <span class="text-xs text-gray-500">:progress="1"</span>
                    </div>
                  </div>
                </div>

                <!-- Sizes -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-4">
                    Sizes
                  </h4>
                  <div class="flex flex-wrap gap-8 items-end">
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="0.6" :size="64" :stroke-width="5" />
                      <span class="text-xs text-gray-500">:size="64"</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="0.6" />
                      <span class="text-xs text-gray-500">:size="120" (default)</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <ProgressCircular :progress="0.6" :size="180" :stroke-width="12" />
                      <span class="text-xs text-gray-500">:size="180"</span>
                    </div>
                  </div>
                </div>

                <!-- No percentage -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-4">
                    Without label
                  </h4>
                  <ProgressCircular :progress="0.7" :show-percentage="false" />
                </div>

                <!-- Interactive -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-4">
                    Interactive
                  </h4>
                  <div class="flex flex-col items-start gap-4">
                    <ProgressCircular :progress="circularProgress" />
                    <USlider v-model="circularSlider" :min="0" :max="100" class="w-64" />
                    <span class="text-xs text-gray-500">{{ circularSlider }}%</span>
                  </div>
                </div>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetProgressCircular
                }}</TypographyCodeBlock>
              </template>
            </UCard>

            <!-- ProgressBar -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-minus" class="text-primary" />
                  <h3 class="text-xl font-semibold">ProgressBar</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Wraps Nuxt UI's UProgress — pass a 0–1 value, null for indeterminate
                </p>
              </template>

              <div class="space-y-6">
                <!-- Static values -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Static values
                  </h4>
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <span class="text-xs text-gray-500">:progress="0.3"</span>
                      <ProgressBar :progress="0.3" />
                    </div>
                    <div class="space-y-1">
                      <span class="text-xs text-gray-500">:progress="0.6"</span>
                      <ProgressBar :progress="0.6" />
                    </div>
                    <div class="space-y-1">
                      <span class="text-xs text-gray-500">:progress="1"</span>
                      <ProgressBar :progress="1" />
                    </div>
                  </div>
                </div>

                <!-- Colors -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Colors
                  </h4>
                  <div class="space-y-3">
                    <ProgressBar :progress="0.6" color="primary" />
                    <ProgressBar :progress="0.6" color="success" />
                    <ProgressBar :progress="0.6" color="warning" />
                    <ProgressBar :progress="0.6" color="error" />
                  </div>
                </div>

                <!-- Indeterminate -->
                <div>
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                    Indeterminate (:progress="null")
                  </h4>
                  <ProgressBar :progress="null" animation="carousel" />
                </div>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetProgressBar
                }}</TypographyCodeBlock>
              </template>
            </UCard>
          </section>

          <!-- Gradients & Accents Section -->
          <section class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-2">Gradients & Accents</h2>
              <p class="text-gray-500">
                CSS-var driven gradients, tints, and decorative blob scenes — all reactive to accent
                changes
              </p>
            </div>

            <!-- GradientBackground -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layers" class="text-primary" />
                  <h3 class="text-xl font-semibold">GradientBackground</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Wraps any tag with a CSS-var gradient that reacts to the active accent
                </p>
              </template>

              <div class="grid gap-4 md:grid-cols-3">
                <GradientBackground
                  v-for="preset in ['brand', 'subtle', 'hero']"
                  :key="preset"
                  :preset="preset"
                  class="min-h-[120px] rounded-xl flex items-center justify-center p-4"
                >
                  <span class="font-semibold text-white mix-blend-overlay capitalize">{{
                    preset
                  }}</span>
                </GradientBackground>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetGradientBackground
                }}</TypographyCodeBlock>
              </template>
            </UCard>

            <!-- GradientText -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-type" class="text-primary" />
                  <h3 class="text-xl font-semibold">GradientText</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Gradient-clipped text that reacts live to accent changes
                </p>
              </template>

              <div class="space-y-4">
                <div class="text-5xl font-black">
                  <GradientText preset="brand">Nuxt Layers</GradientText>
                </div>
                <div class="text-3xl font-bold">
                  <GradientText preset="hero">Design system</GradientText>
                </div>
                <div class="text-3xl font-bold">
                  <GradientText preset="subtle">Subtle fade</GradientText>
                </div>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetGradientText
                }}</TypographyCodeBlock>
              </template>
            </UCard>

            <!-- TintOverlay -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-blend" class="text-primary" />
                  <h3 class="text-xl font-semibold">TintOverlay</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Semi-transparent color layer — opacity set as inline style for non-JIT-safe values
                </p>
              </template>

              <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <TintOverlay
                  v-for="level in ['subtle', 'light', 'medium', 'strong', 'heavy']"
                  :key="level"
                  color="primary"
                  :level="level"
                  class="min-h-[80px] rounded-xl border border-default flex items-end p-3"
                >
                  <span class="text-xs font-mono text-highlighted relative z-10">{{ level }}</span>
                </TintOverlay>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetTintOverlay
                }}</TypographyCodeBlock>
              </template>
            </UCard>

            <!-- AccentScene -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-sparkles" class="text-primary" />
                  <h3 class="text-xl font-semibold">AccentScene</h3>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Composable blurred orbs clipped to their container — all accent-reactive
                </p>
              </template>

              <div class="grid gap-4 md:grid-cols-2">
                <AccentScene
                  v-for="preset in ['hero', 'corner', 'scattered', 'minimal']"
                  :key="preset"
                  :preset="preset"
                  class="h-48 rounded-xl border border-default bg-elevated/30"
                >
                  <div class="flex items-center justify-center h-full">
                    <span class="font-semibold text-highlighted capitalize">{{ preset }}</span>
                  </div>
                </AccentScene>
              </div>

              <template #footer>
                <TypographyCodeBlock language="vue" class="text-sm">{{
                  snippetAccentScene
                }}</TypographyCodeBlock>
              </template>
            </UCard>
          </section>

          <!-- Navigation -->
          <div class="flex gap-4 justify-center pt-4">
            <UButton to="/core" variant="outline" icon="i-lucide-arrow-left">
              Core Layer Demo
            </UButton>
            <UButton to="/" icon="i-lucide-home"> Back to Home </UButton>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
