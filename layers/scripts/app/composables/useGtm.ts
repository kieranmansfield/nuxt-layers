/* eslint-disable @typescript-eslint/no-unused-vars */
export function useGtm() {
  const { scriptsLayer } = useAppConfig()
  const { hasConsent, consentRequired } = useScriptsConsent()

  const gtmConfig = scriptsLayer?.gtm
  if (!gtmConfig?.enabled || !gtmConfig?.id) {
    return { push: (_data: Record<string, unknown>) => {}, load: () => {} }
  }

  const trigger = computed(() =>
    consentRequired.value && !hasConsent.value ? 'manual' : 'onNuxtReady'
  )

  const gtm = useScriptGoogleTagManager({ id: gtmConfig.id, scriptOptions: { trigger } })

  return {
    push: (data: Record<string, unknown>) => gtm.proxy.dataLayer.push(data),
    load: () => gtm.load(),
  }
}
