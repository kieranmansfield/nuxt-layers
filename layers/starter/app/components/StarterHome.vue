<script setup lang="ts">
useSeoMeta({
  title: 'kmcom-nuxt-layers Starter',
  description:
    'A production-ready Nuxt starter powered by kmcom-nuxt-layers. Composable, modular, and ready to ship.',
})

const { gsap, ScrollTrigger } = useGsap()
gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)
const sectionsRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (heroRef.value) {
    gsap.from(Array.from(heroRef.value.children), {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }

  if (sectionsRef.value) {
    gsap.from(sectionsRef.value.querySelectorAll('.layer-card'), {
      scrollTrigger: {
        trigger: sectionsRef.value,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 32,
      opacity: 0,
      scale: 0.97,
      duration: 0.5,
      stagger: { amount: 0.5 },
      ease: 'power3.out',
    })
  }
})

const appConfig = useAppConfig()
const activeLayers = appConfig.layers as Record<string, boolean>

type LayerDef = {
  name: string
  key: string
  description: string
  icon: string
  features: string[]
  borderColor: string
  bgColor: string
  iconBg: string
  iconColor: string
}

const coreLayers: LayerDef[] = [
  {
    name: 'Core',
    key: 'core',
    description: 'Foundation utilities, error handling, device detection, PWA support',
    icon: 'i-lucide-box',
    features: ['Browser Detection', 'Screen Info', 'Network Status', 'Loading States', 'PWA'],
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    name: 'UI',
    key: 'ui',
    description: 'Typography, navigation, visual primitives and the design system',
    icon: 'i-lucide-palette',
    features: ['Typography', 'Color Tokens', 'Navigation', 'Visual Primitives', 'Toast', 'Modal'],
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/5',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
  },
  {
    name: 'Layout',
    key: 'layout',
    description: 'Swiss Grid system, sections, and page containers',
    icon: 'i-lucide-layout',
    features: ['18-Col Grid', 'Hero Section', 'Split Section', 'Gallery Section', 'Grid Debug'],
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    name: 'Motion',
    key: 'motion',
    description: 'GSAP, Lenis smooth scroll, page transitions and animation effects',
    icon: 'i-lucide-sparkles',
    features: ['GSAP', 'ScrollTrigger', 'Lenis', 'Marquee', 'Magnetic', 'Tilt', 'Cursor'],
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    name: 'Forms',
    key: 'forms',
    description: 'Config-driven form fields with Zod validation and type inference',
    icon: 'i-lucide-file-input',
    features: ['Dynamic Fields', 'Zod Validation', 'Type Inference', 'Auto Icons', 'Contact Form'],
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/5',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
  },
  {
    name: 'Theme',
    key: 'theme',
    description: 'Dark mode, accent color palettes and design token system',
    icon: 'i-lucide-swatch-book',
    features: ['Dark Mode', 'Accent Colors', 'Color Tokens', 'Color Mode'],
    borderColor: 'border-neutral-400/30',
    bgColor: 'bg-neutral-400/5',
    iconBg: 'bg-neutral-400/10',
    iconColor: 'text-neutral-400',
  },
  {
    name: 'Content',
    key: 'content',
    description: 'Markdown CMS with typed collections via @nuxt/content',
    icon: 'i-lucide-file-text',
    features: ['Markdown', 'Collections', 'Frontmatter', 'Content API', 'Zod Schemas'],
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/5',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
  {
    name: 'Scripts',
    key: 'scripts',
    description: 'Third-party script management with performance-safe loading',
    icon: 'i-lucide-code',
    features: ['Lazy Loading', 'Analytics', 'Consent-Aware', 'Performance-Safe'],
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-500/5',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
  },
  {
    name: 'Routing',
    key: 'routing',
    description: 'Advanced routing utilities, typed middleware and navigation helpers',
    icon: 'i-lucide-route',
    features: ['Typed Routes', 'Middleware', 'Route Guards', 'Navigation Utils'],
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-500/5',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
  },
  {
    name: 'SEO',
    key: 'seo',
    description: 'Meta tags, Open Graph, JSON-LD, sitemap and robots.txt via @nuxtjs/seo',
    icon: 'i-lucide-search',
    features: ['Meta Tags', 'Open Graph', 'JSON-LD', 'Sitemap', 'Robots.txt', 'Schema.org'],
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/5',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
  },
  {
    name: 'Feeds',
    key: 'feeds',
    description: 'RSS and feed aggregation with display components',
    icon: 'i-lucide-rss',
    features: ['RSS Feeds', 'Feed Display', 'Feed Parser'],
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/5',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
]

const addonLayers: LayerDef[] = [
  {
    name: 'Canvas',
    key: 'canvas',
    description: 'WebGL/WebGPU canvas foundation required by the shader layer',
    icon: 'i-lucide-monitor',
    features: ['WebGL', 'WebGPU', 'Canvas Composables', '3D Foundation'],
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    name: 'Shader',
    key: 'shader',
    description: 'Three.js + TresJS shader system with TSL, noise and post-processing',
    icon: 'i-lucide-shapes',
    features: ['TSL Shaders', 'Noise', 'Gradients', 'Fresnel', 'Post-Processing', 'WebGPU'],
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/5',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
  },
]

const marqueeItems = [
  'Core', '◆', 'UI', '◆', 'Layout', '◆', 'Motion', '◆', 'Forms', '◆',
  'Theme', '◆', 'Content', '◆', 'SEO', '◆', 'Scripts', '◆', 'Routing', '◆', 'Feeds', '◆',
]
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="px-8 pb-4 pt-8">
      <!-- Hero -->
      <div ref="heroRef" class="space-y-6 py-8 text-center">
        <UBadge variant="subtle" color="primary" size="lg" icon="i-lucide-layers">
          kmcom-nuxt-layers
        </UBadge>
        <h1 class="text-highlighted text-4xl font-bold sm:text-5xl lg:text-6xl">
          Nuxt Layer Architecture
        </h1>
        <p class="text-muted mx-auto max-w-2xl text-lg">
          A production-ready starter built on composable Nuxt layers. Toggle layers in
          <code class="text-primary">layers.config.ts</code> to enable or disable capabilities.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <UButton
            to="/design-system"
            size="xl"
            icon="i-lucide-layout-template"
            trailing-icon="i-lucide-arrow-right"
          >
            Design System
          </UButton>
          <UButton
            to="https://github.com/kieranmansfield/starter-template"
            target="_blank"
            size="xl"
            icon="i-simple-icons-github"
            color="neutral"
            variant="subtle"
          >
            View on GitHub
          </UButton>
        </div>
      </div>
    </UContainer>

    <!-- Marquee divider -->
    <div class="border-default overflow-hidden border-y py-3">
      <MotionMarquee
        :speed="45"
        :pause-on-hover="false"
        gap="3rem"
        velocity-based
        :velocity-sensitivity="0.6"
      >
        <span
          v-for="item in marqueeItems"
          :key="item"
          class="text-muted whitespace-nowrap text-xs font-semibold uppercase tracking-widest"
        >{{ item }}</span>
      </MotionMarquee>
    </div>

    <div ref="sectionsRef">
      <UContainer class="px-8 pb-8 pt-10">
        <div class="space-y-12">

          <!-- Core Layers -->
          <section>
            <div class="mb-6">
              <h2 class="text-highlighted text-xl font-semibold">Core Layers</h2>
              <p class="text-muted mt-1 text-sm">
                The solid foundation — enabled by default, no extra dependencies required.
              </p>
            </div>
            <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="layer in coreLayers"
                :key="layer.key"
                class="layer-card rounded-xl border-2 p-5"
                :class="[layer.borderColor, layer.bgColor]"
              >
                <div class="flex h-full flex-col">
                  <div class="mb-4 flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      :class="layer.iconBg"
                    >
                      <UIcon :name="layer.icon" class="text-lg" :class="layer.iconColor" />
                    </div>
                    <div>
                      <h3 class="text-highlighted text-sm font-semibold leading-tight">
                        {{ layer.name }}
                      </h3>
                      <UBadge
                        :color="activeLayers[layer.key] ? 'success' : 'neutral'"
                        variant="subtle"
                        size="sm"
                        class="mt-0.5"
                      >
                        {{ activeLayers[layer.key] ? 'Active' : 'Disabled' }}
                      </UBadge>
                    </div>
                  </div>
                  <p class="text-muted mb-4 grow text-xs leading-relaxed">
                    {{ layer.description }}
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <UBadge
                      v-for="feature in layer.features"
                      :key="feature"
                      variant="subtle"
                      color="neutral"
                      size="sm"
                    >
                      {{ feature }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Add-on Layers -->
          <section>
            <div class="mb-6">
              <h2 class="text-highlighted text-xl font-semibold">Add-on Layers</h2>
              <p class="text-muted mt-1 text-sm">
                Optional capabilities. Enable in <code class="text-primary">layers.config.ts</code>
                and install the required peer dependencies.
              </p>
            </div>
            <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="layer in addonLayers"
                :key="layer.key"
                class="layer-card rounded-xl border-2 p-5 opacity-70 transition-opacity"
                :class="[
                  layer.borderColor,
                  layer.bgColor,
                  activeLayers[layer.key] ? 'opacity-100' : 'opacity-60',
                ]"
              >
                <div class="flex h-full flex-col">
                  <div class="mb-4 flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      :class="layer.iconBg"
                    >
                      <UIcon :name="layer.icon" class="text-lg" :class="layer.iconColor" />
                    </div>
                    <div>
                      <h3 class="text-highlighted text-sm font-semibold leading-tight">
                        {{ layer.name }}
                      </h3>
                      <UBadge
                        :color="activeLayers[layer.key] ? 'success' : 'neutral'"
                        variant="subtle"
                        size="sm"
                        class="mt-0.5"
                      >
                        {{ activeLayers[layer.key] ? 'Active' : 'Disabled' }}
                      </UBadge>
                    </div>
                  </div>
                  <p class="text-muted mb-4 grow text-xs leading-relaxed">
                    {{ layer.description }}
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <UBadge
                      v-for="feature in layer.features"
                      :key="feature"
                      variant="subtle"
                      color="neutral"
                      size="sm"
                    >
                      {{ feature }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Links -->
          <div class="flex flex-wrap justify-center gap-4 pt-2">
            <UButton to="/design-system" variant="outline" icon="i-lucide-layout-template">
              Design System Reference
            </UButton>
            <UButton
              to="https://github.com/kieranmansfield/starter-template"
              target="_blank"
              variant="outline"
              icon="i-simple-icons-github"
            >
              View Source
            </UButton>
          </div>

        </div>
      </UContainer>
    </div>
  </div>
</template>
