<script setup lang="ts">
  import type { UiColors } from '#layers/ui/app/types/colors'
  import type { TintLevel } from '#layers/ui/app/types/tint'

  const { setPageAccent } = useAccentColor()
  setPageAccent('pink')
  onUnmounted(() => setPageAccent(null))

  const semanticColors: UiColors[] = [
    'dimmed',
    'muted',
    'toned',
    'default',
    'highlighted',
    'inverted',
  ]
  const statusColors = ['info', 'success', 'warning', 'error'] as const
  const brandColors = ['primary', 'secondary', 'neutral'] as const
  const customColors: UiColors[] = ['accent']
  const baseColors: UiColors[] = ['black', 'white']

  const circularSlider = ref(50)
  const circularProgress = computed(() => circularSlider.value / 100)

  const fontWeights = [
    'font-thin',
    'font-light',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'font-black',
  ] as const

  const sampleCode = `function useScreen() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('md')
  const isDesktop = breakpoints.greaterOrEqual('lg')
  return { isMobile, isDesktop }
}`

  const snippetHeadline = '<TypographyHeadline :level="2">Headline Level 2</TypographyHeadline>'

  const snippetTextStroke = `<h1 class="text-8xl font-bold">
  <TypographyTextStroke text="Hello" :stroke-width="2" stroke-color="red" />
</h1>`

  const snippetLinksGroup = `<LinksGroup class="flex gap-6">
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</LinksGroup>`

  const snippetPictureBasic = '<MediaPicture src="/image.jpg" alt="Description" />'

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

  const snippetGradientText =
    '<GradientText preset="brand" class="text-5xl font-black">Hello</GradientText>'

  const snippetTintOverlay = `<TintOverlay color="primary" level="medium">
  Your content
</TintOverlay>`

  const snippetAccentScene = `<AccentScene preset="hero" class="h-screen">
  <YourHeroContent />
</AccentScene>`

  definePageMeta({ layout: false })
</script>

