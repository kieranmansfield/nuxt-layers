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

  if (typeof value === 'number') {
    if (numericFormatter) return numericFormatter(value)
    if (prefix) return `${prefix}-[${value}]`
    return `[${value}]`
  }

  return value ?? fallback
}

function getSizeClass(size: FontSize | undefined): string {
  if (!size) return ''
  return typeof size === 'number' ? `text-[${size}]` : `text-${size}`
}

export function useTypography(props: {
  weight?: FontWeight
  slant?: FontSlant
  width?: FontWidth
  leading?: FontLeading
  tracking?: FontTracking
  align?: TextAlign
  transform?: TextTransform
  size?: FontSize
}) {
  const classes = computed(() =>
    [
      normalizeAxis(props.weight, {
        prefix: 'font',
        fallback: 'font-normal',
      }),

      normalizeAxis(props.width, {
        numericFormatter: (v) => `font-stretch-[${v}%]`,
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

      getSizeClass(props.size),

      props.align ? `text-${props.align}` : '',

      props.transform && props.transform !== 'none' ? props.transform : '',
    ]
      .filter(Boolean)
      .join(' ')
  )

  return { classes }
}
