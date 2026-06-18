import type { SiteConfig } from '#layers/core/app/types/site'

type SeoLayerConfig = {
  ogImage?: {
    component?: string
    props?: Record<string, unknown>
  }
  twitterCard?: string
  schemaOrg?: {
    enabled?: boolean
    identity?: unknown
  }
}

// fallow-ignore-next-line complexity
function resolveOgImageConfig(seoLayer?: SeoLayerConfig) {
  return {
    ogImageComponent: seoLayer?.ogImage?.component ?? 'OgImageBasic',
    ogImageProps: seoLayer?.ogImage?.props ?? {},
  }
}

// fallow-ignore-next-line complexity
function resolveSchemaOrgConfig(seoLayer?: SeoLayerConfig) {
  return {
    schemaOrgEnabled: seoLayer?.schemaOrg?.enabled ?? true,
    identity: seoLayer?.schemaOrg?.identity ?? null,
  }
}

export function resolveSeoConfig(site: SiteConfig, seoLayer?: SeoLayerConfig) {
  return {
    site,
    ...resolveOgImageConfig(seoLayer),
    twitterCard: seoLayer?.twitterCard ?? 'summary_large_image',
    ...resolveSchemaOrgConfig(seoLayer),
  }
}
