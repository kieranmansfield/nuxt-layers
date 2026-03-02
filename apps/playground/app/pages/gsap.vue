<script setup lang="ts">
useSeoMeta({
  title: 'v-gsap Directive Guide',
  description: 'Complete reference for the v-gsap directive with live examples and copyable code',
})

const { setPageAccent } = useAccentColor()
setPageAccent('violet')
onUnmounted(() => setPageAccent(null))

const copied = ref<string | null>(null)
const replayKeys = ref<Record<string, number>>({})

async function copy(text: string, id: string) {
  await navigator.clipboard.writeText(text.trim())
  copied.value = id
  setTimeout(() => { copied.value = null }, 2000)
}

function replay(id: string) {
  replayKeys.value[id] = (replayKeys.value[id] ?? 0) + 1
}

const snippets = {
  from: `<div
  v-gsap.from="{ opacity: 0, y: 40, duration: 0.8 }"
  class="p-8 rounded-xl"
>
  Animates from opacity 0 + y:40 on mount
</div>`,

  to: `<div
  v-gsap.to="{ x: 100, duration: 1, ease: 'bounce.out' }"
  class="p-8 rounded-xl"
>
  Tweens to x:100 on mount
</div>`,

  fromTo: `<div
  v-gsap.fromTo="[
    { scale: 0, rotation: -180 },
    { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  ]"
  class="p-8 rounded-xl"
>
  Scale + rotate entrance
</div>`,

  infinitely: `<div
  v-gsap.infinitely.to="{ rotation: 360, duration: 2, ease: 'linear' }"
  class="w-16 h-16 rounded-xl"
/>`,

  fromInvisible: `<!-- data-vgsap-from-invisible prevents FOUC on SSR -->
<div
  v-gsap.whenVisible.once.fromInvisible.from="{ y: 40, duration: 0.8 }"
  class="p-8 rounded-xl"
>
  No flash of unstyled content before JS loads
</div>`,

  whenVisibleOnce: `<div
  v-gsap.whenVisible.once.from="{ opacity: 0, y: 60, duration: 0.8 }"
  class="p-8 rounded-xl"
>
  Slides in once when scrolled into view
</div>`,

  whenVisibleReversible: `<div
  v-gsap.whenVisible.once.reversible.from="{ opacity: 0, x: -60, duration: 0.6 }"
  class="p-8 rounded-xl"
>
  Plays forward on enter, reverses on scroll up
</div>`,

  whenVisibleScrub: `<div
  v-gsap.whenVisible.fromTo="[
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ]"
  class="p-8 rounded-xl"
>
  Tied to scroll position (scrubbed)
</div>`,

  whenVisibleDelay: `<div
  v-gsap.whenVisible.once.from.delay-400="{ opacity: 0, y: 40, duration: 0.7 }"
  class="p-8 rounded-xl"
>
  400ms delay before animating in
</div>`,

  entranceFade: `<div v-gsap.entrance.fade class="p-8 rounded-xl">
  Fades in (built-in preset)
</div>`,

  entranceSlideLeft: `<div v-gsap.entrance.slide-left class="p-8 rounded-xl">
  Slides in from left
</div>`,

  entranceSlideRight: `<div v-gsap.entrance.slide-right class="p-8 rounded-xl">
  Slides in from right
</div>`,

  entranceSlideBottom: `<div v-gsap.entrance.slide-bottom class="p-8 rounded-xl">
  Slides in from below
</div>`,

  entranceScale: `<div v-gsap.entrance.scale class="p-8 rounded-xl">
  Scales in from 75%
</div>`,

  entranceScaleFull: `<div v-gsap.entrance.scale-full class="p-8 rounded-xl">
  Scales in from 0
</div>`,

  splitChars: `<p
  v-gsap.whenVisible.once.splitText.chars.from="{
    opacity: 0,
    y: 20,
    stagger: 0.03,
    duration: 0.5,
  }"
  class="text-3xl font-bold"
>
  Characters animate in
</p>`,

  splitWords: `<p
  v-gsap.whenVisible.once.splitText.words.from="{
    opacity: 0,
    x: -20,
    stagger: 0.08,
    duration: 0.6,
  }"
  class="text-2xl font-semibold"
>
  Each word slides in
</p>`,

  splitLines: `<p
  v-gsap.whenVisible.once.splitText.lines.from="{
    opacity: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.7,
  }"
  class="text-xl leading-relaxed"
>
  First line fades in. Then second line.
  Finally the third line.
</p>`,

  splitMask: `<p
  v-gsap.whenVisible.once.splitText.words.mask.from="{
    y: '100%',
    stagger: 0.08,
    duration: 0.6,
    ease: 'power3.out',
  }"
  class="text-3xl font-bold"
>
  Masked word reveal
</p>`,

  whileHoverScale: `<div
  v-gsap.whileHover.to="{ scale: 1.08, duration: 0.3, ease: 'power2.out' }"
  class="p-8 rounded-xl cursor-pointer"
>
  Hover to scale up
</div>`,

  whileHoverRotate: `<div
  v-gsap.whileHover.to="{ rotation: 6, scale: 1.05, duration: 0.25 }"
  class="p-8 rounded-xl cursor-pointer"
>
  Hover to rotate + scale
</div>`,

  whileHoverNoReverse: `<div
  v-gsap.whileHover.noReverse.to="{ y: -8, duration: 0.3 }"
  class="p-8 rounded-xl cursor-pointer"
>
  Lifts up on hover, stays lifted on leave
</div>`,

  whileHoverFromTo: `<div
  v-gsap.whileHover.fromTo="[
    { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
    { boxShadow: '0 8px 32px 0 rgba(139,92,246,0.4)', duration: 0.3 }
  ]"
  class="p-8 rounded-xl cursor-pointer"
>
  Hover for glow effect
</div>`,

  parallaxSlower: `<div class="relative h-56 overflow-hidden rounded-xl">
  <div
    v-gsap.parallax.slower-3
    class="absolute inset-0 flex items-center justify-center"
  >
    Moves slower than scroll (slower-3)
  </div>
</div>`,

  parallaxFaster: `<div class="relative h-56 overflow-hidden rounded-xl">
  <div
    v-gsap.parallax.faster-2
    class="absolute inset-0 flex items-center justify-center"
  >
    Moves faster than scroll (faster-2)
  </div>
</div>`,

  stagger: `<div
  v-gsap.whenVisible.once.stagger.from="{
    opacity: 0,
    y: 40,
    duration: 0.5,
    stagger: 0.1,
  }"
  class="grid grid-cols-3 gap-4"
>
  <div class="p-4 rounded-lg">Card 1</div>
  <div class="p-4 rounded-lg">Card 2</div>
  <div class="p-4 rounded-lg">Card 3</div>
</div>`,

  timeline: `<!-- Parent declares the timeline -->
<div
  v-gsap.timeline="{ scrub: false }"
  class="space-y-3"
>
  <!-- Children add themselves to it in order -->
  <div
    v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.5 }"
    class="p-4 rounded-lg"
  >
    First
  </div>
  <div
    v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.5 }"
    class="p-4 rounded-lg"
  >
    Second (plays after first)
  </div>
  <div
    v-gsap.add.withPrevious.from="{ opacity: 0, x: -60, duration: 0.5 }"
    class="p-4 rounded-lg"
  >
    Third (plays with previous)
  </div>
</div>`,

  magnetic: `<button
  v-gsap.magnetic
  class="px-6 py-3 rounded-full font-semibold cursor-pointer"
>
  Magnetic Button
</button>

<!-- Strength variants -->
<button v-gsap.magnetic.strong ...>Strong</button>
<button v-gsap.magnetic.weak ...>Weak</button>`,

  draggableX: `<div
  v-gsap.draggable.x
  class="w-20 h-20 rounded-xl cursor-grab active:cursor-grabbing"
/>`,

  draggableXY: `<div
  v-gsap.draggable
  class="w-20 h-20 rounded-xl cursor-grab active:cursor-grabbing"
/>`,

  draggableRotation: `<div
  v-gsap.draggable.rotation
  class="w-20 h-20 rounded-xl cursor-grab active:cursor-grabbing"
/>`,

  animateText: `<p
  v-gsap.whenVisible.once.animateText
  class="text-xl font-mono"
>
  This text types itself out...
</p>

<!-- Speed variants -->
<p v-gsap.animateText.slow ...>Slow typewriter</p>
<p v-gsap.animateText.fast ...>Fast typewriter</p>`,

  desktopOnly: `<!-- Only animates on screens >= 768px -->
<div
  v-gsap.desktop.whenVisible.once.from="{
    opacity: 0, y: 40, duration: 0.8
  }"
  class="p-8 rounded-xl"
>
  Desktop-only animation
</div>

<!-- Only animates on mobile -->
<div
  v-gsap.mobile.whenVisible.once.from="{
    opacity: 0, y: 40, duration: 0.8
  }"
  class="p-8 rounded-xl"
>
  Mobile-only animation
</div>`,

  pinned: `<!-- Element pins to viewport for 800px of scroll travel -->
<div
  v-gsap.pinned="{ start: 'top top', end: '+=800' }"
  class="h-screen flex items-center justify-center"
>
  Pinned while scrolling through
</div>`,

  onState: `<!-- Animates when data-open="true" -->
<div
  v-gsap.onState-open.to="{ height: 'auto', opacity: 1, duration: 0.4 }"
  data-open="false"
  class="overflow-hidden"
>
  Animates based on data attribute state
</div>`,
}

