<script setup lang="ts">
  definePageMeta({ layout: false })

  const { setPageAccent } = useAccentColor()
  setPageAccent('emerald')
  onUnmounted(() => setPageAccent(null))

  const { velocity, progress } = useSmoothScroll()
  useGsap()

  const composables = [
    {
      name: 'useSmoothScroll()',
      icon: 'i-lucide-mouse-pointer-click',
      description:
        'Locomotive Scroll v5 wrapper — velocity, progress, scrollTo, scrollToTop, and scroll direction detection',
      props: ['velocity', 'progress', 'direction', 'scrollTo()', 'scrollToTop()'],
    },
    {
      name: 'useGsap()',
      icon: 'i-lucide-zap',
      description:
        'GSAP instance and ScrollTrigger — pre-configured with Locomotive Scroll as the scroller proxy',
      props: ['gsap', 'ScrollTrigger', 'v-gsap directives'],
    },
    {
      name: 'useSectionProgress()',
      icon: 'i-lucide-bar-chart-2',
      description:
        'Section-scoped scroll progress (0–1) with entering/leaving/active state for scrollytelling',
      props: ['progress', 'active', 'entering', 'leaving'],
    },
    {
      name: 'useScrollSteps()',
      icon: 'i-lucide-list-ordered',
      description:
        'Step-based scrollytelling context — provides SCROLL_SCENE_KEY for MotionScrollScene/ScrollStep components',
      props: ['currentStep', 'isActive', 'stepProgress', 'totalSteps'],
    },
  ]

  const directives = [
    {
      name: 'v-gsap.from',
      description: 'Animate from values on mount',
      example: 'v-gsap.from="{ y: 100, opacity: 0, duration: 1 }"',
    },
    {
      name: 'v-gsap.to',
      description: 'Animate to values on mount',
      example: 'v-gsap.to="{ x: 200, duration: 0.5 }"',
    },
    {
      name: 'v-gsap.whenVisible',
      description: 'Trigger when element enters viewport',
      example: 'v-gsap.whenVisible.from="{ opacity: 0, y: 30 }"',
    },
    {
      name: 'v-gsap.once',
      description: 'Only trigger once (combine with whenVisible)',
      example: 'v-gsap.whenVisible.once.from="{ ... }"',
    },
    {
      name: 'v-gsap.stagger',
      description: 'Stagger children with ScrollTrigger',
      example: 'v-gsap.whenVisible.stagger.from="{ ... }"',
    },
    {
      name: 'v-gsap.parallax',
      description: 'Declarative parallax speed modifier',
      example: 'v-gsap.parallax.slower-5',
    },
  ]

  const components = [
    {
      name: 'MotionScrollProgress',
      description: 'Fixed scroll progress bar at the top of the page',
      icon: 'i-lucide-bar-chart-2',
    },
    {
      name: 'MotionScrollStats',
      description: 'Live velocity and progress debug overlay',
      icon: 'i-lucide-activity',
    },
    {
      name: 'MotionParallax',
      description: 'Wraps an element to apply declarative parallax speed',
      icon: 'i-lucide-layers-3',
    },
    {
      name: 'MotionScrollLink',
      description: 'Button/link that scrolls to a target element',
      icon: 'i-lucide-anchor',
    },
    {
      name: 'MotionScrollScene',
      description: 'Provides SCROLL_SCENE_KEY context for step-based scrollytelling',
      icon: 'i-lucide-film',
    },
    {
      name: 'MotionScrollStep',
      description: 'A step within a ScrollScene — activates based on scroll position',
      icon: 'i-lucide-list-ordered',
    },
    {
      name: 'MotionPinnedSection',
      description: 'Pins a section and staggers children as you scroll through it',
      icon: 'i-lucide-pin',
    },
    {
      name: 'MotionHorizontalScroll',
      description: 'Converts vertical scroll into horizontal panel navigation',
      icon: 'i-lucide-arrow-right-left',
    },
  ]

  // Scroll-triggered animation demo elements
  const demoBoxes = Array.from({ length: 6 }, (_, i) => ({
    label: `Box ${i + 1}`,
    delay: i * 0.1,
  }))
</script>

