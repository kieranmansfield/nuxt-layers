// fallow-ignore-file unused-file

/**
 * Phase 5 semantic colour types (spec §4.3), first real implementation. Not
 * yet consumed by any component prop; wiring them into the theme adapter /
 * component prop types is deferred follow-up work per the Phase 5 plan's
 * stated scope boundary.
 */
import type { ColorUsage, UiColors } from '#types'

/**
 * Semantic colour types (nuxt-declarative-layout-system-spec.md §4.3) — first
 * real implementation anywhere in the repo. Built on the existing `ColorUsage`
 * discriminant + `UiColors` palette rather than a parallel colour system.
 */
type UsageClass<U extends ColorUsage> = `${U}-${UiColors}`

export type BackgroundColor = UsageClass<'bg'>
export type TextColor = UsageClass<'text'>
export type BorderColor = UsageClass<'border'>
