export function useGtm() {
  const { scriptsLayer } = useAppConfig()
  const { hasConsent, consentRequired } = useScriptsConsent()

  const gtmConfig = scriptsLayer?.gtm
  if (!gtmConfig?.enabled || !gtmConfig?.id) {
    return { push: (_data: Record<string, unknown>) => {}, load: () => {} }
  }

  // Load on Nuxt ready unless consent is required and not yet granted
  const trigger = consentRequired.value
    ? useScriptTriggerConsent({ consent: hasConsent })
    : 'onNuxtReady'

  const gtm = useScriptGoogleTagManager({ id: gtmConfig.id, scriptOptions: { trigger } })

  return {
    push: (data: Record<string, unknown>) => gtm.proxy.dataLayer.push(data),
    load: () => gtm.load(),
  }
}
