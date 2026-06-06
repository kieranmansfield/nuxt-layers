export function useSeoConfig() {
  const site = useSiteConfig()
  const { seoLayer } = useAppConfig()

  return {
    site,
    ogImageComponent: seoLayer?.ogImage?.component ?? 'OgImageBasic',
    ogImageProps: seoLayer?.ogImage?.props ?? {},
    twitterCard: seoLayer?.twitterCard ?? 'summary_large_image',
    schemaOrgEnabled: seoLayer?.schemaOrg?.enabled ?? true,
    identity: seoLayer?.schemaOrg?.identity ?? null,
  }
}
