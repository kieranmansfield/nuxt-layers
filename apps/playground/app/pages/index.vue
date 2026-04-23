<script setup lang="ts">
const layers = [
  {
    name: 'Core',
    description: 'Foundation utilities, error handling, device detection, PWA support',
    loaded: true,
    icon: 'i-lucide-box',
    to: '/core',
    features: [
      'Browser Detection',
      'Screen Info',
      'Network Status',
      'Feature Detection',
      'Loading States',
      'PWA Support',
    ],
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    buttonClass: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  },
  {
    name: 'UI',
    description: 'Typography, colors, responsive media components',
    loaded: true,
    icon: 'i-lucide-palette',
    to: '/ui',
    features: [
      'Typography System',
      'Color Tokens',
      'Responsive Images',
      'Headline Components',
      'Code Blocks',
      'Progress Components',
      'Gradient System',
      'Tint Overlays',
      'Accent Blobs',
    ],
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/5',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    buttonClass: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
  },
  {
    name: 'Layout',
    description: 'Swiss Grid system, sections, and page components',
    loaded: true,
    icon: 'i-lucide-layout',
    to: '/layout',
    features: [
      '18-Column Grid',
      'Hero Section',
      'Split Section',
      'Gallery Section',
      'Page Container',
      'Grid Debug',
    ],
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    buttonClass: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
  },
  {
    name: 'Motion',
    description: 'Animations, smooth scrolling, and transition effects',
    loaded: true,
    icon: 'i-lucide-sparkles',
    to: '/motion',
    features: [
      'GSAP',
      'ScrollTrigger',
      'Locomotive Scroll v5',
      'VueUse Motion',
      'Transition Components',
      'Staggered Animations',
      'Scrollytelling',
    ],
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    buttonClass: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  },
  {
    name: 'Scrollytelling',
    description: 'Scroll-driven narratives: scenes, steps, pinned sections, horizontal tracks',
    loaded: true,
    icon: 'i-lucide-book-open-text',
    to: '/scrollytelling',
    features: [
      'ScrollScene',
      'ScrollStep',
      'PinnedSection',
      'HorizontalScroll',
      'useSectionProgress',
      'useScrollSteps',
    ],
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    buttonClass: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  },
  {
    name: 'Shader',
    description: 'WebGL/WebGPU shaders with TSL and TresJS',
    loaded: true,
    icon: 'i-lucide-shapes',
    to: '/shader',
    features: [
      'TSL Shaders',
      'Noise Functions',
      'Gradient Materials',
      'Fresnel Effects',
      'Post-Processing',
      'WebGPU Support',
    ],
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/5',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    buttonClass: 'bg-violet-500/10 text-violet-500 hover:bg-violet-500/20',
  },
  {
    name: 'Shader Gradient',
    description: 'Animated 4-point gradient mesh driven by live theme colours',
    loaded: true,
    icon: 'i-lucide-wand-sparkles',
    to: '/shader-gradient',
    features: [
      'Theme-Driven Colors',
      'Smooth Crossfade',
      'Mouse Interaction',
      'Speed Control',
      'Intensity Control',
    ],
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/5',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    buttonClass: 'bg-violet-500/10 text-violet-500 hover:bg-violet-500/20',
  },
  {
    name: 'Shader Pipeline',
    description: '142 composable TSL blocks — generators, UV transforms, colour ops, film overlays, ray pipeline',
    loaded: true,
    icon: 'i-lucide-layers-3',
    to: '/shader-pipeline',
    features: [
      'Generators',
      'UV Transforms',
      'Colour Ops',
      'Film / Analogue',
      'Overlays',
      'Compositions',
    ],
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/5',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    buttonClass: 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20',
  },
  {
    name: 'Forms',
    description: 'Config-driven form fields with Zod validation',
    loaded: true,
    icon: 'i-lucide-file-input',
    to: '/forms',
    features: [
      'Dynamic Fields',
      'Zod Validation',
      'Type Inference',
      'Auto Icons',
      'Input Modes',
      'Contact Form',
    ],
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/5',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    buttonClass: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
  },
  {
    name: 'Theme',
    description: 'Config-driven theme system with Tailwind CSS',
    loaded: true,
    icon: 'i-lucide-swatch-book',
    to: '/theme',
    features: ['Dark Mode', 'Accent Colors', 'Color Themes'],
    borderColor: 'border-neutral-300/30',
    bgColor: 'bg-neutral-300/5',
    iconBg: 'bg-neutral-300/10',
    iconColor: 'text-neutral-300',
    buttonClass: 'bg-neutral-300/10 text-neutral-300 hover:bg-neutral-300/20',
  },
  {
    name: 'Content',
    description: 'Config-driven content management system using Nuxt Content',
    loaded: true,
    icon: 'i-lucide-swatch-book',
    to: '/content',
    features: ['Markdown', 'Content Collections', 'Frontmatter', 'Content API'],
    borderColor: 'border-red-300/30',
    bgColor: 'bg-red-300/5',
    iconBg: 'bg-red-300/10',
    iconColor: 'text-red-300',
    buttonClass: 'bg-red-300/10 text-red-300 hover:bg-red-300/20',
  },
  {
    name: 'Nav',
    description: 'Hamburger button + full-screen overlay modal driven by app.config.ts',
    loaded: true,
    icon: 'i-lucide-menu',
    to: '/nav',
    features: [
      'useMastNav',
      'createSharedComposable',
      'app.config Links',
      'Smooth Scroll Mode',
      'Router Mode',
      'Active Section',
    ],
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/5',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    buttonClass: 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20',
  },
  {
    name: 'Overlays',
    description: 'Toasts, modals, and the createModal factory for quick overlay creation',
    loaded: true,
    icon: 'i-lucide-layers',
    to: '/overlays',
    features: [
      'useAppToast',
      'createModal',
      'BaseModal',
      'UOverlayProvider',
      'UNotifications',
      'Scoped Props',
    ],
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/5',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
    buttonClass: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
  },
  {
    name: 'Routing',
    description: 'Feature flags, governance presets, maintenance mode, and route access control',
    loaded: true,
    icon: 'i-lucide-route',
    to: '/routing',
    features: [
      'Governance Presets',
      'Feature Flags',
      'Maintenance Mode',
      'Scroll Routing',
      'Route Meta Augmentation',
      'Runtime Flags',
    ],
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/5',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    buttonClass: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  },
]

definePageMeta({ layout: { name: 'grid', props: { showHeader: false, showFooter: false } } })
</script>

<!--    -->

<template>
  <LayoutPage
    title="Nuxt Layers Playground"
    description="Explore the features of each layer in this monorepo architecture demo"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-8 pb-8">
          <LayoutPageHeader
            title="Nuxt Layers Playground"
            description="Explore the features of each layer in this monorepo architecture demo"
          />
          <!-- Layer Cards -->
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="layer in layers"
              :key="layer.name"
              class="rounded-xl border-2 p-5"
              :class="[layer.borderColor, layer.bgColor]"
            >
              <div class="flex flex-col h-full">
                <!-- Header -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center"
                      :class="[layer.iconBg]"
                    >
                      <UIcon :name="layer.icon" class="text-xl" :class="[layer.iconColor]" />
                    </div>
                    <div>
                      <h2 class="font-semibold text-lg text-highlighted">
                        {{ layer.name }}
                      </h2>
                      <UBadge
                        :color="layer.loaded ? 'success' : 'neutral'"
                        variant="subtle"
                        size="xs"
                      >
                        {{ layer.loaded ? 'Loaded' : 'Not configured' }}
                      </UBadge>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-sm text-muted mb-4">
                  {{ layer.description }}
                </p>

                <!-- Features -->
                <div class="flex flex-wrap gap-1.5 mb-4 grow">
                  <UBadge
                    v-for="feature in layer.features"
                    :key="feature"
                    variant="subtle"
                    color="neutral"
                    size="xs"
                  >
                    {{ feature }}
                  </UBadge>
                </div>

                <!-- Action - always at bottom -->
                <div class="mt-auto pt-4">
                  <NuxtLink
                    v-if="layer.to"
                    :to="layer.to"
                    class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-colors"
                    :class="[layer.buttonClass]"
                  >
                    Explore {{ layer.name }}
                    <UIcon name="i-lucide-arrow-right" class="text-sm" />
                  </NuxtLink>
                  <UButton v-else variant="soft" color="neutral" block disabled>
                    Coming Soon
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="flex flex-wrap gap-4 justify-center pt-4">
            <UButton to="/diagnostics" variant="outline" icon="i-lucide-activity">
              System Diagnostics
            </UButton>
            <UButton
              href="https://github.com/your-org/nuxt-layers"
              target="_blank"
              variant="outline"
              icon="i-lucide-github"
            >
              View Source
            </UButton>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
