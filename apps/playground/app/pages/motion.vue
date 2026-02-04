<script setup lang="ts">
/* eslint-disable vue/prefer-true-attribute-shorthand */
useSeoMeta({
  title: 'Motion Layer Demo',
  description: 'GSAP animations + Locomotive Scroll demos',
})

const { gsap, ScrollTrigger } = useGsap()
const { scrollTo, scrollToTop, velocity, progress } = useSmoothScroll()

// Refs for animations
const heroTextRef = ref<HTMLElement | null>(null)
const scrollTriggerBox = ref<HTMLElement | null>(null)
const parallaxSection = ref<HTMLElement | null>(null)
const parallaxDeep = ref<HTMLElement | null>(null)
const parallaxBg = ref<HTMLElement | null>(null)
const parallaxShapes = ref<HTMLElement | null>(null)
const parallaxMid = ref<HTMLElement | null>(null)
const parallaxFg = ref<HTMLElement | null>(null)
const pinnedSection = ref<HTMLElement | null>(null)
const pinnedContent = ref<HTMLElement | null>(null)
const scrubSection = ref<HTMLElement | null>(null)
const scrubProgress = ref<HTMLElement | null>(null)
const velocityText = ref<HTMLElement | null>(null)
const horizontalSection = ref<HTMLElement | null>(null)
const horizontalTrack = ref<HTMLElement | null>(null)
const staggeredCards = ref<HTMLElement | null>(null)

// Declarative parallax section refs
const declParallaxSection = ref<HTMLElement | null>(null)
const declParallaxBg = ref<HTMLElement | null>(null)
const declParallaxBlur = ref<HTMLElement | null>(null)
const declParallaxContent = ref<HTMLElement | null>(null)

// State
const reducedMotion = ref(false)

