<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('emerald')
  onUnmounted(() => setPageAccent(null))

  const { velocity, progress, direction, scrollY } = useSmoothScroll()

  // Derived state for display
  const isScrolling = computed(() => Math.abs(velocity.value) > 0.01)
  const absVelocity = computed(() => Math.abs(velocity.value))

  // Demo state
  const activeTab = ref('velocity')

  const tabs = [
    { id: 'velocity', label: 'Velocity Effects', icon: 'i-lucide-gauge' },
    { id: 'progress', label: 'Progress', icon: 'i-lucide-percent' },
    { id: 'programmatic', label: 'Scroll Control', icon: 'i-lucide-navigation' },
    { id: 'gsap', label: 'GSAP Integration', icon: 'i-lucide-sparkles' },
    { id: 'api', label: 'Composable API', icon: 'i-lucide-code' },
  ]

  const codeExamples = {
    composable: `// useSmoothScroll composable
const {
  scrollTo,      // Scroll to element or position
  scrollToTop,   // Scroll to top
  velocity,      // Current scroll velocity
  progress,      // Scroll progress (0-1)
  direction,     // Scroll direction (1 or -1)
  scrollY,       // Current scroll position
} = useSmoothScroll()`,

    scrollTo: `// Programmatic scrolling
scrollTo('#section', {
  duration: 1500, // ms
  offset: -100,
})

// Scroll to position
scrollTo(500, { duration: 1000 })

// Back to top
scrollToTop({ duration: 2000 })`,

    velocityEffect: `// Using MotionVelocityEffect component
<MotionVelocityEffect effect="skew" :intensity="3">
  <h1>Skews based on scroll velocity</h1>
</MotionVelocityEffect>

// Available effects:
// skew, scale, blur, opacity,
// letterSpacing, rotate, translateY, hueRotate`,

    gsapIntegration: `// Using MotionParallax component
<MotionParallax :speed="-0.3" :rotate="5">
  <div>Moves slower with rotation</div>
</MotionParallax>

// Or manual GSAP setup
const { gsap, ScrollTrigger } = useGsap()
gsap.to('.element', {
  scrollTrigger: { trigger: '.section', scrub: 0.5 },
  y: -200,
})`,

    progressBar: `// Using MotionScrollProgress component
<MotionScrollProgress type="circular" :size="120" />
<MotionScrollProgress type="linear" :height="4" />

// Or manual approach
const { progress } = useSmoothScroll()
:style="{ width: \`\${progress * 100}%\` }"`,
  }
</script>

