export interface ResponsiveValue<T> {
  default: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export interface GridLayers {
  /** Component/content at rest — z-index 0 */
  back: number
  /** Standard interactive content — z-index 10 */
  mid: number
  /** Elevated content, sticky elements — z-index 20 */
  front: number
  /** Page-level overlays — z-index 30 */
  top: number
  /** Site header / navigation bar — z-index 100 */
  header: number
  /** Dropdown menus, popovers — z-index 200 */
  dropdown: number
  /** Overlay backdrops — z-index 300 */
  overlay: number
  /** Modal dialogs — z-index 400 */
  modal: number
  /** Toast notifications — z-index 500 */
  toast: number
}

export type GridContainerSize = 'content' | 'wide' | 'fluid' | 'full'
export type GridDensity = 'compact' | 'normal' | 'relaxed'
export type GridMode = 'swiss' | 'fluid' | 'disabled'

export interface GridPresetsItem {
  colStart: number | ResponsiveValue<number>
  colSpan: number | ResponsiveValue<number>
  rowStart?: number | ResponsiveValue<number>
  rowSpan?: number
  /** Container size applied to the item's content */
  container?: GridContainerSize
  /** Gap override for this preset */
  gap?: string
  /** Vertical rhythm density for this preset */
  density?: GridDensity
}

export interface GridPresets {
  hero: GridPresetsItem
  centered: GridPresetsItem
  fullWidth: GridPresetsItem
  sidebar: GridPresetsItem
  content: GridPresetsItem
}

export interface GridConfig {
  /**
   * Layout mode.
   * - `'swiss'`    — Swiss Grid System (default)
   * - `'fluid'`    — Container-query based auto-fit grid
   * - `'disabled'` — Falls back to standard Nuxt UI layout
   *
   * Setting `enabled: false` is equivalent to `mode: 'disabled'` (backwards compat).
   */
  mode?: GridMode
  /** @deprecated Use `mode: 'disabled'` instead. Kept for backwards compatibility. */
  enabled?: boolean
  columns: ResponsiveValue<number>
  rowsPerSection: number
  rhythm: string
  layers: GridLayers
  presets: GridPresets
}
