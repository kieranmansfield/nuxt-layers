import {
  createAnalyticsClient,
  resolveScriptTrigger,
  type AnalyticsClient,
} from '../utils/scriptClients'

export function useAnalytics(): AnalyticsClient {
  const { scriptsLayer } = useAppConfig()
  const { hasConsent, consentRequired } = useScriptsConsent()

  const provider = scriptsLayer?.analytics?.provider
  const id = scriptsLayer?.analytics?.id
  const trigger = resolveScriptTrigger(consentRequired, hasConsent)

  return createAnalyticsClient(provider, id ?? '', trigger)
}
