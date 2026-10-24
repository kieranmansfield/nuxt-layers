<script setup lang="ts">
  import type { LoadingScreenState } from '../types/loading'
  import { resolveLoadingConfig } from '../utils/loading'

  // Beat on "100" so the finished count registers before the exit starts
  const HOLD_MS = 350

  const { enabled, label, background, textColor, zIndex, showAfter } = resolveLoadingConfig(
    useAppConfig().coreLayer
  )

  const { isLoading, progress, skipped } = useLoading()
  // Written only here; everything else reads it through useLoading().screen
  const screen = useState<LoadingScreenState>('core:loading:screen', () => 'hidden')

  const visible = ref(enabled)
  if (enabled) screen.value = 'visible'
  // Leave without the beat or the exit animation: skipped, or done before it ever faded in
  const instant = ref(false)

  const displayProgress = computed(() => Math.floor(progress.value))

  if (enabled) {
    useHead({
      // Lock page scroll from the SSR'd first paint until the exit begins
      htmlAttrs: {
        style: computed(() => (screen.value === 'visible' ? 'overflow: hidden' : '')),
      },
      // Nothing dismisses the screen without JS - don't let it trap the page
      noscript: [
        { innerHTML: '<style>#loading-screen{display:none}html{overflow:auto!important}</style>' },
      ],
    })
  }

  watch(
    isLoading,
    (loading) => {
      if (loading || !visible.value) return
      instant.value = skipped.value || performance.now() < showAfter
      setTimeout(
        () => {
          visible.value = false
          screen.value = 'leaving'
        },
        instant.value ? 0 : HOLD_MS
      )
    },
    { immediate: true }
  )
</script>

<template>
  <Transition name="loading-screen" :css="!instant" @after-leave="screen = 'hidden'">
    <div
      v-if="visible"
      id="loading-screen"
      class="loading-screen"
      :style="{
        backgroundColor: background,
        color: textColor,
        zIndex,
        '--loading-show-after': `${showAfter}ms`,
      }"
    >
      <div
        class="loading-content"
        role="progressbar"
        :aria-label="label || 'Loading'"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="displayProgress"
      >
        <span v-if="label" class="loading-label" aria-hidden="true">{{ label }}</span>
        <span class="loading-progress" aria-hidden="true"
          >{{ displayProgress }}<span class="loading-unit">%</span></span
        >
      </div>
      <div class="loading-bar" :style="{ transform: `scaleX(${progress / 100})` }" />
    </div>
  </Transition>
</template>

<style scoped>
  .loading-screen {
    display: grid;
    position: fixed;
    inset: 0;
    container-type: size;

    /* Fast loads never see it: hidden and click-through until showAfter has passed.
       `backwards`, not `both` - a held end state would block the exit transition below */
    animation: loading-show 0.2s ease var(--loading-show-after, 0ms) backwards;
  }

  .loading-content {
    display: flex;
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

    /* `backwards`, not `both` - a held end state would block the exit transition below */
    animation: loading-enter 0.9s cubic-bezier(0.16, 1, 0.3, 1)
      calc(var(--loading-show-after, 0ms) + 0.1s) backwards;
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
    font-size: clamp(3rem, 35cqw + 1rem, 18rem);
    line-height: 0.8;

    /* Equal-width digits - the counter doesn't jitter as it ticks */
    font-variant-numeric: tabular-nums;
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

  @keyframes loading-show {
    from {
      visibility: hidden;
      opacity: 0;
    }
  }

  @keyframes loading-enter {
    from {
      transform: translateY(0.75rem);
      opacity: 0;
    }
  }

  /* Exit: the count lifts away first, then the screen fades to reveal the page */
  .loading-screen-leave-active {
    transition: opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1) 0.2s;
  }

  .loading-screen-leave-to {
    opacity: 0;
  }

  .loading-screen-leave-active .loading-content,
  .loading-screen-leave-active .loading-bar {
    transition:
      opacity 0.4s ease-in,
      transform 0.5s cubic-bezier(0.7, 0, 0.84, 0);
  }

  .loading-screen-leave-to .loading-content {
    transform: translateY(-1.5rem);
    opacity: 0;
  }

  .loading-screen-leave-to .loading-bar {
    opacity: 0;
  }

  /* No screen under reduced motion - the plugin ends loading on mount (finishNow) */
  @media (prefers-reduced-motion: reduce) {
    .loading-screen {
      display: none;
    }
  }
</style>
