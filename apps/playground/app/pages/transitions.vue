<script setup lang="ts">
  import type { MotionPreset } from '#layers/core/app/types/motion'

  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('rose')
  onUnmounted(() => setPageAccent(null))

  const variants: { name: MotionPreset; label: string; description: string }[] = [
    { name: 'fade', label: 'Fade', description: 'Opacity only' },
    { name: 'rise', label: 'Rise', description: 'Moves up into place' },
    { name: 'drop', label: 'Drop', description: 'Moves down into place' },
    { name: 'slide-start', label: 'Slide start', description: 'Enters from the start side' },
    { name: 'slide-end', label: 'Slide end', description: 'Enters from the end side' },
    { name: 'scale', label: 'Scale', description: 'Grows slightly into place' },
    { name: 'blur', label: 'Blur', description: 'Comes into focus' },
  ]

  const activeVariant = ref<MotionPreset>('fade')
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
        <div class="flex flex-wrap justify-center gap-4">
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
      <DemoSection
        id="demo"
        title="MotionTransition"
        description="Pick a variant, then replay to see the enter animation"
      >
        <div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[280px_1fr]">
          <!-- Controls -->
          <div class="space-y-4">
            <button
              v-for="variant in variants"
              :key="variant.name"
              type="button"
              class="w-full cursor-pointer rounded-xl border p-4 text-left transition-colors"
              :class="
                activeVariant === variant.name
                  ? 'border-primary bg-primary/10'
                  : 'border-default bg-accented/50 hover:border-accented'
              "
              @click="activeVariant = variant.name"
            >
              <div class="text-highlighted font-semibold">{{ variant.label }}</div>
              <p class="text-muted text-sm">{{ variant.description }}</p>
              <code class="text-primary text-xs">preset="{{ variant.name }}"</code>
            </button>

            <div class="border-default bg-accented/50 rounded-xl border p-4">
              <label for="transition-duration" class="text-muted mb-2 block text-sm">
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
          <div class="bg-default flex min-h-90 items-center justify-center rounded-3xl p-12">
            <MotionTransition :key="replayKey" :preset="activeVariant" :duration>
              <div
                class="from-primary shadow-primary/30 flex h-64 w-64 items-center justify-center rounded-3xl bg-linear-to-br to-purple-600 shadow-2xl"
              >
                <div class="text-highlighted p-6 text-center">
                  <UIcon name="i-lucide-square-asterisk" class="mb-3 text-5xl" />
                  <p class="text-lg font-bold">{{ activeVariant }}</p>
                  <p class="text-highlighted/70 text-sm">{{ duration }}ms</p>
                </div>
              </div>
            </MotionTransition>
          </div>
        </div>
      </DemoSection>

      <!-- CSS Reference -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mx-auto max-w-3xl">
            <h3 class="text-highlighted mb-8 text-center text-3xl font-bold">
              CSS Class Reference
            </h3>
            <div class="grid gap-4">
              <div
                v-for="entry in cssClasses"
                :key="entry.class"
                class="bg-muted border-default flex flex-col gap-4 rounded-xl border p-6 md:flex-row md:items-center"
              >
                <code class="text-primary font-mono text-sm whitespace-nowrap">{{
                  entry.class
                }}</code>
                <span class="text-muted flex-1">{{ entry.props }}</span>
              </div>
            </div>
            <p class="text-muted mt-6 text-center text-sm">
              Apply these classes directly to any element, or wrap content in
              <code class="text-primary">&lt;MotionTransition preset="rise" /&gt;</code>
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
