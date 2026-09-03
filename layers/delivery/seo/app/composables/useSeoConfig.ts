import { resolveSeoConfig, type SeoLayerConfig } from '../utils/seoConfig'

export function useSeoConfig() {
  const site = useSiteConfig()
  const appConfig = useAppConfig()
  const seoLayer = appConfig.seoLayer as SeoLayerConfig | undefined
  return resolveSeoConfig(site, seoLayer)
}
