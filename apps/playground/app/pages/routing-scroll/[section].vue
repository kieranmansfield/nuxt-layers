<script setup lang="ts">
  definePageMeta({ layout: false })

  const route = useRoute()

  const urlMode = ref<'replace' | 'push'>('replace')
  const activeSection = ref((route.params.section as string) || 'intro')

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'use-cases', label: 'Use Cases' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'get-started', label: 'Get Started' },
  ]

  const sectionEls = ref<HTMLElement[]>([])

  onMounted(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
    sectionEls.value = els

    const initial = els.find((el) => el.getAttribute('data-section') === activeSection.value)
    initial?.scrollIntoView()

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (!visible) return
        const id = visible.target.getAttribute('data-section')
        if (!id) return
        activeSection.value = id
        const method = urlMode.value === 'replace' ? 'replaceState' : 'pushState'
        window.history[method](null, '', `/routing-scroll/${id}`)
      },
      { threshold: 0.5 }
    )

    els.forEach((el) => observer.observe(el))
    onUnmounted(() => observer.disconnect())
  })

  function scrollTo(index: number) {
    sectionEls.value[index]?.scrollIntoView({ behavior: 'smooth' })
  }
</script>

<template>
  <div class="bg-default text-highlighted">
    <!-- Fixed: back nav -->
    <div class="fixed top-4 left-4 z-50">
      <NuxtLink
        to="/routing"
        class="text-highlighted/60 hover:text-highlighted flex items-center gap-1.5 text-sm transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="text-base" />
        Routing
      </NuxtLink>
    </div>

    <!-- Fixed: path badge -->
    <div class="fixed top-4 right-16 z-50">
      <span
        class="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/20 px-3 py-1 font-mono text-xs text-green-400"
      >
        <span class="size-1.5 animate-pulse rounded-full bg-green-400" />
        /routing-scroll/{{ activeSection }}
      </span>
    </div>

    <!-- Fixed: dot nav -->
    <div class="fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col gap-3">
      <button
        v-for="(section, i) in sections"
        :key="section.id"
        :title="section.label"
        class="flex size-6 items-center justify-center"
        @click="() => scrollTo(i)"
      >
        <span
          class="rounded-full transition-all duration-300"
          :class="
            activeSection === section.id
              ? 'bg-highlighted size-3'
              : 'bg-highlighted/30 hover:bg-highlighted/60 size-2'
          "
        />
      </button>
    </div>

    <!-- Fixed: mode toggle -->
    <div
      class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm"
    >
      <button
        v-for="mode in ['replace', 'push'] as const"
        :key="mode"
        class="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
        :class="
          urlMode === mode
            ? 'bg-inverted text-inverted'
            : 'text-highlighted/60 hover:text-highlighted'
        "
        @click="() => (urlMode = mode)"
      >
        {{ mode }}
      </button>
    </div>

    <!-- Section 1: Intro -->
    <section
      data-section="intro"
      class="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-950 to-slate-900"
    >
      <div class="space-y-6 px-8 text-center">
        <div
          class="text-highlighted/60 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs"
        >
          <UIcon name="i-lucide-link" class="text-sm" />
          layers/routing
        </div>
        <h1 class="text-6xl font-black tracking-tight md:text-8xl">Scroll Routing</h1>
        <p class="text-highlighted/50 mx-auto max-w-lg text-xl md:text-2xl">
          The URL updates as you scroll
        </p>
        <div class="animate-bounce pt-8">
          <UIcon name="i-lucide-chevrons-down" class="text-highlighted/30 text-3xl" />
        </div>
      </div>
    </section>

    <!-- Section 2: How It Works -->
    <section
      data-section="how-it-works"
      class="flex min-h-screen items-center justify-center bg-linear-to-b from-blue-950 to-blue-900"
    >
      <div class="w-full max-w-2xl space-y-8 px-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">How It Works</h2>
          <p class="text-lg text-blue-200/70">
            An <code class="font-mono text-blue-300">IntersectionObserver</code> watches each
            section. When a section crosses the 50% threshold, the URL path updates — no page
            reload, no scroll jump.
          </p>
        </div>
        <div class="overflow-hidden rounded-xl border border-blue-500/20 bg-black/40">
          <div class="flex items-center gap-2 border-b border-blue-500/20 bg-black/30 px-4 py-2.5">
            <span class="size-2.5 rounded-full bg-red-500/70" />
            <span class="size-2.5 rounded-full bg-yellow-500/70" />
            <span class="size-2.5 rounded-full bg-green-500/70" />
            <span class="text-highlighted/30 ml-2 font-mono text-xs">scroll-routing.client.ts</span>
          </div>
          <pre
            class="overflow-auto p-5 text-sm leading-relaxed text-blue-100/80"
          ><code>const observer = new IntersectionObserver(
  (entries) =&gt; {
    const visible = entries.find(e =&gt; e.isIntersecting)
    if (!visible) return
    const id = visible.target.getAttribute('data-section')
    router.replace('/routing-scroll/' + id)
  },
  { threshold: 0.5 },
)

