export default defineAppConfig({
  layoutLayer: {
    ui: {
      // Swiss Grid System Configuration
      grid: {
        // Core settings
        columns: { default: 6, md: 12, lg: 18 },
        rowsPerSection: 12,
        rhythm: '0.25rem',

        // Z-index layers
        layers: {
          back: 0,
          mid: 10,
          front: 20,
          top: 30,
        },

        // Preset layouts for common patterns
        presets: {
          hero: {
            colStart: { default: 1, md: 2, lg: 4 },
            colSpan: { default: 6, md: 10, lg: 12 },
            rowSpan: 12,
          },
          centered: {
            colStart: { default: 1, md: 2, lg: 5 },
            colSpan: { default: 6, md: 10, lg: 10 },
            rowSpan: 12,
          },
          fullWidth: {
            colStart: 1,
            colSpan: { default: 6, md: 12, lg: 18 },
          },
          sidebar: {
            colStart: { default: 1, md: 1, lg: 1 },
            colSpan: { default: 6, md: 4, lg: 4 },
          },
          content: {
            colStart: { default: 1, md: 5, lg: 5 },
            colSpan: { default: 6, md: 8, lg: 14 },
          },

          // 50/50 vertical split (stacks on mobile)
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

          // 25/75 split (stacks on mobile)
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

          // Horizontal 50/50 split (100vw × 50vh each)
          halfTop: {
            colStart: 1,
            colSpan: { default: 6, md: 12, lg: 18 },
            rowStart: 1,
            rowSpan: 6,
          },
          halfBottom: {
            colStart: 1,
            colSpan: { default: 6, md: 12, lg: 18 },
            rowStart: 7,
            rowSpan: 6,
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
