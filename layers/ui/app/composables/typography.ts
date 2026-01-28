import type {
  FontLeading,
  FontSlant,
  FontTracking,
  FontWeight,
  FontWidth,
  TextAlign,
  TextTransform,
} from '#layers/ui/app/types/typography'
import { computed } from 'vue'

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

  if (typeof value === 'number') {
    return numericFormatter
      ? numericFormatter(value)
      : prefix
        ? `${prefix}-[${value}]`
        : `[${value}]`
  }

  return value ?? fallback
}

export function useTypography(props: {
  weight?: FontWeight
  slant?: FontSlant
  width?: FontWidth
  leading?: FontLeading
  tracking?: FontTracking
  align?: TextAlign
  transform?: TextTransform
}) {
  const classes = computed(() =>
    [
      normalizeAxis(props.weight, {
        prefix: 'font',
        fallback: 'font-normal',
      }),

      normalizeAxis(props.width, {
        prefix: 'font',
      }),

      normalizeAxis(props.slant, {
        fallback: 'not-italic',
      }),

      normalizeAxis(props.leading, {
        prefix: 'leading',
        fallback: 'leading-normal',
      }),

      normalizeAxis(props.tracking, {
        prefix: 'tracking',
        fallback: 'tracking-normal',
      }),

      props.align ? `text-${props.align}` : '',

      props.transform && props.transform !== 'none' ? props.transform : '',
    ]
      .filter(Boolean)
      .join(' ')
  )

  return { classes }
}
