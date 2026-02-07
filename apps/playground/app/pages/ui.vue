<script setup lang="ts">
import type { UiColors } from '#layers/ui/app/types/colors'

useSeoMeta({
  title: 'UI Layer Demo',
  description: 'Demonstrating the UI layer typography, colors, and media components',
})

const { setPageAccent } = useThemePreferences()
setPageAccent('pink')
onUnmounted(() => setPageAccent(null))

// Color tokens for demo
const semanticColors: UiColors[] = ['dimmed', 'muted', 'toned', 'default', 'highlighted', 'inverted']
// Status colors that UBadge supports
const statusColors = ['info', 'success', 'warning', 'error'] as const
// Brand colors that UBadge supports
const brandColors = ['primary', 'secondary', 'neutral'] as const
// Additional custom colors (shown as styled divs)
const customColors: UiColors[] = ['accent']
const baseColors: UiColors[] = ['black', 'white']

// Typography weight demos
const fontWeights = ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-black'] as const

// Sample code for CodeBlock demo
const sampleCode = `function useScreen() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('md')
  const isDesktop = breakpoints.greaterOrEqual('lg')
  return { isMobile, isDesktop }
}`
</script>

<template>
  <div class="min-h-screen bg-default text-default p-8">
    <UContainer>
      <div class="space-y-12">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">UI Layer</h1>
            <p class="text-muted">Typography, colors, and media components</p>
          </div>
        </div>

        <!-- Typography Section -->
        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Typography Components</h2>
            <p class="text-gray-500">Semantic typography with configurable weight, width, slant, and more</p>
          </div>

          <!-- Headlines -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-heading" class="text-primary" />
                <h3 class="text-xl font-semibold">Headline</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">Semantic h1-h6 headings with responsive sizing</p>
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

          <!-- Typography Base -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-type" class="text-primary" />
                <h3 class="text-xl font-semibold">Typography</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">Base typography component with font axis controls</p>
            </template>

            <div class="space-y-6">
              <!-- Weight -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Font Weight</h4>
                <div class="space-y-2">
                  <Typography
                    v-for="weight in fontWeights"
                    :key="weight"
                    :weight="weight"
                    class="text-lg"
                  >
                    {{ weight.replace('font-', '') }} - The quick brown fox jumps over the lazy dog
                  </Typography>
                </div>
              </div>

              <!-- Slant -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Font Slant</h4>
                <div class="space-y-2">
                  <Typography slant="normal" class="text-lg">Normal - The quick brown fox</Typography>
                  <Typography slant="italic" class="text-lg">Italic - The quick brown fox</Typography>
                </div>
              </div>

              <!-- Leading -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Line Height (Leading)</h4>
                <div class="grid gap-4 md:grid-cols-3">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <Typography leading="leading-tight" class="text-sm">
                      <strong>Tight</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <Typography leading="leading-normal" class="text-sm">
                      <strong>Normal</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <Typography leading="leading-loose" class="text-sm">
                      <strong>Loose</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                    </Typography>
                  </div>
                </div>
              </div>

              <!-- Transform -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Text Transform</h4>
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
              <p class="text-sm text-gray-500 mt-1">Semantic pre/code wrapper for code snippets</p>
            </template>

            <TypographyCodeBlock language="typescript" class="bg-gray-900 text-gray-100 p-4 rounded-lg">
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
              <p class="text-sm text-gray-500 mt-1">Color tokens with text, bg, and border usage types</p>
            </template>

            <div class="space-y-6">
              <!-- Semantic Colors -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Semantic Colors</h4>
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
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Status Colors</h4>
                <div class="flex flex-wrap gap-3">
                  <UBadge v-for="color in statusColors" :key="color" :color="color" size="lg">
                    {{ color }}
                  </UBadge>
                </div>
              </div>

              <!-- Brand Colors -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Brand Colors</h4>
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
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Base Colors</h4>
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

        <!-- Media Section -->
        <section class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold mb-2">Media Components</h2>
            <p class="text-gray-500">Responsive images with smart sizing and format optimization</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-image" class="text-primary" />
                <h3 class="text-xl font-semibold">Picture</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">NuxtPicture wrapper with responsive sizing and format detection</p>
            </template>

            <div class="space-y-6">
              <div class="grid gap-6 md:grid-cols-2">
                <!-- Basic Usage -->
                <div class="space-y-3">
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500">Basic Usage</h4>
                  <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <div class="text-center text-gray-400">
                      <UIcon name="i-lucide-image" class="text-4xl mb-2" />
                      <p class="text-sm">Image placeholder</p>
                    </div>
                  </div>
                  <TypographyCodeBlock language="vue" class="text-xs">
                    {{ '<MediaPicture src="/image.jpg" alt="Description" />' }}
                  </TypographyCodeBlock>
                </div>

                <!-- Responsive Sizes -->
                <div class="space-y-3">
                  <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500">Responsive Sizes</h4>
                  <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <div class="text-center text-gray-400">
                      <UIcon name="i-lucide-monitor-smartphone" class="text-4xl mb-2" />
                      <p class="text-sm">Responsive image</p>
                    </div>
                  </div>
                  <TypographyCodeBlock language="vue" class="text-xs">
                    {{ `<MediaPicture
  src="/image.jpg"
  :sizes="{ default: '100vw', sm: '50vw', lg: '33vw' }"
/>` }}
                  </TypographyCodeBlock>
                </div>
              </div>

              <!-- Props Table -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Available Props</h4>
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
                        <td class="py-2 px-3">Responsive sizes (string or ResponsiveSizes object)</td>
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
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Tailwind</h4>
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
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Device</h4>
                <div class="space-y-1.5 text-sm">
                  <div class="flex justify-between">
                    <span class="font-mono">mobile</span><span class="text-gray-500">0px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">tablet</span><span class="text-gray-500">640px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">desktop</span><span class="text-gray-500">1024px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">wide</span><span class="text-gray-500">1920px</span>
                  </div>
                </div>
              </div>

              <!-- Phone -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Phone</h4>
                <div class="space-y-1.5 text-sm">
                  <div class="flex justify-between">
                    <span class="font-mono">phone-sm</span><span class="text-gray-500">320px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">phone-md</span><span class="text-gray-500">375px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">phone-lg</span><span class="text-gray-500">428px</span>
                  </div>
                </div>
              </div>

              <!-- Tablet -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Tablet</h4>
                <div class="space-y-1.5 text-sm">
                  <div class="flex justify-between">
                    <span class="font-mono">tablet-sm</span><span class="text-gray-500">768px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">tablet-md</span><span class="text-gray-500">834px</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">tablet-lg</span><span class="text-gray-500">1024px</span>
                  </div>
                </div>
              </div>

              <!-- Orientation -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">Orientation</h4>
                <div class="space-y-1.5 text-sm">
                  <div class="flex justify-between">
                    <span class="font-mono">portrait</span><span class="text-gray-500">vertical</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-mono">landscape</span><span class="text-gray-500">horizontal</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- Navigation -->
        <div class="flex gap-4 justify-center pt-4">
          <UButton to="/core" variant="outline" icon="i-lucide-arrow-left">
            Core Layer Demo
          </UButton>
          <UButton to="/" icon="i-lucide-home">
            Back to Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
