import { computed, toValue, type ComputedRef, type CSSProperties, type MaybeRefOrGetter } from 'vue'

import type { Spacing } from '../types/tokens'

export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

// Token-only, not ResponsiveValue: gap and padding scale fluidly with the viewport, and
// align/justify don't need a breakpoint jump in practice (spec §15). v6 accepted
// `{ default, md }` objects here and silently dropped everything but `default`.
// Breakpoint objects belong on structural props (HStack's `collapseBelow`, `snapSpan`).
// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type SpacingAttrsInput = {
  p?: Spacing | undefined
  px?: Spacing | undefined
  py?: Spacing | undefined
  m?: Spacing | undefined
  mx?: Spacing | undefined
  my?: Spacing | undefined
}

export type FlexAttrsInput = {
  gap?: Spacing | undefined
  align?: Align | undefined
  justify?: Justify | undefined
}

export type LayoutAttrsInput = SpacingAttrsInput & FlexAttrsInput

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

export function spacingVar(token: Spacing): string {
  return token === 'none' ? '0px' : `var(--space-${token})`
}

function applySpacing(
  result: CSSProperties,
  cssProp:
    | 'gap'
    | 'padding'
    | 'paddingInline'
    | 'paddingBlock'
    | 'margin'
    | 'marginInline'
    | 'marginBlock',
  value: Spacing | undefined
): void {
  if (value) result[cssProp] = spacingVar(value)
}

export function resolveLayoutAttrsStyle(input: LayoutAttrsInput): CSSProperties {
  const { gap, align, justify, p, px, py, m, mx, my } = input
  const result: CSSProperties = {}

  applySpacing(result, 'gap', gap)
  applySpacing(result, 'padding', p)
  applySpacing(result, 'paddingInline', px)
  applySpacing(result, 'paddingBlock', py)
  applySpacing(result, 'margin', m)
  applySpacing(result, 'marginInline', mx)
  applySpacing(result, 'marginBlock', my)

  if (align) result.alignItems = ALIGN_MAP[align]
  if (justify) result.justifyContent = JUSTIFY_MAP[justify]

  return result
}

export function useLayoutAttrs(input: MaybeRefOrGetter<LayoutAttrsInput>): {
  style: ComputedRef<CSSProperties>
} {
  return { style: computed(() => resolveLayoutAttrsStyle(toValue(input))) }
}
