<script setup lang="ts">
  // fallow-ignore-next-line code-duplication
  import type { UiColors } from '#layers/typography/app/types/colors'
  import type { TypeStep } from '#layers/typography/app/types/typography'
  import type { TintLevel } from '#layers/visual/app/types/tint'

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

  // 9-12 dropped from the demo — too large to read at typical page/demo
  // widths; the utilities still exist in typography.css for full-bleed hero use.
  const typeSteps: TypeStep[] = ['sm', 0, 1, 2, 3, 4, 5, 6, 7, 8, 'display']

  const snippetTypeStep = `<!-- via useTypography / Typography component -->
<Typography :step="1">Body copy, step 1</Typography>
<Typography as="h2" :step="3">Three steps up from 0 — twice its size</Typography>

<!-- or the utility class directly -->
<p class="text-step-1">Body copy, step 1</p>

<!-- retune the ratio for a subtree -->
<div style="--type-scale: 1.2">
  <p class="text-step-4">Gentler scale here only</p>
</div>`

  const snippetHeadline = '<TypographyHeadline :level="2">Headline Level 2</TypographyHeadline>'

  const snippetTextStroke = `<h1 class="text-8xl font-bold">
  <TypographyTextStroke text="Hello" :stroke-width="2" stroke-color="red" />
</h1>`

  const snippetHoverDimGroup = `<HoverDimGroup class="flex gap-6">
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</HoverDimGroup>`

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

  const snippetGradientBackground = `<Gradient preset="brand" class="p-8 rounded-xl">
  Slot content
</Gradient>`

  const snippetGradientText =
    '<Gradient target="text" preset="brand" class="text-5xl font-black">Hello</Gradient>'

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
            <h2 class="mb-2 text-2xl font-bold">Typography Components</h2>
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
              <p class="text-muted mt-1 text-sm">Semantic h1-h6 headings with responsive sizing</p>
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
              <p class="text-muted mt-1 text-sm">
                Base typography component with font axis controls
              </p>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Font Weight
                </h4>
                <div class="space-y-2">
                  <Typography v-for="weight in fontWeights" :key="weight" :weight class="text-lg">
                    {{ weight.replace('font-', '') }} - The quick brown fox jumps over the lazy dog
                  </Typography>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Line Height (Leading)
                </h4>
                <div class="grid gap-4 md:grid-cols-3">
                  <div class="bg-accented rounded p-3">
                    <Typography leading="leading-tight" class="text-sm">
                      <strong>Tight</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                  <div class="bg-accented rounded p-3">
                    <Typography leading="leading-normal" class="text-sm">
                      <strong>Normal</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                  <div class="bg-accented rounded p-3">
                    <Typography leading="leading-loose" class="text-sm">
                      <strong>Loose</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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
              <p class="text-muted mt-1 text-sm">Semantic pre/code wrapper for code snippets</p>
            </template>

            <TypographyCodeBlock
              language="typescript"
              class="bg-muted text-highlighted rounded-lg p-4"
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
              <Typography as="span" class="text-muted mt-2 block text-sm not-italic">
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
              <p class="text-muted mt-1 text-sm">
                SVG-based text stroke for crisp outlines at any size
              </p>
            </template>

            <div class="space-y-8">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Outline Only
                </h4>
                <div class="text-7xl font-bold">
                  <TypographyTextStroke text="Outline" :stroke-width="2" />
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">Colors</h4>
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
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Inside Headline
                </h4>
                <TypographyHeadline :level="1">
                  <TypographyTextStroke text="Headline Stroke" as="span" :stroke-width="2" />
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

        <!-- Modular Type Scale Section -->
        <section class="space-y-8">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Modular Type Scale</h2>
            <p class="text-muted">
              Every size is <code>base × 1.26^step</code>, rounded via CSS <code>round()</code>. The
              base switches from <code>1rem</code> to <code>1.2rem</code> at 48rem;
              <code>display</code> grows from step 5 to 7 with the viewport
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-move-vertical" class="text-primary" />
                <h3 class="text-xl font-semibold">text-step-*</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Via <code>useTypography</code>'s <code>step</code> prop — parallel namespace to
                Tailwind's <code>--text-*</code>, no default token or Nuxt UI component size is
                affected
              </p>
            </template>

            <div class="space-y-4">
              <div v-for="step in typeSteps" :key="step" class="flex items-baseline gap-4">
                <span class="text-muted w-28 shrink-0 font-mono text-xs tracking-wide uppercase">{{
                  step
                }}</span>
                <Typography :step weight="font-semibold">Modular type</Typography>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">{{
                snippetTypeStep
              }}</TypographyCodeBlock>
            </template>
          </UCard>
        </section>

        <!-- Color System Section -->
        <section class="space-y-8">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Color System</h2>
            <p class="text-muted">Semantic, status, brand, and base color tokens</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-palette" class="text-primary" />
                <h3 class="text-xl font-semibold">useColor()</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Color tokens with text, bg, and border usage types
              </p>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Semantic Colors
                </h4>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="color in semanticColors"
                    :key="color"
                    class="rounded-lg border px-4 py-2"
                  >
                    <Typography :color weight="font-medium">{{ color }}</Typography>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Status Colors
                </h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge v-for="color in statusColors" :key="color" :color size="lg">
                    {{ color }}
                  </UBadge>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Brand Colors
                </h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge v-for="color in brandColors" :key="color" :color size="lg">
                    {{ color }}
                  </UBadge>
                  <div
                    v-for="color in customColors"
                    :key="color"
                    class="rounded-full px-3 py-1.5 text-sm font-medium"
                  >
                    <Typography :color weight="font-medium">{{ color }}</Typography>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Base Colors
                </h4>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="color in baseColors"
                    :key="color"
                    class="rounded-lg border px-4 py-2"
                    :class="color === 'black' ? 'text-highlighted bg-black' : 'bg-white text-black'"
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
            <h2 class="mb-2 text-2xl font-bold">Link Group</h2>
            <p class="text-muted">
              Hover one item to dim the rest — works with any direct children
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-mouse-pointer-click" class="text-primary" />
                <h3 class="text-xl font-semibold">HoverDimGroup</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Wraps children in a hover-to-focus group with configurable dim opacity and
                transition duration
              </p>
            </template>

            <div class="space-y-8">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Navigation Links
                </h4>
                <HoverDimGroup class="flex gap-6">
                  <a href="#" class="text-highlighted text-lg font-medium">Home</a>
                  <a href="#" class="text-highlighted text-lg font-medium">About</a>
                  <a href="#" class="text-highlighted text-lg font-medium">Work</a>
                  <a href="#" class="text-highlighted text-lg font-medium">Blog</a>
                  <a href="#" class="text-highlighted text-lg font-medium">Contact</a>
                </HoverDimGroup>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">Buttons</h4>
                <HoverDimGroup class="flex gap-3">
                  <UButton variant="solid">Primary</UButton>
                  <UButton variant="outline">Outline</UButton>
                  <UButton variant="soft">Soft</UButton>
                  <UButton variant="ghost">Ghost</UButton>
                </HoverDimGroup>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Card Grid
                </h4>
                <HoverDimGroup class="grid grid-cols-3 gap-4" :duration="300">
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
                </HoverDimGroup>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Custom Dim (0.1)
                </h4>
                <HoverDimGroup class="flex gap-4" :dim-opacity="0.1">
                  <span class="text-3xl">&#x1F680;</span>
                  <span class="text-3xl">&#x1F4A1;</span>
                  <span class="text-3xl">&#x2B50;</span>
                  <span class="text-3xl">&#x1F525;</span>
                  <span class="text-3xl">&#x1F308;</span>
                </HoverDimGroup>
              </div>
            </div>

            <template #footer>
              <TypographyCodeBlock language="vue" class="text-sm">{{
                snippetHoverDimGroup
              }}</TypographyCodeBlock>
            </template>
          </UCard>
        </section>

        <!-- Media Section -->
        <section class="space-y-8">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Media Components</h2>
            <p class="text-muted">Responsive images with smart sizing and format optimization</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-image" class="text-primary" />
                <h3 class="text-xl font-semibold">Picture</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                NuxtPicture wrapper with responsive sizing and format detection
              </p>
            </template>

            <div class="space-y-6">
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-3">
                  <h4 class="text-muted text-sm font-medium tracking-wide uppercase">
                    Basic Usage
                  </h4>
                  <div
                    class="bg-accented flex aspect-video items-center justify-center overflow-hidden rounded-lg"
                  >
                    <div class="text-muted text-center">
                      <UIcon name="i-lucide-image" class="mb-2 text-4xl" />
                      <p class="text-sm">Image placeholder</p>
                    </div>
                  </div>
                  <TypographyCodeBlock language="vue" class="text-xs">{{
                    snippetPictureBasic
                  }}</TypographyCodeBlock>
                </div>

                <div class="space-y-3">
                  <h4 class="text-muted text-sm font-medium tracking-wide uppercase">
                    Responsive Sizes
                  </h4>
                  <div
                    class="bg-accented flex aspect-video items-center justify-center overflow-hidden rounded-lg"
                  >
                    <div class="text-muted text-center">
                      <UIcon name="i-lucide-monitor-smartphone" class="mb-2 text-4xl" />
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
            <h2 class="mb-2 text-2xl font-bold">Breakpoint System</h2>
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
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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
                    <span class="font-mono">2xl</span><span class="text-muted">1536px</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">Device</h4>
                <div class="space-y-1.5 text-sm">
                  <div class="flex justify-between">
                    <span class="font-mono">mobile</span><span class="text-muted">0px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">tablet</span><span class="text-muted">640px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">desktop</span>
                    <span class="text-muted">1024px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">wide</span><span class="text-muted">1920px</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">Phone</h4>
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
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">Tablet</h4>
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
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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
            <h2 class="mb-2 text-2xl font-bold">Progress Components</h2>
            <p class="text-muted">Circular ring and linear bar progress indicators</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-loader-circle" class="text-primary" />
                <h3 class="text-xl font-semibold">ProgressCircular</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                SVG ring with gradient stroke — pass any 0–1 value
              </p>
            </template>

            <div class="space-y-8">
              <div>
                <h4 class="text-muted mb-4 text-sm font-medium tracking-wide uppercase">
                  Static values
                </h4>
                <div class="flex flex-wrap items-center gap-8">
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="0.25" />
                    <span class="text-muted text-xs">:progress="0.25"</span>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="0.5" />
                    <span class="text-muted text-xs">:progress="0.5"</span>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="0.75" />
                    <span class="text-muted text-xs">:progress="0.75"</span>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="1" />
                    <span class="text-muted text-xs">:progress="1"</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-4 text-sm font-medium tracking-wide uppercase">Sizes</h4>
                <div class="flex flex-wrap items-end gap-8">
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="0.6" :size="64" :stroke-width="5" />
                    <span class="text-muted text-xs">:size="64"</span>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="0.6" />
                    <span class="text-muted text-xs">:size="120" (default)</span>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <ProgressCircular :progress="0.6" :size="180" :stroke-width="12" />
                    <span class="text-muted text-xs">:size="180"</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-4 text-sm font-medium tracking-wide uppercase">
                  Without label
                </h4>
                <ProgressCircular :progress="0.7" :show-percentage="false" />
              </div>

              <div>
                <h4 class="text-muted mb-4 text-sm font-medium tracking-wide uppercase">
                  Interactive
                </h4>
                <div class="flex flex-col items-start gap-4">
                  <ProgressCircular :progress="circularProgress" />
                  <USlider v-model="circularSlider" :min="0" :max="100" class="w-64" />
                  <span class="text-muted text-xs">{{ circularSlider }}%</span>
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
              <p class="text-muted mt-1 text-sm">
                Wraps Nuxt UI's UProgress — pass a 0–1 value, null for indeterminate
              </p>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
                  Static values
                </h4>
                <div class="space-y-4">
                  <div class="space-y-1">
                    <span class="text-muted text-xs">:progress="0.3"</span>
                    <ProgressBar :progress="0.3" />
                  </div>
                  <div class="space-y-1">
                    <span class="text-muted text-xs">:progress="0.6"</span>
                    <ProgressBar :progress="0.6" />
                  </div>
                  <div class="space-y-1">
                    <span class="text-muted text-xs">:progress="1"</span>
                    <ProgressBar :progress="1" />
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">Colors</h4>
                <div class="space-y-3">
                  <ProgressBar :progress="0.6" color="primary" />
                  <ProgressBar :progress="0.6" color="success" />
                  <ProgressBar :progress="0.6" color="warning" />
                  <ProgressBar :progress="0.6" color="error" />
                </div>
              </div>

              <div>
                <h4 class="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
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
            <h2 class="mb-2 text-2xl font-bold">Gradients & Accents</h2>
            <p class="text-muted">CSS-var driven gradients, tints, and decorative blob scenes</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-layers" class="text-primary" />
                <h3 class="text-xl font-semibold">Gradient</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Wraps any tag with a CSS-var gradient that reacts to the active accent
              </p>
            </template>

            <div class="grid gap-4 md:grid-cols-3">
              <Gradient
                v-for="preset in ['brand', 'subtle', 'hero']"
                :key="preset"
                :preset
                class="flex min-h-30 items-center justify-center rounded-xl p-4"
              >
                <span class="text-highlighted font-semibold capitalize mix-blend-overlay">{{
                  preset
                }}</span>
              </Gradient>
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
                <h3 class="text-xl font-semibold">Gradient target="text"</h3>
              </div>
              <p class="text-muted mt-1 text-sm">
                Gradient-clipped text that reacts live to accent changes
              </p>
            </template>

            <div class="space-y-4">
              <div class="text-5xl font-black">
                <Gradient target="text" preset="brand">Nuxt Layers</Gradient>
              </div>
              <div class="text-3xl font-bold">
                <Gradient target="text" preset="hero">Design system</Gradient>
              </div>
              <div class="text-3xl font-bold">
                <Gradient target="text" preset="subtle">Subtle fade</Gradient>
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
              <p class="text-muted mt-1 text-sm">
                Semi-transparent color layer — opacity set as inline style for non-JIT-safe values
              </p>
            </template>

            <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <TintOverlay
                v-for="level in ['subtle', 'light', 'medium', 'strong', 'heavy'] as TintLevel[]"
                :key="level"
                color="primary"
                :level
                class="border-default flex min-h-20 items-end rounded-xl border p-3"
              >
                <span class="text-highlighted relative z-10 font-mono text-xs">{{ level }}</span>
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
              <p class="text-muted mt-1 text-sm">
                Composable blurred orbs clipped to their container — all accent-reactive
              </p>
            </template>

            <div class="grid gap-4 md:grid-cols-2">
              <AccentScene
                v-for="preset in ['hero', 'corner', 'scattered', 'minimal']"
                :key="preset"
                :preset
                class="border-default bg-elevated/30 h-48 rounded-xl border"
              >
                <div class="flex h-full items-center justify-center">
                  <span class="text-highlighted font-semibold capitalize">{{ preset }}</span>
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

        <div class="flex justify-center gap-4 pt-4">
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
          { label: 'Theming', to: '/theming', icon: 'i-lucide-palette' },
          { label: 'Visual', to: '/visual', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
