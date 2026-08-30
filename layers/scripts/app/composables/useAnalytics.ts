import {
  createAnalyticsClient,
  resolveScriptTrigger,
  type AnalyticsClient,
  type ScriptsLayerConfig,
} from '../utils/scriptClients'

export function useAnalytics(): AnalyticsClient {
  const appConfig = useAppConfig()
  const scriptsLayer = appConfig.scriptsLayer as ScriptsLayerConfig | undefined
  const { hasConsent, consentRequired } = useScriptsConsent()

  const provider = scriptsLayer?.analytics?.provider
  const id = scriptsLayer?.analytics?.id
  const trigger = resolveScriptTrigger(consentRequired, hasConsent)

  return createAnalyticsClient(provider, id ?? '', trigger)
}
