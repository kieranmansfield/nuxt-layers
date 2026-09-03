import {
  createGtmClient,
  resolveScriptTrigger,
  type GtmClient,
  type ScriptsLayerConfig,
} from '../utils/scriptClients'

export function useGtm(): GtmClient {
  const appConfig = useAppConfig()
  const scriptsLayer = appConfig.scriptsLayer as ScriptsLayerConfig | undefined
  const { hasConsent, consentRequired } = useScriptsConsent()

  const gtmConfig = scriptsLayer?.gtm
  if (!gtmConfig?.enabled) {
    return { push: () => {}, load: () => {} }
  }

  const trigger = resolveScriptTrigger(consentRequired, hasConsent)
  return createGtmClient(gtmConfig.id, trigger)
}
