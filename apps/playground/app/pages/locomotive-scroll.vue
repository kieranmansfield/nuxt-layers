<script setup lang="ts">
useSeoMeta({
  title: 'Locomotive Scroll Deep Dive',
  description: 'Comprehensive guide to Locomotive Scroll v5 features and usage',
})

const { scrollTo, scrollToTop, velocity, progress, direction, scrollY } = useSmoothScroll()

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
  duration: 1.5,
  offset: -100,
})

// Scroll to position
scrollTo(500, { duration: 1 })

// Back to top
scrollToTop({ duration: 2 })`,

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
  <div class="locomotive-deep-dive">
    <!-- Fixed scroll stats using component -->
    <MotionScrollStats :show="['velocity']" position="bottom-right" compact />

    <!-- Hero -->
    <section
      class="min-h-screen flex items-center justify-center relative bg-gray-950 overflow-hidden"
    >
      <!-- Velocity-reactive background using MotionVelocityEffect -->
      <div class="absolute inset-0 pointer-events-none">
        <MotionVelocityEffect effect="scale" :intensity="0.08" class="absolute top-1/4 left-1/4">
          <div class="w-96 h-96 bg-primary/20 rounded-full blur-[60px]" />
        </MotionVelocityEffect>
        <MotionVelocityEffect
          effect="translateY"
          :intensity="8"
          class="absolute bottom-1/4 right-1/4"
        >
          <div class="w-64 h-64 bg-purple-500/20 rounded-full blur-[40px]" />
        </MotionVelocityEffect>
        <MotionVelocityEffect effect="scale" :intensity="0.1" class="absolute top-1/2 right-1/3">
          <div class="w-48 h-48 bg-cyan-500/15 rounded-full blur-[50px]" />
        </MotionVelocityEffect>
      </div>

      <div class="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div
          class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-white/80 mb-8"
        >
          <UIcon name="i-lucide-train" />
          <span>Locomotive Scroll v5</span>
        </div>

        <MotionVelocityEffect
          effect="skew"
          :intensity="1.5"
          as="h1"
          class="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-8"
        >
          Deep Dive
        </MotionVelocityEffect>

        <p class="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
          Everything you need to know about smooth scrolling, parallax effects, and scroll-linked
          animations
        </p>

        <div class="flex flex-wrap gap-4 justify-center">
          <MotionScrollLink to="#playground" :duration="1.5" as="span">
            <UButton size="xl"> Interactive Playground </UButton>
          </MotionScrollLink>
          <UButton size="xl" variant="outline" to="/motion"> Back to Motion Demo </UButton>
        </div>
      </div>

      <!-- Live stats panel -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl px-6 py-3"
      >
        <div class="flex gap-8 text-sm">
          <div class="text-center">
            <div class="text-gray-500 text-xs mb-1">VELOCITY</div>
            <div class="text-white font-bold tabular-nums">{{ velocity.toFixed(2) }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500 text-xs mb-1">PROGRESS</div>
            <div class="text-white font-bold tabular-nums">{{ (progress * 100).toFixed(0) }}%</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500 text-xs mb-1">DIRECTION</div>
            <div class="text-white font-bold">
              {{ direction > 0 ? 'DOWN' : direction < 0 ? 'UP' : 'IDLE' }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-gray-500 text-xs mb-1">SCROLL Y</div>
            <div class="text-white font-bold tabular-nums">{{ Math.round(scrollY) }}px</div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
        <UIcon name="i-lucide-chevron-down" class="text-3xl" />
      </div>
    </section>

    <!-- Features Overview -->
    <section id="features" class="py-32 bg-gray-900">
      <UContainer>
        <div class="text-center mb-20">
          <span class="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
            Built on Lenis
          </span>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">Core Features</h2>
          <p class="text-gray-400 text-xl max-w-2xl mx-auto">
            What makes Locomotive Scroll v5 the gold standard for smooth scrolling
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            class="bg-gray-800/50 backdrop-blur rounded-3xl p-8 text-center border border-gray-700/50 hover:border-primary/50 transition-colors"
          >
            <div
              class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <UIcon name="i-lucide-zap" class="text-4xl text-primary" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Native Performance</h3>
            <p class="text-gray-400">
              Uses native scroll with CSS transforms. No scroll hijacking, feels natural.
            </p>
          </div>

          <div
            class="bg-gray-800/50 backdrop-blur rounded-3xl p-8 text-center border border-gray-700/50 hover:border-purple-500/50 transition-colors"
          >
            <div
              class="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <UIcon name="i-lucide-gauge" class="text-4xl text-purple-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Velocity Tracking</h3>
            <p class="text-gray-400">
              Real-time scroll velocity for momentum-based effects and dynamic UI.
            </p>
          </div>

          <div
            class="bg-gray-800/50 backdrop-blur rounded-3xl p-8 text-center border border-gray-700/50 hover:border-cyan-500/50 transition-colors"
          >
            <div
              class="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <UIcon name="i-lucide-link" class="text-4xl text-cyan-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">GSAP Integration</h3>
            <p class="text-gray-400">
              Seamless ScrollTrigger proxy for advanced scroll-linked animations.
            </p>
          </div>

          <div
            class="bg-gray-800/50 backdrop-blur rounded-3xl p-8 text-center border border-gray-700/50 hover:border-pink-500/50 transition-colors"
          >
            <div
              class="w-20 h-20 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <UIcon name="i-lucide-smartphone" class="text-4xl text-pink-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Touch Optimized</h3>
            <p class="text-gray-400">Perfect touch and trackpad handling on all devices.</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Velocity Effects Showcase using MotionVelocityEffect -->
    <section class="py-32 bg-gray-950 overflow-hidden">
      <UContainer>
        <div class="text-center mb-20">
          <span class="text-purple-500 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Live Demo
          </span>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">Velocity Effects</h2>
          <p class="text-gray-400 text-xl">Using the MotionVelocityEffect component</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Skew Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Skew Transform</h3>
            <MotionVelocityEffect
              effect="skew"
              :intensity="3"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              SKEW
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="skew" :intensity="3"</code>
          </div>

          <!-- Scale Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Scale Transform</h3>
            <MotionVelocityEffect
              effect="scale"
              :intensity="0.12"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              SCALE
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="scale" :intensity="0.12"</code>
          </div>

          <!-- Blur Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Motion Blur</h3>
            <MotionVelocityEffect
              effect="blur"
              :intensity="1.5"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              BLUR
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="blur" :intensity="1.5"</code>
          </div>

          <!-- Opacity Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Opacity Fade</h3>
            <MotionVelocityEffect
              effect="opacity"
              :intensity="0.25"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              FADE
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="opacity" :intensity="0.25"</code>
          </div>

          <!-- Letter Spacing Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Letter Spacing</h3>
            <MotionVelocityEffect
              effect="letterSpacing"
              :intensity="6"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              SPACE
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">
              effect="letterSpacing" :intensity="6"
            </code>
          </div>

          <!-- Rotate Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Rotation</h3>
            <MotionVelocityEffect
              effect="rotate"
              :intensity="4"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              SPIN
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="rotate" :intensity="4"</code>
          </div>

          <!-- Color Shift Effect -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Hue Rotation</h3>
            <MotionVelocityEffect
              effect="hueRotate"
              :intensity="45"
              class="text-4xl md:text-5xl font-black text-primary text-center py-8"
            >
              COLOR
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="hueRotate" :intensity="45"</code>
          </div>

          <!-- Y Translation -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800 overflow-hidden">
            <h3 class="text-lg font-semibold text-gray-400 mb-6">Y Translation</h3>
            <MotionVelocityEffect
              effect="translateY"
              :intensity="8"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              SHIFT
            </MotionVelocityEffect>
            <code class="text-xs text-gray-500 block mt-4">effect="translateY" :intensity="8"</code>
          </div>

          <!-- Combined - manual for complex combinations -->
          <div
            class="bg-linear-to-br from-primary/20 to-purple-600/20 rounded-2xl p-8 border border-primary/30"
          >
            <h3 class="text-lg font-semibold text-primary mb-6">Combined (Manual)</h3>
            <MotionVelocityEffect
              effect="skew"
              :intensity="2"
              class="text-4xl md:text-5xl font-black text-white text-center py-8"
            >
              <MotionVelocityEffect effect="scale" :intensity="0.08" as="span">
                MIX
              </MotionVelocityEffect>
            </MotionVelocityEffect>
            <code class="text-xs text-gray-400 block mt-4">Nested components for combinations</code>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Interactive Playground -->
    <section id="playground" class="py-32 bg-gray-900">
      <UContainer>
        <div class="text-center mb-16">
          <span class="text-cyan-500 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Try It Out
          </span>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">Interactive Playground</h2>
          <p class="text-gray-400 text-xl">Explore the API and see code examples</p>
        </div>

        <!-- Tab Navigation -->
        <div class="flex flex-wrap justify-center gap-2 mb-12">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
            :class="
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            "
            @click="activeTab = tab.id"
          >
            <UIcon :name="tab.icon" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="max-w-5xl mx-auto">
          <!-- Velocity Effects Tab -->
          <div v-show="activeTab === 'velocity'" class="space-y-8">
            <div class="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
              <h3 class="text-2xl font-bold text-white mb-4">MotionVelocityEffect Component</h3>
              <p class="text-gray-400 mb-8">
                Wrap any content to apply velocity-based effects. Built-in smoothing for stable
                animations.
              </p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gray-900 rounded-xl p-6 text-center">
                  <p class="text-gray-500 text-sm mb-2">Velocity</p>
                  <p class="text-3xl font-bold text-primary tabular-nums">
                    {{ velocity.toFixed(2) }}
                  </p>
                </div>
                <div class="bg-gray-900 rounded-xl p-6 text-center">
                  <p class="text-gray-500 text-sm mb-2">Absolute</p>
                  <p class="text-3xl font-bold text-purple-500 tabular-nums">
                    {{ absVelocity.toFixed(2) }}
                  </p>
                </div>
                <div class="bg-gray-900 rounded-xl p-6 text-center">
                  <p class="text-gray-500 text-sm mb-2">Direction</p>
                  <p
                    class="text-3xl font-bold"
                    :class="
                      direction > 0
                        ? 'text-green-500'
                        : direction < 0
                          ? 'text-red-500'
                          : 'text-gray-600'
                    "
                  >
                    {{ direction > 0 ? 'DOWN' : direction < 0 ? 'UP' : '—' }}
                  </p>
                </div>
                <div class="bg-gray-900 rounded-xl p-6 text-center">
                  <p class="text-gray-500 text-sm mb-2">Scrolling</p>
                  <p
                    class="text-3xl font-bold"
                    :class="isScrolling ? 'text-green-500' : 'text-gray-600'"
                  >
                    {{ isScrolling ? 'YES' : 'NO' }}
                  </p>
                </div>
              </div>

              <pre
                class="bg-gray-950 rounded-xl p-6 overflow-x-auto text-sm"
              ><code class="text-gray-300">{{ codeExamples.velocityEffect }}</code></pre>
            </div>
          </div>

          <!-- Progress Tab -->
          <div v-show="activeTab === 'progress'" class="space-y-8">
            <div class="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
              <h3 class="text-2xl font-bold text-white mb-4">MotionScrollProgress Component</h3>
              <p class="text-gray-400 mb-8">
                Display scroll progress as linear or circular indicator.
              </p>

              <div class="flex flex-col md:flex-row items-center justify-center gap-12 mb-8">
                <!-- Circular using component -->
                <div class="text-center">
                  <MotionScrollProgress
                    type="circular"
                    :size="150"
                    :stroke-width="10"
                    class="text-white"
                  />
                  <p class="text-gray-500 text-sm mt-4">type="circular"</p>
                </div>

                <!-- Linear using component -->
                <div class="flex-1 max-w-md">
                  <MotionScrollProgress type="linear" :height="8" class="text-white" />
                  <p class="text-gray-500 text-sm mt-4 text-center">type="linear"</p>
                </div>
              </div>

              <pre
                class="bg-gray-950 rounded-xl p-6 overflow-x-auto text-sm"
              ><code class="text-gray-300">{{ codeExamples.progressBar }}</code></pre>
            </div>
          </div>

          <!-- Programmatic Tab -->
          <div v-show="activeTab === 'programmatic'" class="space-y-8">
            <div class="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
              <h3 class="text-2xl font-bold text-white mb-4">MotionScrollLink Component</h3>
              <p class="text-gray-400 mb-8">
                Create smooth scroll links to any element or position.
              </p>

              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MotionScrollLink to="0" :duration="1.5" as="span" class="block">
                  <UButton size="lg" block>
                    <UIcon name="i-lucide-arrow-up" class="mr-2" />
                    Top
                  </UButton>
                </MotionScrollLink>
                <MotionScrollLink to="#features" :duration="1" as="span" class="block">
                  <UButton size="lg" variant="outline" block>
                    <UIcon name="i-lucide-target" class="mr-2" />
                    Features
                  </UButton>
                </MotionScrollLink>
                <MotionScrollLink to="#parallax-demo" :duration="1.5" as="span" class="block">
                  <UButton size="lg" variant="outline" block>
                    <UIcon name="i-lucide-layers" class="mr-2" />
                    Parallax
                  </UButton>
                </MotionScrollLink>
                <MotionScrollLink :to="2000" :duration="2" as="span" class="block">
                  <UButton size="lg" variant="soft" block>
                    <UIcon name="i-lucide-arrow-down" class="mr-2" />
                    2000px
                  </UButton>
                </MotionScrollLink>
              </div>

              <pre
                class="bg-gray-950 rounded-xl p-6 overflow-x-auto text-sm"
              ><code class="text-gray-300">{{ codeExamples.scrollTo }}</code></pre>
            </div>
          </div>

          <!-- GSAP Tab -->
          <div v-show="activeTab === 'gsap'" class="space-y-8">
            <div class="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
              <h3 class="text-2xl font-bold text-white mb-4">MotionParallax Component</h3>
              <p class="text-gray-400 mb-8">
                Create GSAP-powered parallax effects with a simple component.
              </p>

              <div class="bg-gray-900 rounded-xl p-6 mb-8">
                <h4 class="text-lg font-semibold text-white mb-4">Props:</h4>
                <ul class="space-y-3 text-gray-400">
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
                class="bg-gray-950 rounded-xl p-6 overflow-x-auto text-sm"
              ><code class="text-gray-300">{{ codeExamples.gsapIntegration }}</code></pre>
            </div>
          </div>

          <!-- API Tab -->
          <div v-show="activeTab === 'api'" class="space-y-8">
            <div class="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
              <h3 class="text-2xl font-bold text-white mb-4">Available Components</h3>
              <p class="text-gray-400 mb-8">
                All motion layer components for scroll-linked animations.
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div class="bg-gray-900 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-primary mb-3">Velocity & Effects</h4>
                  <ul class="space-y-2 text-sm text-gray-400">
                    <li>
                      <code class="text-white">MotionVelocityEffect</code> - Velocity transforms
                    </li>
                    <li><code class="text-white">MotionParallax</code> - GSAP parallax</li>
                    <li><code class="text-white">MotionTextReveal</code> - Text animations</li>
                    <li><code class="text-white">MotionMarquee</code> - Scrolling marquee</li>
                  </ul>
                </div>
                <div class="bg-gray-900 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-purple-500 mb-3">Navigation & Progress</h4>
                  <ul class="space-y-2 text-sm text-gray-400">
                    <li><code class="text-white">MotionScrollLink</code> - Smooth scroll links</li>
                    <li>
                      <code class="text-white">MotionScrollProgress</code> - Progress indicators
                    </li>
                    <li><code class="text-white">MotionScrollStats</code> - Debug display</li>
                    <li><code class="text-white">MotionStaggered</code> - Staggered animations</li>
                  </ul>
                </div>
              </div>

              <pre
                class="bg-gray-950 rounded-xl p-6 overflow-x-auto text-sm"
              ><code class="text-gray-300">{{ codeExamples.composable }}</code></pre>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Parallax Demo using MotionParallax -->
    <section id="parallax-demo" class="py-32 bg-gray-950 overflow-hidden relative min-h-screen">
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Background layer (slowest) using MotionParallax -->
        <MotionParallax :speed="-0.4" :scale="0.1" class="absolute">
          <div class="text-[25vw] font-black text-gray-800/30 select-none whitespace-nowrap">
            PARALLAX
          </div>
        </MotionParallax>
      </div>

      <!-- Floating shapes using MotionParallax -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <MotionParallax :speed="0.3" :rotate="10" class="absolute top-[15%] left-[10%]">
          <div class="w-24 h-24 border-4 border-primary/40 rounded-full" />
        </MotionParallax>
        <MotionParallax :speed="-0.2" :rotate="-15" class="absolute top-[25%] right-[15%]">
          <div class="w-16 h-16 bg-purple-500/30 rotate-45" />
        </MotionParallax>
        <MotionParallax :speed="0.4" class="absolute bottom-[35%] left-[20%]">
          <div class="w-20 h-20 border-4 border-pink-500/40" />
        </MotionParallax>
        <MotionParallax :speed="-0.3" :rotate="20" class="absolute bottom-[20%] right-[25%]">
          <div class="w-28 h-28 border-4 border-cyan-500/30 rounded-full" />
        </MotionParallax>
        <MotionParallax :speed="0.2" class="absolute top-[40%] left-[40%]">
          <div class="w-12 h-12 bg-green-500/30 rounded-full" />
        </MotionParallax>
      </div>

      <!-- Middle layer content -->
      <MotionParallax :speed="-0.1" class="relative z-10">
        <UContainer>
          <div class="text-center py-32">
            <h2 class="text-5xl md:text-7xl font-bold text-white mb-6">MotionParallax</h2>
            <p class="text-xl text-gray-400 max-w-xl mx-auto mb-8">
              Multiple layers moving at different speeds using the MotionParallax component
            </p>
            <div
              class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-white/70"
            >
              <UIcon name="i-lucide-info" />
              Scroll slowly to see the effect
            </div>
          </div>
        </UContainer>
      </MotionParallax>

      <!-- Foreground blurs using MotionParallax -->
      <MotionParallax :speed="0.5" :scale="0.15" class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-[10%] w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
        <div
          class="absolute bottom-1/4 right-[15%] w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
        />
      </MotionParallax>
    </section>

    <!-- Progress Indicator Section using MotionScrollProgress -->
    <section class="py-32 bg-gray-900">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">MotionScrollProgress</h2>
            <p class="text-gray-400 text-lg">Circular and linear progress indicators</p>
          </div>

          <!-- Using MotionScrollProgress components -->
          <div class="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
            <MotionScrollProgress
              type="circular"
              :size="192"
              :stroke-width="8"
              class="text-white"
            />
            <div class="flex-1 max-w-md">
              <MotionScrollProgress type="linear" :height="12" show-percentage class="text-white" />
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Footer -->
    <section class="py-20 bg-gray-950">
      <UContainer>
        <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-white mb-3">Locomotive Scroll v5</h2>
            <p class="text-gray-400 text-lg">Smooth scrolling for the modern web</p>
          </div>
          <div class="flex gap-4">
            <UButton size="lg" variant="outline" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Demo
            </UButton>
            <MotionScrollLink to="0" :duration="2" as="span">
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
