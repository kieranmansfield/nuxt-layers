type AnalyticsProxy = {
  track: (event: string, params?: Record<string, unknown>) => void
  load: () => void
}

function noop(): AnalyticsProxy {
  return { track: () => {}, load: () => {} }
}

export function useAnalytics(): AnalyticsProxy {
  const { scriptsLayer } = useAppConfig()
  const { hasConsent, consentRequired } = useScriptsConsent()

  const provider = scriptsLayer?.analytics?.provider
  const id = scriptsLayer?.analytics?.id

  if (!provider || !id) return noop()

  // Load on Nuxt ready unless consent is required and not yet granted
  const trigger = consentRequired.value
    ? useScriptTriggerConsent({ consent: hasConsent })
    : 'onNuxtReady'

  if (provider === 'ga4') {
    const ga = useScriptGoogleAnalytics({ id, scriptOptions: { trigger } })
    return {
      track: (event, params) => ga.proxy.gtag('event', event, params ?? {}),
      load: () => ga.load(),
    }
  }

  if (provider === 'plausible') {
    const pl = useScriptPlausibleAnalytics({ domain: id, scriptOptions: { trigger } })
    return {
      track: (event, params) => pl.proxy.plausible(event, { props: params ?? {} }),
      load: () => pl.load(),
    }
  }

  if (provider === 'fathom') {
    const fa = useScriptFathomAnalytics({ site: id, scriptOptions: { trigger } })
    return {
      track: (event) => fa.proxy.trackEvent(event, { _value: 0 }),
      load: () => fa.load(),
    }
  }

  return noop()
}
