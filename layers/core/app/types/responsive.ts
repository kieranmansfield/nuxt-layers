/**
 * Canonical `ResponsiveValue<T>` for layers/core and layers/ui.
 *
 * Object shape only — no array shorthand. Distinct from
 * `layers/layout/app/types/layouts.ts`'s own `ResponsiveValue`, which stays
 * as-is (used by GridConfig/GridPresetsItem, not migrated this pass). Do not
 * wildcard-re-export both into one namespace.
 */
export type ResponsiveValue<T> = {
  default: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}
