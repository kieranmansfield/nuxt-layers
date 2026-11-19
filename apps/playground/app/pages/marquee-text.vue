<script setup lang="ts">
  definePageMeta({ layout: false })

  const { velocity, progress } = useSmoothScroll()
</script>

<template>
  <LayoutPage
    title="MarqueeText"
    description="Velocity-reactive text marquee with alternating rows and spring physics"
  >
    <div>
      <!-- Hero -->
      <section
        class="bg-default relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div
          class="from-primary/10 absolute inset-0 bg-linear-to-b via-transparent to-transparent"
        />
        <div class="z-10 px-4 text-center">
          <h1 class="text-highlighted mb-6 text-6xl font-black sm:text-8xl md:text-9xl">
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
              class="text-primary inline-block"
            >
              TEXT
            </span>
          </h1>
          <p class="text-muted mx-auto mb-10 max-w-2xl text-xl">
            Scroll to see velocity-reactive marquees. Spring physics amplify scroll speed into
            marquee momentum — scroll fast to feel it.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <UButton size="lg" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton size="lg" variant="outline" to="/">Home</UButton>
          </div>
        </div>
        <div class="text-highlighted/40 absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <UIcon name="i-lucide-chevron-down" class="text-3xl" />
        </div>
      </section>

      <!-- Debug overlay -->
      <div
        class="text-highlighted fixed top-4 right-4 z-50 space-y-1 rounded-lg bg-black/80 px-4 py-3 font-mono text-xs"
      >
        <div>Velocity: {{ velocity.toFixed(2) }}</div>
        <div>Progress: {{ (progress * 100).toFixed(1) }}%</div>
      </div>

      <!-- ─── Default: single row ────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Default</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Single row</h2>
            <p class="text-muted">
              One repeating text row. Scroll to see velocity affect the speed.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText :texts="['MARQUEE TEXT ✦']" />
      </section>

      <!-- ─── Alternating rows ───────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Alternating</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Multiple rows</h2>
            <p class="text-muted">
              Even-indexed rows scroll right, odd-indexed rows scroll left — automatically.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText :texts="['MARQUEE ✦', 'TEXT ✦', 'MOTION ✦']" />
      </section>

      <!-- ─── Speed comparison ───────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Speed</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Velocity prop</h2>
            <p class="text-muted">
              The <code class="text-primary">velocity</code> prop sets the base pixels-per-second.
            </p>
          </div>
          <div class="space-y-12">
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">velocity: 30 — slow</p>
              <MotionMarqueeText :texts="['SLOW ✦']" :velocity="30" />
            </div>
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">velocity: 100 — default</p>
              <MotionMarqueeText :texts="['DEFAULT ✦']" :velocity="100" />
            </div>
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">velocity: 250 — fast</p>
              <MotionMarqueeText :texts="['FAST ✦']" :velocity="250" />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── Spring physics: damping ──────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Spring Physics</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Damping &amp; stiffness</h2>
            <p class="text-muted mx-auto max-w-xl">
              Scroll quickly past this section. High stiffness snaps velocity on fast; high damping
              bleeds it off slowly.
            </p>
          </div>
          <div class="space-y-12">
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">
                damping: 20, stiffness: 800 — snappy
              </p>
              <MotionMarqueeText :texts="['SNAPPY ✦']" :damping="20" :stiffness="800" />
            </div>
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">
                damping: 50, stiffness: 400 — default
              </p>
              <MotionMarqueeText :texts="['DEFAULT ✦']" :damping="50" :stiffness="400" />
            </div>
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">
                damping: 80, stiffness: 150 — heavy drag
              </p>
              <MotionMarqueeText :texts="['HEAVY ✦']" :damping="80" :stiffness="150" />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── Velocity mapping ───────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Velocity Mapping</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Input / output range</h2>
            <p class="text-muted mx-auto max-w-xl">
              Maps scroll velocity (input range) to a speed multiplier (output range). A wider
              output range means a bigger effect from the same scroll speed.
            </p>
          </div>
          <div class="space-y-12">
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">
                input: [0,1000], output: [0,2] — subtle
              </p>
              <MotionMarqueeText
                :texts="['SUBTLE ✦']"
                :velocity-mapping="{ input: [0, 1000], output: [0, 2] }"
              />
            </div>
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">
                input: [0,1000], output: [0,5] — default
              </p>
              <MotionMarqueeText
                :texts="['DEFAULT ✦']"
                :velocity-mapping="{ input: [0, 1000], output: [0, 5] }"
              />
            </div>
            <div>
              <p class="text-muted mb-4 text-center font-mono text-sm">
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
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Interaction</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Pause on hover</h2>
            <p class="text-muted">
              <code class="text-primary">:pause-on-hover="true"</code> — move your cursor over the
              marquee to freeze it.
            </p>
          </div>
        </UContainer>
        <MotionMarqueeText :texts="['HOVER TO PAUSE ✦', 'MOVE AWAY TO RESUME ✦']" pause-on-hover />
      </section>

      <!-- ─── Custom styling ────────────────────────────────────────────────── -->
      <section class="bg-default overflow-hidden py-0">
        <MotionMarqueeText
          :texts="['DARK ON LIGHT ✦', 'INVERTED STYLE ✦']"
          :velocity="80"
          :velocity-mapping="{ input: [0, 500], output: [0, 6] }"
          scroller-class-name="!text-highlighted"
          class-name="!text-highlighted"
        />
      </section>

      <section class="bg-primary overflow-hidden py-0">
        <MotionMarqueeText
          :texts="['BRAND COLOUR ✦', 'PRIMARY ROW ✦']"
          :velocity="60"
          scroller-class-name="!text-highlighted"
          class-name="!text-highlighted"
        />
      </section>

      <!-- ─── Full showcase ─────────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Showcase</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">All together</h2>
            <p class="text-muted">
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
          pause-on-hover
        />
      </section>

      <!-- Footer nav -->
      <section class="bg-default py-16">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 class="text-highlighted mb-2 text-2xl font-bold">MotionMarqueeText</h2>
              <p class="text-muted">Velocity-reactive text marquee — motion layer</p>
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
