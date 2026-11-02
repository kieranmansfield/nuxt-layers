<script setup lang="ts">
  import type { LoadingScreenState } from '../types/loading'
  import { bootScript, resolveLoadingConfig } from '../utils/loading'

  // Beat on "100" so the finished count registers before the exit starts
  const HOLD_MS = 350

  const { enabled, label, background, textColor, zIndex, showAfter, minDuration, maxDuration } =
    resolveLoadingConfig(useAppConfig().coreLayer)

  const { isLoading, skipped } = useLoading()
  // Written only here; everything else reads it through useLoading().screen
  const screen = useState<LoadingScreenState>('core:loading:screen', () => 'hidden')

  const visible = ref(enabled)
  if (enabled) screen.value = 'visible'

  // How the screen leaves: `flip` once the counter has shown, `fade` when the work finished
  // before it did (only the backdrop was ever seen), `skip` for finishNow / reduced motion
  let exit: 'flip' | 'fade' | 'skip' = 'flip'

  if (enabled) {
    useHead({
      // Nothing dismisses the screen without JS - don't let it trap the page
      noscript: [
        { innerHTML: '<style>#loading-screen{display:none}html{overflow:auto!important}</style>' },
      ],
      // The count runs before Vue does, from the first paint (see bootLoading)
      script: [
        {
          key: 'core-loading',
          tagPosition: 'bodyClose',
          innerHTML: bootScript({ showAfter, minDuration, maxDuration }),
        },
      ],
    })
  }

  // Started on mount, so a slow connection has fetched GSAP by the time the count finishes
  let gsapReady: Promise<[typeof import('gsap'), typeof import('gsap/Flip')]> | undefined
  const loadGsap = () => (gsapReady ??= Promise.all([import('gsap'), import('gsap/Flip')]))
  onMounted(() => {
    if (visible.value) void loadGsap().catch(() => {})
  })

  // Exit: the count Flips from its big spot into a small corner tag while the backdrop fades to
  // reveal the page, then the tag dissolves. If GSAP fails to load the screen just leaves.
  async function onLeave(el: Element, done: () => void): Promise<void> {
    // Releases the scroll lock (see the style block)
    el.setAttribute('data-leaving', '')
    if (exit === 'skip') return done()
    try {
      const [{ gsap }, { Flip }] = await loadGsap()
      gsap.registerPlugin(Flip)
      const backdrop = el.querySelector('.loading-backdrop')
      const tl = gsap.timeline({ paused: true }).set(el, { pointerEvents: 'none' })

      if (exit === 'flip') {
        const content = el.querySelector('.loading-content')
        const state = Flip.getState(content)
        el.classList.add('is-leaving')
        tl.add(Flip.from(state, { duration: 0.9, ease: 'power3.inOut', scale: true }), 0)
          .to(el.querySelector('.loading-bar'), { opacity: 0, duration: 0.3 }, 0)
          .to(backdrop, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 0.35)
          .to(content, { opacity: 0, duration: 0.35, ease: 'power1.in' }, '>-0.1')
      } else {
        tl.to(backdrop, { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
      }

      // The scroll layer pauses GSAP's global timeline until the screen is gone, so the exit
      // can't play on it: advance it from the ticker instead
      const advance = (_time: number, deltaTime: number) => {
        tl.time(tl.time() + deltaTime / 1000)
        if (tl.progress() < 1) return
        gsap.ticker.remove(advance)
        done()
      }
      gsap.ticker.add(advance)
    } catch {
      done()
    }
  }

  function exitMode(): typeof exit {
    if (skipped.value) return 'skip'
    return window.__coreLoading?.shown ? 'flip' : 'fade'
  }

  watch(
    isLoading,
    (loading) => {
      if (loading || !visible.value) return
      exit = exitMode()
      setTimeout(
        () => {
          visible.value = false
          screen.value = 'leaving'
        },
        exit === 'flip' ? HOLD_MS : 0
      )
    },
    { immediate: true }
  )
</script>

<template>
  <Transition :css="false" @leave="onLeave" @after-leave="screen = 'hidden'">
    <!-- The count, bar and data-shown are written by the boot runtime, so Vue leaves those nodes
         empty and unbound: they never mismatch on hydration -->
    <div
      v-if="visible"
      id="loading-screen"
      class="loading-screen"
      :style="{ color: textColor, zIndex }"
    >
      <div class="loading-backdrop" :style="{ backgroundColor: background }" />
      <div
        class="loading-content"
        role="progressbar"
        :aria-label="label || 'Loading'"
        aria-valuemin="0"
        aria-valuemax="100"
        data-loading-meter
      >
        <span v-if="label" class="loading-label" aria-hidden="true">{{ label }}</span>
        <span class="loading-progress" aria-hidden="true"
          ><span data-loading-count /><span class="loading-unit">%</span></span
        >
      </div>
      <div class="loading-bar" data-loading-bar />
    </div>
  </Transition>
</template>

<style scoped>
  /* Lock page scroll from the first paint until the exit begins. CSS, not a useHead html style:
     unhead never removes an SSR'd style the client stopped wanting before its first render, so a
     quick finish (reduced motion) left the page unscrollable */
  @media (prefers-reduced-motion: no-preference) {
    :global(html:has(.loading-screen:not([data-leaving]))) {
      overflow: hidden;
    }
  }

  .loading-screen {
    display: grid;
    position: fixed;
    inset: 0;
    container-type: size;
  }

  /* Opaque from the first paint, so the page never flashes in before the screen */
  .loading-backdrop {
    position: absolute;
    inset: 0;
  }

  .loading-content {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    place-self: center;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
  }

  /* The counter waits for showAfter (data-shown, set by the boot runtime): loads that finish
     sooner only see the backdrop. `translate`, not `transform` - the Flip exit owns transform */
  .loading-content,
  .loading-bar {
    transition:
      opacity 0.3s ease,
      translate 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .loading-screen:not([data-shown]) .loading-content {
    translate: 0 0.75rem;
    opacity: 0;
  }

  .loading-screen:not([data-shown]) .loading-bar {
    opacity: 0;
  }

  .loading-label {
    margin-bottom: 1em;
    font-weight: 500;
    font-size: clamp(0.75rem, 1cqw + 0.5rem, 1rem);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  .loading-progress {
    font-weight: 900;
    font-stretch: ultra-expanded;

    /* "100%" is ~3.1em wide in the expanded face: size so it fits the screen with 2rem a side */
    font-size: clamp(3rem, calc((100cqw - 4rem) / 3.1), 18rem);
    line-height: 0.8;

    /* Equal-width digits - the counter doesn't jitter as it ticks */
    font-variant-numeric: tabular-nums;
  }

  /* Before the runtime's first write */
  [data-loading-count]:empty::before {
    content: '0';
  }

  .loading-unit {
    margin-left: 0.08em;
    font-weight: 500;
    font-size: 0.2em;
    vertical-align: top;
    opacity: 0.6;
  }

  .loading-bar {
    position: absolute;
    inset: auto 0 0;
    height: 2px;
    transform: scaleX(0);
    transform-origin: left;
    background-color: currentcolor;
    opacity: 0.5;
  }

  @media (width >= 768px) {
    .loading-content {
      align-items: flex-start;
      place-self: end start;
      padding: 2rem;
    }
  }

  /* Exit end state: the corner tag the count Flips into (see onLeave). Layout only - the motion
     is GSAP Flip */
  /* GSAP tweens opacity every frame from here - a CSS transition would lag behind it */
  .is-leaving .loading-content,
  .is-leaving .loading-bar {
    transition: none;
  }

  .is-leaving .loading-content {
    align-items: flex-start;
    place-self: start start;
    padding: 1.25rem 2rem;
  }

  .is-leaving .loading-progress {
    font-size: 1.5rem;
  }

  .is-leaving .loading-label {
    display: none;
  }

  /* No screen under reduced motion - the boot runtime ends the count at once */
  @media (prefers-reduced-motion: reduce) {
    .loading-screen {
      display: none;
    }
  }
</style>
