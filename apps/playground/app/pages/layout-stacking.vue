<script setup lang="ts">
  definePageMeta({ layout: 'grid' })

  const { setPageAccent } = useAccentColor()
  setPageAccent('amber')
  onUnmounted(() => setPageAccent(null))

  const { gsap } = useGsap()

  const sectionStyles = [1, 2, 3, 4, 5].map((n) => ({
    position: 'sticky',
    top: '0px',
    zIndex: n,
    transformOrigin: 'top center',
    willChange: n < 5 ? 'transform' : undefined,
  }))

  let ctx: ReturnType<typeof gsap.context> | null = null

  onMounted(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-section]'))
    if (sections.length < 2) return

    ctx = gsap.context(() => {
      sections.slice(0, -1).forEach((section, i) => {
        gsap.fromTo(
          section,
          { scale: 1 },
          {
            scale: 0.88,
            ease: 'none',
            scrollTrigger: {
              trigger: sections[i + 1],
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          }
        )
      })
    })
  })

  onUnmounted(() => {
    ctx?.revert()
    ctx = null
  })
</script>

<template>
  <div class="contents">
    <div class="stack-progress">
      <MotionScrollProgress type="linear" :height="3" :show-percentage="false" />
    </div>

    <!-- Section 1: Intro -->
    <LayoutSection data-stack-section="1" :style="sectionStyles[0]">
      <LayoutGridItem
        preset="centered"
        :row-start="4"
        :row-span="5"
        align="center"
        justify="center"
      >
        <div class="space-y-6 px-4 text-center">
          <div class="flex justify-center">
            <UButton
              to="/layout"
              leading-icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
            >
              Back to Layout Docs
            </UButton>
          </div>
          <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">Z-Index Stacking Demos</h1>
          <p class="text-muted mx-auto max-w-xl text-lg">
            Each section below uses real
            <code class="font-mono text-sm">LayoutGridItem</code> components with the
            <code class="font-mono text-sm">layer</code> prop. Scroll through to see how stacking
            layers interact.
          </p>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Section 2: Background + Content (hero pattern) -->
    <LayoutSection data-stack-section="2" :style="sectionStyles[1]">
      <!-- layer="back": full-bleed amber gradient, rows 1–12 -->
      <LayoutGridItem bleed="both" :row-span="12" layer="back">
        <div
          class="flex h-full w-full items-end bg-linear-to-br from-amber-900 via-amber-800 to-orange-900 p-6 lg:p-8"
        >
          <span class="text-highlighted rounded bg-black/50 px-2 py-1 font-mono text-xs">
            layer='back' · z-index: 0 · rows 1–12
          </span>
        </div>
      </LayoutGridItem>

      <!-- layer="mid": floating content card, rows 4–8 -->
      <LayoutGridItem
        preset="centered"
        :row-start="4"
        :row-span="5"
        align="center"
        justify="center"
        layer="mid"
      >
        <div
          class="text-highlighted w-full space-y-4 rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-sm lg:p-12"
        >
          <h2 class="text-3xl font-bold">Background + Content</h2>
          <p class="text-highlighted/80 mx-auto max-w-md">
            The background uses
            <code class="rounded bg-black/30 px-1 font-mono text-sm">bleed="both"</code>
            to reach the viewport edges. The content floats above it with
            <code class="rounded bg-black/30 px-1 font-mono text-sm">layer="mid"</code>.
          </p>
          <div class="flex justify-center">
            <span class="text-highlighted rounded bg-black/50 px-2 py-1 font-mono text-xs">
              layer='mid' · z-index: 10 · rows 4–8
            </span>
          </div>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Section 3: Four-layer stack (back / mid / front / top) -->
    <LayoutSection data-stack-section="3" :style="sectionStyles[2]">
      <!-- layer="back": full-bleed dark base, rows 1–12 -->
      <LayoutGridItem bleed="both" :row-span="12" layer="back">
        <div class="bg-muted flex h-full w-full items-end p-6 lg:p-8">
          <span class="text-highlighted rounded bg-black/50 px-2 py-1 font-mono text-xs">
            layer='back' · z-index: 0
          </span>
        </div>
      </LayoutGridItem>

      <!-- layer="mid": tall card, cols 3–16 (lg), rows 2–11 -->
      <LayoutGridItem
        :col-start="{ default: 1, lg: 3 }"
        :col-span="{ default: 6, lg: 14 }"
        :row-start="2"
        :row-span="10"
        layer="mid"
      >
        <div
          class="flex h-full w-full flex-col justify-between rounded-xl border border-sky-700/50 bg-sky-900/90 p-6 shadow-xl"
        >
          <div>
            <h2 class="text-highlighted text-2xl font-bold">Mid Layer</h2>
            <p class="mt-2 text-sm text-sky-200">
              Sits above the background. Standard content and interactive elements live here.
            </p>
          </div>
          <span class="text-highlighted self-start rounded bg-black/50 px-2 py-1 font-mono text-xs">
            layer='mid' · z-index: 10
          </span>
        </div>
      </LayoutGridItem>

      <!-- layer="front": smaller card, cols 5–14 (lg), rows 3–9 -->
      <LayoutGridItem
        :col-start="{ default: 1, lg: 5 }"
        :col-span="{ default: 6, lg: 10 }"
        :row-start="3"
        :row-span="7"
        layer="front"
      >
        <div
          class="flex h-full w-full flex-col justify-between rounded-xl border border-violet-600/50 bg-violet-800/90 p-6 shadow-xl"
        >
          <div>
            <h3 class="text-highlighted text-xl font-bold">Front Layer</h3>
            <p class="mt-2 text-sm text-violet-200">
              Elevated above mid — sticky elements, floating panels, tooltips.
            </p>
          </div>
          <span class="text-highlighted self-start rounded bg-black/50 px-2 py-1 font-mono text-xs">
            layer='front' · z-index: 20
          </span>
        </div>
      </LayoutGridItem>

      <!-- layer="top": pill badge, cols 7–12 (lg), rows 5–7 -->
      <LayoutGridItem
        :col-start="{ default: 1, lg: 7 }"
        :col-span="{ default: 6, lg: 6 }"
        :row-start="5"
        :row-span="3"
        align="center"
        justify="center"
        layer="top"
      >
        <div class="rounded-full bg-rose-500 px-8 py-4 text-center shadow-2xl">
          <div class="text-highlighted text-lg font-bold">Top Layer</div>
          <div class="text-highlighted/80 mt-1 font-mono text-xs">layer='top' · z-index: 30</div>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Section 4: Footer hidden behind body -->
    <LayoutSection data-stack-section="4" :style="sectionStyles[3]">
      <!-- layer="back" (footer): rows 8–12. Hidden behind body in rows 8–10; visible in rows 11–12 -->
      <LayoutGridItem bleed="both" :row-start="8" :row-span="5" layer="back">
        <div class="flex h-full w-full flex-col justify-end bg-teal-700 p-8 lg:p-12">
          <div class="space-y-2">
            <h3 class="text-highlighted text-2xl font-bold">Footer</h3>
            <p class="text-sm text-teal-200">
              <code class="rounded bg-black/20 px-1 font-mono">layer="back"</code> (z-index: 0).
              Hidden behind body in rows 8–10. Visible in rows 11–12.
            </p>
            <span
              class="text-highlighted mt-1 inline-block rounded bg-black/50 px-2 py-1 font-mono text-xs"
            >
              layer='back' · z-index: 0 · rows 8–12
            </span>
          </div>
        </div>
      </LayoutGridItem>

      <!-- layer="mid" (body): rows 1–10. Covers the footer in rows 8–10 -->
      <LayoutGridItem bleed="both" :row-start="1" :row-span="10" layer="mid">
        <div class="flex h-full w-full flex-col justify-between bg-indigo-900/95 p-8 lg:p-12">
          <div class="space-y-4">
            <h2 class="text-highlighted text-3xl font-bold">Body Content</h2>
            <p class="max-w-xl text-indigo-200">
              This item uses
              <code class="rounded bg-white/10 px-1 font-mono text-sm">layer="mid"</code>
              (z-index: 10) spanning rows 1–10. The footer below starts at row 8 but is covered by
              the body in rows 8–10.
            </p>
            <p class="text-sm text-indigo-300">
              Scroll down to see the footer peek out below in rows 11–12.
            </p>
          </div>
          <span class="text-highlighted self-start rounded bg-black/50 px-2 py-1 font-mono text-xs">
            layer='mid' · z-index: 10 · rows 1–10
          </span>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Navigation footer -->
    <LayoutSection data-stack-section="5" :style="sectionStyles[4]">
      <LayoutGridItem
        preset="centered"
        :row-start="5"
        :row-span="3"
        align="center"
        justify="center"
      >
        <div class="flex gap-3">
          <UButton to="/layout" leading-icon="i-lucide-arrow-left" color="neutral" variant="soft">
            Back to Layout Docs
          </UButton>
          <UButton
            to="/layout-blind-reveal"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="soft"
          >
            Blind Reveal Demo
          </UButton>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </div>
</template>

<style scoped>
  .stack-progress {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    pointer-events: none;
  }
</style>
