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
    { threshold: 0.5 },
  )

  els.forEach((el) => observer.observe(el))
  onUnmounted(() => observer.disconnect())
})

function scrollTo(index: number) {
  sectionEls.value[index]?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="bg-slate-950 text-white">
    <!-- Fixed: back nav -->
    <div class="fixed top-4 left-4 z-50">
      <NuxtLink
        to="/routing"
        class="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="text-base" />
        Routing
      </NuxtLink>
    </div>

    <!-- Fixed: path badge -->
    <div class="fixed top-4 right-16 z-50">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 border border-green-500/40 px-3 py-1 text-xs font-mono text-green-400"
      >
        <span class="size-1.5 rounded-full bg-green-400 animate-pulse" />
        /routing-scroll/{{ activeSection }}
      </span>
    </div>

    <!-- Fixed: dot nav -->
    <div class="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      <button
        v-for="(section, i) in sections"
        :key="section.id"
        :title="section.label"
        class="flex items-center justify-center size-6"
        @click="scrollTo(i)"
      >
        <span
          class="transition-all duration-300 rounded-full"
          :class="
            activeSection === section.id ? 'size-3 bg-white' : 'size-2 bg-white/30 hover:bg-white/60'
          "
        />
      </button>
    </div>

    <!-- Fixed: mode toggle -->
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm p-1"
    >
      <button
        v-for="mode in ['replace', 'push'] as const"
        :key="mode"
        class="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
        :class="urlMode === mode ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'"
        @click="urlMode = mode"
      >
        {{ mode }}
      </button>
    </div>

    <!-- Section 1: Intro -->
    <section
      data-section="intro"
      class="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-950 to-slate-900"
    >
      <div class="text-center space-y-6 px-8">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-white/60"
        >
          <UIcon name="i-lucide-link" class="text-sm" />
          layers/routing
        </div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tight">Scroll Routing</h1>
        <p class="text-xl md:text-2xl text-white/50 max-w-lg mx-auto">
          The URL updates as you scroll
        </p>
        <div class="pt-8 animate-bounce">
          <UIcon name="i-lucide-chevrons-down" class="text-3xl text-white/30" />
        </div>
      </div>
    </section>

    <!-- Section 2: How It Works -->
    <section
      data-section="how-it-works"
      class="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-950 to-blue-900"
    >
      <div class="max-w-2xl w-full px-8 space-y-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">How It Works</h2>
          <p class="text-blue-200/70 text-lg">
            An <code class="font-mono text-blue-300">IntersectionObserver</code> watches each
            section. When a section crosses the 50% threshold, the URL path updates — no page
            reload, no scroll jump.
          </p>
        </div>
        <div class="rounded-xl bg-black/40 border border-blue-500/20 overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 border-b border-blue-500/20 bg-black/30">
            <span class="size-2.5 rounded-full bg-red-500/70" />
            <span class="size-2.5 rounded-full bg-yellow-500/70" />
            <span class="size-2.5 rounded-full bg-green-500/70" />
            <span class="ml-2 text-xs text-white/30 font-mono">scroll-routing.client.ts</span>
          </div>
          <pre
            class="text-sm p-5 overflow-auto text-blue-100/80 leading-relaxed"
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
      class="min-h-screen flex items-center justify-center bg-linear-to-b from-violet-950 to-violet-900"
    >
      <div class="max-w-2xl w-full px-8 space-y-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">Use Cases</h2>
          <p class="text-violet-200/70 text-lg">Where scroll routing shines</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            class="rounded-xl border border-violet-500/20 bg-violet-500/10 p-5 space-y-2"
          >
            <div class="flex items-center gap-2.5">
              <div class="rounded-lg bg-violet-500/20 p-2">
                <UIcon :name="item.icon" class="text-violet-300 text-lg" />
              </div>
              <span class="font-semibold text-sm">{{ item.label }}</span>
            </div>
            <p class="text-xs text-violet-200/50">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Configuration -->
    <section
      data-section="configuration"
      class="min-h-screen flex items-center justify-center bg-linear-to-b from-emerald-950 to-emerald-900"
    >
      <div class="max-w-2xl w-full px-8 space-y-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">Configuration</h2>
          <p class="text-emerald-200/70 text-lg">
            Enable via <code class="font-mono text-emerald-300">app.config.ts</code> in your app.
          </p>
        </div>
        <div class="rounded-xl bg-black/40 border border-emerald-500/20 overflow-hidden">
          <div
            class="flex items-center gap-2 px-4 py-2.5 border-b border-emerald-500/20 bg-black/30"
          >
            <span class="size-2.5 rounded-full bg-red-500/70" />
            <span class="size-2.5 rounded-full bg-yellow-500/70" />
            <span class="size-2.5 rounded-full bg-green-500/70" />
            <span class="ml-2 text-xs text-white/30 font-mono">app/app.config.ts</span>
          </div>
          <pre
            class="text-sm p-5 overflow-auto text-emerald-100/80 leading-relaxed"
          ><code>export default defineAppConfig({
  routingLayer: {
    scrollRouting: {
      enabled: true,
      mode: 'replace', // or 'push'
    },
  },
})</code></pre>
        </div>
        <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-emerald-300">Live on this page</span>
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-mono text-emerald-400"
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
      class="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-950 to-orange-900"
    >
      <div class="max-w-xl w-full px-8 text-center space-y-8">
        <div class="space-y-3">
          <h2 class="text-4xl font-bold">Get Started</h2>
          <p class="text-orange-200/70 text-lg">
            Enable scroll routing in any app with two lines of config — then mark your sections with
            <code class="font-mono text-orange-300">data-section</code>.
          </p>
        </div>
        <NuxtLink
          to="/routing"
          class="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3 font-semibold text-sm hover:bg-orange-50 transition-colors"
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