<template>
  <LayoutPage
    title="Typography & UI"
    description="Demonstrating the UI layer typography, colors, and media components"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="TYPOGRAPHY"
        description="Typography components — Headline, TextStroke, CodeBlock — plus useTypography and useColor composables."
      />
      <UContainer class="space-y-12 py-8">
              <!-- Typography Section -->
              <section class="space-y-8">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Typography Components</h2>
                  <p class="text-muted">
                    Semantic typography with configurable weight, width, slant, and more
                  </p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-heading" class="text-primary" />
                      <h3 class="text-xl font-semibold">Headline</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
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

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-type" class="text-primary" />
                      <h3 class="text-xl font-semibold">Typography</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Base typography component with font axis controls
                    </p>
                  </template>

                  <div class="space-y-6">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Font Weight
                      </h4>
                      <div class="space-y-2">
                        <Typography
                          v-for="weight in fontWeights"
                          :key="weight"
                          :weight
                          class="text-lg"
                        >
                          {{ weight.replace('font-', '') }} - The quick brown fox jumps over the
                          lazy dog
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Font Slant
                      </h4>
                      <div class="space-y-2">
                        <Typography slant="normal" class="text-lg">
                          Normal - The quick brown fox
                        </Typography>
                        <Typography slant="italic" class="text-lg">
                          Italic - The quick brown fox
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Line Height (Leading)
                      </h4>
                      <div class="grid gap-4 md:grid-cols-3">
                        <div class="p-3 bg-accented rounded">
                          <Typography leading="leading-tight" class="text-sm">
                            <strong>Tight</strong> - Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor.
                          </Typography>
                        </div>
                        <div class="p-3 bg-accented rounded">
                          <Typography leading="leading-normal" class="text-sm">
                            <strong>Normal</strong> - Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor.
                          </Typography>
                        </div>
                        <div class="p-3 bg-accented rounded">
                          <Typography leading="leading-loose" class="text-sm">
                            <strong>Loose</strong> - Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor.
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-code" class="text-primary" />
                      <h3 class="text-xl font-semibold">CodeBlock</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Semantic pre/code wrapper for code snippets
                    </p>
                  </template>

                  <TypographyCodeBlock
                    language="typescript"
                    class="bg-muted text-highlighted p-4 rounded-lg"
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
                    <p class="text-sm text-muted mt-1">Semantic blockquote wrapper</p>
                  </template>

                  <TypographyQuoteBlock class="border-l-4 border-primary pl-4 italic">
                    "The best way to predict the future is to create it."
                    <Typography tag="span" class="block mt-2 text-sm text-muted not-italic">
                      - Peter Drucker
                    </Typography>
                  </TypographyQuoteBlock>
                </UCard>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-pen-tool" class="text-primary" />
                      <h3 class="text-xl font-semibold">TextStroke</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      SVG-based text stroke for crisp outlines at any size
                    </p>
                  </template>

                  <div class="space-y-8">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Outline Only
                      </h4>
                      <div class="text-7xl font-bold">
                        <TypographyTextStroke text="Outline" :stroke-width="2" />
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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
                  <p class="text-muted">Semantic, status, brand, and base color tokens</p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-palette" class="text-primary" />
                      <h3 class="text-xl font-semibold">useColor()</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Color tokens with text, bg, and border usage types
                    </p>
                  </template>

                  <div class="space-y-6">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Semantic Colors
                      </h4>
                      <div class="flex flex-wrap gap-3">
                        <div
                          v-for="color in semanticColors"
                          :key="color"
                          class="px-4 py-2 rounded-lg border"
                        >
                          <Typography :color weight="font-medium">{{ color }}</Typography>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Status Colors
                      </h4>
                      <div class="flex flex-wrap gap-3">
                        <UBadge v-for="color in statusColors" :key="color" :color size="lg">
                          {{ color }}
                        </UBadge>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Brand Colors
                      </h4>
                      <div class="flex flex-wrap gap-3">
                        <UBadge v-for="color in brandColors" :key="color" :color size="lg">
                          {{ color }}
                        </UBadge>
                        <div
                          v-for="color in customColors"
                          :key="color"
                          class="px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          <Typography :color weight="font-medium">{{ color }}</Typography>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Base Colors
                      </h4>
                      <div class="flex flex-wrap gap-3">
                        <div
                          v-for="color in baseColors"
                          :key="color"
                          class="px-4 py-2 rounded-lg border"
                          :class="color === 'black' ? 'bg-black text-highlighted' : 'bg-white text-black'"
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
                    <p class="text-sm text-muted mt-1">
                      Wraps children in a hover-to-focus group with configurable dim opacity and
                      transition duration
                    </p>
                  </template>

                  <div class="space-y-8">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Buttons
                      </h4>
                      <LinksGroup class="flex gap-3">
                        <UButton variant="solid">Primary</UButton>
                        <UButton variant="outline">Outline</UButton>
                        <UButton variant="soft">Soft</UButton>
                        <UButton variant="ghost">Ghost</UButton>
                      </LinksGroup>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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
                  <p class="text-muted">
                    Responsive images with smart sizing and format optimization
                  </p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-image" class="text-primary" />
                      <h3 class="text-xl font-semibold">Picture</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      NuxtPicture wrapper with responsive sizing and format detection
                    </p>
                  </template>

                  <div class="space-y-6">
                    <div class="grid gap-6 md:grid-cols-2">
                      <div class="space-y-3">
                        <h4 class="text-sm font-medium uppercase tracking-wide text-muted">
                          Basic Usage
                        </h4>
                        <div
                          class="aspect-video bg-accented rounded-lg overflow-hidden flex items-center justify-center"
                        >
                          <div class="text-center text-muted">
                            <UIcon name="i-lucide-image" class="text-4xl mb-2" />
                            <p class="text-sm">Image placeholder</p>
                          </div>
                        </div>
                        <TypographyCodeBlock language="vue" class="text-xs">{{
                          snippetPictureBasic
                        }}</TypographyCodeBlock>
                      </div>

                      <div class="space-y-3">
                        <h4 class="text-sm font-medium uppercase tracking-wide text-muted">
                          Responsive Sizes
                        </h4>
                        <div
                          class="aspect-video bg-accented rounded-lg overflow-hidden flex items-center justify-center"
                        >
                          <div class="text-center text-muted">
                            <UIcon name="i-lucide-monitor-smartphone" class="text-4xl mb-2" />
                            <p class="text-sm">Responsive image</p>
                          </div>
                        </div>
                        <TypographyCodeBlock language="vue" class="text-xs">{{
                          snippetPictureResponsive
                        }}</TypographyCodeBlock>
                      </div>
                    </div>
                  </div>
                </UCard>
              </section>

              <!-- Breakpoints Section -->
              <section class="space-y-8">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Breakpoint System</h2>
                  <p class="text-muted">Multiple breakpoint paradigms for responsive design</p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-ruler" class="text-primary" />
                      <h3 class="text-xl font-semibold">Breakpoint Types</h3>
                    </div>
                  </template>

                  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Tailwind
                      </h4>
                      <div class="space-y-1.5 text-sm">
                        <div class="flex justify-between">
                          <span class="font-mono">sm</span><span class="text-muted">640px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">md</span><span class="text-muted">768px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">lg</span><span class="text-muted">1024px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">xl</span><span class="text-muted">1280px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">2xl</span
                          ><span class="text-muted">1536px</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Device
                      </h4>
                      <div class="space-y-1.5 text-sm">
                        <div class="flex justify-between">
                          <span class="font-mono">mobile</span
                          ><span class="text-muted">0px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">tablet</span
                          ><span class="text-muted">640px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">desktop</span>
                          <span class="text-muted">1024px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">wide</span
                          ><span class="text-muted">1920px</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Phone
                      </h4>
                      <div class="space-y-1.5 text-sm">
                        <div class="flex justify-between">
                          <span class="font-mono">phone-sm</span>
                          <span class="text-muted">320px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">phone-md</span>
                          <span class="text-muted">375px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">phone-lg</span>
                          <span class="text-muted">428px</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Tablet
                      </h4>
                      <div class="space-y-1.5 text-sm">
                        <div class="flex justify-between">
                          <span class="font-mono">tablet-sm</span>
                          <span class="text-muted">768px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">tablet-md</span>
                          <span class="text-muted">834px</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">tablet-lg</span>
                          <span class="text-muted">1024px</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Orientation
                      </h4>
                      <div class="space-y-1.5 text-sm">
                        <div class="flex justify-between">
                          <span class="font-mono">portrait</span>
                          <span class="text-muted">vertical</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="font-mono">landscape</span>
                          <span class="text-muted">horizontal</span>
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
                  <p class="text-muted">Circular ring and linear bar progress indicators</p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-loader-circle" class="text-primary" />
                      <h3 class="text-xl font-semibold">ProgressCircular</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      SVG ring with gradient stroke — pass any 0–1 value
                    </p>
                  </template>

                  <div class="space-y-8">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-4">
                        Static values
                      </h4>
                      <div class="flex flex-wrap gap-8 items-center">
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="0.25" />
                          <span class="text-xs text-muted">:progress="0.25"</span>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="0.5" />
                          <span class="text-xs text-muted">:progress="0.5"</span>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="0.75" />
                          <span class="text-xs text-muted">:progress="0.75"</span>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="1" />
                          <span class="text-xs text-muted">:progress="1"</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-4">
                        Sizes
                      </h4>
                      <div class="flex flex-wrap gap-8 items-end">
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="0.6" :size="64" :stroke-width="5" />
                          <span class="text-xs text-muted">:size="64"</span>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="0.6" />
                          <span class="text-xs text-muted">:size="120" (default)</span>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                          <ProgressCircular :progress="0.6" :size="180" :stroke-width="12" />
                          <span class="text-xs text-muted">:size="180"</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-4">
                        Without label
                      </h4>
                      <ProgressCircular :progress="0.7" :show-percentage="false" />
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-4">
                        Interactive
                      </h4>
                      <div class="flex flex-col items-start gap-4">
                        <ProgressCircular :progress="circularProgress" />
                        <USlider v-model="circularSlider" :min="0" :max="100" class="w-64" />
                        <span class="text-xs text-muted">{{ circularSlider }}%</span>
                      </div>
                    </div>
                  </div>

                  <template #footer>
                    <TypographyCodeBlock language="vue" class="text-sm">{{
                      snippetProgressCircular
                    }}</TypographyCodeBlock>
                  </template>
                </UCard>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-minus" class="text-primary" />
                      <h3 class="text-xl font-semibold">ProgressBar</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Wraps Nuxt UI's UProgress — pass a 0–1 value, null for indeterminate
                    </p>
                  </template>

                  <div class="space-y-6">
                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Static values
                      </h4>
                      <div class="space-y-4">
                        <div class="space-y-1">
                          <span class="text-xs text-muted">:progress="0.3"</span>
                          <ProgressBar :progress="0.3" />
                        </div>
                        <div class="space-y-1">
                          <span class="text-xs text-muted">:progress="0.6"</span>
                          <ProgressBar :progress="0.6" />
                        </div>
                        <div class="space-y-1">
                          <span class="text-xs text-muted">:progress="1"</span>
                          <ProgressBar :progress="1" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
                        Colors
                      </h4>
                      <div class="space-y-3">
                        <ProgressBar :progress="0.6" color="primary" />
                        <ProgressBar :progress="0.6" color="success" />
                        <ProgressBar :progress="0.6" color="warning" />
                        <ProgressBar :progress="0.6" color="error" />
                      </div>
                    </div>

                    <div>
                      <h4 class="text-sm font-medium uppercase tracking-wide text-muted mb-3">
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
                  <p class="text-muted">
                    CSS-var driven gradients, tints, and decorative blob scenes
                  </p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-layers" class="text-primary" />
                      <h3 class="text-xl font-semibold">GradientBackground</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Wraps any tag with a CSS-var gradient that reacts to the active accent
                    </p>
                  </template>

                  <div class="grid gap-4 md:grid-cols-3">
                    <GradientBackground
                      v-for="preset in ['brand', 'subtle', 'hero']"
                      :key="preset"
                      :preset
                      class="min-h-30 rounded-xl flex items-center justify-center p-4"
                    >
                      <span class="font-semibold text-highlighted mix-blend-overlay capitalize">{{
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

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-type" class="text-primary" />
                      <h3 class="text-xl font-semibold">GradientText</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
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

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-blend" class="text-primary" />
                      <h3 class="text-xl font-semibold">TintOverlay</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Semi-transparent color layer — opacity set as inline style for non-JIT-safe
                      values
                    </p>
                  </template>

                  <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <TintOverlay
                      v-for="level in [
                        'subtle',
                        'light',
                        'medium',
                        'strong',
                        'heavy',
                      ] as TintLevel[]"
                      :key="level"
                      color="primary"
                      :level
                      class="min-h-20 rounded-xl border border-default flex items-end p-3"
                    >
                      <span class="text-xs font-mono text-highlighted relative z-10">{{
                        level
                      }}</span>
                    </TintOverlay>
                  </div>

                  <template #footer>
                    <TypographyCodeBlock language="vue" class="text-sm">{{
                      snippetTintOverlay
                    }}</TypographyCodeBlock>
                  </template>
                </UCard>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-sparkles" class="text-primary" />
                      <h3 class="text-xl font-semibold">AccentScene</h3>
                    </div>
                    <p class="text-sm text-muted mt-1">
                      Composable blurred orbs clipped to their container — all accent-reactive
                    </p>
                  </template>

                  <div class="grid gap-4 md:grid-cols-2">
                    <AccentScene
                      v-for="preset in ['hero', 'corner', 'scattered', 'minimal']"
                      :key="preset"
                      :preset
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

              <div class="flex gap-4 justify-center pt-4">
                <UButton to="/core" variant="outline" icon="i-lucide-arrow-left">
                  Core Layer Demo
                </UButton>
                <UButton to="/" icon="i-lucide-home"> Back to Home </UButton>
              </div>
      </UContainer>
      <DemoPageFooter
        name="Typography Layer"
        description="Typography components and composables"
        :links="[
          { label: 'UI Layer', to: '/ui', icon: 'i-lucide-palette' },
          { label: 'Visual', to: '/visual', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
