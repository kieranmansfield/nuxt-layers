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
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

export const TINT_LEVEL_OPACITY: Record<TintLevel, number> = {
  subtle: 5,
  light: 10,
  medium: 20,
  strong: 35,
  heavy: 50,
}

export interface TintConfig {
  color: TintColorSlot
  level: TintLevel
  shade?: ColorShade
}
