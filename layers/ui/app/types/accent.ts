export type AccentBlobColor = 'primary' | 'secondary' | 'info' | 'white' | 'black' | 'custom'
export type BlobBlur = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number

export interface BlobConfig {
  x: number
  y: number
  size?: string
  blur?: BlobBlur
  opacity?: number
  color?: AccentBlobColor
  shade?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
  customColor?: string
}

export interface AccentSceneConfig {
  blobs: BlobConfig[]
}
