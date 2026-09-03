import { resolveSiteConfig } from '../utils/site'

export function useSite() {
  const config = useAppConfig().site ?? {}
  return resolveSiteConfig(config)
}
