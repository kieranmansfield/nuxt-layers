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
      borderColor: 'border-blue-500/50',
      bgColor: 'bg-blue-500/10',
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
      borderColor: 'border-pink-500/50',
      bgColor: 'bg-pink-500/10',
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
      borderColor: 'border-amber-500/50',
      bgColor: 'bg-amber-500/10',
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
      borderColor: 'border-emerald-500/50',
      bgColor: 'bg-emerald-500/10',
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
      borderColor: 'border-violet-500/50',
      bgColor: 'bg-violet-500/10',
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
      borderColor: 'border-indigo-500/50',
      bgColor: 'bg-indigo-500/10',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      buttonClass: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
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
      borderColor: 'border-cyan-500/50',
      bgColor: 'bg-cyan-500/10',
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
      borderColor: 'border-red-400/50',
      bgColor: 'bg-red-400/10',
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
      borderColor: 'border-orange-500/50',
      bgColor: 'bg-orange-500/10',
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
      borderColor: 'border-orange-500/50',
      bgColor: 'bg-orange-500/10',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      buttonClass: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    },
    {
      name: 'SEO',
      description: 'Robots, sitemap, OG images, and schema-org structured data via @nuxtjs/seo',
      loaded: true,
      icon: 'i-lucide-search',
      to: '/seo',
      features: ['Robots', 'Sitemap', 'OG Images', 'Schema.org', 'Link Checker', 'SEO Utils'],
      borderColor: 'border-sky-500/50',
      bgColor: 'bg-sky-500/10',
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-500',
      buttonClass: 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20',
    },
    {
      name: 'Scripts',
      description: 'Consent-gated third-party scripts, analytics, GTM, and embed facades',
      loaded: true,
      icon: 'i-lucide-cloud-download',
      to: '/scripts',
      features: ['Script Loading', 'GTM', 'Analytics', 'YouTube Facade', 'Consent Gate'],
      borderColor: 'border-lime-500/50',
      bgColor: 'bg-lime-500/10',
      iconBg: 'bg-lime-500/10',
      iconColor: 'text-lime-500',
      buttonClass: 'bg-lime-500/10 text-lime-500 hover:bg-lime-500/20',
    },
    {
      name: 'Typography',
      description: 'Typography components — Headline, TextStroke, CodeBlock — and useTypography',
      loaded: true,
      icon: 'i-lucide-type',
      to: '/typography',
      features: ['Headline', 'TextStroke', 'CodeBlock', 'useTypography', 'useColor'],
      borderColor: 'border-pink-500/50',
      bgColor: 'bg-pink-500/10',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-500',
      buttonClass: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
    },
    {
      name: 'Navigation',
      description: 'Mast/Site/Links navigation components with useMastNav and useSite composables',
      loaded: true,
      icon: 'i-lucide-menu',
      to: '/nav',
      features: ['MastHeader', 'MastFooter', 'SiteNav', 'useMastNav', 'useSite', 'useAppToast'],
      borderColor: 'border-indigo-500/50',
      bgColor: 'bg-indigo-500/10',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      buttonClass: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
    },
    {
      name: 'Visual',
      description:
        'Gradient backgrounds, accent blobs, tint overlays, and visual identity components',
      loaded: true,
      icon: 'i-lucide-eye',
      to: '/visual',
      features: ['GradientBackground', 'AccentBlob', 'TintOverlay', 'GradientText', 'Progress'],
      borderColor: 'border-rose-500/50',
      bgColor: 'bg-rose-500/10',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
      buttonClass: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
    },
    {
      name: 'Scroll',
      description: 'GSAP + Locomotive Scroll infrastructure — the base for all motion in the stack',
      loaded: true,
      icon: 'i-lucide-mouse-pointer-click',
      to: '/scroll',
      features: ['useSmoothScroll', 'useGsap', 'useSectionProgress', 'useScrollSteps', 'Parallax'],
      borderColor: 'border-emerald-500/50',
      bgColor: 'bg-emerald-500/10',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      buttonClass: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
    },
    {
      name: 'Animations',
      description:
        'Marquee, Cursor, Tilt, Magnetic, CountUp, and TextReveal micro-interaction components',
      loaded: true,
      icon: 'i-lucide-wand-sparkles',
      to: '/animations',
      features: ['MarqueeText', 'Cursor', 'Tilt', 'Magnetic', 'CountUp', 'TextReveal'],
      borderColor: 'border-amber-500/50',
      bgColor: 'bg-amber-500/10',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      buttonClass: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
    },
    {
      name: 'Transitions',
      description:
        'CSS transition classes and MotionTransition component for enter/leave animations',
      loaded: true,
      icon: 'i-lucide-shuffle',
      to: '/transitions',
      features: ['CSS Transitions', 'MotionTransition', 'Fade', 'Slide', 'Scale', 'Blur'],
      borderColor: 'border-rose-500/50',
      bgColor: 'bg-rose-500/10',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
      buttonClass: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
    },
    {
      name: 'Page Transitions',
      description: 'Nuxt page transition defaults and usePageTransition composable',
      loaded: true,
      icon: 'i-lucide-arrow-left-right',
      to: '/page-transitions',
      features: ['usePageTransition', 'Default Transitions', 'View Transitions API'],
      borderColor: 'border-fuchsia-500/50',
      bgColor: 'bg-fuchsia-500/10',
      iconBg: 'bg-fuchsia-500/10',
      iconColor: 'text-fuchsia-500',
      buttonClass: 'bg-fuchsia-500/10 text-fuchsia-500 hover:bg-fuchsia-500/20',
    },
    {
      name: 'Canvas',
      description: 'TresJS/Three.js WebGL and WebGPU rendering context with scene management',
      loaded: true,
      icon: 'i-lucide-box',
      to: '/canvas',
      features: ['TresJS', 'Three.js', 'WebGL', 'WebGPU', 'useTres', 'Scene Management'],
      borderColor: 'border-cyan-500/50',
      bgColor: 'bg-cyan-500/10',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-500',
      buttonClass: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
    },
    {
      name: 'Mailer',
      description: 'Resend email sending with runtime config, hooks, and email template support',
      loaded: true,
      icon: 'i-lucide-mail',
      to: '/mailer',
      features: ['Resend API', 'Email Hooks', 'Runtime Config', 'useMailer'],
      borderColor: 'border-teal-500/50',
      bgColor: 'bg-teal-500/10',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-500',
      buttonClass: 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20',
    },
  ]

  const demos = [
    {
      label: 'Scrollytelling',
      to: '/scrollytelling',
      icon: 'i-lucide-book-open-text',
      layer: 'Motion',
    },
    {
      label: 'Interactions',
      to: '/motion-interactions',
      icon: 'i-lucide-mouse-pointer-2',
      layer: 'Motion',
    },
    {
      label: 'MarqueeText',
      to: '/marquee-text',
      icon: 'i-lucide-text-cursor-input',
      layer: 'Motion',
    },
    {
      label: 'Locomotive Scroll',
      to: '/locomotive-scroll',
      icon: 'i-lucide-train',
      layer: 'Motion',
    },
    { label: 'GSAP', to: '/gsap', icon: 'i-lucide-zap', layer: 'Motion' },
    {
      label: 'Shader Pipeline',
      to: '/shader-pipeline',
      icon: 'i-lucide-layers-3',
      layer: 'Shader',
    },
    {
      label: 'Shader Background',
      to: '/shader-background',
      icon: 'i-lucide-wand-sparkles',
      layer: 'Shader',
    },
    { label: 'Overlays', to: '/overlays', icon: 'i-lucide-layers', layer: 'UI' },
    { label: 'Ambient', to: '/ambient', icon: 'i-lucide-moon', layer: 'UI' },
    { label: 'Gallery', to: '/gallery', icon: 'i-lucide-images', layer: 'Content' },
    {
      label: 'Layout: Blind Reveal',
      to: '/layout-blind-reveal',
      icon: 'i-lucide-eye',
      layer: 'Layout',
    },
    {
      label: 'Layout: Stacking',
      to: '/layout-stacking',
      icon: 'i-lucide-square-stack',
      layer: 'Layout',
    },
    { label: 'Routing: Scroll', to: '/routing-scroll', icon: 'i-lucide-scroll', layer: 'Routing' },
    {
      label: 'Shader Gradient',
      to: '/shader-gradient',
      icon: 'i-lucide-blend',
      layer: 'Shader',
    },
  ]

  const layerDemoColors: Record<string, { icon: string; border: string; bg: string }> = {
    Motion: { icon: 'text-emerald-500', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10' },
    Shader: { icon: 'text-violet-500', border: 'border-violet-500/50', bg: 'bg-violet-500/10' },
    UI: { icon: 'text-pink-500', border: 'border-pink-500/50', bg: 'bg-pink-500/10' },
    Content: { icon: 'text-red-400', border: 'border-red-400/50', bg: 'bg-red-400/10' },
    Layout: { icon: 'text-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-500/10' },
    Routing: { icon: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-500/10' },
  }

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
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Layers</h2>
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
              Featured Demos
            </h2>
            <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <NuxtLink
                v-for="demo in demos"
                :key="demo.to"
                :to="demo.to"
                class="flex flex-col gap-3 p-4 rounded-xl border-2 transition-colors group"
                :class="
                  layerDemoColors[demo.layer]
                    ? [layerDemoColors[demo.layer].border, layerDemoColors[demo.layer].bg]
                    : ['border-default', 'bg-elevated', 'hover:bg-muted']
                "
              >
                <UIcon
                  :name="demo.icon"
                  class="text-2xl transition-colors"
                  :class="
                    layerDemoColors[demo.layer]?.icon ?? 'text-muted group-hover:text-primary'
                  "
                />
                <div>
                  <div class="font-semibold text-sm text-highlighted leading-tight">
                    {{ demo.label }}
                  </div>
                  <UBadge variant="subtle" color="neutral" size="xs" class="mt-1.5">
                    {{ demo.layer }}
                  </UBadge>
                </div>
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
