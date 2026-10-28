<script setup lang="ts">
  /**
   * PortfolioStackGrid — a project's tech stack as fanned hands of cards.
   *
   * Cards sit on the layout layer's 6/12/18-column vocabulary via `LayoutGridItem`: each spans
   * more columns than it steps, so neighbours overlap like a held hand, and every row fans around
   * its centre. Hovering (or focusing) a card lifts it out and parts its neighbours. When the
   * grid scrolls into view the cards start gathered in a single deck and are dealt into place.
   *
   * @example
   * <PortfolioStackGrid :items="['Nuxt', 'TypeScript', { name: 'GSAP', url: 'https://gsap.com' }]" />
   */
  import type { PortfolioStackEntry } from '../../types/content'

  const { items = [], title = 'Stack' } = defineProps<{
    /** Bare names or `{ name, icon?, color?, url? }` — see `resolveStackItem` */
    items?: PortfolioStackEntry[]
    /** Heading above the grid; empty string hides it */
    title?: string
  }>()

  const cards = computed(() => items.map(resolveStackItem))

  const placements = computed(() =>
    cards.value.map((_, index) => ({
      default: fanPlacement(index, cards.value.length, STACK_FAN_TRACKS.default),
      md: fanPlacement(index, cards.value.length, STACK_FAN_TRACKS.md),
      lg: fanPlacement(index, cards.value.length, STACK_FAN_TRACKS.lg),
    }))
  )

  // Same switch points as layout's grid (and STACK_FAN_TRACKS) — only needed to know which
  // row a hovered card's neighbours are in; placement itself is pure CSS
  const isMd = useMediaQuery('(min-width: 48rem)')
  const isLg = useMediaQuery('(min-width: 80rem)')
  const breakpoint = computed(() => (isLg.value ? 'lg' : isMd.value ? 'md' : 'default'))

  const active = ref<number | null>(null)

  function fanStyle(index: number) {
    const card = placements.value[index]!
    const lifted = active.value === null ? undefined : placements.value[active.value]
    const spread = lifted ? fanSpread(lifted[breakpoint.value], card[breakpoint.value]) : 0
    return {
      '--fan-r': `${card.default.rotate}deg`,
      '--fan-md-r': `${card.md.rotate}deg`,
      '--fan-lg-r': `${card.lg.rotate}deg`,
      '--fan-y': `${card.default.drop}%`,
      '--fan-md-y': `${card.md.drop}%`,
      '--fan-lg-y': `${card.lg.drop}%`,
      '--fan-spread': `${spread}%`,
    }
  }

  const deck = useTemplateRef<HTMLElement>('deck')
  const { gsap } = useGsap()
  const reduced = useReducedMotion()
  let ctx: ReturnType<typeof gsap.context> | null = null

  onMounted(() => {
    const root = deck.value
    if (!root || reduced.value) return

    ctx = gsap.context(() => {
      const slots = [...root.querySelectorAll<HTMLElement>('[data-stack-slot]')]
      const box = root.getBoundingClientRect()
      const pile = slots.map((slot) => {
        const rect = slot.getBoundingClientRect()
        return {
          x: box.left + box.width / 2 - (rect.left + rect.width / 2),
          y: box.top + box.height / 2 - (rect.top + rect.height / 2),
        }
      })

      // Gather every card into one squared-up deck at the grid's centre…
      gsap.set(slots, {
        x: (i: number) => pile[i]!.x,
        y: (i: number) => pile[i]!.y,
        rotation: (i: number) => ((i * 37) % 9) - 4,
        scale: 0.9,
      })

      // …then deal from the top of it (last in DOM order) once the grid is in view
      gsap.to(slots, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.9,
        ease: 'back.out(1.3)',
        stagger: { each: 0.07, from: 'end' },
        scrollTrigger: { trigger: root, start: 'top 75%', once: true },
      })
    }, root)
  })

  onUnmounted(() => {
    ctx?.revert()
    ctx = null
  })
</script>

<template>
  <div v-if="cards.length" class="space-y-6">
    <h3 v-if="title" class="text-highlighted text-2xl font-semibold tracking-tight">
      {{ title }}
    </h3>
    <ul
      ref="deck"
      class="stack-grid"
      :class="{ 'is-reduced': reduced }"
      :aria-label="title || 'Tech stack'"
      @mouseleave="active = null"
    >
      <LayoutGridItem
        v-for="(card, index) in cards"
        :key="`${index}-${card.name}`"
        as="li"
        data-stack-slot
        :class="{ 'is-active': active === index }"
        :col-start="{
          default: placements[index]!.default.colStart,
          md: placements[index]!.md.colStart,
          lg: placements[index]!.lg.colStart,
        }"
        :col-span="{
          default: placements[index]!.default.colSpan,
          md: placements[index]!.md.colSpan,
          lg: placements[index]!.lg.colSpan,
        }"
        :row-start="{
          default: placements[index]!.default.rowStart,
          md: placements[index]!.md.rowStart,
          lg: placements[index]!.lg.rowStart,
        }"
      >
        <div
          class="stack-fan"
          :style="fanStyle(index)"
          @mouseenter="active = index"
          @focusin="active = index"
          @focusout="active = null"
        >
          <PortfolioStackCard v-bind="card" />
        </div>
      </LayoutGridItem>
    </ul>
  </div>
</template>

<style scoped>
  /* Column counts and breakpoints mirror layout's .grid-root (6 / 12 / 18 at 48rem / 80rem) so
     LayoutGridItem's responsive placement vars line up; the gap is inherited from it when
     rendered inside LayoutMain. */
  .stack-grid {
    --stack-cols: 6;
    --stack-gap: var(--grid-gap, clamp(0.75rem, 1.5vw, 1.5rem));

    display: grid;
    grid-template-columns: repeat(var(--stack-cols), minmax(0, 1fr));
    gap: calc(var(--stack-gap) * 2.5) var(--stack-gap);
    margin: 0;

    /* Inline room for the outermost cards' fan rotation, which otherwise pokes past the edge */
    padding: 2rem max(1.5rem, 5%) 3rem;
    list-style: none;
  }

  .is-active {
    z-index: 20;
  }

  .stack-fan {
    --fan-ease: cubic-bezier(0.34, 1.56, 0.64, 1);

    transform-origin: 50% 100%;
    rotate: var(--fan-r);
    translate: var(--fan-spread, 0%) var(--fan-y);
    transition:
      rotate 0.5s var(--fan-ease),
      translate 0.5s var(--fan-ease),
      scale 0.5s var(--fan-ease);
  }

  @media (width >= 48rem) {
    .stack-grid {
      --stack-cols: 12;
    }

    .stack-fan {
      rotate: var(--fan-md-r);
      translate: var(--fan-spread, 0%) var(--fan-md-y);
    }
  }

  @media (width >= 80rem) {
    .stack-grid {
      --stack-cols: 18;
    }

    .stack-fan {
      rotate: var(--fan-lg-r);
      translate: var(--fan-spread, 0%) var(--fan-lg-y);
    }
  }

  /* Lifted out of the hand: squared up, raised and slightly enlarged */
  .is-active > .stack-fan {
    rotate: 0deg;
    translate: 0 -14%;
    scale: 1.08;
  }

  .is-reduced .stack-fan {
    transition: none;
  }
</style>
