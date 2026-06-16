import type { ColorShade } from './gradient'

export type TintLevel = 'subtle' | 'light' | 'medium' | 'strong' | 'heavy'
export type TintColorSlot =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'white'
  | 'black'

export const TINT_LEVEL_OPACITY: Record<TintLevel, number> = {
  subtle: 5,
  light: 10,
  medium: 20,
  strong: 35,
  heavy: 50,
}

export type TintConfig = {
  color: TintColorSlot
  level: TintLevel
  shade?: ColorShade
}