const quickRef = [
  { modifier: 'v-gsap.from', desc: 'Animate from props on mount', example: '{ opacity: 0, y: 40 }' },
  { modifier: 'v-gsap.to', desc: 'Tween to props on mount', example: '{ x: 100, rotation: 45 }' },
  { modifier: 'v-gsap.fromTo', desc: 'Tween between two states', example: '[{x: -50}, {x: 0}]' },
  { modifier: 'v-gsap.set', desc: 'Set props instantly', example: '{ opacity: 0 }' },
  { modifier: 'v-gsap.whenVisible', desc: 'ScrollTrigger activation', example: '+ .from / .to / .fromTo' },
  { modifier: '.once', desc: 'Play only on first enter (no scrub)', example: '' },
  { modifier: '.reversible', desc: 'Reverse on scroll back up', example: '' },
  { modifier: '.fromInvisible', desc: 'SSR-safe: start invisible', example: '' },
  { modifier: '.delay-N', desc: 'Delay by Nms before animating', example: '.delay-400' },
  { modifier: '.infinitely', desc: 'Loop animation forever', example: '' },
  { modifier: '.entrance.*', desc: 'Built-in entrance presets', example: '.fade .slide-left .scale' },
  { modifier: '.splitText', desc: 'SplitText animation', example: '+ .chars / .words / .lines' },
  { modifier: '.mask', desc: 'Masked text reveal (with splitText)', example: '' },
  { modifier: '.whileHover', desc: 'Animate on mouse enter/leave', example: '+ .to / .fromTo' },
  { modifier: '.noReverse', desc: 'No reverse on mouse leave', example: '(with .whileHover)' },
  { modifier: '.parallax', desc: 'Scroll-based parallax', example: '.slower-N or .faster-N' },
  { modifier: '.stagger', desc: 'Stagger children animations', example: '' },
  { modifier: '.timeline', desc: 'Create a GSAP timeline', example: '' },
  { modifier: '.add', desc: 'Add child to parent timeline', example: '+ .withPrevious' },
  { modifier: '.magnetic', desc: 'Cursor attraction effect', example: '.strong .weak .stronger .weaker' },
  { modifier: '.draggable', desc: 'Make element draggable', example: '.x .y .rotation' },
  { modifier: '.animateText', desc: 'Typewriter text effect', example: '.slow .fast' },
  { modifier: '.desktop', desc: 'Only animate on desktop (≥768px)', example: '' },
  { modifier: '.mobile', desc: 'Only animate on mobile (<768px)', example: '' },
  { modifier: '.pinned', desc: 'Pin element during scroll', example: '' },
]

