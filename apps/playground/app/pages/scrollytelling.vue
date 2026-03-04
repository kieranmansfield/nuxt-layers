<script setup lang="ts">
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
const debugSectionRef = ref<HTMLElement | null>(null)
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
  <LayoutPageContainer
    title="Scrollytelling"
    description="Multi-chapter narrative scroll demos"
    :show-header="false"
  >
    <div class="scrollytelling-page">
      <!-- Hero -->
      <section
        class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
        <div
          class="absolute inset-0 bg-linear-to-b from-violet-900/20 via-transparent to-transparent"
        />
        <div class="text-center z-10 px-4">
          <h1 class="text-6xl sm:text-8xl md:text-9xl font-black text-white mb-6">
            <span
              class="inline-block"
              v-gsap.from="{ y: 120, opacity: 0, rotateX: -90, duration: 1.2, ease: 'power3.out' }"
            >
              SCROLLY
            </span>
            <br />
            <span
              class="inline-block text-violet-400"
              v-gsap.delay-100.from="{
                y: 120,
                opacity: 0,
                rotateX: -90,
                duration: 1.2,
                ease: 'power3.out',
              }"
            >
              TELLING
            </span>
          </h1>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Scroll-driven narratives using <code class="text-violet-400">MotionScrollScene</code>,
            <code class="text-violet-400">MotionPinnedSection</code>, and
            <code class="text-violet-400">MotionHorizontalScroll</code>.
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

      <!-- Global debug overlay -->
      <div
        class="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-3 rounded-lg font-mono text-xs space-y-1"
      >
        <div>Global: {{ (globalProgress * 100).toFixed(1) }}%</div>
        <div>Velocity: {{ velocity.toFixed(2) }}</div>
        <div>Scene: {{ (sceneProgress * 100).toFixed(1) }}%</div>
        <div>Section: {{ (sectionProg * 100).toFixed(1) }}%</div>
      </div>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 1: ScrollScene + ScrollStep (narrative reveal)
           ───────────────────────────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="violet" variant="subtle" class="mb-4">Chapter 1</UBadge>
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">MotionScrollScene</h2>
            <p class="text-gray-400 text-lg">
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
        @enter="sceneActive = true"
        @leave="sceneActive = false"
      >
        <div class="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
          <!-- Progress arc -->
          <div class="mb-12 flex gap-3">
            <div
              v-for="n in 2"
              :key="n"
              class="h-1 w-16 rounded-full transition-all duration-500"
              :class="sceneProgress >= (n - 1) / 2 ? 'bg-violet-400' : 'bg-gray-700'"
            />
          </div>

          <!-- Step 0 -->
          <MotionScrollStep :index="0" class="w-full max-w-3xl mb-8" @enter="currentChapter = 0">
            <template #default="{ isActive }">
              <div
                class="rounded-3xl p-12 border-2 transition-all duration-700"
                :class="
                  isActive
                    ? 'bg-violet-900/40 border-violet-500/60 shadow-2xl shadow-violet-500/20'
                    : 'bg-gray-900/40 border-gray-700/40 opacity-40'
                "
              >
                <div class="flex items-center gap-4 mb-6">
                  <div
                    class="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold"
                  >
                    1
                  </div>
                  <UBadge :color="isActive ? 'violet' : 'neutral'" variant="subtle">
                    {{ isActive ? 'Active' : 'Waiting' }}
                  </UBadge>
                </div>
                <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">The Setup</h3>
                <p class="text-gray-300 text-lg leading-relaxed">
                  Every scrollytelling experience begins with orientation. Give your reader a fixed
                  point of reference — a hero, a moment, a question — before the world starts
                  moving.
                </p>
              </div>
            </template>
          </MotionScrollStep>

          <!-- Step 1 -->
          <MotionScrollStep :index="1" class="w-full max-w-3xl" @enter="currentChapter = 1">
            <template #default="{ isActive }">
              <div
                class="rounded-3xl p-12 border-2 transition-all duration-700"
                :class="
                  isActive
                    ? 'bg-pink-900/40 border-pink-500/60 shadow-2xl shadow-pink-500/20'
                    : 'bg-gray-900/40 border-gray-700/40 opacity-40'
                "
              >
                <div class="flex items-center gap-4 mb-6">
                  <div
                    class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold"
                  >
                    2
                  </div>
                  <UBadge :color="isActive ? 'error' : 'neutral'" variant="subtle">
                    {{ isActive ? 'Active' : 'Waiting' }}
                  </UBadge>
                </div>
                <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">The Revelation</h3>
                <p class="text-gray-300 text-lg leading-relaxed">
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
      <section class="py-24 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="violet" variant="subtle" class="mb-4">Chapter 2</UBadge>
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">MotionPinnedSection</h2>
            <p class="text-gray-400 text-lg">
              Three cards revealed one by one as you scroll through the pin.
            </p>
          </div>
        </UContainer>
      </section>

      <MotionPinnedSection :duration="300" class="bg-gray-950">
        <div class="grid md:grid-cols-3 gap-8 px-8 max-w-6xl w-full">
          <div
            v-for="card in cards"
            :key="card.title"
            class="rounded-3xl p-10 bg-linear-to-br text-white flex flex-col justify-between min-h-64"
            :class="card.color"
          >
            <div>
              <h3 class="text-2xl md:text-3xl font-bold mb-4">{{ card.title }}</h3>
              <p class="text-white/80 leading-relaxed">{{ card.body }}</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="text-3xl text-white/50 mt-6 self-end" />
          </div>
        </div>
      </MotionPinnedSection>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 3: useSectionProgress debug overlay
           ───────────────────────────────────────────────────────────────────── -->
      <section ref="debugSectionRef" class="py-32 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="violet" variant="subtle" class="mb-4">Chapter 3</UBadge>
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">useSectionProgress</h2>
            <p class="text-gray-400 text-lg">
              Section-local progress tracked independently of the page scroll.
            </p>
          </div>

          <!-- Live visualisation -->
          <div class="max-w-2xl mx-auto">
            <div class="bg-gray-800 rounded-2xl p-8 mb-8">
              <div class="flex justify-between text-sm text-gray-400 mb-3">
                <span>Section progress</span>
                <span class="font-mono">{{ (sectionProg * 100).toFixed(1) }}%</span>
              </div>
              <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-none bg-linear-to-r from-violet-500 to-pink-500"
                  :style="{ width: `${sectionProg * 100}%` }"
                />
              </div>
              <div class="mt-4 flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :class="sectionActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'"
                />
                <span class="text-sm" :class="sectionActive ? 'text-green-400' : 'text-gray-500'">
                  {{ sectionActive ? 'Section is active' : 'Outside section' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="n in 3"
                :key="n"
                class="h-32 rounded-2xl flex items-center justify-center text-2xl font-bold text-white transition-all duration-500"
                :class="
                  sectionProg >= (n - 1) / 3
                    ? 'bg-violet-600 shadow-lg shadow-violet-500/30'
                    : 'bg-gray-800 text-gray-600'
                "
              >
                {{ n }}
              </div>
            </div>

            <p class="text-center text-gray-500 text-sm mt-6">
              Each block lights up as section progress crosses its threshold.
            </p>
          </div>
        </UContainer>
      </section>

      <!-- ─────────────────────────────────────────────────────────────────────
           Chapter 4: MotionHorizontalScroll
           ───────────────────────────────────────────────────────────────────── -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="violet" variant="subtle" class="mb-4">Chapter 4</UBadge>
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">MotionHorizontalScroll</h2>
            <p class="text-gray-400 text-lg">
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
          class="shrink-0 w-[80vw] md:w-[55vw] h-[70vh] mx-6 first:ml-[10vw] last:mr-[10vw] rounded-3xl bg-linear-to-br text-white flex flex-col items-center justify-center p-12"
          :class="color"
        >
          <span class="text-8xl font-black mb-6 opacity-20">0{{ i + 1 }}</span>
          <h3 class="text-3xl md:text-5xl font-bold mb-4">
            {{ ['Set the Stage', 'Build Tension', 'Deliver Impact', 'Leave a Mark'][i] }}
          </h3>
          <p class="text-white/70 text-center max-w-sm">
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
      <section class="py-20 bg-gray-950 text-center">
        <UContainer>
          <h2 class="text-3xl font-bold text-white mb-4">That's the full toolkit.</h2>
          <p class="text-gray-400 mb-10 max-w-xl mx-auto">
            Compose scenes, steps, pins, and horizontal tracks to build any narrative scroll
            experience.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton to="/motion" size="lg" variant="outline">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton to="/" size="lg">Home</UButton>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPageContainer>
</template>
