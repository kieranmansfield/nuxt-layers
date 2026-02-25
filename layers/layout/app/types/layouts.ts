export interface ResponsiveValue<T> {
  default: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export interface GridLayers {
  back: number
  mid: number
  front: number
  top: number
}

export interface GridPresetsItem {
  colStart: number | ResponsiveValue<number>
  colSpan: number | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number
}

export interface GridPresets {
  hero: GridPresetsItem
  centered: GridPresetsItem
  fullWidth: GridPresetsItem
  sidebar: GridPresetsItem
  content: GridPresetsItem
}

export interface GridConfig {
  /** Set to false to disable the Swiss Grid system and fall back to standard Nuxt UI layout */
  enabled?: boolean
  columns: ResponsiveValue<number>
  rowsPerSection: number
  rhythm: string
  layers: GridLayers
  presets: GridPresets
}
