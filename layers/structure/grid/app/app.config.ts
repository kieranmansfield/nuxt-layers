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
      sidebar: {
        name: 'sidebar',
        columns: [
          {
            size: 1,
            lineStart: 'sidebar-start',
            lineEnd: 'sidebar-end',
          },
          {
            size: 4,
            lineStart: 'content-start',
            lineEnd: 'content-end',
          },
        ],
      },
      magazine: {
        name: 'magazine',
        columns: [
          {
            size: 2,
            lineStart: 'feature-start',
            lineEnd: 'feature-end',
          },
          {
            size: 3,
            lineStart: 'body-start',
            lineEnd: 'body-end',
          },
          {
            size: 1,
            lineStart: 'aside-start',
            lineEnd: 'aside-end',
          },
        ],
      },
      'holy-grail': {
        name: 'holy-grail',
        columns: [
          {
            size: 1,
            lineStart: 'aside-left-start',
            lineEnd: 'aside-left-end',
          },
          {
            size: 4,
            lineStart: 'main-start',
            lineEnd: 'main-end',
          },
          {
            size: 1,
            lineStart: 'aside-right-start',
            lineEnd: 'aside-right-end',
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
