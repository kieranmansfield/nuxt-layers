<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('violet')
  onUnmounted(() => setPageAccent(null))

  const copied = ref<string | null>(null)
  const replayKeys = ref<Record<string, number>>({})

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text.trim())
    copied.value = id
    setTimeout(() => {
      copied.value = null
    }, 2000)
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
    {
      modifier: 'v-gsap.from',
      desc: 'Animate from props on mount',
      example: '{ opacity: 0, y: 40 }',
    },
    { modifier: 'v-gsap.to', desc: 'Tween to props on mount', example: '{ x: 100, rotation: 45 }' },
    { modifier: 'v-gsap.fromTo', desc: 'Tween between two states', example: '[{x: -50}, {x: 0}]' },
    { modifier: 'v-gsap.set', desc: 'Set props instantly', example: '{ opacity: 0 }' },
    {
      modifier: 'v-gsap.whenVisible',
      desc: 'ScrollTrigger activation',
      example: '+ .from / .to / .fromTo',
    },
    { modifier: '.once', desc: 'Play only on first enter (no scrub)', example: '' },
    { modifier: '.reversible', desc: 'Reverse on scroll back up', example: '' },
    { modifier: '.fromInvisible', desc: 'SSR-safe: start invisible', example: '' },
    { modifier: '.delay-N', desc: 'Delay by Nms before animating', example: '.delay-400' },
    { modifier: '.infinitely', desc: 'Loop animation forever', example: '' },
    {
      modifier: '.entrance.*',
      desc: 'Built-in entrance presets',
      example: '.fade .slide-left .scale',
    },
    { modifier: '.splitText', desc: 'SplitText animation', example: '+ .chars / .words / .lines' },
    { modifier: '.mask', desc: 'Masked text reveal (with splitText)', example: '' },
    { modifier: '.whileHover', desc: 'Animate on mouse enter/leave', example: '+ .to / .fromTo' },
    { modifier: '.noReverse', desc: 'No reverse on mouse leave', example: '(with .whileHover)' },
    { modifier: '.parallax', desc: 'Scroll-based parallax', example: '.slower-N or .faster-N' },
    { modifier: '.stagger', desc: 'Stagger children animations', example: '' },
    { modifier: '.timeline', desc: 'Create a GSAP timeline', example: '' },
    { modifier: '.add', desc: 'Add child to parent timeline', example: '+ .withPrevious' },
    {
      modifier: '.magnetic',
      desc: 'Cursor attraction effect',
      example: '.strong .weak .stronger .weaker',
    },
    { modifier: '.draggable', desc: 'Make element draggable', example: '.x .y .rotation' },
    { modifier: '.animateText', desc: 'Typewriter text effect', example: '.slow .fast' },
    { modifier: '.desktop', desc: 'Only animate on desktop (≥768px)', example: '' },
    { modifier: '.mobile', desc: 'Only animate on mobile (<768px)', example: '' },
    { modifier: '.pinned', desc: 'Pin element during scroll', example: '' },
  ]

  const entrancePresetDemos = [
    {
      id: 'entranceFade',
      mod: 'entrance.fade',
      label: 'entrance.fade',
      snip: 'entranceFade',
      bgClass: 'bg-primary/10',
      textClass: 'text-primary',
      text: 'Fades in',
    },
    {
      id: 'entranceSlideLeft',
      mod: 'entrance.slide-left',
      label: 'entrance.slide-left',
      snip: 'entranceSlideLeft',
      bgClass: 'bg-info/10',
      textClass: 'text-info',
      text: 'From left',
    },
    {
      id: 'entranceSlideRight',
      mod: 'entrance.slide-right',
      label: 'entrance.slide-right',
      snip: 'entranceSlideRight',
      bgClass: 'bg-success/10',
      textClass: 'text-success',
      text: 'From right',
    },
    {
      id: 'entranceSlideBottom',
      mod: 'entrance.slide-bottom',
      label: 'entrance.slide-bottom',
      snip: 'entranceSlideBottom',
      bgClass: 'bg-warning/10',
      textClass: 'text-warning',
      text: 'From below',
    },
    {
      id: 'entranceScale',
      mod: 'entrance.scale',
      label: 'entrance.scale',
      snip: 'entranceScale',
      bgClass: 'bg-secondary/10',
      textClass: 'text-secondary',
      text: 'Scale 75% → 100%',
    },
    {
      id: 'entranceScaleFull',
      mod: 'entrance.scale-full',
      label: 'entrance.scale-full',
      snip: 'entranceScaleFull',
      bgClass: 'bg-error/10',
      textClass: 'text-error',
      text: 'Scale 0% → 100%',
    },
  ]
</script>

