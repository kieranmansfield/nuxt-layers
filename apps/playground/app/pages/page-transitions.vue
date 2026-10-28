<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('fuchsia')
  onUnmounted(() => setPageAccent(null))

  const { transitionName, duration, setTransition, route } = usePageTransition()

  const presets = [
    { name: 'fade', duration: 300 },
    { name: 'slide', duration: 400 },
    { name: 'default', duration: 250 },
  ]

  const replayKey = ref(0)
  function preview(name: string, ms: number) {
    setTransition(name, ms)
    replayKey.value++
  }
</script>

<template>
  <LayoutPage
    title="Page Transitions Layer Demo"
    description="usePageTransition() — reactive page-transition state driven by app.config defaults"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="PAGE TRANSITIONS"
        description="usePageTransition() exposes the active transition name + duration as shared reactive state, seeded from app.config.pageTransitions on every navigation."
      >
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" @click="() => $router.push('#demo')">View Demo</UButton>
          <UButton size="lg" variant="ghost" to="/transitions">
            <UIcon name="i-lucide-square-asterisk" class="mr-2" />
            Transitions
          </UButton>
          <UButton size="lg" variant="ghost" to="/motion">
            <UIcon name="i-lucide-sparkles" class="mr-2" />
            Motion Layer
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Live state -->
      <DemoSection id="demo" title="Live Transition State">
        <template #description>
          Reactive values returned from <code class="text-primary">usePageTransition()</code>
        </template>

        <div class="mx-auto mb-16 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div class="bg-accented border-accented rounded-2xl border p-6 text-center">
            <p class="text-muted mb-2 text-xs tracking-widest uppercase">transitionName</p>
            <p class="text-primary font-mono text-3xl font-bold">{{ transitionName }}</p>
          </div>
          <div class="bg-accented border-accented rounded-2xl border p-6 text-center">
            <p class="text-muted mb-2 text-xs tracking-widest uppercase">duration</p>
            <p class="text-primary font-mono text-3xl font-bold">{{ duration }}ms</p>
          </div>
          <div class="bg-accented border-accented rounded-2xl border p-6 text-center">
            <p class="text-muted mb-2 text-xs tracking-widest uppercase">route.path</p>
            <p class="text-highlighted truncate font-mono text-lg font-bold">{{ route.path }}</p>
          </div>
        </div>

        <div class="mb-8 text-center">
          <h3 class="text-highlighted mb-2 text-2xl font-bold">Try setTransition()</h3>
          <p class="text-muted">
            Calls update the shared
            <code class="text-primary">page-transition:current</code> state that the navigation
            plugin reads on <code class="text-primary">page:start</code>
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton
            v-for="preset in presets"
            :key="preset.name"
            :variant="transitionName === preset.name ? 'solid' : 'outline'"
            @click="() => preview(preset.name, preset.duration)"
          >
            {{ preset.name }} · {{ preset.duration }}ms
          </UButton>
        </div>
        <div class="mt-12 flex justify-center">
          <MotionTransition
            :key="replayKey"
            :preset="transitionName === 'slide' ? 'slide-end' : 'fade'"
            :duration
          >
            <div
              class="from-primary shadow-primary/30 flex h-48 w-48 items-center justify-center rounded-3xl bg-linear-to-br to-purple-600 shadow-2xl"
            >
              <UIcon name="i-lucide-arrow-right-left" class="text-highlighted text-5xl" />
            </div>
          </MotionTransition>
        </div>
      </DemoSection>

      <!-- How it works -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mx-auto max-w-3xl">
            <h3 class="text-highlighted mb-8 text-center text-3xl font-bold">How It Works</h3>
            <div class="grid gap-4">
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">app.config.pageTransitions</code>
                <p class="text-muted mt-2">
                  Layer default:
                  <code class="text-toned">{{ '{ default: "fade", duration: 300 }' }}</code> —
                  override per-app via <code class="text-toned">app.config.ts</code>
                </p>
              </div>
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">page-transitions.client.ts</code>
                <p class="text-muted mt-2">
                  Nitro plugin hook — on every <code class="text-toned">page:start</code> it resets
                  the shared state back to the configured default
                </p>
              </div>
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">usePageTransition(name?)</code>
                <p class="text-muted mt-2">
                  Call inside a page's <code class="text-toned">setup()</code> to override the
                  transition for that route, or use
                  <code class="text-toned">setTransition()</code>
                  to change it imperatively
                </p>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <DemoPageFooter
        name="Page Transitions Layer"
        description="Reactive page-transition state for Nuxt navigations"
        :links="[
          { label: 'Transitions', to: '/transitions', icon: 'i-lucide-square-asterisk' },
          { label: 'Motion Layer', to: '/motion', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
