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
        <div class="flex flex-wrap gap-4 justify-center">
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
      <section id="interactive" class="py-24 bg-default">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-highlighted mb-4">Pointer Interactions</h2>
            <p class="text-muted text-lg">
              Tilt, Magnetic, and Cursor — driven by spring physics
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 mb-16">
            <div
              class="bg-accented rounded-2xl p-8 flex flex-col items-center border border-accented"
            >
              <h3 class="text-lg font-bold text-highlighted mb-6">MotionTilt</h3>
              <MotionTilt
                :max-tilt="18"
                class="w-48 h-48 rounded-3xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-xl"
              >
                <UIcon name="i-lucide-move-3d" class="text-5xl text-highlighted" />
              </MotionTilt>
              <p class="text-muted text-sm mt-6">
                Hover the card — perspective tilt with damping/stiffness springs
              </p>
            </div>

            <div
              class="bg-accented rounded-2xl p-8 flex flex-col items-center border border-accented"
            >
              <h3 class="text-lg font-bold text-highlighted mb-6">MotionMagnetic</h3>
              <MotionMagnetic :strength="0.5" :radius="120" class="inline-block">
                <UButton size="xl" class="rounded-full px-10">
                  <UIcon name="i-lucide-magnet" class="mr-2" />
                  Pull me
                </UButton>
              </MotionMagnetic>
              <p class="text-muted text-sm mt-6">Cursor proximity pulls the element toward it</p>
            </div>
          </div>

          <div class="bg-default rounded-2xl p-8 border border-default">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h3 class="text-lg font-bold text-highlighted">MotionCursor</h3>
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
              class="h-56 rounded-2xl bg-muted relative overflow-hidden flex items-center justify-center cursor-none"
            >
              <MotionCursor :type="cursorType" />
              <p class="text-muted">Move your mouse inside this box</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Velocity -->
      <section class="py-24 bg-default overflow-hidden">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-highlighted mb-4">MotionVelocityEffect</h2>
            <p class="text-muted text-lg">
              Reacts to scroll velocity — try scrolling quickly past this section
            </p>
          </div>
          <div class="flex gap-2 justify-center mb-10">
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
            <h3 class="text-5xl md:text-7xl font-black text-highlighted">SCROLL TO REACT</h3>
          </MotionVelocityEffect>
        </UContainer>
      </section>

      <!-- Text & Counters -->
      <section id="text" class="py-24 bg-default">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-highlighted mb-4">Text & Counters</h2>
            <p class="text-muted text-lg">
              MotionTextReveal, MotionStaggered, and MotionCountUp
            </p>
          </div>

          <div class="max-w-3xl mx-auto text-center mb-16">
            <h3 class="text-3xl md:text-5xl font-bold text-highlighted mb-4">
              <MotionTextReveal text="Characters reveal in sequence" type="chars" :stagger="0.02" />
            </h3>
            <p class="text-lg text-muted">
              <MotionTextReveal
                text="Words animate in as a group when scrolled into view"
                type="words"
                :stagger="0.06"
              />
            </p>
          </div>

          <MotionStaggered class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" :stagger-delay="80">
            <div
              v-for="i in 8"
              :key="i"
              class="aspect-square rounded-2xl bg-linear-to-br from-[var(--ui-bg-accented)] to-[var(--ui-bg-muted)] border border-accented flex items-center justify-center text-3xl font-bold text-highlighted"
            >
              {{ i }}
            </div>
          </MotionStaggered>

          <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            <div class="bg-accented rounded-2xl p-8 border border-accented">
              <p class="text-4xl font-black text-primary">
                <MotionCountUp :key="`a-${countKey}`" :to="142" suffix="" />
              </p>
              <p class="text-muted text-sm mt-2">TSL pipeline blocks</p>
            </div>
            <div class="bg-accented rounded-2xl p-8 border border-accented">
              <p class="text-4xl font-black text-primary">
                <MotionCountUp :key="`b-${countKey}`" :to="21" />
              </p>
              <p class="text-muted text-sm mt-2">Layers in the monorepo</p>
            </div>
            <div class="bg-accented rounded-2xl p-8 border border-accented">
              <p class="text-4xl font-black text-primary">
                <MotionCountUp :key="`c-${countKey}`" :to="60" suffix="fps" />
              </p>
              <p class="text-muted text-sm mt-2">Target frame rate</p>
            </div>
          </div>
          <div class="text-center mt-8">
            <UButton variant="outline" @click="replayCount">
              <UIcon name="i-lucide-rotate-ccw" class="mr-2" />
              Replay counters
            </UButton>
          </div>
        </UContainer>
      </section>

      <!-- Marquee -->
      <section class="py-0 bg-primary text-highlighted overflow-hidden">
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
            class="text-3xl md:text-5xl font-black whitespace-nowrap"
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