<template>
  <LayoutPage
    title="v-gsap Directive Guide"
    description="Complete reference for the v-gsap directive with live examples"
  >
    <div class="bg-default text-highlighted min-h-screen">
      <!-- Hero -->
      <section
        class="text-highlighted from-primary relative overflow-hidden bg-linear-to-br via-(--ui-color-neutral-900) to-[var(--ui-bg)] px-6 py-24"
      >
        <div class="absolute inset-0 opacity-20">
          <div class="bg-primary absolute top-20 left-20 h-64 w-64 rounded-full blur-3xl" />
          <div class="bg-secondary absolute right-20 bottom-10 h-96 w-96 rounded-full blur-3xl" />
        </div>
        <UContainer class="relative">
          <div class="max-w-3xl">
            <div class="mb-4 flex items-center gap-2">
              <UBadge color="primary" variant="subtle" size="lg">v-gsap-nuxt v1.5</UBadge>
              <UBadge variant="subtle" size="lg">GSAP 3</UBadge>
            </div>
            <h1 class="mb-4 text-5xl font-bold tracking-tight">v-gsap Directive Guide</h1>
            <p class="text-toned mb-8 text-xl leading-relaxed">
              A complete reference for every modifier with live demos and copyable code.
              Scroll-triggered entrances, text splits, hover effects, parallax, timelines, and more.
            </p>
            <div class="flex flex-wrap gap-3">
              <UButton size="lg" color="neutral" variant="solid" to="#quick-ref">
                <UIcon name="i-lucide-table" class="mr-2" />
                Quick Reference
              </UButton>
              <UButton size="lg" variant="ghost" color="neutral" to="/motion">
                <UIcon name="i-lucide-arrow-left" class="mr-2" />
                Motion Overview
              </UButton>
              <UButton size="lg" variant="ghost" color="neutral" to="/locomotive-scroll">
                <UIcon name="i-lucide-train" class="mr-2" />
                Locomotive Scroll
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Quick Reference table -->
      <section id="quick-ref" class="bg-muted py-16">
        <UContainer>
          <h2 class="mb-2 text-3xl font-bold">Quick Reference</h2>
          <p class="text-muted mb-8">All available modifiers at a glance.</p>
          <div class="border-default overflow-x-auto rounded-xl border">
            <table class="w-full text-sm">
              <thead class="bg-accented text-left">
                <tr>
                  <th class="text-toned min-w-52 px-4 py-3 font-semibold">Modifier</th>
                  <th class="text-toned px-4 py-3 font-semibold">Description</th>
                  <th class="text-toned min-w-44 px-4 py-3 font-semibold">Usage / Options</th>
                </tr>
              </thead>
              <tbody class="divide-default divide-y">
                <tr
                  v-for="row in quickRef"
                  :key="row.modifier"
                  class="bg-default hover:bg-muted transition-colors"
                >
                  <td class="text-primary px-4 py-3 font-mono font-medium">
                    {{ row.modifier }}
                  </td>
                  <td class="text-toned px-4 py-3">{{ row.desc }}</td>
                  <td class="text-muted px-4 py-3 font-mono text-xs">
                    {{ row.example }}
                  </td>
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
            <h2 class="mb-2 text-3xl font-bold">Basic Animations</h2>
            <p class="text-muted">
              These run immediately on mount. Use
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"> .from </code>,
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"> .to </code>,
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"> .fromTo </code>, or
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"> .set </code>
              as the animation type.
            </p>
          </div>

          <!-- .from -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — .from</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('from')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['from']"
                class="bg-muted flex min-h-32 items-center justify-center p-8"
              >
                <div
                  v-gsap.from="{ opacity: 0, y: 40, duration: 0.8 }"
                  class="bg-primary/10 text-primary rounded-xl px-8 py-5 text-center font-semibold"
                >
                  Animates from opacity:0, y:40
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">v-gsap.from</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'from' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.from, 'from')"
                >
                  {{ copied === 'from' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.from }}</code></pre>
            </div>
          </div>

          <!-- .fromTo -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"> Demo — .fromTo </span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('fromTo')"
                >
                  Replay
                </UButton>
              </div>
              <div
                :key="replayKeys['fromTo']"
                class="bg-muted flex min-h-32 items-center justify-center p-8"
              >
                <div
                  v-gsap.fromTo="[
                    { scale: 0, rotation: -180 },
                    { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
                  ]"
                  class="bg-secondary/20 text-secondary flex h-20 w-20 items-center justify-center rounded-xl text-center text-xs font-bold"
                >
                  Scale + Rotate
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">v-gsap.fromTo</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'fromTo' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.fromTo, 'fromTo')"
                >
                  {{ copied === 'fromTo' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.fromTo }}</code></pre>
            </div>
          </div>

          <!-- .infinitely -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"> Demo — .infinitely </span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('infinitely')"
                >
                  Replay
                </UButton>
              </div>
              <div
                :key="replayKeys['infinitely']"
                class="bg-muted flex min-h-32 items-center justify-center gap-8 p-8"
              >
                <div
                  v-gsap.infinitely.to="{ rotation: 360, duration: 2, ease: 'linear' }"
                  class="bg-info/20 text-info flex h-16 w-16 items-center justify-center rounded-xl text-xs font-bold"
                >
                  Spin
                </div>
                <div
                  v-gsap.infinitely.fromTo="[
                    { y: -8 },
                    { y: 8, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 },
                  ]"
                  class="bg-success/20 text-success flex h-16 w-16 items-center justify-center rounded-xl text-xs font-bold"
                >
                  Float
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">v-gsap.infinitely</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'infinitely' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.infinitely, 'infinitely')"
                >
                  {{ copied === 'infinitely' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.infinitely }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Scroll-Triggered Entrance ── -->
      <section id="scroll" class="bg-muted py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Scroll-Triggered Entrances</h2>
            <p class="text-muted">
              Add
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">
                .whenVisible
              </code>
              to trigger animations when the element scrolls into view. Combine with
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"> .once </code>
              to play once, or omit it to scrub with scroll.
            </p>
          </div>

          <!-- whenVisible.once.from -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"> Demo — .whenVisible.once.from </span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('whenVisibleOnce')"
                >
                  Replay
                </UButton>
              </div>
              <div
                :key="replayKeys['whenVisibleOnce']"
                class="bg-muted flex min-h-32 items-center justify-center p-8"
              >
                <div
                  v-gsap.whenVisible.once.from="{ opacity: 0, y: 60, duration: 0.8 }"
                  class="bg-primary/10 text-primary rounded-xl px-8 py-5 text-center font-semibold"
                >
                  Slides up once when visible
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">whenVisible.once.from</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'whenVisibleOnce' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.whenVisibleOnce, 'whenVisibleOnce')"
                >
                  {{ copied === 'whenVisibleOnce' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.whenVisibleOnce }}</code></pre>
            </div>
          </div>

          <!-- whenVisible.once.reversible -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"
                  >Demo — .whenVisible.once.reversible.from</span
                >
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('whenVisibleReversible')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['whenVisibleReversible']"
                class="bg-muted flex min-h-32 items-center justify-center p-8"
              >
                <div
                  v-gsap.whenVisible.once.reversible.from="{ opacity: 0, x: -60, duration: 0.6 }"
                  class="bg-info/10 text-info rounded-xl px-8 py-5 text-center font-semibold"
                >
                  Slides in from left — reverses on scroll up
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">whenVisible.once.reversible</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'whenVisibleReversible' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.whenVisibleReversible, 'whenVisibleReversible')"
                >
                  {{ copied === 'whenVisibleReversible' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.whenVisibleReversible }}</code></pre>
            </div>
          </div>

          <!-- scrub -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"
                  >Demo — .whenVisible scrub (no .once)</span
                >
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('whenVisibleScrub')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['whenVisibleScrub']"
                class="bg-muted flex min-h-32 items-center justify-center p-8"
              >
                <div
                  v-gsap.whenVisible.fromTo="[
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1 },
                  ]"
                  class="bg-success/10 text-success rounded-xl px-8 py-5 text-center font-semibold"
                >
                  Scrubs with scroll position
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">whenVisible + scrub</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'whenVisibleScrub' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.whenVisibleScrub, 'whenVisibleScrub')"
                >
                  {{ copied === 'whenVisibleScrub' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.whenVisibleScrub }}</code></pre>
            </div>
          </div>

          <!-- delay -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — .delay-N (milliseconds)</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('whenVisibleDelay')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['whenVisibleDelay']"
                class="bg-muted flex min-h-32 items-center justify-center gap-4 p-8"
              >
                <div
                  v-gsap.whenVisible.once.from="{ opacity: 0, y: 30, duration: 0.6 }"
                  class="bg-warning/10 text-warning rounded-lg px-4 py-3 text-center text-sm font-semibold"
                >
                  Immediate
                </div>
                <div
                  v-gsap.whenVisible.once.from.delay-300="{ opacity: 0, y: 30, duration: 0.6 }"
                  class="bg-warning/10 text-warning rounded-lg px-4 py-3 text-center text-sm font-semibold"
                >
                  300ms delay
                </div>
                <div
                  v-gsap.whenVisible.once.from.delay-600="{ opacity: 0, y: 30, duration: 0.6 }"
                  class="bg-warning/10 text-warning rounded-lg px-4 py-3 text-center text-sm font-semibold"
                >
                  600ms delay
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">.delay-N modifier</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'whenVisibleDelay' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.whenVisibleDelay, 'whenVisibleDelay')"
                >
                  {{ copied === 'whenVisibleDelay' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.whenVisibleDelay }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Entrance Presets ── -->
      <section id="entrance-presets" class="py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Entrance Presets</h2>
            <p class="text-muted">
              Add
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.entrance</code>
              plus a preset name for one-line scroll animations. All presets use
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"
                >whenVisible.once.fromInvisible</code
              >
              under the hood.
            </p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="demo in entrancePresetDemos"
              :key="demo.id"
              class="border-default overflow-hidden rounded-xl border"
            >
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <code class="text-primary text-sm font-medium">{{ demo.label }}</code>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay(demo.id)"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys[demo.id]"
                class="bg-muted flex min-h-24 items-center justify-center p-6"
              >
                <div
                  v-if="demo.id === 'entranceFade'"
                  v-gsap.entrance.fade
                  class="rounded-lg px-4 py-3 text-sm font-semibold"
                  :class="[demo.bgClass, demo.textClass]"
                >
                  {{ demo.text }}
                </div>
                <div
                  v-else-if="demo.id === 'entranceSlideLeft'"
                  v-gsap.entrance.slide-left
                  class="rounded-lg px-4 py-3 text-sm font-semibold"
                  :class="[demo.bgClass, demo.textClass]"
                >
                  {{ demo.text }}
                </div>
                <div
                  v-else-if="demo.id === 'entranceSlideRight'"
                  v-gsap.entrance.slide-right
                  class="rounded-lg px-4 py-3 text-sm font-semibold"
                  :class="[demo.bgClass, demo.textClass]"
                >
                  {{ demo.text }}
                </div>
                <div
                  v-else-if="demo.id === 'entranceSlideBottom'"
                  v-gsap.entrance.slide-bottom
                  class="rounded-lg px-4 py-3 text-sm font-semibold"
                  :class="[demo.bgClass, demo.textClass]"
                >
                  {{ demo.text }}
                </div>
                <div
                  v-else-if="demo.id === 'entranceScale'"
                  v-gsap.entrance.scale
                  class="rounded-lg px-4 py-3 text-sm font-semibold"
                  :class="[demo.bgClass, demo.textClass]"
                >
                  {{ demo.text }}
                </div>
                <div
                  v-else-if="demo.id === 'entranceScaleFull'"
                  v-gsap.entrance.scale-full
                  class="rounded-lg px-4 py-3 text-sm font-semibold"
                  :class="[demo.bgClass, demo.textClass]"
                >
                  {{ demo.text }}
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === demo.id ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets[demo.snip as keyof typeof snippets], demo.id)"
                  >
                    {{ copied === demo.id ? 'Copied!' : 'Copy' }}
                  </UButton>
                </div>
                <pre
                  class="bg-muted text-toned max-h-28 overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets[demo.snip as keyof typeof snippets] }}</code></pre>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Text Split Animations ── -->
      <section id="text-split" class="bg-muted py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Text Split Animations</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.splitText</code>
              uses GSAP's SplitText plugin to break text into animatable units. Combine with
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.chars</code>,
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.words</code>, or
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.lines</code>.
            </p>
          </div>

          <!-- chars -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — .splitText.chars.from</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('splitChars')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['splitChars']"
                class="bg-muted flex min-h-28 items-center justify-center p-8"
              >
                <p
                  v-gsap.whenVisible.once.splitText.chars.from="{
                    opacity: 0,
                    y: 20,
                    stagger: 0.03,
                    duration: 0.5,
                  }"
                  class="text-highlighted text-3xl font-bold"
                >
                  Characters animate in
                </p>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">splitText.chars</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'splitChars' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.splitChars, 'splitChars')"
                >
                  {{ copied === 'splitChars' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.splitChars }}</code></pre>
            </div>
          </div>

          <!-- words -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — .splitText.words.from</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('splitWords')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['splitWords']"
                class="bg-muted flex min-h-28 items-center justify-center p-8"
              >
                <p
                  v-gsap.whenVisible.once.splitText.words.from="{
                    opacity: 0,
                    x: -20,
                    stagger: 0.08,
                    duration: 0.6,
                  }"
                  class="text-highlighted max-w-sm text-center text-2xl font-semibold"
                >
                  Each word slides in from the left
                </p>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">splitText.words</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'splitWords' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.splitWords, 'splitWords')"
                >
                  {{ copied === 'splitWords' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.splitWords }}</code></pre>
            </div>
          </div>

          <!-- lines -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — .splitText.lines.from</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('splitLines')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['splitLines']"
                class="bg-muted flex min-h-28 items-center justify-center p-8"
              >
                <p
                  v-gsap.whenVisible.once.splitText.lines.from="{
                    opacity: 0,
                    y: 30,
                    stagger: 0.12,
                    duration: 0.7,
                  }"
                  class="text-highlighted max-w-sm text-center text-lg leading-relaxed"
                >
                  First line fades in. Then the second line follows. Finally the third line appears.
                </p>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">splitText.lines</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'splitLines' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.splitLines, 'splitLines')"
                >
                  {{ copied === 'splitLines' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.splitLines }}</code></pre>
            </div>
          </div>

          <!-- mask -->
          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — .splitText.words.mask</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('splitMask')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['splitMask']"
                class="bg-muted flex min-h-28 items-center justify-center p-8"
              >
                <p
                  v-gsap.whenVisible.once.splitText.words.mask.from="{
                    y: '100%',
                    stagger: 0.08,
                    duration: 0.6,
                    ease: 'power3.out',
                  }"
                  class="text-highlighted text-3xl font-bold"
                >
                  Masked word reveal
                </p>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">splitText.mask</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'splitMask' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.splitMask, 'splitMask')"
                >
                  {{ copied === 'splitMask' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.splitMask }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Hover Animations ── -->
      <section id="hover" class="py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Hover Animations</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.whileHover</code>
              plays the animation on mouseenter and reverses on mouseleave. Add
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.noReverse</code>
              to skip the reverse. These demos are always interactive — no replay needed.
            </p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .whileHover.to — scale
              </div>
              <div class="bg-muted flex min-h-32 items-center justify-center p-8">
                <div
                  v-gsap.whileHover.to="{ scale: 1.08, duration: 0.3, ease: 'power2.out' }"
                  class="bg-primary/10 text-primary cursor-pointer rounded-xl px-8 py-5 font-semibold"
                >
                  Hover me
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'whileHoverScale' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.whileHoverScale, 'whileHoverScale')"
                    >{{ copied === 'whileHoverScale' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned max-h-28 overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.whileHoverScale }}</code></pre>
              </div>
            </div>

            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .whileHover.to — rotate + scale
              </div>
              <div class="bg-muted flex min-h-32 items-center justify-center p-8">
                <div
                  v-gsap.whileHover.to="{ rotation: 6, scale: 1.05, duration: 0.25 }"
                  class="bg-info/10 text-info cursor-pointer rounded-xl px-8 py-5 font-semibold"
                >
                  Hover me
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'whileHoverRotate' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.whileHoverRotate, 'whileHoverRotate')"
                    >{{ copied === 'whileHoverRotate' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned max-h-28 overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.whileHoverRotate }}</code></pre>
              </div>
            </div>

            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .whileHover.noReverse.to — stays lifted
              </div>
              <div class="bg-muted flex min-h-32 items-center justify-center p-8">
                <div
                  v-gsap.whileHover.noReverse.to="{ y: -8, duration: 0.3 }"
                  class="bg-success/10 text-success cursor-pointer rounded-xl px-8 py-5 font-semibold"
                >
                  Lifts — stays lifted on leave
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'whileHoverNoReverse' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.whileHoverNoReverse, 'whileHoverNoReverse')"
                    >{{ copied === 'whileHoverNoReverse' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned max-h-28 overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.whileHoverNoReverse }}</code></pre>
              </div>
            </div>

            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .whileHover.fromTo — glow shadow
              </div>
              <div class="bg-muted flex min-h-32 items-center justify-center p-8">
                <div
                  v-gsap.whileHover.fromTo="[
                    { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
                    { boxShadow: '0 8px 32px 0 rgba(139,92,246,0.45)', duration: 0.3 },
                  ]"
                  class="bg-secondary/10 text-secondary cursor-pointer rounded-xl px-8 py-5 font-semibold"
                >
                  Hover for glow
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'whileHoverFromTo' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.whileHoverFromTo, 'whileHoverFromTo')"
                    >{{ copied === 'whileHoverFromTo' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned max-h-28 overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.whileHoverFromTo }}</code></pre>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Parallax ── -->
      <section id="parallax" class="bg-muted py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Parallax Scroll</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"
                >.parallax.slower-N</code
              >
              moves at 1/N speed (lags behind scroll).
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"
                >.parallax.faster-N</code
              >
              moves at N× speed (overtakes scroll). Scroll this section to see the effect.
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .parallax.slower-3
              </div>
              <div class="bg-accented relative h-48 overflow-hidden">
                <div
                  v-gsap.parallax.slower-3
                  class="text-highlighted from-primary to-secondary absolute inset-0 flex items-center justify-center bg-linear-to-br text-lg font-bold"
                >
                  Moves slower than scroll
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'parallaxSlower' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.parallaxSlower, 'parallaxSlower')"
                    >{{ copied === 'parallaxSlower' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.parallaxSlower }}</code></pre>
              </div>
            </div>

            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .parallax.faster-2
              </div>
              <div class="bg-accented relative h-48 overflow-hidden">
                <div
                  v-gsap.parallax.faster-2
                  class="text-highlighted from-info/60 to-info absolute inset-0 flex items-center justify-center bg-linear-to-br text-lg font-bold"
                >
                  Moves faster than scroll
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'parallaxFaster' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.parallaxFaster, 'parallaxFaster')"
                    >{{ copied === 'parallaxFaster' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.parallaxFaster }}</code></pre>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Stagger ── -->
      <section id="stagger" class="py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Stagger Animations</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.stagger</code>
              animates direct child elements in sequence. The stagger delay is set via
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">stagger</code>
              in the value object.
            </p>
          </div>

          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — staggered cards</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('stagger')"
                  >Replay</UButton
                >
              </div>
              <div :key="replayKeys['stagger']" class="bg-muted p-6">
                <div
                  v-gsap.whenVisible.once.stagger.from="{
                    opacity: 0,
                    y: 40,
                    duration: 0.5,
                    stagger: 0.1,
                  }"
                  class="grid grid-cols-3 gap-3"
                >
                  <div
                    class="bg-primary/10 text-primary rounded-lg p-4 text-center text-sm font-semibold"
                  >
                    Card 1
                  </div>
                  <div
                    class="bg-primary/10 text-primary rounded-lg p-4 text-center text-sm font-semibold"
                  >
                    Card 2
                  </div>
                  <div
                    class="bg-primary/10 text-primary rounded-lg p-4 text-center text-sm font-semibold"
                  >
                    Card 3
                  </div>
                  <div
                    class="bg-primary/10 text-primary rounded-lg p-4 text-center text-sm font-semibold"
                  >
                    Card 4
                  </div>
                  <div
                    class="bg-primary/10 text-primary rounded-lg p-4 text-center text-sm font-semibold"
                  >
                    Card 5
                  </div>
                  <div
                    class="bg-primary/10 text-primary rounded-lg p-4 text-center text-sm font-semibold"
                  >
                    Card 6
                  </div>
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">stagger</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'stagger' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.stagger, 'stagger')"
                >
                  {{ copied === 'stagger' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.stagger }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Timeline ── -->
      <section id="timeline" class="bg-muted py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Timeline Sequences</h2>
            <p class="text-muted">
              Add
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.timeline</code>
              to a parent element to create a GSAP timeline. Children use
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.add</code>
              to join it in order. Use
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.withPrevious</code>
              to play simultaneously with the preceding item.
            </p>
          </div>

          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — sequenced items</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('timeline')"
                  >Replay</UButton
                >
              </div>
              <div :key="replayKeys['timeline']" class="bg-muted p-6">
                <div v-gsap.timeline="{ scrub: false }" class="space-y-3">
                  <div
                    v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.45 }"
                    class="bg-info/10 text-info rounded-lg p-4 font-semibold"
                  >
                    1 — First (plays immediately)
                  </div>
                  <div
                    v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.45 }"
                    class="bg-info/10 text-info rounded-lg p-4 font-semibold"
                  >
                    2 — Second (plays after first)
                  </div>
                  <div
                    v-gsap.add.from="{ opacity: 0, x: -60, duration: 0.45 }"
                    class="bg-info/10 text-info rounded-lg p-4 font-semibold"
                  >
                    3 — Third (plays after second)
                  </div>
                  <div
                    v-gsap.add.withPrevious.from="{ opacity: 0, x: -60, duration: 0.45 }"
                    class="bg-info/10 text-info rounded-lg p-4 font-semibold"
                  >
                    4 — Plays with third (.withPrevious)
                  </div>
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">timeline + .add</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'timeline' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.timeline, 'timeline')"
                >
                  {{ copied === 'timeline' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.timeline }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Magnetic ── -->
      <section id="magnetic" class="py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Magnetic Effect</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.magnetic</code>
              attracts the element towards the cursor when nearby. Adjust intensity with
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.strong</code>,
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.stronger</code>,
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.weak</code>,
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.weaker</code>.
            </p>
          </div>

          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                Demo — hover near these buttons
              </div>
              <div class="bg-muted flex min-h-40 flex-wrap items-center justify-center gap-6 p-8">
                <button
                  v-gsap.magnetic.weak
                  class="bg-elevated hover:bg-accented text-default cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  Weak
                </button>
                <button
                  v-gsap.magnetic
                  class="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  Default
                </button>
                <button
                  v-gsap.magnetic.strong
                  class="text-highlighted bg-secondary hover:bg-secondary cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  Strong
                </button>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">magnetic</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'magnetic' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.magnetic, 'magnetic')"
                >
                  {{ copied === 'magnetic' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.magnetic }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Draggable ── -->
      <section id="draggable" class="bg-muted py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Draggable Elements</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.draggable</code>
              enables free drag.
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.draggable.x</code>
              constrains to horizontal.
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm"
                >.draggable.rotation</code
              >
              for spin drag.
            </p>
          </div>

          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                Demo — drag the shapes
              </div>
              <div class="bg-muted relative flex min-h-48 items-center justify-center gap-6 p-6">
                <div
                  v-gsap.draggable.x
                  class="bg-info/20 text-info flex h-20 w-20 cursor-grab items-center justify-center rounded-xl text-xs font-bold select-none active:cursor-grabbing"
                >
                  ↔ X only
                </div>
                <div
                  v-gsap.draggable
                  class="bg-primary/20 text-primary flex h-20 w-20 cursor-grab items-center justify-center rounded-full text-xs font-bold select-none active:cursor-grabbing"
                >
                  Free
                </div>
                <div
                  v-gsap.draggable.rotation
                  class="bg-warning/20 text-warning flex h-20 w-20 cursor-grab items-center justify-center rounded-xl text-xs font-bold select-none active:cursor-grabbing"
                >
                  ↻ Spin
                </div>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">draggable</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'draggableX' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.draggableX, 'draggableX')"
                >
                  {{ copied === 'draggableX' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.draggableXY }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Typewriter ── -->
      <section id="typewriter" class="py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Typewriter Effect</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.animateText</code>
              uses GSAP's TextPlugin to type the text content character by character. Control speed
              with
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.slow</code>
              or
              <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-sm">.fast</code>.
            </p>
          </div>

          <div class="grid items-start gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium">Demo — typewriter on scroll</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('animateText')"
                  >Replay</UButton
                >
              </div>
              <div
                :key="replayKeys['animateText']"
                class="bg-muted flex min-h-40 flex-col justify-center space-y-6 p-8"
              >
                <p
                  v-gsap.whenVisible.once.animateText
                  class="text-default dark:text-default font-mono text-lg"
                >
                  Default speed typewriter effect...
                </p>
                <p v-gsap.whenVisible.once.animateText.slow class="text-primary font-mono text-lg">
                  Slow typewriter, one char at a time.
                </p>
                <p v-gsap.whenVisible.once.animateText.fast class="text-success font-mono text-lg">
                  Fast typewriter blazes through!
                </p>
              </div>
            </div>
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-muted font-mono text-sm">animateText</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="copied === 'animateText' ? 'i-lucide-check' : 'i-lucide-copy'"
                  @click="() => copy(snippets.animateText, 'animateText')"
                >
                  {{ copied === 'animateText' ? 'Copied!' : 'Copy' }}
                </UButton>
              </div>
              <pre
                class="bg-muted text-default overflow-x-auto p-4 text-sm leading-relaxed"
              ><code>{{ snippets.animateText }}</code></pre>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Responsive & Advanced ── -->
      <section id="advanced" class="bg-muted py-16">
        <UContainer class="space-y-12">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Responsive & Advanced Patterns</h2>
            <p class="text-muted">
              Limit animations to a device size, pin elements during scroll, or trigger based on
              data attribute state.
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"
                  >.desktop / .mobile — breakpoint guards</span
                >
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('responsive')"
                  >Replay</UButton
                >
              </div>
              <div :key="replayKeys['responsive']" class="bg-muted space-y-3 p-6">
                <div
                  v-gsap.desktop.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.8 }"
                  class="bg-info/10 text-info rounded-lg p-4 text-sm font-semibold"
                >
                  Desktop only (≥768px)
                </div>
                <div
                  v-gsap.mobile.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.8 }"
                  class="bg-success/10 text-success rounded-lg p-4 text-sm font-semibold"
                >
                  Mobile only (&lt;768px)
                </div>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'desktopOnly' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.desktopOnly, 'desktopOnly')"
                    >{{ copied === 'desktopOnly' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.desktopOnly }}</code></pre>
              </div>
            </div>

            <div class="border-default overflow-hidden rounded-xl border">
              <div
                class="border-default bg-muted dark:bg-accented flex items-center justify-between border-b px-4 py-2"
              >
                <span class="text-toned text-sm font-medium"
                  >.fromInvisible — prevent SSR flash</span
                >
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-rotate-ccw"
                  @click="() => replay('fromInvisible')"
                  >Replay</UButton
                >
              </div>
              <div :key="replayKeys['fromInvisible']" class="bg-muted p-6">
                <div
                  v-gsap.whenVisible.once.fromInvisible.from="{ y: 40, duration: 0.8 }"
                  class="bg-warning/10 text-warning rounded-lg p-4 text-sm font-semibold"
                >
                  Starts invisible on SSR — no flash before JS
                </div>
                <p class="text-muted mt-3 text-xs">
                  Adds <code class="font-mono">data-vgsap-from-invisible</code> in SSR HTML so your
                  CSS can hide the element until GSAP runs.
                </p>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'fromInvisible' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.fromInvisible, 'fromInvisible')"
                    >{{ copied === 'fromInvisible' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.fromInvisible }}</code></pre>
              </div>
            </div>

            <div class="border-default overflow-hidden rounded-xl border md:col-span-2">
              <div
                class="border-default bg-muted dark:bg-accented text-toned border-b px-4 py-2 text-sm font-medium"
              >
                .pinned — pin element during scroll travel
              </div>
              <div class="bg-muted p-6">
                <p class="text-toned mb-4 text-sm">
                  The
                  <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-xs">.pinned</code>
                  modifier creates a ScrollTrigger that pins the element in the viewport while
                  scrolling through the defined
                  <code class="bg-accented rounded px-1.5 py-0.5 font-mono text-xs">end</code>
                  distance. Use it on full-height sections, not inline cards.
                </p>
              </div>
              <div class="border-default border-t">
                <div class="bg-muted flex items-center justify-between px-4 py-2">
                  <span class="text-muted font-mono text-xs">code</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    :icon="copied === 'pinned' ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="() => copy(snippets.pinned, 'pinned')"
                    >{{ copied === 'pinned' ? 'Copied!' : 'Copy' }}</UButton
                  >
                </div>
                <pre
                  class="bg-muted text-toned overflow-x-auto p-3 text-xs leading-relaxed"
                ><code>{{ snippets.pinned }}</code></pre>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- ── Section: Value Reference ── -->
      <section id="value-ref" class="py-16">
        <UContainer class="space-y-8">
          <div>
            <h2 class="mb-2 text-3xl font-bold">Value Object Reference</h2>
            <p class="text-muted">
              All GSAP tween properties are valid. Common scroll-specific keys consumed by the
              directive:
            </p>
          </div>
          <div class="border-default overflow-x-auto rounded-xl border">
            <table class="w-full text-sm">
              <thead class="bg-accented text-left">
                <tr>
                  <th class="text-toned px-4 py-3 font-semibold">Key</th>
                  <th class="text-toned px-4 py-3 font-semibold">Type</th>
                  <th class="text-toned px-4 py-3 font-semibold">Default</th>
                  <th class="text-toned px-4 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody class="divide-default divide-y">
                <tr
                  v-for="{ key, type, def, desc } in [
                    {
                      key: 'start',
                      type: 'string',
                      def: '\'top 90%\'',
                      desc: 'ScrollTrigger start point',
                    },
                    {
                      key: 'end',
                      type: 'string',
                      def: '\'top 50%\'',
                      desc: 'ScrollTrigger end point',
                    },
                    {
                      key: 'scrub',
                      type: 'boolean | number',
                      def: 'true (without .once)',
                      desc: 'Tie to scroll position; number = lag in seconds',
                    },
                    {
                      key: 'scroller',
                      type: 'string | Element',
                      def: 'window',
                      desc: 'Custom scroll container',
                    },
                    {
                      key: 'stagger',
                      type: 'number | object',
                      def: '0.2 (with .stagger)',
                      desc: 'Stagger delay between elements',
                    },
                    {
                      key: 'duration',
                      type: 'number',
                      def: '0.5',
                      desc: 'Animation duration in seconds',
                    },
                    {
                      key: 'ease',
                      type: 'string',
                      def: '\'power1.out\'',
                      desc: 'GSAP easing string',
                    },
                    { key: 'opacity', type: 'number', def: '—', desc: 'Target opacity (0–1)' },
                    {
                      key: 'x / y',
                      type: 'number | string',
                      def: '—',
                      desc: 'Translate X or Y (px or %)',
                    },
                    {
                      key: 'xPercent / yPercent',
                      type: 'number',
                      def: '—',
                      desc: 'Translate as % of element size',
                    },
                    { key: 'scale', type: 'number', def: '—', desc: 'Scale factor' },
                    { key: 'rotation', type: 'number', def: '—', desc: 'Rotation in degrees' },
                  ]"
                  :key
                  class="bg-default hover:bg-muted transition-colors"
                >
                  <td class="text-primary px-4 py-3 font-mono font-medium">
                    {{ key }}
                  </td>
                  <td class="text-muted px-4 py-3 font-mono text-xs">
                    {{ type }}
                  </td>
                  <td class="text-muted px-4 py-3 font-mono text-xs">
                    {{ def }}
                  </td>
                  <td class="text-toned px-4 py-3">{{ desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </UContainer>
      </section>

      <!-- Footer nav -->
      <section class="border-default dark:border-default bg-muted border-t py-12">
        <UContainer>
          <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 class="text-highlighted mb-1 text-xl font-bold">v-gsap Directive</h3>
              <p class="text-muted text-sm">Part of the motion layer — GSAP + Locomotive Scroll</p>
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
  </LayoutPage>
</template>
