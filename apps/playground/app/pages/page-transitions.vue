<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('fuchsia')
  onUnmounted(() => setPageAccent(null))

  const { transitionName, duration, setTransition, route } = usePageTransition()

  const presets = [
    'fade',
    'slide',
    'crossfade',
    'slide-x',
    'wipe',
    'curved',
    'shutter',
    'columns',
    'pixelate',
    'morph',
  ]
  const selected = ref('curved')
  const ms = ref(600)

  function goProgrammatic() {
    setTransition(selected.value, ms.value)
    return navigateTo('/page-transitions-target')
  }
</script>

<template>
  <LayoutPage
    title="Page Transitions Layer Demo"
    description="GSAP Flip page-transition engine: presets, route rules, shared-element morph"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="PAGE TRANSITIONS"
        description="Pick a preset and navigate: CSS-class and GSAP presets, overlay wipes, and a Flip shared-element morph. Chosen per link, per route, by rule, or in code."
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
          Preset in use for the latest navigation, from
          <code class="text-primary">usePageTransition()</code>
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
          <h3 class="text-highlighted mb-2 text-2xl font-bold">Pick a preset, then navigate</h3>
          <p class="text-muted">
            Links carry <code class="text-primary">data-transition</code>; the morph preset animates
            the box below into the target page via <code class="text-primary">data-flip-id</code>
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <UButton
            v-for="name in presets"
            :key="name"
            :variant="selected === name ? 'solid' : 'outline'"
            @click="selected = name"
          >
            {{ name }}
          </UButton>
        </div>
        <div class="mt-12 flex flex-col items-center gap-6">
          <div
            data-flip-id="demo-box"
            class="from-primary flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br to-purple-600"
          >
            <UIcon name="i-lucide-arrow-right-left" class="text-highlighted text-3xl" />
          </div>
          <label class="text-muted flex items-center gap-3 text-sm">
            Duration per phase
            <input v-model.number="ms" type="range" min="150" max="1500" step="50" />
            <span class="text-primary font-mono">{{ ms }}ms</span>
          </label>
          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink
              :data-transition="selected"
              :data-transition-duration="ms"
              to="/page-transitions-target"
            >
              <UButton size="lg">Link: data-transition="{{ selected }}"</UButton>
            </NuxtLink>
            <UButton size="lg" variant="outline" @click="goProgrammatic">
              setTransition('{{ selected }}', {{ ms }})
            </UButton>
          </div>
        </div>
      </DemoSection>

      <!-- How it works -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mx-auto max-w-3xl">
            <h3 class="text-highlighted mb-8 text-center text-3xl font-bold">How It Works</h3>
            <div class="grid gap-4">
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm"
                  >Choosing a preset (first match wins)</code
                >
                <p class="text-muted mt-2">
                  <code class="text-toned">setTransition()</code> → clicked
                  <code class="text-toned">[data-transition]</code> link →
                  <code class="text-toned">definePageMeta({ pageTransitionPreset })</code> →
                  <code class="text-toned">pageTransitions.rules</code> →
                  <code class="text-toned">pageTransitions.default</code>.
                  <code class="text-toned">none</code> disables.
                </p>
              </div>
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">app.config.pageTransitions</code>
                <p class="text-muted mt-2">
                  <code class="text-toned">{{
                    '{ default, duration, rules: [{ from?, to?, name, duration? }] }'
                  }}</code>
                  — rules match path prefixes, e.g. leaving
                  <code class="text-toned">/blog</code> uses <code class="text-toned">curved</code>.
                </p>
              </div>
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">Presets</code>
                <p class="text-muted mt-2">
                  CSS classes: fade, slide, default. GSAP: crossfade (sync), slide-x (reverses on
                  back), wipe, curved, shutter, columns, pixelate, morph (GSAP Flip on matching
                  <code class="text-toned">data-flip-id</code>). Add your own with
                  <code class="text-toned">registerPageTransitionPreset()</code>.
                </p>
              </div>
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">Hooks for styling</code>
                <p class="text-muted mt-2">
                  While running, <code class="text-toned">&lt;html&gt;</code> gets
                  <code class="text-toned">.is-page-transitioning</code> and
                  <code class="text-toned">data-page-transition=&quot;name&quot;</code>; overlay
                  presets draw into
                  <code class="text-toned">#page-transition-overlay</code> (colour:
                  <code class="text-toned">--page-transition-color</code>).
                </p>
              </div>
              <div class="bg-default border-default rounded-xl border p-6">
                <code class="text-primary font-mono text-sm">Fallbacks</code>
                <p class="text-muted mt-2">
                  Reduced motion (incl. the ThemePicker override) swaps instantly. Pages stay
                  visible without JS, and a stuck animation times out so navigation never hangs.
                </p>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <DemoPageFooter
        name="Page Transitions Layer"
        description="GSAP Flip page-transition engine for Nuxt navigations"
        :links="[
          { label: 'Transitions', to: '/transitions', icon: 'i-lucide-square-asterisk' },
          { label: 'Motion Layer', to: '/motion', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
