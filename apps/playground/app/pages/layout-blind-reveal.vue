<script setup lang="ts">
  definePageMeta({ layout: 'grid' })

  const { setPageAccent } = useAccentColor()
  setPageAccent('amber')
  onUnmounted(() => setPageAccent(null))

  const { gsap } = useGsap()

  const contentStyle = { position: 'relative', zIndex: 2 }

  const footerStyle = {
    position: 'sticky',
    bottom: '0',
    zIndex: 1,
    transformOrigin: 'bottom center',
    willChange: 'transform',
    display: 'grid',
    alignSelf: 'end',
  }

  let ctx: ReturnType<typeof gsap.context> | null = null

  onMounted(() => {
    const contentSections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-blind-content]')
    )
    const footer = document.querySelector<HTMLElement>('[data-blind-footer]')
    if (!footer || contentSections.length === 0) return

    const lastContent = contentSections[contentSections.length - 1]

    ctx = gsap.context(() => {
      gsap.fromTo(
        footer,
        { scale: 0.92 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: lastContent,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
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

    <!-- Content section 1: Hero -->
    <LayoutSection data-blind-content="1" :style="contentStyle" class="bg-default">
      <LayoutGridItem bleed="both" :row-span="12" layer="back" class="bg-default">
        <div class="bg-background h-full w-full" />
      </LayoutGridItem>

      <LayoutGridItem
        preset="centered"
        :row-start="4"
        :row-span="5"
        align="center"
        justify="center"
        class="bg-default"
      >
        <div class="space-y-6 px-4 text-center">
          <div class="flex justify-center gap-3">
            <UButton
              to="/layout"
              leading-icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
            >
              Back to Layout Docs
            </UButton>
            <UButton
              to="/layout-stacking"
              leading-icon="i-lucide-layers"
              color="neutral"
              variant="ghost"
              size="sm"
            >
              Stacking Demo
            </UButton>
          </div>
          <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">Blind Reveal</h1>
          <p class="text-muted mx-auto max-w-xl text-lg">
            The footer sits <em>behind</em> the body content at a lower z-index, pinned to the
            viewport bottom with <code class="font-mono text-sm">position: sticky; bottom: 0</code>.
            As you scroll, the body slides away upward — revealing the footer like rolling up a
            blind.
          </p>
          <p class="text-muted/70 text-sm">Scroll down to see it in action</p>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Content section 2: Explanation -->
    <LayoutSection data-blind-content="2" :style="contentStyle" class="bg-default">
      <LayoutGridItem bleed="both" :row-span="12" layer="back" class="bg-default">
        <div class="h-full w-full bg-linear-to-br from-slate-900 via-slate-800 to-zinc-900" />
      </LayoutGridItem>

      <LayoutGridItem
        preset="centered"
        :row-start="3"
        :row-span="7"
        align="center"
        justify="center"
        layer="mid"
        class="bg-default"
      >
        <div
          class="text-highlighted w-full space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:p-12"
        >
          <h2 class="text-3xl font-bold">How it works</h2>
          <div class="text-highlighted/70 grid grid-cols-1 gap-6 text-sm lg:grid-cols-2">
            <div class="space-y-2">
              <div class="text-highlighted text-base font-semibold">Body content</div>
              <p><code class="rounded bg-white/10 px-1 font-mono">position: relative</code></p>
              <p><code class="rounded bg-white/10 px-1 font-mono">z-index: 2</code></p>
              <p>Scrolls normally through the document flow.</p>
            </div>
            <div class="space-y-2">
              <div class="text-highlighted text-base font-semibold">Footer</div>
              <p>
                <code class="rounded bg-white/10 px-1 font-mono">position: sticky; bottom: 0</code>
              </p>
              <p><code class="rounded bg-white/10 px-1 font-mono">z-index: 1</code></p>
              <p>Pinned to the viewport bottom, but always behind the body.</p>
            </div>
          </div>
          <p class="text-highlighted/50 text-sm">
            This is the spatial inverse of the stacking demo — instead of sections sliding
            <em>in</em> from below, the body slides <em>away</em> upward.
          </p>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Content section 3: Last — its exit triggers the footer reveal -->
    <LayoutSection data-blind-content="3" :style="contentStyle" class="bg-default">
      <LayoutGridItem bleed="both" :row-span="12" layer="back">
        <div class="h-full w-full bg-linear-to-b from-indigo-950 to-violet-950" />
      </LayoutGridItem>

      <LayoutGridItem
        preset="centered"
        :row-start="4"
        :row-span="5"
        align="center"
        justify="center"
        layer="mid"
      >
        <div class="space-y-6 px-4 text-center">
          <div class="text-5xl">↓</div>
          <h2 class="text-highlighted text-3xl font-bold">Keep scrolling</h2>
          <p class="text-highlighted/60 mx-auto max-w-md">
            As this section exits the top of the viewport, the footer beneath it will be fully
            revealed. A GSAP scrub scales it from
            <code class="rounded bg-white/10 px-1 font-mono text-sm">0.92 → 1</code> with
            <code class="rounded bg-white/10 px-1 font-mono text-sm">
              transform-origin: bottom center
            </code>
            — the bottom edge stays pinned while the panel grows upward.
          </p>
        </div>
      </LayoutGridItem>
    </LayoutSection>

    <!-- Footer: sticky bottom, revealed from underneath -->
    <LayoutSection data-blind-footer :style="footerStyle">
      <LayoutGridItem bleed="both" :row-span="12" layer="back">
        <div class="bg-default h-full w-full" />
      </LayoutGridItem>

      <LayoutGridItem :row-start="3" :row-span="6" align="center" justify="center" layer="mid">
        <div class="space-y-8 px-4 text-center">
          <h2 class="text-highlighted text-4xl font-bold tracking-tight lg:text-6xl">
            The blind is open.
          </h2>
          <p class="text-highlighted/40 mx-auto max-w-lg">
            The footer was here all along — fixed at the bottom of the document, waiting for the
            body content to scroll away.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <UButton
              to="/layout-stacking"
              leading-icon="i-lucide-layers"
              color="neutral"
              variant="soft"
            >
              Stacking Demo
            </UButton>
            <UButton
              to="/layout"
              leading-icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
            >
              Back to Layout Docs
            </UButton>
          </div>
        </div>
      </LayoutGridItem>

      <LayoutGridItem :row-start="10" :row-span="2" align="end" justify="center" layer="mid">
        <p class="text-highlighted/20 pb-4 font-mono text-xs">
          position: sticky · bottom: 0 · z-index: 1 · scale: 0.92 → 1
        </p>
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
