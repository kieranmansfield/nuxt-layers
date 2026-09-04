import type { GridPreset } from './types/tracks'

const SWISS_COLUMNS = Array.from({ length: 18 }, () => ({ size: 1 }))

export default defineAppConfig({
  gridLayer: {
    presets: {
      swiss: {
        name: 'swiss',
        columns: SWISS_COLUMNS,
      },
      editorial: {
        name: 'editorial',
        columns: [
          {
            size: 2,
            lineStart: 'feature-start',
            lineEnd: 'feature-end',
          },
          {
            size: 1,
            lineStart: 'aside-start',
            lineEnd: 'aside-end',
          },
        ],
      },
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    gridLayer?: {
      presets?: Record<string, GridPreset>
    }
  }
}
