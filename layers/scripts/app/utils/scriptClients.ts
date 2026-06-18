import type { Ref } from 'vue'

export type ScriptTrigger = ReturnType<typeof useScriptTriggerConsent> | 'onNuxtReady'

export type AnalyticsClient = {
  track: (event: string, params?: Record<string, unknown>) => void
  load: () => void
}

export type GtmClient = {
  push: (data: Record<string, unknown>) => void
  load: () => void
}

export function resolveScriptTrigger(consentRequired: Ref<boolean>, consent: Ref<boolean>) {
  return consentRequired.value ? useScriptTriggerConsent({ consent }) : 'onNuxtReady'
}

function noopAnalyticsClient(): AnalyticsClient {
  return { track: () => {}, load: () => {} }
}

// fallow-ignore-next-line complexity
export function createAnalyticsClient(
  provider: string | null | undefined,
  id: string,
  trigger: ScriptTrigger
): AnalyticsClient {
  if (!provider || !id) return noopAnalyticsClient()

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

  return noopAnalyticsClient()
}

function noopGtmClient(): GtmClient {
  return { push: () => {}, load: () => {} }
}

export function createGtmClient(id: string | undefined, trigger: ScriptTrigger): GtmClient {
  if (!id) return noopGtmClient()

  const gtm = useScriptGoogleTagManager({ id, scriptOptions: { trigger } })
  return {
    push: (data: Record<string, unknown>) => gtm.proxy.dataLayer.push(data),
    load: () => gtm.load(),
  }
}
