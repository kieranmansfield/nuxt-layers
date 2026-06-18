import { createGtmClient, resolveScriptTrigger, type GtmClient } from '../utils/scriptClients'

export function useGtm(): GtmClient {
  const { scriptsLayer } = useAppConfig()
  const { hasConsent, consentRequired } = useScriptsConsent()

  const gtmConfig = scriptsLayer?.gtm
  if (!gtmConfig?.enabled) {
    return { push: () => {}, load: () => {} }
  }

  const trigger = resolveScriptTrigger(consentRequired, hasConsent)
  return createGtmClient(gtmConfig.id, trigger)
}
