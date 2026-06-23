type ResponsiveValue<T> = {
  default: T
  md?: T
  lg?: T
}

type Alignment = 'start' | 'center' | 'end' | 'stretch'
type LayerName = 'back' | 'mid' | 'front' | 'top'
type BleedDirection = 'left' | 'right' | 'both'
type AspectRatio = '1/1' | '4/3' | '3/4' | '16/9' | '9/16' | '2/1' | '1/2'
type ContainerSize = 'content' | 'wide' | 'fluid' | 'full'
type Density = 'compact' | 'normal' | 'relaxed'

export type GridPlacementInput = {
  colStart?: number | ResponsiveValue<number> | undefined
  colSpan?: number | 'full' | ResponsiveValue<number> | undefined
  rowStart?: number | ResponsiveValue<number> | undefined
  rowSpan?: number | ResponsiveValue<number> | undefined
  align?: Alignment | undefined
  justify?: Alignment | undefined
  container?: ContainerSize | undefined
  gap?: string | undefined
  density?: Density | undefined
  z?: number | undefined
  layer?: LayerName | undefined
  bleed?: BleedDirection | undefined
  aspect?: AspectRatio | undefined
}

type PlacementStyle = Record<string, string>

export const layerZIndex: Record<LayerName, number> = {
  back: 0,
  mid: 10,
  front: 20,
  top: 30,
}

export const aspectClasses: Record<AspectRatio, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  '9/16': 'aspect-[9/16]',
  '2/1': 'aspect-[2/1]',
  '1/2': 'aspect-[1/2]',
}

// fallow-ignore-next-line complexity
export function resolveDefaultPlacement<T>(
  value: T | ResponsiveValue<T> | undefined,
  fallback: T | undefined
): T | undefined {
  if (value === undefined) return fallback
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return value.default
  }
  return value
}

// fallow-ignore-next-line complexity
function resolveResponsivePlacementValue<T>(
  value: T | ResponsiveValue<T> | undefined,
  breakpoint: 'md' | 'lg'
): T | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return value[breakpoint]
  }
  return undefined
}

export function resolveResponsivePlacementVars<T>(
  value: T | ResponsiveValue<T> | undefined,
  prefix: string
): PlacementStyle {
  const styles: PlacementStyle = {}
  const mdValue = resolveResponsivePlacementValue(value, 'md')
  const lgValue = resolveResponsivePlacementValue(value, 'lg')

  if (mdValue !== undefined) styles[`--_md-${prefix}`] = String(mdValue)
  if (lgValue !== undefined) styles[`--_lg-${prefix}`] = String(lgValue)

  return styles
}

// fallow-ignore-next-line complexity
export function resolveBleedStyles(args: {
  bleed?: BleedDirection | undefined
  colStart?: number | undefined
  colSpan?: number | 'full' | undefined
  rowStart?: number | undefined
  rowSpan?: number | undefined
}): PlacementStyle {
  const styles: PlacementStyle = {}
  const { bleed, colStart, colSpan, rowStart, rowSpan } = args

  if (!bleed) return styles

  if (bleed === 'both') {
    styles.gridColumn = '1 / -1'
    styles.marginInline = 'calc(-1 * var(--grid-padding))'
  } else if (bleed === 'left') {
    const spanNum = typeof colSpan === 'number' ? colSpan : undefined
    styles.gridColumn = spanNum ? `1 / span ${spanNum}` : '1 / -1'
    styles.marginInlineStart = 'calc(-1 * var(--grid-padding))'
  } else if (bleed === 'right') {
    styles.gridColumn = `${colStart ?? 'auto'} / -1`
    styles.marginInlineEnd = 'calc(-1 * var(--grid-padding))'
  }

  styles.gridRow = `${rowStart ?? 'auto'} / span ${rowSpan}`
  return styles
}

// fallow-ignore-next-line complexity
export function resolveAlignmentStyles(align?: Alignment, justify?: Alignment): PlacementStyle {
  if (!align && !justify) return {}
  return {
    display: 'grid',
    width: '100%',
    height: '100%',
    placeItems: `${align ?? 'stretch'} ${justify ?? 'stretch'}`,
  }
}

export function resolveRhythmStyles(density?: Density): PlacementStyle {
  if (!density) return {}

  const rhythmMap: Record<Density, string> = {
    compact: '0.125rem',
    normal: '0.25rem',
    relaxed: '0.5rem',
  }

  return { '--rhythm': rhythmMap[density] }
}

export function resolveLayerStyles(z?: number, layer?: LayerName): PlacementStyle {
  const zIndex = z ?? (layer ? layerZIndex[layer] : undefined)
  return zIndex !== undefined ? { zIndex: String(zIndex) } : {}
}

// fallow-ignore-next-line complexity
export function buildGridPlacementStyle(input: GridPlacementInput): PlacementStyle {
  const style: PlacementStyle = {}
  const colStart = resolveDefaultPlacement(input.colStart, undefined)
  const colSpan = resolveDefaultPlacement(input.colSpan, 'full')
  const rowStart = resolveDefaultPlacement(input.rowStart, undefined)
  const rowSpan = resolveDefaultPlacement(input.rowSpan, 1)

  Object.assign(style, resolveBleedStyles({
    bleed: input.bleed,
    colStart,
    colSpan,
    rowStart,
    rowSpan,
  }))

  if (!input.bleed) {
    if (colSpan === 'full') {
      style.gridColumn = `${colStart ?? 1} / -1`
      style['--_rs'] = String(rowStart ?? 'auto')
      style['--_re'] = String(rowSpan)
      Object.assign(style, resolveResponsivePlacementVars(input.rowStart, 'rs'))
      Object.assign(style, resolveResponsivePlacementVars(input.rowSpan, 're'))
      return style
    }

    style['--_cs'] = String(colStart ?? 'auto')
    style['--_ce'] = String(colSpan)
    style['--_rs'] = String(rowStart ?? 'auto')
    style['--_re'] = String(rowSpan)
    Object.assign(style, resolveResponsivePlacementVars(input.colStart, 'cs'))
    Object.assign(style, resolveResponsivePlacementVars(input.colSpan, 'ce'))
    Object.assign(style, resolveResponsivePlacementVars(input.rowStart, 'rs'))
    Object.assign(style, resolveResponsivePlacementVars(input.rowSpan, 're'))
  }

  Object.assign(style, resolveAlignmentStyles(input.align, input.justify))
  Object.assign(style, resolveRhythmStyles(input.density))
  Object.assign(style, resolveLayerStyles(input.z, input.layer))

  if (input.gap) style['--grid-gap'] = input.gap

  return style
}

export function buildGridPlacementClasses(input: Pick<GridPlacementInput, 'aspect' | 'container'>) {
  const classList: string[] = ['gi-placed', '@container', '@container/item']

  if (input.aspect) classList.push(aspectClasses[input.aspect])
  if (input.container) classList.push(`layout-container-${input.container}`)

  return classList.join(' ')
}
