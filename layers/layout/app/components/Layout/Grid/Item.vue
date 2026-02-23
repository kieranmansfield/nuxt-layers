<script setup lang="ts">
/**
 * BaseGridItem - Positions content on the Swiss Grid
 *
 * Places content on the parent section's grid using grid-column and grid-row.
 * Supports responsive values, alignment, layering, bleed, and aspect ratios.
 *
 * @prop {string} as - HTML element to render (default: 'div')
 * @prop {number | ResponsiveValue} colStart - Starting column (1-18)
 * @prop {number | ResponsiveValue} colSpan - Number of columns to span (default: 1)
 * @prop {number | ResponsiveValue} rowStart - Starting row (1-12)
 * @prop {number | ResponsiveValue} rowSpan - Number of rows to span (default: 1)
 * @prop {Alignment} align - Vertical alignment (align-self): start, center, end, stretch
 * @prop {Alignment} justify - Horizontal alignment (justify-self): start, center, end, stretch
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

type Alignment = 'start' | 'center' | 'end' | 'stretch'
type LayerName = 'back' | 'mid' | 'front' | 'top'
type BleedDirection = 'left' | 'right' | 'both'
type AspectRatio = '1/1' | '4/3' | '3/4' | '16/9' | '9/16' | '2/1' | '1/2'

interface ResponsiveValue<T> {
  default: T
  md?: T
  lg?: T
}

interface Props {
  preset?: string
  as?: string
  colStart?: number | ResponsiveValue<number>
  colSpan?: number | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number | ResponsiveValue<number>
  align?: Alignment
  justify?: Alignment
  z?: number
  layer?: LayerName
  bleed?: BleedDirection
  aspect?: AspectRatio
}

const props = defineProps<Props>()

const { as = 'div', preset, align, justify, z, layer, bleed, aspect } = props

// Get preset configuration if preset prop is provided
const { getPreset } = useGridConfig()
const presetConfig = computed(() => (preset ? getPreset(preset) : undefined))

// Merge preset values with explicit props (explicit props take precedence)
const colStart = computed(() => props.colStart ?? presetConfig.value?.colStart)
const colSpan = computed(() => props.colSpan ?? presetConfig.value?.colSpan ?? 1)
const rowStart = computed(() => props.rowStart ?? presetConfig.value?.rowStart)
const rowSpan = computed(() => props.rowSpan ?? presetConfig.value?.rowSpan ?? 1)

const layerZIndex: Record<LayerName, number> = {
  back: 0,
  mid: 10,
  front: 20,
  top: 30,
}

const aspectClasses: Record<AspectRatio, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  '9/16': 'aspect-[9/16]',
  '2/1': 'aspect-[2/1]',
  '1/2': 'aspect-[1/2]',
}

const getDefaultValue = <T,>(value: T | ResponsiveValue<T> | undefined, defaultVal: T): T => {
  if (value === undefined) return defaultVal
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return value.default
  }
  return value as T
}

const getResponsiveValue = <T,>(
  value: T | ResponsiveValue<T> | undefined,
  breakpoint: 'md' | 'lg',
): T | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return value[breakpoint]
  }
  return undefined
}

const style = computed(() => {
  const styles: Record<string, string> = {}

  const colStartVal = getDefaultValue(colStart.value, undefined)
  const colSpanVal = getDefaultValue(colSpan.value, 1)
  const rowStartVal = getDefaultValue(rowStart.value, undefined)
  const rowSpanVal = getDefaultValue(rowSpan.value, 1)

  if (bleed) {
    // Bleed is non-responsive — keep as direct inline style
    if (bleed === 'both') {
      styles.gridColumn = '1 / -1'
    } else if (bleed === 'left') {
      styles.gridColumn = `1 / span ${colSpanVal}`
    } else if (bleed === 'right') {
      styles.gridColumn = `${colStartVal ?? 'auto'} / -1`
    }
    styles.gridRow = `${rowStartVal ?? 'auto'} / span ${rowSpanVal}`
  } else {
    // Set CSS custom properties instead of grid-column/grid-row directly.
    // The <style> block below reads these vars and applies them at each breakpoint,
    // which correctly cascades without inline-style specificity conflicts.
    styles['--_cs'] = String(colStartVal ?? 'auto')
    styles['--_ce'] = String(colSpanVal)
    styles['--_rs'] = String(rowStartVal ?? 'auto')
    styles['--_re'] = String(rowSpanVal)

    const mdColStart = getResponsiveValue(colStart.value, 'md')
    const lgColStart = getResponsiveValue(colStart.value, 'lg')
    const mdColSpan = getResponsiveValue(colSpan.value, 'md')
    const lgColSpan = getResponsiveValue(colSpan.value, 'lg')
    const mdRowStart = getResponsiveValue(rowStart.value, 'md')
    const lgRowStart = getResponsiveValue(rowStart.value, 'lg')
    const mdRowSpan = getResponsiveValue(rowSpan.value, 'md')
    const lgRowSpan = getResponsiveValue(rowSpan.value, 'lg')

    if (mdColStart !== undefined) styles['--_md-cs'] = String(mdColStart)
    if (lgColStart !== undefined) styles['--_lg-cs'] = String(lgColStart)
    if (mdColSpan !== undefined) styles['--_md-ce'] = String(mdColSpan)
    if (lgColSpan !== undefined) styles['--_lg-ce'] = String(lgColSpan)
    if (mdRowStart !== undefined) styles['--_md-rs'] = String(mdRowStart)
    if (lgRowStart !== undefined) styles['--_lg-rs'] = String(lgRowStart)
    if (mdRowSpan !== undefined) styles['--_md-re'] = String(mdRowSpan)
    if (lgRowSpan !== undefined) styles['--_lg-re'] = String(lgRowSpan)
  }

  // Content alignment
  if (align || justify) {
    styles.display = 'grid'
    styles.width = '100%'
    styles.height = '100%'
    styles.placeItems = `${align ?? 'stretch'} ${justify ?? 'stretch'}`
  }

  // Z-index
  const zIndex = z ?? (layer ? layerZIndex[layer] : undefined)
  if (zIndex !== undefined) styles.zIndex = String(zIndex)

  return styles
})

const classes = computed(() => {
  const classList: string[] = ['gi-placed', '@container', '@container/item']

  if (aspect) {
    classList.push(aspectClasses[aspect])
  }

  return classList.join(' ')
})
</script>

<template>
  <component :is="as" :style :class="classes">
    <slot />
  </component>
</template>

<style>
.gi-placed {
  grid-column: var(--_cs, auto) / span var(--_ce, 1);
  grid-row: var(--_rs, auto) / span var(--_re, 1);
}

@media (width >= 48rem) {
  .gi-placed {
    grid-column: var(--_md-cs, var(--_cs, auto)) / span var(--_md-ce, var(--_ce, 1));
    grid-row: var(--_md-rs, var(--_rs, auto)) / span var(--_md-re, var(--_re, 1));
  }
}

@media (width >= 80rem) {
  .gi-placed {
    grid-column: var(--_lg-cs, var(--_md-cs, var(--_cs, auto))) / span var(--_lg-ce, var(--_md-ce, var(--_ce, 1)));
    grid-row: var(--_lg-rs, var(--_md-rs, var(--_rs, auto))) / span var(--_lg-re, var(--_md-re, var(--_re, 1)));
  }
}
</style>
