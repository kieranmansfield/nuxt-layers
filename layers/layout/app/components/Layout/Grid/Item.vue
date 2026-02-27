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

interface Props {
  preset?: string
  as?: string
  colStart?: number | ResponsiveValue<number>
  colSpan?: ColSpanValue | ResponsiveValue<number>
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

const { as = 'div' } = props

// Get preset configuration if preset prop is provided
const { getPreset } = useGridConfig()
const presetConfig = computed(() => (props.preset ? getPreset(props.preset) : undefined))

// Merge preset values with explicit props (explicit props take precedence)
const colStart = computed(() => props.colStart ?? presetConfig.value?.colStart)
const colSpan = computed(() => props.colSpan ?? presetConfig.value?.colSpan ?? 'full')
const rowStart = computed(() => props.rowStart ?? presetConfig.value?.rowStart)
const rowSpan = computed(() => props.rowSpan ?? presetConfig.value?.rowSpan ?? 1)

// Preset-aware alignment computed refs
const align = computed(() => props.align ?? presetConfig.value?.align)
const justify = computed(() => props.justify ?? presetConfig.value?.justify)

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
  const colSpanVal = getDefaultValue(colSpan.value as ColSpanValue | ResponsiveValue<number> | undefined, 'full' as ColSpanValue)
  const rowStartVal = getDefaultValue(rowStart.value, undefined)
  const rowSpanVal = getDefaultValue(rowSpan.value, 1)

  if (props.bleed) {
    if (props.bleed === 'both') {
      styles.gridColumn = '1 / -1'
      styles.marginInline = 'calc(-1 * var(--grid-padding))'
    } else if (props.bleed === 'left') {
      const spanNum = typeof colSpanVal === 'number' ? colSpanVal : undefined
      styles.gridColumn = spanNum ? `1 / span ${spanNum}` : '1 / -1'
      styles.marginInlineStart = 'calc(-1 * var(--grid-padding))'
    } else if (props.bleed === 'right') {
      styles.gridColumn = `${colStartVal ?? 'auto'} / -1`
      styles.marginInlineEnd = 'calc(-1 * var(--grid-padding))'
    }
    styles.gridRow = `${rowStartVal ?? 'auto'} / span ${rowSpanVal}`
  } else if (colSpanVal === 'full') {
    // 'full' span: use inline gridColumn directly (no CSS var approach needed)
    styles.gridColumn = `${colStartVal ?? 1} / -1`
    // Still set row vars for responsive row support
    styles['--_rs'] = String(rowStartVal ?? 'auto')
    styles['--_re'] = String(rowSpanVal)

    const mdRowStart = getResponsiveValue(rowStart.value, 'md')
    const lgRowStart = getResponsiveValue(rowStart.value, 'lg')
    const mdRowSpan = getResponsiveValue(rowSpan.value, 'md')
    const lgRowSpan = getResponsiveValue(rowSpan.value, 'lg')

    if (mdRowStart !== undefined) styles['--_md-rs'] = String(mdRowStart)
    if (lgRowStart !== undefined) styles['--_lg-rs'] = String(lgRowStart)
    if (mdRowSpan !== undefined) styles['--_md-re'] = String(mdRowSpan)
    if (lgRowSpan !== undefined) styles['--_lg-re'] = String(lgRowSpan)
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
    const mdColSpan = getResponsiveValue(colSpan.value as ResponsiveValue<number> | undefined, 'md')
    const lgColSpan = getResponsiveValue(colSpan.value as ResponsiveValue<number> | undefined, 'lg')
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
  if (align.value || justify.value) {
    styles.display = 'grid'
    styles.width = '100%'
    styles.height = '100%'
    styles.placeItems = `${align.value ?? 'stretch'} ${justify.value ?? 'stretch'}`
  }

  // Z-index
  const zIndex = props.z ?? (props.layer ? layerZIndex[props.layer] : undefined)
  if (zIndex !== undefined) styles.zIndex = String(zIndex)

  return styles
})

const classes = computed(() => {
  const classList: string[] = ['gi-placed', '@container', '@container/item']

  if (props.aspect) {
    classList.push(aspectClasses[props.aspect])
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
