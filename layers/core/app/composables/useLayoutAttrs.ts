import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'

import type { ResponsiveValue } from '../types/responsive'
import type { Spacing } from '../types/tokens'

export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type LayoutAttrsInput = {
  gap?: ResponsiveValue<Spacing> | Spacing | undefined
  align?: ResponsiveValue<Align> | Align | undefined
  justify?: ResponsiveValue<Justify> | Justify | undefined
  p?: ResponsiveValue<Spacing> | Spacing | undefined
  px?: ResponsiveValue<Spacing> | Spacing | undefined
  py?: ResponsiveValue<Spacing> | Spacing | undefined
}

const ALIGN_MAP: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const JUSTIFY_MAP: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

// ponytail: only `default` is resolved — gap/align/justify/p are continuous
// or low-stakes enough that a breakpoint jump isn't a real need yet (see
// spec §15). Add sm/md/lg/xl handling here (CSS custom properties + media
// queries, since this returns inline style) if a primitive actually needs it.
function resolveDefault<T>(value: ResponsiveValue<T> | T | undefined): T | undefined {
  const isResponsiveObject = typeof value === 'object' && value !== null && 'default' in value
  return isResponsiveObject ? (value as ResponsiveValue<T>).default : (value as T | undefined)
}

function spacingVar(token: Spacing): string {
  return token === 'none' ? '0px' : `var(--fluid-space-${token})`
}

function applySpacing(
  result: CSSProperties,
  cssProp: 'gap' | 'padding' | 'paddingInline' | 'paddingBlock',
  value: ResponsiveValue<Spacing> | Spacing | undefined
): void {
  const resolved = resolveDefault(value)
  if (resolved) result[cssProp] = spacingVar(resolved)
}

export function useLayoutAttrs(input: MaybeRefOrGetter<LayoutAttrsInput>): {
  style: ComputedRef<CSSProperties>
} {
  const style = computed((): CSSProperties => {
    const { gap, align, justify, p, px, py } = toValue(input)
    const result: CSSProperties = {}

    applySpacing(result, 'gap', gap)
    applySpacing(result, 'padding', p)
    applySpacing(result, 'paddingInline', px)
    applySpacing(result, 'paddingBlock', py)

    const resolvedAlign = resolveDefault(align)
    if (resolvedAlign) result.alignItems = ALIGN_MAP[resolvedAlign]

    const resolvedJustify = resolveDefault(justify)
    if (resolvedJustify) result.justifyContent = JUSTIFY_MAP[resolvedJustify]

    return result
  })

  return { style }
}