<template>
  <LayoutPage
    title="Locomotive Scroll Deep Dive"
    description="Comprehensive guide to Locomotive Scroll v5 features and usage"
  >
    <div class="locomotive-deep-dive">
      <!-- Fixed scroll stats using component -->
      <MotionScrollStats :show="['velocity']" position="bottom-right" compact />

      <!-- Hero -->
      <section
        class="bg-default relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <!-- Velocity-reactive background using MotionVelocityEffect -->
        <div class="pointer-events-none absolute inset-0">
          <MotionVelocityEffect effect="scale" :intensity="0.08" class="absolute top-1/4 left-1/4">
            <div class="bg-primary/20 h-96 w-96 rounded-full blur-[60px]" />
          </MotionVelocityEffect>
          <MotionVelocityEffect
            effect="translateY"
            :intensity="8"
            class="absolute right-1/4 bottom-1/4"
          >
            <div class="h-64 w-64 rounded-full bg-purple-500/20 blur-2xl" />
          </MotionVelocityEffect>
          <MotionVelocityEffect effect="scale" :intensity="0.1" class="absolute top-1/2 right-1/3">
            <div class="h-48 w-48 rounded-full bg-cyan-500/15 blur-[50px]" />
          </MotionVelocityEffect>
        </div>

        <div class="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div
            class="text-highlighted/80 mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
          >
            <UIcon name="i-lucide-train" />
            <span>Locomotive Scroll v5</span>
          </div>

          <MotionVelocityEffect
            effect="skew"
            :intensity="1.5"
            as="h1"
            class="text-highlighted mb-8 text-5xl font-black md:text-7xl lg:text-9xl"
          >
            Deep Dive
          </MotionVelocityEffect>

          <p class="text-muted mx-auto mb-12 max-w-3xl text-xl md:text-2xl">
            Everything you need to know about smooth scrolling, parallax effects, and scroll-linked
            animations
          </p>

          <div class="flex flex-wrap justify-center gap-4">
            <MotionScrollLink to="#playground" :duration="1500" as="span">
              <UButton size="xl"> Interactive Playground </UButton>
            </MotionScrollLink>
            <UButton size="xl" variant="outline" to="/motion"> Back to Motion Demo </UButton>
          </div>
        </div>

        <!-- Live stats panel -->
        <div
          class="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl bg-black/60 px-6 py-3 backdrop-blur-sm"
        >
          <div class="flex gap-8 text-sm">
            <div class="text-center">
              <div class="text-muted mb-1 text-xs">VELOCITY</div>
              <div class="text-highlighted font-bold tabular-nums">{{ velocity.toFixed(2) }}</div>
            </div>
            <div class="text-center">
              <div class="text-muted mb-1 text-xs">PROGRESS</div>
              <div class="text-highlighted font-bold tabular-nums">
                {{ (progress * 100).toFixed(0) }}%
              </div>
            </div>
            <div class="text-center">
              <div class="text-muted mb-1 text-xs">DIRECTION</div>
              <div class="text-highlighted font-bold">
                {{ direction > 0 ? 'DOWN' : direction < 0 ? 'UP' : 'IDLE' }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-muted mb-1 text-xs">SCROLL Y</div>
              <div class="text-highlighted font-bold tabular-nums">{{ Math.round(scrollY) }}px</div>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div
          class="text-highlighted/30 absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <UIcon name="i-lucide-chevron-down" class="text-3xl" />
        </div>
      </section>

      <!-- Features Overview -->
      <section id="features" class="bg-default py-32">
        <UContainer>
          <div class="mb-20 text-center">
            <span class="text-primary mb-4 block text-sm font-semibold tracking-wider uppercase">
              Built on Lenis
            </span>
            <h2 class="text-highlighted mb-6 text-4xl font-bold md:text-6xl">Core Features</h2>
            <p class="text-muted mx-auto max-w-2xl text-xl">
              What makes Locomotive Scroll v5 the gold standard for smooth scrolling
            </p>
          </div>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div
              class="bg-accented/50 border-accented/50 hover:border-primary/50 rounded-3xl border p-8 text-center backdrop-blur transition-colors"
            >
              <div
                class="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
              >
                <UIcon name="i-lucide-zap" class="text-primary text-4xl" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Native Performance</h3>
              <p class="text-muted">
                Uses native scroll with CSS transforms. No scroll hijacking, feels natural.
              </p>
            </div>

            <div
              class="bg-accented/50 border-accented/50 rounded-3xl border p-8 text-center backdrop-blur transition-colors hover:border-purple-500/50"
            >
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/10"
              >
                <UIcon name="i-lucide-gauge" class="text-4xl text-purple-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Velocity Tracking</h3>
              <p class="text-muted">
                Real-time scroll velocity for momentum-based effects and dynamic UI.
              </p>
            </div>

            <div
              class="bg-accented/50 border-accented/50 rounded-3xl border p-8 text-center backdrop-blur transition-colors hover:border-cyan-500/50"
            >
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10"
              >
                <UIcon name="i-lucide-link" class="text-4xl text-cyan-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">GSAP Integration</h3>
              <p class="text-muted">
                Seamless ScrollTrigger proxy for advanced scroll-linked animations.
              </p>
            </div>

            <div
              class="bg-accented/50 border-accented/50 rounded-3xl border p-8 text-center backdrop-blur transition-colors hover:border-pink-500/50"
            >
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/10"
              >
                <UIcon name="i-lucide-smartphone" class="text-4xl text-pink-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Touch Optimized</h3>
              <p class="text-muted">Perfect touch and trackpad handling on all devices.</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Velocity Effects Showcase using MotionVelocityEffect -->
      <section class="bg-default overflow-hidden py-32">
        <UContainer>
          <div class="mb-20 text-center">
            <span class="mb-4 block text-sm font-semibold tracking-wider text-purple-500 uppercase">
              Live Demo
            </span>
            <h2 class="text-highlighted mb-6 text-4xl font-bold md:text-6xl">Velocity Effects</h2>
            <p class="text-muted text-xl">Using the MotionVelocityEffect component</p>
          </div>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Skew Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Skew Transform</h3>
              <MotionVelocityEffect
                effect="skew"
                :intensity="3"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                SKEW
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">effect="skew" :intensity="3"</code>
            </div>

            <!-- Scale Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Scale Transform</h3>
              <MotionVelocityEffect
                effect="scale"
                :intensity="0.12"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                SCALE
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">effect="scale" :intensity="0.12"</code>
            </div>

            <!-- Blur Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Motion Blur</h3>
              <MotionVelocityEffect
                effect="blur"
                :intensity="1.5"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                BLUR
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">effect="blur" :intensity="1.5"</code>
            </div>

            <!-- Opacity Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Opacity Fade</h3>
              <MotionVelocityEffect
                effect="opacity"
                :intensity="0.25"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                FADE
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">
                effect="opacity" :intensity="0.25"
              </code>
            </div>

            <!-- Letter Spacing Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Letter Spacing</h3>
              <MotionVelocityEffect
                effect="letterSpacing"
                :intensity="6"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                SPACE
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">
                effect="letterSpacing" :intensity="6"
              </code>
            </div>

            <!-- Rotate Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Rotation</h3>
              <MotionVelocityEffect
                effect="rotate"
                :intensity="4"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                SPIN
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">effect="rotate" :intensity="4"</code>
            </div>

            <!-- Color Shift Effect -->
            <div class="bg-default border-default rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Hue Rotation</h3>
              <MotionVelocityEffect
                effect="hueRotate"
                :intensity="45"
                class="text-primary py-8 text-center text-4xl font-black md:text-5xl"
              >
                COLOR
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">
                effect="hueRotate" :intensity="45"
              </code>
            </div>

            <!-- Y Translation -->
            <div class="bg-default border-default overflow-hidden rounded-2xl border p-8">
              <h3 class="text-muted mb-6 text-lg font-semibold">Y Translation</h3>
              <MotionVelocityEffect
                effect="translateY"
                :intensity="8"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                SHIFT
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">
                effect="translateY" :intensity="8"
              </code>
            </div>

            <!-- Combined - manual for complex combinations -->
            <div
              class="from-primary/20 border-primary/30 rounded-2xl border bg-linear-to-br to-purple-600/20 p-8"
            >
              <h3 class="text-primary mb-6 text-lg font-semibold">Combined (Manual)</h3>
              <MotionVelocityEffect
                effect="skew"
                :intensity="2"
                class="text-highlighted py-8 text-center text-4xl font-black md:text-5xl"
              >
                <MotionVelocityEffect effect="scale" :intensity="0.08" as="span">
                  MIX
                </MotionVelocityEffect>
              </MotionVelocityEffect>
              <code class="text-muted mt-4 block text-xs">
                Nested components for combinations
              </code>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Interactive Playground -->
      <section id="playground" class="bg-default py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <span class="mb-4 block text-sm font-semibold tracking-wider text-cyan-500 uppercase">
              Try It Out
            </span>
            <h2 class="text-highlighted mb-6 text-4xl font-bold md:text-6xl">
              Interactive Playground
            </h2>
            <p class="text-muted text-xl">Explore the API and see code examples</p>
          </div>

          <!-- Tab Navigation -->
          <div class="mb-12 flex flex-wrap justify-center gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-all"
              :class="
                activeTab === tab.id
                  ? 'bg-primary text-highlighted shadow-primary/25 shadow-lg'
                  : 'bg-accented text-muted hover:text-highlighted hover:bg-accented'
              "
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="mx-auto max-w-5xl">
            <!-- Velocity Effects Tab -->
            <div v-show="activeTab === 'velocity'" class="space-y-8">
              <div class="bg-accented/50 border-accented rounded-3xl border p-8">
                <h3 class="text-highlighted mb-4 text-2xl font-bold">
                  MotionVelocityEffect Component
                </h3>
                <p class="text-muted mb-8">
                  Wrap any content to apply velocity-based effects. Built-in smoothing for stable
                  animations.
                </p>

                <div class="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div class="bg-default rounded-xl p-6 text-center">
                    <p class="text-muted mb-2 text-sm">Velocity</p>
                    <p class="text-primary text-3xl font-bold tabular-nums">
                      {{ velocity.toFixed(2) }}
                    </p>
                  </div>
                  <div class="bg-default rounded-xl p-6 text-center">
                    <p class="text-muted mb-2 text-sm">Absolute</p>
                    <p class="text-3xl font-bold text-purple-500 tabular-nums">
                      {{ absVelocity.toFixed(2) }}
                    </p>
                  </div>
                  <div class="bg-default rounded-xl p-6 text-center">
                    <p class="text-muted mb-2 text-sm">Direction</p>
                    <p
                      class="text-3xl font-bold"
                      :class="
                        direction > 0
                          ? 'text-green-500'
                          : direction < 0
                            ? 'text-red-500'
                            : 'text-toned'
                      "
                    >
                      {{ direction > 0 ? 'DOWN' : direction < 0 ? 'UP' : '—' }}
                    </p>
                  </div>
                  <div class="bg-default rounded-xl p-6 text-center">
                    <p class="text-muted mb-2 text-sm">Scrolling</p>
                    <p
                      class="text-3xl font-bold"
                      :class="isScrolling ? 'text-green-500' : 'text-toned'"
                    >
                      {{ isScrolling ? 'YES' : 'NO' }}
                    </p>
                  </div>
                </div>

                <pre
                  class="bg-default overflow-x-auto rounded-xl p-6 text-sm"
                ><code class="text-toned">{{ codeExamples.velocityEffect }}</code></pre>
              </div>
            </div>

            <!-- Progress Tab -->
            <div v-show="activeTab === 'progress'" class="space-y-8">
              <div class="bg-accented/50 border-accented rounded-3xl border p-8">
                <h3 class="text-highlighted mb-4 text-2xl font-bold">
                  MotionScrollProgress Component
                </h3>
                <p class="text-muted mb-8">
                  Display scroll progress as linear or circular indicator.
                </p>

                <div class="mb-8 flex flex-col items-center justify-center gap-12 md:flex-row">
                  <!-- Circular using component -->
                  <div class="text-center">
                    <MotionScrollProgress
                      type="circular"
                      :size="150"
                      :stroke-width="10"
                      class="text-highlighted"
                    />
                    <p class="text-muted mt-4 text-sm">type="circular"</p>
                  </div>

                  <!-- Linear using component -->
                  <div class="max-w-md flex-1">
                    <MotionScrollProgress type="linear" :height="8" class="text-highlighted" />
                    <p class="text-muted mt-4 text-center text-sm">type="linear"</p>
                  </div>
                </div>

                <pre
                  class="bg-default overflow-x-auto rounded-xl p-6 text-sm"
                ><code class="text-toned">{{ codeExamples.progressBar }}</code></pre>
              </div>
            </div>

            <!-- Programmatic Tab -->
            <div v-show="activeTab === 'programmatic'" class="space-y-8">
              <div class="bg-accented/50 border-accented rounded-3xl border p-8">
                <h3 class="text-highlighted mb-4 text-2xl font-bold">MotionScrollLink Component</h3>
                <p class="text-muted mb-8">
                  Create smooth scroll links to any element or position.
                </p>

                <div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <MotionScrollLink :to="0" :duration="1500" as="span" class="block">
                    <UButton size="lg" block>
                      <UIcon name="i-lucide-arrow-up" class="mr-2" />
                      Top
                    </UButton>
                  </MotionScrollLink>
                  <MotionScrollLink to="#features" :duration="1000" as="span" class="block">
                    <UButton size="lg" variant="outline" block>
                      <UIcon name="i-lucide-target" class="mr-2" />
                      Features
                    </UButton>
                  </MotionScrollLink>
                  <MotionScrollLink to="#parallax-demo" :duration="1500" as="span" class="block">
                    <UButton size="lg" variant="outline" block>
                      <UIcon name="i-lucide-layers" class="mr-2" />
                      Parallax
                    </UButton>
                  </MotionScrollLink>
                  <MotionScrollLink :to="2000" :duration="2000" as="span" class="block">
                    <UButton size="lg" variant="soft" block>
                      <UIcon name="i-lucide-arrow-down" class="mr-2" />
                      2000px
                    </UButton>
                  </MotionScrollLink>
                </div>

                <pre
                  class="bg-default overflow-x-auto rounded-xl p-6 text-sm"
                ><code class="text-toned">{{ codeExamples.scrollTo }}</code></pre>
              </div>
            </div>

            <!-- GSAP Tab -->
            <div v-show="activeTab === 'gsap'" class="space-y-8">
              <div class="bg-accented/50 border-accented rounded-3xl border p-8">
                <h3 class="text-highlighted mb-4 text-2xl font-bold">MotionParallax Component</h3>
                <p class="text-muted mb-8">
                  Create GSAP-powered parallax effects with a simple component.
                </p>

                <div class="bg-default mb-8 rounded-xl p-6">
                  <h4 class="text-highlighted mb-4 text-lg font-semibold">Props:</h4>
                  <ul class="text-muted space-y-3">
                    <li class="flex gap-3">
                      <code class="text-primary">speed</code>
                      <span>Parallax speed (-1 to 1, negative = slower)</span>
                    </li>
                    <li class="flex gap-3">
                      <code class="text-primary">direction</code>
                      <span>"vertical" | "horizontal"</span>
                    </li>
                    <li class="flex gap-3">
                      <code class="text-primary">rotate</code>
                      <span>Rotation amount during parallax</span>
                    </li>
                    <li class="flex gap-3">
                      <code class="text-primary">scale</code>
                      <span>Scale change during parallax</span>
                    </li>
                  </ul>
                </div>

                <pre
                  class="bg-default overflow-x-auto rounded-xl p-6 text-sm"
                ><code class="text-toned">{{ codeExamples.gsapIntegration }}</code></pre>
              </div>
            </div>

            <!-- API Tab -->
            <div v-show="activeTab === 'api'" class="space-y-8">
              <div class="bg-accented/50 border-accented rounded-3xl border p-8">
                <h3 class="text-highlighted mb-4 text-2xl font-bold">Available Components</h3>
                <p class="text-muted mb-8">
                  All motion layer components for scroll-linked animations.
                </p>

                <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div class="bg-default rounded-xl p-4">
                    <h4 class="text-primary mb-3 text-sm font-semibold">Velocity & Effects</h4>
                    <ul class="text-muted space-y-2 text-sm">
                      <li>
                        <code class="text-highlighted">MotionVelocityEffect</code> - Velocity
                        transforms
                      </li>
                      <li><code class="text-highlighted">MotionParallax</code> - GSAP parallax</li>
                      <li>
                        <code class="text-highlighted">MotionTextReveal</code> - Text animations
                      </li>
                      <li>
                        <code class="text-highlighted">MotionMarquee</code> - Scrolling marquee
                      </li>
                    </ul>
                  </div>
                  <div class="bg-default rounded-xl p-4">
                    <h4 class="mb-3 text-sm font-semibold text-purple-500">
                      Navigation & Progress
                    </h4>
                    <ul class="text-muted space-y-2 text-sm">
                      <li>
                        <code class="text-highlighted">MotionScrollLink</code> - Smooth scroll links
                      </li>
                      <li>
                        <code class="text-highlighted">MotionScrollProgress</code> - Progress
                        indicators
                      </li>
                      <li>
                        <code class="text-highlighted">MotionScrollStats</code> - Debug display
                      </li>
                      <li>
                        <code class="text-highlighted">MotionStaggered</code> - Staggered animations
                      </li>
                    </ul>
                  </div>
                </div>

                <pre
                  class="bg-default overflow-x-auto rounded-xl p-6 text-sm"
                ><code class="text-toned">{{ codeExamples.composable }}</code></pre>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Parallax Demo using MotionParallax -->
      <section id="parallax-demo" class="bg-default relative min-h-screen overflow-hidden py-32">
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- Background layer (slowest) using MotionParallax -->
          <MotionParallax :speed="-0.4" :scale="0.1" class="absolute">
            <div class="text-default/30 text-[25vw] font-black whitespace-nowrap select-none">
              PARALLAX
            </div>
          </MotionParallax>
        </div>

        <!-- Floating shapes using MotionParallax -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <MotionParallax :speed="0.3" :rotate="10" class="absolute top-[15%] left-[10%]">
            <div class="border-primary/40 h-24 w-24 rounded-full border-4" />
          </MotionParallax>
          <MotionParallax :speed="-0.2" :rotate="-15" class="absolute top-[25%] right-[15%]">
            <div class="h-16 w-16 rotate-45 bg-purple-500/30" />
          </MotionParallax>
          <MotionParallax :speed="0.4" class="absolute bottom-[35%] left-[20%]">
            <div class="h-20 w-20 border-4 border-pink-500/40" />
          </MotionParallax>
          <MotionParallax :speed="-0.3" :rotate="20" class="absolute right-[25%] bottom-[20%]">
            <div class="h-28 w-28 rounded-full border-4 border-cyan-500/30" />
          </MotionParallax>
          <MotionParallax :speed="0.2" class="absolute top-[40%] left-[40%]">
            <div class="h-12 w-12 rounded-full bg-green-500/30" />
          </MotionParallax>
        </div>

        <!-- Middle layer content -->
        <MotionParallax :speed="-0.1" class="relative z-10">
          <UContainer>
            <div class="py-32 text-center">
              <h2 class="text-highlighted mb-6 text-5xl font-bold md:text-7xl">MotionParallax</h2>
              <p class="text-muted mx-auto mb-8 max-w-xl text-xl">
                Multiple layers moving at different speeds using the MotionParallax component
              </p>
              <div
                class="text-highlighted/70 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
              >
                <UIcon name="i-lucide-info" />
                Scroll slowly to see the effect
              </div>
            </div>
          </UContainer>
        </MotionParallax>

        <!-- Foreground blurs using MotionParallax -->
        <MotionParallax :speed="0.5" :scale="0.15" class="pointer-events-none absolute inset-0">
          <div class="bg-primary/30 absolute top-1/4 left-[10%] h-48 w-48 rounded-full blur-3xl" />
          <div
            class="absolute right-[15%] bottom-1/4 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl"
          />
        </MotionParallax>
      </section>

      <!-- Progress Indicator Section using MotionScrollProgress -->
      <section class="bg-default py-32">
        <UContainer>
          <div class="mx-auto max-w-4xl">
            <div class="mb-16 text-center">
              <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
                MotionScrollProgress
              </h2>
              <p class="text-muted text-lg">Circular and linear progress indicators</p>
            </div>

            <!-- Using MotionScrollProgress components -->
            <div class="mb-12 flex flex-col items-center justify-center gap-12 md:flex-row">
              <MotionScrollProgress
                type="circular"
                :size="192"
                :stroke-width="8"
                class="text-highlighted"
              />
              <div class="max-w-md flex-1">
                <MotionScrollProgress
                  type="linear"
                  :height="12"
                  show-percentage
                  class="text-highlighted"
                />
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Footer -->
      <section class="bg-default py-20">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 class="text-highlighted mb-3 text-3xl font-bold">Locomotive Scroll v5</h2>
              <p class="text-muted text-lg">Smooth scrolling for the modern web</p>
            </div>
            <div class="flex gap-4">
              <UButton size="lg" variant="outline" to="/motion">
                <UIcon name="i-lucide-arrow-left" class="mr-2" />
                Motion Demo
              </UButton>
              <MotionScrollLink :to="0" :duration="2000" as="span">
                <UButton size="lg">
                  <UIcon name="i-lucide-arrow-up" class="mr-2" />
                  Back to Top
                </UButton>
              </MotionScrollLink>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>

<style scoped>
  /* stylelint-disable plugin/no-unsupported-browser-features */

  pre,
  code {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
    white-space: pre;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
