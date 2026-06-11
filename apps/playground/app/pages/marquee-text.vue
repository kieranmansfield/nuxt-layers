<script setup lang="ts">
  definePageMeta({ layout: false })

  const { velocity, progress } = useSmoothScroll()
</script>

<!-- eslint-disable vue/prefer-true-attribute-shorthand -->
<template>
  <LayoutPage
    title="MarqueeText"
    description="Velocity-reactive text marquee with alternating rows and spring physics"
  >
    <div>
      <!-- Hero -->
      <section
        class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
        <div
          class="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent"
        />
        <div class="text-center z-10 px-4">
          <h1 class="text-6xl sm:text-8xl md:text-9xl font-black text-white mb-6">
            <span
              v-gsap.from="{ y: 120, opacity: 0, rotateX: -90, duration: 1.2, ease: 'power3.out' }"
              class="inline-block"
            >
              MARQUEE
            </span>
            <br />
            <span
              v-gsap.delay-100.from="{
                y: 120,
                opacity: 0,
                rotateX: -90,
                duration: 1.2,
                ease: 'power3.out',
              }"
              class="inline-block text-primary"
            >
              TEXT
            </span>
          </h1>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Scroll to see velocity-reactive marquees. Spring physics amplify scroll speed into
            marquee momentum — scroll fast to feel it.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton size="lg" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton size="lg" variant="outline" to="/">Home</UButton>
          </div>
        </div>
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <UIcon name="i-lucide-chevron-down" class="text-3xl" />
        </div>
      </section>

      <!-- Debug overlay -->
      <div
        class="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-3 rounded-lg font-mono text-xs space-y-1"
      >
        <div>Velocity: {{ velocity.toFixed(2) }}</div>
        <div>Progress: {{ (progress * 100).toFixed(1) }}%</div>
      </div>

      <!-- ─── Default: single row ────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Default</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">Single row</h2>
            <p class="text-gray-400">
              One repeating text row. Scroll to see velocity affect the speed.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText :texts="['MARQUEE TEXT ✦']" />
      </section>

      <!-- ─── Alternating rows ───────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Alternating</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">Multiple rows</h2>
            <p class="text-gray-400">
              Even-indexed rows scroll right, odd-indexed rows scroll left — automatically.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText :texts="['MARQUEE ✦', 'TEXT ✦', 'MOTION ✦']" />
      </section>

      <!-- ─── Speed comparison ───────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Speed</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">Velocity prop</h2>
            <p class="text-gray-400">
              The <code class="text-primary">velocity</code> prop sets the base pixels-per-second.
            </p>
          </div>
          <div class="space-y-12">
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">velocity: 30 — slow</p>
              <MotionMarqueeText :texts="['SLOW ✦']" :velocity="30" />
            </div>
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                velocity: 100 — default
              </p>
              <MotionMarqueeText :texts="['DEFAULT ✦']" :velocity="100" />
            </div>
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">velocity: 250 — fast</p>
              <MotionMarqueeText :texts="['FAST ✦']" :velocity="250" />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── Spring physics: damping ──────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Spring Physics</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">Damping &amp; stiffness</h2>
            <p class="text-gray-400 max-w-xl mx-auto">
              Scroll quickly past this section. High stiffness snaps velocity on fast; high damping
              bleeds it off slowly.
            </p>
          </div>
          <div class="space-y-12">
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                damping: 20, stiffness: 800 — snappy
              </p>
              <MotionMarqueeText :texts="['SNAPPY ✦']" :damping="20" :stiffness="800" />
            </div>
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                damping: 50, stiffness: 400 — default
              </p>
              <MotionMarqueeText :texts="['DEFAULT ✦']" :damping="50" :stiffness="400" />
            </div>
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                damping: 80, stiffness: 150 — heavy drag
              </p>
              <MotionMarqueeText :texts="['HEAVY ✦']" :damping="80" :stiffness="150" />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── Velocity mapping ───────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Velocity Mapping</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">Input / output range</h2>
            <p class="text-gray-400 max-w-xl mx-auto">
              Maps scroll velocity (input range) to a speed multiplier (output range). A wider
              output range means a bigger effect from the same scroll speed.
            </p>
          </div>
          <div class="space-y-12">
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                input: [0,1000], output: [0,2] — subtle
              </p>
              <MotionMarqueeText
                :texts="['SUBTLE ✦']"
                :velocity-mapping="{ input: [0, 1000], output: [0, 2] }"
              />
            </div>
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                input: [0,1000], output: [0,5] — default
              </p>
              <MotionMarqueeText
                :texts="['DEFAULT ✦']"
                :velocity-mapping="{ input: [0, 1000], output: [0, 5] }"
              />
            </div>
            <div>
              <p class="text-center text-gray-500 text-sm font-mono mb-4">
                input: [0,300], output: [0,10] — reactive
              </p>
              <MotionMarqueeText
                :texts="['REACTIVE ✦']"
                :velocity-mapping="{ input: [0, 300], output: [0, 10] }"
              />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── pauseOnHover ──────────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Interaction</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">Pause on hover</h2>
            <p class="text-gray-400">
              <code class="text-primary">:pause-on-hover="true"</code> — move your cursor over the
              marquee to freeze it.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText
          :texts="['HOVER TO PAUSE ✦', 'MOVE AWAY TO RESUME ✦']"
          :pause-on-hover="true"
        />
      </section>

      <!-- ─── Custom styling ────────────────────────────────────────────────── -->
      <section class="py-0 bg-white overflow-hidden">
        <MotionMarqueeText
          :texts="['DARK ON LIGHT ✦', 'INVERTED STYLE ✦']"
          :velocity="80"
          :velocity-mapping="{ input: [0, 500], output: [0, 6] }"
          scroller-class-name="!text-gray-900"
          class-name="!text-gray-900"
        />
      </section>

      <section class="py-0 bg-primary overflow-hidden">
        <MotionMarqueeText
          :texts="['BRAND COLOUR ✦', 'PRIMARY ROW ✦']"
          :velocity="60"
          scroller-class-name="!text-white"
          class-name="!text-white"
        />
      </section>

      <!-- ─── Full showcase ─────────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Showcase</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">All together</h2>
            <p class="text-gray-400">
              Four rows, alternating directions, high velocity sensitivity. Scroll fast.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText
          :texts="['SCROLL ✦', 'VELOCITY ✦', 'SPRING ✦', 'PHYSICS ✦']"
          :velocity="80"
          :damping="30"
          :stiffness="600"
          :velocity-mapping="{ input: [0, 500], output: [0, 8] }"
          :pause-on-hover="true"
        />
      </section>

      <!-- Footer nav -->
      <section class="py-16 bg-gray-950">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">MotionMarqueeText</h2>
              <p class="text-gray-400">Velocity-reactive text marquee — motion layer</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/motion">
                <UIcon name="i-lucide-arrow-left" class="mr-2" />
                Motion Layer
              </UButton>
              <UButton variant="ghost" to="/scrollytelling">Scrollytelling</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
