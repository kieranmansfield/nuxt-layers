<script setup lang="ts">
const layers = [
  {
    name: 'Core',
    description: 'Foundation utilities, error handling, device detection, and PWA support',
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
    description: 'Typography, gradients, navigation, modals, and visual identity components',
    loaded: true,
    icon: 'i-lucide-palette',
    to: '/ui',
    features: [
      'Typography System',
      'Color Tokens',
      'Gradient System',
      'Tint Overlays',
      'Accent Blobs',
      'Navigation',
      'Modals & Toasts',
      'Responsive Images',
    ],
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/5',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    buttonClass: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
  },
  {
    name: 'Layout',
    description: 'Swiss Grid system, sections, and full-page composition components',
    loaded: true,
    icon: 'i-lucide-layout',
    to: '/layout',
    features: [
      '18-Column Grid',
      'Hero Section',
      'Split Section',
      'Gallery Section',
      'Page Container',
      'Blind Reveal',
      'Stacking Layouts',
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
    description: 'GSAP, Locomotive Scroll, scrollytelling, and micro-interaction primitives',
    loaded: true,
    icon: 'i-lucide-sparkles',
    to: '/motion',
    features: [
      'GSAP + ScrollTrigger',
      'Locomotive Scroll v5',
      'Scrollytelling',
      'Micro-interactions',
      'MarqueeText',
      'VueUse Motion',
      'Spring Physics',
      'Staggered Animations',
    ],
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    buttonClass: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  },
  {
    name: 'Shader',
    description: 'WebGL/WebGPU shaders, a 142-block TSL pipeline, and 50+ background presets',
    loaded: true,
    icon: 'i-lucide-shapes',
    to: '/shader',
    features: [
      'TSL Shaders',
      '142 TSL Blocks',
      '50+ Background Presets',
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
    name: 'Theme',
    description: 'Config-driven theme system with dark mode and accent colour support',
    loaded: true,
    icon: 'i-lucide-swatch-book',
    to: '/theme',
    features: ['Dark Mode', 'Accent Colors', 'Color Themes', 'CSS Variables'],
    borderColor: 'border-neutral-400/30',
    bgColor: 'bg-neutral-400/5',
    iconBg: 'bg-neutral-400/10',
    iconColor: 'text-neutral-400',
    buttonClass: 'bg-neutral-400/10 text-neutral-400 hover:bg-neutral-400/20',
  },
  {
    name: 'Forms',
    description: 'Config-driven form fields with Zod validation and full type inference',
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
    name: 'Content',
    description: 'Nuxt Content v3 with typed collections for blog, portfolio, and gallery',
    loaded: true,
    icon: 'i-lucide-file-text',
    to: '/content',
    features: [
      'Markdown',
      'Blog Collection',
      'Portfolio Collection',
      'Gallery Collection',
      'Frontmatter Schema',
      'Content API',
    ],
    borderColor: 'border-red-400/30',
    bgColor: 'bg-red-400/5',
    iconBg: 'bg-red-400/10',
    iconColor: 'text-red-400',
    buttonClass: 'bg-red-400/10 text-red-400 hover:bg-red-400/20',
  },
  {
    name: 'Routing',
    description: 'Feature flags, governance presets, maintenance mode, and access control',
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
  {
    name: 'Feeds',
    description: 'RSS 2.0, Atom 1.0, and JSON Feed syndication with XSLT browser rendering',
    loaded: true,
    icon: 'i-lucide-rss',
    to: '/feeds',
    features: [
      'RSS 2.0',
      'Atom 1.0',
      'JSON Feed 1.1',
      'XSLT Rendering',
      'Per-collection',
      'ETags',
      'Cache-Control',
    ],
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-500/5',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
    buttonClass: 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20',
  },
]

const demos = [
  { label: 'Scrollytelling', to: '/scrollytelling', icon: 'i-lucide-book-open-text', layer: 'Motion' },
  { label: 'Interactions', to: '/motion-interactions', icon: 'i-lucide-mouse-pointer-2', layer: 'Motion' },
  { label: 'MarqueeText', to: '/marquee-text', icon: 'i-lucide-text-cursor-input', layer: 'Motion' },
  { label: 'Locomotive Scroll', to: '/locomotive-scroll', icon: 'i-lucide-train', layer: 'Motion' },
  { label: 'GSAP', to: '/gsap', icon: 'i-lucide-zap', layer: 'Motion' },
  { label: 'Shader Pipeline', to: '/shader-pipeline', icon: 'i-lucide-layers-3', layer: 'Shader' },
  { label: 'Shader Background', to: '/shader-background', icon: 'i-lucide-wand-sparkles', layer: 'Shader' },
  { label: 'Navigation', to: '/nav', icon: 'i-lucide-menu', layer: 'UI' },
  { label: 'Overlays', to: '/overlays', icon: 'i-lucide-layers', layer: 'UI' },
  { label: 'Ambient', to: '/ambient', icon: 'i-lucide-moon', layer: 'UI' },
  { label: 'Typography', to: '/typography', icon: 'i-lucide-type', layer: 'UI' },
  { label: 'Gallery', to: '/gallery', icon: 'i-lucide-images', layer: 'Content' },
  { label: 'Layout: Blind Reveal', to: '/layout-blind-reveal', icon: 'i-lucide-eye', layer: 'Layout' },
  { label: 'Layout: Stacking', to: '/layout-stacking', icon: 'i-lucide-stack', layer: 'Layout' },
  { label: 'Routing: Scroll', to: '/routing-scroll', icon: 'i-lucide-scroll', layer: 'Routing' },
]

definePageMeta({ layout: { name: 'grid', props: { showHeader: false, showFooter: false } } })
</script>

<template>
  <LayoutPage
    title="Nuxt Layers Playground"
    description="Explore the features of each layer in this monorepo architecture demo"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 pb-8">
          <LayoutPageHeader
            title="Nuxt Layers Playground"
            description="Explore the features of each layer in this monorepo architecture demo"
          />

          <!-- Layer Cards -->
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Layers
            </h2>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                        <h3 class="font-semibold text-lg text-highlighted">
                          {{ layer.name }}
                        </h3>
                        <UBadge color="success" variant="subtle" size="xs">Loaded</UBadge>
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

                  <!-- Action -->
                  <div class="mt-auto pt-4">
                    <NuxtLink
                      :to="layer.to"
                      class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-colors"
                      :class="[layer.buttonClass]"
                    >
                      Explore {{ layer.name }}
                      <UIcon name="i-lucide-arrow-right" class="text-sm" />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Demo Pages -->
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Demo Pages
            </h2>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="demo in demos"
                :key="demo.to"
                :to="demo.to"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-elevated border border-default hover:bg-muted transition-colors"
              >
                <UIcon :name="demo.icon" class="text-muted text-sm shrink-0" />
                {{ demo.label }}
                <UBadge variant="subtle" color="neutral" size="xs" class="ml-1">
                  {{ demo.layer }}
                </UBadge>
              </NuxtLink>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="flex flex-wrap gap-4 justify-center pt-2">
            <UButton to="/diagnostics" variant="outline" icon="i-lucide-activity">
              System Diagnostics
            </UButton>
            <UButton
              href="https://github.com/kieranmansfield/nuxt-layers"
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
