<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('violet')
  onUnmounted(() => setPageAccent(null))

  const { velocity, progress: globalProgress } = useSmoothScroll()

  // --- Chapter 1: ScrollScene + ScrollStep ---
  const sceneProgress = ref(0)
  const sceneActive = ref(false)
  const currentChapter = ref(0)

  function onSceneProgress(p: number) {
    sceneProgress.value = p
  }

  // --- Chapter 3: useSectionProgress debug ---
  const debugSectionRef = useTemplateRef<HTMLElement>('debugSectionRef')
  const { progress: sectionProg, active: sectionActive } = useSectionProgress(debugSectionRef, {
    start: 'top 80%',
    end: 'bottom 20%',
  })

  const cards = [
    {
      title: 'Establish',
      body: 'Set the scene. Introduce the subject before the journey begins.',
      color: 'from-blue-600 to-blue-900',
    },
    {
      title: 'Develop',
      body: 'Build tension. Layer in evidence, context, and complexity as scroll advances.',
      color: 'from-violet-600 to-violet-900',
    },
    {
      title: 'Resolve',
      body: 'Land the insight. The reader reaches the conclusion with earned understanding.',
      color: 'from-pink-600 to-pink-900',
    },
  ]
</script>

<template>
  <LayoutPage title="Scrollytelling" description="Multi-chapter narrative scroll demos">
    <div class="scrollytelling-page">
      <!-- Hero -->
      <section
        class="bg-default relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-linear-to-b from-violet-900/20 via-transparent to-transparent"
        />
        <div class="z-10 px-4 text-center">
          <h1 class="text-highlighted mb-6 text-6xl font-black sm:text-8xl md:text-9xl">
            <span
              v-gsap.from="{ y: 120, opacity: 0, rotateX: -90, duration: 1.2, ease: 'power3.out' }"
              class="inline-block"
            >
              SCROLLY
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
              class="inline-block text-violet-400"
            >
              TELLING
            </span>
          </h1>
          <p class="text-muted mx-auto mb-10 max-w-2xl text-xl">
            Scroll-driven narratives using <code class="text-violet-400">MotionScrollScene</code>,
            <code class="text-violet-400">MotionPinnedSection</code>, and
            <code class="text-violet-400">MotionHorizontalScroll</code>.
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

      <!-- Global debug overlay -->
      <div
        class="text-highlighted fixed top-4 right-4 z-50 space-y-1 rounded-lg bg-black/80 px-4 py-3 font-mono text-xs"
      >
        <div>Global: {{ (globalProgress * 100).toFixed(1) }}%</div>
        <div>Velocity: {{ velocity.toFixed(2) }}</div>
        <div>Scene: {{ (sceneProgress * 100).toFixed(1) }}%</div>
        <div>Section: {{ (sectionProg * 100).toFixed(1) }}%</div>
      </div>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 1: ScrollScene + ScrollStep (narrative reveal)
           ───────────────────────────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Chapter 1</UBadge>
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">MotionScrollScene</h2>
            <p class="text-muted text-lg">
              Two narrative beats revealed in sequence as you scroll.
            </p>
          </div>
        </UContainer>
      </section>

      <MotionScrollScene
        name="chapter-1"
        end="+=250%"
        :scrub="1"
        @progress="onSceneProgress"
        @enter="() => (sceneActive = true)"
        @leave="() => (sceneActive = false)"
      >
        <div class="bg-default flex min-h-screen flex-col items-center justify-center px-4">
          <!-- Progress arc -->
          <div class="mb-12 flex gap-3">
            <div
              v-for="n in 2"
              :key="n"
              class="h-1 w-16 rounded-full transition-all duration-500"
              :class="sceneProgress >= (n - 1) / 2 ? 'bg-violet-400' : 'bg-accented'"
            />
          </div>

          <!-- Step 0 -->
          <MotionScrollStep
            :index="0"
            class="mb-8 w-full max-w-3xl"
            @enter="() => (currentChapter = 0)"
          >
            <template #default="{ isActive }">
              <div
                class="rounded-3xl border-2 p-12 transition-all duration-700"
                :class="
                  isActive
                    ? 'border-violet-500/60 bg-violet-900/40 shadow-2xl shadow-violet-500/20'
                    : 'bg-muted/40 border-accented/40 opacity-40'
                "
              >
                <div class="mb-6 flex items-center gap-4">
                  <div
                    class="text-highlighted flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 font-bold"
                  >
                    1
                  </div>
                  <UBadge :color="isActive ? 'primary' : 'neutral'" variant="subtle">
                    {{ isActive ? 'Active' : 'Waiting' }}
                  </UBadge>
                </div>
                <h3 class="text-highlighted mb-4 text-3xl font-bold md:text-4xl">The Setup</h3>
                <p class="text-toned text-lg leading-relaxed">
                  Every scrollytelling experience begins with orientation. Give your reader a fixed
                  point of reference — a hero, a moment, a question — before the world starts
                  moving.
                </p>
              </div>
            </template>
          </MotionScrollStep>

          <!-- Step 1 -->
          <MotionScrollStep :index="1" class="w-full max-w-3xl" @enter="() => (currentChapter = 1)">
            <template #default="{ isActive }">
              <div
                class="rounded-3xl border-2 p-12 transition-all duration-700"
                :class="
                  isActive
                    ? 'border-pink-500/60 bg-pink-900/40 shadow-2xl shadow-pink-500/20'
                    : 'bg-muted/40 border-accented/40 opacity-40'
                "
              >
                <div class="mb-6 flex items-center gap-4">
                  <div
                    class="text-highlighted flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 font-bold"
                  >
                    2
                  </div>
                  <UBadge :color="isActive ? 'error' : 'neutral'" variant="subtle">
                    {{ isActive ? 'Active' : 'Waiting' }}
                  </UBadge>
                </div>
                <h3 class="text-highlighted mb-4 text-3xl font-bold md:text-4xl">The Revelation</h3>
                <p class="text-toned text-lg leading-relaxed">
                  Now the scroll does the work. As the reader moves forward, context accumulates.
                  Each step is a doorway — crossed at the reader's own pace, with no rush.
                </p>
              </div>
            </template>
          </MotionScrollStep>
        </div>
      </MotionScrollScene>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 2: MotionPinnedSection (staggered card reveals)
           ───────────────────────────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Chapter 2</UBadge>
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
              MotionPinnedSection
            </h2>
            <p class="text-muted text-lg">
              Three cards revealed one by one as you scroll through the pin.
            </p>
          </div>
        </UContainer>
      </section>

      <MotionPinnedSection :duration="300" class="bg-default">
        <div class="grid w-full max-w-6xl gap-8 px-8 md:grid-cols-3">
          <div
            v-for="card in cards"
            :key="card.title"
            class="text-highlighted flex min-h-64 flex-col justify-between rounded-3xl bg-linear-to-br p-10"
            :class="card.color"
          >
            <div>
              <h3 class="mb-4 text-2xl font-bold md:text-3xl">{{ card.title }}</h3>
              <p class="text-highlighted/80 leading-relaxed">{{ card.body }}</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="text-highlighted/50 mt-6 self-end text-3xl" />
          </div>
        </div>
      </MotionPinnedSection>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 3: useSectionProgress debug overlay
           ───────────────────────────────────────────────────────────────────── -->
      <section ref="debugSectionRef" class="bg-default py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Chapter 3</UBadge>
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">useSectionProgress</h2>
            <p class="text-muted text-lg">
              Section-local progress tracked independently of the page scroll.
            </p>
          </div>

          <!-- Live visualisation -->
          <div class="mx-auto max-w-2xl">
            <div class="bg-accented mb-8 rounded-2xl p-8">
              <div class="text-muted mb-3 flex justify-between text-sm">
                <span>Section progress</span>
                <span class="font-mono">{{ (sectionProg * 100).toFixed(1) }}%</span>
              </div>
              <div class="bg-accented h-3 overflow-hidden rounded-full">
                <div
                  class="h-full rounded-full bg-linear-to-r from-violet-500 to-pink-500 transition-none"
                  :style="{ width: `${sectionProg * 100}%` }"
                />
              </div>
              <div class="mt-4 flex items-center gap-3">
                <div
                  class="h-3 w-3 rounded-full"
                  :class="sectionActive ? 'animate-pulse bg-green-400' : 'bg-accented'"
                />
                <span class="text-sm" :class="sectionActive ? 'text-green-400' : 'text-muted'">
                  {{ sectionActive ? 'Section is active' : 'Outside section' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="n in 3"
                :key="n"
                class="text-highlighted flex h-32 items-center justify-center rounded-2xl text-2xl font-bold transition-all duration-500"
                :class="
                  sectionProg >= (n - 1) / 3
                    ? 'bg-violet-600 shadow-lg shadow-violet-500/30'
                    : 'bg-accented text-toned'
                "
              >
                {{ n }}
              </div>
            </div>

            <p class="text-muted mt-6 text-center text-sm">
              Each block lights up as section progress crosses its threshold.
            </p>
          </div>
        </UContainer>
      </section>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 4: MotionHorizontalScroll
           ───────────────────────────────────────────────────────────────────── -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Chapter 4</UBadge>
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
              MotionHorizontalScroll
            </h2>
            <p class="text-muted text-lg">
              Four panels advancing horizontally, pinned to the viewport.
            </p>
          </div>
        </UContainer>
      </section>

      <MotionHorizontalScroll :scrub="1">
        <div
          v-for="(color, i) in [
            'from-blue-700 to-blue-900',
            'from-violet-700 to-violet-900',
            'from-pink-700 to-pink-900',
            'from-amber-600 to-orange-900',
          ]"
          :key="i"
          class="text-highlighted mx-6 flex h-[70vh] w-[80vw] shrink-0 flex-col items-center justify-center rounded-3xl bg-linear-to-br p-12 first:ml-[10vw] last:mr-[10vw] md:w-[55vw]"
          :class="color"
        >
          <span class="mb-6 text-8xl font-black opacity-20">0{{ i + 1 }}</span>
          <h3 class="mb-4 text-3xl font-bold md:text-5xl">
            {{ ['Set the Stage', 'Build Tension', 'Deliver Impact', 'Leave a Mark'][i] }}
          </h3>
          <p class="text-highlighted/70 max-w-sm text-center">
            {{
              [
                'Orient the reader. Establish time, place, and protagonist.',
                'Layer complexity. Introduce conflict and stakes.',
                'The scroll delivers the payoff — data, story, or insight.',
                'End with a clear takeaway that resonates.',
              ][i]
            }}
          </p>
        </div>
      </MotionHorizontalScroll>

      <!-- Footer -->
      <section class="bg-default py-20 text-center">
        <UContainer>
          <h2 class="text-highlighted mb-4 text-3xl font-bold">That's the full toolkit.</h2>
          <p class="text-muted mx-auto mb-10 max-w-xl">
            Compose scenes, steps, pins, and horizontal tracks to build any narrative scroll
            experience.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <UButton to="/motion" size="lg" variant="outline">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton to="/" size="lg">Home</UButton>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
