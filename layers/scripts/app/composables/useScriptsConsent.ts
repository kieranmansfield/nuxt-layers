export function useScriptsConsent() {
  const { scriptsLayer } = useAppConfig()
  const storageKey = scriptsLayer?.consent?.storageKey ?? 'scripts-consent'

  const hasConsent = useState<boolean>(`scripts:consent`, () => {
    if (!import.meta.client) return !scriptsLayer?.consent?.required
    return localStorage.getItem(storageKey) === 'true'
  })

  function grantConsent() {
    hasConsent.value = true
    if (import.meta.client) localStorage.setItem(storageKey, 'true')
  }

  function revokeConsent() {
    hasConsent.value = false
    if (import.meta.client) localStorage.removeItem(storageKey)
  }

  const consentRequired = computed(() => scriptsLayer?.consent?.required ?? false)

  return { hasConsent, consentRequired, grantConsent, revokeConsent }
}