document.querySelectorAll('[data-section]')
  .forEach(el =&gt; observer.observe(el))</code></pre>
        </div>
        <p class="text-sm text-blue-200/50">
          This page mirrors that exact pattern — self-contained, no plugin config required.
        </p>
      </div>
    </section>

    <!-- Section 3: Use Cases -->
    <section
      data-section="use-cases"
      class="flex min-h-screen items-center justify-center bg-linear-to-b from-violet-950 to-violet-900"
    >
      <div class="w-full max-w-2xl space-y-8 px-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">Use Cases</h2>
          <p class="text-lg text-violet-200/70">Where scroll routing shines</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="item in [
              {
                icon: 'i-lucide-layout',
                label: 'Landing pages',
                desc: 'Track which section visitors reach without polluting history',
              },
              {
                icon: 'i-lucide-book-open',
                label: 'Documentation',
                desc: 'Deep-link to sections without manual anchor management',
              },
              {
                icon: 'i-lucide-layers',
                label: 'Single-page apps',
                desc: 'One page, multiple logical views — all URL-addressable',
              },
              {
                icon: 'i-lucide-megaphone',
                label: 'Marketing microsites',
                desc: 'Section-aware analytics with zero JS overhead',
              },
            ]"
            :key="item.label"
            class="space-y-2 rounded-xl border border-violet-500/20 bg-violet-500/10 p-5"
          >
            <div class="flex items-center gap-2.5">
              <div class="rounded-lg bg-violet-500/20 p-2">
                <UIcon :name="item.icon" class="text-lg text-violet-300" />
              </div>
              <span class="text-sm font-semibold">{{ item.label }}</span>
            </div>
            <p class="text-xs text-violet-200/50">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Configuration -->
    <section
      data-section="configuration"
      class="flex min-h-screen items-center justify-center bg-linear-to-b from-emerald-950 to-emerald-900"
    >
      <div class="w-full max-w-2xl space-y-8 px-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">Configuration</h2>
          <p class="text-lg text-emerald-200/70">
            Enable via <code class="font-mono text-emerald-300">app.config.ts</code> in your app.
          </p>
        </div>
        <div class="overflow-hidden rounded-xl border border-emerald-500/20 bg-black/40">
          <div
            class="flex items-center gap-2 border-b border-emerald-500/20 bg-black/30 px-4 py-2.5"
          >
            <span class="size-2.5 rounded-full bg-red-500/70" />
            <span class="size-2.5 rounded-full bg-yellow-500/70" />
            <span class="size-2.5 rounded-full bg-green-500/70" />
            <span class="text-highlighted/30 ml-2 font-mono text-xs">app/app.config.ts</span>
          </div>
          <pre
            class="overflow-auto p-5 text-sm leading-relaxed text-emerald-100/80"
          ><code>export default defineAppConfig({
  routingLayer: {
    scrollRouting: {
      enabled: true,
      mode: 'replace', // or 'push'
    },
  },
})</code></pre>
        </div>
        <div class="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-emerald-300">Live on this page</span>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 font-mono text-xs text-emerald-400"
            >
              /routing-scroll/{{ activeSection }}
            </span>
          </div>
          <p class="text-xs text-emerald-200/50">
            Toggle the mode at the bottom of the screen — "replace" keeps history clean, "push" lets
            you step back through sections.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 5: Get Started -->
    <section
      data-section="get-started"
      class="flex min-h-screen items-center justify-center bg-linear-to-b from-orange-950 to-orange-900"
    >
      <div class="w-full max-w-xl space-y-8 px-8 text-center">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">Get Started</h2>
          <p class="text-lg text-orange-200/70">
            Enable scroll routing in any app with two lines of config — then mark your sections with
            <code class="font-mono text-orange-300">data-section</code>.
          </p>
        </div>
        <NuxtLink
          to="/routing"
          class="bg-inverted text-inverted hover:bg-muted inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
        >
          Explore the full Routing demo
          <UIcon name="i-lucide-arrow-right" class="text-base" />
        </NuxtLink>
        <p class="text-xs text-orange-200/40">
          Uses IntersectionObserver at threshold: 0.5 — same pattern as the scroll-routing plugin
        </p>
      </div>
    </section>
  </div>
</template>
