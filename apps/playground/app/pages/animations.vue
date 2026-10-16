<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('amber')
  onUnmounted(() => setPageAccent(null))

  const cursorType = ref<'dot' | 'ring' | 'dot-ring' | 'glow'>('dot-ring')
  const cursorTypes: Array<'dot' | 'ring' | 'dot-ring' | 'glow'> = [
    'dot',
    'ring',
    'dot-ring',
    'glow',
  ]

  const velocityEffect = ref<'skew' | 'scale' | 'blur' | 'rotate'>('skew')
  const velocityEffects: Array<'skew' | 'scale' | 'blur' | 'rotate'> = [
    'skew',
    'scale',
    'blur',
    'rotate',
  ]

  const countKey = ref(0)
  function replayCount() {
    countKey.value++
  }
</script>

<template>
  <LayoutPage
    title="Animations Layer Demo"
    description="Micro-interaction primitives — Marquee, TextReveal, Tilt, Magnetic, Cursor, CountUp, Velocity"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="ANIMATIONS"
        description="GSAP-powered micro-interaction components — the pieces the Motion layer composes into its scrollytelling demos."
      >
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" @click="() => $router.push('#interactive')">Interactions</UButton>
          <UButton size="lg" variant="outline" @click="() => $router.push('#text')"
            >Text & Counters</UButton
          >
          <UButton size="lg" variant="ghost" to="/motion">
            <UIcon name="i-lucide-sparkles" class="mr-2" />
            Motion Layer
          </UButton>
          <UButton size="lg" variant="ghost" to="/motion-interactions">
            <UIcon name="i-lucide-mouse-pointer-2" class="mr-2" />
            Interactions Showcase
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Interactive components -->
      <section id="interactive" class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
              Pointer Interactions
            </h2>
            <p class="text-muted text-lg">Tilt, Magnetic, and Cursor — driven by spring physics</p>
          </div>

          <div class="mb-16 grid gap-8 md:grid-cols-2">
            <div
              class="bg-accented border-accented flex flex-col items-center rounded-2xl border p-8"
            >
              <h3 class="text-highlighted mb-6 text-lg font-bold">MotionTilt</h3>
              <MotionTilt
                :max-tilt="18"
                class="from-primary flex h-48 w-48 items-center justify-center rounded-3xl bg-linear-to-br to-purple-600 shadow-xl"
              >
                <UIcon name="i-lucide-move-3d" class="text-highlighted text-5xl" />
              </MotionTilt>
              <p class="text-muted mt-6 text-sm">
                Hover the card — perspective tilt with damping/stiffness springs
              </p>
            </div>

            <div
              class="bg-accented border-accented flex flex-col items-center rounded-2xl border p-8"
            >
              <h3 class="text-highlighted mb-6 text-lg font-bold">MotionMagnetic</h3>
              <MotionMagnetic :strength="0.5" :radius="120" class="inline-block">
                <UButton size="xl" class="rounded-full px-10">
                  <UIcon name="i-lucide-magnet" class="mr-2" />
                  Pull me
                </UButton>
              </MotionMagnetic>
              <p class="text-muted mt-6 text-sm">Cursor proximity pulls the element toward it</p>
            </div>
          </div>

          <div class="bg-default border-default rounded-2xl border p-8">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h3 class="text-highlighted text-lg font-bold">MotionCursor</h3>
              <div class="flex gap-2">
                <UButton
                  v-for="type in cursorTypes"
                  :key="type"
                  size="sm"
                  :variant="cursorType === type ? 'solid' : 'outline'"
                  @click="() => (cursorType = type)"
                >
                  {{ type }}
                </UButton>
              </div>
            </div>
            <div
              class="bg-muted relative flex h-56 cursor-none items-center justify-center overflow-hidden rounded-2xl"
            >
              <MotionCursor :type="cursorType" />
              <p class="text-muted">Move your mouse inside this box</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Velocity -->
      <section class="bg-default overflow-hidden py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
              MotionVelocityEffect
            </h2>
            <p class="text-muted text-lg">
              Reacts to scroll velocity — try scrolling quickly past this section
            </p>
          </div>
          <div class="mb-10 flex justify-center gap-2">
            <UButton
              v-for="effect in velocityEffects"
              :key="effect"
              size="sm"
              :variant="velocityEffect === effect ? 'solid' : 'outline'"
              @click="() => (velocityEffect = effect)"
            >
              {{ effect }}
            </UButton>
          </div>
          <MotionVelocityEffect
            :effect="velocityEffect"
            :intensity="1.2"
            as="div"
            class="text-center"
          >
            <h3 class="text-highlighted text-5xl font-black md:text-7xl">SCROLL TO REACT</h3>
          </MotionVelocityEffect>
        </UContainer>
      </section>

      <!-- Text & Counters -->
      <section id="text" class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">Text & Counters</h2>
            <p class="text-muted text-lg">MotionTextReveal, MotionStaggered, and MotionCountUp</p>
          </div>

          <div class="mx-auto mb-16 max-w-3xl text-center">
            <h3 class="text-highlighted mb-4 text-3xl font-bold md:text-5xl">
              <MotionTextReveal text="Characters reveal in sequence" type="chars" :stagger="0.02" />
            </h3>
            <p class="text-muted text-lg">
              <MotionTextReveal
                text="Words animate in as a group when scrolled into view"
                type="words"
                :stagger="0.06"
              />
            </p>
          </div>

          <MotionStaggered class="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4" :stagger-delay="80">
            <div
              v-for="i in 8"
              :key="i"
              class="border-accented text-highlighted flex aspect-square items-center justify-center rounded-2xl border bg-linear-to-br from-[var(--ui-bg-accented)] to-[var(--ui-bg-muted)] text-3xl font-bold"
            >
              {{ i }}
            </div>
          </MotionStaggered>

          <div class="mx-auto grid max-w-3xl gap-6 text-center sm:grid-cols-3">
            <div class="bg-accented border-accented rounded-2xl border p-8">
              <p class="text-primary text-4xl font-black">
                <MotionCountUp :key="`a-${countKey}`" :to="142" suffix="" />
              </p>
              <p class="text-muted mt-2 text-sm">TSL pipeline blocks</p>
            </div>
            <div class="bg-accented border-accented rounded-2xl border p-8">
              <p class="text-primary text-4xl font-black">
                <MotionCountUp :key="`b-${countKey}`" :to="21" />
              </p>
              <p class="text-muted mt-2 text-sm">Layers in the monorepo</p>
            </div>
            <div class="bg-accented border-accented rounded-2xl border p-8">
              <p class="text-primary text-4xl font-black">
                <MotionCountUp :key="`c-${countKey}`" :to="60" suffix="fps" />
              </p>
              <p class="text-muted mt-2 text-sm">Target frame rate</p>
            </div>
          </div>
          <div class="mt-8 text-center">
            <UButton variant="outline" @click="replayCount">
              <UIcon name="i-lucide-rotate-ccw" class="mr-2" />
              Replay counters
            </UButton>
          </div>
        </UContainer>
      </section>

      <!-- Marquee -->
      <section class="bg-primary text-highlighted overflow-hidden py-0">
        <MotionMarquee :speed="70" direction="left" gap="3rem">
          <span
            v-for="item in [
              'MARQUEE',
              '✦',
              'MARQUEE TEXT',
              '✦',
              'TEXT REVEAL',
              '✦',
              'COUNT UP',
              '✦',
            ]"
            :key="item"
            class="text-3xl font-black whitespace-nowrap md:text-5xl"
          >
            {{ item }}
          </span>
        </MotionMarquee>
      </section>

      <DemoPageFooter
        name="Animations Layer"
        description="Micro-interaction primitives for the Motion layer"
        :links="[
          {
            label: 'Motion Interactions',
            to: '/motion-interactions',
            icon: 'i-lucide-mouse-pointer-2',
          },
          { label: 'MarqueeText', to: '/marquee-text', icon: 'i-lucide-text-cursor-input' },
          { label: 'Motion Layer', to: '/motion', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
