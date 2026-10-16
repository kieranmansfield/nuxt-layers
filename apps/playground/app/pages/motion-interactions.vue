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
        class="bg-default relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div
          class="from-primary/10 absolute inset-0 bg-linear-to-b via-transparent to-transparent"
        />
        <div class="z-10 px-4 text-center">
          <h1 class="text-highlighted mb-6 text-6xl font-black sm:text-8xl">
            <span
              v-gsap.from="{ y: 100, opacity: 0, rotateX: -80, duration: 1.2, ease: 'power3.out' }"
              class="inline-block"
            >
              MICRO
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
              class="text-primary inline-block"
            >
              INTERACTIONS
            </span>
          </h1>
          <p class="text-muted mx-auto mb-10 max-w-xl text-xl">
            Spring physics composables applied to mouse position, scroll velocity, and element
            geometry.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <UButton size="lg" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Layer
            </UButton>
            <UButton size="lg" variant="outline" to="/marquee-text">Marquee Text</UButton>
          </div>
        </div>
        <div class="text-highlighted/40 absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <UIcon name="i-lucide-chevron-down" class="text-3xl" />
        </div>
      </section>

      <!-- Velocity debug -->
      <div
        class="text-highlighted fixed top-4 right-4 z-50 rounded-lg bg-black/80 px-4 py-3 font-mono text-xs"
      >
        Velocity: {{ velocity.toFixed(2) }}
      </div>

      <!-- ─── MotionMagnetic ──────────────────────────────────────────────────── -->
      <section class="bg-default py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Magnetic</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">MotionMagnetic</h2>
            <p class="text-muted mx-auto max-w-lg">
              Move your cursor near each element — it springs toward you then snaps back. Each
              button has a different <code class="text-primary">strength</code> and
              <code class="text-primary">radius</code>.
            </p>
          </div>

          <!-- Strength comparison -->
          <div class="mb-16 flex flex-wrap justify-center gap-12">
            <div class="text-center">
              <p class="text-muted mb-6 font-mono text-xs">strength: 0.15 — subtle</p>
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
              <p class="text-muted mb-6 font-mono text-xs">strength: 0.3 — default</p>
              <MotionMagnetic :strength="0.3" :radius="120">
                <template #default="{ isActive }">
                  <UButton size="xl" :class="isActive ? 'bg-primary' : ''"> Default Pull </UButton>
                </template>
              </MotionMagnetic>
            </div>

            <div class="text-center">
              <p class="text-muted mb-6 font-mono text-xs">strength: 0.6 — strong</p>
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
          <div class="flex flex-wrap justify-center gap-16">
            <div
              v-for="icon in [
                'i-lucide-github',
                'i-lucide-twitter',
                'i-lucide-mail',
                'i-lucide-external-link',
              ]"
              :key="icon"
              class="text-center"
            >
              <MotionMagnetic :strength="0.4" :radius="80" :stiffness="400">
                <template #default="{ isActive }">
                  <div
                    class="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200"
                    :class="
                      isActive
                        ? 'bg-primary border-primary text-highlighted'
                        : 'border-accented text-muted hover:border-accented'
                    "
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
      <section class="bg-default py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Tilt</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">MotionTilt</h2>
            <p class="text-muted mx-auto max-w-lg">
              Hover over each card — it rotates in 3D following your cursor position. Different
              <code class="text-primary">maxTilt</code> and spring values per card.
            </p>
          </div>

          <div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <!-- Gentle tilt -->
            <MotionTilt :max-tilt="8" :stiffness="200">
              <div
                class="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-blue-900 p-8 select-none"
              >
                <UIcon name="i-lucide-feather" class="text-highlighted/80 mb-4 text-5xl" />
                <h3 class="text-highlighted text-xl font-bold">Gentle</h3>
                <p class="mt-1 font-mono text-sm text-blue-300">maxTilt: 8°</p>
              </div>
            </MotionTilt>

            <!-- Default tilt -->
            <MotionTilt>
              <div
                class="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-violet-900 p-8 select-none"
              >
                <UIcon name="i-lucide-box" class="text-highlighted/80 mb-4 text-5xl" />
                <h3 class="text-highlighted text-xl font-bold">Default</h3>
                <p class="mt-1 font-mono text-sm text-violet-300">maxTilt: 15°</p>
              </div>
            </MotionTilt>

            <!-- Dramatic tilt -->
            <MotionTilt :max-tilt="25" :stiffness="350" :damping="30">
              <div
                class="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl bg-linear-to-br from-pink-600 to-pink-900 p-8 select-none"
              >
                <UIcon name="i-lucide-zap" class="text-highlighted/80 mb-4 text-5xl" />
                <h3 class="text-highlighted text-xl font-bold">Dramatic</h3>
                <p class="mt-1 font-mono text-sm text-pink-300">maxTilt: 25°</p>
              </div>
            </MotionTilt>
          </div>

          <!-- Tilt + Magnetic combined -->
          <div class="mt-16 text-center">
            <p class="text-muted mb-8 text-sm">Composed together — tilt wraps magnetic</p>
            <div class="flex justify-center">
              <MotionTilt :max-tilt="20" :perspective="600">
                <MotionMagnetic :strength="0.25" :radius="150">
                  <div
                    class="flex h-48 w-48 cursor-pointer items-center justify-center rounded-3xl bg-linear-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30 select-none"
                  >
                    <div class="text-center">
                      <UIcon name="i-lucide-sparkles" class="text-highlighted mb-2 text-5xl" />
                      <p class="text-highlighted font-bold">Tilt + Magnetic</p>
                    </div>
                  </div>
                </MotionMagnetic>
              </MotionTilt>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── MotionCountUp ─────────────────────────────────────────────────── -->
      <section class="bg-default py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Count Up</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">MotionCountUp</h2>
            <p class="text-muted mx-auto max-w-lg">
              Numbers count from zero when they scroll into view. Scroll back up and back down to
              replay (or set <code class="text-primary">:once="false"</code>).
            </p>
          </div>

          <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-accented rounded-2xl p-8 text-center"
            >
              <div class="text-primary mb-2 text-4xl font-black md:text-5xl">
                <MotionCountUp
                  :to="stat.to"
                  :duration="stat.duration"
                  :prefix="stat.prefix ?? ''"
                  :suffix="stat.suffix ?? ''"
                  :ease="stat.ease ?? 'power2.out'"
                  :format="(n) => n.toLocaleString()"
                />
              </div>
              <p class="text-muted font-medium">{{ stat.label }}</p>
            </div>
          </div>

          <!-- Custom format example -->
          <div class="mt-12 text-center">
            <p class="text-muted mb-6 text-sm">Custom format function</p>
            <div class="bg-accented inline-flex items-baseline gap-1 rounded-2xl px-12 py-8">
              <MotionCountUp
                :to="9.87"
                :from="0"
                :duration="2.5"
                :format="(n) => n.toFixed(2)"
                as="span"
                class="text-highlighted text-6xl font-black"
              />
              <span class="text-muted ml-1 text-2xl">sec</span>
            </div>
            <p class="text-toned mt-3 font-mono text-xs">:format="(n) => n.toFixed(2)"</p>
          </div>
        </UContainer>
      </section>

      <!-- ─── VelocityEffect ────────────────────────────────────────────────── -->
      <section class="bg-default overflow-hidden py-32">
        <UContainer>
          <div class="mb-16 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Velocity Effect</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">MotionVelocityEffect</h2>
            <p class="text-muted mx-auto max-w-lg">
              Scroll fast to trigger each effect. Now driven by the GSAP ticker with spring physics
              instead of requestAnimationFrame.
            </p>
          </div>

          <div class="space-y-24">
            <div class="text-center">
              <p class="text-toned mb-6 font-mono text-xs">effect: "skew"</p>
              <MotionVelocityEffect effect="skew">
                <h3 class="text-highlighted text-5xl font-black md:text-7xl">SCROLL SKEW</h3>
              </MotionVelocityEffect>
            </div>

            <div class="text-center">
              <p class="text-toned mb-6 font-mono text-xs">effect: "scale"</p>
              <MotionVelocityEffect effect="scale">
                <h3 class="text-highlighted text-5xl font-black md:text-7xl">SCROLL SCALE</h3>
              </MotionVelocityEffect>
            </div>

            <div class="text-center">
              <p class="text-toned mb-6 font-mono text-xs">effect: "blur"</p>
              <MotionVelocityEffect effect="blur">
                <h3 class="text-highlighted text-5xl font-black md:text-7xl">SCROLL BLUR</h3>
              </MotionVelocityEffect>
            </div>

            <div class="text-center">
              <p class="text-toned mb-6 font-mono text-xs">effect: "letterSpacing"</p>
              <MotionVelocityEffect effect="letterSpacing">
                <h3 class="text-highlighted text-5xl font-black md:text-7xl">LETTER SPACING</h3>
              </MotionVelocityEffect>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ─── MotionCursor ──────────────────────────────────────────────────── -->
      <section class="bg-default py-32">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Cursor</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">MotionCursor</h2>
            <p class="text-muted mx-auto max-w-lg">
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
          <div class="mx-auto max-w-xl space-y-8">
            <!-- Enable toggle -->
            <div class="bg-accented flex items-center justify-between rounded-2xl px-6 py-4">
              <div>
                <p class="text-highlighted font-medium">Cursor follower</p>
                <p class="text-muted mt-0.5 text-xs">
                  {{ showCursor ? 'Active — move your mouse' : 'Disabled' }}
                </p>
              </div>
              <UButton
                :color="showCursor ? 'error' : 'primary'"
                @click="() => (showCursor = !showCursor)"
              >
                <UIcon
                  :name="showCursor ? 'i-lucide-x' : 'i-lucide-mouse-pointer-2'"
                  class="mr-2"
                />
                {{ showCursor ? 'Disable' : 'Enable' }}
              </UButton>
            </div>

            <!-- Type selector -->
            <div class="bg-accented rounded-2xl px-6 py-5">
              <p class="text-muted mb-4 text-sm">Type</p>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="t in ['dot', 'ring', 'dot-ring', 'glow'] as const"
                  :key="t"
                  class="rounded-xl py-2.5 text-sm font-medium transition-colors"
                  :class="
                    cursorType === t
                      ? 'bg-primary text-highlighted'
                      : 'bg-accented text-toned hover:bg-elevated'
                  "
                  @click="() => (cursorType = t)"
                >
                  {{ t }}
                </button>
              </div>
              <p class="text-toned mt-3 font-mono text-xs">type="{{ cursorType }}"</p>
            </div>

            <!-- Visibility toggle -->
            <div class="bg-accented flex items-center justify-between rounded-2xl px-6 py-4">
              <div>
                <p class="text-highlighted font-medium">Visible</p>
                <p class="text-muted mt-0.5 text-xs">Fades without remounting</p>
              </div>
              <button
                class="relative h-6 w-12 rounded-full transition-colors"
                :class="cursorVisible ? 'bg-primary' : 'bg-accented'"
                @click="() => (cursorVisible = !cursorVisible)"
              >
                <span
                  class="absolute top-1 h-4 w-4 rounded-full bg-white transition-all"
                  :class="cursorVisible ? 'left-7' : 'left-1'"
                />
              </button>
            </div>

            <!-- Smoothing slider -->
            <div class="bg-accented rounded-2xl px-6 py-5">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-muted text-sm">Smoothing</p>
                <p class="text-highlighted font-mono text-sm">{{ cursorSmoothing.toFixed(2) }}</p>
              </div>
              <input
                v-model.number="cursorSmoothing"
                type="range"
                min="0.02"
                max="0.5"
                step="0.01"
                class="accent-primary w-full"
              />
              <div class="text-toned mt-1.5 flex justify-between text-xs">
                <span>0.02 — heavy lag</span>
                <span>0.5 — instant</span>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Footer nav -->
      <section class="bg-default py-16">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 class="text-highlighted mb-2 text-2xl font-bold">Motion Interactions</h2>
              <p class="text-muted">Magnetic, tilt, count-up, velocity effects</p>
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
