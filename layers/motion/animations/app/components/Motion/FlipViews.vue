<script setup lang="ts">
  /**
   * MotionFlipViews - Switches between views, morphing elements that share a `data-flip-id`
   *
   * Tagged elements travel to their match and crossfade with it. Tagged elements with no match,
   * and everything untagged, fade. Views with no tags at all simply crossfade. Targets can't be
   * `display: inline`, and tagged text should fit its content (`w-fit`), or a size difference
   * between views stretches it mid-flight. Keep the control that changes `view` outside the views:
   * the old view goes inert, so focus inside it would be lost.
   *
   * @prop {string} view - Name of the slot to show (falls back to the default slot)
   * @prop {FlipVars} flip - `Flip.from` vars, over the defaults (duration, stagger, fade, ...)
   *
   * @emits play - Master timeline and both view elements, to add your own animation to the switch
   *
   * @slot <view> - One slot per view
   * @slot default - Used when there is no slot named `view`, e.g. for `<component :is>`
   *
   * @example
   * <MotionFlipViews :view="view" :flip="{ stagger: 0.02 }">
   *   <template #cards><img :data-flip-id="`${id}:media`" /></template>
   *   <template #list><img :data-flip-id="`${id}:media`" class="size-8" /></template>
   * </MotionFlipViews>
   */
  import type { FlipTimeline, FlipVars } from '../../composables/useFlip'

  const { view, flip = undefined } = defineProps<{
    view: string
    flip?: FlipVars
  }>()

  const emit = defineEmits<{
    play: [timeline: FlipTimeline, views: { from: HTMLElement; to: HTMLElement }]
  }>()

  const { gsap } = useGsap()
  const reduced = useReducedMotion()
  const root = useTemplateRef<HTMLElement>('root')
  const { capture, play } = useFlip(root)

  let leaving: { el: HTMLElement; done: () => void } | undefined
  let master: FlipTimeline | undefined

  const settings = computed(() => ({ ...flipDefaults, fade: true, ...flip }))

  function finishLeave() {
    leaving?.done()
    leaving = undefined
  }

  function finishSwitch(done: () => void) {
    finishLeave()
    done()
  }

  // Whatever has no tag and no tagged descendant, so it can fade without fading a morph inside it
  function untagged(el: Element): Element[] {
    return [...el.children].flatMap((child) => {
      if (child.hasAttribute('data-flip-id')) return []
      return child.querySelector('[data-flip-id]') ? untagged(child) : [child]
    })
  }

  function addFades(timeline: FlipTimeline, from: Element, to: Element, duration: number) {
    const half = duration / 2
    const fadeOut = untagged(from)
    const fadeIn = untagged(to)
    if (fadeOut.length) timeline.to(fadeOut, { opacity: 0, duration: half, ease: 'power1.out' }, 0)
    if (fadeIn.length) {
      timeline.fromTo(
        fadeIn,
        { opacity: 0 },
        { opacity: 1, duration: half, ease: 'power1.in', clearProps: 'opacity' },
        half
      )
    }
  }

  // Vue calls this before the new view mounts, so the old layout is still measurable
  function onLeave(el: Element, done: () => void) {
    const box = root.value
    if (reduced.value || !box) return finishSwitch(done)

    const from = el as HTMLElement
    capture(from)
    master?.kill()
    // A view left over from an interrupted switch
    finishLeave()

    // Hold the height first, or pinning collapses the page and clamps its scroll position
    gsap.set(box, { height: box.offsetHeight })
    gsap.set(from, { position: 'absolute', top: 0, left: 0, width: '100%' })
    from.inert = true
    if (!settings.value.fade) gsap.set(from.querySelectorAll('[data-flip-id]'), { autoAlpha: 0 })
    leaving = { el: from, done }
  }

  function onEnter(el: Element, done: () => void) {
    const to = el as HTMLElement
    const box = root.value
    if (!leaving || !box) return finishSwitch(done)

    const from = leaving.el
    const duration = Number(settings.value.duration)
    const { ease } = settings.value
    const height = to.offsetHeight

    master = gsap.timeline({ onComplete: () => finishSwitch(done) })
    const morph = play(to, settings.value)
    if (morph) master.add(morph, 0)
    master.to(box, { height, duration, ease, clearProps: 'height' }, 0)
    addFades(master, from, to, duration)
    emit('play', master, { from, to })
  }

  onBeforeUnmount(() => master?.kill())
</script>

<template>
  <div ref="root" class="relative">
    <Transition :css="false" @leave="onLeave" @enter="onEnter">
      <div :key="view" :data-view="view">
        <slot :name="view"><slot /></slot>
      </div>
    </Transition>
  </div>
</template>
