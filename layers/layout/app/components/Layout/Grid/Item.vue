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

const style = computed(() => {
  const styles: Record<string, string> = {}

  // Grid placement - use computed merged values
  const colStartVal = getDefaultValue(colStart.value, undefined)
  const colSpanVal = getDefaultValue(colSpan.value, 1)
  const rowStartVal = getDefaultValue(rowStart.value, undefined)
  const rowSpanVal = getDefaultValue(rowSpan.value, 1)

  if (bleed) {
    // Bleed overrides column positioning
    if (bleed === 'both') {
      styles.gridColumn = '1 / -1'
    } else if (bleed === 'left') {
      styles.gridColumn = `1 / span ${colSpanVal}`
    } else if (bleed === 'right') {
      styles.gridColumn = `${colStartVal ?? 'auto'} / -1`
    }
  } else {
    styles.gridColumn = `${colStartVal ?? 'auto'} / span ${colSpanVal}`
  }

  styles.gridRow = `${rowStartVal ?? 'auto'} / span ${rowSpanVal}`

  // Content alignment - make this element a grid container to center its children
  if (align || justify) {
    styles.display = 'grid'
    styles.width = '100%'
    styles.height = '100%'
    // Use place-items to control how children fill the cell
    // align controls vertical, justify controls horizontal
    styles.placeItems = `${align ?? 'stretch'} ${justify ?? 'stretch'}`
  }

  // Z-index
  const zIndex = z ?? (layer ? layerZIndex[layer] : undefined)
  if (zIndex !== undefined) styles.zIndex = String(zIndex)

  return styles
})

const getResponsiveClasses = <T,>(
  value: T | ResponsiveValue<T> | undefined,
  classGenerator: (val: T) => string
): string[] => {
  if (value === undefined) return []
  if (typeof value === 'object' && value !== null && 'default' in value) {
    const classes: string[] = []
    if (value.md !== undefined) classes.push(`md:${classGenerator(value.md)}`)
    if (value.lg !== undefined) classes.push(`lg:${classGenerator(value.lg)}`)
    return classes
  }
  return []
}

const classes = computed(() => {
  const classList: string[] = ['@container', '@container/item']

  // Responsive column start - use merged values
  classList.push(...getResponsiveClasses(colStart.value, (val) => `col-start-${val}`))

  // Responsive column span
  classList.push(...getResponsiveClasses(colSpan.value, (val) => `col-span-${val}`))

  // Responsive row start
  classList.push(...getResponsiveClasses(rowStart.value, (val) => `row-start-${val}`))

  // Responsive row span
  classList.push(...getResponsiveClasses(rowSpan.value, (val) => `row-span-${val}`))

  // Aspect ratio
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
