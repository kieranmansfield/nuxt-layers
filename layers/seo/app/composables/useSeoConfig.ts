import { resolveSeoConfig } from '../utils/seoConfig'

export function useSeoConfig() {
  const site = useSiteConfig()
  const { seoLayer } = useAppConfig()
  return resolveSeoConfig(site, seoLayer)
}
