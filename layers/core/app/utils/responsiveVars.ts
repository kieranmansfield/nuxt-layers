import type { ResponsiveValue } from '../types/responsive'

/**
 * A structural ResponsiveValue → custom properties, one per breakpoint
 * (`--name`, `--name-sm` … `--name-xl`). Inline styles can't hold media queries, so the
 * stylesheet that consumes them switches between the variables per breakpoint
 * (see assets/css/stacks.css). A bare value sets only the base variable.
 */
export function responsiveVars<T extends string | number>(
  name: string,
  value: ResponsiveValue<T> | T | undefined
): Record<string, string> {
  if (value === undefined) return {}
  if (typeof value !== 'object') return { [`--${name}`]: String(value) }
  const vars: Record<string, string> = { [`--${name}`]: String(value.default) }
  for (const bp of ['sm', 'md', 'lg', 'xl'] as const) {
    if (value[bp] !== undefined) vars[`--${name}-${bp}`] = String(value[bp])
  }
  return vars
}
