<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('rose')
  onUnmounted(() => setPageAccent(null))

  const variants = [
    { name: 'default', label: 'Default', description: 'Fades and moves all properties together' },
    { name: 'fade', label: 'Fade', description: 'Opacity-only crossfade' },
    { name: 'slide', label: 'Slide', description: 'Transform + opacity slide-in' },
  ]

  const activeVariant = ref('fade')
  const duration = ref(400)
  const replayKey = ref(0)

  function replay() {
    replayKey.value++
  }

  const cssClasses = [
    { class: '.transition-default', props: 'all · 300ms · cubic-bezier(0.4, 0, 0.2, 1)' },
    { class: '.transition-fade', props: 'opacity · 300ms · ease-out' },
    { class: '.transition-slide', props: 'transform, opacity · 300ms · ease-out' },
  ]
</script>

<template>
  <LayoutPage
    title="Transitions Layer Demo"
    description="CSS transition classes + the MotionTransition wrapper component"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="TRANSITIONS"
        description="Lightweight CSS transition classes and the MotionTransition wrapper for element-level enter/leave effects."
      >
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" @click="() => $router.push('#demo')">View Demo</UButton>
          <UButton size="lg" variant="ghost" to="/page-transitions">
            <UIcon name="i-lucide-square-stack" class="mr-2" />
            Page Transitions
          </UButton>
          <UButton size="lg" variant="ghost" to="/motion">
            <UIcon name="i-lucide-sparkles" class="mr-2" />
            Motion Layer
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Demo -->
      <section id="demo" class="py-24 bg-default">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-highlighted mb-4">MotionTransition</h2>
            <p class="text-muted text-lg">
              Pick a variant, then replay to see the enter animation
            </p>
          </div>

          <div class="grid lg:grid-cols-[280px_1fr] gap-8 max-w-5xl mx-auto">
            <!-- Controls -->
            <div class="space-y-4">
              <button
                v-for="variant in variants"
                :key="variant.name"
                type="button"
                class="w-full rounded-xl border p-4 cursor-pointer transition-colors text-left"
                :class="
                  activeVariant === variant.name
                    ? 'border-primary bg-primary/10'
                    : 'border-default bg-accented/50 hover:border-accented'
                "
                @click="activeVariant = variant.name"
              >
                <div class="font-semibold text-highlighted">{{ variant.label }}</div>
                <p class="text-sm text-muted">{{ variant.description }}</p>
                <code class="text-xs text-primary">name="{{ variant.name }}"</code>
              </button>

              <div class="rounded-xl border border-default bg-accented/50 p-4">
                <label for="transition-duration" class="text-sm text-muted block mb-2">
                  Duration: {{ duration }}ms
                </label>
                <input
                  id="transition-duration"
                  v-model.number="duration"
                  type="range"
                  min="100"
                  max="1200"
                  step="50"
                  class="w-full"
                />
              </div>

              <UButton block size="lg" @click="replay">
                <UIcon name="i-lucide-rotate-ccw" class="mr-2" />
                Replay
              </UButton>
            </div>

            <!-- Preview -->
            <div class="bg-default rounded-3xl p-12 flex items-center justify-center min-h-90">
              <MotionTransition :key="replayKey" :name="activeVariant" :duration>
                <div
                  class="w-64 h-64 rounded-3xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30"
                >
                  <div class="text-center text-highlighted p-6">
                    <UIcon name="i-lucide-square-asterisk" class="text-5xl mb-3" />
                    <p class="text-lg font-bold">{{ activeVariant }}</p>
                    <p class="text-sm text-highlighted/70">{{ duration }}ms</p>
                  </div>
                </div>
              </MotionTransition>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- CSS Reference -->
      <section class="py-24 bg-default">
        <UContainer>
          <div class="max-w-3xl mx-auto">
            <h3 class="text-3xl font-bold text-highlighted mb-8 text-center">CSS Class Reference</h3>
            <div class="grid gap-4">
              <div
                v-for="entry in cssClasses"
                :key="entry.class"
                class="bg-muted rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 border border-default"
              >
                <code class="text-primary font-mono text-sm whitespace-nowrap">{{
                  entry.class
                }}</code>
                <span class="text-muted flex-1">{{ entry.props }}</span>
              </div>
            </div>
            <p class="text-muted text-sm mt-6 text-center">
              Apply these classes directly to any element, or wrap content in
              <code class="text-primary">&lt;MotionTransition name="fade" /&gt;</code>
              for a managed enter/leave lifecycle.
            </p>
          </div>
        </UContainer>
      </section>

      <DemoPageFooter
        name="Transitions Layer"
        description="CSS transition classes + the MotionTransition component"
        :links="[
          { label: 'Page Transitions', to: '/page-transitions', icon: 'i-lucide-square-stack' },
          { label: 'Motion Layer', to: '/motion', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
