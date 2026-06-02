<script setup lang="ts">
definePageMeta({ layout: false })

const { velocity } = useSmoothScroll()

interface Stat {
  to: number
  label: string
  duration: number
  prefix?: string
  suffix?: string
  ease?: string
}

const stats: Stat[] = [
  { to: 99, suffix: '+', label: 'Projects', duration: 1.5 },
  { to: 4800000, prefix: '$', label: 'Revenue', duration: 2.5 },
  { to: 100, suffix: '%', label: 'Uptime', duration: 2, ease: 'power1.out' },
  { to: 12, suffix: ' yrs', label: 'Experience', duration: 1.2 },
]

const showCursor = ref(false)
const cursorType = ref<'dot' | 'ring' | 'dot-ring' | 'glow'>('dot-ring')
const cursorVisible = ref(true)
const cursorSmoothing = ref(0.15)
</script>

<template>
  <LayoutPage
    title="Motion Interactions"
    description="Magnetic pull, 3D tilt, count-up, cursor follower, and velocity effects"
  >
    <div>
      <!-- Hero -->
      <section
        class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
        <div class="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
        <div class="text-center z-10 px-4">
          <h1 class="text-6xl sm:text-8xl font-black text-white mb-6">
            <span
              class="inline-block"
              v-gsap.from="{ y: 100, opacity: 0, rotateX: -80, duration: 1.2, ease: 'power3.out' }"
            >MICRO</span>
            <br />
            <span
              class="inline-block text-primary"
              v-gsap.delay-100.from="{ y: 100, opacity: 0, rotateX: -80, duration: 1.2, ease: 'power3.out' }"
            >INTERACTIONS</span>
          </h1>
          <p class="text-xl text-gray-400 max-w-xl mx-auto mb-10">
            Spring physics composables applied to mouse position, scroll velocity, and element
            geometry.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton size="lg" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton size="lg" variant="outline" to="/marquee-text">Marquee Text</UButton>
          </div>
        </div>
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <UIcon name="i-lucide-chevron-down" class="text-3xl" />
        </div>
      </section>

      <!-- Velocity debug -->
      <div class="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-3 rounded-lg font-mono text-xs">
        Velocity: {{ velocity.toFixed(2) }}
      </div>

      <!-- ─── MotionMagnetic ──────────────────────────────────────────────────── -->
      <section class="py-32 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Magnetic</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">MotionMagnetic</h2>
            <p class="text-gray-400 max-w-lg mx-auto">
              Move your cursor near each element — it springs toward you then snaps back.
              Each button has a different <code class="text-primary">strength</code> and
              <code class="text-primary">radius</code>.
            </p>
          </div>

          <!-- Strength comparison -->
          <div class="flex flex-wrap gap-12 justify-center mb-16">
            <div class="text-center">
              <p class="text-gray-500 text-xs font-mono mb-6">strength: 0.15 — subtle</p>
              <MotionMagnetic :strength="0.15" :radius="120">
                <template #default="{ isActive }">
                  <UButton
                    size="xl"
                    :variant="isActive ? 'solid' : 'outline'"
                    class="transition-colors duration-200"
                  >
                    Subtle Pull
                  </UButton>
                </template>
              </MotionMagnetic>
            </div>

            <div class="text-center">
              <p class="text-gray-500 text-xs font-mono mb-6">strength: 0.3 — default</p>
              <MotionMagnetic :strength="0.3" :radius="120">
                <template #default="{ isActive }">
                  <UButton
                    size="xl"
                    :class="isActive ? 'bg-primary' : ''"
                  >
                    Default Pull
                  </UButton>
                </template>
              </MotionMagnetic>
            </div>

            <div class="text-center">
              <p class="text-gray-500 text-xs font-mono mb-6">strength: 0.6 — strong</p>
              <MotionMagnetic :strength="0.6" :radius="120">
                <template #default="{ isActive }">
                  <UButton
                    size="xl"
                    color="error"
                    :variant="isActive ? 'solid' : 'outline'"
                    class="transition-colors duration-200"
                  >
                    Strong Pull
                  </UButton>
                </template>
              </MotionMagnetic>
            </div>
          </div>

          <!-- Icon magnets -->
          <div class="flex flex-wrap gap-16 justify-center">
            <div v-for="icon in ['i-lucide-github', 'i-lucide-twitter', 'i-lucide-mail', 'i-lucide-external-link']" :key="icon" class="text-center">
              <MotionMagnetic :strength="0.4" :radius="80" :stiffness="400">
                <template #default="{ isActive }">
                  <div
                    class="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-200 cursor-pointer"
                    :class="isActive ? 'bg-primary border-primary text-white' : 'border-gray-600 text-gray-400 hover:border-gray-400'"
                  >
                    <UIcon :name="icon" class="text-2xl" />
                  </div>
                </template>
              </MotionMagnetic>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── MotionTilt ─────────────────────────────────────────────────────── -->
      <section class="py-32 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Tilt</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">MotionTilt</h2>
            <p class="text-gray-400 max-w-lg mx-auto">
              Hover over each card — it rotates in 3D following your cursor position.
              Different <code class="text-primary">maxTilt</code> and spring values per card.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <!-- Gentle tilt -->
            <MotionTilt :max-tilt="8" :stiffness="200">
              <div class="h-64 rounded-2xl bg-linear-to-br from-blue-600 to-blue-900 flex flex-col items-center justify-center p-8 cursor-pointer select-none">
                <UIcon name="i-lucide-feather" class="text-5xl text-white/80 mb-4" />
                <h3 class="text-xl font-bold text-white">Gentle</h3>
                <p class="text-blue-300 text-sm mt-1 font-mono">maxTilt: 8°</p>
              </div>
            </MotionTilt>

            <!-- Default tilt -->
            <MotionTilt>
              <div class="h-64 rounded-2xl bg-linear-to-br from-violet-600 to-violet-900 flex flex-col items-center justify-center p-8 cursor-pointer select-none">
                <UIcon name="i-lucide-box" class="text-5xl text-white/80 mb-4" />
                <h3 class="text-xl font-bold text-white">Default</h3>
                <p class="text-violet-300 text-sm mt-1 font-mono">maxTilt: 15°</p>
              </div>
            </MotionTilt>

            <!-- Dramatic tilt -->
            <MotionTilt :max-tilt="25" :stiffness="350" :damping="30">
              <div class="h-64 rounded-2xl bg-linear-to-br from-pink-600 to-pink-900 flex flex-col items-center justify-center p-8 cursor-pointer select-none">
                <UIcon name="i-lucide-zap" class="text-5xl text-white/80 mb-4" />
                <h3 class="text-xl font-bold text-white">Dramatic</h3>
                <p class="text-pink-300 text-sm mt-1 font-mono">maxTilt: 25°</p>
              </div>
            </MotionTilt>
          </div>

          <!-- Tilt + Magnetic combined -->
          <div class="text-center mt-16">
            <p class="text-gray-500 text-sm mb-8">Composed together — tilt wraps magnetic</p>
            <div class="flex justify-center">
              <MotionTilt :max-tilt="20" :perspective="600">
                <MotionMagnetic :strength="0.25" :radius="150">
                  <div class="w-48 h-48 rounded-3xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center cursor-pointer select-none shadow-2xl shadow-amber-500/30">
                    <div class="text-center">
                      <UIcon name="i-lucide-sparkles" class="text-5xl text-white mb-2" />
                      <p class="text-white font-bold">Tilt + Magnetic</p>
                    </div>
                  </div>
                </MotionMagnetic>
              </MotionTilt>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── MotionCountUp ─────────────────────────────────────────────────── -->
      <section class="py-32 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Count Up</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">MotionCountUp</h2>
            <p class="text-gray-400 max-w-lg mx-auto">
              Numbers count from zero when they scroll into view. Scroll back up and back down
              to replay (or set <code class="text-primary">:once="false"</code>).
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-gray-800 rounded-2xl p-8 text-center"
            >
              <div class="text-4xl md:text-5xl font-black text-primary mb-2">
                <MotionCountUp
                  :to="stat.to"
                  :duration="stat.duration"
                  :prefix="stat.prefix ?? ''"
                  :suffix="stat.suffix ?? ''"
                  :ease="stat.ease ?? 'power2.out'"
                  :format="(n) => n.toLocaleString()"
                />
              </div>
              <p class="text-gray-400 font-medium">{{ stat.label }}</p>
            </div>
          </div>

          <!-- Custom format example -->
          <div class="mt-12 text-center">
            <p class="text-gray-500 text-sm mb-6">Custom format function</p>
            <div class="inline-flex items-baseline gap-1 bg-gray-800 rounded-2xl px-12 py-8">
              <MotionCountUp
                :to="9.87"
                :from="0"
                :duration="2.5"
                :format="(n) => n.toFixed(2)"
                as="span"
                class="text-6xl font-black text-white"
              />
              <span class="text-2xl text-gray-400 ml-1">sec</span>
            </div>
            <p class="text-gray-600 text-xs font-mono mt-3">:format="(n) => n.toFixed(2)"</p>
          </div>
        </UContainer>
      </section>

      <!-- ─── VelocityEffect ────────────────────────────────────────────────── -->
      <section class="py-32 bg-gray-950 overflow-hidden">
        <UContainer>
          <div class="text-center mb-16">
            <UBadge color="primary" variant="subtle" class="mb-4">Velocity Effect</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">MotionVelocityEffect</h2>
            <p class="text-gray-400 max-w-lg mx-auto">
              Scroll fast to trigger each effect. Now driven by the GSAP ticker with spring
              physics instead of requestAnimationFrame.
            </p>
          </div>

          <div class="space-y-24">
            <div class="text-center">
              <p class="text-gray-600 text-xs font-mono mb-6">effect: "skew"</p>
              <MotionVelocityEffect effect="skew">
                <h3 class="text-5xl md:text-7xl font-black text-white">SCROLL SKEW</h3>
              </MotionVelocityEffect>
            </div>

            <div class="text-center">
              <p class="text-gray-600 text-xs font-mono mb-6">effect: "scale"</p>
              <MotionVelocityEffect effect="scale">
                <h3 class="text-5xl md:text-7xl font-black text-white">SCROLL SCALE</h3>
              </MotionVelocityEffect>
            </div>

            <div class="text-center">
              <p class="text-gray-600 text-xs font-mono mb-6">effect: "blur"</p>
              <MotionVelocityEffect effect="blur">
                <h3 class="text-5xl md:text-7xl font-black text-white">SCROLL BLUR</h3>
              </MotionVelocityEffect>
            </div>

            <div class="text-center">
              <p class="text-gray-600 text-xs font-mono mb-6">effect: "letterSpacing"</p>
              <MotionVelocityEffect effect="letterSpacing">
                <h3 class="text-5xl md:text-7xl font-black text-white">LETTER SPACING</h3>
              </MotionVelocityEffect>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── MotionCursor ──────────────────────────────────────────────────── -->
      <section class="py-32 bg-gray-900">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Cursor</UBadge>
            <h2 class="text-4xl font-bold text-white mb-3">MotionCursor</h2>
            <p class="text-gray-400 max-w-lg mx-auto">
              Enable the cursor, then adjust type, visibility, and smoothing live.
            </p>
          </div>

          <!-- Live cursor instance -->
          <MotionCursor
            v-if="showCursor"
            :type="cursorType"
            :visible="cursorVisible"
            :smoothing="cursorSmoothing"
          />

          <!-- Controls -->
          <div class="max-w-xl mx-auto space-y-8">

            <!-- Enable toggle -->
            <div class="flex items-center justify-between bg-gray-800 rounded-2xl px-6 py-4">
              <div>
                <p class="text-white font-medium">Cursor follower</p>
                <p class="text-gray-500 text-xs mt-0.5">{{ showCursor ? 'Active — move your mouse' : 'Disabled' }}</p>
              </div>
              <UButton
                :color="showCursor ? 'error' : 'primary'"
                @click="showCursor = !showCursor"
              >
                <UIcon :name="showCursor ? 'i-lucide-x' : 'i-lucide-mouse-pointer-2'" class="mr-2" />
                {{ showCursor ? 'Disable' : 'Enable' }}
              </UButton>
            </div>

            <!-- Type selector -->
            <div class="bg-gray-800 rounded-2xl px-6 py-5">
              <p class="text-gray-400 text-sm mb-4">Type</p>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="t in (['dot', 'ring', 'dot-ring', 'glow'] as const)"
                  :key="t"
                  class="rounded-xl py-2.5 text-sm font-medium transition-colors"
                  :class="cursorType === t
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                  @click="cursorType = t"
                >
                  {{ t }}
                </button>
              </div>
              <p class="text-gray-600 text-xs font-mono mt-3">type="{{ cursorType }}"</p>
            </div>

            <!-- Visibility toggle -->
            <div class="flex items-center justify-between bg-gray-800 rounded-2xl px-6 py-4">
              <div>
                <p class="text-white font-medium">Visible</p>
                <p class="text-gray-500 text-xs mt-0.5">Fades without remounting</p>
              </div>
              <button
                class="w-12 h-6 rounded-full transition-colors relative"
                :class="cursorVisible ? 'bg-primary' : 'bg-gray-600'"
                @click="cursorVisible = !cursorVisible"
              >
                <span
                  class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  :class="cursorVisible ? 'left-7' : 'left-1'"
                />
              </button>
            </div>

            <!-- Smoothing slider -->
            <div class="bg-gray-800 rounded-2xl px-6 py-5">
              <div class="flex items-center justify-between mb-3">
                <p class="text-gray-400 text-sm">Smoothing</p>
                <p class="text-white font-mono text-sm">{{ cursorSmoothing.toFixed(2) }}</p>
              </div>
              <input
                v-model.number="cursorSmoothing"
                type="range"
                min="0.02"
                max="0.5"
                step="0.01"
                class="w-full accent-primary"
              />
              <div class="flex justify-between text-gray-600 text-xs mt-1.5">
                <span>0.02 — heavy lag</span>
                <span>0.5 — instant</span>
              </div>
            </div>

          </div>
        </UContainer>
      </section>

      <!-- Footer nav -->
      <section class="py-16 bg-gray-900">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">Motion Interactions</h2>
              <p class="text-gray-400">Magnetic, tilt, count-up, velocity effects</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/motion">
                <UIcon name="i-lucide-arrow-left" class="mr-2" />
                Motion Layer
              </UButton>
              <UButton variant="ghost" to="/marquee-text">Marquee Text</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