const entrancePresetDemos = [
  { id: 'entranceFade', mod: 'entrance.fade', label: 'entrance.fade', snip: 'entranceFade', bgClass: 'bg-violet-100 dark:bg-violet-900/30', textClass: 'text-violet-800 dark:text-violet-200', text: 'Fades in' },
  { id: 'entranceSlideLeft', mod: 'entrance.slide-left', label: 'entrance.slide-left', snip: 'entranceSlideLeft', bgClass: 'bg-blue-100 dark:bg-blue-900/30', textClass: 'text-blue-800 dark:text-blue-200', text: 'From left' },
  { id: 'entranceSlideRight', mod: 'entrance.slide-right', label: 'entrance.slide-right', snip: 'entranceSlideRight', bgClass: 'bg-green-100 dark:bg-green-900/30', textClass: 'text-green-800 dark:text-green-200', text: 'From right' },
  { id: 'entranceSlideBottom', mod: 'entrance.slide-bottom', label: 'entrance.slide-bottom', snip: 'entranceSlideBottom', bgClass: 'bg-orange-100 dark:bg-orange-900/30', textClass: 'text-orange-800 dark:text-orange-200', text: 'From below' },
  { id: 'entranceScale', mod: 'entrance.scale', label: 'entrance.scale', snip: 'entranceScale', bgClass: 'bg-pink-100 dark:bg-pink-900/30', textClass: 'text-pink-800 dark:text-pink-200', text: 'Scale 75% → 100%' },
  { id: 'entranceScaleFull', mod: 'entrance.scale-full', label: 'entrance.scale-full', snip: 'entranceScaleFull', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-800 dark:text-red-200', text: 'Scale 0% → 100%' },
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-violet-950 via-gray-900 to-gray-950 text-white py-24 px-6">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-20 left-20 w-64 h-64 bg-violet-500 rounded-full blur-3xl" />
        <div class="absolute bottom-10 right-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
      </div>
      <UContainer class="relative">
        <div class="max-w-3xl">
          <div class="flex items-center gap-2 mb-4">
            <UBadge color="violet" variant="subtle" size="lg">v-gsap-nuxt v1.5</UBadge>
            <UBadge color="gray" variant="subtle" size="lg">GSAP 3</UBadge>
          </div>
          <h1 class="text-5xl font-bold mb-4 tracking-tight">
            v-gsap Directive Guide
          </h1>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed">
            A complete reference for every modifier with live demos and copyable code.
            Scroll-triggered entrances, text splits, hover effects, parallax, timelines, and more.
          </p>
          <div class="flex flex-wrap gap-3">
            <UButton size="lg" color="white" variant="solid" to="#quick-ref">
              <UIcon name="i-lucide-table" class="mr-2" />
              Quick Reference
            </UButton>
            <UButton size="lg" variant="ghost" color="white" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Overview
            </UButton>
            <UButton size="lg" variant="ghost" color="white" to="/locomotive-scroll">
              <UIcon name="i-lucide-train" class="mr-2" />
              Locomotive Scroll
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Quick Reference table -->
    <section id="quick-ref" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer>
        <h2 class="text-3xl font-bold mb-2">Quick Reference</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8">All available modifiers at a glance.</p>
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 min-w-52">Modifier</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 min-w-44">Usage / Options</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="row in quickRef"
                :key="row.modifier"
                class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <td class="px-4 py-3 font-mono text-violet-600 dark:text-violet-400 font-medium">{{ row.modifier }}</td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ row.desc }}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-500">{{ row.example }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Basic Animations ── -->
    <section id="basic" class="py-16">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Basic Animations</h2>
          <p class="text-gray-500 dark:text-gray-400">
            These run immediately on mount. Use <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.from</code>,
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.to</code>,
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.fromTo</code>, or
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.set</code> as the animation type.
          </p>
        </div>

        <!-- .from -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .from</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('from')">Replay</UButton>
            </div>
            <div :key="replayKeys['from']" class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-32">
              <div
                v-gsap.from="{ opacity: 0, y: 40, duration: 0.8 }"
                class="px-8 py-5 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-center font-semibold text-violet-800 dark:text-violet-200"
              >
                Animates from opacity:0, y:40
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">v-gsap.from</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'from' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.from, 'from')">
                {{ copied === 'from' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.from }}</code></pre>
          </div>
        </div>

        <!-- .fromTo -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .fromTo</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('fromTo')">Replay</UButton>
            </div>
            <div :key="replayKeys['fromTo']" class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-32">
              <div
                v-gsap.fromTo="[{ scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }]"
                class="w-20 h-20 bg-purple-200 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs text-center"
              >
                Scale + Rotate
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">v-gsap.fromTo</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'fromTo' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.fromTo, 'fromTo')">
                {{ copied === 'fromTo' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.fromTo }}</code></pre>
          </div>
        </div>

        <!-- .infinitely -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .infinitely</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('infinitely')">Replay</UButton>
            </div>
            <div :key="replayKeys['infinitely']" class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center gap-8 min-h-32">
              <div
                v-gsap.infinitely.to="{ rotation: 360, duration: 2, ease: 'linear' }"
                class="w-16 h-16 bg-blue-200 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold"
              >
                Spin
              </div>
              <div
                v-gsap.infinitely.fromTo="[{ y: -8 }, { y: 8, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }]"
                class="w-16 h-16 bg-emerald-200 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xs font-bold"
              >
                Float
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">v-gsap.infinitely</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'infinitely' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.infinitely, 'infinitely')">
                {{ copied === 'infinitely' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.infinitely }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Scroll-Triggered Entrance ── -->
    <section id="scroll" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Scroll-Triggered Entrances</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Add <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.whenVisible</code> to trigger animations when the element scrolls into view.
            Combine with <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.once</code> to play once, or omit it to scrub with scroll.
          </p>
        </div>

        <!-- whenVisible.once.from -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .whenVisible.once.from</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('whenVisibleOnce')">Replay</UButton>
            </div>
            <div :key="replayKeys['whenVisibleOnce']" class="p-8 bg-white dark:bg-gray-900 min-h-32 flex items-center justify-center">
              <div
                v-gsap.whenVisible.once.from="{ opacity: 0, y: 60, duration: 0.8 }"
                class="px-8 py-5 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-center font-semibold text-violet-800 dark:text-violet-200"
              >
                Slides up once when visible
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">whenVisible.once.from</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whenVisibleOnce' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whenVisibleOnce, 'whenVisibleOnce')">
                {{ copied === 'whenVisibleOnce' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.whenVisibleOnce }}</code></pre>
          </div>
        </div>

        <!-- whenVisible.once.reversible -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .whenVisible.once.reversible.from</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('whenVisibleReversible')">Replay</UButton>
            </div>
            <div :key="replayKeys['whenVisibleReversible']" class="p-8 bg-white dark:bg-gray-900 min-h-32 flex items-center justify-center">
              <div
                v-gsap.whenVisible.once.reversible.from="{ opacity: 0, x: -60, duration: 0.6 }"
                class="px-8 py-5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-center font-semibold text-blue-800 dark:text-blue-200"
              >
                Slides in from left — reverses on scroll up
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">whenVisible.once.reversible</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whenVisibleReversible' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whenVisibleReversible, 'whenVisibleReversible')">
                {{ copied === 'whenVisibleReversible' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.whenVisibleReversible }}</code></pre>
          </div>
        </div>

        <!-- scrub -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .whenVisible scrub (no .once)</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('whenVisibleScrub')">Replay</UButton>
            </div>
            <div :key="replayKeys['whenVisibleScrub']" class="p-8 bg-white dark:bg-gray-900 min-h-32 flex items-center justify-center">
              <div
                v-gsap.whenVisible.fromTo="[{ opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }]"
                class="px-8 py-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-center font-semibold text-emerald-800 dark:text-emerald-200"
              >
                Scrubs with scroll position
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">whenVisible + scrub</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whenVisibleScrub' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whenVisibleScrub, 'whenVisibleScrub')">
                {{ copied === 'whenVisibleScrub' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.whenVisibleScrub }}</code></pre>
          </div>
        </div>

        <!-- delay -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .delay-N (milliseconds)</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('whenVisibleDelay')">Replay</UButton>
            </div>
            <div :key="replayKeys['whenVisibleDelay']" class="p-8 bg-white dark:bg-gray-900 min-h-32 flex items-center justify-center gap-4">
              <div
                v-gsap.whenVisible.once.from="{ opacity: 0, y: 30, duration: 0.6 }"
                class="px-4 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center text-sm font-semibold text-orange-800 dark:text-orange-200"
              >
                Immediate
              </div>
              <div
                v-gsap.whenVisible.once.from.delay-300="{ opacity: 0, y: 30, duration: 0.6 }"
                class="px-4 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center text-sm font-semibold text-orange-800 dark:text-orange-200"
              >
                300ms delay
              </div>
              <div
                v-gsap.whenVisible.once.from.delay-600="{ opacity: 0, y: 30, duration: 0.6 }"
                class="px-4 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center text-sm font-semibold text-orange-800 dark:text-orange-200"
              >
                600ms delay
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">.delay-N modifier</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whenVisibleDelay' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whenVisibleDelay, 'whenVisibleDelay')">
                {{ copied === 'whenVisibleDelay' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.whenVisibleDelay }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Entrance Presets ── -->
    <section id="entrance-presets" class="py-16">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Entrance Presets</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Add <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.entrance</code> plus a preset name for one-line scroll animations.
            All presets use <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">whenVisible.once.fromInvisible</code> under the hood.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="demo in entrancePresetDemos"
            :key="demo.id"
            class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <code class="text-sm text-violet-600 dark:text-violet-400 font-medium">{{ demo.label }}</code>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay(demo.id)">Replay</UButton>
            </div>
            <div :key="replayKeys[demo.id]" class="p-6 bg-white dark:bg-gray-900 flex items-center justify-center min-h-24">
              <div
                v-if="demo.id === 'entranceFade'"
                v-gsap.entrance.fade
                :class="['px-4 py-3 rounded-lg text-sm font-semibold', demo.bgClass, demo.textClass]"
              >
                {{ demo.text }}
              </div>
              <div
                v-else-if="demo.id === 'entranceSlideLeft'"
                v-gsap.entrance.slide-left
                :class="['px-4 py-3 rounded-lg text-sm font-semibold', demo.bgClass, demo.textClass]"
              >
                {{ demo.text }}
              </div>
              <div
                v-else-if="demo.id === 'entranceSlideRight'"
                v-gsap.entrance.slide-right
                :class="['px-4 py-3 rounded-lg text-sm font-semibold', demo.bgClass, demo.textClass]"
              >
                {{ demo.text }}
              </div>
              <div
                v-else-if="demo.id === 'entranceSlideBottom'"
                v-gsap.entrance.slide-bottom
                :class="['px-4 py-3 rounded-lg text-sm font-semibold', demo.bgClass, demo.textClass]"
              >
                {{ demo.text }}
              </div>
              <div
                v-else-if="demo.id === 'entranceScale'"
                v-gsap.entrance.scale
                :class="['px-4 py-3 rounded-lg text-sm font-semibold', demo.bgClass, demo.textClass]"
              >
                {{ demo.text }}
              </div>
              <div
                v-else-if="demo.id === 'entranceScaleFull'"
                v-gsap.entrance.scale-full
                :class="['px-4 py-3 rounded-lg text-sm font-semibold', demo.bgClass, demo.textClass]"
              >
                {{ demo.text }}
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === demo.id ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets[demo.snip as keyof typeof snippets], demo.id)">
                  {{ copied === demo.id ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed max-h-28"><code>{{ snippets[demo.snip as keyof typeof snippets] }}</code></pre>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Text Split Animations ── -->
    <section id="text-split" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Text Split Animations</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.splitText</code> uses GSAP's SplitText plugin to break text into animatable units.
            Combine with <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.chars</code>, <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.words</code>, or <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.lines</code>.
          </p>
        </div>

        <!-- chars -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .splitText.chars.from</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('splitChars')">Replay</UButton>
            </div>
            <div :key="replayKeys['splitChars']" class="p-8 bg-white dark:bg-gray-900 min-h-28 flex items-center justify-center">
              <p
                v-gsap.whenVisible.once.splitText.chars.from="{ opacity: 0, y: 20, stagger: 0.03, duration: 0.5 }"
                class="text-3xl font-bold text-gray-900 dark:text-gray-100"
              >
                Characters animate in
              </p>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">splitText.chars</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'splitChars' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.splitChars, 'splitChars')">
                {{ copied === 'splitChars' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.splitChars }}</code></pre>
          </div>
        </div>

        <!-- words -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .splitText.words.from</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('splitWords')">Replay</UButton>
            </div>
            <div :key="replayKeys['splitWords']" class="p-8 bg-white dark:bg-gray-900 min-h-28 flex items-center justify-center">
              <p
                v-gsap.whenVisible.once.splitText.words.from="{ opacity: 0, x: -20, stagger: 0.08, duration: 0.6 }"
                class="text-2xl font-semibold text-gray-900 dark:text-gray-100 max-w-sm text-center"
              >
                Each word slides in from the left
              </p>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">splitText.words</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'splitWords' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.splitWords, 'splitWords')">
                {{ copied === 'splitWords' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.splitWords }}</code></pre>
          </div>
        </div>

        <!-- lines -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .splitText.lines.from</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('splitLines')">Replay</UButton>
            </div>
            <div :key="replayKeys['splitLines']" class="p-8 bg-white dark:bg-gray-900 min-h-28 flex items-center justify-center">
              <p
                v-gsap.whenVisible.once.splitText.lines.from="{ opacity: 0, y: 30, stagger: 0.12, duration: 0.7 }"
                class="text-lg leading-relaxed text-gray-900 dark:text-gray-100 max-w-sm text-center"
              >
                First line fades in.
                Then the second line follows.
                Finally the third line appears.
              </p>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">splitText.lines</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'splitLines' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.splitLines, 'splitLines')">
                {{ copied === 'splitLines' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.splitLines }}</code></pre>
          </div>
        </div>

        <!-- mask -->
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — .splitText.words.mask</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('splitMask')">Replay</UButton>
            </div>
            <div :key="replayKeys['splitMask']" class="p-8 bg-white dark:bg-gray-900 min-h-28 flex items-center justify-center">
              <p
                v-gsap.whenVisible.once.splitText.words.mask.from="{ y: '100%', stagger: 0.08, duration: 0.6, ease: 'power3.out' }"
                class="text-3xl font-bold text-gray-900 dark:text-gray-100"
              >
                Masked word reveal
              </p>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">splitText.mask</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'splitMask' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.splitMask, 'splitMask')">
                {{ copied === 'splitMask' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.splitMask }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Hover Animations ── -->
    <section id="hover" class="py-16">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Hover Animations</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.whileHover</code> plays the animation on mouseenter and reverses on mouseleave.
            Add <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.noReverse</code> to skip the reverse. These demos are always interactive — no replay needed.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">.whileHover.to — scale</div>
            <div class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-32">
              <div v-gsap.whileHover.to="{ scale: 1.08, duration: 0.3, ease: 'power2.out' }" class="px-8 py-5 bg-violet-100 dark:bg-violet-900/30 rounded-xl font-semibold text-violet-800 dark:text-violet-200 cursor-pointer">
                Hover me
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whileHoverScale' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whileHoverScale, 'whileHoverScale')">{{ copied === 'whileHoverScale' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed max-h-28"><code>{{ snippets.whileHoverScale }}</code></pre>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">.whileHover.to — rotate + scale</div>
            <div class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-32">
              <div v-gsap.whileHover.to="{ rotation: 6, scale: 1.05, duration: 0.25 }" class="px-8 py-5 bg-blue-100 dark:bg-blue-900/30 rounded-xl font-semibold text-blue-800 dark:text-blue-200 cursor-pointer">
                Hover me
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whileHoverRotate' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whileHoverRotate, 'whileHoverRotate')">{{ copied === 'whileHoverRotate' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed max-h-28"><code>{{ snippets.whileHoverRotate }}</code></pre>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">.whileHover.noReverse.to — stays lifted</div>
            <div class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-32">
              <div v-gsap.whileHover.noReverse.to="{ y: -8, duration: 0.3 }" class="px-8 py-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl font-semibold text-emerald-800 dark:text-emerald-200 cursor-pointer">
                Lifts — stays lifted on leave
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whileHoverNoReverse' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whileHoverNoReverse, 'whileHoverNoReverse')">{{ copied === 'whileHoverNoReverse' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed max-h-28"><code>{{ snippets.whileHoverNoReverse }}</code></pre>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">.whileHover.fromTo — glow shadow</div>
            <div class="p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-32">
              <div
                v-gsap.whileHover.fromTo="[
                  { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
                  { boxShadow: '0 8px 32px 0 rgba(139,92,246,0.45)', duration: 0.3 }
                ]"
                class="px-8 py-5 bg-purple-100 dark:bg-purple-900/30 rounded-xl font-semibold text-purple-800 dark:text-purple-200 cursor-pointer"
              >
                Hover for glow
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'whileHoverFromTo' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.whileHoverFromTo, 'whileHoverFromTo')">{{ copied === 'whileHoverFromTo' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed max-h-28"><code>{{ snippets.whileHoverFromTo }}</code></pre>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Parallax ── -->
    <section id="parallax" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Parallax Scroll</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.parallax.slower-N</code> moves at 1/N speed (lags behind scroll).
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.parallax.faster-N</code> moves at N× speed (overtakes scroll).
            Scroll this section to see the effect.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">.parallax.slower-3</div>
            <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <div v-gsap.parallax.slower-3 class="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
                Moves slower than scroll
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'parallaxSlower' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.parallaxSlower, 'parallaxSlower')">{{ copied === 'parallaxSlower' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed"><code>{{ snippets.parallaxSlower }}</code></pre>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">.parallax.faster-2</div>
            <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <div v-gsap.parallax.faster-2 class="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center font-bold text-white text-lg">
                Moves faster than scroll
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'parallaxFaster' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.parallaxFaster, 'parallaxFaster')">{{ copied === 'parallaxFaster' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed"><code>{{ snippets.parallaxFaster }}</code></pre>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Stagger ── -->
    <section id="stagger" class="py-16">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Stagger Animations</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.stagger</code> animates direct child elements in sequence.
            The stagger delay is set via <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">stagger</code> in the value object.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — staggered cards</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('stagger')">Replay</UButton>
            </div>
            <div :key="replayKeys['stagger']" class="p-6 bg-white dark:bg-gray-900">
              <div
                v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 40, duration: 0.5, stagger: 0.1 }"
                class="grid grid-cols-3 gap-3"
              >
                <div class="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center text-sm font-semibold text-violet-800 dark:text-violet-200">Card 1</div>
                <div class="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center text-sm font-semibold text-violet-800 dark:text-violet-200">Card 2</div>
                <div class="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center text-sm font-semibold text-violet-800 dark:text-violet-200">Card 3</div>
                <div class="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center text-sm font-semibold text-violet-800 dark:text-violet-200">Card 4</div>
                <div class="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center text-sm font-semibold text-violet-800 dark:text-violet-200">Card 5</div>
                <div class="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center text-sm font-semibold text-violet-800 dark:text-violet-200">Card 6</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">stagger</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'stagger' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.stagger, 'stagger')">
                {{ copied === 'stagger' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.stagger }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Timeline ── -->
    <section id="timeline" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Timeline Sequences</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Add <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.timeline</code> to a parent element to create a GSAP timeline.
            Children use <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.add</code> to join it in order. Use <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.withPrevious</code> to play simultaneously with the preceding item.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — sequenced items</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('timeline')">Replay</UButton>
            </div>
            <div :key="replayKeys['timeline']" class="p-6 bg-white dark:bg-gray-900">
              <div v-gsap.timeline="{ scrub: false }" class="space-y-3">
                <div v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.45 }" class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg font-semibold text-blue-800 dark:text-blue-200">
                  1 — First (plays immediately)
                </div>
                <div v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.45 }" class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg font-semibold text-blue-800 dark:text-blue-200">
                  2 — Second (plays after first)
                </div>
                <div v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.45 }" class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg font-semibold text-blue-800 dark:text-blue-200">
                  3 — Third (plays after second)
                </div>
                <div v-gsap.add.withPrevious.from="{ opacity: 0, x: -60, duration: 0.45 }" class="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg font-semibold text-indigo-800 dark:text-indigo-200">
                  4 — Plays with third (.withPrevious)
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">timeline + .add</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'timeline' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.timeline, 'timeline')">
                {{ copied === 'timeline' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.timeline }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Magnetic ── -->
    <section id="magnetic" class="py-16">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Magnetic Effect</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.magnetic</code> attracts the element towards the cursor when nearby.
            Adjust intensity with <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.strong</code>, <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.stronger</code>, <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.weak</code>, <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.weaker</code>.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">
              Demo — hover near these buttons
            </div>
            <div class="p-8 bg-white dark:bg-gray-900 flex flex-wrap items-center justify-center gap-6 min-h-40">
              <button v-gsap.magnetic.weak class="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full font-semibold cursor-pointer transition-colors text-sm">Weak</button>
              <button v-gsap.magnetic class="px-5 py-2.5 bg-violet-100 dark:bg-violet-900/40 hover:bg-violet-200 dark:hover:bg-violet-800/40 text-violet-800 dark:text-violet-200 rounded-full font-semibold cursor-pointer transition-colors text-sm">Default</button>
              <button v-gsap.magnetic.strong class="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold cursor-pointer transition-colors text-sm">Strong</button>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">magnetic</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'magnetic' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.magnetic, 'magnetic')">
                {{ copied === 'magnetic' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.magnetic }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Draggable ── -->
    <section id="draggable" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Draggable Elements</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.draggable</code> enables free drag.
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.draggable.x</code> constrains to horizontal.
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.draggable.rotation</code> for spin drag.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">
              Demo — drag the shapes
            </div>
            <div class="p-6 bg-white dark:bg-gray-900 min-h-48 relative flex items-center justify-center gap-6">
              <div v-gsap.draggable.x class="w-20 h-20 bg-blue-200 dark:bg-blue-900/50 rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold select-none">↔ X only</div>
              <div v-gsap.draggable class="w-20 h-20 bg-violet-200 dark:bg-violet-900/50 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center text-violet-700 dark:text-violet-300 text-xs font-bold select-none">Free</div>
              <div v-gsap.draggable.rotation class="w-20 h-20 bg-orange-200 dark:bg-orange-900/50 rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center text-orange-700 dark:text-orange-300 text-xs font-bold select-none">↻ Spin</div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">draggable</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'draggableX' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.draggableX, 'draggableX')">
                {{ copied === 'draggableX' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.draggableXY }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Typewriter ── -->
    <section id="typewriter" class="py-16">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Typewriter Effect</h2>
          <p class="text-gray-500 dark:text-gray-400">
            <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.animateText</code> uses GSAP's TextPlugin to type the text content character by character.
            Control speed with <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.slow</code> or <code class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.fast</code>.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Demo — typewriter on scroll</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('animateText')">Replay</UButton>
            </div>
            <div :key="replayKeys['animateText']" class="p-8 bg-white dark:bg-gray-900 space-y-6 min-h-40 flex flex-col justify-center">
              <p v-gsap.whenVisible.once.animateText class="text-lg font-mono text-gray-800 dark:text-gray-200">Default speed typewriter effect...</p>
              <p v-gsap.whenVisible.once.animateText.slow class="text-lg font-mono text-violet-700 dark:text-violet-300">Slow typewriter, one char at a time.</p>
              <p v-gsap.whenVisible.once.animateText.fast class="text-lg font-mono text-emerald-700 dark:text-emerald-300">Fast typewriter blazes through!</p>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
              <span class="text-sm font-mono text-gray-400">animateText</span>
              <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'animateText' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.animateText, 'animateText')">
                {{ copied === 'animateText' ? 'Copied!' : 'Copy' }}
              </UButton>
            </div>
            <pre class="p-4 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-200 leading-relaxed"><code>{{ snippets.animateText }}</code></pre>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Responsive & Advanced ── -->
    <section id="advanced" class="py-16 bg-gray-50 dark:bg-gray-900">
      <UContainer class="space-y-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Responsive & Advanced Patterns</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Limit animations to a device size, pin elements during scroll, or trigger based on data attribute state.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">.desktop / .mobile — breakpoint guards</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('responsive')">Replay</UButton>
            </div>
            <div :key="replayKeys['responsive']" class="p-6 bg-white dark:bg-gray-900 space-y-3">
              <div v-gsap.desktop.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.8 }" class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm font-semibold text-blue-800 dark:text-blue-200">
                Desktop only (≥768px)
              </div>
              <div v-gsap.mobile.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.8 }" class="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                Mobile only (&lt;768px)
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'desktopOnly' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.desktopOnly, 'desktopOnly')">{{ copied === 'desktopOnly' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed"><code>{{ snippets.desktopOnly }}</code></pre>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">.fromInvisible — prevent SSR flash</span>
              <UButton size="xs" variant="ghost" color="gray" icon="i-lucide-rotate-ccw" @click="replay('fromInvisible')">Replay</UButton>
            </div>
            <div :key="replayKeys['fromInvisible']" class="p-6 bg-white dark:bg-gray-900">
              <div v-gsap.whenVisible.once.fromInvisible.from="{ y: 40, duration: 0.8 }" class="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Starts invisible on SSR — no flash before JS
              </div>
              <p class="mt-3 text-xs text-gray-500 dark:text-gray-500">
                Adds <code class="font-mono">data-vgsap-from-invisible</code> in SSR HTML so your CSS can hide the element until GSAP runs.
              </p>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'fromInvisible' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.fromInvisible, 'fromInvisible')">{{ copied === 'fromInvisible' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed"><code>{{ snippets.fromInvisible }}</code></pre>
            </div>
          </div>

          <div class="md:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">
              .pinned — pin element during scroll travel
            </div>
            <div class="p-6 bg-white dark:bg-gray-900">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                The <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.pinned</code> modifier creates a ScrollTrigger that pins the element in the viewport while scrolling
                through the defined <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">end</code> distance. Use it on full-height sections, not inline cards.
              </p>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-950">
                <span class="text-xs font-mono text-gray-500">code</span>
                <UButton size="xs" variant="ghost" color="gray" :icon="copied === 'pinned' ? 'i-lucide-check' : 'i-lucide-copy'" @click="copy(snippets.pinned, 'pinned')">{{ copied === 'pinned' ? 'Copied!' : 'Copy' }}</UButton>
              </div>
              <pre class="p-3 text-xs overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 leading-relaxed"><code>{{ snippets.pinned }}</code></pre>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ── Section: Value Reference ── -->
    <section id="value-ref" class="py-16">
      <UContainer class="space-y-8">
        <div>
          <h2 class="text-3xl font-bold mb-2">Value Object Reference</h2>
          <p class="text-gray-500 dark:text-gray-400">
            All GSAP tween properties are valid. Common scroll-specific keys consumed by the directive:
          </p>
        </div>
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Key</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Default</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="({ key, type, def, desc }) in [
                  { key: 'start', type: 'string', def: '\'top 90%\'', desc: 'ScrollTrigger start point' },
                  { key: 'end', type: 'string', def: '\'top 50%\'', desc: 'ScrollTrigger end point' },
                  { key: 'scrub', type: 'boolean | number', def: 'true (without .once)', desc: 'Tie to scroll position; number = lag in seconds' },
                  { key: 'scroller', type: 'string | Element', def: 'window', desc: 'Custom scroll container' },
                  { key: 'stagger', type: 'number | object', def: '0.2 (with .stagger)', desc: 'Stagger delay between elements' },
                  { key: 'duration', type: 'number', def: '0.5', desc: 'Animation duration in seconds' },
                  { key: 'ease', type: 'string', def: '\'power1.out\'', desc: 'GSAP easing string' },
                  { key: 'opacity', type: 'number', def: '—', desc: 'Target opacity (0–1)' },
                  { key: 'x / y', type: 'number | string', def: '—', desc: 'Translate X or Y (px or %)' },
                  { key: 'xPercent / yPercent', type: 'number', def: '—', desc: 'Translate as % of element size' },
                  { key: 'scale', type: 'number', def: '—', desc: 'Scale factor' },
                  { key: 'rotation', type: 'number', def: '—', desc: 'Rotation in degrees' },
                ]"
                :key="key"
                class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <td class="px-4 py-3 font-mono text-violet-600 dark:text-violet-400 font-medium">{{ key }}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-500">{{ type }}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-500">{{ def }}</td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UContainer>
    </section>

    <!-- Footer nav -->
    <section class="py-12 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <UContainer>
        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">v-gsap Directive</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Part of the motion layer — GSAP + Locomotive Scroll</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <UButton variant="ghost" to="/motion">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Motion Overview
            </UButton>
            <UButton variant="ghost" to="/locomotive-scroll">
              <UIcon name="i-lucide-train" class="mr-2" />
              Locomotive Scroll
            </UButton>
            <UButton variant="outline" to="/">
              <UIcon name="i-lucide-home" class="mr-2" />
              Home
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

  </div>
</template>