onMounted(() => {
  // Check reduced motion preference
  if (import.meta.client) {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Hero text animation
  if (heroTextRef.value) {
    gsap.from(heroTextRef.value.querySelectorAll('.hero-word'), {
      y: 100,
      opacity: 0,
      rotateX: -80,
      stagger: 0.1,
      duration: 1.2,
      ease: 'power3.out',
    })
  }

  // Staggered cards
  if (staggeredCards.value) {
    const cards = staggeredCards.value.querySelectorAll('.stagger-card')
    gsap.from(cards, {
      scrollTrigger: {
        trigger: staggeredCards.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }

  // Large scroll trigger box
  if (scrollTriggerBox.value) {
    gsap.from(scrollTriggerBox.value, {
      scrollTrigger: {
        trigger: scrollTriggerBox.value,
        start: 'top 85%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'power3.out',
    })
  }

  // Parallax effect - multiple layers at different speeds
  if (parallaxSection.value) {
    const parallaxTrigger = {
      trigger: parallaxSection.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
    }

    // Deep background (slowest - moves up slightly)
    if (parallaxDeep.value) {
      gsap.to(parallaxDeep.value, {
        scrollTrigger: parallaxTrigger,
        y: -100,
        scale: 1.1,
        ease: 'none',
      })
    }

    // Background text (slow)
    if (parallaxBg.value) {
      gsap.to(parallaxBg.value, {
        scrollTrigger: parallaxTrigger,
        y: -300,
        ease: 'none',
      })
    }

    // Floating shapes (medium speed + rotation)
    if (parallaxShapes.value) {
      gsap.to(parallaxShapes.value, {
        scrollTrigger: parallaxTrigger,
        y: -150,
        rotation: 15,
        ease: 'none',
      })
    }

    // Middle content (subtle movement)
    if (parallaxMid.value) {
      gsap.to(parallaxMid.value, {
        scrollTrigger: parallaxTrigger,
        y: -50,
        ease: 'none',
      })
    }

    // Foreground blurs (fastest - moves down)
    if (parallaxFg.value) {
      gsap.to(parallaxFg.value, {
        scrollTrigger: parallaxTrigger,
        y: 200,
        scale: 1.2,
        ease: 'none',
      })
    }
  }

  // Pinned section with scroll-linked card reveals
  if (pinnedSection.value && pinnedContent.value) {
    const cards = pinnedContent.value.querySelectorAll('.pinned-card')
    const totalCards = cards.length

    // Create the pin
    const pinTrigger = ScrollTrigger.create({
      trigger: pinnedSection.value,
      start: 'top top',
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      pinSpacing: true,
    })

    // Animate each card based on pin progress
    cards.forEach((card, i) => {
      // Set initial state
      gsap.set(card, { opacity: 0, y: 60, scale: 0.9 })

      // Calculate when this card should animate (spread across the pin duration)
      const startProgress = i / totalCards
      const endProgress = (i + 0.5) / totalCards

      gsap.to(card, {
        scrollTrigger: {
          trigger: pinnedSection.value,
          start: 'top top',
          end: `+=${window.innerHeight * 2}`,
          scrub: 0.5,
        },
        keyframes: [
          { opacity: 0, y: 60, scale: 0.9, duration: startProgress },
          { opacity: 1, y: 0, scale: 1, duration: endProgress - startProgress },
          { opacity: 1, y: 0, scale: 1, duration: 1 - endProgress },
        ],
        ease: 'none',
      })
    })
  }

  // Scrub progress animation - progress bar fills as you scroll through section
  if (scrubSection.value && scrubProgress.value) {
    // Set initial state
    gsap.set(scrubProgress.value, { scaleX: 0, transformOrigin: 'left center' })

    gsap.to(scrubProgress.value, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: scrubSection.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.3,
        // markers: true, // Uncomment to debug
      },
    })
  }

  // Velocity-based text skew - reacts to scroll speed
  if (velocityText.value) {
    watch(velocity, (vel) => {
      if (!velocityText.value) return
      // Skew based on velocity: faster scroll = more skew
      const skewAmount = Math.max(-20, Math.min(20, vel * 3))
      gsap.to(velocityText.value, {
        skewX: skewAmount,
        duration: 0.2,
        ease: 'power2.out',
      })
    })
  }

  // Horizontal scroll section
  if (horizontalSection.value && horizontalTrack.value) {
    const track = horizontalTrack.value
    const trackWidth = track.scrollWidth - window.innerWidth

    gsap.to(track, {
      scrollTrigger: {
        trigger: horizontalSection.value,
        start: 'top top',
        end: `+=${trackWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
      x: -trackWidth,
      ease: 'none',
    })
  }

  // Declarative parallax section (GSAP-based since data-scroll needs LS5 config)
  if (declParallaxSection.value) {
    const declTrigger = {
      trigger: declParallaxSection.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
    }

    if (declParallaxBg.value) {
      gsap.to(declParallaxBg.value, {
        scrollTrigger: declTrigger,
        y: -100,
        scale: 1.1,
        ease: 'none',
      })
    }

    if (declParallaxBlur.value) {
      gsap.to(declParallaxBlur.value, {
        scrollTrigger: declTrigger,
        y: 80,
        scale: 1.2,
        ease: 'none',
      })
    }

    if (declParallaxContent.value) {
      gsap.to(declParallaxContent.value, {
        scrollTrigger: declTrigger,
        y: -40,
        ease: 'none',
      })
    }
  }
})

function scrollToSection(selector: string) {
  scrollTo(selector, { offset: -20, duration: 1.5 })
}

const marqueeItems = ['GSAP', '✦', 'SCROLL', '✦', 'MOTION', '✦', 'ANIMATE', '✦', 'LAYERS', '✦']
const marqueeItemsAlt = ['PARALLAX', '•', 'PINNING', '•', 'SCRUB', '•', 'VELOCITY', '•']
</script>

<template>
  <div class="motion-page">
    <!-- Hero Section -->
    <section
      class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950"
    >
      <div class="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />

      <div class="text-center z-10 px-4">
        <h1
          ref="heroTextRef"
          class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 perspective-1000"
        >
          <span class="hero-word inline-block">MOTION</span>
          <br />
          <span class="hero-word inline-block text-primary">LAYER</span>
        </h1>
        <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          GSAP + Locomotive Scroll v5. Parallax, pinning, scrub animations, and velocity-based
          effects.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" @click="scrollToSection('#demos')"> View Demos </UButton>
          <UButton size="lg" variant="outline" to="/"> Back Home </UButton>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <UIcon name="i-lucide-chevron-down" class="text-3xl" />
      </div>
    </section>

    <!-- Marquee Section - Velocity Reactive -->
    <section class="py-0 bg-primary text-white overflow-hidden">
      <MotionMarquee
        :speed="80"
        direction="left"
        :pause-on-hover="false"
        gap="3rem"
        :velocity-based="true"
        :velocity-sensitivity="0.8"
        :max-speed="4"
      >
        <span
          v-for="(item, i) in marqueeItems"
          :key="i"
          class="text-4xl md:text-6xl font-black whitespace-nowrap"
        >
          {{ item }}
        </span>
      </MotionMarquee>
    </section>

    <!-- Scroll Velocity Display -->
    <div
      class="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-mono text-sm"
    >
      <div>Velocity: {{ velocity.toFixed(2) }}</div>
      <div>Progress: {{ (progress * 100).toFixed(1) }}%</div>
    </div>

    <!-- Demos Section -->
    <section id="demos" class="py-24 bg-gray-900">
      <UContainer>
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Animation Demos</h2>
          <p class="text-gray-400 text-lg">Scroll down to trigger each animation</p>
        </div>

        <!-- Large Scroll Trigger Box -->
        <div class="mb-32">
          <h3 class="text-2xl font-bold text-white mb-8 text-center">Scroll Trigger</h3>
          <div
            ref="scrollTriggerBox"
            class="h-[50vh] min-h-[400px] bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25"
          >
            <div class="text-center text-white p-8">
              <UIcon name="i-lucide-sparkles" class="text-6xl mb-4" />
              <h3 class="text-4xl md:text-5xl font-bold mb-4">Scroll Triggered</h3>
              <p class="text-xl text-white/80">This box animates in when you scroll to it</p>
            </div>
          </div>
        </div>

        <!-- Staggered Cards -->
        <div class="mb-32">
          <h3 class="text-2xl font-bold text-white mb-8 text-center">Staggered Animation</h3>
          <div ref="staggeredCards" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="i in 8"
              :key="i"
              class="stagger-card aspect-square bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-4xl font-bold text-white border border-gray-700"
            >
              {{ i }}
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Parallax Section -->
    <section ref="parallaxSection" class="h-[200vh] relative overflow-hidden bg-gray-950">
      <div class="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <!-- Deep background layer (slowest) -->
        <div ref="parallaxDeep" class="absolute inset-0 flex items-center justify-center">
          <div class="text-[40vw] font-black text-gray-900/50 select-none">DEEP</div>
        </div>

        <!-- Background layer -->
        <div ref="parallaxBg" class="absolute inset-0 flex items-center justify-center">
          <div class="text-[25vw] font-black text-gray-800 select-none">PARALLAX</div>
        </div>

        <!-- Floating shapes layer -->
        <div ref="parallaxShapes" class="absolute inset-0 pointer-events-none">
          <div
            class="absolute top-[10%] left-[10%] w-24 h-24 border-4 border-primary/40 rounded-full"
          />
          <div class="absolute top-[20%] right-[15%] w-16 h-16 bg-purple-500/30 rotate-45" />
          <div class="absolute bottom-[30%] left-[20%] w-20 h-20 border-4 border-pink-500/40" />
          <div
            class="absolute bottom-[15%] right-[25%] w-32 h-32 border-4 border-blue-500/30 rounded-full"
          />
        </div>

        <!-- Middle layer (content) -->
        <div ref="parallaxMid" class="relative z-10 text-center px-4">
          <h2 class="text-5xl md:text-8xl font-bold text-white mb-4">Parallax Layers</h2>
          <p class="text-xl md:text-2xl text-gray-400">
            Multiple layers moving at different speeds
          </p>
        </div>

        <!-- Foreground blur layer (fastest) -->
        <div ref="parallaxFg" class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/4 left-[10%] w-40 h-40 bg-primary/40 rounded-full blur-3xl" />
          <div class="absolute top-1/3 right-[5%] w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl" />
          <div
            class="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-500/40 rounded-full blur-3xl"
          />
          <div
            class="absolute bottom-1/3 left-1/4 w-24 h-24 bg-pink-500/30 rounded-full blur-2xl"
          />
        </div>
      </div>
    </section>

    <!-- Reverse Marquee - Direction changes with scroll -->
    <section class="py-0 bg-white text-black overflow-hidden">
      <MotionMarquee
        :speed="60"
        direction="right"
        :pause-on-hover="false"
        gap="2rem"
        :velocity-sensitivity="1"
        :min-speed="0.3"
        :max-speed="3"
        :velocity-based="true"
        :velocity-direction="true"
      >
        <span
          v-for="(item, i) in marqueeItemsAlt"
          :key="i"
          class="text-3xl md:text-5xl font-black whitespace-nowrap"
        >
          {{ item }}
        </span>
      </MotionMarquee>
    </section>

    <!-- Pinned Section -->
    <section ref="pinnedSection" class="h-screen bg-gray-900 relative">
      <div ref="pinnedContent" class="h-full flex items-center justify-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 max-w-6xl">
          <div
            v-for="(item, i) in ['Reveal', 'As You', 'Scroll', 'Down']"
            :key="i"
            class="pinned-card aspect-square bg-linear-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center p-8"
          >
            <span class="text-2xl md:text-4xl font-bold text-white text-center">{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-center">
        <p class="text-sm">Section is pinned - keep scrolling</p>
      </div>
    </section>

    <!-- Scrub Progress Section -->
    <section ref="scrubSection" class="py-32 bg-gray-950">
      <UContainer>
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Scrub Animation</h2>
          <p class="text-gray-400 text-lg">Progress tied directly to scroll position</p>
        </div>

        <!-- Progress bar -->
        <div class="h-4 bg-gray-800 rounded-full overflow-hidden mb-16">
          <div
            ref="scrubProgress"
            class="h-full bg-linear-to-r from-primary via-purple-500 to-pink-500 origin-left scale-x-0"
          />
        </div>

        <!-- Scrub animated elements -->
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="i in 3"
            :key="i"
            class="h-64 bg-gray-800 rounded-2xl flex items-center justify-center"
          >
            <span class="text-6xl font-bold text-gray-600">{{ i }}</span>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Velocity-based Text Section -->
    <section class="py-32 bg-black overflow-hidden">
      <div ref="velocityText" class="text-center">
        <h2 class="text-6xl md:text-8xl lg:text-[12rem] font-black text-white leading-none">
          VELOCITY
        </h2>
        <p class="text-gray-500 mt-8 text-lg">Text skews based on scroll velocity</p>
      </div>
    </section>

    <!-- Large Text Marquee - High velocity response -->

    <section class="py-8 bg-gray-950 overflow-hidden">
      <MotionMarquee
        :speed="30"
        direction="left"
        :pause-on-hover="true"
        :velocity-based="true"
        gap="4rem"
        :velocity-sensitivity="1.5"
        :max-speed="6"
      >
        <span
          class="text-8xl md:text-[12rem] font-black text-transparent stroke-text whitespace-nowrap"
        >
          SMOOTH SCROLL
        </span>
      </MotionMarquee>
    </section>

    <!-- Horizontal Scroll Section -->
    <section
      id="horizontal-section"
      ref="horizontalSection"
      class="h-screen bg-gray-900 overflow-hidden"
    >
      <div ref="horizontalTrack" class="h-full flex items-center">
        <div
          v-for="i in 6"
          :key="i"
          class="shrink-0 w-[80vw] md:w-[50vw] h-[70vh] mx-8 first:ml-[10vw] last:mr-[10vw]"
        >
          <div
            class="w-full h-full rounded-3xl flex items-center justify-center text-white"
            :class="[
              i % 3 === 1 ? 'bg-linear-to-br from-blue-600 to-blue-800' : '',
              i % 3 === 2 ? 'bg-linear-to-br from-purple-600 to-purple-800' : '',
              i % 3 === 0 ? 'bg-linear-to-br from-pink-600 to-pink-800' : '',
            ]"
          >
            <div class="text-center p-8">
              <h3 class="text-4xl md:text-6xl font-bold mb-4">Panel {{ i }}</h3>
              <p class="text-xl text-white/70">Horizontal scroll with pinning</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Text Reveal Section -->
    <section class="py-32 bg-gray-950">
      <UContainer>
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-8">
            <MotionTextReveal text="Text Reveal Animation" type="chars" :stagger="0.02" />
          </h2>
          <p class="text-xl text-gray-400">
            <MotionTextReveal
              text="Each character animates in sequence as you scroll into view"
              type="words"
              :stagger="0.05"
              :duration="0.6"
            />
          </p>
        </div>
      </UContainer>
    </section>

    <!-- GSAP Parallax Demo Section -->
    <section ref="declParallaxSection" class="py-32 bg-gray-900 overflow-hidden">
      <UContainer>
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">GSAP Parallax</h2>
          <p class="text-gray-400 text-lg">Multi-layer parallax using GSAP ScrollTrigger</p>
        </div>

        <div class="relative h-[60vh] flex items-center justify-center">
          <!-- Slow background text -->
          <div
            ref="declParallaxBg"
            class="absolute text-[20vw] font-black text-gray-800/30 select-none"
          >
            SCROLL
          </div>

          <!-- Foreground blur -->
          <div
            ref="declParallaxBlur"
            class="absolute w-48 h-48 bg-primary/30 rounded-full blur-3xl"
          />

          <!-- Center content -->
          <div ref="declParallaxContent" class="relative z-10 text-center">
            <p class="text-2xl md:text-3xl text-white font-bold mb-4">
              Layers move at different speeds
            </p>
            <p class="text-gray-400">Scroll slowly to see the effect</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Locomotive Scroll Features Showcase -->
    <section class="py-40 bg-gray-950">
      <UContainer>
        <div class="text-center mb-24">
          <div
            class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <UIcon name="i-lucide-train" class="text-lg" />
            <span>Locomotive Scroll v5</span>
          </div>
          <h2 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Smooth Scrolling Features
          </h2>
          <p class="text-gray-400 text-xl max-w-3xl mx-auto mb-10">
            Native-feeling smooth scroll with declarative parallax, scroll direction detection, and
            buttery performance
          </p>
          <UButton to="/locomotive-scroll" variant="outline" size="xl">
            <UIcon name="i-lucide-book-open" class="mr-2" />
            Deep Dive Guide
          </UButton>
        </div>

        <!-- Feature Cards Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <!-- Feature 1: Smooth Scroll -->
          <div
            class="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-lucide-mouse-pointer-click" class="text-2xl text-primary" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Native Smooth Scroll</h3>
            <p class="text-gray-400 mb-4">
              Buttery smooth scrolling using native browser APIs. No hijacking — feels natural on
              all devices.
            </p>
            <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              useSmoothScroll()
            </code>
          </div>

          <!-- Feature 2: Data Attributes -->
          <div
            class="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div
              class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6"
            >
              <UIcon name="i-lucide-code" class="text-2xl text-purple-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Declarative Parallax</h3>
            <p class="text-gray-400 mb-4">
              No JavaScript needed. Just add data-scroll attributes to any element for instant
              parallax effects.
            </p>
            <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              data-scroll-speed="-0.5"
            </code>
          </div>

          <!-- Feature 3: Velocity -->
          <div
            class="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div class="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-lucide-gauge" class="text-2xl text-pink-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Scroll Velocity</h3>
            <p class="text-gray-400 mb-4">
              Reactive velocity tracking. Create momentum-based effects that respond to scroll
              speed.
            </p>
            <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              velocity: {{ velocity.toFixed(2) }}
            </code>
          </div>

          <!-- Feature 4: Progress -->
          <div
            class="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div class="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-lucide-percent" class="text-2xl text-cyan-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Scroll Progress</h3>
            <p class="text-gray-400 mb-4">
              Track global scroll progress for page indicators, progress bars, and scroll-linked
              animations.
            </p>
            <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              progress: {{ (progress * 100).toFixed(0) }}%
            </code>
          </div>

          <!-- Feature 5: Programmatic Control -->
          <div
            class="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-lucide-navigation" class="text-2xl text-amber-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Programmatic Scroll</h3>
            <p class="text-gray-400 mb-4">
              Smooth scroll to any element or position with custom duration and easing curves.
            </p>
            <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              scrollTo('#section')
            </code>
          </div>

          <!-- Feature 6: GSAP Integration -->
          <div
            class="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-lucide-link" class="text-2xl text-green-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">GSAP ScrollTrigger</h3>
            <p class="text-gray-400 mb-4">
              Seamless integration with GSAP ScrollTrigger. Pin, scrub, and animate with precision.
            </p>
            <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded"> scrollerProxy </code>
          </div>
        </div>

        <!-- Interactive Demo Area -->
        <div class="relative">
          <div class="text-center mb-12">
            <h3 class="text-2xl font-bold text-white mb-2">Try It</h3>
            <p class="text-gray-400">Click the buttons to see programmatic scrolling</p>
          </div>

          <div class="flex flex-wrap gap-4 justify-center">
            <UButton variant="outline" @click="scrollTo('#demos', { duration: 1.5 })">
              <UIcon name="i-lucide-arrow-up" class="mr-2" />
              Scroll to Demos
            </UButton>
            <UButton variant="outline" @click="scrollTo('#horizontal-section', { duration: 2 })">
              <UIcon name="i-lucide-move-horizontal" class="mr-2" />
              Horizontal Section
            </UButton>
            <UButton @click="scrollToTop({ duration: 2.5 })">
              <UIcon name="i-lucide-arrow-up-to-line" class="mr-2" />
              Back to Top
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Data Attributes Reference -->
    <section class="py-24 bg-gray-900">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <h3 class="text-3xl font-bold text-white mb-8 text-center">Data Attribute Reference</h3>

          <div class="grid gap-4">
            <div class="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <code class="text-primary font-mono text-sm whitespace-nowrap">data-scroll</code>
              <span class="text-gray-400 flex-1">Enable scroll detection on element</span>
            </div>
            <div class="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <code class="text-primary font-mono text-sm whitespace-nowrap">
                data-scroll-speed="-0.5"
              </code>
              <span class="text-gray-400 flex-1">
                Parallax speed (negative = slower, positive = faster)
              </span>
            </div>
            <div class="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <code class="text-primary font-mono text-sm whitespace-nowrap">
                data-scroll-direction="horizontal"
              </code>
              <span class="text-gray-400 flex-1">Parallax direction (vertical by default)</span>
            </div>
            <div class="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <code class="text-primary font-mono text-sm whitespace-nowrap">
                data-scroll-position="top,bottom"
              </code>
              <span class="text-gray-400 flex-1">When to start/end the parallax effect</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Final Marquee -->
    <section class="py-4 bg-primary overflow-hidden">
      <MotionMarquee :speed="100" direction="left" :pause-on-hover="false" gap="2rem">
        <span v-for="i in 10" :key="i" class="text-2xl font-bold text-white/90 whitespace-nowrap">
          BUILT WITH GSAP + LOCOMOTIVE SCROLL ✦
        </span>
      </MotionMarquee>
    </section>

    <!-- Footer Navigation -->
    <section class="py-16 bg-gray-950">
      <UContainer>
        <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">Motion Layer</h2>
            <p class="text-gray-400">GSAP + Locomotive Scroll for professional animations</p>
          </div>
          <div class="flex gap-4">
            <UButton variant="outline" @click="scrollToTop({ duration: 2 })"> Back to Top </UButton>
            <UButton to="/"> Home </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
/* stylelint-disable function-disallowed-list */
.perspective-1000 {
  perspective: 1000px;
}

.stroke-text {
  -webkit-text-stroke: 2px rgb(255 255 255 / 0.3);
}

@media (width >= 768px) {
  .stroke-text {
    -webkit-text-stroke: 4px rgb(255 255 255 / 0.3);
  }
}
</style>
