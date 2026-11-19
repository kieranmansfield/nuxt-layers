import type { GridConfig } from './types/layouts'

export default defineAppConfig({
  /**
   * Nuxt UI component theming — aligned to the Swiss Grid System.
   *
   * UHeader: removes the default max-width container so it spans the full
   * viewport width, using clamp-based gutters that match the grid padding.
   *
   * UPage / UPage* components: participate as subgrid members so their
   * columns align to the inherited grid-root grid lines.
   *
   * These overrides are additive and safe when the swiss grid is disabled —
   * col-span-full / grid-cols-subgrid have no effect outside a grid context.
   * The consuming app can override any of these via its own app.config.ts.
   */
  ui: {
    header: {
      slots: {
        container: 'max-w-full px-[clamp(1rem,2.5vw,2rem)]',
      },
    },

    // UPage: transparent subgrid participant; left/center/right slots map
    // to named column ranges on the 18-column grid (sidebar 4, content 10,
    // right sidebar 4; all col-start values are explicit to avoid overlap)
    page: {
      slots: {
        root: 'col-span-full grid grid-cols-subgrid',
        left: 'col-span-4',
        center: 'col-start-5 col-span-10',
        right: 'col-start-15 col-span-4',
      },
    },

    // UPageBody: no opinionated padding — the grid and sections own spacing
    pageBody: {
      base: '',
    },

    // UPageGrid: inherits subgrid column lines; gap matches grid gap clamp
    pageGrid: {
      base: 'col-span-full grid grid-cols-subgrid gap-[clamp(0.75rem,1.5vw,1.5rem)]',
    },

    // UPageColumns: inherits subgrid column lines
    pageColumns: {
      base: 'col-span-full grid grid-cols-subgrid',
    },
  },

  layoutLayer: {
    ui: {
      // Swiss Grid System Configuration
      grid: {
        /**
         * Layout mode.
         * - 'swiss'    — Swiss Grid System (default)
         * - 'disabled' — Falls back to standard Nuxt UI layout
         */
        mode: 'swiss',

        /**
         * @deprecated Use mode: 'disabled' instead. Kept for backwards compatibility.
         * When false, acts as mode: 'disabled'.
         */
        enabled: true,

        // Core settings
        columns: { default: 6, md: 12, lg: 18 },
        rowsPerSection: 12,
        rhythm: '0.25rem',

        // Z-index layers
        layers: {
          // Base layers (swiss grid stacking)
          back: 0,
          mid: 10,
          front: 20,
          top: 30,
          // UI stacking layers
          header: 100,
          dropdown: 200,
          overlay: 300,
          modal: 400,
          toast: 500,
        },

        // Preset layouts for common patterns
        presets: {
          // Full-viewport hero: full width, all 12 rows
          hero: { colSpan: 'full', rowSpan: 12 },

          // Full-width content area within the grid's own padding.
          // grid-root already applies padding-inline (clamp-based gutters),
          // so col-start:1 / col-end:-1 is already visually centred.
          centered: {
            colSpan: 'full',
            rowSpan: 12,
          },
        },
      },
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    layoutLayer?: {
      name?: string
      ui?: {
        grid?: GridConfig
      }
    }
  }
}
