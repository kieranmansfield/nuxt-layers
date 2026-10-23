import type { ContentLayerConfig } from '../types/content'

/** 404s the current route when `contentLayer.sections.<section>` is switched off in app.config. */
export function useContentSection(section: keyof NonNullable<ContentLayerConfig['sections']>) {
  const contentLayer = useAppConfig().contentLayer as ContentLayerConfig | undefined
  if (contentLayer?.sections?.[section] === false) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
}
