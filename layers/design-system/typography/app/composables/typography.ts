import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import type {
  FontFamily,
  FontLeading,
  FontSize,
  FontSlant,
  FontTracking,
  FontWeight,
  FontWidth,
  TextAlign,
  TextTransform,
  TypeStep,
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
// looks for complete class-name strings in source, so `text-step-${x}` is
// invisible to it and silently drops the utility. Kept in sync with
// typography.css's @utility list by typography.test.ts.
export const TYPE_STEP_CLASSES: Record<TypeStep, string> = {
  sm: 'text-step-sm',
  0: 'text-step-0',
  1: 'text-step-1',
  2: 'text-step-2',
  3: 'text-step-3',
  4: 'text-step-4',
  5: 'text-step-5',
  6: 'text-step-6',
  7: 'text-step-7',
  8: 'text-step-8',
  9: 'text-step-9',
  10: 'text-step-10',
  11: 'text-step-11',
  12: 'text-step-12',
  display: 'text-step-display',
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
    step?: TypeStep
    font?: FontFamily
  }>
) {
  const classes = computed(() => {
    const p = toValue(props)
    return [
      p.font ? `font-${p.font}` : '',

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

      // step is the parallel modular-scale namespace (see typography.css) — takes
      // precedence over size when both are set, rather than emitting two
      // conflicting font-size utilities. Checked against undefined: step 0 is valid.
      p.step !== undefined ? TYPE_STEP_CLASSES[p.step] : getSizeClass(p.size),

      p.align ? `text-${p.align}` : '',

      p.transform && p.transform !== 'none' ? p.transform : '',
    ]
      .filter(Boolean)
      .join(' ')
  })

  return { classes }
}
