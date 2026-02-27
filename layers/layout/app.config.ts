export default defineAppConfig({
  /**
   * Nuxt UI component theming — aligned to the Swiss Grid System.
   *
   * UHeader: removes the default max-width container so it spans the full
   * viewport width, using clamp-based gutters that match the grid padding.
   *
   * UPage / UPage* components: participate as subgrid members so their
   * columns align to the inherited mastmain grid lines.
   *
   * These overrides are additive and safe when the swiss grid is disabled —
   * col-span-full / grid-cols-subgrid have no effect outside a grid context.
   * The consuming app can override any of these via its own app.config.ts.
   */
  ui: {
    header: {
      container: 'max-w-full px-[clamp(1rem,2.5vw,2rem)]',
    },

    // UPage: transparent subgrid participant; left/center/right slots map
    // to named column ranges on the 18-column grid (sidebar 4, content 10,
    // right sidebar 4; all col-start values are explicit to avoid overlap)
    page: {
      root: 'col-span-full grid grid-cols-subgrid',
      left: 'col-span-4',
      center: 'col-start-5 col-span-10',
      right: 'col-start-15 col-span-4',
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
         * - 'fluid'    — Container-query based auto-fit grid
         * - 'disabled' — Falls back to standard UMain > UPage layout
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

          // Centered content column (equal margins both sides)
          // lg: 3 + 12 + 3 = 18 ✓  |  md: 1 + 10 + 1 = 12 ✓
          centered: {
            colStart: { default: 1, md: 2, lg: 4 },
            colSpan: { default: 6, md: 10, lg: 12 },
            rowSpan: 12,
          },

          // Full width (all columns, no bleed)
          fullWidth: { colSpan: 'full' },

          // Narrow prose column (tighter reading width)
          // lg: 4 + 10 + 4 = 18 ✓  |  md: 2 + 8 + 2 = 12 ✓
          prose: {
            colStart: { default: 1, md: 3, lg: 5 },
            colSpan: { default: 6, md: 8, lg: 10 },
          },

          // Wide content (generous width, minimal margins)
          // lg: 1 + 16 + 1 = 18 ✓  |  md: 1 + 10 + 1 = 12 ✓
          wide: {
            colStart: { default: 1, md: 2, lg: 2 },
            colSpan: { default: 6, md: 10, lg: 16 },
          },

          // Sidebar + content pair (use together)
          // sidebar: cols 1-4 (lg) | content: cols 5-18 (14 cols) → 4+14=18 ✓
          sidebar: {
            colStart: { default: 1, md: 1, lg: 1 },
            colSpan: { default: 6, md: 4, lg: 4 },
          },
          content: {
            colStart: { default: 1, md: 5, lg: 5 },
            colSpan: { default: 6, md: 8, lg: 14 },
          },

          // 50/50 vertical splits (stack on mobile)
          // lg: 9+9=18 ✓  |  md: 6+6=12 ✓
          splitLeft: {
            colStart: 1,
            colSpan: { default: 6, md: 6, lg: 9 },
            rowSpan: 12,
          },
          splitRight: {
            colStart: { default: 1, md: 7, lg: 10 },
            colSpan: { default: 6, md: 6, lg: 9 },
            rowSpan: 12,
          },

          // 25/75 vertical splits (stack on mobile)
          // lg: 5+13=18 ✓  |  md: 3+9=12 ✓
          quarterLeft: {
            colStart: 1,
            colSpan: { default: 6, md: 3, lg: 5 },
            rowSpan: 12,
          },
          threeQuarterRight: {
            colStart: { default: 1, md: 4, lg: 6 },
            colSpan: { default: 6, md: 9, lg: 13 },
            rowSpan: 12,
          },

          // 75/25 vertical splits (stack on mobile)
          // lg: 13+5=18 ✓  |  md: 9+3=12 ✓
          threeQuarterLeft: {
            colStart: 1,
            colSpan: { default: 6, md: 9, lg: 13 },
            rowSpan: 12,
          },
          quarterRight: {
            colStart: { default: 1, md: 10, lg: 14 },
            colSpan: { default: 6, md: 3, lg: 5 },
            rowSpan: 12,
          },

          // Horizontal 50/50 stacks (100vw × 50vh each)
          halfTop: { colSpan: 'full', rowStart: 1, rowSpan: 6 },
          halfBottom: { colSpan: 'full', rowStart: 7, rowSpan: 6 },

          // Super centered: full-width, full-height, content perfectly centered
          superCentered: {
            colSpan: 'full',
            rowSpan: 12,
            align: 'center',
            justify: 'center',
          },
        },
      },
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    layoutLayer?: {
      /** Project name */
      name?: string
      ui?: {
        grid?: import('./app/types/layouts').GridConfig
      }
    }
  }
}
