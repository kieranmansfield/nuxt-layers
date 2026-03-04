export type GradientColorSlot = 'primary' | 'secondary' | 'info' | 'white' | 'black' | 'transparent'
export type GradientDirection =
  | 'to-t'
  | 'to-tr'
  | 'to-r'
  | 'to-br'
  | 'to-b'
  | 'to-bl'
  | 'to-l'
  | 'to-tl'
export type GradientShape = 'linear' | 'radial' | 'conic'
export type GradientOpacity = 0 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 100
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

export interface GradientStop {
  color: GradientColorSlot
  shade?: ColorShade
  opacity?: GradientOpacity
}

export interface GradientConfig {
  shape?: GradientShape
  direction?: GradientDirection
  from: GradientStop
  via?: GradientStop
  to: GradientStop
}