<template>
  <LayoutPage title="Scroll Layer Demo" description="GSAP + Locomotive Scroll base layer">
    <div class="bg-gray-950 min-h-screen">
      <!-- Scroll progress bar -->
      <MotionScrollProgress
        class="fixed top-0 left-0 right-0 z-50"
        :show-percentage="false"
        :height="3"
      />

      <DemoPageHero
        name="SCROLL"
        description="GSAP + Locomotive Scroll infrastructure. The base layer for all animation and motion in the stack."
      >
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" to="/motion" icon="i-lucide-sparkles"> Motion Layer </UButton>
          <UButton size="lg" variant="outline" to="/gsap" icon="i-lucide-zap"> GSAP Guide </UButton>
          <UButton size="lg" variant="ghost" to="/locomotive-scroll" icon="i-lucide-train">
            Locomotive Scroll
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Live scroll stats overlay -->
      <div
        class="fixed top-16 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-mono text-sm backdrop-blur-sm"
      >
        <div>Velocity: {{ velocity.toFixed(2) }}</div>
        <div>Progress: {{ (progress * 100).toFixed(1) }}%</div>
      </div>

      <section class="bg-gray-950 pb-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="space-y-8 py-8">
            <!-- Composables -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-puzzle" class="text-primary" />
                  <h2 class="text-xl font-semibold">Composables</h2>
                </div>
                <p class="text-sm text-muted mt-1">Four composables for scroll-driven behaviour</p>
              </template>

              <div class="space-y-4">
                <div
                  v-for="comp in composables"
                  :key="comp.name"
                  class="p-4 rounded-lg bg-elevated border border-default"
                >
                  <div class="flex items-start gap-3">
                    <UIcon :name="comp.icon" class="text-primary text-xl mt-0.5 shrink-0" />
                    <div class="flex-1 min-w-0">
                      <code class="text-sm font-mono font-bold text-highlighted">
                        {{ comp.name }}
                      </code>
                      <p class="text-sm text-muted mt-1 mb-3">{{ comp.description }}</p>
                      <div class="flex flex-wrap gap-1.5">
                        <UBadge
                          v-for="prop in comp.props"
                          :key="prop"
                          variant="subtle"
                          color="primary"
                          size="xs"
                        >
                          {{ prop }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- GSAP Directives -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-zap" class="text-primary" />
                  <h2 class="text-xl font-semibold">GSAP Directives</h2>
                </div>
                <p class="text-sm text-muted mt-1">
                  Declarative GSAP animations via Vue directives
                </p>
              </template>

              <div class="space-y-3">
                <div
                  v-for="dir in directives"
                  :key="dir.name"
                  class="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-default last:border-0"
                >
                  <code class="text-sm font-mono text-primary shrink-0 w-48">{{ dir.name }}</code>
                  <span class="text-sm text-muted flex-1">{{ dir.description }}</span>
                </div>
              </div>

              <!-- Live demo -->
              <template #footer>
                <p class="text-xs text-muted mb-3">Scroll-triggered animation demo:</p>
                <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div
                    v-for="box in demoBoxes"
                    :key="box.label"
                    v-gsap.whenVisible.once.from="{
                      y: 40,
                      opacity: 0,
                      duration: 0.6,
                      ease: 'power3.out',
                      delay: box.delay,
                    }"
                    class="aspect-square bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center"
                  >
                    <span class="text-xs font-mono text-primary">{{ box.label }}</span>
                  </div>
                </div>
              </template>
            </UCard>

            <!-- Components -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-component" class="text-primary" />
                  <h2 class="text-xl font-semibold">Components</h2>
                </div>
                <p class="text-sm text-muted mt-1">
                  Eight components for scroll-reactive UI and scrollytelling
                </p>
              </template>

              <div class="grid gap-3 md:grid-cols-2">
                <div
                  v-for="comp in components"
                  :key="comp.name"
                  class="flex items-start gap-3 p-3 rounded-lg bg-elevated"
                >
                  <UIcon :name="comp.icon" class="text-primary text-lg mt-0.5 shrink-0" />
                  <div>
                    <code class="text-sm font-mono text-highlighted">{{ comp.name }}</code>
                    <p class="text-xs text-muted mt-0.5">{{ comp.description }}</p>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Navigation to sub-pages -->
            <div class="flex flex-wrap gap-4 justify-center pt-4">
              <UButton to="/motion" icon="i-lucide-sparkles"> Motion Layer </UButton>
              <UButton to="/gsap" variant="outline" icon="i-lucide-zap"> GSAP Guide </UButton>
              <UButton to="/locomotive-scroll" variant="outline" icon="i-lucide-train">
                Locomotive Scroll
              </UButton>
              <UButton to="/scrollytelling" variant="ghost" icon="i-lucide-book-open-text">
                Scrollytelling
              </UButton>
            </div>
          </div>
        </div>
      </section>

      <DemoPageFooter
        name="Scroll Layer"
        description="GSAP + Locomotive Scroll infrastructure"
        :links="[
          { label: 'Motion Layer', to: '/motion', icon: 'i-lucide-sparkles' },
          { label: 'Animations', to: '/animations', icon: 'i-lucide-wand-sparkles' },
          { label: 'GSAP Guide', to: '/gsap', icon: 'i-lucide-zap' },
          { label: 'Scrollytelling', to: '/scrollytelling', icon: 'i-lucide-book-open-text' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
