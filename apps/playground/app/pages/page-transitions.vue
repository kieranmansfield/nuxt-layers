<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('fuchsia')
  onUnmounted(() => setPageAccent(null))

  const { back } = useBackNavigation('/motion')

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
    <div class="page-transitions-page">
      <!-- Hero -->
      <section
        class="min-h-[70vh] flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
        <div
          class="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent"
        />
        <div class="text-center z-10 px-4">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-8">
            PAGE <span class="text-primary">TRANSITIONS</span>
          </h1>
          <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            <code class="text-primary">usePageTransition()</code> exposes the active transition name
            + duration as shared reactive state, seeded from
            <code class="text-primary">app.config.pageTransitions</code> on every navigation.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton size="lg" @click="$router.push('#demo')">View Demo</UButton>
            <UButton size="lg" variant="outline" @click="back()">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Back
            </UButton>
            <UButton size="lg" variant="ghost" to="/transitions">
              <UIcon name="i-lucide-square-asterisk" class="mr-2" />
              Transitions
            </UButton>
            <UButton size="lg" variant="ghost" to="/motion">
              <UIcon name="i-lucide-sparkles" class="mr-2" />
              Motion Layer
            </UButton>
          </div>
        </div>
      </section>

      <!-- Live state -->
      <section id="demo" class="py-24 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Live Transition State</h2>
            <p class="text-gray-400 text-lg">
              Reactive values returned from <code class="text-primary">usePageTransition()</code>
            </p>
          </div>

          <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            <div class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">transitionName</p>
              <p class="text-3xl font-bold text-primary font-mono">{{ transitionName }}</p>
            </div>
            <div class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">duration</p>
              <p class="text-3xl font-bold text-primary font-mono">{{ duration }}ms</p>
            </div>
            <div class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">route.path</p>
              <p class="text-lg font-bold text-white font-mono truncate">{{ route.path }}</p>
            </div>
          </div>

          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-white mb-2">Try setTransition()</h3>
            <p class="text-gray-400">
              Calls update the shared
              <code class="text-primary">page-transition:current</code> state that the navigation
              plugin reads on <code class="text-primary">page:start</code>
            </p>
          </div>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton
              v-for="preset in presets"
              :key="preset.name"
              :variant="transitionName === preset.name ? 'solid' : 'outline'"
              @click="preview(preset.name, preset.duration)"
            >
              {{ preset.name }} · {{ preset.duration }}ms
            </UButton>
          </div>
          <div :key="replayKey" class="mt-12 flex justify-center">
            <div
              class="w-48 h-48 rounded-3xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30 transition-page-preview"
              :style="{ transitionDuration: `${duration}ms` }"
            >
              <UIcon name="i-lucide-arrow-right-left" class="text-5xl text-white" />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- How it works -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="max-w-3xl mx-auto">
            <h3 class="text-3xl font-bold text-white mb-8 text-center">How It Works</h3>
            <div class="grid gap-4">
              <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <code class="text-primary font-mono text-sm">app.config.pageTransitions</code>
                <p class="text-gray-400 mt-2">
                  Layer default:
                  <code class="text-gray-300">{{ '{ default: "fade", duration: 300 }' }}</code> —
                  override per-app via <code class="text-gray-300">app.config.ts</code>
                </p>
              </div>
              <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <code class="text-primary font-mono text-sm">page-transitions.client.ts</code>
                <p class="text-gray-400 mt-2">
                  Nitro plugin hook — on every <code class="text-gray-300">page:start</code> it
                  resets the shared state back to the configured default
                </p>
              </div>
              <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <code class="text-primary font-mono text-sm">usePageTransition(name?)</code>
                <p class="text-gray-400 mt-2">
                  Call inside a page's <code class="text-gray-300">setup()</code> to override the
                  transition for that route, or use
                  <code class="text-gray-300">setTransition()</code>
                  to change it imperatively
                </p>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Footer Nav -->
      <section class="py-16 bg-gray-900">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">Page Transitions Layer</h2>
              <p class="text-gray-400">Reactive page-transition state for Nuxt navigations</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/transitions">
                <UIcon name="i-lucide-square-asterisk" class="mr-2" />
                Transitions
              </UButton>
              <UButton variant="ghost" to="/motion">
                <UIcon name="i-lucide-sparkles" class="mr-2" />
                Motion Layer
              </UButton>
              <UButton variant="outline" @click="back()">Back</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>

<style scoped>
  .transition-page-preview {
    transition-property: transform, opacity, border-radius;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .transition-page-preview:hover {
    transform: scale(1.05) rotate(-2deg);
    border-radius: 1.5rem;
  }
</style>
