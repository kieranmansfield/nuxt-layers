<script setup lang="ts">
  definePageMeta({ layout: false })

  const { setPageAccent } = useAccentColor()
  setPageAccent('emerald')
  onUnmounted(() => setPageAccent(null))

  const { gsap } = useGsap()
  const { scrollTo, scrollToTop, velocity, progress } = useSmoothScroll()

  // Refs for animations
  const parallaxSection = useTemplateRef<HTMLElement>('parallaxSection')
  const parallaxDeep = useTemplateRef<HTMLElement>('parallaxDeep')
  const parallaxBg = useTemplateRef<HTMLElement>('parallaxBg')
  const parallaxShapes = useTemplateRef<HTMLElement>('parallaxShapes')
  const parallaxMid = useTemplateRef<HTMLElement>('parallaxMid')
  const parallaxFg = useTemplateRef<HTMLElement>('parallaxFg')
  const scrubSection = useTemplateRef<HTMLElement>('scrubSection')
  const scrubProgress = useTemplateRef<HTMLElement>('scrubProgress')
  const velocityText = useTemplateRef<HTMLElement>('velocityText')

  // State
  const reducedMotion = ref(false)

  onMounted(() => {
    // Check reduced motion preference
    if (import.meta.client) {
      reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  })

  function scrollToSection(selector: string) {
    scrollTo(selector, { offset: -20, duration: 1.5 })
  }

  const marqueeItems = ['GSAP', '✦', 'SCROLL', '✦', 'MOTION', '✦', 'ANIMATE', '✦', 'LAYERS', '✦']
  const marqueeItemsAlt = ['PARALLAX', '•', 'PINNING', '•', 'SCRUB', '•', 'VELOCITY', '•']
</script>

<template>
  <LayoutPage title="Motion Layer Demo" description="GSAP animations + Locomotive Scroll v5">
    <div class="motion-page">
      <!-- Hero Section -->
      <section
        class="bg-default relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div
          class="from-primary/10 absolute inset-0 bg-linear-to-b via-transparent to-transparent"
        />

        <div class="z-10 px-4 text-center">
          <h1
            class="text-highlighted perspective-1000 mb-8 text-5xl font-black sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span
              v-gsap.from="{ y: 100, opacity: 0, rotateX: -80, duration: 1.2, ease: 'power3.out' }"
              class="hero-word inline-block"
            >
              MOTION
            </span>
            <br />
            <span
              v-gsap.delay-100.from="{
                y: 100,
                opacity: 0,
                rotateX: -80,
                duration: 1.2,
                ease: 'power3.out',
              }"
              class="hero-word text-primary inline-block"
            >
              LAYER
            </span>
          </h1>
          <p class="text-muted mx-auto mb-12 max-w-2xl text-xl">
            GSAP + Locomotive Scroll v5. Parallax, pinning, scrub animations, and velocity-based
            effects.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <UButton size="lg" @click="() => scrollToSection('#demos')"> View Demos </UButton>
            <UButton size="lg" variant="outline" to="/"> Back Home </UButton>
            <UButton size="lg" variant="ghost" to="/gsap">
              <UIcon name="i-lucide-zap" class="mr-2" />
              GSAP Guide
            </UButton>
            <UButton size="lg" variant="ghost" to="/locomotive-scroll">
              <UIcon name="i-lucide-train" class="mr-2" />
              Locomotive Scroll
            </UButton>
            <UButton size="lg" variant="ghost" to="/marquee-text">
              <UIcon name="i-lucide-text" class="mr-2" />
              Marquee Text
            </UButton>
            <UButton size="lg" variant="ghost" to="/motion-interactions">
              <UIcon name="i-lucide-mouse-pointer-2" class="mr-2" />
              Interactions
            </UButton>
            <UButton size="lg" variant="ghost" to="/scrollytelling">
              <UIcon name="i-lucide-book-open-text" class="mr-2" />
              Scrollytelling
            </UButton>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="text-highlighted/50 absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <UIcon name="i-lucide-chevron-down" class="text-3xl" />
        </div>
      </section>

      <!-- Marquee Section - Velocity Reactive -->
      <section class="bg-primary text-highlighted overflow-hidden py-0">
        <MotionMarquee
          :speed="80"
          direction="left"
          :pause-on-hover="false"
          gap="3rem"
          velocity-based
          :velocity-sensitivity="0.8"
          :max-speed="4"
        >
          <span
            v-for="(item, i) in marqueeItems"
            :key="i"
            class="text-4xl font-black whitespace-nowrap md:text-6xl"
          >
            {{ item }}
          </span>
        </MotionMarquee>
      </section>

      <!-- Scroll Velocity Display -->
      <div
        class="text-highlighted fixed top-4 right-4 z-50 rounded-lg bg-black/80 px-4 py-2 font-mono text-sm"
      >
        <div>Velocity: {{ velocity.toFixed(2) }}</div>
        <div>Progress: {{ (progress * 100).toFixed(1) }}%</div>
      </div>

      <!-- Demos Section -->
      <section id="demos" class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">Animation Demos</h2>
            <p class="text-muted text-lg">Scroll down to trigger each animation</p>
          </div>

          <!-- Large Scroll Trigger Box -->
          <div class="mb-32">
            <h3 class="text-highlighted mb-8 text-center text-2xl font-bold">Scroll Trigger</h3>
            <div
              v-gsap.whenVisible.once.from="{
                y: 100,
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: 'power3.out',
              }"
              class="flex h-[50vh] min-h-100 items-center justify-center rounded-3xl bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-purple-500/25"
            >
              <div class="text-highlighted p-8 text-center">
                <UIcon name="i-lucide-sparkles" class="mb-4 text-6xl" />
                <h3 class="mb-4 text-4xl font-bold md:text-5xl">Scroll Triggered</h3>
                <p class="text-highlighted/80 text-xl">
                  This box animates in when you scroll to it
                </p>
              </div>
            </div>
          </div>

          <!-- Staggered Cards -->
          <div class="mb-32">
            <h3 class="text-highlighted mb-8 text-center text-2xl font-bold">
              Staggered Animation
            </h3>
            <div
              v-gsap.whenVisible.once.stagger.from="{
                y: 50,
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
              }"
              class="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              <div
                v-for="i in 8"
                :key="i"
                class="stagger-card text-highlighted border-accented flex aspect-square items-center justify-center rounded-2xl border bg-linear-to-br from-[var(--ui-bg-accented)] to-[var(--ui-bg-muted)] text-4xl font-bold"
              >
                {{ i }}
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Parallax Section -->
      <section ref="parallaxSection" class="bg-default relative h-[200vh] overflow-hidden">
        <div class="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <!-- Deep background layer (slowest) -->
          <div ref="parallaxDeep" class="absolute inset-0 flex items-center justify-center">
            <div class="text-highlighted/50 text-[40vw] font-black select-none">DEEP</div>
          </div>

          <!-- Background layer -->
          <div ref="parallaxBg" class="absolute inset-0 flex items-center justify-center">
            <div class="text-default text-[25vw] font-black select-none">PARALLAX</div>
          </div>

          <!-- Floating shapes layer -->
          <div ref="parallaxShapes" class="pointer-events-none absolute inset-0">
            <div
              class="border-primary/40 absolute top-[10%] left-[10%] h-24 w-24 rounded-full border-4"
            />
            <div class="absolute top-[20%] right-[15%] h-16 w-16 rotate-45 bg-purple-500/30" />
            <div class="absolute bottom-[30%] left-[20%] h-20 w-20 border-4 border-pink-500/40" />
            <div
              class="absolute right-[25%] bottom-[15%] h-32 w-32 rounded-full border-4 border-blue-500/30"
            />
          </div>

          <!-- Middle layer (content) -->
          <div ref="parallaxMid" class="relative z-10 px-4 text-center">
            <h2 class="text-highlighted mb-4 text-5xl font-bold md:text-8xl">Parallax Layers</h2>
            <p class="text-muted text-xl md:text-2xl">Multiple layers moving at different speeds</p>
          </div>

          <!-- Foreground blur layer (fastest) -->
          <div ref="parallaxFg" class="pointer-events-none absolute inset-0">
            <div
              class="bg-primary/40 absolute top-1/4 left-[10%] h-40 w-40 rounded-full blur-3xl"
            />
            <div
              class="absolute top-1/3 right-[5%] h-32 w-32 rounded-full bg-cyan-500/30 blur-2xl"
            />
            <div
              class="absolute right-1/4 bottom-1/4 h-56 w-56 rounded-full bg-purple-500/40 blur-3xl"
            />
            <div
              class="absolute bottom-1/3 left-1/4 h-24 w-24 rounded-full bg-pink-500/30 blur-2xl"
            />
          </div>
        </div>
      </section>

      <!-- Reverse Marquee - Direction changes with scroll -->
      <section class="bg-default text-highlighted overflow-hidden py-0">
        <MotionMarquee
          :speed="60"
          direction="right"
          :pause-on-hover="false"
          gap="2rem"
          :velocity-sensitivity="1"
          :min-speed="0.3"
          :max-speed="3"
          velocity-based
          velocity-direction
        >
          <span
            v-for="(item, i) in marqueeItemsAlt"
            :key="i"
            class="text-3xl font-black whitespace-nowrap md:text-5xl"
          >
            {{ item }}
          </span>
        </MotionMarquee>
      </section>

      <!-- Pinned Section -->
      <MotionPinnedSection :duration="200" class="bg-default">
        <div class="grid max-w-6xl grid-cols-2 gap-8 px-8 md:grid-cols-4">
          <div
            v-for="(item, i) in ['Reveal', 'As You', 'Scroll', 'Down']"
            :key="i"
            class="from-primary flex aspect-square items-center justify-center rounded-3xl bg-linear-to-br to-purple-600 p-8"
          >
            <span class="text-highlighted text-center text-2xl font-bold md:text-4xl">{{
              item
            }}</span>
          </div>
        </div>
      </MotionPinnedSection>

      <!-- Scrub Progress Section -->
      <section ref="scrubSection" class="bg-default py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">Scrub Animation</h2>
            <p class="text-muted text-lg">Progress tied directly to scroll position</p>
          </div>

          <!-- Progress bar -->
          <div class="bg-accented mb-16 h-4 overflow-hidden rounded-full">
            <div
              ref="scrubProgress"
              class="from-primary h-full origin-left scale-x-0 bg-linear-to-r via-purple-500 to-pink-500"
            />
          </div>

          <!-- Scrub animated elements -->
          <div class="grid gap-8 md:grid-cols-3">
            <div
              v-for="i in 3"
              :key="i"
              class="bg-accented flex h-64 items-center justify-center rounded-2xl"
            >
              <span class="text-toned text-6xl font-bold">{{ i }}</span>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Velocity-based Text Section -->
      <section class="overflow-hidden bg-black py-32">
        <div ref="velocityText" class="text-center">
          <h2 class="text-highlighted text-6xl leading-none font-black md:text-8xl lg:text-[12rem]">
            VELOCITY
          </h2>
          <p class="text-muted mt-8 text-lg">Text skews based on scroll velocity</p>
        </div>
      </section>

      <!-- Large Text Marquee - High velocity response -->

      <section class="bg-default overflow-hidden py-8">
        <MotionMarquee
          :speed="30"
          direction="left"
          pause-on-hover
          velocity-based
          gap="4rem"
          :velocity-sensitivity="1.5"
          :max-speed="6"
        >
          <span
            class="stroke-text text-8xl font-black whitespace-nowrap text-transparent md:text-[12rem]"
          >
            SMOOTH SCROLL
          </span>
        </MotionMarquee>
      </section>

      <!-- Horizontal Scroll Section -->
      <MotionHorizontalScroll id="horizontal-section" class="bg-default">
        <div
          v-for="i in 6"
          :key="i"
          class="mx-8 h-[70vh] w-[80vw] shrink-0 first:ml-[10vw] last:mr-[10vw] md:w-[50vw]"
        >
          <div
            class="text-highlighted flex h-full w-full items-center justify-center rounded-3xl"
            :class="[
              i % 3 === 1 ? 'bg-linear-to-br from-blue-600 to-blue-800' : '',
              i % 3 === 2 ? 'bg-linear-to-br from-purple-600 to-purple-800' : '',
              i % 3 === 0 ? 'bg-linear-to-br from-pink-600 to-pink-800' : '',
            ]"
          >
            <div class="p-8 text-center">
              <h3 class="mb-4 text-4xl font-bold md:text-6xl">Panel {{ i }}</h3>
              <p class="text-highlighted/70 text-xl">Horizontal scroll with pinning</p>
            </div>
          </div>
        </div>
      </MotionHorizontalScroll>

      <!-- Text Reveal Section -->
      <section class="bg-default py-32">
        <UContainer>
          <div class="mx-auto max-w-4xl text-center">
            <h2 class="text-highlighted mb-8 text-4xl font-bold md:text-6xl">
              <MotionTextReveal text="Text Reveal Animation" type="chars" :stagger="0.02" />
            </h2>
            <p class="text-muted text-xl">
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
      <section class="bg-default overflow-hidden py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">GSAP Parallax</h2>
            <p class="text-muted text-lg">Multi-layer parallax using GSAP ScrollTrigger</p>
          </div>

          <div class="relative flex h-[60vh] items-center justify-center">
            <!-- Slow background text -->
            <div
              v-gsap.parallax.slower-3
              class="text-default/30 absolute text-[20vw] font-black select-none"
            >
              SCROLL
            </div>

            <!-- Foreground blur -->
            <div
              v-gsap.parallax.faster-2
              class="bg-primary/30 absolute h-48 w-48 rounded-full blur-3xl"
            />

            <!-- Center content -->
            <div v-gsap.parallax.slower-5 class="relative z-10 text-center">
              <p class="text-highlighted mb-4 text-2xl font-bold md:text-3xl">
                Layers move at different speeds
              </p>
              <p class="text-muted">Scroll slowly to see the effect</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Locomotive Scroll Features Showcase -->
      <section class="bg-default py-40">
        <UContainer>
          <div class="mb-24 text-center">
            <div
              class="bg-primary/10 text-primary mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <UIcon name="i-lucide-train" class="text-lg" />
              <span>Locomotive Scroll v5</span>
            </div>
            <h2 class="text-highlighted mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
              Smooth Scrolling Features
            </h2>
            <p class="text-muted mx-auto mb-10 max-w-3xl text-xl">
              Native-feeling smooth scroll with declarative parallax, scroll direction detection,
              and buttery performance
            </p>
            <UButton to="/locomotive-scroll" variant="outline" size="xl">
              <UIcon name="i-lucide-book-open" class="mr-2" />
              Deep Dive Guide
            </UButton>
          </div>

          <!-- Feature Cards Grid -->
          <div class="mb-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1: Smooth Scroll -->
            <div
              class="bg-muted border-default hover:border-primary/50 rounded-2xl border p-8 transition-colors"
            >
              <div class="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
                <UIcon name="i-lucide-mouse-pointer-click" class="text-primary text-2xl" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Native Smooth Scroll</h3>
              <p class="text-muted mb-4">
                Buttery smooth scrolling using native browser APIs. No hijacking — feels natural on
                all devices.
              </p>
              <code class="text-muted bg-accented rounded px-2 py-1 text-xs">
                useSmoothScroll()
              </code>
            </div>

            <!-- Feature 2: Data Attributes -->
            <div
              class="bg-muted border-default hover:border-primary/50 rounded-2xl border p-8 transition-colors"
            >
              <div
                class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10"
              >
                <UIcon name="i-lucide-code" class="text-2xl text-purple-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Declarative Parallax</h3>
              <p class="text-muted mb-4">
                No JavaScript needed. Just add data-scroll attributes to any element for instant
                parallax effects.
              </p>
              <code class="text-muted bg-accented rounded px-2 py-1 text-xs">
                data-scroll-speed="-0.5"
              </code>
            </div>

            <!-- Feature 3: Velocity -->
            <div
              class="bg-muted border-default hover:border-primary/50 rounded-2xl border p-8 transition-colors"
            >
              <div
                class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10"
              >
                <UIcon name="i-lucide-gauge" class="text-2xl text-pink-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Scroll Velocity</h3>
              <p class="text-muted mb-4">
                Reactive velocity tracking. Create momentum-based effects that respond to scroll
                speed.
              </p>
              <code class="text-muted bg-accented rounded px-2 py-1 text-xs">
                velocity: {{ velocity.toFixed(2) }}
              </code>
            </div>

            <!-- Feature 4: Progress -->
            <div
              class="bg-muted border-default hover:border-primary/50 rounded-2xl border p-8 transition-colors"
            >
              <div
                class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10"
              >
                <UIcon name="i-lucide-percent" class="text-2xl text-cyan-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Scroll Progress</h3>
              <p class="text-muted mb-4">
                Track global scroll progress for page indicators, progress bars, and scroll-linked
                animations.
              </p>
              <code class="text-muted bg-accented rounded px-2 py-1 text-xs">
                progress: {{ (progress * 100).toFixed(0) }}%
              </code>
            </div>

            <!-- Feature 5: Programmatic Control -->
            <div
              class="bg-muted border-default hover:border-primary/50 rounded-2xl border p-8 transition-colors"
            >
              <div
                class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10"
              >
                <UIcon name="i-lucide-navigation" class="text-2xl text-amber-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">Programmatic Scroll</h3>
              <p class="text-muted mb-4">
                Smooth scroll to any element or position with custom duration and easing curves.
              </p>
              <code class="text-muted bg-accented rounded px-2 py-1 text-xs">
                scrollTo('#section')
              </code>
            </div>

            <!-- Feature 6: GSAP Integration -->
            <div
              class="bg-muted border-default hover:border-primary/50 rounded-2xl border p-8 transition-colors"
            >
              <div
                class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10"
              >
                <UIcon name="i-lucide-link" class="text-2xl text-green-500" />
              </div>
              <h3 class="text-highlighted mb-3 text-xl font-bold">GSAP ScrollTrigger</h3>
              <p class="text-muted mb-4">
                Seamless integration with GSAP ScrollTrigger. Pin, scrub, and animate with
                precision.
              </p>
              <code class="text-muted bg-accented rounded px-2 py-1 text-xs"> scrollerProxy </code>
            </div>
          </div>

          <!-- Interactive Demo Area -->
          <div class="relative">
            <div class="mb-12 text-center">
              <h3 class="text-highlighted mb-2 text-2xl font-bold">Try It</h3>
              <p class="text-muted">Click the buttons to see programmatic scrolling</p>
            </div>

            <div class="flex flex-wrap justify-center gap-4">
              <UButton variant="outline" @click="() => scrollTo('#demos', { duration: 1.5 })">
                <UIcon name="i-lucide-arrow-up" class="mr-2" />
                Scroll to Demos
              </UButton>
              <UButton
                variant="outline"
                @click="() => scrollTo('#horizontal-section', { duration: 2 })"
              >
                <UIcon name="i-lucide-move-horizontal" class="mr-2" />
                Horizontal Section
              </UButton>
              <UButton @click="() => scrollToTop({ duration: 2.5 })">
                <UIcon name="i-lucide-arrow-up-to-line" class="mr-2" />
                Back to Top
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Data Attributes Reference -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mx-auto max-w-4xl">
            <h3 class="text-highlighted mb-8 text-center text-3xl font-bold">
              Data Attribute Reference
            </h3>

            <div class="grid gap-4">
              <div
                class="bg-accented flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center"
              >
                <code class="text-primary font-mono text-sm whitespace-nowrap">data-scroll</code>
                <span class="text-muted flex-1">Enable scroll detection on element</span>
              </div>
              <div
                class="bg-accented flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center"
              >
                <code class="text-primary font-mono text-sm whitespace-nowrap">
                  data-scroll-speed="-0.5"
                </code>
                <span class="text-muted flex-1">
                  Parallax speed (negative = slower, positive = faster)
                </span>
              </div>
              <div
                class="bg-accented flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center"
              >
                <code class="text-primary font-mono text-sm whitespace-nowrap">
                  data-scroll-direction="horizontal"
                </code>
                <span class="text-muted flex-1">Parallax direction (vertical by default)</span>
              </div>
              <div
                class="bg-accented flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center"
              >
                <code class="text-primary font-mono text-sm whitespace-nowrap">
                  data-scroll-position="top,bottom"
                </code>
                <span class="text-muted flex-1">When to start/end the parallax effect</span>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Final Marquee -->
      <section class="bg-primary overflow-hidden py-4">
        <MotionMarquee :speed="100" direction="left" :pause-on-hover="false" gap="2rem">
          <span
            v-for="i in 10"
            :key="i"
            class="text-highlighted/90 text-2xl font-bold whitespace-nowrap"
          >
            BUILT WITH GSAP + LOCOMOTIVE SCROLL ✦
          </span>
        </MotionMarquee>
      </section>

      <!-- Footer Navigation -->
      <section class="bg-default py-16">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 class="text-highlighted mb-2 text-2xl font-bold">Motion Layer</h2>
              <p class="text-muted">GSAP + Locomotive Scroll for professional animations</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/scrollytelling">
                <UIcon name="i-lucide-book-open-text" class="mr-2" />
                Scrollytelling
              </UButton>
              <UButton variant="ghost" to="/motion-interactions">
                <UIcon name="i-lucide-mouse-pointer-2" class="mr-2" />
                Interactions
              </UButton>
              <UButton variant="ghost" to="/gsap">
                <UIcon name="i-lucide-zap" class="mr-2" />
                GSAP
              </UButton>
              <UButton variant="ghost" to="/locomotive-scroll">
                <UIcon name="i-lucide-train" class="mr-2" />
                Locomotive Scroll
              </UButton>
              <UButton variant="ghost" to="/marquee-text">
                <UIcon name="i-lucide-text-cursor-input" class="mr-2" />
                MarqueeText
              </UButton>
              <UButton variant="outline" @click="() => scrollToTop({ duration: 2 })">
                Back to Top
              </UButton>
              <UButton to="/"> Home </UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
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
