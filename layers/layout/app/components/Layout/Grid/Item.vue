<script setup lang="ts">
  /**
   * BaseGridItem - Positions content on the Swiss Grid
   *
   * Places content on the parent section's grid using grid-column and grid-row.
   * Supports responsive values, alignment, layering, bleed, and aspect ratios.
   *
   * @prop {string} as - HTML element to render (default: 'div')
   * @prop {number | ResponsiveValue} colStart - Starting column (1-18)
   * @prop {ColSpanValue | ResponsiveValue} colSpan - Columns to span (default: 'full')
   * @prop {number | ResponsiveValue} rowStart - Starting row (1-12)
   * @prop {number | ResponsiveValue} rowSpan - Number of rows to span (default: 1)
   * @prop {Alignment} align - Vertical alignment (align-self): start, center, end, stretch
   * @prop {Alignment} justify - Horizontal alignment (justify-self): start, center, end, stretch
   * @prop {string} container - Content width constraint: content (65ch), wide (90rem), fluid, full
   * @prop {string} gap - Override --grid-gap for nested content (e.g. '1rem', '2rem')
   * @prop {string} density - Vertical rhythm: compact (2px), normal (4px), relaxed (8px)
   * @prop {number} z - Explicit z-index value
   * @prop {LayerName} layer - Semantic layer: back, mid, front, top
   * @prop {BleedDirection} bleed - Edge bleed: left, right, both
   * @prop {AspectRatio} aspect - Aspect ratio: 1/1, 4/3, 3/4, 16/9, 9/16, 2/1, 1/2
   *
   * @example
   * <BaseGridItem
   *   :col-start="{ default: 1, md: 2, lg: 3 }"
   *   :col-span="{ default: 6, md: 8, lg: 10 }"
   *   align="center"
   *   justify="start"
   *   layer="front"
   * >
   *   <h1>Content</h1>
   * </BaseGridItem>
   */

  import {
    buildGridPlacementClasses,
    buildGridPlacementStyle,
  } from '#layers/layout/app/utils/gridPlacementStyle'

  type ColSpanValue = number | 'full'
  type Alignment = 'start' | 'center' | 'end' | 'stretch'
  type LayerName = 'back' | 'mid' | 'front' | 'top'
  type BleedDirection = 'left' | 'right' | 'both'
  type AspectRatio = '1/1' | '4/3' | '3/4' | '16/9' | '9/16' | '2/1' | '1/2'

  interface ResponsiveValue<T> {
    default: T
    md?: T
    lg?: T
  }

  type ContainerSize = 'content' | 'wide' | 'fluid' | 'full'
  type Density = 'compact' | 'normal' | 'relaxed'

  interface Props {
    preset?: string
    as?: string
    colStart?: number | ResponsiveValue<number>
    colSpan?: ColSpanValue | ResponsiveValue<number>
    rowStart?: number | ResponsiveValue<number>
    rowSpan?: number | ResponsiveValue<number>
    align?: Alignment
    justify?: Alignment
    container?: ContainerSize
    gap?: string
    density?: Density
    z?: number
    layer?: LayerName
    bleed?: BleedDirection
    aspect?: AspectRatio
  }

  const {
    preset: presetProp = undefined,
    as = 'div',
    colStart: colStartProp = undefined,
    colSpan: colSpanProp = undefined,
    rowStart: rowStartProp = undefined,
    rowSpan: rowSpanProp = undefined,
    align: alignProp = undefined,
    justify: justifyProp = undefined,
    container: containerProp = undefined,
    gap: gapProp = undefined,
    density: densityProp = undefined,
    z = undefined,
    layer = undefined,
    bleed = undefined,
    aspect = undefined,
  } = defineProps<Props>()

  // Get preset configuration if preset prop is provided
  const { getPreset } = useGridConfig()
  const presetConfig = computed(() => (presetProp ? getPreset(presetProp) : undefined))

  // Merge preset values with explicit props (explicit props take precedence)
  const colStart = computed(() => colStartProp ?? presetConfig.value?.colStart)
  const colSpan = computed(() => colSpanProp ?? presetConfig.value?.colSpan ?? 'full')
  const rowStart = computed(() => rowStartProp ?? presetConfig.value?.rowStart)
  const rowSpan = computed(() => rowSpanProp ?? presetConfig.value?.rowSpan ?? 1)

  // Preset-aware alignment computed refs
  const align = computed(() => alignProp ?? presetConfig.value?.align)
  const justify = computed(() => justifyProp ?? presetConfig.value?.justify)
  const container = computed(() => containerProp ?? presetConfig.value?.container)
  const gap = computed(() => gapProp ?? presetConfig.value?.gap)
  const density = computed(() => densityProp ?? presetConfig.value?.density)

  const style = computed(() =>
    buildGridPlacementStyle({
      colStart: colStart.value,
      colSpan: colSpan.value as ColSpanValue | ResponsiveValue<number> | undefined,
      rowStart: rowStart.value,
      rowSpan: rowSpan.value,
      align: align.value,
      justify: justify.value,
      container: container.value,
      gap: gap.value,
      density: density.value,
      z,
      layer,
      bleed,
      aspect,
    })
  )

  const classes = computed(() =>
    buildGridPlacementClasses({
      aspect,
      container: container.value,
    })
  )
</script>

<template>
  <component :is="as" :style :class="classes">
    <slot />
  </component>
</template>

<style>
  /* stylelint-disable custom-property-pattern */
  .gi-placed {
    grid-row: var(--_rs, auto) / span var(--_re, 1);
    grid-column: var(--_cs, auto) / span var(--_ce, 1);
  }

  @media (width >= 48rem) {
    .gi-placed {
      grid-row: var(--_md-rs, var(--_rs, auto)) / span var(--_md-re, var(--_re, 1));
      grid-column: var(--_md-cs, var(--_cs, auto)) / span var(--_md-ce, var(--_ce, 1));
    }
  }

  @media (width >= 80rem) {
    .gi-placed {
      grid-row: var(--_lg-rs, var(--_md-rs, var(--_rs, auto))) / span
        var(--_lg-re, var(--_md-re, var(--_re, 1)));
      grid-column: var(--_lg-cs, var(--_md-cs, var(--_cs, auto))) / span
        var(--_lg-ce, var(--_md-ce, var(--_ce, 1)));
    }
  }
</style>
