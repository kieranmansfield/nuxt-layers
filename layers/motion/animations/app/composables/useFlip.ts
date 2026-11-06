import type { Flip } from 'gsap/Flip'
import type { MaybeRefOrGetter, WatchSource } from 'vue'

export type FlipVars = NonNullable<Parameters<typeof Flip.from>[1]>
export type FlipTimeline = ReturnType<typeof Flip.from>

export const flipDefaults = {
  duration: 0.6,
  ease: 'power3.inOut',
  scale: true,
  nested: true,
} satisfies FlipVars

export type UseFlipOptions = {
  /** FLIP whenever this changes. Omit to call `capture()` and `play()` yourself. */
  on?: WatchSource
  /** Passed to `Flip.from`, over `flipDefaults`. */
  vars?: MaybeRefOrGetter<FlipVars | undefined>
}

/**
 * Animates `[data-flip-id]` elements under `root` from where they were to where they are now.
 * Elements with the same id match, even when one replaced the other. Targets can't be
 * `display: inline`, because transforms don't apply to them.
 *
 * @example
 * // Same DOM rearranged: sort, filter, a class or breakpoint change
 * useFlip(grid, { on: sortOrder, vars: { stagger: 0.02 } })
 *
 * @example
 * // Anything else
 * const { capture, play } = useFlip(grid)
 * capture()
 * mutateTheDom()
 * play()
 */
export function useFlip(
  root: MaybeRefOrGetter<HTMLElement | null | undefined>,
  { on, vars: baseVars }: UseFlipOptions = {}
) {
  const { gsap, Flip, ScrollTrigger } = useGsap()
  const { locomotiveScroll } = useSmoothScroll()
  const reduced = useReducedMotion()

  let state: ReturnType<typeof Flip.getState> | undefined
  let active: FlipTimeline | undefined

  const targets = (el: Element) => el.querySelectorAll('[data-flip-id]')

  function settle() {
    locomotiveScroll.value?.resize()
    ScrollTrigger.refresh()
  }

  /** Records positions. A flip in flight is recorded where it is, then finished. */
  function capture(el = toValue(root)) {
    // A flip finished early is about to be replaced, so it shouldn't remeasure the page
    active?.eventCallback('onComplete', null)
    state = el && !reduced.value ? Flip.getState(targets(el)) : undefined
    active?.kill()
  }

  // ponytail: every target animates, off-screen included. Filter by viewport past ~200 targets.
  /** Animates from the last `capture()`. Returns undefined if nothing was captured. */
  function play(el = toValue(root), vars?: FlipVars) {
    const from = state
    state = undefined
    if (!el || !from) return

    const merged = { ...flipDefaults, ...toValue(baseVars), ...vars }
    active = Flip.from(from, {
      onEnter: (entering) =>
        gsap.fromTo(
          entering,
          { opacity: 0 },
          { opacity: 1, duration: Number(merged.duration) / 2, clearProps: 'opacity' }
        ),
      ...merged,
      targets: targets(el),
    })
    active.eventCallback('onComplete', settle)
    return active
  }

  if (on) {
    watch(on, () => capture(), { flush: 'pre' })
    watch(on, () => play(), { flush: 'post' })
  }

  onBeforeUnmount(() => active?.kill())

  return { capture, play }
}
