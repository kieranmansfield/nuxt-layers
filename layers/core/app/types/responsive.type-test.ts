// fallow-ignore-file unused-file
/**
 * Compile-time-only checks for `ResponsiveValue<T>` (spec §13, §23). Nothing
 * here runs — `pnpm typecheck` is what verifies these `@ts-expect-error`
 * directives still land on a real error. No vitest runner picks this file up.
 */
import type { ResponsiveValue } from './responsive'
import type { Spacing } from './tokens'

const valid: ResponsiveValue<Spacing> = { default: 'md', lg: 'lg' }
const staticOnly: ResponsiveValue<Spacing> = { default: 'sm' }

// @ts-expect-error — array shorthand is rejected; object shape only.
const arrayShorthand: ResponsiveValue<Spacing> = ['sm', 'md']

// @ts-expect-error — an invalid token string is rejected.
const invalidToken: ResponsiveValue<Spacing> = { default: 'huge' }

// @ts-expect-error — `default` is required, not optional.
const missingDefault: ResponsiveValue<Spacing> = { lg: 'md' }

export { arrayShorthand, invalidToken, missingDefault, staticOnly, valid }
