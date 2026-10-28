<script setup lang="ts">
  /**
   * HStack — horizontal, one-dimensional layout (Flexbox row), sized by its content.
   * See nuxt-declarative-layout-system-spec.md §6.
   *
   * Structural props (spec §15), the only ones that take a breakpoint:
   * - `collapseBelow` — becomes a column below that breakpoint.
   * - `snap` — opts into the parent grid's column tracks via subgrid, so the items land on
   *   the page's column lines instead of flowing. `snapSpan` sets how many tracks each item
   *   spans. Spacer, `wrap` and the column gap don't apply while snapped: the tracks and the
   *   parent's gutters take over.
   */
  import { spacingVar, useLayoutAttrs } from '../composables/useLayoutAttrs'
  import type { AsProps, FlexProps, SpacingProps } from '../types/element'
  import type { ResponsiveValue } from '../types/responsive'
  import type { Breakpoint } from '../types/tokens'
  import { responsiveVars } from '../utils/responsiveVars'

  const {
    as = 'div',
    gap = undefined,
    align = undefined,
    justify = undefined,
    wrap = false,
    collapseBelow = undefined,
    snap = false,
    snapSpan = undefined,
    ...spacing
  } = defineProps<
    AsProps &
      FlexProps &
      SpacingProps & {
        wrap?: boolean
        collapseBelow?: Breakpoint
        snap?: boolean
        snapSpan?: number | ResponsiveValue<number>
      }
  >()

  const { style: layoutStyle } = useLayoutAttrs(() => ({
    // A subgrid inherits the parent's column gap; setting `gap` would override it
    ...(snap ? {} : { gap }),
    align,
    justify,
    ...spacing,
  }))

  const style = computed(() => ({
    ...layoutStyle.value,
    ...(snap && gap && { rowGap: spacingVar(gap) }),
    ...(snap && responsiveVars('snap-span', snapSpan)),
  }))

  const root = useTemplateRef<HTMLElement>('root')
  onMounted(() => {
    if (!import.meta.dev || !snap) return
    const parent = root.value?.parentElement
    if (parent && !getComputedStyle(parent).display.includes('grid'))
      // eslint-disable-next-line no-console -- dev-only misuse hint
      console.warn('[core] <HStack snap> needs a grid parent to inherit column tracks from.')
  })
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="h-stack"
    :data-wrap="wrap || undefined"
    :data-collapse-below="collapseBelow"
    :data-snap="snap || undefined"
    :style
  >
    <slot />
  </component>
</template>
