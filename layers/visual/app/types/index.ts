export type * from './accent'
export type * from './breakpoints'
export type * from './gradient'
export type * from './media'
// ColorShade is identical in both gradient.ts and tint.ts — omit the duplicate
export type { TintLevel, TintColorSlot, TintConfig } from './tint'
export { TINT_LEVEL_OPACITY } from './tint'
