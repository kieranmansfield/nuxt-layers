import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import type {
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
    ? numericFormatter?.(value) ?? (prefix ? `${prefix}-[${value}]` : `[${value}]`)
    : value ?? fallback
}

function getSizeClass(size: FontSize | undefined): string {
  if (!size) return ''
  return typeof size === 'number' ? `text-[${size}]` : `text-${size}`
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

      getSizeClass(p.size),

      p.align ? `text-${p.align}` : '',

      p.transform && p.transform !== 'none' ? p.transform : '',
    ]
      .filter(Boolean)
      .join(' ')
  })

  return { classes }
}
