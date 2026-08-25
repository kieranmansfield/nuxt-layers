import { toValue, type MaybeRefOrGetter } from 'vue'

import type {
  FluidFontSize,
  FontLeading,
  FontSize,
  FontSlant,
  FontTracking,
  FontWeight,
  FontWidth,
  TextAlign,
  TextTransform,
} from '../types/typography'

type AxisValue = string | number | undefined

function normalizeAxis(
  value: AxisValue,
  options: {
    prefix?: string
    fallback?: string
    numericFormatter?: (value: number) => string
  } = {}
) {
  const { prefix = '', fallback = '', numericFormatter } = options

  return typeof value === 'number'
    ? (numericFormatter?.(value) ?? (prefix ? `${prefix}-[${value}]` : `[${value}]`))
    : (value ?? fallback)
}

function getSizeClass(size: FontSize | undefined): string {
  if (!size) return ''
  return typeof size === 'number' ? `text-[${size}]` : `text-${size}`
}

// Literal map, not template-literal interpolation — Tailwind's content scanner
// looks for complete class-name strings in source, so `text-fluid-${x}` is
// invisible to it and silently drops the utility.
const FLUID_SIZE_CLASSES: Record<FluidFontSize, string> = {
  xs: 'text-fluid-xs',
  sm: 'text-fluid-sm',
  md: 'text-fluid-md',
  lg: 'text-fluid-lg',
  xl: 'text-fluid-xl',
  '2xl': 'text-fluid-2xl',
  '3xl': 'text-fluid-3xl',
  '4xl': 'text-fluid-4xl',
  '5xl': 'text-fluid-5xl',
  '6xl': 'text-fluid-6xl',
  '7xl': 'text-fluid-7xl',
  '8xl': 'text-fluid-8xl',
  '9xl': 'text-fluid-9xl',
  'xs-cq': 'text-fluid-xs-cq',
  'sm-cq': 'text-fluid-sm-cq',
  'md-cq': 'text-fluid-md-cq',
  'lg-cq': 'text-fluid-lg-cq',
  'xl-cq': 'text-fluid-xl-cq',
  '2xl-cq': 'text-fluid-2xl-cq',
  '3xl-cq': 'text-fluid-3xl-cq',
  '4xl-cq': 'text-fluid-4xl-cq',
  '5xl-cq': 'text-fluid-5xl-cq',
  '6xl-cq': 'text-fluid-6xl-cq',
  '7xl-cq': 'text-fluid-7xl-cq',
  '8xl-cq': 'text-fluid-8xl-cq',
  '9xl-cq': 'text-fluid-9xl-cq',
}

function getFluidSizeClass(fluidSize: FluidFontSize | undefined): string {
  return fluidSize ? FLUID_SIZE_CLASSES[fluidSize] : ''
}

export function useTypography(
  props: MaybeRefOrGetter<{
    weight?: FontWeight
    slant?: FontSlant
    width?: FontWidth
    leading?: FontLeading
    tracking?: FontTracking
    align?: TextAlign
    transform?: TextTransform
    size?: FontSize
    fluidSize?: FluidFontSize
  }>
) {
  const classes = computed(() => {
    const p = toValue(props)
    return [
      normalizeAxis(p.weight, {
        prefix: 'font',
        fallback: 'font-normal',
      }),

      normalizeAxis(p.width, {
        numericFormatter: (v) => `font-stretch-[${v}%]`,
      }),

      normalizeAxis(p.slant, {
        fallback: 'not-italic',
      }),

      normalizeAxis(p.leading, {
        prefix: 'leading',
        fallback: 'leading-normal',
      }),

      normalizeAxis(p.tracking, {
        prefix: 'tracking',
        fallback: 'tracking-normal',
      }),

      // fluidSize is the parallel, opt-in namespace (see typography.css) — takes
      // precedence over size when both are set, rather than emitting two
      // conflicting font-size utilities.
      p.fluidSize ? getFluidSizeClass(p.fluidSize) : getSizeClass(p.size),

      p.align ? `text-${p.align}` : '',

      p.transform && p.transform !== 'none' ? p.transform : '',
    ]
      .filter(Boolean)
      .join(' ')
  })

  return { classes }
}
